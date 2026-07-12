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

function is_too_fast(?string $elapsedMs, int $minimumMs = 3000): bool
{
    if ($elapsedMs === null || !is_numeric($elapsedMs)) {
        return true;
    }
    return (int) $elapsedMs < $minimumMs;
}

function is_allowed_upload_type(string $filename, string $tmpPath): bool
{
    $allowedExtensions = ['pdf', 'doc', 'docx'];
    $allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip', // .docx é um zip por baixo; alguns finfo reportam assim
    ];

    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions, true)) {
        return false;
    }

    if (!is_file($tmpPath)) {
        return false;
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $tmpPath);
    finfo_close($finfo);

    return in_array($mime, $allowedMimes, true);
}
