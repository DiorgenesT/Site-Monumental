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

if (is_spam_submission($_POST) || is_too_fast($_POST['elapsed_ms'] ?? null)) {
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
