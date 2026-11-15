<?php
require __DIR__.'/lib.php';
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
[$status, $body] = demo_handle($_SERVER['REQUEST_METHOD'], $path, $_GET, file_get_contents('php://input', false, null, 0, 8001));
http_response_code($status);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
echo json_encode($body, JSON_THROW_ON_ERROR);
