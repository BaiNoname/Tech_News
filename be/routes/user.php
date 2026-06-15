<?php

if ($uri == "users") {
    checkAdmin();

    if ($method == "GET") {
        $search = $_GET["search"] ?? "";
        $page = (int) ($_GET["page"] ?? 1);
        $limit = (int) ($_GET["limit"] ?? 10);

        $users = $userModel->getAll($search, $page, $limit);
        $total = $userModel->countAll($search);

        jsonResponse(true, "Success", [
            "users" => $users,
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total" => (int) $total["total"],
                "totalPage" => (int) ceil($total["total"] / $limit)
            ]
        ]);
    }

    if ($method == "POST") {
        $userModel->create(
            $data["full_name"],
            $data["email"],
            $data["password"],
            $data["role"]
        );

        jsonResponse(true, "Thêm user thành công");
    }
}

// GET /users/trash - danh sách user đã xóa mềm (thùng rác)
if (
    isset($urlParts[0])
    && $urlParts[0] == "users"
    && isset($urlParts[1])
    && $urlParts[1] == "trash"
    && !isset($urlParts[2])
) {
    checkAdmin();

    if ($method == "GET") {
        $users = $userModel->getTrashed();

        jsonResponse(true, "Success", $users);
    }
}

// PUT /users/{id}/restore - khôi phục user đã xóa mềm
if (
    isset($urlParts[0])
    && $urlParts[0] == "users"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "restore"
) {
    checkAdmin();

    $id = $urlParts[1];

    $ok = $userModel->restore($id);

    if (!$ok) {
        jsonResponse(false, "Không tìm thấy user trong thùng rác");
    }

    jsonResponse(true, "Khôi phục user thành công");
}

// PUT /users/{id}/lock & /users/{id}/unlock - khóa / mở khóa tài khoản
if (
    isset($urlParts[0])
    && $urlParts[0] == "users"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && ($urlParts[2] == "lock" || $urlParts[2] == "unlock")
) {
    checkAdmin();

    $id = $urlParts[1];

    if ($urlParts[2] == "lock") {
        $userModel->lock($id);
        jsonResponse(true, "Khóa user thành công");
    } else {
        $userModel->unlock($id);
        jsonResponse(true, "Mở khóa user thành công");
    }
}

// DELETE /users/{id}/force - xóa cứng (vĩnh viễn) user đã ở thùng rác
if (
    isset($urlParts[0])
    && $urlParts[0] == "users"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "force"
) {
    checkAdmin();

    $id = $urlParts[1];

    if ($method == "DELETE") {
        $ok = $userModel->forceDelete($id);

        if (!$ok) {
            jsonResponse(false, "Chỉ có thể xóa vĩnh viễn user đã nằm trong thùng rác");
        }

        jsonResponse(true, "Xóa vĩnh viễn user thành công");
    }
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "users"
    && isset($urlParts[1])
    && !isset($urlParts[2])
    && $urlParts[1] != "trash"
) {
    checkAdmin();

    $id = $urlParts[1];

    if ($method == "GET") {
        $user = $userModel->findById($id);

        jsonResponse(true, "Success", $user);
    }

    if ($method == "PUT") {
        $userModel->update(
            $id,
            $data["full_name"],
            $data["password"] ?? "",
            $data["role"],
            $data["status"]
        );

        jsonResponse(true, "Cập nhật user thành công");
    }

    // DELETE /users/{id} - XÓA MỀM (soft delete)
    if ($method == "DELETE") {
        $ok = $userModel->softDelete($id);

        if (!$ok) {
            jsonResponse(false, "Không tìm thấy user hoặc user đã bị xóa");
        }

        jsonResponse(true, "Đã chuyển user vào thùng rác");
    }
}