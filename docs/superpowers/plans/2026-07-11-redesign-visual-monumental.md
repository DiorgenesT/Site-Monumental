# Redesign Visual — Site Monumental Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o site institucional da Monumental Assistência como um projeto Vite multi-página, com novo visual "Corporate Premium" em bordô (#9f1c2e), imagens novas, formulários enviando e-mail via PHP/SMTP próprio, e SEO on-page completo por página — mantendo o deploy final como arquivos estáticos no HostGator.

**Architecture:** Vite gera 9 páginas HTML estáticas a partir de partials compartilhados (header, footer, floating buttons, cookie banner) via `vite-plugin-html` (EJS). Tailwind é compilado localmente (sem CDN). GSAP/Lucide via npm. Dois endpoints PHP (fora do bundle Vite, em `public/api/`) processam os formulários usando PHPMailer standalone (sem Composer) via SMTP autenticado no e-mail institucional.

**Tech Stack:** Vite 5, Tailwind CSS 3, vite-plugin-html, GSAP 3, Lucide, Vitest (testes de lógica JS), PHP 8 + PHPMailer standalone, HostGator (hospedagem final).

---

## Referência: conteúdo de origem

Todo o texto usado nas tarefas abaixo vem do `index.html` atual (preservado conforme a spec `docs/superpowers/specs/2026-07-11-redesign-visual-monumental-design.md`). Dados de contato usados em vários componentes:

- Telefones: `0800 591 2507` (`tel:08005912507`), `0800 770 4500` (`tel:08007704500`), `0800 297 7003` (`tel:08002977003`)
- WhatsApp: `https://api.whatsapp.com/send?phone=5531972313019&text=...` (texto varia por CTA)
- E-mail: `direcao@monumentalassistencia.com.br`
- Endereço: `Av. Amazonas, 1276 - Centro, Betim - MG, 32600-032`
- Instagram: `https://www.instagram.com/monumentalassistencia24h/`
- LinkedIn: `https://www.linkedin.com/company/monumental-assist%C3%AAncia-24hrs/?viewAsMember=true`
- Domínio final: `https://www.monumentalassistencia.com.br`

---

## Fase A — Scaffold do projeto

### Task 1: Inicializar projeto Vite

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.gitignore` (modificar o existente)
- Create: `.nvmrc`

- [ ] **Step 1: Criar `package.json`**

```json
{
  "name": "site-monumental",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vite-plugin-html": "^3.2.2",
    "tailwindcss": "^3.4.13",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    "vitest": "^2.1.1"
  },
  "dependencies": {
    "gsap": "^3.12.5",
    "lucide": "^0.446.0"
  }
}
```

- [ ] **Step 2: Instalar dependências**

Run: `npm install`
Expected: `node_modules/` criado, `package-lock.json` gerado, sem erros.

- [ ] **Step 3: Criar `vite.config.js` com as 9 entradas multi-página**

```js
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';

const pages = {
  index: 'Home',
  'sobre-nos': 'Sobre Nós',
  servicos: 'Serviços',
  planos: 'Planos',
  'seja-prestador': 'Seja um Prestador',
  'trabalhe-conosco': 'Trabalhe Conosco',
  contato: 'Contato',
  regulamento: 'Regulamento',
  'politica-de-privacidade': 'Política de Privacidade',
};

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      pages: Object.keys(pages).map((name) => ({
        entry: `/src/scripts/main.js`,
        filename: `${name === 'index' ? 'index' : name}.html`,
        template: `${name}.html`,
        injectOptions: {
          data: { pageName: name },
        },
      })),
    }),
  ],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.keys(pages).map((name) => [name, resolve(__dirname, `${name}.html`)])
      ),
    },
  },
});
```

- [ ] **Step 4: Atualizar `.gitignore`**

```
CLAUDE.md
.superpowers/
node_modules/
dist/
api/config.php
```

- [ ] **Step 5: Criar `.nvmrc`**

```
20
```

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.js .gitignore .nvmrc package-lock.json
git commit -m "Inicializa projeto Vite multi-página"
```

---

### Task 2: Configurar Tailwind com design tokens do redesign

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/styles/main.css`

- [ ] **Step 1: Criar `tailwind.config.js` com a paleta bordô**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './src/**/*.{js,html}'],
  theme: {
    extend: {
      colors: {
        bordo: {
          light: '#c23349',
          DEFAULT: '#9f1c2e',
          dark: '#7a1522',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Criar `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 3: Criar `src/styles/main.css` com os componentes reutilizáveis do design system**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-white text-neutral-900 font-sans antialiased;
  }
}

@layer components {
  .heading-xl {
    @apply text-3xl md:text-5xl font-black leading-tight text-neutral-900;
  }
  .section-light {
    @apply bg-white py-20 md:py-32;
  }
  .section-tinted {
    @apply bg-neutral-50 py-20 md:py-32;
  }
  .card-surface {
    @apply bg-white rounded-xl shadow-lg border border-neutral-100 p-6;
  }
  .btn-primary {
    @apply inline-flex items-center bg-gradient-to-r from-bordo to-bordo-dark hover:from-bordo-dark hover:to-bordo
           text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300
           transform hover:scale-105 shadow-lg hover:shadow-bordo/40;
  }
  .badge-red {
    @apply text-bordo font-bold;
  }
}
```

- [ ] **Step 4: Verificar que o Tailwind compila sem erro**

Run: `npx tailwindcss -i ./src/styles/main.css -o /tmp/test-output.css`
Expected: arquivo gerado sem erros no terminal.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js postcss.config.js src/styles/main.css
git commit -m "Configura Tailwind com paleta bordô e design tokens"
```

---

### Task 3: Instalar GSAP e Lucide via npm (substitui os CDNs)

**Files:**
- Create: `src/scripts/main.js`
- Test: `src/scripts/__tests__/main.smoke.test.js`

- [ ] **Step 1: Escrever teste de fumaça (o módulo importa sem lançar exceção)**

```js
// src/scripts/__tests__/main.smoke.test.js
import { describe, it, expect } from 'vitest';

describe('main.js entry', () => {
  it('exports an init function', async () => {
    const mod = await import('../main.js');
    expect(typeof mod.initSite).toBe('function');
  });
});
```

- [ ] **Step 2: Rodar teste e confirmar que falha**

Run: `npx vitest run src/scripts/__tests__/main.smoke.test.js`
Expected: FAIL — `Cannot find module '../main.js'` ou `initSite is not a function`.

- [ ] **Step 3: Criar `src/scripts/main.js`**

```js
import '../styles/main.css';
import { createIcons, icons } from 'lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSite() {
  createIcons({ icons });
  document.body.classList.add('js-ready');
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSite);
}
```

- [ ] **Step 4: Rodar teste e confirmar que passa**

Run: `npx vitest run src/scripts/__tests__/main.smoke.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/scripts/main.js src/scripts/__tests__/main.smoke.test.js
git commit -m "Substitui CDN de GSAP/Lucide por dependências npm"
```

---

### Task 4: Configurar partials HTML compartilhados (EJS via vite-plugin-html)

**Files:**
- Create: `src/partials/meta.html`
- Create: `src/partials/header.html`
- Create: `src/partials/footer.html`
- Create: `src/partials/floating-buttons.html`
- Create: `src/partials/cookie-banner.html`

Essas tarefas de conteúdo dos partials são feitas nas Tasks 5-8. Aqui só validamos que o mecanismo de include funciona.

- [ ] **Step 1: Criar um partial mínimo de teste**

```html
<!-- src/partials/_smoke.html -->
<div id="smoke-partial">ok</div>
```

- [ ] **Step 2: Criar página de teste temporária `__smoke.html` na raiz**

```html
<!doctype html>
<html lang="pt-br">
<head><meta charset="UTF-8"><title>smoke</title></head>
<body>
  <%- include('./src/partials/_smoke.html') %>
</body>
</html>
```

- [ ] **Step 3: Adicionar entrada temporária no `vite.config.js`** (adicionar `__smoke` ao objeto `pages` do Task 1, Step 3)

- [ ] **Step 4: Rodar dev server e verificar include**

Run: `npm run dev`
Then: `curl -s http://localhost:5173/__smoke.html | grep "smoke-partial"`
Expected: a linha `<div id="smoke-partial">ok</div>` aparece no HTML retornado.

