export function toggleFabState(isOpen) {
  return !isOpen;
}

export function initFab() {
  const button = document.getElementById('fab-main-button');
  const list = document.getElementById('fab-numbers-list');
  if (!button || !list) return;

  let isOpen = false;
  button.addEventListener('click', () => {
    isOpen = toggleFabState(isOpen);
    list.classList.toggle('hidden', !isOpen);
  });
}
