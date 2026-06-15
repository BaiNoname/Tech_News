<?php

if (
    isset($urlParts[0])
    && $urlParts[0] == "posts"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "comments"
) {
    $postId = $urlParts[1];

    if ($method == "GET") {
        $comments = $commentModel->getByPost($postId);
        $rating = $commentModel->getRatingByPost($postId);

        jsonResponse(true, "Success", [
            "comments" => $comments,
            "rating" => [
                "average_rating" => round($rating["average_rating"], 1),
                "total_rating" => (int)$rating["total_rating"]
            ]
        ]);
    }

    if ($method == "POST") {
        $authUser = checkAuth();

        $content = $data["content"];
        $rating = (int)$data["rating"];

        if ($rating < 1 || $rating > 5) {
            jsonResponse(false, "Rating phải từ 1 đến 5 sao");
        }

        $oldComment = $commentModel->findUserComment(
            $postId,
            $authUser["id"]
        );

        if ($oldComment) {
            $commentModel->update(
                $oldComment["id"],
                $content,
                $rating
            );

            jsonResponse(true, "Cập nhật đánh giá thành công");
        }

        $commentModel->create(
            $postId,
            $authUser["id"],
            $content,
            $rating
        );

        jsonResponse(true, "Đánh giá bài viết thành công");
    }
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "comments"
    && isset($urlParts[1])
) {
    $id = $urlParts[1];

    $authUser = checkAuth();

    $comment = $commentModel->findById($id);

    if (!$comment) {
        jsonResponse(false, "Bình luận không tồn tại");
    }

    // Chỉ admin HOẶC chủ sở hữu comment mới được sửa/xóa
    $isOwner = ((int) $comment["user_id"] === (int) $authUser["id"]);
    $isAdmin = ($authUser["role"] === "admin");

    if (!$isOwner && !$isAdmin) {
        jsonResponse(false, "Bạn không có quyền với bình luận này");
    }

    if ($method == "PUT") {
        $content = $data["content"] ?? "";
        $rating = (int) ($data["rating"] ?? 0);

        if ($rating < 1 || $rating > 5) {
            jsonResponse(false, "Rating phải từ 1 đến 5 sao");
        }

        $commentModel->update($id, $content, $rating);

        jsonResponse(true, "Cập nhật bình luận thành công");
    }

    if ($method == "DELETE") {
        $commentModel->delete($id);

        jsonResponse(true, "Xóa bình luận thành công");
    }
}