- [ ] **Step 5: Remover arquivos de teste temporários**

```bash
rm __smoke.html src/partials/_smoke.html
```
E remover a entrada `__smoke` do `vite.config.js`.

- [ ] **Step 6: Commit**

```bash
git add vite.config.js
git commit -m "Valida mecanismo de includes EJS do vite-plugin-html"
```

---

## Fase B — Componentes compartilhados

### Task 5: Partial `meta.html` (SEO por página)

**Files:**
- Create: `src/partials/meta.html`

- [ ] **Step 1: Criar o partial de meta tags parametrizável**

```html
<!-- src/partials/meta.html -->
<!-- Uso: <%- include('./src/partials/meta.html', { title, description, path, ogImage }) %> -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><%= title %></title>

<meta name="description" content="<%= description %>">
<meta name="author" content="Monumental Assistência">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.monumentalassistencia.com.br<%= path %>">

<meta property="og:title" content="<%= title %>">
<meta property="og:description" content="<%= description %>">
<meta property="og:image" content="https://www.monumentalassistencia.com.br<%= ogImage %>">
<meta property="og:url" content="https://www.monumentalassistencia.com.br<%= path %>">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<%= title %>">
<meta name="twitter:description" content="<%= description %>">
<meta name="twitter:image" content="https://www.monumentalassistencia.com.br<%= ogImage %>">

<link id="favicon" rel="icon" href="/img/favicon.ico" type="image/x-icon">
```

- [ ] **Step 2: Documentar os valores por página numa tabela** (usada nas Tasks 9-17)

| Página | `path` | `title` |
|---|---|---|
| Home | `/` | Monumental - Assistência Veicular 24h para Associações em MG e Brasil |
| Sobre Nós | `/sobre-nos.html` | Sobre a Monumental - Frota Própria e Experiência em Assistência 24h |
| Serviços | `/servicos.html` | Serviços de Assistência 24h - Reboque, Chaveiro, Bateria e Mais |
| Planos | `/planos.html` | Planos para Associações de Proteção Veicular - Monumental |
| Seja Prestador | `/seja-prestador.html` | Seja um Prestador Parceiro da Monumental Assistência |
| Trabalhe Conosco | `/trabalhe-conosco.html` | Trabalhe Conosco - Monumental Assistência |
| Contato | `/contato.html` | Contato e Localização - Monumental Assistência em Betim/MG |
| Regulamento | `/regulamento.html` | Regulamento Monumental Assistência 24 Horas |
| Política de Privacidade | `/politica-de-privacidade.html` | Política de Privacidade - Monumental Assistência |

- [ ] **Step 3: Commit**

```bash
git add src/partials/meta.html
git commit -m "Adiciona partial de meta tags parametrizável por página"
```

---

### Task 6: Partial `header.html`

**Files:**
- Create: `src/partials/header.html`
- Create: `src/scripts/nav.js`
- Test: `src/scripts/__tests__/nav.test.js`

- [ ] **Step 1: Escrever teste da lógica pura de troca de logo/estado do header no scroll**

```js
// src/scripts/__tests__/nav.test.js
import { describe, it, expect } from 'vitest';
import { getHeaderState } from '../nav.js';

describe('getHeaderState', () => {
  it('returns "top" when scrollY is 0', () => {
    expect(getHeaderState(0)).toBe('top');
  });
  it('returns "scrolled" when scrollY is greater than threshold', () => {
    expect(getHeaderState(80)).toBe('scrolled');
  });
  it('uses a 40px threshold', () => {
    expect(getHeaderState(39)).toBe('top');
    expect(getHeaderState(41)).toBe('scrolled');
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npx vitest run src/scripts/__tests__/nav.test.js`
Expected: FAIL — `getHeaderState is not a function`

- [ ] **Step 3: Implementar `src/scripts/nav.js`**

```js
const SCROLL_THRESHOLD = 40;

export function getHeaderState(scrollY) {
  return scrollY > SCROLL_THRESHOLD ? 'scrolled' : 'top';
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
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initHeader);
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npx vitest run src/scripts/__tests__/nav.test.js`
Expected: PASS

- [ ] **Step 5: Criar `src/partials/header.html`**

```html
<!-- src/partials/header.html -->
<div id="header-wrapper" class="fixed top-0 left-0 w-full z-40">
  <div id="top-bar" class="bg-white text-neutral-800 border-b border-neutral-100">
    <div class="container mx-auto flex flex-wrap justify-center items-center gap-x-6 gap-y-1 py-2 px-4 text-sm font-medium">
      <span class="font-bold hidden sm:inline">Assistência 24h:</span>
      <a href="tel:08005912507" class="flex items-center gap-1.5 hover:text-bordo transition-colors">
        <i data-lucide="phone-call" class="w-4 h-4"></i><span>0800 591 2507</span>
      </a>
      <a href="tel:08007704500" class="flex items-center gap-1.5 hover:text-bordo transition-colors">
        <i data-lucide="phone-call" class="w-4 h-4"></i><span>0800 770 4500</span>
      </a>
      <a href="tel:08002977003" class="flex items-center gap-1.5 hover:text-bordo transition-colors">
        <i data-lucide="phone-call" class="w-4 h-4"></i><span>0800 297 7003</span>
      </a>
    </div>
  </div>
  <header id="main-header" class="w-full py-5 px-4 bg-bordo transition-all duration-500">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="logo relative w-48 h-12 block">
        <img src="/img/monumentalbranca.png" alt="Logo Monumental" class="h-full w-auto">
      </a>
      <nav>
        <button id="nav-toggle" class="md:hidden text-white" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-menu">
          <i data-lucide="menu" class="w-7 h-7"></i>
        </button>
        <ul id="nav-menu" class="hidden md:flex items-center space-x-6 font-semibold text-white text-sm">
          <li><a href="/" class="hover:text-white/70 transition-colors">Início</a></li>
          <li><a href="/sobre-nos.html" class="hover:text-white/70 transition-colors">Sobre Nós</a></li>
          <li><a href="/servicos.html" class="hover:text-white/70 transition-colors">Serviços</a></li>
          <li><a href="/planos.html" class="hover:text-white/70 transition-colors">Planos</a></li>
          <li><a href="/seja-prestador.html" class="hover:text-white/70 transition-colors">Prestadores</a></li>
          <li><a href="/trabalhe-conosco.html" class="hover:text-white/70 transition-colors">Trabalhe Conosco</a></li>
          <li><a href="/contato.html" class="hover:text-white/70 transition-colors">Contato</a></li>
        </ul>
      </nav>
    </div>
  </header>
</div>
<div class="h-24"></div> <!-- spacer para compensar header fixed -->
```

- [ ] **Step 6: Registrar `initHeader` no `src/scripts/main.js`** — adicionar `import { initHeader } from './nav.js';` e chamar `initHeader();` dentro de `initSite()`.

- [ ] **Step 7: Commit**

```bash
git add src/partials/header.html src/scripts/nav.js src/scripts/__tests__/nav.test.js src/scripts/main.js
git commit -m "Adiciona header compartilhado com lógica de scroll testada"
```

---

### Task 7: Partial `footer.html` (ano dinâmico + marca DG)

**Files:**
- Create: `src/partials/footer.html`
- Create: `src/scripts/footer.js`
- Test: `src/scripts/__tests__/footer.test.js`

- [ ] **Step 1: Escrever teste da função pura que calcula o ano**

```js
// src/scripts/__tests__/footer.test.js
import { describe, it, expect } from 'vitest';
import { getCopyrightYear } from '../footer.js';

describe('getCopyrightYear', () => {
  it('returns the year of the given date', () => {
    expect(getCopyrightYear(new Date('2027-03-01'))).toBe(2027);
  });
  it('defaults to the current year when no date is passed', () => {
    expect(getCopyrightYear()).toBe(new Date().getFullYear());
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npx vitest run src/scripts/__tests__/footer.test.js`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar `src/scripts/footer.js`**

```js
export function getCopyrightYear(date = new Date()) {
  return date.getFullYear();
}

export function initFooter() {
  const el = document.getElementById('footer-year');
  if (!el) return;
  el.textContent = String(getCopyrightYear());
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initFooter);
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npx vitest run src/scripts/__tests__/footer.test.js`
Expected: PASS

