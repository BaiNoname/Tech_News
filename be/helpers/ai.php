<?php

require_once __DIR__ . '/../config/env.php';

/**
 * Gọi Groq API (endpoint kiểu OpenAI). Trả về mảng [ok, text, error].
 */
function askGroq($systemPrompt, $userMessage)
{
    $apiKey = GROQ_API_KEY;
    $model = GROQ_MODEL;

    if (empty($apiKey) || strpos($apiKey, "DAN_KEY") !== false) {
        return ["ok" => false, "text" => null, "error" => "Chưa cấu hình GROQ_API_KEY trong env.php"];
    }

    $url = "https://api.groq.com/openai/v1/chat/completions";

    $payload = [
        "model" => $model,
        "temperature" => 0.4,
        "max_tokens" => 600,
        "messages" => [
            ["role" => "system", "content" => $systemPrompt],
            ["role" => "user", "content" => $userMessage]
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer " . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    // XAMPP Windows thường thiếu CA cert -> tắt verify cho môi trường dev
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return ["ok" => false, "text" => null, "error" => "cURL lỗi: " . $curlErr];
    }

    $result = json_decode($response, true);

    if (isset($result["error"])) {
        return [
            "ok" => false,
            "text" => null,
            "error" => "Groq (" . $httpCode . "): " . ($result["error"]["message"] ?? "lỗi không rõ")
        ];
    }

    if (isset($result["choices"][0]["message"]["content"])) {
        return ["ok" => true, "text" => trim($result["choices"][0]["message"]["content"]), "error" => null];
    }

    return ["ok" => false, "text" => null, "error" => "Phản hồi không có nội dung: " . substr($response, 0, 300)];
}