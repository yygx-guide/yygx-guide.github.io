"""Verified upstream packages -> GitHub Releases + the existing Pages site.

Python standard library only. Credentials come only from the Actions job's
short-lived GITHUB_TOKEN, never from browser code or repository files.
"""
import argparse
import hashlib
import html
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import time
from datetime import datetime, timezone, timedelta
from urllib.error import HTTPError
from urllib.parse import quote, urlsplit
from urllib.request import Request, HTTPRedirectHandler, build_opener

ORIGIN = "https://download.yyhelper.app"
PLATFORMS = {"android": ("Android", "apk", b"PK"), "windows": ("Windows", "exe", b"MZ")}


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


OPENER = build_opener(NoRedirect)


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def open_source(url):
    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.netloc != "download.yyhelper.app" or parsed.query or parsed.fragment:
        raise ValueError("原站地址不合法")
    return OPENER.open(Request(url, headers={"User-Agent": "YanyuGitHubMirror/1.0", "Cache-Control": "no-cache"}), timeout=60)


def source_json(url):
    last = None
    for attempt in range(3):
        try:
            with open_source(url) as response:
                data = response.read(1024 * 1024 + 1)
                if len(data) > 1024 * 1024:
                    raise ValueError("原站清单过大")
                return json.loads(data)
        except Exception as error:
            last = error
            if attempt < 2:
                time.sleep(2 ** attempt)
    raise last


def validate_package(platform, row, pkg):
    _, extension, _ = PLATFORMS[platform]
    expected_url = f"{ORIGIN}/releases/{platform}/{row.get('build')}/download.html"
    safe = lambda value: isinstance(value, str) and re.fullmatch(r"[A-Za-z0-9_-][A-Za-z0-9._-]{0,180}", value) and ".." not in value
    if (type(row.get("build")) is not int or row["build"] < 1 or row.get("url") != expected_url
            or not isinstance(row.get("version"), str) or not re.fullmatch(r"[A-Za-z0-9._+-]{1,64}", row["version"])
            or pkg.get("platform") != platform or pkg.get("build") != row["build"] or pkg.get("version") != row["version"]
            or type(pkg.get("bytes")) is not int or not 0 < pkg["bytes"] <= 1024 ** 3
            or not isinstance(pkg.get("sha256"), str) or not re.fullmatch(r"[a-f0-9]{64}", pkg["sha256"])
            or not safe(pkg.get("name")) or not pkg["name"].endswith("." + extension)
            or not isinstance(pkg.get("parts"), list) or not 1 <= len(pkg["parts"]) <= 128
            or not all(safe(part) for part in pkg["parts"]) or len(set(pkg["parts"])) != len(pkg["parts"])):
        raise ValueError(f"{platform} 版本清单校验失败")
    return pkg


def download_package(platform, pkg, destination):
    destination = Path(destination)
    temporary = destination.with_suffix(destination.suffix + ".partial")
    last = None
    for attempt in range(3):
        try:
            digest, received, magic = hashlib.sha256(), 0, b""
            with temporary.open("wb") as output:
                for part in pkg["parts"]:
                    url = f"{ORIGIN}/releases/{platform}/{pkg['build']}/{part}"
                    with open_source(url) as response:
                        while chunk := response.read(1024 * 1024):
                            received += len(chunk)
                            if received > pkg["bytes"]:
                                raise ValueError("安装包超过声明大小")
                            magic = (magic + chunk[:2])[:2]
                            output.write(chunk)
                            digest.update(chunk)
            if received != pkg["bytes"]:
                raise ValueError("安装包下载不完整")
            if magic != PLATFORMS[platform][2] or digest.hexdigest() != pkg["sha256"]:
                raise ValueError("安装包文件头或 SHA-256 校验失败")
            temporary.replace(destination)
            return destination
        except Exception as error:
            last = error
            temporary.unlink(missing_ok=True)
            if attempt < 2:
                time.sleep(2 ** attempt)
    raise last