- [ ] **Step 5: Criar `src/partials/footer.html`** — inclui a marca DG (blocos pretos quadrados, inclinação sutil ±6°, hover atrativo) linkando para `https://diorgenesgeorge.dev`

```html
<!-- src/partials/footer.html -->
<footer class="bg-neutral-900 text-neutral-400 py-8">
  <div class="container mx-auto text-center text-sm">
    <p>&copy; <span id="footer-year">2026</span> Monumental Assistência 24 Horas. Todos os direitos reservados.
      <span class="mx-2">|</span>
      <a href="/politica-de-privacidade.html" class="hover:text-white transition-colors">Política de Privacidade</a>
    </p>
    <p class="mt-4 text-base">
      <a href="https://diorgenesgeorge.dev" target="_blank" rel="noopener noreferrer" class="dg-credit inline-flex items-center gap-2 group">
        <span class="text-neutral-400 group-hover:text-white transition-colors">Desenvolvido por</span>
        <span class="dg-mark flex">
          <span class="dg-block dg-block-d">D</span>
          <span class="dg-block dg-block-g">G</span>
        </span>
      </a>
    </p>
  </div>
</footer>
```

- [ ] **Step 6: Adicionar o CSS da marca DG em `src/styles/main.css`** (dentro de `@layer components`, dá pra colar logo abaixo de `.badge-red`)

```css
  .dg-mark {
    @apply gap-1;
  }
  .dg-block {
    @apply w-6 h-6 bg-black text-white text-xs font-black flex items-center justify-center
           transition-transform duration-300;
  }
  .dg-block-d {
    transform: rotate(-6deg);
  }
  .dg-block-g {
    transform: rotate(6deg);
  }
  .dg-credit:hover .dg-block-d {
    transform: rotate(-6deg) scale(1.15) translateY(-2px);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  .dg-credit:hover .dg-block-g {
    transform: rotate(6deg) scale(1.15) translateY(-2px);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
```

- [ ] **Step 7: Registrar `initFooter` no `src/scripts/main.js`**

- [ ] **Step 8: Commit**

```bash
git add src/partials/footer.html src/scripts/footer.js src/scripts/__tests__/footer.test.js src/styles/main.css src/scripts/main.js
git commit -m "Adiciona footer com ano dinâmico e marca DG estilizada"
```

---

### Task 8: Partials `floating-buttons.html` e `cookie-banner.html`

**Files:**
- Create: `src/partials/floating-buttons.html`
- Create: `src/partials/cookie-banner.html`
- Create: `src/scripts/cookie-banner.js`
- Test: `src/scripts/__tests__/cookie-banner.test.js`

- [ ] **Step 1: Escrever teste da lógica de decisão do banner (mostrar ou não com base no localStorage)**

```js
// src/scripts/__tests__/cookie-banner.test.js
import { describe, it, expect } from 'vitest';
import { shouldShowBanner } from '../cookie-banner.js';

describe('shouldShowBanner', () => {
  it('returns true when there is no stored consent', () => {
    expect(shouldShowBanner(null)).toBe(true);
  });
  it('returns false when consent was accepted', () => {
    expect(shouldShowBanner('accepted')).toBe(false);
  });
  it('returns false when consent was declined', () => {
    expect(shouldShowBanner('declined')).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npx vitest run src/scripts/__tests__/cookie-banner.test.js`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar `src/scripts/cookie-banner.js`**

```js
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

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initCookieBanner);
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npx vitest run src/scripts/__tests__/cookie-banner.test.js`
Expected: PASS

- [ ] **Step 5: Criar `src/partials/cookie-banner.html`**

```html
<!-- src/partials/cookie-banner.html -->
<div id="cookie-banner" class="fixed bottom-0 left-0 right-0 z-[90] p-4 hidden">
  <div class="container mx-auto max-w-4xl p-4 rounded-lg shadow-2xl bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm text-neutral-200 text-center sm:text-left">
      Nosso site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com a nossa
      <a href="/politica-de-privacidade.html" class="font-bold text-bordo-light hover:underline">Política de Privacidade</a>.
    </p>
    <div class="flex items-center gap-3 flex-shrink-0">
      <button id="decline-cookies" class="bg-transparent border border-neutral-600 text-neutral-300 text-sm font-bold py-2 px-4 rounded-full hover:bg-neutral-700 transition-colors">Recusar</button>
      <button id="accept-cookies" class="bg-bordo text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-bordo-dark transition-colors">Aceitar</button>
    </div>
  </div>
</div>
```

- [ ] **Step 6: Criar `src/partials/floating-buttons.html`** (assistência + regulamento agora linka para página em vez de modal)

```html
<!-- src/partials/floating-buttons.html -->
<div id="assistance-fab" class="fixed bottom-8 right-8 z-[60] flex items-center gap-4">
  <span class="fab-label bg-white text-neutral-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">Contato</span>
  <div class="relative">
    <div id="fab-numbers-list" class="absolute bottom-20 right-0 w-64 bg-white text-neutral-800 rounded-lg shadow-2xl p-4 space-y-2 hidden">
      <p class="font-bold text-center mb-2">Solicitar Assistência:</p>
      <a href="tel:08005912507" class="block font-semibold text-center hover:text-bordo">0800 591 2507</a>
      <a href="tel:08007704500" class="block font-semibold text-center hover:text-bordo">0800 770 4500</a>
      <a href="tel:08002977003" class="block font-semibold text-center hover:text-bordo">0800 297 7003</a>
    </div>
    <div id="fab-main-button" class="relative w-16 h-16 bg-bordo rounded-full flex items-center justify-center cursor-pointer shadow-lg transform hover:scale-110 transition-transform duration-300">
      <i data-lucide="phone" class="w-8 h-8 text-white"></i>
    </div>
  </div>
</div>

<a href="/regulamento.html" id="regulation-fab" class="fixed bottom-8 left-8 z-[60] flex items-center gap-4">
  <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transform hover:scale-110 transition-transform duration-300">
    <i data-lucide="file-text" class="w-8 h-8 text-neutral-800"></i>
  </div>
  <span class="fab-label bg-white text-neutral-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">Regulamento</span>
</a>
```

- [ ] **Step 7: Registrar `initCookieBanner` no `src/scripts/main.js`**, e adicionar toggle simples do `fab-numbers-list` (click no `fab-main-button` remove/adiciona `hidden`) direto em `main.js` ou em `src/scripts/fab.js` seguindo o mesmo padrão de `nav.js`.

- [ ] **Step 8: Commit**

```bash
git add src/partials/floating-buttons.html src/partials/cookie-banner.html src/scripts/cookie-banner.js src/scripts/__tests__/cookie-banner.test.js src/scripts/main.js
git commit -m "Adiciona botões flutuantes e cookie banner compartilhados"
```

---

## Fase C — Páginas de conteúdo

Todas as páginas seguem este esqueleto (o que muda é o `<main>` no meio):

```html
<!doctype html>
<html lang="pt-br">
<head>
  <%- include('./src/partials/meta.html', { title: '...', description: '...', path: '...', ogImage: '...' }) %>
</head>
<body>
  <%- include('./src/partials/header.html') %>
  <main>
    <!-- conteúdo específico da página -->
  </main>
  <%- include('./src/partials/footer.html') %>
  <%- include('./src/partials/floating-buttons.html') %>
  <%- include('./src/partials/cookie-banner.html') %>
</body>
</html>
```

Classes reutilizáveis definidas na Task 2: `.heading-xl`, `.section-light`, `.section-tinted`, `.card-surface`, `.btn-primary`, `.badge-red`.

### Task 9: Página Home (`index.html`)

**Files:**
- Create: `index.html`

- [ ] **Step 1: Montar `index.html` com hero full-bleed + resumo dos 5 serviços + números + CTA final**, usando os textos abaixo (mantidos do site original) e o hero em foto full-bleed com overlay (decisão da spec):

