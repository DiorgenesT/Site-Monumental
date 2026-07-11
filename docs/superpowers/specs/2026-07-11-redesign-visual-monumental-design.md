# Redesign Visual — Site Monumental Assistência

## Contexto e objetivo

O site atual (`index.html` + `style.css` + `script.js`) é uma landing page única, construída com Tailwind via CDN, GSAP e Lucide, com paleta vermelho/branco/cinza-escuro. Funciona, mas o visual está datado e todas as imagens são placeholders ou fotos genéricas.

Objetivo: redesenhar o visual (UI/UX) mantendo textos e títulos existentes (ajustando apenas pontos pontuais sinalizados abaixo), trocar todas as imagens de conteúdo por um conjunto novo e consistente, reforçar o SEO, e entregar prompts prontos para gerar as novas imagens via ChatGPT.

## Stack técnica

- Migrar para **Vite** como ferramenta de build local. Não há mudança no destino do deploy: o output de `vite build` é uma pasta `dist/` 100% estática (HTML/CSS/JS + assets), enviada ao HostGator via FTP/File Manager exatamente como hoje. O HostGator nunca executa Node/Vite — só serve arquivos prontos.
- Tailwind CSS compilado localmente (não mais via CDN), instalado como dependência de build.
- GSAP e Lucide instalados via npm e empacotados no bundle, no lugar dos `<script src="cdn...">` atuais.
- Motivo: elimina dependência de servidores de terceiros no ar, reduz tempo de carregamento (melhora Core Web Vitals / LCP), e organiza o código em módulos por página/componente.
- Exceção: os **endpoints de envio de formulário** (ver seção Backend de Formulários) rodam em PHP no HostGator — não fazem parte do bundle Vite, ficam como arquivos PHP separados dentro da estrutura publicada.

## Estrutura de páginas (multi-página)

Divisão por tema, uma URL por página (melhora indexação para buscas específicas):

| Página | Conteúdo (origem na versão atual) |
|---|---|
| `/` (Home) | Hero + resumo de serviços + números + CTA final |
| `/sobre-nos` | Sobre a Monumental + Frota Própria (BH e região) + Por Que Escolher |
| `/servicos` | Os 5 serviços detalhados (reboque, chaveiro, bateria, pneu, pane seca) |
| `/planos` | Plano Gestão / Plano Fixo + benefícios + Como Funciona (timeline) + depoimentos |
| `/seja-prestador` | Seção "Quero Ser um Prestador" + novo formulário de cadastro |
| `/trabalhe-conosco` | Formulário de envio de currículo |
| `/contato` | Localização (mapa + endereço) + FAQ + telefones |
| `/regulamento` | Conteúdo do modal de regulamento atual, como página própria |
| `/politica-de-privacidade` | Conteúdo do modal de privacidade atual, como página própria |

Header, footer, floating buttons (assistência/WhatsApp e regulamento) e cookie banner são componentes compartilhados entre todas as páginas.

## Direção visual

**Estilo**: "Corporate Premium" — fundo predominantemente claro/branco em quase todas as seções (opção A da votação: "Predominantemente Claro"). Contraste forte reservado ao hero (full-bleed) e ao rodapé; nenhuma seção de conteúdo usa fundo escuro por padrão.

**Paleta**:
- Vermelho bordô corporativo como cor de marca: `#9f1c2e` → `#7a1522` (gradientes, títulos em destaque, botões, ícones). Substitui o `red-600/700/800` (Tailwind) usado hoje.
- Branco (`#ffffff`) e cinza-clarinho (`#faf7f7` / `#f5f5f5`) como fundos dominantes.
- Preto/grafite (`#111214` a `#1a1a1a`) reservado para hero (overlay) e rodapé.

**Tipografia**: mantém Inter (Google Fonts), já adequada ao estilo — pesos 400/600/700/900 como hoje.

**Hero (Home)**: foto full-bleed (100% da largura) com overlay escuro/bordô, texto e CTA centralizados sobre a imagem — layout mais cinematográfico que o split atual (texto esquerda / imagem direita).

**Componentes**: cards com sombra suave e cantos arredondados nas seções de planos, serviços, números, depoimentos e FAQ, seguindo a linha "Corporate Premium".

## Estratégia de imagens

