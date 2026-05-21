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
            jsonResponse(true, "Success", $postModel->getAll());
        }

        if ($method == "POST") {
            checkAdmin();

            $postModel->create(
                $data["category_id"],
                $data["title"],
                $data["slug"],
                $data["thumbnail"],
                $data["content"]
            );

            jsonResponse(true, "Thêm bài viết thành công");
        }

        break;

    case isset($urlParts[0]) && $urlParts[0] == "posts" && isset($urlParts[1]):

        $id = $urlParts[1];

        if ($method == "GET") {
            $post = $postModel->getDetailAndIncreaseView($id);

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

            $postModel->delete($id);

            jsonResponse(true, "Xóa bài viết thành công");
        }

        break;

    case isset($urlParts[0]) && $urlParts[0] == "categories"
    && isset($urlParts[1])
    && isset($urlParts[2])
    && $urlParts[2] == "posts":

        $categoryId = $urlParts[1];

        if ($method == "GET") {
            jsonResponse(true, "Success", $postModel->getByCategory($categoryId));
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

        break;



    default:
        jsonResponse(false, "Route not found");
}