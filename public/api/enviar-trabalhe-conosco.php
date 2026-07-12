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
        if (!is_allowed_upload_type($_FILES['attachment']['name'], $_FILES['attachment']['tmp_name'])) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'invalid_file_type']);
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