- **Fotografia realista** (grading de cor puxando para bordô/preto) para: Hero, Sobre Nós, Frota Própria, Seja Prestador.
- **Estilo 3D/ícone leve** (tipo "clay render") para os cards da seção Serviços (reboque, chaveiro, carga de bateria, troca de pneu, pane seca).
- **Logo da empresa mantido** (`monumentalbranca.png`, `monumentalvermelha.png`, `logo.png`, favicon) — não é gerado via IA, apenas recolorido: a versão vermelha do logo (`monumentalvermelha.png`) tem seu tom de vermelho ajustado para o bordô `#9f1c2e`, preservando forma e identidade da marca.
- Depoimentos: os logos placeholder "ASSOCIAÇÃO A/B/C" são removidos — cada card de depoimento passa a usar um ícone/avatar genérico (sem simular ser uma associação real).
- Entregável final do projeto: lista de prompts (um por imagem nova) para gerar no ChatGPT — sem texto embutido nas imagens, com direção de cor/estilo consistente com o tema bordô/branco definido acima.

## Conteúdo — ajustes pontuais

Textos e títulos existentes são mantidos. Ajustes sinalizados:

1. **Depoimentos** (seção Parceiros): mantém as 3 frases de depoimento como estão; troca os cargos fictícios (ex: "Gestor", "Diretora", "Presidente") por algo neutro como "Gestor de Associação Parceira"; remove os logos placeholder de associação.
2. **Rodapé — ano de copyright**: substituir o valor fixo "2024" por `new Date().getFullYear()` (calculado em JS no carregamento da página), eliminando a necessidade de atualização manual todo ano.
3. **Rodapé — crédito do desenvolvedor**: reestilizar "Desenvolvido por DG":
   - Marca "DG": duas letras brancas (D e G), cada uma dentro de um bloco preto quadrado separado (sem cantos arredondados), com inclinação sutil (±6°, uma para cada lado).
   - Link atualizado para `https://diorgenesgeorge.dev`.
   - Interação de hover perceptível (scale-up leve + glow/underline animado) para convidar ao clique.
4. Sem seção de blog nesta fase — projeto fica focado nas 9 páginas institucionais listadas acima.

## Backend de formulários (novo)

Hoje "Trabalhe Conosco" usa FormSubmit.co (serviço terceiro gratuito). Nova abordagem, sem custo adicional:

- Endpoints em **PHP** (compatível com hospedagem HostGator, incluído no plano), usando **PHPMailer via SMTP autenticado** na caixa de e-mail institucional `direcao@monumentalassistencia.com.br` (já disponível no cPanel do domínio).
- Dois formulários alimentam o mesmo destinatário:
  - **Trabalhe Conosco** (existente): nome, e-mail, telefone, mensagem, anexo de currículo (PDF/DOC/DOCX, máx. 5MB).
  - **Seja um Prestador** (novo): nome, telefone, cidade/região de atuação, tipo de veículo. O botão de WhatsApp existente é mantido como alternativa rápida ao formulário.
- Proteções mínimas: honeypot (campo invisível anti-bot), verificação de tempo mínimo entre carregamento e envio, validação e sanitização de todos os campos no servidor (nunca confiar somente na validação client-side), sem expor credenciais SMTP no código-fonte (config fora do diretório público ou variável de ambiente suportada pelo cPanel).

## SEO

- Meta tags (`title`, `description`, `keywords`), Open Graph e Twitter Card **por página** (hoje só existem na home).
- JSON-LD (schema.org) por página: `AutomotiveBusiness` na home/contato, `FAQPage` em `/contato`, mantendo dados já existentes (endereço, telefones, horário, área atendida).
- `sitemap.xml` e `robots.txt` na raiz do site.
- URL canônica correta em cada página (hoje aponta fixo para a home em todas).
- Alt-text descritivo em todas as imagens novas (já era boa prática no site atual — manter o padrão).
- Performance: eliminar scripts/CSS de CDN externos (ver Stack técnica) para melhorar Core Web Vitals (LCP/CLS/INP).

## Fora de escopo (confirmado com o usuário)

- Blog/seção de artigos — fica para uma fase futura.
- Novo logotipo — o logo atual é mantido (só recolorido para o tom bordô), não será gerado via IA.
