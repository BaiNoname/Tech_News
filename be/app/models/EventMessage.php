<?php

require_once __DIR__ . '/../../config/Database.php';

class EventMessage extends Database
{
    public function getByEvent($eventId)
    {
        $sql = $this->connection->prepare("
            SELECT event_messages.*, users.full_name
            FROM event_messages
            INNER JOIN users ON event_messages.user_id = users.id
            WHERE event_messages.event_id = ?
            ORDER BY event_messages.id ASC
        ");

        $sql->bind_param("i", $eventId);

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function create($eventId, $userId, $message, $isSystem = 0)
    {
        $sql = $this->connection->prepare("
            INSERT INTO event_messages(event_id, user_id, message, is_system)
            VALUES(?, ?, ?, ?)
        ");

        $sql->bind_param("iisi", $eventId, $userId, $message, $isSystem);

        return $sql->execute();
    }
}