```html
<!doctype html>
<html lang="pt-br">
<head>
  <%- include('./src/partials/meta.html', {
    title: 'Monumental - Assistência Veicular 24h para Associações em MG e Brasil',
    description: 'A Monumental é especialista em assistência veicular 24h para associações de proteção veicular em Minas Gerais e todo o Brasil. Oferecemos reboque, chaveiro, e mais.',
    path: '/',
    ogImage: '/img/hero-monumental.jpg'
  }) %>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "name": "Monumental Assistência Veicular 24h",
    "image": "https://www.monumentalassistencia.com.br/img/logo.png",
    "url": "https://www.monumentalassistencia.com.br",
    "telephone": "+55-0800-591-2507",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Amazonas, 1276",
      "addressLocality": "Betim",
      "addressRegion": "MG",
      "postalCode": "32600-032",
      "addressCountry": "BR"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Minas Gerais" },
      { "@type": "Country", "name": "Brazil" }
    ]
  }
  </script>
</head>
<body>
  <%- include('./src/partials/header.html') %>
  <main>
    <section class="relative min-h-screen flex items-center bg-cover bg-center" style="background-image: url('/img/hero-monumental.jpg');">
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-bordo-dark/80"></div>
      <div class="container mx-auto px-4 relative z-10 text-center">
        <h1 class="heading-xl text-white text-4xl md:text-6xl">
          Assistência 24h para Associações de Proteção Veicular
        </h1>
        <p class="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
          Mais segurança e agilidade para sua associação oferecer tranquilidade total aos seus associados.
        </p>
        <a href="/planos.html" class="btn-primary mt-10">
          Conheça nossos planos
          <i data-lucide="arrow-right" class="ml-3 h-6 w-6"></i>
        </a>
      </div>
    </section>

    <section class="section-light">
      <div class="container mx-auto px-4 text-center">
        <h2 class="heading-xl mb-4">Serviços <span class="badge-red">Oferecidos</span></h2>
        <p class="text-lg text-neutral-600 max-w-3xl mx-auto mb-16">
          Assistência veicular completa, sempre à disposição dos seus associados:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div class="card-surface flex flex-col items-center text-center">
            <div class="mb-4 text-bordo"><i data-lucide="truck" class="w-12 h-12"></i></div>
            <h3 class="text-xl font-bold mb-2">Reboque 24h</h3>
            <p class="text-neutral-500">Remoção rápida e segura do seu veículo.</p>
          </div>
          <div class="card-surface flex flex-col items-center text-center">
            <div class="mb-4 text-bordo"><i data-lucide="key-round" class="w-12 h-12"></i></div>
            <h3 class="text-xl font-bold mb-2">Chaveiro</h3>
            <p class="text-neutral-500">Abertura veicular em situações de emergência.</p>
          </div>
          <div class="card-surface flex flex-col items-center text-center">
            <div class="mb-4 text-bordo"><i data-lucide="battery-charging" class="w-12 h-12"></i></div>
            <h3 class="text-xl font-bold mb-2">Carga de Bateria</h3>
            <p class="text-neutral-500">Suporte imediato para veículos sem partida.</p>
          </div>
          <div class="card-surface flex flex-col items-center text-center">
            <div class="mb-4 text-bordo"><i data-lucide="wrench" class="w-12 h-12"></i></div>
            <h3 class="text-xl font-bold mb-2">Troca de Pneu</h3>
            <p class="text-neutral-500">Auxílio ágil em caso de pneu furado.</p>
          </div>
          <div class="card-surface flex flex-col items-center text-center">
            <div class="mb-4 text-bordo"><i data-lucide="fuel" class="w-12 h-12"></i></div>
            <h3 class="text-xl font-bold mb-2">Pane Seca</h3>
            <p class="text-neutral-500">Entrega de combustível em caráter emergencial.</p>
          </div>
        </div>
        <a href="/servicos.html" class="btn-primary mt-12">Ver todos os detalhes<i data-lucide="arrow-right" class="ml-3 h-6 w-6"></i></a>
      </div>
    </section>

    <section class="section-tinted">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="heading-xl">Nossos <span class="badge-red">Números</span></h2>
          <p class="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            Resultados que comprovam nossa eficiência e compromisso com nossos parceiros.
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div class="card-surface text-center">
            <div class="flex justify-center mb-4 text-bordo"><i data-lucide="check-circle-2" class="w-14 h-14"></i></div>
            <span class="number-counter text-5xl font-black text-neutral-900" data-target="15000">0</span>
            <p class="mt-2 text-lg text-neutral-500">Atendimentos/Mês</p>
          </div>
          <div class="card-surface text-center">
            <div class="flex justify-center mb-4 text-bordo"><i data-lucide="smile" class="w-14 h-14"></i></div>
            <span class="number-counter text-5xl font-black text-neutral-900" data-target="98">0</span><span class="text-5xl font-black text-bordo">%</span>
            <p class="mt-2 text-lg text-neutral-500">Satisfação</p>
          </div>
          <div class="card-surface text-center">
            <div class="flex justify-center mb-4 text-bordo"><i data-lucide="map-pin" class="w-14 h-14"></i></div>
            <span class="number-counter text-5xl font-black text-neutral-900" data-target="26">0</span>
            <p class="mt-2 text-lg text-neutral-500">Estados Atendidos</p>
          </div>
          <div class="card-surface text-center">
            <div class="flex justify-center mb-4 text-bordo"><i data-lucide="users" class="w-14 h-14"></i></div>
            <span class="text-neutral-900">+</span><span class="number-counter text-5xl font-black text-neutral-900" data-target="50">0</span>
            <p class="mt-2 text-lg text-neutral-500">Associações Parceiras</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-sonar-container bg-bordo py-24 text-center">
      <div class="relative z-10 p-4">
        <h2 class="text-4xl md:text-6xl font-black text-white">Pronto para fortalecer sua associação?</h2>
        <p class="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Entre em contato conosco e descubra como a nossa parceria pode levar seus serviços a um novo patamar.
        </p>
        <a href="https://api.whatsapp.com/send?phone=5531972313019&text=Ol%C3%A1%21%20Gostaria%20de%20entrar%20em%20contato%20para%20saber%20mais%20sobre%20a%20Monumental%20Assist%C3%AAncia." target="_blank" rel="noopener noreferrer" class="btn-primary mt-8 bg-white !text-bordo hover:!text-bordo-dark from-white to-white">
          Fale Conosco<i data-lucide="phone" class="ml-3 h-5 w-5"></i>
        </a>
      </div>
    </section>
  </main>
  <%- include('./src/partials/footer.html') %>
  <%- include('./src/partials/floating-buttons.html') %>
  <%- include('./src/partials/cookie-banner.html') %>
</body>
</html>
```

- [ ] **Step 2: Rodar o dev server e verificar visualmente**

Run: `npm run dev`
Open: `http://localhost:5173/`
Expected: hero full-bleed com overlay, 5 cards de serviço, 4 números, CTA final — sem erros no console.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Cria página Home com hero full-bleed e novo design system"
```

---

### Task 10: Página Sobre Nós (`sobre-nos.html`)

**Files:**
- Create: `sobre-nos.html`

- [ ] **Step 1: Montar a página reaproveitando o esqueleto da Fase C**, com estas seções na ordem, usando os textos originais preservados:

  1. **Sobre a Monumental** — texto (3 parágrafos, mantidos):
     - "Na Monumental Assistência, somos especialistas em assistência 24h veicular, atuando exclusivamente para associações de proteção veicular."
     - "Nosso compromisso é garantir que cada associado da sua instituição seja atendido com rapidez, qualidade e segurança em qualquer situação."
     - "Com anos de experiência e uma rede de prestadores em todo o Brasil, trabalhamos para que sua associação ofereça um serviço de alto nível e ganhe mais confiança dos associados."
     - Imagem ao lado: `/img/sobre-equipe.jpg` (fotografia realista, ver Task 26/prompts).
  2. **Frota Própria em Belo Horizonte e Região** — texto (mantido) + lista de 4 itens (agilidade, tempo de resposta reduzido, segurança/confiabilidade, reforço exclusivo BH) + imagem `/img/frota-caminhao.jpg`.
  3. **Por que escolher a Monumental?** — lista numerada 01-05 (Cobertura nacional, Atendimento imediato 24h, Equipe qualificada, Relatórios e acompanhamento, Parceria sólida), em `.card-surface` cada item.

  Usar `.section-light` / `.section-tinted` alternando entre os 3 blocos, `.heading-xl` para títulos, `.badge-red` para a palavra destacada de cada título (ex: "Sobre a **Monumental**").

- [ ] **Step 2: Meta tags da página** (via `meta.html`): `title: 'Sobre a Monumental - Frota Própria e Experiência em Assistência 24h'`, `path: '/sobre-nos.html'`, `description: 'Conheça a Monumental Assistência: frota própria em Belo Horizonte, cobertura nacional e anos de experiência em assistência 24h para associações de proteção veicular.'`, `ogImage: '/img/sobre-equipe.jpg'`.

- [ ] **Step 3: Verificar visualmente**

Run: `npm run dev` → abrir `http://localhost:5173/sobre-nos.html`
Expected: as 3 seções renderizam na ordem, sem erros no console.

