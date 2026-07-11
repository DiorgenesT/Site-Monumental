const SCROLL_THRESHOLD = 40;

export function getHeaderState(scrollY) {
  return scrollY > SCROLL_THRESHOLD ? 'scrolled' : 'top';
}

export function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const apply = () => {
    const state = getHeaderState(window.scrollY);
    header.classList.toggle('is-scrolled', state === 'scrolled');
  };

  apply();
  window.addEventListener('scroll', apply, { passive: true });

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  navToggle?.addEventListener('click', () => {
    const isOpen = !navMenu.classList.contains('hidden');
    navMenu.classList.toggle('hidden', isOpen);
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });
}
