<?php
require_once __DIR__ . '/src/Firebase/JWT/JWT.php';
require_once __DIR__ . '/src/Firebase/JWT/Key.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('JWT_SECRET_KEY', 'meditrackproject'); // Use securely and store in .env in production

function generateJWT($payload, $key = JWT_SECRET_KEY, $expiration = 3600) {
    $issuedAt = time();
    $expire = $issuedAt + $expiration;

    $token = [
        "iat" => $issuedAt,
        "exp" => $expire,
        "data" => $payload
    ];

    return JWT::encode($token, $key, 'HS256');
}

function verifyJWT($jwt, $key = JWT_SECRET_KEY) {
    try {
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
        return (array)$decoded->data;
    } catch (Exception $e) {
        // Uncomment for debugging
        // error_log("JWT verification failed: " . $e->getMessage());
        return false;
    }
}

function getBearerToken() {
    $headers = apache_request_headers();
    if (isset($headers['Authorization']) && preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        return $matches[1];
    }
    return null;
}
?>