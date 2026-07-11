export function nextIndex(current, total) {
  return (current + 1) % total;
}

export function prevIndex(current, total) {
  return (current - 1 + total) % total;
}

export function initTestimonials() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;
  const cards = Array.from(slider.children);
  let current = 0;

  const render = () => {
    cards.forEach((card, i) => card.classList.toggle('hidden', i !== current));
  };

  document.getElementById('next-testimonial')?.addEventListener('click', () => {
    current = nextIndex(current, cards.length);
    render();
  });
  document.getElementById('prev-testimonial')?.addEventListener('click', () => {
    current = prevIndex(current, cards.length);
    render();
  });

  render();
}
