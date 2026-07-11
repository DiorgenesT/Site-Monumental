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

echo "Todos os testes passaram.\n";
