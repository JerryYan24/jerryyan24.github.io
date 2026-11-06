// Keep demonstrations quiet and still when off screen or reduced motion is requested.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const players = [...document.querySelectorAll('.research-media video')].map(video => {
    const button = video.parentElement.querySelector('.media-toggle');
    const state = { video, button, visible: false, pausedByUser: false, playTimer: null };
    video.controls = false;
    button.hidden = false;
    const sync = () => {
      button.textContent = video.paused ? 'Play' : 'Pause';
      button.setAttribute('aria-label', `${video.paused ? 'Play' : 'Pause'} demonstration: ${video.closest('article').querySelector('h3').textContent}`);
    };
    button.addEventListener('click', () => {
      clearTimeout(state.playTimer);
      state.pausedByUser = !video.paused;
      if (video.paused) video.play().catch(sync);
      else video.pause();
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    return state;
  });
  const update = state => {
    clearTimeout(state.playTimer);
    if (!state.visible || document.hidden || preference.matches || state.pausedByUser) {
      state.video.pause();
      return;
    }
    // Let an anchor jump finish before downloading videos merely passed on the way.
    if (state.video.paused) {
      state.playTimer = setTimeout(() => {
        if (state.visible && !document.hidden && !preference.matches && !state.pausedByUser) {
          state.video.play().catch(() => {});
        }
      }, 250);
    }
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const state = players.find(player => player.video === entry.target);
      state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      update(state);
    });
  }, { threshold: 0.2 });
  players.forEach(state => observer.observe(state.video));
  window.addEventListener('scroll', () => {
    players.filter(state => state.visible && state.video.paused).forEach(update);
  }, { passive: true });
  preference.addEventListener('change', () => players.forEach(update));
  document.addEventListener('visibilitychange', () => players.forEach(update));
})();
