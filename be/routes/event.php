<?php

if ($uri == "events") {
    if ($method == "GET") {
        // Tự cập nhật status theo thời gian trước khi trả về
        $eventModel->syncStatusByTime();

        if (isset($_GET["page"])) {
            $search = $_GET["search"] ?? "";
            $page = (int) ($_GET["page"] ?? 1);
            $limit = (int) ($_GET["limit"] ?? 10);

            $events = $eventModel->getAll($search, $page, $limit);
            $total = $eventModel->countAll($search);

            jsonResponse(true, "Success", [
                "events" => $events,
                "pagination" => [
                    "page" => $page,
                    "limit" => $limit,
                    "total" => (int) $total["total"],
                    "totalPage" => (int) ceil($total["total"] / $limit)
                ]
            ]);
        }

        jsonResponse(true, "Success", $eventModel->getAll());
    }

    if ($method == "POST") {
        checkAdmin();

        $thumbnail = "";

        if (isset($_FILES["thumbnail"])) {
            $file = $_FILES["thumbnail"];
            $fileName = time() . "_" . basename($file["name"]);
            $uploadPath = "assets/uploads/events/" . $fileName;

            move_uploaded_file($file["tmp_name"], $uploadPath);

            $thumbnail = $uploadPath;
        }

        $eventModel->create(
            $_POST["title"],
            $_POST["description"],
            $thumbnail,
            $_POST["start_time"],
            $_POST["end_time"],
            $_POST["max_participants"],
            $_POST["status"],
            $_POST["reward_effect"] ?? "neon"
        );

        jsonResponse(true, "Thêm sự kiện thành công");
    }
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && $urlParts[1] == "confirm"
) {
    $token = $_GET["token"] ?? "";

    $registration = $eventRegistrationModel->findByToken($token);

    if (!$registration) {
        jsonResponse(false, "Token không hợp lệ");
    }

    if ($registration["status"] == "confirmed") {
        jsonResponse(false, "Bạn đã xác nhận trước đó");
    }

    $eventRegistrationModel->confirm($registration["id"]);

    $message = $registration["full_name"] . " đã xác nhận tham gia sự kiện " . $registration["event_title"];

    $notificationModel->create(
        $registration["user_id"],
        $registration["event_id"],
        $message,
        "event_register"
    );

    jsonResponse(true, "Xác nhận tham gia sự kiện thành công");
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "register"
) {
    $authUser = checkAuth();

    $eventId = $urlParts[1];

    $event = $eventModel->findById($eventId);

    if (!$event) {
        jsonResponse(false, "Sự kiện không tồn tại");
    }

    if ($event["status"] == "ended" || $event["status"] == "cancelled") {
        jsonResponse(false, "Sự kiện đã kết thúc hoặc đã hủy");
    }

    if ((int)$event["registered_count"] >= (int)$event["max_participants"]) {
        jsonResponse(false, "Sự kiện đã đủ số lượng đăng ký");
    }

    $oldRegister = $eventRegistrationModel->findByUserAndEvent(
        $eventId,
        $authUser["id"]
    );

    if ($oldRegister) {
        jsonResponse(false, "Bạn đã đăng ký sự kiện này");
    }

    $token = md5(time() . $authUser["id"] . $eventId);

    $eventRegistrationModel->create(
        $eventId,
        $authUser["id"],
        $token
    );

    $sendMail = sendEventConfirmMail(
        $authUser["email"],
        $event["title"],
        $token
    );

    if (!$sendMail) {
        jsonResponse(false, "Đăng ký thành công nhưng gửi mail xác nhận thất bại");
    }

    jsonResponse(true, "Đăng ký thành công, vui lòng kiểm tra email để xác nhận");
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "registrations"
) {
    checkAdmin();

    $eventId = $urlParts[1];

    $page = (int) ($_GET["page"] ?? 1);
    $limit = (int) ($_GET["limit"] ?? 10);

    $registrations = $eventRegistrationModel->getByEvent($eventId, $page, $limit);
    $total = $eventRegistrationModel->countByEvent($eventId);

    jsonResponse(true, "Success", [
        "registrations" => $registrations,
        "pagination" => [
            "page" => $page,
            "limit" => $limit,
            "total" => (int) $total["total"],
            "totalPage" => (int) ceil($total["total"] / $limit)
        ]
    ]);
}

