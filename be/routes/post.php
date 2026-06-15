<?php

if ($uri == "posts") {
    if ($method == "GET") {
        $search = $_GET["search"] ?? "";
        $page = $_GET["page"] ?? 1;
        $limit = $_GET["limit"] ?? 5;

        $posts = $postModel->getAll(
            $search,
            $page,
            $limit
        );

        $total = $postModel->countPost($search);

        jsonResponse(true, "Success", [
            "posts" => $posts,
            "pagination" => [
                "page" => (int) $page,
                "limit" => (int) $limit,
                "total" => (int) $total["total"],
                "totalPage" => ceil($total["total"] / $limit)
            ]
        ]);
    }

    if ($method == "POST") {
        checkAdmin();

        $thumbnail = "";

        if (isset($_FILES["thumbnail"])) {
            $file = $_FILES["thumbnail"];

            $fileName = time() . "_" . $file["name"];

            $uploadPath = "assets/uploads/posts/" . $fileName;

            move_uploaded_file(
                $file["tmp_name"],
                $uploadPath
            );

            $thumbnail = $uploadPath;
        }

        $postModel->create(
            $_POST["category_id"],
            $_POST["title"],
            $_POST["slug"],
            $thumbnail,
            $_POST["content"]
        );

        jsonResponse(true, "Thêm bài viết thành công");
    }
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "posts"
    && isset($urlParts[1])
    && $urlParts[1] == "update"
    && isset($urlParts[2])
) {
    checkAdmin();

    $id = $urlParts[2];

    $oldPost = $postModel->findById($id);

    if (!$oldPost) {
        jsonResponse(false, "Bài viết không tồn tại");
    }

    $thumbnail = $oldPost["thumbnail"];

    if (isset($_FILES["thumbnail"]) && $_FILES["thumbnail"]["error"] == 0) {
        if (
            !empty($oldPost["thumbnail"])
            && file_exists($oldPost["thumbnail"])
        ) {
            unlink($oldPost["thumbnail"]);
        }

        $file = $_FILES["thumbnail"];

        $fileName = time() . "_" . basename($file["name"]);

        $uploadPath = "assets/uploads/posts/" . $fileName;

        move_uploaded_file(
            $file["tmp_name"],
            $uploadPath
        );

        $thumbnail = $uploadPath;
    }

    $result = $postModel->update(
        $id,
        $_POST["category_id"],
        $_POST["title"],
        $_POST["slug"],
        $thumbnail,
        $_POST["content"]
    );

    if (!$result) {
        jsonResponse(false, "Cập nhật thất bại");
    }

    jsonResponse(true, "Cập nhật bài viết thành công");
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "posts"
    && isset($urlParts[1])
    && $urlParts[1] != "update"
    && !isset($urlParts[2])
) {
    $id = $urlParts[1];

    if ($method == "GET") {
        $isAdminEdit =
            isset($_GET["admin"])
            && $_GET["admin"] == "true";

        if ($isAdminEdit) {
            checkAdmin();

            $post = $postModel->findById($id);
        } else {
            $post = $postModel->getDetailAndIncreaseView($id);
        }

        jsonResponse(true, "Success", $post);
    }

    if ($method == "PUT") {
        checkAdmin();

        $postModel->update(
            $id,
            $data["category_id"],
            $data["title"],
            $data["slug"],
            $data["thumbnail"],
            $data["content"]
        );

        jsonResponse(true, "Cập nhật bài viết thành công");
    }

    if ($method == "DELETE") {
        checkAdmin();

        $oldPost = $postModel->findById($id);

        if (!$oldPost) {
            jsonResponse(false, "Bài viết không tồn tại");
        }

        if (
            !empty($oldPost["thumbnail"])
            && file_exists($oldPost["thumbnail"])
        ) {
            unlink($oldPost["thumbnail"]);
        }

        $postModel->delete($id);

        jsonResponse(true, "Xóa bài viết thành công");
    }
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "categories"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "posts"
) {
    $categoryId = $urlParts[1];

    if ($method == "GET") {
        jsonResponse(
            true,
            "Success",
            $postModel->getByCategory($categoryId)
        );
    }
}