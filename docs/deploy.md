# Deploy no HostGator

## Deploy automático (recomendado)

Todo push na branch `main` dispara o workflow `.github/workflows/deploy.yml`, que builda o site
e publica o resultado em `public_html/` na HostGator via FTP.

### Configuração única (Secrets do GitHub)

Em **Settings > Secrets and variables > Actions** do repositório, cadastre:

| Secret | Valor |
|---|---|
| `FTP_SERVER` | Endereço do servidor FTP da HostGator (cPanel > Contas FTP) |
| `FTP_USERNAME` | Usuário FTP (geralmente `usuario@monumentalassistencia.com.br`) |
| `FTP_PASSWORD` | Senha FTP |
| `SMTP_HOST` | `mail.monumentalassistencia.com.br` (convenção padrão HostGator) |
| `SMTP_PORT` | Porta SMTP (ex: `465`) |
| `SMTP_SECURE` | `ssl` (porta 465) ou `tls` (porta 587) |
| `SMTP_USER` | Caixa **dedicada** ao envio automático, ex: `naoresponda@monumentalassistencia.com.br` |
| `SMTP_PASS` | Senha dessa caixa dedicada |

**Importante:** `SMTP_USER`/`SMTP_PASS` devem ser de uma caixa criada só para o site enviar
e-mails (ex: `naoresponda@monumentalassistencia.com.br`) — **nunca** a caixa `direcao@` que a
empresa usa no dia a dia, para não precisar trocar a senha dela. O destino dos formulários
(`direcao@monumentalassistencia.com.br`) é fixo no workflow e não depende de Secret.

O `public/api/config.php` é **gerado automaticamente** a partir desses Secrets a cada deploy —
nunca precisa ser enviado manualmente, e nunca é apagado pela sincronização.

⚠️ O workflow usa `dangerous-clean-slate: true`, ou seja, **apaga em `public_html/` qualquer
arquivo que não faça parte do novo build** (isso é intencional, para substituir o site antigo
por completo). A pasta `.well-known/` — usada por certificados SSL — é preservada. Se houver
qualquer outra coisa em `public_html/` que não deva ser apagada, ajuste a lista `exclude` no
workflow antes do primeiro deploy.

### Rodando manualmente

Além do push automático, o workflow pode ser disparado a qualquer momento em **Actions > Deploy
para HostGator > Run workflow**.

## Deploy manual (alternativa/fallback)

1. Rodar `npm install` (primeira vez) e `npm run build` localmente — gera a pasta `dist/`.
2. Copiar `public/api/config.example.php` para `public/api/config.php` e preencher com os
   dados reais da caixa de e-mail dedicada ao envio (`naoresponda@...`, não a `direcao@...` de
   uso diário). Rodar `npm run build` novamente após criar o `config.php` (ele é copiado de
   `public/` para `dist/` no build).
3. Via FTP ou File Manager do cPanel, enviar todo o conteúdo de `dist/` para `public_html/`.
   Pode excluir `dist/api/tests/` do envio — é só o script de teste local.
4. Confirmar em `https://www.monumentalassistencia.com.br/api/config.php` que o acesso retorna
   erro/403 (o `.htaccess` da pasta `api/` deve bloquear o acesso direto a `config.php`).

## Checklist pós-deploy (qualquer um dos dois métodos)

1. Testar os dois formulários em produção (Trabalhe Conosco e Seja um Prestador) e confirmar
   que o e-mail chega em `direcao@monumentalassistencia.com.br`.
2. No Google Search Console, submeter `https://www.monumentalassistencia.com.br/sitemap.xml`.
3. Trocar as imagens temporárias em `public/img/` (sobre-equipe.jpg, frota-caminhao.jpg,
   prestador-caminhao.jpg, equipe-trabalho.jpg, servico-reboque.jpg, planos-atendimento.jpg)
   pelas imagens finais geradas via IA antes de considerar o site pronto para produção — ver
   prompts entregues separadamente.
