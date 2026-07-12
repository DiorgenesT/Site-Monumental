import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function shouldAnimate(mediaQueryResult) {
  if (!mediaQueryResult) return true;
  return !mediaQueryResult.matches;
}

export function initScrollReveals() {
  if (!shouldAnimate(window.matchMedia('(prefers-reduced-motion: reduce)'))) return;
  gsap.registerPlugin(ScrollTrigger);

  const headings = document.querySelectorAll('main h1, main h2');
  headings.forEach((el) => {
    if (el.closest('#hero') || el.closest('.page-header')) return;
    gsap.from(el, {
      opacity: 0,
      y: 32,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  const cardParents = new Set(
    Array.from(document.querySelectorAll('.card-surface')).map((card) => card.parentElement)
  );
  cardParents.forEach((parent) => {
    const cards = Array.from(parent.children).filter((child) => child.classList.contains('card-surface'));
    if (cards.length < 2) return;
    gsap.from(cards, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: { trigger: parent, start: 'top 88%' },
    });
  });

  // Fontes e imagens que carregam depois do primeiro layout podem deslocar
  // a posição dos elementos e "confundir" os gatilhos de scroll já calculados.
  // Recalcula depois que tudo estiver carregado, pra não deixar nada preso
  // em estado invisível.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready?.then(() => ScrollTrigger.refresh());
}
