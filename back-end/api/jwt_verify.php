<?php
require_once '../helpers/jwt_helper.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(["message" => "Access Denied"]);
    exit;
}

$token = trim(str_replace('Bearer', '', $authHeader));
$data = verifyJWT($token, $secret_key);

if (!$data) {
    http_response_code(401);
    echo json_encode(["message" => "Invalid Token"]);
    exit;
}

// 👇 Protected content
echo json_encode(["message" => "Welcome to protected API!", "user" => $data]);
?>