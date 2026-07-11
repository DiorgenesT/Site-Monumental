export function getCopyrightYear(date = new Date()) {
  return date.getFullYear();
}

export function initFooter() {
  const el = document.getElementById('footer-year');
  if (!el) return;
  el.textContent = String(getCopyrightYear());
}
