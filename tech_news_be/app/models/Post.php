<?php

require_once __DIR__ . '/../config/Database.php';

class Post extends Database
{
    public function getAll()
    {
        $sql = $this->connection->prepare("
            SELECT posts.*, categories.name as category_name
            FROM posts
            INNER JOIN categories
            ON posts.category_id = categories.id
            ORDER BY posts.id DESC
        ");

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function getDetail($id)
    {
        $update = $this->connection->prepare("
            UPDATE posts
            SET views = views + 1
            WHERE id = ?
        ");

        $update->bind_param("i", $id);
        $update->execute();

        $sql = $this->connection->prepare("
            SELECT * FROM posts
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function create($category_id, $title, $content)
    {
        $sql = $this->connection->prepare("
            INSERT INTO posts(category_id, title, content)
            VALUES(?, ?, ?)
        ");

        $sql->bind_param(
            "iss",
            $category_id,
            $title,
            $content
        );

        return $sql->execute();
    }

    public function update($id, $category_id, $title, $content)
    {
        $sql = $this->connection->prepare("
            UPDATE posts
            SET category_id = ?,
                title = ?,
                content = ?
            WHERE id = ?
        ");

        $sql->bind_param(
            "issi",
            $category_id,
            $title,
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