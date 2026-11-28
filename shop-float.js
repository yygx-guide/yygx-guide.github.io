/* 全站闲鱼购买入口。店铺地址统一读取 config.js 的 SITE_CONFIG.storeUrl。 */
(() => {
  'use strict';
  if (!document.body || document.querySelector('.shop-float')) return;

  const config = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG) || {};
  const storeUrl = typeof config.storeUrl === 'string' ? config.storeUrl.trim() : '';
  if (!/^https?:\/\//i.test(storeUrl)) return;

  const scriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : new URL('shop-float.js', document.baseURI).href;
  const imageUrl = new URL('assets/shop-assistant.webp', scriptUrl).href;

  let traditional = false;
  try { traditional = localStorage.getItem('guanxing-language') === 'traditional'; }
  catch (_) { /* 隐私模式下使用简体默认文案 */ }

  const wrap = document.createElement('div');
  wrap.className = 'shop-float';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', traditional ? '閒魚店鋪購買入口' : '闲鱼店铺购买入口');

  const bubble = document.createElement('a');
  bubble.className = 'shop-float__bubble';
  bubble.href = storeUrl;
  bubble.target = '_blank';
  bubble.rel = 'noopener noreferrer';
  bubble.textContent = traditional ? '購買授權碼可以點我哦～' : '购买授权码可以点我哦～';
  bubble.setAttribute('aria-label', traditional ? '打開閒魚店鋪購買授權碼' : '打开闲鱼店铺购买授权码');

  const avatarLink = document.createElement('a');
  avatarLink.className = 'shop-float__avatar-link';
  avatarLink.href = storeUrl;
  avatarLink.target = '_blank';
  avatarLink.rel = 'noopener noreferrer';
  avatarLink.setAttribute('aria-label', traditional ? '前往閒魚店鋪' : '前往闲鱼店铺');

  const image = document.createElement('img');
  image.className = 'shop-float__avatar';
  image.src = imageUrl;
  image.alt = '';
  image.width = 224;
  image.height = 224;
  image.loading = 'eager';
  image.decoding = 'async';
  image.fetchPriority = 'high';

  avatarLink.appendChild(image);
  wrap.append(bubble, avatarLink);
  document.body.appendChild(wrap);

  // 下载页等独立页面也保持简繁切换一致；主站自身的转换脚本仍可正常处理该文本节点。
  document.querySelectorAll('.lang-option').forEach(button => {
    button.addEventListener('click', () => {
      window.setTimeout(() => {
        let isTraditional = button.dataset.lang === 'traditional';
        try { isTraditional = localStorage.getItem('guanxing-language') === 'traditional'; } catch (_) {}
        bubble.textContent = isTraditional ? '購買授權碼可以點我哦～' : '购买授权码可以点我哦～';
        bubble.setAttribute('aria-label', isTraditional ? '打開閒魚店鋪購買授權碼' : '打开闲鱼店铺购买授权码');
        wrap.setAttribute('aria-label', isTraditional ? '閒魚店鋪購買入口' : '闲鱼店铺购买入口');
        avatarLink.setAttribute('aria-label', isTraditional ? '前往閒魚店鋪' : '前往闲鱼店铺');
      }, 0);
    });
  });
})();
