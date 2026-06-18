<?php

if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "messages"
) {
    $authUser = checkAuth();

    $eventId = $urlParts[1];

    $event = $eventModel->findById($eventId);

    if (!$event) {
        jsonResponse(false, "Sự kiện không tồn tại");
    }

    $isConfirmed = $eventRegistrationModel->isConfirmed(
        $eventId,
        $authUser["id"]
    );

    // Admin luôn được vào group chat để gửi thông báo hệ thống
    if (!$isConfirmed && $authUser["role"] != "admin") {
        jsonResponse(false, "Bạn chưa xác nhận tham gia sự kiện");
    }

    if ($method == "GET") {
        jsonResponse(
            true,
            "Success",
            $eventMessageModel->getByEvent($eventId)
        );
    }

    if ($method == "POST") {
        if ($event["status"] == "ended" || $event["status"] == "cancelled") {
            jsonResponse(false, "Sự kiện đã kết thúc, không thể chat");
        }

        // Admin có thể gửi tin nhắn hệ thống (thông báo) bằng cờ is_system
        $isSystem = 0;
        if (!empty($data["is_system"]) && $authUser["role"] == "admin") {
            $isSystem = 1;
        }

        $eventMessageModel->create(
            $eventId,
            $authUser["id"],
            $data["message"],
            $isSystem
        );

        jsonResponse(true, "Gửi tin nhắn thành công");
    }
}