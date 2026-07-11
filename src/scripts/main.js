import '../styles/main.css';
import { createIcons, icons } from 'lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeader } from './nav.js';
import { initFooter } from './footer.js';

gsap.registerPlugin(ScrollTrigger);

export function initSite() {
  createIcons({ icons });
  initHeader();
  initFooter();
  document.body.classList.add('js-ready');
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSite);
}
