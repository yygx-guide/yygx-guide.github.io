(() => {
  'use strict';
  const cfg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG) || {};
  const byId = id => document.getElementById(id);
  let refreshLang = () => {}; // 简繁切换初始化后由此刷新动态内容
  const valid = value => typeof value === 'string' && /^https?:\/\//i.test(value.trim()) ? value.trim() : '';
  const fullGuide = valid(cfg.fullGuideUrl);
  const intro = valid(cfg.introUrl) || fullGuide;
  const setHref = (id,url) => { const el=byId(id);if(el){el.href=url||'#';el.dataset.empty=url?'false':'true';} };
  const appDownloadUrl = valid(cfg.appDownloadUrl);
  setHref('appDownloadLink',appDownloadUrl);
  setHref('noticeIntroLink',intro);
  setHref('featureIntroLink',intro);
  setHref('trialLink',valid(cfg.trialUrl)||intro);
  setHref('licenseGuideLink',valid(cfg.licenseGuideUrl) || fullGuide);
  setHref('purchaseLink',valid(cfg.storeUrl));
  setHref('manualTutorialLink',valid(cfg.manualUrl));
  // QQ / 内部 TG 只展示入群条件；公开 TG 群可直达。
  setHref('tgCommunityLink',valid(cfg.telegramUrl));
  setHref('communityStoreLink',valid(cfg.storeUrl));
  setHref('faqMore',valid(cfg.faqUrl) || fullGuide);
  ['android', 'ios', 'harmony'].forEach(key => setHref(key + 'TutorialLink', valid(cfg.tutorialUrls?.[key]) || fullGuide));
  const appDownloadLink = byId('appDownloadLink');
  const copyDownloadLink = byId('copyDownloadLink');
  const downloadHint = byId('downloadHint');
  const downloadUrlFallback = byId('downloadUrlFallback');
  if (!appDownloadUrl) {
    appDownloadLink.classList.add('is-disabled');
    appDownloadLink.setAttribute('aria-disabled','true');
    appDownloadLink.textContent = '下载地址待设置';
    copyDownloadLink.disabled = true;
    downloadHint.textContent = '下载链接尚未设置，请稍后再试。';
  }
  copyDownloadLink?.addEventListener('click', async () => {
    if (!appDownloadUrl) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(appDownloadUrl);
      downloadHint.textContent = '下载链接已复制，请粘贴到浏览器地址栏打开。';
      downloadUrlFallback.hidden = true;
    } catch (_) {
      downloadHint.textContent = '浏览器未允许自动复制，请手动复制下方链接。';
      downloadUrlFallback.textContent = appDownloadUrl;
      downloadUrlFallback.hidden = false;
    }
    refreshLang();
  });
  // 购买暂停不影响浏览店铺：店铺链接始终可访问（仅限真实有效的 URL）。
  const salesPaused = cfg.salesPaused !== false;
  const putText = (id, value) => { const el=byId(id); if(el) el.textContent=value; };
  putText('heroSalesStatus', typeof cfg.homepageNotice === 'string' ? cfg.homepageNotice : '使用教程与相关说明持续更新');
  putText('communitySalesNote', salesPaused ? '目前暂停新授权购买及预订' : '店铺获取方式与活动请以最新公告为准');
  const purchaseLink = byId('purchaseLink');
  const purchaseBadge = byId('purchaseBadge');
  const hasStore = Boolean(valid(cfg.storeUrl));
  if (purchaseLink) {
    putText('purchaseTitle', '闲鱼店铺');
    if (!hasStore) {
      putText('purchaseSubtitle', '店铺链接待设置');
      putText('licenseStateNotice', '店铺暂时无法跳转，可先查看授权说明。');
      if (purchaseBadge) { purchaseBadge.textContent = '待设置'; purchaseBadge.hidden = false; }
    } else if (salesPaused) {
      // 有有效店铺链接且暂停购买时，保留 index.html 中用户自行编辑的说明文字。
      // 不再用脚本覆盖 purchaseSubtitle / licenseStateNotice。
      if (purchaseBadge) { purchaseBadge.textContent = '暂停购买'; purchaseBadge.hidden = false; }
    } else {
      putText('purchaseSubtitle', '前往店铺，查看当前获取方式');
      putText('licenseStateNotice', '购买前请确认授权规则和系统适配情况。');
      if (purchaseBadge) purchaseBadge.hidden = true;
    }
  }
  const modalNames = ['noticeModal','featureModal','licenseModal','exportModal','qqCommunityModal','internalCommunityModal','downloadModal'];
  const openModal = id => { refreshLang(); const dialog=byId(id);if(dialog&&typeof dialog.showModal==='function')dialog.showModal(); };
  document.querySelectorAll('[data-modal]').forEach(el => el.addEventListener('click',() => openModal(el.dataset.modal)));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>dialog.close()));
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  });
  document.querySelectorAll('[data-expand]').forEach(trigger=>trigger.addEventListener('click',()=>{
    const id=trigger.getAttribute('aria-controls');const panel=byId(id);if(!panel)return;
    const opening=panel.hidden;panel.hidden=!opening;trigger.setAttribute('aria-expanded',String(opening));
    trigger.closest('.wide-card').setAttribute('aria-expanded',String(opening));
  }));

  const themeBtn=byId('themeButton');
  const applyTheme=theme=>{
    const care=theme==='care';document.documentElement.dataset.theme=care?'care':'bright';
    themeBtn.textContent=care?'☀ 明亮':'☾ 护眼';themeBtn.setAttribute('aria-label',care?'切换明亮主题':'切换护眼主题');
    themeBtn.setAttribute('aria-pressed',String(care));
    refreshLang();
  };
  applyTheme('bright');
  themeBtn.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='care'?'bright':'care'));

  // 简繁切换：离线转换，既支持现有文案，也支持以后自行修改的大多数中文文本。
  // 不改 HTML 结构，不访问外部翻译接口；偏好仅保存在当前浏览器。
  const trad = typeof GX_TRADITIONAL_MAP !== 'undefined' ? GX_TRADITIONAL_MAP : {phrases:{},chars:{}};
  const sourceNodes = new WeakMap();
  const sourceAttrs = new WeakMap();
  const titleOriginal = document.title;
  let language = 'simplified';
  const toTraditional = value => {
    const result = Object.prototype.hasOwnProperty.call(trad.phrases, value)
      ? trad.phrases[value]
      : Array.from(value, char => trad.chars[char] || char).join('');
    // ICU 通用繁体中的个别大陆用字，调整为更常见的繁体界面用字。
    return result.replace(/游戲/g,'遊戲').replace(/賬號/g,'帳號').replace(/軟件/g,'軟體');
  };
  const convert = source => language === 'traditional' ? toTraditional(source) : source;
  refreshLang = () => {
    document.documentElement.lang = language === 'traditional' ? 'zh-Hant' : 'zh-CN';
    document.title = convert(titleOriginal);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script,style,noscript,.lang-switch')) continue;
      let record = sourceNodes.get(node);
      if (!record || record.display !== node.nodeValue) record = {source:node.nodeValue,display:node.nodeValue};
      const display = convert(record.source);
      if (node.nodeValue !== display) node.nodeValue = display;
      record.display = display;
      sourceNodes.set(node, record);
    }
    document.querySelectorAll('[aria-label],[alt],[title],meta[name="description"]').forEach(el => {
      if (el.closest('.lang-switch')) return;
      const old = sourceAttrs.get(el) || {};
      const updated = {...old};
      for (const name of ['aria-label','alt','title','content']) {
        if (!el.hasAttribute(name) || (name === 'content' && el.tagName !== 'META')) continue;
        const current = el.getAttribute(name);
        const record = old[name]?.display === current ? old[name] : {source:current,display:current};
        const display = convert(record.source);
        if (current !== display) el.setAttribute(name,display);
        updated[name] = {source:record.source,display};
      }
      sourceAttrs.set(el, updated);
    });
    document.querySelectorAll('.lang-option').forEach(button => {
      const active = button.dataset.lang === language;
      button.setAttribute('aria-pressed',String(active));
    });
  };
  try { language = localStorage.getItem('guanxing-language') === 'traditional' ? 'traditional' : 'simplified'; } catch (_) { /* 隐私模式可能禁用存储 */ }
  document.querySelectorAll('.lang-option').forEach(button => button.addEventListener('click', () => {
    language = button.dataset.lang === 'traditional' ? 'traditional' : 'simplified';
    try { localStorage.setItem('guanxing-language',language); } catch (_) {}
    refreshLang();
  }));
  refreshLang();

  // 未配置链接时不执行空白跳转。
  document.querySelectorAll('a[data-empty="true"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
})();
