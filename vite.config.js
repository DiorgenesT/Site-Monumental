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
