<?php
// Copie este arquivo para config.php e preencha com os dados reais.
// config.php é ignorado pelo git (.gitignore) — nunca commitar credenciais reais.
//
// smtp_user/smtp_pass devem ser de uma caixa dedicada ao envio automático
// (ex: naoresponda@monumentalassistencia.com.br), não a caixa de uso diário
// da empresa — assim ninguém precisa trocar a própria senha de e-mail.
// to_email é quem recebe os formulários (pode ser a caixa da empresa normal).
return [
    'smtp_host' => 'mail.monumentalassistencia.com.br',
    'smtp_port' => 465,
    'smtp_secure' => 'ssl', // ou 'tls' na porta 587
    'smtp_user' => 'naoresponda@monumentalassistencia.com.br',
    'smtp_pass' => 'SENHA_AQUI',
    'to_email' => 'direcao@monumentalassistencia.com.br',
    'to_name' => 'Monumental Assistência',
];
