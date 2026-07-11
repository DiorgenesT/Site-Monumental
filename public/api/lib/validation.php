<?php

function is_valid_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function is_spam_submission(array $post): bool
{
    return !empty(trim($post['website'] ?? ''));
}

function sanitize_text(string $value): string
{
    $stripped = strip_tags($value);
    return trim($stripped);
}
