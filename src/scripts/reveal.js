import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function shouldAnimate(mediaQueryResult) {
  if (!mediaQueryResult) return true;
  return !mediaQueryResult.matches;
}

export function initHeroIntro() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  if (!shouldAnimate(window.matchMedia('(prefers-reduced-motion: reduce)'))) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('#hero .eyebrow', { opacity: 0, y: 16, duration: 0.5 })
    .from('#hero h1', { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
    .from('#hero p', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('#hero .btn-primary', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
    .from('.hero-panel', { xPercent: -8, opacity: 0, duration: 0.9 }, 0);
}

export function initScrollReveals() {
  if (!shouldAnimate(window.matchMedia('(prefers-reduced-motion: reduce)'))) return;
  gsap.registerPlugin(ScrollTrigger);

  const headings = document.querySelectorAll('main h1, main h2');
  headings.forEach((el) => {
    if (el.closest('#hero')) return;
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
}
