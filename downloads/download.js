(() => {
  'use strict';
  const words = {
    simplified: {appName:'烟雨助手',downloadSite:'下载网站',mirrorSite:'镜像网站',intro:'提供 Android 与 Windows 安装包。',guide:'使用指南',care:'护眼',bright:'明亮',statusOk:'已同步',statusError:'检查未完成，现有版本仍可下载',hourly:'每小时检查一次',lastChecked:'最近检查',beijingTime:'（北京时间）',refresh:'刷新状态',refreshing:'正在刷新',refreshFailed:'暂时无法刷新状态，现有下载链接仍可使用。',chooseDevice:'选择设备',platformNote:'按你的设备下载安装包',mobile:'手机端',desktop:'电脑端',apkPackage:'APK 安装包',exePackage:'EXE 安装程序',releaseDate:'发布日期',downloadAPK:'下载 APK',downloadEXE:'下载 EXE',pending:'等待首次同步',originalDownload:'原站下载',fileCheck:'文件校验信息',releaseHistory:'版本更新',recentThree:'最近三个版本',latest:'最新',showHistory:'展开更早更新',hideHistory:'收起历史更新',noNotes:'暂无版本更新记录。',noReleaseNotes:'原站暂无更新说明。',siteInfo:'网站说明',mirrorDescription:'本站为镜像网站，安装包与更新说明均来自原站。',source:'原站来源',alternateSource:'备用原站',syncHistory:'同步记录',footer:'烟雨助手 · 镜像下载',backGuide:'返回使用指南'},
    traditional: {appName:'煙雨助手',downloadSite:'下載網站',mirrorSite:'鏡像網站',intro:'提供 Android 與 Windows 安裝檔。',guide:'使用指南',care:'護眼',bright:'明亮',statusOk:'已同步',statusError:'尚未完成檢查，現有版本仍可下載',hourly:'每小時檢查一次',lastChecked:'最近檢查',beijingTime:'（UTC+8）',refresh:'重新整理',refreshing:'正在更新',refreshFailed:'暫時無法更新狀態，現有下載連結仍可使用。',chooseDevice:'選擇裝置',platformNote:'依你的裝置下載安裝檔',mobile:'行動裝置',desktop:'電腦',apkPackage:'APK 安裝檔',exePackage:'EXE 安裝程式',releaseDate:'發布日期',downloadAPK:'下載 APK',downloadEXE:'下載 EXE',pending:'等待首次同步',originalDownload:'原站下載',fileCheck:'檔案驗證資訊',releaseHistory:'版本更新',recentThree:'最近三個版本',latest:'最新',showHistory:'展開較早的更新',hideHistory:'收合歷史更新',noNotes:'目前尚無版本更新紀錄。',noReleaseNotes:'原站尚未提供更新說明。',siteInfo:'網站說明',mirrorDescription:'本站為鏡像網站，安裝檔與更新說明均來自原站。',source:'原站來源',alternateSource:'備用原站',syncHistory:'同步紀錄',footer:'煙雨助手 · 鏡像下載',backGuide:'返回使用指南'}
  };
  // Interface wording is written for each locale. Known release notes are
  // localized separately; unrecognized future notes retain the source text.
  const traditionalNotes = {
    '修复 iOS 局域网导出解析失败的问题':'修正 iOS 區域網路匯出解析失敗的問題',
    '修复局域网鸿蒙导出':'修正鴻蒙系統的區域網路匯出問題',
    '修复某些功能加载存档显示数据不完整':'修正部分功能載入存檔時，資料顯示不完整的問題',
    '优化已解锁三槽的恒山子弟模拟优化':'改善已解鎖三個槽位的恆山弟子模擬',
    '优化精炼锻造银两显示':'改善精煉、鍛造的銀兩顯示',
    '优化部分功能的使用':'改善部分功能的使用體驗'
  };
  let language = /^(zh[-_](TW|HK|MO))/i.test(navigator.language) ? 'traditional' : 'simplified';
  let theme = 'bright', catalog = null, refreshing = false;
  try { const saved = localStorage.getItem('guanxing-language'); if (saved === 'traditional' || saved === 'simplified') language = saved; theme = localStorage.getItem('yyhelper-download-theme') === 'care' ? 'care' : 'bright'; } catch (_) {}
  const text = key => words[language][key] || key;
  const byId = id => document.getElementById(id);
  function applyLanguage() {
    document.documentElement.lang = language === 'traditional' ? 'zh-TW' : 'zh-CN';
    document.title = text('appName') + ' · ' + text('downloadSite');
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = text(node.dataset.i18n); });
    document.querySelectorAll('[data-note]').forEach(node => { node.textContent = language === 'traditional' ? traditionalNotes[node.dataset.note] || node.dataset.note : node.dataset.note; });
    document.querySelectorAll('[data-lang]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.lang === language)));
    byId('themeButton').innerHTML = (theme === 'care' ? '☀ ' : '☾ ') + text(theme === 'care' ? 'bright' : 'care');
    byId('themeButton').setAttribute('aria-label', language === 'traditional' ? '切換顯示主題' : '切换显示主题');
    document.querySelector('.lang-switch').setAttribute('aria-label', language === 'traditional' ? '語言切換' : '语言切换');
    if (refreshing) byId('refresh-state').textContent = text('refreshing');
  }
  function applyTheme() { document.documentElement.dataset.theme = theme; byId('themeButton').setAttribute('aria-pressed', String(theme === 'care')); document.querySelector('meta[name="theme-color"]').content = theme === 'care' ? '#17191b' : '#ece5d6'; applyLanguage(); }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => { language = button.dataset.lang; try { localStorage.setItem('guanxing-language', language); } catch (_) {} applyLanguage(); }));
  byId('themeButton').addEventListener('click', () => { theme = theme === 'care' ? 'bright' : 'care'; try { localStorage.setItem('yyhelper-download-theme', theme); } catch (_) {} applyTheme(); });
  function element(tag, className, value) { const node = document.createElement(tag); if (className) node.className = className; if (value !== undefined) node.textContent = value; return node; }
  function translated(tag, key, className) { const node = element(tag, className, text(key)); node.dataset.i18n = key; return node; }
  function noteList(notes) { const list = element('ul'); const lines = String(notes || '').split(/\r?\n/).map(line => line.trim().replace(/^[-•]\s*/, '')).filter(Boolean); if (!lines.length) return translated('p', 'noReleaseNotes'); for (const line of lines) { const item = element('li', '', language === 'traditional' ? traditionalNotes[line] || line : line); item.dataset.note = line; list.append(item); } return list; }
  function releaseNode(release, latest) {
    const item = element('li', 'release-entry'), head = element('div', 'release-head'), title = element('div');
    title.append(element('h3', '', 'v' + release.version)); if (latest) title.append(translated('span', 'latest', 'latest-label'));
    head.append(title, element('time', '', String(release.date || '').replaceAll('/', '-'))); item.append(head);
    const body = element('div', 'release-copy'), variants = Object.entries(release.notesByPlatform || {}).filter(([platform, notes]) => ['android', 'windows'].includes(platform) && String(notes).trim());
    if (new Set(variants.map(([, notes]) => String(notes).trim())).size <= 1) body.append(noteList(variants[0]?.[1] || ''));
    else for (const [platform, notes] of variants) { body.append(element('h4', '', platform === 'android' ? 'Android' : 'Windows'), noteList(notes)); }
    item.append(body); return item;
  }
  function getReleases(data) {
    if (Array.isArray(data.releases)) return data.releases;
    const map = new Map();
    for (const platform of ['android', 'windows']) { const state = data.platforms?.[platform]; for (const file of [...(state?.history || []), state?.current]) { if (!file?.version) continue; const release = map.get(file.version) || {version:file.version,build:file.build,date:file.date,notesByPlatform:{}}; release.build = Math.max(release.build || 0, file.build || 0); release.notesByPlatform[platform] = file.notes || ''; map.set(file.version, release); } }
    return [...map.values()].sort((a, b) => b.build - a.build);
  }
  function safeLink(value, source = false) { try { const url = new URL(value); if (url.protocol !== 'https:') return null; const hosts = source ? ['download.yanyuhelper.com', 'download.yyhelper.app'] : ['github.com']; if (!hosts.includes(url.hostname)) return null; return url.href; } catch (_) { return null; } }
  function updateCatalog(data) {
    if (data.schema !== 1 || !data.platforms) throw Error('Invalid catalog');
    catalog = data;
    for (const platform of ['android', 'windows']) {
      const file = data.platforms[platform]?.current, card = document.querySelector(`[data-platform="${platform}"]`); if (!file) continue;
      const link = safeLink(file.downloadUrl); if (!link) continue;
      const put = (key, value) => { card.querySelector(`[data-field="${key}"]`).textContent = value; };
      put('version', 'v' + file.version); put('size', (file.bytes / 1048576).toFixed(1) + ' MB'); put('date', String(file.date || '—').replaceAll('/', '-')); put('build', String(file.build)); put('sha', file.sha256 || '');
      let button = card.querySelector('[data-download]');
      if (!button) { button = element('a', 'download-button main-button'); button.dataset.download = ''; button.append(translated('span', platform === 'android' ? 'downloadAPK' : 'downloadEXE')); card.querySelector('[data-button]').replaceChildren(button); }
      button.href = link; const source = safeLink(file.sourceUrl, true); if (source) card.querySelector('[data-source]').href = source;
    }
    const statusKey = data.status === 'ok' ? 'statusOk' : 'statusError'; byId('sync-status').dataset.i18n = statusKey; document.querySelector('.sync-line').dataset.status = data.status;
    if (data.checkedAt) { const checked = new Date(data.checkedAt); if (Number.isFinite(checked.getTime())) { byId('checked-time').textContent = checked.toLocaleString('sv-SE', { timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit' }); byId('checked-time').dateTime = data.checkedAt; } }
    const releases = getReleases(data); byId('recent-releases').replaceChildren(...releases.slice(0, 3).map((item, i) => releaseNode(item, i === 0)));
    if (!releases.length) byId('recent-releases').append(translated('li', 'noNotes', 'empty-notes'));
    byId('older-releases').replaceChildren(...releases.slice(3).map(item => releaseNode(item, false))); byId('history-disclosure').hidden = releases.length <= 3; byId('older-count').textContent = Math.max(0, releases.length - 3);
    applyLanguage();
  }
  async function refresh() {
    if (refreshing) return; refreshing = true; byId('refresh-state').disabled = true; applyLanguage();
    try { const response = await fetch('data.json?t=' + Date.now(), {cache:'no-store',signal:AbortSignal.timeout(15000)}); if (!response.ok) throw Error('Unavailable'); updateCatalog(await response.json()); byId('refresh-message').hidden = true; }
    catch (_) { const message = byId('refresh-message'); message.dataset.i18n = 'refreshFailed'; message.textContent = text('refreshFailed'); message.hidden = false; }
    finally { refreshing = false; byId('refresh-state').disabled = false; applyLanguage(); }
  }
  byId('refresh-state').addEventListener('click', refresh);
  applyTheme(); refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, 300000);
})();
