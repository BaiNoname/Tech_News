<?php

require_once __DIR__ . '/../app/models/User.php';
require_once __DIR__ . '/../app/models/Post.php';
require_once __DIR__ . '/../app/models/Category.php';

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/mail.php';

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$userModel = new User();
$postModel = new Post();
$categoryModel = new Category();

$method = $_SERVER["REQUEST_METHOD"];
$uri = $_GET["url"] ?? "";

$data = json_decode(file_get_contents("php://input"), true);

$urlParts = explode("/", $uri);

switch ($uri) {

    case "register":

        $userModel->register(
            $data["full_name"],
            $data["email"],
            $data["password"]
        );

        jsonResponse(true, "Register success");

        break;

    case "login":

        $user = $userModel->findByEmail($data["email"]);

        if (!$user) {
            jsonResponse(false, "Email not found");
        }

        if (!password_verify($data["password"], $user["password"])) {
            jsonResponse(false, "Password incorrect");
        }

        $token = generateToken($user);

        jsonResponse(true, "Login success", [
            "token" => $token,
            "user" => $user
        ]);

        break;

    case "categories":

        if ($method == "GET") {
            jsonResponse(true, "Success", $categoryModel->getAll());
        }

        if ($method == "POST") {
            checkAdmin();

            $categoryModel->create($data["name"]);

            jsonResponse(true, "Thêm danh mục thành công");
        }

        break;

    case isset($urlParts[0]) && $urlParts[0] == "categories" && isset($urlParts[1]):

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

        break;

    case "posts":

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

        break;



    case isset($urlParts[0])
    && $urlParts[0] == "posts"
    && isset($urlParts[1])
    && $urlParts[1] == "update"
    && isset($urlParts[2]):

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

        break;



    case isset($urlParts[0])
    && $urlParts[0] == "posts"
    && isset($urlParts[1]):

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

        break;

    case "change-password":

        $authUser = checkAuth();

        $oldPassword = $data["old_password"];
        $newPassword = $data["new_password"];

        $result = $userModel->changePassword(
            $authUser["id"],
            $oldPassword,
            $newPassword
        );

        if (!$result) {
            jsonResponse(false, "Mật khẩu cũ không đúng");
        }

        jsonResponse(true, "Đổi mật khẩu thành công");

        break;

    case "forgot-password":

        $email = $data["email"];

        $user = $userModel->findByEmail($email);

        if (!$user) {
            jsonResponse(false, "Email không tồn tại");
        }

        $otp = rand(100000, 999999);

        $userModel->saveOTP($email, $otp);

        $sendMail = sendOTP($email, $otp);

        if (!$sendMail) {
            jsonResponse(false, "Gửi OTP thất bại");
        }

        jsonResponse(true, "OTP đã được gửi về email");

        break;

    case "verify-otp":

        $email = $data["email"];
        $otp = $data["otp"];

        $user = $userModel->verifyOTP($email, $otp);

        if (!$user) {
            jsonResponse(false, "OTP không đúng hoặc đã hết hạn");
        }

        jsonResponse(true, "Xác thực OTP thành công");

        break;

    case "reset-password":

        $email = $data["email"];
        $otp = $data["otp"];
        $newPassword = $data["new_password"];

        $user = $userModel->verifyOTP($email, $otp);

        if (!$user) {
            jsonResponse(false, "OTP không đúng hoặc đã hết hạn");
        }

        $userModel->resetPassword($email, $newPassword);

        jsonResponse(true, "Đặt lại mật khẩu thành công");

        break;

    case "users":

        checkAdmin();

        if ($method == "GET") {

            $users = $userModel->getAll();

            jsonResponse(true, "Success", $users);
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

        break;



    case isset($urlParts[0])
    && $urlParts[0] == "users"
    && isset($urlParts[1]):

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
                $data["role"]
            );

            jsonResponse(true, "Cập nhật user thành công");
        }

        if ($method == "DELETE") {

            $userModel->delete($id);

            jsonResponse(true, "Xóa user thành công");
        }

        break;



    default:
        jsonResponse(false, "Route not found");
        break;
}