// GET /events/{id}/my-status - trạng thái đăng ký/check-in/thưởng của user hiện tại
if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "my-status"
) {
    $authUser = checkAuth();

    $eventId = $urlParts[1];

    $registration = $eventRegistrationModel->getRegistration(
        $eventId,
        $authUser["id"]
    );

    jsonResponse(true, "Success", [
        "registered" => $registration ? true : false,
        "status" => $registration["status"] ?? null,
        "checked_in" => ($registration && $registration["checked_in_at"]) ? true : false,
        "reward_claimed" => ($registration && $registration["reward_claimed_at"]) ? true : false
    ]);
}

// POST /events/{id}/checkin - người đã confirmed check-in khi event đang diễn ra
if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "checkin"
) {
    $authUser = checkAuth();

    $eventId = $urlParts[1];

    $eventModel->syncStatusByTime();
    $event = $eventModel->findById($eventId);

    if (!$event) {
        jsonResponse(false, "Sự kiện không tồn tại");
    }

    if ($event["status"] != "ongoing") {
        jsonResponse(false, "Chỉ có thể check-in khi sự kiện đang diễn ra");
    }

    $isConfirmed = $eventRegistrationModel->isConfirmed($eventId, $authUser["id"]);

    if (!$isConfirmed) {
        jsonResponse(false, "Bạn chưa xác nhận tham gia sự kiện");
    }

    $ok = $eventRegistrationModel->checkIn($eventId, $authUser["id"]);

    if (!$ok) {
        jsonResponse(false, "Bạn đã check-in trước đó");
    }

    // Tự chèn tin nhắn hệ thống vào group chat
    $eventMessageModel->create(
        $eventId,
        $authUser["id"],
        $authUser["full_name"] . " đã check-in sự kiện",
        1
    );

    jsonResponse(true, "Check-in thành công");
}

// POST /events/{id}/claim-reward - nhận thưởng sau khi event kết thúc (phải đã check-in)
if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "claim-reward"
) {
    $authUser = checkAuth();

    $eventId = $urlParts[1];

    $eventModel->syncStatusByTime();
    $event = $eventModel->findById($eventId);

    if (!$event) {
        jsonResponse(false, "Sự kiện không tồn tại");
    }

    if ($event["status"] != "ended") {
        jsonResponse(false, "Chỉ nhận thưởng khi sự kiện đã kết thúc");
    }

    $registration = $eventRegistrationModel->getRegistration($eventId, $authUser["id"]);

    if (!$registration || !$registration["checked_in_at"]) {
        jsonResponse(false, "Bạn chưa check-in nên không thể nhận thưởng");
    }

    $ok = $eventRegistrationModel->claimReward($eventId, $authUser["id"]);

    if (!$ok) {
        jsonResponse(false, "Bạn đã nhận thưởng trước đó");
    }

    jsonResponse(true, "Nhận thưởng thành công");
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && $urlParts[1] == "update"
    && isset($urlParts[2])
) {
    checkAdmin();

    $id = $urlParts[2];

    $oldEvent = $eventModel->findById($id);

    if (!$oldEvent) {
        jsonResponse(false, "Sự kiện không tồn tại");
    }

    $thumbnail = $oldEvent["thumbnail"];

    if (isset($_FILES["thumbnail"]) && $_FILES["thumbnail"]["error"] == 0) {
        if (!empty($oldEvent["thumbnail"]) && file_exists($oldEvent["thumbnail"])) {
            unlink($oldEvent["thumbnail"]);
        }

        $file = $_FILES["thumbnail"];
        $fileName = time() . "_" . basename($file["name"]);
        $uploadPath = "assets/uploads/events/" . $fileName;

        move_uploaded_file($file["tmp_name"], $uploadPath);

        $thumbnail = $uploadPath;
    }

    $eventModel->update(
        $id,
        $_POST["title"],
        $_POST["description"],
        $thumbnail,
        $_POST["start_time"],
        $_POST["end_time"],
        $_POST["max_participants"],
        $_POST["status"],
        $_POST["reward_effect"] ?? "neon"
    );

    jsonResponse(true, "Cập nhật sự kiện thành công");
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && !isset($urlParts[2])
) {
    $id = $urlParts[1];

    if ($method == "GET") {
        $eventModel->syncStatusByTime();
        jsonResponse(true, "Success", $eventModel->findById($id));
    }

    if ($method == "DELETE") {
        checkAdmin();

        $oldEvent = $eventModel->findById($id);

        if (!$oldEvent) {
            jsonResponse(false, "Sự kiện không tồn tại");
        }

        if (!empty($oldEvent["thumbnail"]) && file_exists($oldEvent["thumbnail"])) {
            unlink($oldEvent["thumbnail"]);
        }

        $eventModel->delete($id);

        jsonResponse(true, "Xóa sự kiện thành công");
    }
}