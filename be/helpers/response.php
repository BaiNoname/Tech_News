<?php

function jsonResponse($success, $message, $data = null)
{
    header("Content-Type: application/json; charset=utf-8");

    $json = json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // Nếu encode lỗi (vd chuỗi không phải UTF-8 hợp lệ), thử ép UTF-8 rồi encode lại
    if ($json === false) {
        $json = json_encode([
            "success" => $success,
            "message" => is_string($message) ? mb_convert_encoding($message, "UTF-8", "UTF-8") : $message,
            "data" => $data
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
    }

    echo $json;

    exit;
}