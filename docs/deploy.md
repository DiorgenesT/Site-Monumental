# Deploy no HostGator

1. Rodar `npm install` (primeira vez) e `npm run build` localmente — gera a pasta `dist/`.
2. Copiar `public/api/config.example.php` para `public/api/config.php` e preencher com os
   dados reais da caixa de e-mail (cPanel > Contas de E-mail > `direcao@monumentalassistencia.com.br`:
   host SMTP, porta, usuário e senha). Rodar `npm run build` novamente após criar o `config.php`
   (ele é copiado de `public/` para `dist/` no build).
3. Via FTP ou File Manager do cPanel, enviar todo o conteúdo de `dist/` para `public_html/`
   (substituindo os arquivos atuais do site). Pode excluir `dist/api/tests/` do envio — é só o
   script de teste local, não precisa ir para produção.
4. Confirmar em `https://www.monumentalassistencia.com.br/api/config.php` que o acesso retorna
   erro/403 (o `.htaccess` da pasta `api/` deve bloquear o acesso direto a `config.php`).
5. Testar os dois formulários em produção (Trabalhe Conosco e Seja um Prestador) e confirmar
   que o e-mail chega em `direcao@monumentalassistencia.com.br`.
6. No Google Search Console, submeter `https://www.monumentalassistencia.com.br/sitemap.xml`.
7. Trocar as imagens temporárias em `public/img/` (hero-monumental.jpg, sobre-equipe.jpg,
   frota-caminhao.jpg, prestador-caminhao.jpg, equipe-trabalho.jpg, servico-reboque.jpg,
   planos-atendimento.jpg) pelas imagens finais geradas via IA antes de considerar o site
   pronto para produção — ver prompts entregues separadamente.
