<?php
header("Content-Type: text/plain; charset=utf-8");
error_reporting(E_ALL);
ini_set("display_errors", "1");

require_once __DIR__ . '/config/Database.php';

echo "Đang kết nối DB...\n";
$db = new Database();
echo "Kết nối OK!\n\n";

echo "Test query posts:\n";
$res = $db->connection->query("SELECT COUNT(*) AS total FROM posts");
$row = $res->fetch_assoc();
echo "Số bài viết: " . $row["total"] . "\n";

echo "\nTest query users (cột mới):\n";
$res = $db->connection->query("SELECT id, full_name, avatar, equipped_effect FROM users LIMIT 1");
if (!$res) {
    echo "LỖI: " . $db->connection->error . "\n";
} else {
    echo "OK - bảng users có đủ cột\n";
}