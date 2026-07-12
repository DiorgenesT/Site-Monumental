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
check('sanitiza tags HTML de texto livre', sanitize_text('<b>Nome</b> <i>Sobrenome</i>') === 'Nome Sobrenome');

check('rejeita envio sem elapsed_ms (ausente = suspeito)', is_too_fast(null) === true);
check('rejeita envio com elapsed_ms inválido', is_too_fast('abc') === true);
check('rejeita envio enviado rápido demais', is_too_fast('500') === true);
check('aceita envio enviado no tempo normal', is_too_fast('5000') === false);

check('rejeita extensão não permitida (mesmo com MIME válido no meio)', is_allowed_upload_type('virus.exe', __DIR__ . '/fixtures/fake.pdf') === false);

$fixturesDir = __DIR__ . '/fixtures';
if (!is_dir($fixturesDir)) {
    mkdir($fixturesDir);
}

$realPdfPath = $fixturesDir . '/real.pdf';
file_put_contents($realPdfPath, "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF");
check('aceita PDF de verdade com extensão .pdf', is_allowed_upload_type('curriculo.pdf', $realPdfPath) === true);

$fakePdfPath = $fixturesDir . '/fake.pdf';
file_put_contents($fakePdfPath, "isso aqui não é um PDF de verdade, é só texto puro");
check('rejeita arquivo de texto disfarçado de .pdf (extensão mentindo sobre o conteúdo)', is_allowed_upload_type('curriculo.pdf', $fakePdfPath) === false);

unlink($realPdfPath);
unlink($fakePdfPath);
rmdir($fixturesDir);

echo "Todos os testes passaram.\n";