class GitHub:
    def __init__(self, repository, token):
        if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
            raise ValueError("仓库名不合法")
        self.repository, self.token = repository, token
        self.base = f"https://api.github.com/repos/{repository}"

    def request(self, method, path, data=None, file=None):
        url = path if path.startswith("https://") else self.base + path
        if urlsplit(url).hostname not in {"api.github.com", "uploads.github.com"}:
            raise ValueError("拒绝向非 GitHub 主机发送令牌")
        headers = {"Authorization": "Bearer " + self.token, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "YanyuGitHubMirror/1.0"}
        if file:
            headers.update({"Content-Type": "application/octet-stream", "Content-Length": str(Path(file).stat().st_size)})
            body = Path(file).open("rb")
        else:
            body = json.dumps(data, ensure_ascii=False).encode() if data is not None else None
            if body is not None:
                headers["Content-Type"] = "application/json"
        try:
            with OPENER.open(Request(url, data=body, headers=headers, method=method), timeout=120) as response:
                content = response.read()
                return json.loads(content) if content else None
        finally:
            if file:
                body.close()

    def find_release(self, tag):
        try:
            return self.request("GET", "/releases/tags/" + quote(tag, safe=""))
        except HTTPError as error:
            if error.code == 404:
                return None
            raise

    def publish_package(self, platform, row, pkg, workdir):
        tag = f"yyhelper-{platform}-b{pkg['build']}-{pkg['sha256'][:16]}"
        release = self.find_release(tag)
        asset = next((a for a in release.get("assets", []) if a["name"] == pkg["name"]), None) if release else None
        if asset:
            if asset.get("size") != pkg["bytes"] or asset.get("state") != "uploaded" or asset.get("digest") not in (None, "sha256:" + pkg["sha256"]):
                raise ValueError("GitHub 上的同名安装包与原站不符，保留旧版")
        else:
            local = download_package(platform, pkg, Path(workdir) / pkg["name"])
            if not release:
                release = self.request("POST", "/releases", {"tag_name": tag, "name": f"烟雨助手 {PLATFORMS[platform][0]} {pkg['version']} · Build {pkg['build']}", "draft": True, "make_latest": "false", "body": f"从 {ORIGIN}/ 自动同步，未修改安装包。\n\nSHA-256: {pkg['sha256']}\n\n" + str(row.get("notes", ""))[:20000]})
            upload_url = release["upload_url"].split("{")[0] + "?name=" + quote(pkg["name"], safe="")
            asset = self.request("POST", upload_url, file=local)
            if asset.get("size") != pkg["bytes"] or asset.get("digest") not in (None, "sha256:" + pkg["sha256"]):
                raise ValueError("GitHub 上传校验失败")
        if release["draft"]:
            release = self.request("PATCH", f"/releases/{release['id']}", {"draft": False, "make_latest": "false"})
            # Draft assets use a temporary untagged URL. Read the published
            # asset again rather than putting that temporary URL on the page.
            asset = next(a for a in release["assets"] if a["name"] == pkg["name"])
        return asset["browser_download_url"], release["html_url"]

    def publish_page(self, catalog, page):
        # Build on the latest tree each time, preserving every navigation file.
        files = {"downloads/data.json": json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", "downloads/index.html": page}
        for attempt in range(3):
            head = self.request("GET", "/git/ref/heads/main")["object"]["sha"]
            base = self.request("GET", "/git/commits/" + head)["tree"]["sha"]
            tree = self.request("POST", "/git/trees", {"base_tree": base, "tree": [{"path": name, "mode": "100644", "type": "blob", "content": content} for name, content in files.items()]})
            commit = self.request("POST", "/git/commits", {"message": "Update verified app downloads and sync status", "tree": tree["sha"], "parents": [head]})
            try:
                self.request("PATCH", "/git/refs/heads/main", {"sha": commit["sha"], "force": False})
                break
            except HTTPError as error:
                if error.code not in (409, 422) or attempt == 2:
                    raise
        # GITHUB_TOKEN commits do not trigger Pages automatically. Request its
        # branch-based build explicitly; no custom domain/settings changes.
        self.request("POST", "/pages/builds")


def synchronize(previous, github, workdir):
    catalog = json.loads(json.dumps(previous))
    catalog.update({"schema": 1, "checkedAt": now(), "status": "ok", "error": None})
    catalog.setdefault("platforms", {})
    try:
        latest = source_json(ORIGIN + "/releases/latest.json")
        if latest.get("schema") != 1 or latest.get("product") != "yyhelper-pro" or not isinstance(latest.get("platforms"), dict):
            raise ValueError("原站版本清单格式变化")
        for platform in PLATFORMS:
            old = catalog["platforms"].get(platform, {"current": None, "history": []})
            try:
                row = latest["platforms"].get(platform, {})
                if type(row.get("build")) is not int or row["build"] < 1:
                    raise ValueError("原站平台版本信息不完整")
                pkg = validate_package(platform, row, source_json(f"{ORIGIN}/releases/{platform}/{row['build']}/package.json"))
                current = old.get("current")
                if current and current["build"] > pkg["build"]:
                    raise ValueError("原站版本回退，保留现有安装包")
                download_url, release_url = github.publish_package(platform, row, pkg, workdir)
                changed = not current or current["sha256"] != pkg["sha256"] or current["build"] != pkg["build"]
                if changed:
                    history = ([current] + old.get("history", []))[:2] if current else []
                    current = {k: pkg[k] for k in ("version", "build", "name", "bytes", "sha256")}
                    current.update({"downloadUrl": download_url, "releaseUrl": release_url, "sourceUrl": row["url"], "date": str(row.get("date", ""))[:100], "notes": str(row.get("notes", ""))[:20000], "mirroredAt": now()})
                else:
                    history = old.get("history", [])
                    current = {**current, "downloadUrl": download_url, "releaseUrl": release_url}
                catalog["platforms"][platform] = {"current": current, "history": history, "status": "ok", "error": None}
                print(f"{platform}: {'updated' if changed else 'unchanged'} {pkg['version']} ({pkg['bytes']} bytes)")
            except Exception as error:
                catalog["platforms"][platform] = {**old, "status": "error", "error": str(error)}
                catalog["status"] = "error"
                print(f"{platform}: sync failed: {error}", file=sys.stderr)
    except Exception as error:
        catalog.update({"status": "error", "error": str(error)})
    return catalog


def display_time(value):
    if not value:
        return "等待首次同步"
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M")


def render(catalog, template):
    replacements = {"STATUS": "安装包已同步" if catalog.get("status") == "ok" else "同步尚未完成，保留已发布的可用版本", "CHECKED": display_time(catalog.get("checkedAt"))}
    notes = []
    for platform, (label, extension, _) in PLATFORMS.items():
        current = catalog.get("platforms", {}).get(platform, {}).get("current")
        prefix = platform.upper() + "_"
        values = {"VERSION": "待同步", "SIZE": "准备中", "DATE": "—", "SYNCED": "—", "SHA": "", "BUTTON": '<span class="button disabled">等待首次同步</span>', "SOURCE": ORIGIN}
        if current:
            values.update({"VERSION": "v" + current["version"], "SIZE": f"{current['bytes'] / 1048576:.1f} MB", "DATE": current["date"], "SYNCED": display_time(current["mirroredAt"]), "SHA": current["sha256"], "SOURCE": current["sourceUrl"]})
            values["BUTTON"] = '<a class="button" href="' + html.escape(current["downloadUrl"], quote=True) + '">下载 ' + extension.upper() + ' <span>↓</span></a>'
            notes.append('<article class="notes"><h3>' + label + ' <span>v' + html.escape(current["version"]) + '</span></h3><p>' + html.escape(current["notes"] or "原站暂无更新说明。") + '</p></article>')
        for key, value in values.items():
            replacements[prefix + key] = value if key == "BUTTON" else html.escape(str(value), quote=True)
    replacements["NOTES"] = "".join(notes) or "<p>首次同步完成后显示更新说明。</p>"
    return re.sub(r"\{\{([A-Z_]+)\}\}", lambda match: replacements[match[1]], template)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--repository", default=os.environ.get("GITHUB_REPOSITORY", "yygx-guide/yygx-guide.github.io"))
    parser.add_argument("--verify-only", action="store_true")
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="yyhelper-") as workdir:
        if args.verify_only:
            latest = source_json(ORIGIN + "/releases/latest.json")
            for platform in PLATFORMS:
                row = latest["platforms"][platform]
                pkg = validate_package(platform, row, source_json(f"{ORIGIN}/releases/{platform}/{row['build']}/package.json"))
                download_package(platform, pkg, Path(workdir) / pkg["name"])
                print(f"VERIFIED {platform} {pkg['version']} {pkg['bytes']} bytes SHA256={pkg['sha256']}")
            return 0
        token = os.environ.get("GITHUB_TOKEN")
        if not token:
            raise ValueError("缺少 GitHub Actions 自动提供的 GITHUB_TOKEN")
        github = GitHub(args.repository, token)
        if github.request("GET", "").get("private") is not False:
            raise ValueError("此免费方案只在公开仓库运行")
        state = args.root / "downloads/data.json"
        previous = json.loads(state.read_text(encoding="utf-8")) if state.exists() else {"platforms": {}}
        catalog = synchronize(previous, github, workdir)
        page = render(catalog, (args.root / "downloads/template.html").read_text(encoding="utf-8"))
        github.publish_page(catalog, page)
        print("Pages build requested; status:", catalog["status"])
        return 0 if catalog["status"] == "ok" else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print("Mirror failed:", error, file=sys.stderr)
        sys.exit(1)
