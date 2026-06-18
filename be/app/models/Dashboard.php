<?php

require_once __DIR__ . '/../../config/Database.php';

class Dashboard extends Database
{
    private function scalar($sql)
    {
        $res = $this->connection->query($sql);
        $row = $res->fetch_assoc();
        return (int) ($row["total"] ?? 0);
    }

    public function stats()
    {
        // Tổng quan
        $totalUsers = $this->scalar("SELECT COUNT(*) AS total FROM users WHERE deleted_at IS NULL");
        $totalPosts = $this->scalar("SELECT COUNT(*) AS total FROM posts");
        $totalEvents = $this->scalar("SELECT COUNT(*) AS total FROM events");
        $totalCategories = $this->scalar("SELECT COUNT(*) AS total FROM categories");
        $totalComments = $this->scalar("SELECT COUNT(*) AS total FROM comments");
        $totalRegistrations = $this->scalar("SELECT COUNT(*) AS total FROM event_registrations");
        $totalViews = $this->scalar("SELECT COALESCE(SUM(views),0) AS total FROM posts");

        // Sự kiện theo trạng thái
        $eventStatus = [
            "upcoming" => $this->scalar("SELECT COUNT(*) AS total FROM events WHERE status='upcoming'"),
            "ongoing" => $this->scalar("SELECT COUNT(*) AS total FROM events WHERE status='ongoing'"),
            "ended" => $this->scalar("SELECT COUNT(*) AS total FROM events WHERE status='ended'")
        ];

        // User theo vai trò
        $roleStats = [
            "admin" => $this->scalar("SELECT COUNT(*) AS total FROM users WHERE role='admin' AND deleted_at IS NULL"),
            "user" => $this->scalar("SELECT COUNT(*) AS total FROM users WHERE role='user' AND deleted_at IS NULL")
        ];

        // Top 5 bài viết theo lượt xem
        $topPosts = [];
        $res = $this->connection->query("
            SELECT id, title, views
            FROM posts
            ORDER BY views DESC
            LIMIT 5
        ");
        while ($row = $res->fetch_assoc()) {
            $topPosts[] = $row;
        }

        // 5 user mới nhất
        $recentUsers = [];
        $res = $this->connection->query("
            SELECT id, full_name, email, created_at, avatar
            FROM users
            WHERE deleted_at IS NULL
            ORDER BY id DESC
            LIMIT 5
        ");
        while ($row = $res->fetch_assoc()) {
            $recentUsers[] = $row;
        }

        // Số bài viết theo từng danh mục (cho biểu đồ)
        $postsByCategory = [];
        $res = $this->connection->query("
            SELECT categories.name, COUNT(posts.id) AS total
            FROM categories
            LEFT JOIN posts ON posts.category_id = categories.id
            GROUP BY categories.id
            ORDER BY total DESC
        ");
        while ($row = $res->fetch_assoc()) {
            $postsByCategory[] = [
                "name" => $row["name"],
                "total" => (int) $row["total"]
            ];
        }

        return [
            "totals" => [
                "users" => $totalUsers,
                "posts" => $totalPosts,
                "events" => $totalEvents,
                "categories" => $totalCategories,
                "comments" => $totalComments,
                "registrations" => $totalRegistrations,
                "views" => $totalViews
            ],
            "eventStatus" => $eventStatus,
            "roleStats" => $roleStats,
            "topPosts" => $topPosts,
            "recentUsers" => $recentUsers,
            "postsByCategory" => $postsByCategory
        ];
    }
}