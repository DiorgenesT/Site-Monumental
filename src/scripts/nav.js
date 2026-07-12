const SCROLL_THRESHOLD = 40;

export function getHeaderState(scrollY) {
  return scrollY > SCROLL_THRESHOLD ? 'scrolled' : 'top';
}

export function nextMenuOpenState(isOpen) {
  return !isOpen;
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
  const iconMenu = document.getElementById('nav-icon-menu');
  const iconClose = document.getElementById('nav-icon-close');
  if (!navToggle || !navMenu) return;

  let isOpen = false;

  const setMenuOpen = (open) => {
    isOpen = open;
    navMenu.classList.toggle('hidden', !open);
    navMenu.classList.toggle('flex', open);
    navToggle.setAttribute('aria-expanded', String(open));
    iconMenu?.classList.toggle('hidden', open);
    iconClose?.classList.toggle('hidden', !open);
    document.body.classList.toggle('overflow-hidden', open);
  };

  navToggle.addEventListener('click', () => setMenuOpen(nextMenuOpenState(isOpen)));
  navMenu.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
}
