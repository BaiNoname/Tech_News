<?php

require_once __DIR__ . '/../../config/Database.php';

class Event extends Database
{
   public function getAll($search = "", $page = 1, $limit = 1000000)
    {
        $offset = ($page - 1) * $limit;
        $searchText = "%" . $search . "%";

        $sql = $this->connection->prepare("
            SELECT events.*,
                COUNT(event_registrations.id) AS registered_count
            FROM events
            LEFT JOIN event_registrations 
            ON events.id = event_registrations.event_id
            AND event_registrations.status = 'confirmed'
            WHERE events.title LIKE ?
            GROUP BY events.id
            ORDER BY events.id DESC
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
            FROM events
            WHERE title LIKE ?
        ");

        $sql->bind_param("s", $searchText);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function findById($id)
    {
        $sql = $this->connection->prepare("
            SELECT events.*,
                COUNT(event_registrations.id) AS registered_count
            FROM events
            LEFT JOIN event_registrations 
            ON events.id = event_registrations.event_id
            AND event_registrations.status = 'confirmed'
            WHERE events.id = ?
            GROUP BY events.id
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function create($title, $description, $thumbnail, $startTime, $endTime, $maxParticipants, $status, $rewardEffect = "neon")
    {
        $sql = $this->connection->prepare("
            INSERT INTO events(title, description, thumbnail, start_time, end_time, max_participants, status, reward_effect)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $sql->bind_param(
            "sssssiss",
            $title,
            $description,
            $thumbnail,
            $startTime,
            $endTime,
            $maxParticipants,
            $status,
            $rewardEffect
        );

        return $sql->execute();
    }

    public function update($id, $title, $description, $thumbnail, $startTime, $endTime, $maxParticipants, $status, $rewardEffect = "neon")
    {
        $sql = $this->connection->prepare("
            UPDATE events
            SET title = ?,
                description = ?,
                thumbnail = ?,
                start_time = ?,
                end_time = ?,
                max_participants = ?,
                status = ?,
                reward_effect = ?
            WHERE id = ?
        ");

        $sql->bind_param(
            "sssssissi",
            $title,
            $description,
            $thumbnail,
            $startTime,
            $endTime,
            $maxParticipants,
            $status,
            $rewardEffect,
            $id
        );

        return $sql->execute();
    }

    public function delete($id)
    {
        $sql = $this->connection->prepare("
            DELETE FROM events
            WHERE id = ?
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }

    /**
     * Tự động cập nhật status của TẤT CẢ sự kiện dựa trên thời gian hiện tại.
     * - NOW() < start_time            => upcoming
     * - start_time <= NOW < end_time  => ongoing
     * - NOW() >= end_time             => ended
     * Gọi method này trước khi đọc danh sách / chi tiết event.
     */
    public function syncStatusByTime()
    {
        $this->connection->query("
            UPDATE events
            SET status = CASE
                WHEN start_time IS NOT NULL AND NOW() < start_time THEN 'upcoming'
                WHEN end_time IS NOT NULL AND NOW() >= end_time THEN 'ended'
                ELSE 'ongoing'
            END
            WHERE
                (start_time IS NOT NULL OR end_time IS NOT NULL)
                AND status <> (
                    CASE
                        WHEN start_time IS NOT NULL AND NOW() < start_time THEN 'upcoming'
                        WHEN end_time IS NOT NULL AND NOW() >= end_time THEN 'ended'
                        ELSE 'ongoing'
                    END
                )
        ");

        return true;
    }
}