- [ ] **Step 4: Commit**

```bash
git add sobre-nos.html
git commit -m "Cria página Sobre Nós"
```

---

### Task 11: Página Serviços (`servicos.html`)

**Files:**
- Create: `servicos.html`

- [ ] **Step 1: Montar a página com os 5 serviços detalhados**, cada um em `.card-surface`, ícone Lucide + título + descrição (textos mantidos): Reboque 24h, Chaveiro, Carga de Bateria, Troca de Pneu, Pane Seca (mesmos textos usados na Task 9, agora com mais destaque/detalhe por serem o foco da página — pode reaproveitar as descrições da Home e adicionar o texto de contexto do regulamento correspondente, ex: "Em caso de panes, a central de assistência providenciará o envio de socorro elétrico/mecânica..." do item 1 do Regulamento, resumido em 1-2 frases por card).

- [ ] **Step 2: Meta tags**: `title: 'Serviços de Assistência 24h - Reboque, Chaveiro, Bateria e Mais'`, `path: '/servicos.html'`, `description: 'Reboque 24h, chaveiro, carga de bateria, troca de pneu e pane seca — assistência veicular completa para associados em todo o Brasil.'`, `ogImage: '/img/servico-reboque.jpg'`.

- [ ] **Step 3: Verificar visualmente e commit**

```bash
git add servicos.html
git commit -m "Cria página Serviços"
```

---

### Task 12: Página Planos (`planos.html`)

**Files:**
- Create: `planos.html`
- Create: `src/scripts/counters.js` (usado também na Home)
- Create: `src/scripts/testimonials.js`
- Test: `src/scripts/__tests__/counters.test.js`
- Test: `src/scripts/__tests__/testimonials.test.js`

- [ ] **Step 1: Escrever teste da lógica de incremento do contador**

```js
// src/scripts/__tests__/counters.test.js
import { describe, it, expect } from 'vitest';
import { computeCounterFrames } from '../counters.js';

describe('computeCounterFrames', () => {
  it('generates frames from 0 to target inclusive', () => {
    const frames = computeCounterFrames(5, 5);
    expect(frames[0]).toBe(0);
    expect(frames[frames.length - 1]).toBe(5);
  });
  it('never exceeds the requested frame count', () => {
    const frames = computeCounterFrames(100, 10);
    expect(frames.length).toBeLessThanOrEqual(10);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npx vitest run src/scripts/__tests__/counters.test.js`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar `src/scripts/counters.js`**

```js
export function computeCounterFrames(target, frameCount = 30) {
  const steps = Math.min(frameCount, target) || 1;
  const frames = [];
  for (let i = 0; i <= steps; i++) {
    frames.push(Math.round((target / steps) * i));
  }
  return frames;
}

export function initCounters() {
  const els = document.querySelectorAll('.number-counter');
  els.forEach((el) => {
    const target = Number(el.dataset.target);
    const frames = computeCounterFrames(target);
    let i = 0;
    const timer = setInterval(() => {
      el.textContent = String(frames[i]);
      i++;
      if (i >= frames.length) clearInterval(timer);
    }, 40);
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initCounters);
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npx vitest run src/scripts/__tests__/counters.test.js`
Expected: PASS

- [ ] **Step 5: Escrever teste da lógica de navegação do slider de depoimentos**

```js
// src/scripts/__tests__/testimonials.test.js
import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex } from '../testimonials.js';

describe('testimonial index wrap-around', () => {
  it('wraps to 0 after the last item on next', () => {
    expect(nextIndex(2, 3)).toBe(0);
  });
  it('wraps to the last item before the first on prev', () => {
    expect(prevIndex(0, 3)).toBe(2);
  });
  it('moves forward/backward normally within bounds', () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(prevIndex(1, 3)).toBe(0);
  });
});
```

- [ ] **Step 6: Rodar e confirmar falha**

Run: `npx vitest run src/scripts/__tests__/testimonials.test.js`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 7: Implementar `src/scripts/testimonials.js`**

```js
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

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initTestimonials);
}
```

- [ ] **Step 8: Rodar e confirmar sucesso**

Run: `npx vitest run src/scripts/__tests__/testimonials.test.js`
Expected: PASS

- [ ] **Step 9: Montar `planos.html`** com: (1) Planos Gestão e Fixo (textos mantidos) + lista de 4 benefícios + CTA WhatsApp; (2) Timeline "Como Funciona" (5 passos, textos mantidos: Contato Direto, Coleta de Informações, Acionamento, Atendimento, Associado Satisfeito); (3) Depoimentos — 3 cards com as frases originais mantidas, cargos trocados para "Gestor de Associação Parceira" / "Diretora de Associação Parceira" / "Presidente de Associação Parceira", **sem** os logos placeholder "ASSOCIAÇÃO A/B/C" (usar em vez disso um ícone `user-circle` do Lucide como avatar genérico).

- [ ] **Step 10: Registrar `initCounters` e `initTestimonials` em `src/scripts/main.js`**

- [ ] **Step 11: Meta tags**: `title: 'Planos para Associações de Proteção Veicular - Monumental'`, `path: '/planos.html'`, `description: 'Plano Gestão e Plano Fixo: cobertura flexível de assistência 24h para associações de proteção veicular em todo o Brasil.'`, `ogImage: '/img/planos-atendimento.jpg'`.

- [ ] **Step 12: Verificar visualmente e commit**

```bash
git add planos.html src/scripts/counters.js src/scripts/testimonials.js src/scripts/__tests__/counters.test.js src/scripts/__tests__/testimonials.test.js src/scripts/main.js
git commit -m "Cria página Planos com timeline, depoimentos e contadores testados"
```

---

### Task 13: Página Seja um Prestador (`seja-prestador.html`) + novo formulário

**Files:**
- Create: `seja-prestador.html`
- Create: `src/scripts/forms.js`
- Test: `src/scripts/__tests__/forms.test.js`

- [ ] **Step 1: Escrever teste da validação client-side (honeypot + tempo mínimo)**

```js
// src/scripts/__tests__/forms.test.js
import { describe, it, expect } from 'vitest';
import { isLikelySpam } from '../forms.js';

describe('isLikelySpam', () => {
  it('flags as spam when the honeypot field is filled', () => {
    expect(isLikelySpam({ honeypot: 'bot-filled-this', elapsedMs: 5000 })).toBe(true);
  });
  it('flags as spam when submitted too fast (<3s)', () => {
    expect(isLikelySpam({ honeypot: '', elapsedMs: 1000 })).toBe(true);
  });
  it('does not flag a normal human submission', () => {
    expect(isLikelySpam({ honeypot: '', elapsedMs: 8000 })).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npx vitest run src/scripts/__tests__/forms.test.js`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar `src/scripts/forms.js`**

```js
const MIN_SUBMIT_MS = 3000;

export function isLikelySpam({ honeypot, elapsedMs }) {
  if (honeypot && honeypot.trim() !== '') return true;
  if (elapsedMs < MIN_SUBMIT_MS) return true;
  return false;
}

export function initForm(formEl, endpoint) {
  if (!formEl) return;
  const loadedAt = Date.now();

  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    const statusEl = formEl.querySelector('.form-status');
    const honeypot = formEl.querySelector('input[name="website"]')?.value ?? '';
    const elapsedMs = Date.now() - loadedAt;

    if (isLikelySpam({ honeypot, elapsedMs })) {
      if (statusEl) statusEl.textContent = 'Não foi possível enviar. Tente novamente.';
      return;
    }

    const formData = new FormData(formEl);
    try {
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('request failed');
      if (statusEl) statusEl.textContent = 'Enviado com sucesso! Entraremos em contato em breve.';
      formEl.reset();
    } catch {
      if (statusEl) statusEl.textContent = 'Erro ao enviar. Tente novamente em instantes.';
    }
  });
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npx vitest run src/scripts/__tests__/forms.test.js`
Expected: PASS

