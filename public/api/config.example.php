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
