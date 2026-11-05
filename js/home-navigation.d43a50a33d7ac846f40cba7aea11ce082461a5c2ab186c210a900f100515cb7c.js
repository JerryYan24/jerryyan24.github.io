// Keep the page's location visible without changing browser history while scrolling.
(() => {
  const header = document.querySelector('.home-refined > header');
  const links = [...document.querySelectorAll('.home-nav-links a, .nav-contact')];
  const sections = links.map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(item => item.section);
  if (!header || !sections.length) return;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const readingLine = header.getBoundingClientRect().height + 100;
    let current = sections[0];
    for (const item of sections) {
      if (item.section.getBoundingClientRect().top <= readingLine) current = item;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    sections.forEach(item => {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  const measure = () => {
    document.documentElement.style.setProperty('--home-header-height', `${header.offsetHeight}px`);
    schedule();
  };
  new ResizeObserver(measure).observe(header);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('hashchange', schedule);
  measure();
})();
