<?php

// GET /profile/me - thông tin user hiện tại + danh sách hiệu ứng đã mở khóa
if ($uri == "profile/me") {
    $authUser = checkAuth();

    $user = $userModel->findById($authUser["id"]);

    if (!$user) {
        jsonResponse(false, "Không tìm thấy user");
    }

    $user["unlocked_effects"] = $userModel->getUnlockedEffects($authUser["id"]);

    jsonResponse(true, "Success", $user);
}

// POST /profile/avatar - upload ảnh đại diện
if ($uri == "profile/avatar") {
    $authUser = checkAuth();

    if ($method != "POST") {
        jsonResponse(false, "Method không hợp lệ");
    }

    if (!isset($_FILES["avatar"]) || $_FILES["avatar"]["error"] != 0) {
        jsonResponse(false, "Vui lòng chọn ảnh hợp lệ");
    }

    $file = $_FILES["avatar"];

    $allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!in_array($file["type"], $allowed)) {
        jsonResponse(false, "Chỉ chấp nhận ảnh JPG, PNG, GIF, WEBP");
    }

    if ($file["size"] > 3 * 1024 * 1024) {
        jsonResponse(false, "Ảnh tối đa 3MB");
    }

    $dir = "assets/uploads/avatars";
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $fileName = time() . "_" . $authUser["id"] . "_" . basename($file["name"]);
    $uploadPath = $dir . "/" . $fileName;

    if (!move_uploaded_file($file["tmp_name"], $uploadPath)) {
        jsonResponse(false, "Upload thất bại");
    }

    $userModel->updateAvatar($authUser["id"], $uploadPath);

    jsonResponse(true, "Cập nhật ảnh đại diện thành công", [
        "avatar" => $uploadPath
    ]);
}

// PUT /profile/effect - gắn hiệu ứng lên avatar (phải đã mở khóa)
if ($uri == "profile/effect") {
    $authUser = checkAuth();

    if ($method != "PUT") {
        jsonResponse(false, "Method không hợp lệ");
    }

    $effect = $data["effect"] ?? "none";

    $unlocked = $userModel->getUnlockedEffects($authUser["id"]);

    if (!in_array($effect, $unlocked)) {
        jsonResponse(false, "Bạn chưa mở khóa hiệu ứng này");
    }

    $userModel->updateEquippedEffect($authUser["id"], $effect);

    jsonResponse(true, "Đã gắn hiệu ứng", [
        "equipped_effect" => $effect
    ]);
}