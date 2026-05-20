<?php

require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/response.php';

function checkAuth()
{
    $user = verifyToken();

    if (!$user) {
        jsonResponse(false, "Unauthorized");
    }

    return $user;
}

function checkAdmin()
{
    $user = checkAuth();

    if ($user["role"] != "admin") {
        jsonResponse(false, "Access denied");
    }

    return $user;
}