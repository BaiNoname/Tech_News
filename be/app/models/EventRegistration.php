<?php

require_once __DIR__ . '/../../config/Database.php';

class EventRegistration extends Database
{
    public function findByUserAndEvent($eventId, $userId)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM event_registrations
            WHERE event_id = ?
            AND user_id = ?
        ");

        $sql->bind_param("ii", $eventId, $userId);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function create($eventId, $userId, $token)
    {
        $sql = $this->connection->prepare("
            INSERT INTO event_registrations(event_id, user_id, confirm_token, status)
            VALUES(?, ?, ?, 'pending')
        ");

        $sql->bind_param("iis", $eventId, $userId, $token);

        return $sql->execute();
    }

    public function findByToken($token)
    {
        $sql = $this->connection->prepare("
            SELECT event_registrations.*, users.full_name, users.email, events.title AS event_title
            FROM event_registrations
            INNER JOIN users ON event_registrations.user_id = users.id
            INNER JOIN events ON event_registrations.event_id = events.id
            WHERE confirm_token = ?
        ");

        $sql->bind_param("s", $token);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function confirm($id)
    {
        $sql = $this->connection->prepare("
            UPDATE event_registrations
            SET status = 'confirmed',
                confirmed_at = NOW()
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }

    // Lấy bản ghi đăng ký của 1 user cho 1 event
    public function getRegistration($eventId, $userId)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM event_registrations
            WHERE event_id = ?
            AND user_id = ?
        ");

        $sql->bind_param("ii", $eventId, $userId);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    // Check-in: chỉ cho người confirmed và chưa check-in
    public function checkIn($eventId, $userId)
    {
        $sql = $this->connection->prepare("
            UPDATE event_registrations
            SET checked_in_at = NOW()
            WHERE event_id = ?
            AND user_id = ?
            AND status = 'confirmed'
            AND checked_in_at IS NULL
        ");

        $sql->bind_param("ii", $eventId, $userId);

        $sql->execute();

        return $sql->affected_rows > 0;
    }

    // Nhận thưởng: chỉ cho người đã check-in và chưa nhận
    public function claimReward($eventId, $userId)
    {
        $sql = $this->connection->prepare("
            UPDATE event_registrations
            SET reward_claimed_at = NOW()
            WHERE event_id = ?
            AND user_id = ?
            AND checked_in_at IS NOT NULL
            AND reward_claimed_at IS NULL
        ");

        $sql->bind_param("ii", $eventId, $userId);

        $sql->execute();

        return $sql->affected_rows > 0;
    }

    public function isConfirmed($eventId, $userId)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM event_registrations
            WHERE event_id = ?
            AND user_id = ?
            AND status = 'confirmed'
        ");

        $sql->bind_param("ii", $eventId, $userId);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function getByEvent($eventId, $page = 1, $limit = 10)
    {
        $offset = ($page - 1) * $limit;

        $sql = $this->connection->prepare("
            SELECT event_registrations.*, users.full_name, users.email
            FROM event_registrations
            INNER JOIN users ON event_registrations.user_id = users.id
            WHERE event_id = ?
            ORDER BY event_registrations.id DESC
            LIMIT ?, ?
        ");

        $sql->bind_param("iii", $eventId, $offset, $limit);

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function countByEvent($eventId)
    {
        $sql = $this->connection->prepare("
            SELECT COUNT(*) AS total
            FROM event_registrations
            WHERE event_id = ?
        ");

        $sql->bind_param("i", $eventId);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }
}