<?php

require_once __DIR__ . '/../config/Database.php';

class User extends Database
{
    public function register($full_name, $email, $password)
    {
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $sql = $this->connection->prepare("
            INSERT INTO users(full_name, email, password)
            VALUES(?, ?, ?)
        ");

        $sql->bind_param(
            "sss",
            $full_name,
            $email,
            $hash
        );

        return $sql->execute();
    }

    public function findByEmail($email)
    {
        $sql = $this->connection->prepare("
            SELECT * FROM users
            WHERE email = ?
        ");

        $sql->bind_param("s", $email);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }
}