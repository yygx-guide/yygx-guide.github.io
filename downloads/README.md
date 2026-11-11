# 烟雨助手自动下载站

页面地址：https://yygx-guide.github.io/downloads/

- 网页由现有公开仓库的 GitHub Pages 托管；原导航页保持原样。
- 每小时第 17 分钟，由免费标准 ubuntu-latest 运行器执行检查；也可在 Actions 手动运行。
- 安装包按原站 package.json 的 parts 顺序合并，检查大小、文件头及 SHA-256，通过后发布到 GitHub Releases。
- 失败保留原有下载入口，Android / Windows 独立处理，不运行或修改任何安装包。
- 同时检查 download.yanyuhelper.com 与旧入口 download.yyhelper.app，按平台选择较高的 Build，防止旧域名清单停更。
- 网页无需登录即可查看；下载经过 GitHub Releases，仍需以用户实际网络测试为准。
- 不使用付费运行器、第三方云存储、个人访问令牌、自定义域名或备案流程。
- 定时任务可能受 GitHub 调度影响延迟；检查记录会提交到 downloads/data.json，供页面显示。若 Actions 被手动关闭，需要重新启用。

本地验证：`python scripts/yyhelper_mirror.py --verify-only`。

修改页面模板请编辑 downloads/template.html；downloads/index.html 与 data.json 由程序生成。
