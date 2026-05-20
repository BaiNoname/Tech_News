<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Post.php';
require_once __DIR__ . '/../models/Category.php';

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/jwt.php';

$userModel = new User();
$postModel = new Post();
$categoryModel = new Category();

$method = $_SERVER["REQUEST_METHOD"];
$uri = $_GET["url"] ?? "";

$data = json_decode(file_get_contents("php://input"), true);

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

        break;

    case "posts":

        if ($method == "GET") {
            jsonResponse(true, "Success", $postModel->getAll());
        }

        break;

    default:
        jsonResponse(false, "Route not found");
}