- [ ] **Step 5: Montar `seja-prestador.html`** com: seção existente "Quero Ser um Prestador" (texto mantido: "Junte-se à nossa rede de parceiros..." + 3 benefícios: pagamentos rápidos, flexibilidade, aumento de volume) + botão WhatsApp mantido, **e** o novo formulário de cadastro abaixo:

```html
<section class="section-light">
  <div class="container mx-auto px-4 max-w-2xl">
    <h2 class="heading-xl text-center mb-8">Cadastre-se como <span class="badge-red">Prestador</span></h2>
    <form id="form-seja-prestador" action="/api/enviar-seja-prestador.php" method="POST" class="space-y-6">
      <input type="text" name="website" class="hidden" tabindex="-1" autocomplete="off">
      <div>
        <label for="nome" class="block text-sm font-semibold text-neutral-700 mb-2">Nome Completo</label>
        <input type="text" name="nome" id="nome" required class="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bordo">
      </div>
      <div>
        <label for="telefone" class="block text-sm font-semibold text-neutral-700 mb-2">Telefone</label>
        <input type="tel" name="telefone" id="telefone" required class="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bordo">
      </div>
      <div>
        <label for="regiao" class="block text-sm font-semibold text-neutral-700 mb-2">Cidade/Região de Atuação</label>
        <input type="text" name="regiao" id="regiao" required class="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bordo">
      </div>
      <div>
        <label for="veiculo" class="block text-sm font-semibold text-neutral-700 mb-2">Tipo de Veículo</label>
        <input type="text" name="veiculo" id="veiculo" required class="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bordo">
      </div>
      <p class="form-status text-center text-sm font-semibold"></p>
      <div class="text-center">
        <button type="submit" class="btn-primary">Enviar Cadastro<i data-lucide="send" class="ml-3 h-5 w-5"></i></button>
      </div>
    </form>
  </div>
</section>
```

- [ ] **Step 6: Registrar a inicialização do formulário em `src/scripts/main.js`**

```js
import { initForm } from './forms.js';
// dentro de initSite():
initForm(document.getElementById('form-seja-prestador'), '/api/enviar-seja-prestador.php');
```

- [ ] **Step 7: Meta tags**: `title: 'Seja um Prestador Parceiro da Monumental Assistência'`, `path: '/seja-prestador.html'`, `description: 'Cadastre-se como prestador parceiro da Monumental Assistência e tenha acesso a uma demanda constante de serviços em sua região.'`, `ogImage: '/img/prestador-caminhao.jpg'`.

- [ ] **Step 8: Verificar visualmente e commit**

```bash
git add seja-prestador.html src/scripts/forms.js src/scripts/__tests__/forms.test.js src/scripts/main.js
git commit -m "Cria página Seja um Prestador com novo formulário de cadastro"
```

---

### Task 14: Página Trabalhe Conosco (`trabalhe-conosco.html`)

**Files:**
- Create: `trabalhe-conosco.html`

- [ ] **Step 1: Montar a página com o formulário existente** (nome, e-mail, telefone, mensagem opcional, upload de currículo PDF/DOC/DOCX até 5MB — textos e campos mantidos), trocando o `action` de `https://formsubmit.co/...` para `/api/enviar-trabalhe-conosco.php`, e adicionando o campo honeypot `website` (igual ao Task 13) e o elemento `.form-status`.

```html
<form id="form-trabalhe-conosco" action="/api/enviar-trabalhe-conosco.php" method="POST" enctype="multipart/form-data" class="space-y-6">
  <input type="text" name="website" class="hidden" tabindex="-1" autocomplete="off">
  <!-- demais campos: name, email, phone, message, attachment — mesma estrutura do site atual, classes atualizadas para o design system -->
  <p class="form-status text-center text-sm font-semibold"></p>
</form>
```

- [ ] **Step 2: Registrar em `main.js`**: `initForm(document.getElementById('form-trabalhe-conosco'), '/api/enviar-trabalhe-conosco.php');`

- [ ] **Step 3: Meta tags**: `title: 'Trabalhe Conosco - Monumental Assistência'`, `path: '/trabalhe-conosco.html'`, `description: 'Faça parte da equipe Monumental Assistência. Envie seu currículo e venha crescer com a gente.'`, `ogImage: '/img/equipe-trabalho.jpg'`.

- [ ] **Step 4: Verificar visualmente e commit**

```bash
git add trabalhe-conosco.html src/scripts/main.js
git commit -m "Cria página Trabalhe Conosco usando endpoint PHP próprio"
```

---

### Task 15: Página Contato (`contato.html`)

**Files:**
- Create: `contato.html`
- Create: `src/scripts/faq.js`
- Test: `src/scripts/__tests__/faq.test.js`

- [ ] **Step 1: Escrever teste da lógica de toggle do accordion**

```js
// src/scripts/__tests__/faq.test.js
import { describe, it, expect } from 'vitest';
import { toggleFaqState } from '../faq.js';

describe('toggleFaqState', () => {
  it('opens a closed item and closes the rest', () => {
    const state = { openIndex: null };
    const next = toggleFaqState(state, 2);
    expect(next.openIndex).toBe(2);
  });
  it('closes an already-open item when clicked again', () => {
    const state = { openIndex: 2 };
    const next = toggleFaqState(state, 2);
    expect(next.openIndex).toBe(null);
  });
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npx vitest run src/scripts/__tests__/faq.test.js`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Implementar `src/scripts/faq.js`**

