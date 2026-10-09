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
  setHref('storeLink',valid(cfg.storeUrl));
  setHref('faqMore',fullGuide);
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
  // 授权状态在 config.js 中一处切换，避免页面多个位置出现矛盾。
  const salesPaused = cfg.salesPaused !== false;
  const salesCopy = salesPaused ? {
    hero: '使用教程与相关说明持续更新',
    badge: '',
    notice: '目前仅提供授权规则说明及已有用户支持，暂不接受新授权购买或预订。',
    title: '授权码相关说明',
    body: '目前暂不开放新授权购买或预订；已有用户可继续查看教程并反馈使用问题。',
    button: '查看店铺动态 ↗',
    hint: '店铺入口仅供了解相关动态，目前不接受新授权购买或预订。'
  } : {
    hero: '授权信息请以最新店铺说明为准，教程持续维护',
    badge: '',
    notice: '授权码的当前获取方式、使用规则请以最新店铺说明为准。',
    title: '授权码获取说明',
    body: '请通过店铺查看当前获取方式与相关规则；实际状态以最新公告为准。',
    button: '查看闲鱼店铺 ↗',
    hint: '请先确认适配情况和最新使用规则。'
  };
  const putText = (id, value) => { const el=byId(id); if(el) el.textContent=value; };
  putText('heroSalesStatus', typeof cfg.homepageNotice === 'string' ? cfg.homepageNotice : salesCopy.hero);
  putText('noticeSalesStatus', salesCopy.notice);
  putText('licenseStatusTitle', salesCopy.title);
  putText('licenseStatusBody', salesCopy.body);
  putText('licenseStoreHint', salesCopy.hint);
  const salesBadge = byId('salesBadge');
  if (salesBadge) { salesBadge.textContent = salesCopy.badge; salesBadge.hidden = !salesCopy.badge; }
  putText('storeLink', salesCopy.button);
  const modalNames = ['noticeModal','featureModal','licenseModal','exportModal','communityModal','downloadModal'];
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
