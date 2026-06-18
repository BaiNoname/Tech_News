<?php

// POST /events/{id}/assistant - trợ lý AI cho group chat sự kiện
if (
    isset($urlParts[0])
    && $urlParts[0] == "events"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "assistant"
) {
    $authUser = checkAuth();

    if ($method != "POST") {
        jsonResponse(false, "Method không hợp lệ");
    }

    $eventId = $urlParts[1];

    // Lấy thông tin user từ DB (token có thể không chứa full_name)
    $currentUser = $userModel->findById($authUser["id"]);
    $userName = $currentUser["full_name"] ?? "Người dùng";

    $eventModel->syncStatusByTime();
    $event = $eventModel->findById($eventId);

    if (!$event) {
        jsonResponse(false, "Sự kiện không tồn tại");
    }

    $question = trim($data["message"] ?? "");

    if ($question == "") {
        jsonResponse(false, "Vui lòng nhập câu hỏi");
    }

    $reg = $eventRegistrationModel->getRegistration($eventId, $authUser["id"]);

    $statusText = "chưa đăng ký";
    $checkinText = "chưa check-in";
    $rewardText = "chưa nhận thưởng";

    if ($reg) {
        $statusText = "đã đăng ký (trạng thái: " . $reg["status"] . ")";
        $checkinText = $reg["checked_in_at"] ? "đã check-in lúc " . $reg["checked_in_at"] : "chưa check-in";
        $rewardText = $reg["reward_claimed_at"] ? "đã nhận thưởng" : "chưa nhận thưởng";
    }

    $statusVi = $event["status"];
    if ($event["status"] == "upcoming") $statusVi = "sắp diễn ra";
    if ($event["status"] == "ongoing") $statusVi = "đang diễn ra";
    if ($event["status"] == "ended") $statusVi = "đã kết thúc";

    $systemPrompt = "Bạn là trợ lý AI thân thiện cho một sự kiện công nghệ. "
        . "Trả lời ngắn gọn, lịch sự bằng tiếng Việt. "
        . "CHỈ trả lời dựa trên thông tin sự kiện dưới đây, không bịa thêm. "
        . "Nếu câu hỏi nằm ngoài phạm vi thông tin này, hãy nói bạn không có thông tin đó.\n\n"
        . "=== THÔNG TIN SỰ KIỆN ===\n"
        . "Tên: " . $event["title"] . "\n"
        . "Mô tả: " . $event["description"] . "\n"
        . "Thời gian bắt đầu: " . $event["start_time"] . "\n"
        . "Thời gian kết thúc: " . $event["end_time"] . "\n"
        . "Trạng thái hiện tại: " . $statusVi . "\n"
        . "Số người đã đăng ký xác nhận: " . ($event["registered_count"] ?? 0) . "/" . $event["max_participants"] . "\n\n"
        . "=== TRẠNG THÁI CỦA NGƯỜI DÙNG HIỆN TẠI ===\n"
        . "Tên: " . $userName . "\n"
        . "Đăng ký: " . $statusText . "\n"
        . "Check-in: " . $checkinText . "\n"
        . "Phần thưởng: " . $rewardText . "\n\n"
        . "Quy tắc check-in: chỉ người đã xác nhận (confirmed) mới check-in được, và chỉ khi sự kiện đang diễn ra. "
        . "Nhận thưởng: chỉ khi sự kiện đã kết thúc VÀ người dùng đã check-in.";

    $result = askGroq($systemPrompt, $question);

    if (!$result["ok"]) {
        jsonResponse(false, $result["error"]);
    }

    jsonResponse(true, "Success", ["answer" => $result["text"]]);
}