```js
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
    });
  };

  items.forEach((item, i) => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      state = toggleFaqState(state, i);
      render();
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initFaq);
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `npx vitest run src/scripts/__tests__/faq.test.js`
Expected: PASS

- [ ] **Step 5: Montar `contato.html`** com: (1) mapa embed (iframe do Google Maps, mesma URL do site atual) + informações de contato (texto mantido); (2) endereço + redes sociais (Instagram/LinkedIn, mesmos links); (3) FAQ — as 7 perguntas/respostas mantidas na íntegra, usando `.faq-item` / `.faq-question` / `.faq-answer` / `.faq-icon` para o JS funcionar.

- [ ] **Step 6: Registrar `initFaq` em `main.js`**

- [ ] **Step 7: Adicionar o JSON-LD de `FAQPage`** (mesmo conteúdo do `index.html` atual, linhas 1173-1207) e também o JSON-LD de `AutomotiveBusiness` (mesmo bloco usado na Home, Task 9 Step 1) no `<head>` desta página — a spec pede `AutomotiveBusiness` tanto na home quanto em `/contato`, já que é a página com endereço/telefone/horário.

- [ ] **Step 8: Meta tags**: `title: 'Contato e Localização - Monumental Assistência em Betim/MG'`, `path: '/contato.html'`, `description: 'Fale com a Monumental Assistência: telefones 24h, e-mail, endereço em Betim/MG e perguntas frequentes sobre assistência veicular para associações.'`, `ogImage: '/img/logo.png'`.

- [ ] **Step 9: Verificar visualmente e commit**

```bash
git add contato.html src/scripts/faq.js src/scripts/__tests__/faq.test.js src/scripts/main.js
git commit -m "Cria página Contato com FAQ acessível e testado"
```

---

### Task 16: Página Regulamento (`regulamento.html`)

**Files:**
- Create: `regulamento.html`

- [ ] **Step 1: Migrar o conteúdo integral do modal de regulamento atual** (`index.html` linhas 936-1127: título, carências, condições gerais, os 10 serviços detalhados, pagamento de reembolso, eventos não cobertos, contatos) para uma página própria, usando `.section-light` como container e mantendo a hierarquia de headings (`h2` > `h3` > `h4`) e todas as listas exatamente como estão — é texto legal, não deve ser reescrito.

- [ ] **Step 2: Meta tags**: `title: 'Regulamento Monumental Assistência 24 Horas'`, `path: '/regulamento.html'`, `description: 'Regulamento completo dos serviços de assistência 24 horas da Monumental: carências, condições gerais, serviços cobertos e reembolsos.'`, `ogImage: '/img/logo.png'`. Adicionar `<meta name="robots" content="noindex, follow">` sobrescrevendo o valor do partial (texto legal extenso, não precisa competir por ranking).

- [ ] **Step 3: Verificar visualmente e commit**

```bash
git add regulamento.html
git commit -m "Migra Regulamento de modal para página própria"
```

---

### Task 17: Página Política de Privacidade (`politica-de-privacidade.html`)

**Files:**
- Create: `politica-de-privacidade.html`

- [ ] **Step 1: Migrar o conteúdo integral do modal de privacidade atual** (`index.html` linhas 1139-1149) para página própria, mesma estrutura da Task 16.

- [ ] **Step 2: Meta tags**: `title: 'Política de Privacidade - Monumental Assistência'`, `path: '/politica-de-privacidade.html'`, `description: 'Política de privacidade e uso de cookies da Monumental Assistência.'`, `ogImage: '/img/logo.png'`, com `<meta name="robots" content="noindex, follow">`.

- [ ] **Step 3: Verificar visualmente e commit**

```bash
git add politica-de-privacidade.html
git commit -m "Migra Política de Privacidade de modal para página própria"
```

---

## Fase D — Backend PHP (envio de e-mail)

### Task 18: Instalar PHPMailer standalone (sem Composer) e criar config

**Files:**
- Create: `public/api/lib/PHPMailer/` (arquivos baixados)
- Create: `public/api/config.example.php`
- Create: `public/api/.htaccess`

- [ ] **Step 1: Baixar os 3 arquivos standalone do PHPMailer** (não requer Composer/SSH — compatível com qualquer plano HostGator)

Run:
```bash
mkdir -p public/api/lib/PHPMailer
curl -sL https://raw.githubusercontent.com/PHPMailer/PHPMailer/v6.9.1/src/PHPMailer.php -o public/api/lib/PHPMailer/PHPMailer.php
curl -sL https://raw.githubusercontent.com/PHPMailer/PHPMailer/v6.9.1/src/SMTP.php -o public/api/lib/PHPMailer/SMTP.php
curl -sL https://raw.githubusercontent.com/PHPMailer/PHPMailer/v6.9.1/src/Exception.php -o public/api/lib/PHPMailer/Exception.php
```
Expected: 3 arquivos `.php` baixados em `public/api/lib/PHPMailer/`.

- [ ] **Step 2: Criar `public/api/config.example.php`** (versionado — valores fake, documenta o formato esperado)

```php
<?php
// Copie este arquivo para config.php e preencha com os dados reais
// da caixa de e-mail institucional (cPanel > Contas de E-mail).
// config.php é ignorado pelo git (.gitignore) — nunca commitar credenciais reais.
return [
    'smtp_host' => 'mail.monumentalassistencia.com.br',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl', // ou 'tls' na porta 587
    'smtp_user' => 'direcao@monumentalassistencia.com.br',
    'smtp_pass' => 'SENHA_AQUI',
    'to_email' => 'direcao@monumentalassistencia.com.br',
    'to_name' => 'Monumental Assistência',
];
```

- [ ] **Step 3: Criar `public/api/.htaccess`** para bloquear acesso direto a arquivos de config/lib

```apache
<FilesMatch "^config(\.example)?\.php$">
    Require all denied
</FilesMatch>
<IfModule mod_php.c>
    php_flag display_errors off
</IfModule>
```

- [ ] **Step 4: Commit** (config.php real NÃO é commitado — está no .gitignore desde a Task 1)

```bash
git add public/api/lib public/api/config.example.php public/api/.htaccess
git commit -m "Adiciona PHPMailer standalone e template de configuração SMTP"
```

---

### Task 19: Endpoint de validação compartilhada (testável via CLI, sem PHPUnit)

**Files:**
- Create: `public/api/lib/validation.php`
- Test: `public/api/tests/test_validation.php`

- [ ] **Step 1: Escrever o script de teste (assert manual, roda com `php` puro)**

```php
<?php
// public/api/tests/test_validation.php
require __DIR__ . '/../lib/validation.php';

function check(string $label, bool $condition): void {
    echo ($condition ? "PASS" : "FAIL") . " - $label\n";
    if (!$condition) {
        exit(1);
    }
}

check('rejeita e-mail inválido', is_valid_email('nao-e-email') === false);
check('aceita e-mail válido', is_valid_email('teste@exemplo.com') === true);
check('rejeita honeypot preenchido', is_spam_submission(['website' => 'bot']) === true);
check('aceita honeypot vazio', is_spam_submission(['website' => '']) === false);
check('sanitiza tags HTML de texto livre', sanitize_text('<script>a</script>Nome') === 'Nome');

echo "Todos os testes passaram.\n";
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `php public/api/tests/test_validation.php`
Expected: erro `Call to undefined function is_valid_email()` (arquivo `validation.php` ainda não existe).

- [ ] **Step 3: Implementar `public/api/lib/validation.php`**

```php
<?php

function is_valid_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function is_spam_submission(array $post): bool
{
    return !empty(trim($post['website'] ?? ''));
}

function sanitize_text(string $value): string
{
    $stripped = strip_tags($value);
    return trim($stripped);
}
```

- [ ] **Step 4: Rodar e confirmar sucesso**

Run: `php public/api/tests/test_validation.php`
Expected:
```
PASS - rejeita e-mail inválido
PASS - aceita e-mail válido
PASS - rejeita honeypot preenchido
PASS - aceita honeypot vazio
PASS - sanitiza tags HTML de texto livre
Todos os testes passaram.
```

- [ ] **Step 5: Commit**

```bash
git add public/api/lib/validation.php public/api/tests/test_validation.php
git commit -m "Adiciona validação/sanitização compartilhada para os formulários, com testes CLI"
```

---

### Task 20: Endpoint `enviar-trabalhe-conosco.php`

**Files:**
- Create: `public/api/enviar-trabalhe-conosco.php`

- [ ] **Step 1: Implementar o endpoint**

```php
<?php
require __DIR__ . '/lib/validation.php';
require __DIR__ . '/lib/PHPMailer/Exception.php';
require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

if (is_spam_submission($_POST)) {
    // Responde OK "silenciosamente" para não dar sinal ao bot, mas não envia e-mail.
    echo json_encode(['ok' => true]);
    exit;
}

$name = sanitize_text($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = sanitize_text($_POST['phone'] ?? '');
$message = sanitize_text($_POST['message'] ?? '');

if ($name === '' || !is_valid_email($email) || $phone === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_fields']);
    exit;
}

$config = require __DIR__ . '/config.php';

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($config['smtp_user'], 'Site Monumental');
    $mail->addAddress($config['to_email'], $config['to_name']);
    $mail->addReplyTo($email, $name);

    if (!empty($_FILES['attachment']['tmp_name']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        if ($_FILES['attachment']['size'] > 5 * 1024 * 1024) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'file_too_large']);
            exit;
        }
        $mail->addAttachment($_FILES['attachment']['tmp_name'], $_FILES['attachment']['name']);
    }

    $mail->Subject = 'Novo Currículo Recebido - Site Monumental';
    $mail->Body = "Nome: {$name}\nE-mail: {$email}\nTelefone: {$phone}\n\nMensagem:\n{$message}";

    $mail->send();
    echo json_encode(['ok' => true]);
} catch (PHPMailerException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}
```

- [ ] **Step 2: Verificar sintaxe PHP**

Run: `php -l public/api/enviar-trabalhe-conosco.php`
Expected: `No syntax errors detected`

- [ ] **Step 3: Commit**

```bash
git add public/api/enviar-trabalhe-conosco.php
git commit -m "Adiciona endpoint PHP para envio do formulário Trabalhe Conosco"
```

---

### Task 21: Endpoint `enviar-seja-prestador.php`

**Files:**
- Create: `public/api/enviar-seja-prestador.php`

- [ ] **Step 1: Implementar o endpoint** (mesma estrutura da Task 20, sem anexo, campos: nome, telefone, regiao, veiculo)

