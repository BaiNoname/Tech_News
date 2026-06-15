<?php

require_once __DIR__ . '/../../config/Database.php';

class Category extends Database
{
    public function getAll($search = "", $page = 1, $limit = 10)
    {
        $offset = ($page - 1) * $limit;
        $searchText = "%" . $search . "%";

        $sql = $this->connection->prepare("
            SELECT * FROM categories
            WHERE name LIKE ?
            ORDER BY id DESC
            LIMIT ?, ?
        ");

        $sql->bind_param("sii", $searchText, $offset, $limit);

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function countAll($search = "")
    {
        $searchText = "%" . $search . "%";

        $sql = $this->connection->prepare("
            SELECT COUNT(*) AS total
            FROM categories
            WHERE name LIKE ?
        ");

        $sql->bind_param("s", $searchText);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
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