(() => {
  'use strict';

  const video = document.getElementById('guideQuickStartVideo');
  const controls = document.getElementById('guideVideoQuality');
  const source = document.getElementById('guideVideoSource');
  const status = document.getElementById('guideVideoStatus');
  const efficient = source.querySelector('[data-efficient]');
  const automatic = source.querySelector('[data-automatic]');
  const playlist = 'assets/video/adaptive/master.m3u8';
  const defaultSource = video.getAttribute('src');
  const fallbackSource = source.querySelector('[data-low-bandwidth]').value;
  const canUseAuto = window.MediaSource || window.ManagedMediaSource;
  const canPlayEfficient = video.canPlayType('video/mp4; codecs="av01.0.08M.08,mp4a.40.2"');
  let activeSource = defaultSource;
  let pending = null;
  let engine = null;
  let hlsScript = null;

  function message(simplified, traditional) {
    status.textContent = document.documentElement.lang === 'zh-Hant' ? traditional : simplified;
  }

  function loadHls() {
    if (!hlsScript) {
      hlsScript = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'assets/vendor/hls-1.7.4.light.min.js';
        script.onload = () => window.Hls?.isSupported() ? resolve(window.Hls) : reject();
        script.onerror = reject;
        document.head.appendChild(script);
      }).catch(error => {
        hlsScript = null;
        throw error;
      });
    }
    return hlsScript;
  }

  function switchSource(next, Hls) {
    if (next === activeSource) return;
    pending ??= { time: video.currentTime, playing: !video.paused && !video.ended };
    engine?.destroy();
    engine = null;
    activeSource = next;
    video.disableRemotePlayback = Boolean(Hls && !window.MediaSource);

    if (Hls) {
      engine = new Hls({
        preferManagedMediaSource: !window.MediaSource,
        startLevel: 0,
        abrEwmaDefaultEstimate: 220000,
        maxBufferLength: 15,
        maxMaxBufferLength: 21,
        backBufferLength: 30,
      });
      engine.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) fallback(fallbackSource);
      });
      engine.loadSource(playlist);
      engine.attachMedia(video);
    } else {
      video.src = next;
      video.load();
    }
  }

  function fallback(next) {
    source.value = next;
    switchSource(next);
    message('自动画质暂不可用。', '自動畫質暫時無法使用。');
  }

  async function selectSource() {
    const next = source.value;
    message('', '');
    if (next !== 'auto') {
      switchSource(next);
      return;
    }

    message('正在载入自动画质…', '正在載入自動畫質…');
    try {
      const Hls = await loadHls();
      if (source.value !== next) return;
      switchSource(next, Hls);
      message('', '');
    } catch {
      if (source.value === next) fallback(activeSource === 'auto' ? fallbackSource : activeSource);
    }
  }

  video.addEventListener('loadedmetadata', () => {
    if (!pending) return;
    const { time, playing } = pending;
    pending = null;
    if (time > 0 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(time, video.duration);
    }
    if (playing) video.play().catch(() => {
      // Use the native play control if this browser blocks resuming.
    });
  });

  source.value = defaultSource;
  if (!canPlayEfficient) efficient.remove();
  if (!canUseAuto) automatic.remove();
  source.addEventListener('change', selectSource);
  controls.hidden = false;

  const preferred = new URLSearchParams(location.search).get('quality');
  if (preferred === 'efficient' && canPlayEfficient) {
    source.value = efficient.value;
    selectSource();
  } else if (preferred === 'auto' && canUseAuto) {
    source.value = automatic.value;
    selectSource();
  }
})();