```php
<?php
require __DIR__ . '/lib/validation.php';
require __DIR__ . '/lib/PHPMailer/Exception.php';
require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

if (is_spam_submission($_POST)) {
    echo json_encode(['ok' => true]);
    exit;
}

$nome = sanitize_text($_POST['nome'] ?? '');
$telefone = sanitize_text($_POST['telefone'] ?? '');
$regiao = sanitize_text($_POST['regiao'] ?? '');
$veiculo = sanitize_text($_POST['veiculo'] ?? '');

if ($nome === '' || $telefone === '' || $regiao === '' || $veiculo === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_fields']);
    exit;
}

$config = require __DIR__ . '/config.php';

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($config['smtp_user'], 'Site Monumental');
    $mail->addAddress($config['to_email'], $config['to_name']);

    $mail->Subject = 'Novo Cadastro de Prestador - Site Monumental';
    $mail->Body = "Nome: {$nome}\nTelefone: {$telefone}\nRegião de atuação: {$regiao}\nTipo de veículo: {$veiculo}";

    $mail->send();
    echo json_encode(['ok' => true]);
} catch (PHPMailerException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}
```

- [ ] **Step 2: Verificar sintaxe PHP**

Run: `php -l public/api/enviar-seja-prestador.php`
Expected: `No syntax errors detected`

- [ ] **Step 3: Commit**

```bash
git add public/api/enviar-seja-prestador.php
git commit -m "Adiciona endpoint PHP para envio do formulário Seja um Prestador"
```

---

## Fase E — Assets (logo recolorido + imagens + SEO técnico)

### Task 22: Recolorir o logo existente para o tom bordô

**Files:**
- Create: `scripts/recolor-logo.py`
- Modify: `public/img/monumentalvermelha.png` (gerado pelo script a partir do original)

- [ ] **Step 1: Copiar as imagens atuais para `public/img/`**

Run: `mkdir -p public/img && cp img/*.png img/*.ico public/img/`

- [ ] **Step 2: Criar `scripts/recolor-logo.py`** (usa Pillow — troca o vermelho `#dc2626`/`#ef4444` pelo bordô `#9f1c2e`, preservando alpha/antialiasing)

```python
#!/usr/bin/env python3
"""Recolore o logo vermelho da Monumental para o tom bordô do redesign."""
from PIL import Image
import colorsys
import sys

SOURCE = "public/img/monumentalvermelha.png"
TARGET_HUE = colorsys.rgb_to_hsv(0x9f / 255, 0x1c / 255, 0x2e / 255)[0]


def recolor(path: str) -> None:
    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            # só recolore pixels realmente vermelhos (evita tocar em branco/preto/cinza)
            if s < 0.25 or v < 0.15:
                continue
            nr, ng, nb = colorsys.hsv_to_rgb(TARGET_HUE, s, v)
            pixels[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)

    img.save(path)
    print(f"Recolorido: {path}")


if __name__ == "__main__":
    recolor(SOURCE)
```

- [ ] **Step 2: Instalar dependência e rodar**

Run: `pip install --user Pillow && python3 scripts/recolor-logo.py`
Expected: `Recolorido: public/img/monumentalvermelha.png`

- [ ] **Step 3: Verificar visualmente o resultado**

Run: abrir `public/img/monumentalvermelha.png` (ex: via Read tool) e confirmar que o vermelho do escudo/texto ficou bordô, mantendo o desenho idêntico.

- [ ] **Step 4: Commit**

```bash
git add public/img scripts/recolor-logo.py
git commit -m "Recolore o logo existente para o tom bordô do redesign"
```

---

### Task 23: `sitemap.xml` e `robots.txt`

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

- [ ] **Step 1: Criar `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.monumentalassistencia.com.br/sitemap.xml
```

- [ ] **Step 2: Criar `public/sitemap.xml`** com as 9 páginas (regulamento e política com prioridade menor)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.monumentalassistencia.com.br/</loc><priority>1.0</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/sobre-nos.html</loc><priority>0.8</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/servicos.html</loc><priority>0.8</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/planos.html</loc><priority>0.8</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/seja-prestador.html</loc><priority>0.7</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/trabalhe-conosco.html</loc><priority>0.6</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/contato.html</loc><priority>0.8</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/regulamento.html</loc><priority>0.3</priority></url>
  <url><loc>https://www.monumentalassistencia.com.br/politica-de-privacidade.html</loc><priority>0.3</priority></url>
</urlset>
```

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt public/sitemap.xml
git commit -m "Adiciona sitemap.xml e robots.txt"
```

---

## Fase F — Build, verificação e deploy

### Task 24: Build de produção e checklist de QA manual

**Files:**
- Modify: nenhum (apenas verificação)

- [ ] **Step 1: Rodar todos os testes automatizados**

Run: `npm run test`
Expected: todos os testes de `src/scripts/__tests__/*.test.js` passam.

Run: `php public/api/tests/test_validation.php`
Expected: `Todos os testes passaram.`

- [ ] **Step 2: Gerar o build de produção**

Run: `npm run build`
Expected: pasta `dist/` criada com as 9 páginas `.html`, `assets/` (CSS/JS com hash), e `img/`, `api/`, `robots.txt`, `sitemap.xml` copiados de `public/`.

- [ ] **Step 3: Servir o build localmente e navegar por todas as páginas**

Run: `npm run preview`
Abrir cada uma das 9 URLs (`http://localhost:4173/`, `/sobre-nos.html`, `/servicos.html`, `/planos.html`, `/seja-prestador.html`, `/trabalhe-conosco.html`, `/contato.html`, `/regulamento.html`, `/politica-de-privacidade.html`) e conferir:
  - Header/footer/floating buttons aparecem em todas.
  - Nenhum erro no console do navegador.
  - Links de navegação levam à página correta.
  - FAQ abre/fecha, contador de números anima, slider de depoimentos navega.
  - Formulários mostram mensagem de status ao tentar enviar (o envio real de e-mail só funciona depois do deploy, com `config.php` preenchido no servidor).

- [ ] **Step 4: Commit** (se necessário, algum ajuste encontrado na verificação)

```bash
git add -A
git commit -m "Ajustes finais pós-QA do build de produção"
```

---

### Task 25: Documentar o processo de deploy no HostGator

**Files:**
- Create: `docs/deploy.md`

- [ ] **Step 1: Escrever o passo a passo de deploy**

```markdown
# Deploy no HostGator

1. Rodar `npm run build` localmente — gera a pasta `dist/`.
2. Copiar `public/api/config.example.php` para `public/api/config.php` e preencher com os
   dados reais da caixa de e-mail (cPanel > Contas de E-mail > `direcao@monumentalassistencia.com.br`).
   Rodar `npm run build` novamente após criar o `config.php` (ele é copiado de `public/` para `dist/`).
3. Via FTP ou File Manager do cPanel, enviar todo o conteúdo de `dist/` para `public_html/`
   (substituindo os arquivos atuais do site).
4. Confirmar em `https://www.monumentalassistencia.com.br/api/config.php` que o acesso retorna
   erro/403 (o `.htaccess` da Task 18 deve bloquear o acesso direto).
5. Testar os dois formulários em produção (Trabalhe Conosco e Seja um Prestador) e confirmar
   que o e-mail chega em `direcao@monumentalassistencia.com.br`.
6. No Google Search Console, submeter `https://www.monumentalassistencia.com.br/sitemap.xml`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/deploy.md
git commit -m "Documenta processo de deploy no HostGator"
```

---

## Fase G — Entregável final: prompts de imagem

### Task 26: Gerar os prompts de imagem para o ChatGPT

Esta tarefa não gera código — é o entregável de texto combinado com o usuário. Depois que as Tasks 1-25 estiverem completas (ou em paralelo, já que não depende delas tecnicamente), escrever um prompt por imagem necessária, cobrindo:

- Hero (`/img/hero-monumental.jpg`) — fotografia realista, full-bleed.
- Sobre Nós (`/img/sobre-equipe.jpg`) — fotografia realista.
- Frota Própria (`/img/frota-caminhao.jpg`) — fotografia realista.
- Seja Prestador (`/img/prestador-caminhao.jpg`) — fotografia realista.
- Trabalhe Conosco (`/img/equipe-trabalho.jpg`) — fotografia realista.
- Ícones 3D dos 5 serviços (reboque, chaveiro, bateria, pneu, combustível) — estilo 3D/clay render.

Cada prompt deve especificar: sem texto embutido, paleta bordô `#9f1c2e` + branco + preto/grafite, estilo (fotografia realista ou 3D), enquadramento, e o assunto exato da imagem.

- [ ] **Step 1: Escrever os prompts e entregar ao usuário no chat** (não é um arquivo do projeto — é a resposta final desta rodada de trabalho).
