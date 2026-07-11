const STORAGE_KEY = 'monumental-cookie-consent';

export function shouldShowBanner(storedValue) {
  return storedValue !== 'accepted' && storedValue !== 'declined';
}

export function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (shouldShowBanner(stored)) {
    banner.classList.remove('hidden');
  }

  document.getElementById('accept-cookies')?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    banner.classList.add('hidden');
  });

  document.getElementById('decline-cookies')?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    banner.classList.add('hidden');
  });
}
