<?php

require_once __DIR__ . '/../../config/Database.php';

class Category extends Database
{
    public function getAll()
    {
        $sql = $this->connection->prepare("
            SELECT * FROM categories
            ORDER BY id DESC
        ");

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function findById($id)
    {
        $sql = $this->connection->prepare("
            SELECT * FROM categories
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function create($name)
    {
        $sql = $this->connection->prepare("
            INSERT INTO categories(name)
            VALUES(?)
        ");

        $sql->bind_param("s", $name);

        return $sql->execute();
    }

    public function update($id, $name)
    {
        $sql = $this->connection->prepare("
            UPDATE categories
            SET name = ?
            WHERE id = ?
        ");

        $sql->bind_param("si", $name, $id);

        return $sql->execute();
    }

    public function delete($id)
    {
        $sql = $this->connection->prepare("
            DELETE FROM categories
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }
}