# Monumental Assistência — Site Institucional

Site institucional da **Monumental Assistência**, especialista em assistência veicular 24h para associações de proteção veicular em Minas Gerais e em todo o Brasil.

**Produção:** [monumentalassistencia.com.br](https://monumentalassistencia.com.br/)

![Node](https://img.shields.io/badge/node-20-339933?logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![PHP](https://img.shields.io/badge/php-8.3-777BB4?logo=php&logoColor=white)
![Vitest](https://img.shields.io/badge/tests-vitest-6E9F18?logo=vitest&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

## Stack

- **[Vite](https://vitejs.dev/)** — build multi-página, sem dependência de CDN em produção
- **[Tailwind CSS](https://tailwindcss.com/)** compilado localmente, com design system próprio (tokens de cor, tipografia, componentes)
- **[GSAP](https://gsap.com/)** — animações de scroll-reveal, respeitando `prefers-reduced-motion`
- **[Lucide](https://lucide.dev/)** — ícones, importados individualmente (tree-shaking manual)
- **[Vitest](https://vitest.dev/)** — testes unitários da lógica de UI (nav, FAQ, formulários, contadores, etc.)
- **PHP 8 + [PHPMailer](https://github.com/PHPMailer/PHPMailer)** (standalone, sem Composer) — envio dos formulários via SMTP autenticado
- **[EJS](https://ejs.co/)** (via `vite-plugin-html`) — partials compartilhados entre as páginas (header, footer, meta tags)

O site é publicado como arquivos 100% estáticos (HTML/CSS/JS) — o build acontece localmente ou em CI, nunca no servidor. Ver [Deploy](#deploy).

## Estrutura do projeto

```
.
├── *.html                    # uma entrada por página (index, sobre-nos, servicos, ...)
├── src/
│   ├── partials/              # header, footer, meta tags — incluídos via EJS em cada página
│   ├── scripts/                # módulos JS, um por responsabilidade, com testes em __tests__/
│   └── styles/main.css         # design system (Tailwind @layer components)
├── public/
│   ├── img/                    # imagens servidas como estão (sem processamento do Vite)
│   └── api/                    # endpoints PHP (fora do bundle Vite)
│       ├── enviar-trabalhe-conosco.php
│       ├── enviar-seja-prestador.php
│       ├── lib/                # validação + PHPMailer standalone
│       ├── tests/              # testes CLI em PHP puro
│       └── config.example.php  # copiar para config.php com credenciais reais (git-ignorado)
├── scripts/
│   ├── optimize-image.py       # redimensiona/comprime fotos para uso web
│   └── recolor-logo.py         # utilitário usado para recolorir o logo na migração de marca
└── docs/
    ├── deploy.md                # passo a passo de publicação no HostGator
    └── superpowers/              # specs e planos de implementação do redesign
```

## Como rodar localmente

**Pré-requisitos:** Node.js 20 (ver `.nvmrc`), PHP 8+ (só necessário para testar os endpoints de e-mail).

```bash
npm install
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
```

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento com hot reload |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente, pra conferir antes de publicar |
| `npm test` | Roda os testes unitários (Vitest) |
| `php public/api/tests/test_validation.php` | Roda os testes da validação/sanitização dos formulários |

## Formulários e e-mail

Os formulários **Trabalhe Conosco** e **Seja um Prestador** enviam e-mail via SMTP autenticado na caixa institucional, usando PHPMailer. Para testar localmente:

```bash
cp public/api/config.example.php public/api/config.php
# edite public/api/config.php com host/porta/usuário/senha reais do SMTP
```

`config.php` nunca é commitado (está no `.gitignore`). Em produção, o `.htaccess` da pasta `api/` bloqueia o acesso direto a esse arquivo.

## Deploy

O site é hospedado na HostGator como arquivos estáticos. O passo a passo completo — incluindo configuração do SMTP em produção e submissão do sitemap ao Google Search Console — está em [`docs/deploy.md`](docs/deploy.md).

## Licença

Distribuído sob a licença MIT — ver [`LICENSE`](LICENSE).
