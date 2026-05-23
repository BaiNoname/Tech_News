<?php

require_once __DIR__ . '/../../config/Database.php';

class Post extends Database
{
    public function getAll($search = "", $page = 1, $limit = 5)
    {
        $offset = ($page - 1) * $limit;

        $searchText = "%" . $search . "%";

        $sql = $this->connection->prepare("
        SELECT posts.*, categories.name AS category_name
        FROM posts
        INNER JOIN categories 
        ON posts.category_id = categories.id
        WHERE posts.title LIKE ?
        ORDER BY posts.id DESC
        LIMIT ?, ?
    ");

        $sql->bind_param(
            "sii",
            $searchText,
            $offset,
            $limit
        );

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function countPost($search = "")
    {
        $searchText = "%" . $search . "%";

        $sql = $this->connection->prepare("
        SELECT COUNT(*) AS total
        FROM posts
        WHERE title LIKE ?
    ");

        $sql->bind_param("s", $searchText);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function findById($id)
    {
        $sql = $this->connection->prepare("
            SELECT posts.*, categories.name AS category_name
            FROM posts
            INNER JOIN categories ON posts.category_id = categories.id
            WHERE posts.id = ?
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function getDetailAndIncreaseView($id)
    {
        $update = $this->connection->prepare("
            UPDATE posts
            SET views = views + 1
            WHERE id = ?
        ");

        $update->bind_param("i", $id);
        $update->execute();

        return $this->findById($id);
    }

    public function getByCategory($categoryId)
    {
        $sql = $this->connection->prepare("
            SELECT posts.*, categories.name AS category_name
            FROM posts
            INNER JOIN categories ON posts.category_id = categories.id
            WHERE posts.category_id = ?
            ORDER BY posts.id DESC
        ");

        $sql->bind_param("i", $categoryId);

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function create($categoryId, $title, $slug, $thumbnail, $content)
    {
        $sql = $this->connection->prepare("
            INSERT INTO posts(category_id, title, slug, thumbnail, content)
            VALUES(?, ?, ?, ?, ?)
        ");

        $sql->bind_param(
            "issss",
            $categoryId,
            $title,
            $slug,
            $thumbnail,
            $content
        );

        return $sql->execute();
    }

    public function update($id, $categoryId, $title, $slug, $thumbnail, $content)
    {
        $sql = $this->connection->prepare("
            UPDATE posts
            SET category_id = ?,
                title = ?,
                slug = ?,
                thumbnail = ?,
                content = ?,
                updated_at = NOW()
            WHERE id = ?
        ");

        $sql->bind_param(
            "issssi",
            $categoryId,
            $title,
            $slug,
            $thumbnail,
            $content,
            $id
        );

        return $sql->execute();
    }

    public function delete($id)
    {
        $sql = $this->connection->prepare("
            DELETE FROM posts
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }
}