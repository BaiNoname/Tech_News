<?php

if ($uri == "categories") {
    if ($method == "GET") {
        // Có ?page => trả về kèm phân trang (trang admin).
        // Không => trả về toàn bộ (dropdown chọn danh mục ở Post create/edit).
        if (isset($_GET["page"])) {
            $search = $_GET["search"] ?? "";
            $page = (int) ($_GET["page"] ?? 1);
            $limit = (int) ($_GET["limit"] ?? 10);

            $categories = $categoryModel->getAll($search, $page, $limit);
            $total = $categoryModel->countAll($search);

            jsonResponse(true, "Success", [
                "categories" => $categories,
                "pagination" => [
                    "page" => $page,
                    "limit" => $limit,
                    "total" => (int) $total["total"],
                    "totalPage" => (int) ceil($total["total"] / $limit)
                ]
            ]);
        }

        jsonResponse(true, "Success", $categoryModel->getAll("", 1, 1000000));
    }

    if ($method == "POST") {
        checkAdmin();

        $categoryModel->create($data["name"]);

        jsonResponse(true, "Thêm danh mục thành công");
    }
}

if (
    isset($urlParts[0])
    && $urlParts[0] == "categories"
    && isset($urlParts[1])
    && !isset($urlParts[2])
) {
    $id = $urlParts[1];

    if ($method == "GET") {
        $category = $categoryModel->findById($id);

        jsonResponse(true, "Success", $category);
    }

    if ($method == "PUT") {
        checkAdmin();

        $categoryModel->update($id, $data["name"]);

        jsonResponse(true, "Cập nhật danh mục thành công");
    }

    if ($method == "DELETE") {
        checkAdmin();

        $categoryModel->delete($id);

        jsonResponse(true, "Xóa danh mục thành công");
    }
}