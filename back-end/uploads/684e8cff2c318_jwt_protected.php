<?php
include 'jwt_helper.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace("Bearer ", "", $authHeader);

try {
    $decoded = validate_jwt($token);
    $user = $decoded->data;

    echo json_encode([
        'status' => 'success',
        'message' => 'Access granted',
        'user' => $user
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token',
        'error' => $e->getMessage()
    ]);
}
?>