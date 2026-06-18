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

function getAuthHeader()
{
    if (function_exists("getallheaders")) {
        foreach (getallheaders() as $key => $value) {
            if (strtolower($key) === "authorization") {
                return $value;
            }
        }
    }
    if (isset($_SERVER["HTTP_AUTHORIZATION"])) {
        return $_SERVER["HTTP_AUTHORIZATION"];
    }
    if (isset($_SERVER["REDIRECT_HTTP_AUTHORIZATION"])) {
        return $_SERVER["REDIRECT_HTTP_AUTHORIZATION"];
    }
    return null;
}

function verifyToken()
{
    $authHeader = getAuthHeader();

    if (!$authHeader) {
        return null;
    }

    $token = trim(str_replace("Bearer", "", $authHeader));

    return json_decode(base64_decode($token), true);
}