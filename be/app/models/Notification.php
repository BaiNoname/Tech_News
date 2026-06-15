<?php

require_once __DIR__ . '/../../config/Database.php';

class Notification extends Database
{
    public function create($userId, $eventId, $message, $type = "event_register")
    {
        $sql = $this->connection->prepare("
            INSERT INTO notifications(user_id, event_id, message, type)
            VALUES(?, ?, ?, ?)
        ");

        $sql->bind_param("iiss", $userId, $eventId, $message, $type);

        return $sql->execute();
    }

    public function latest()
    {
        $sql = $this->connection->prepare("
            SELECT notifications.*, users.full_name, events.title AS event_title
            FROM notifications
            LEFT JOIN users ON notifications.user_id = users.id
            LEFT JOIN events ON notifications.event_id = events.id
            ORDER BY notifications.id DESC
            LIMIT 5
        ");

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // Kiểm tra đã có thông báo loại $type cho event này chưa (tránh trùng)
    public function existsForEvent($eventId, $type)
    {
        $sql = $this->connection->prepare("
            SELECT id
            FROM notifications
            WHERE event_id = ?
            AND type = ?
            LIMIT 1
        ");

        $sql->bind_param("is", $eventId, $type);

        $sql->execute();

        return $sql->get_result()->fetch_assoc() ? true : false;
    }

  // Quét event đã qua end_time, tạo thông báo "kết thúc" 1 lần
    public function generateEndedEventNotifications()
    {
        $select = $this->connection->prepare("
            SELECT id, title
            FROM events
            WHERE end_time IS NOT NULL
            AND end_time <= NOW()
        ");

        $select->execute();

        $events = $select->get_result()->fetch_all(MYSQLI_ASSOC);

        foreach ($events as $event) {
            if (!$this->existsForEvent($event["id"], "event_ended")) {
                $message = "Sự kiện " . $event["title"] . " đã kết thúc";

                $insert = $this->connection->prepare("
                    INSERT INTO notifications(user_id, event_id, message, type)
                    VALUES(NULL, ?, ?, 'event_ended')
                ");
                $insert->bind_param("is", $event["id"], $message);
                $insert->execute();
            }
        }

        return true;
    }
}