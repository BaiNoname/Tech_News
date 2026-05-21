<?php

require_once __DIR__ . '/../config/env.php';

function generateToken($user)
{
    $payload = [
        "id" => $user["id"],
        "email" => $user["email"],
        "role" => $user["role"],
        "time" => time()
    ];

    return base64_encode(json_encode($payload));
}

function verifyToken()
{
    $headers = getallheaders();

    if (!isset($headers["Authorization"])) {
        return null;
    }

    $token = str_replace("Bearer ", "", $headers["Authorization"]);

    return json_decode(base64_decode($token), true);
}