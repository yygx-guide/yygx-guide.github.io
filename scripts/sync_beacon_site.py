"""Publish tracked guide pages and assets to the existing Beacon site."""

import hashlib
import http.client
import json
import mimetypes
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


SLUG = "high-meadow-54"
SITE_URL = f"https://{SLUG}.beacon.host"
SITE_PATH = f"/v1/sites/{SLUG}"
ROOT_SUFFIXES = {".html", ".js", ".css", ".json"}
CONTENT_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".m3u8": "application/vnd.apple.mpegurl",
    ".m4s": "video/iso.segment",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
}


def collect_files(root):
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=root)
    entries = {}
    for name in filter(None, tracked.decode("utf-8").split("\0")):
        relative = Path(name)
        if any(part.startswith(".") for part in relative.parts):
            continue
        if len(relative.parts) == 1:
            if relative.suffix not in ROOT_SUFFIXES or name == "bili-hd-test.html":
                continue
        elif relative.parts[0] != "assets":
            continue

        path = root / relative
        if not path.is_file() or not path.resolve().is_relative_to(root):
            raise RuntimeError(f"Missing or invalid site file: {name}")
        mime = CONTENT_TYPES.get(path.suffix.lower())
        mime = mime or mimetypes.guess_type(name)[0] or "application/octet-stream"
        with path.open("rb") as file:
            digest = hashlib.file_digest(file, "sha256").hexdigest()
        entries[name] = {
            "path": name,
            "size": path.stat().st_size,
            "contentType": mime,
            "hash": f"sha256:{digest}",
        }

    if not {"index.html", "intro.html"} <= entries.keys():
        raise RuntimeError("The guide's two main pages are required.")
    return entries


def api_request(key, method, path, payload=None):
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {"Authorization": f"Bearer {key}", "Accept": "application/json"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    connection = http.client.HTTPSConnection("beacon.host", timeout=40)
    try:
        connection.request(method, path, body, headers)
        response = connection.getresponse()
        if response.status in (401, 403):
            raise RuntimeError(f"Beacon access was denied (HTTP {response.status}). Check BEACON_API_KEY.")
        if not 200 <= response.status < 300:
            raise RuntimeError(f"Beacon {method} {path} returned HTTP {response.status}.")
        return json.load(response)
    except (OSError, http.client.HTTPException, ValueError) as error:
        raise RuntimeError(f"Beacon {method} {path} failed ({type(error).__name__}).") from None
    finally:
        connection.close()


def upload_file(root, entry, destination):
    name = entry["path"]
    url = destination["uploadUrl"]
    if destination.get("uploadMethod") != "put" or urlsplit(url).scheme != "https":
        raise RuntimeError(f"Unsupported Beacon upload for {name}.")
    request = Request(
        url,
        data=(root / name).read_bytes(),
        headers={"Content-Type": entry["contentType"]},
        method="PUT",
    )
    for attempt in range(3):
        try:
            with urlopen(request, timeout=120) as response:
                if response.status not in (200, 201, 204):
                    raise RuntimeError(f"Upload failed for {name} (HTTP {response.status}).")
            return
        except HTTPError as error:
            if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                raise RuntimeError(f"Upload failed for {name} (HTTP {error.code}).") from None
        except (OSError, URLError, http.client.HTTPException) as error:
            if attempt == 2:
                raise RuntimeError(f"Upload failed for {name} ({type(error).__name__}).") from None
        time.sleep(2 ** attempt)


def deploy(root, key):
    entries = collect_files(root)
    record = api_request(key, "GET", SITE_PATH)
    site = record.get("site", record)
    if site.get("url") != SITE_URL or site.get("expiresAt", "missing") is not None:
        raise RuntimeError("The expected permanent Beacon site was not found.")

    plan = api_request(key, "POST", f"{SITE_PATH}/versions", {"files": list(entries.values())})
    version = plan["version"]
    pending = plan["uploads"]["pending"]
    skipped = plan["uploads"]["skipped"]
    returned = [file["path"] for file in pending + skipped]
    if len(returned) != len(entries) or set(returned) != entries.keys():
        raise RuntimeError("Beacon returned an incomplete or unexpected upload plan.")

    print(f"{len(pending)} files to upload, {len(skipped)} reused.", flush=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        uploads = [pool.submit(upload_file, root, entries[file["path"]], file) for file in pending]
        for upload in uploads:
            upload.result()

    finalize = f"{SITE_PATH}/versions/{version['id']}/finalize"
    if version["finalizeUrl"] != finalize:
        raise RuntimeError("Beacon returned an unexpected finalization path.")
    live = api_request(key, "POST", finalize)
    if live["site"]["url"] != SITE_URL or live["version"]["status"] != "live":
        raise RuntimeError("Beacon did not confirm the new live version.")
    print(f"Published {live['version']['id']} at {SITE_URL}.", flush=True)


if __name__ == "__main__":
    key = os.environ.get("BEACON_API_KEY", "").strip()
    if not key:
        sys.exit("Set the BEACON_API_KEY repository secret before deploying.")
    try:
        deploy(Path(__file__).resolve().parents[1], key)
    except (RuntimeError, KeyError, OSError, subprocess.SubprocessError) as error:
        sys.exit(str(error))
