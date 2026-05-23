<?php

require_once __DIR__ . '/../../config/Database.php';

class User extends Database
{
    public function getAll()
    {
        $sql = $this->connection->prepare("
            SELECT id, full_name, email, role, created_at
            FROM users
            ORDER BY id DESC
        ");

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    public function create($full_name, $email, $password, $role)
    {
        $hashPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = $this->connection->prepare("
        INSERT INTO users(full_name, email, password, role)
        VALUES(?, ?, ?, ?)
    ");

        $sql->bind_param(
            "ssss",
            $full_name,
            $email,
            $hashPassword,
            $role
        );

        return $sql->execute();
    }

    public function findById($id)
    {
        $sql = $this->connection->prepare("
            SELECT id, full_name, email, role, created_at
            FROM users
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function findByEmail($email)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM users
            WHERE email = ?
        ");

        $sql->bind_param("s", $email);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function register($full_name, $email, $password)
    {
        $hashPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = $this->connection->prepare("
            INSERT INTO users(full_name, email, password, role)
            VALUES(?, ?, ?, 'user')
        ");

        $sql->bind_param(
            "sss",
            $full_name,
            $email,
            $hashPassword
        );

        return $sql->execute();
    }

    public function login($email, $password)
    {
        $user = $this->findByEmail($email);

        if (!$user) {
            return false;
        }

        if (!password_verify($password, $user["password"])) {
            return false;
        }

        return $user;
    }

    public function saveOTP($email, $otp)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET otp_code = ?,
                otp_expired_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE)
            WHERE email = ?
        ");

        $sql->bind_param("ss", $otp, $email);

        return $sql->execute();
    }

    public function verifyOTP($email, $otp)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM users
            WHERE email = ?
            AND otp_code = ?
            AND otp_expired_at > NOW()
        ");

        $sql->bind_param("ss", $email, $otp);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function resetPassword($email, $newPassword)
    {
        $hashPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $sql = $this->connection->prepare("
            UPDATE users
            SET password = ?,
                otp_code = NULL,
                otp_expired_at = NULL
            WHERE email = ?
        ");

        $sql->bind_param("ss", $hashPassword, $email);

        return $sql->execute();
    }

    public function changePassword($id, $oldPassword, $newPassword)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM users
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        $user = $sql->get_result()->fetch_assoc();

        if (!$user) {
            return false;
        }

        if (!password_verify($oldPassword, $user["password"])) {
            return false;
        }

        $hashPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $update = $this->connection->prepare("
            UPDATE users
            SET password = ?
            WHERE id = ?
        ");

        $update->bind_param("si", $hashPassword, $id);

        return $update->execute();
    }

    public function delete($id)
    {
        $sql = $this->connection->prepare("
            DELETE FROM users
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }

    public function update($id, $full_name, $password, $role)
    {
        if (!empty($password)) {

            $hashPassword = password_hash(
                $password,
                PASSWORD_DEFAULT
            );

            $sql = $this->connection->prepare("
            UPDATE users
            SET full_name = ?,
                password = ?,
                role = ?
            WHERE id = ?
        ");

            $sql->bind_param(
                "sssi",
                $full_name,
                $hashPassword,
                $role,
                $id
            );

        } else {

            $sql = $this->connection->prepare("
            UPDATE users
            SET full_name = ?,
                role = ?
            WHERE id = ?
        ");

            $sql->bind_param(
                "ssi",
                $full_name,
                $role,
                $id
            );
        }

        return $sql->execute();
    }
}