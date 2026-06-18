<?php

require_once __DIR__ . '/../app/models/User.php';
require_once __DIR__ . '/../app/models/Post.php';
require_once __DIR__ . '/../app/models/Category.php';
require_once __DIR__ . '/../app/models/Comment.php';
require_once __DIR__ . '/../app/models/Event.php';
require_once __DIR__ . '/../app/models/EventRegistration.php';
require_once __DIR__ . '/../app/models/EventMessage.php';
require_once __DIR__ . '/../app/models/Notification.php';
require_once __DIR__ . '/../app/models/Dashboard.php';

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/mail.php';
require_once __DIR__ . '/../helpers/ai.php';

require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$userModel = new User();
$postModel = new Post();
$categoryModel = new Category();
$commentModel = new Comment();
$eventModel = new Event();
$eventRegistrationModel = new EventRegistration();
$eventMessageModel = new EventMessage();
$notificationModel = new Notification();
$dashboardModel = new Dashboard();
$method = $_SERVER["REQUEST_METHOD"];
$uri = $_GET["url"] ?? "";

$data = json_decode(file_get_contents("php://input"), true);
$urlParts = explode("/", $uri);

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/category.php';
require_once __DIR__ . '/post.php';
require_once __DIR__ . '/user.php';
require_once __DIR__ . '/comment.php';
require_once __DIR__ . '/event.php';
require_once __DIR__ . '/eventMessage.php';
require_once __DIR__ . '/notification.php';
require_once __DIR__ . '/profile.php';
require_once __DIR__ . '/assistant.php';
require_once __DIR__ . '/dashboard.php';

jsonResponse(false, "Route not found");