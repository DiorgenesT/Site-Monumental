export function toggleFaqState(state, index) {
  return { openIndex: state.openIndex === index ? null : index };
}

export function initFaq() {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  let state = { openIndex: null };

  const render = () => {
    items.forEach((item, i) => {
      const answer = item.querySelector('.faq-answer');
      const isOpen = state.openIndex === i;
      answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : '0px';
      item.querySelector('.faq-icon')?.classList.toggle('rotate-180', isOpen);
      item.querySelector('.faq-question')?.setAttribute('aria-expanded', String(isOpen));
    });
  };

  items.forEach((item, i) => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      state = toggleFaqState(state, i);
      render();
    });
  });
}
