import {
  createIcons,
  ArrowRight,
  BatteryCharging,
  Building,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Fuel,
  Instagram,
  KeyRound,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  PhoneCall,
  Send,
  ShieldCheck,
  Smile,
  TrendingUp,
  Truck,
  UploadCloud,
  UserCircle,
  UserPlus,
  Users,
  Wallet,
  Wrench,
} from 'lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeader } from './nav.js';
import { initFooter } from './footer.js';
import { initFab } from './fab.js';
import { initCookieBanner } from './cookie-banner.js';
import { initCounters } from './counters.js';
import { initTestimonials } from './testimonials.js';
import { initForm } from './forms.js';
import { initFaq } from './faq.js';
import { initHeroIntro, initScrollReveals } from './reveal.js';

gsap.registerPlugin(ScrollTrigger);

const usedIcons = {
  ArrowRight,
  BatteryCharging,
  Building,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Fuel,
  Instagram,
  KeyRound,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  PhoneCall,
  Send,
  ShieldCheck,
  Smile,
  TrendingUp,
  Truck,
  UploadCloud,
  UserCircle,
  UserPlus,
  Users,
  Wallet,
  Wrench,
};

export function initSite() {
  createIcons({ icons: usedIcons });
  initHeader();
  initFooter();
  initFab();
  initCookieBanner();
  initCounters();
  initTestimonials();
  initForm(document.getElementById('form-seja-prestador'), '/api/enviar-seja-prestador.php');
  initForm(document.getElementById('form-trabalhe-conosco'), '/api/enviar-trabalhe-conosco.php');
  initFaq();
  initHeroIntro();
  initScrollReveals();
  document.body.classList.add('js-ready');
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSite);
}
