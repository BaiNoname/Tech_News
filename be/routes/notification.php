<?php

if ($uri == "notifications/latest") {
    // Tự động quét & tạo thông báo cho các sự kiện vừa kết thúc
    $notificationModel->generateEndedEventNotifications();

    jsonResponse(
        true,
        "Success",
        $notificationModel->latest()
    );
}