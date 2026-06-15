<?php

require_once __DIR__ . '/../../config/Database.php';

class Comment extends Database
{
    public function getByPost($postId)
    {
        $sql = $this->connection->prepare("
            SELECT comments.*, users.full_name
            FROM comments
            INNER JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = ?
            ORDER BY comments.id DESC
        ");

        $sql->bind_param("i", $postId);

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function findUserComment($postId, $userId)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM comments
            WHERE post_id = ?
            AND user_id = ?
        ");

        $sql->bind_param("ii", $postId, $userId);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function findById($id)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM comments
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function create($postId, $userId, $content, $rating)
    {
        $sql = $this->connection->prepare("
            INSERT INTO comments(post_id, user_id, content, rating)
            VALUES(?, ?, ?, ?)
        ");

        $sql->bind_param(
            "iisi",
            $postId,
            $userId,
            $content,
            $rating
        );

        return $sql->execute();
    }

    public function update($id, $content, $rating)
    {
        $sql = $this->connection->prepare("
            UPDATE comments
            SET content = ?,
                rating = ?
            WHERE id = ?
        ");

        $sql->bind_param(
            "sii",
            $content,
            $rating,
            $id
        );

        return $sql->execute();
    }

    public function delete($id)
    {
        $sql = $this->connection->prepare("
            DELETE FROM comments
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }

    public function getRatingByPost($postId)
    {
        $sql = $this->connection->prepare("
            SELECT 
                AVG(rating) AS average_rating,
                COUNT(*) AS total_rating
            FROM comments
            WHERE post_id = ?
        ");

        $sql->bind_param("i", $postId);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }
}