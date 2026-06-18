<?php

require_once __DIR__ . '/../../config/Database.php';

class User extends Database
{
    /**
     * Lấy danh sách user CHƯA bị xóa mềm.
     * - status (active/inactive) chỉ dùng cho khóa / mở khóa tài khoản.
     * - deleted_at IS NULL => user còn tồn tại.
     */
    public function getAll($search = "", $page = 1, $limit = 10)
    {
        $offset = ($page - 1) * $limit;
        $searchText = "%" . $search . "%";

        $sql = $this->connection->prepare("
            SELECT id, full_name, email, role, status, created_at, deleted_at
            FROM users
            WHERE deleted_at IS NULL
            AND (full_name LIKE ? OR email LIKE ?)
            ORDER BY id DESC
            LIMIT ?, ?
        ");

        $sql->bind_param("ssii", $searchText, $searchText, $offset, $limit);

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function countAll($search = "")
    {
        $searchText = "%" . $search . "%";

        $sql = $this->connection->prepare("
            SELECT COUNT(*) AS total
            FROM users
            WHERE deleted_at IS NULL
            AND (full_name LIKE ? OR email LIKE ?)
        ");

        $sql->bind_param("ss", $searchText, $searchText);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    /**
     * Danh sách user đã bị xóa mềm (thùng rác).
     */
    public function getTrashed()
    {
        $sql = $this->connection->prepare("
            SELECT id, full_name, email, role, status, created_at, deleted_at
            FROM users
            WHERE deleted_at IS NOT NULL
            ORDER BY deleted_at DESC
        ");

        $sql->execute();

        return $sql->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function create($full_name, $email, $password, $role)
    {
        $hashPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = $this->connection->prepare("
            INSERT INTO users(full_name, email, password, role, status)
            VALUES(?, ?, ?, ?, 'active')
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

    /**
     * Tìm theo id - mặc định chỉ lấy user chưa bị xóa mềm.
     */
    public function findById($id)
    {
        $sql = $this->connection->prepare("
            SELECT id, full_name, email, role, status, avatar, equipped_effect, created_at, deleted_at
            FROM users
            WHERE id = ?
            AND deleted_at IS NULL
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    /**
     * Tìm theo email - dùng cho login/register nên loại bỏ user đã xóa mềm.
     */
    public function findByEmail($email)
    {
        $sql = $this->connection->prepare("
            SELECT *
            FROM users
            WHERE email = ?
            AND deleted_at IS NULL
        ");

        $sql->bind_param("s", $email);

        $sql->execute();

        return $sql->get_result()->fetch_assoc();
    }

    public function register($full_name, $email, $password)
    {
        $hashPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = $this->connection->prepare("
            INSERT INTO users(full_name, email, password, role, status)
            VALUES(?, ?, ?, 'user', 'active')
        ");

        $sql->bind_param(
            "sss",
            $full_name,
            $email,
            $hashPassword
        );

        return $sql->execute();
    }

    public function saveOTP($email, $otp)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET otp_code = ?,
                otp_expired_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE)
            WHERE email = ?
            AND deleted_at IS NULL
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
            AND deleted_at IS NULL
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
            AND deleted_at IS NULL
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
            AND deleted_at IS NULL
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

    public function update($id, $full_name, $password, $role, $status)
    {
        if (!empty($password)) {
            $hashPassword = password_hash($password, PASSWORD_DEFAULT);

            $sql = $this->connection->prepare("
                UPDATE users
                SET full_name = ?,
                    password = ?,
                    role = ?,
                    status = ?
                WHERE id = ?
                AND deleted_at IS NULL
            ");

            $sql->bind_param(
                "ssssi",
                $full_name,
                $hashPassword,
                $role,
                $status,
                $id
            );
        } else {
            $sql = $this->connection->prepare("
                UPDATE users
                SET full_name = ?,
                    role = ?,
                    status = ?
                WHERE id = ?
                AND deleted_at IS NULL
            ");

            $sql->bind_param(
                "sssi",
                $full_name,
                $role,
                $status,
                $id
            );
        }

        return $sql->execute();
    }

    /**
     * Cập nhật ảnh đại diện.
     */
    public function updateAvatar($id, $avatarPath)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET avatar = ?
            WHERE id = ?
            AND deleted_at IS NULL
        ");

        $sql->bind_param("si", $avatarPath, $id);

        return $sql->execute();
    }

    /**
     * Danh sách hiệu ứng user đã MỞ KHÓA = reward_effect của các sự kiện
     * mà user đã nhận thưởng. Luôn kèm 'none'.
     */
    public function getUnlockedEffects($id)
    {
        $sql = $this->connection->prepare("
            SELECT DISTINCT events.reward_effect
            FROM event_registrations
            INNER JOIN events ON event_registrations.event_id = events.id
            WHERE event_registrations.user_id = ?
            AND event_registrations.reward_claimed_at IS NOT NULL
            AND events.reward_effect IS NOT NULL
            AND events.reward_effect <> ''
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        $rows = $sql->get_result()->fetch_all(MYSQLI_ASSOC);

        $effects = ["none"];
        foreach ($rows as $row) {
            $effects[] = $row["reward_effect"];
        }

        return array_values(array_unique($effects));
    }

    /**
     * Gắn hiệu ứng lên avatar.
     */
    public function updateEquippedEffect($id, $effect)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET equipped_effect = ?
            WHERE id = ?
            AND deleted_at IS NULL
        ");

        $sql->bind_param("si", $effect, $id);

        return $sql->execute();
    }

    /**
     * Khóa tài khoản (status = inactive). KHÔNG phải xóa.
     */
    public function lock($id)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET status = 'inactive'
            WHERE id = ?
            AND deleted_at IS NULL
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }

    /**
     * Mở khóa tài khoản (status = active).
     */
    public function unlock($id)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET status = 'active'
            WHERE id = ?
            AND deleted_at IS NULL
        ");

        $sql->bind_param("i", $id);

        return $sql->execute();
    }

    /**
     * XÓA MỀM: đánh dấu deleted_at = NOW().
     */
    public function softDelete($id)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET deleted_at = NOW()
            WHERE id = ?
            AND deleted_at IS NULL
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->affected_rows > 0;
    }

    /**
     * KHÔI PHỤC user đã xóa mềm: deleted_at = NULL.
     */
    public function restore($id)
    {
        $sql = $this->connection->prepare("
            UPDATE users
            SET deleted_at = NULL
            WHERE id = ?
            AND deleted_at IS NOT NULL
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->affected_rows > 0;
    }

    /**
     * XÓA CỨNG: xóa vĩnh viễn (chỉ áp dụng cho bản ghi đã ở thùng rác).
     */
    public function forceDelete($id)
    {
        $sql = $this->connection->prepare("
            DELETE FROM users
            WHERE id = ?
            AND deleted_at IS NOT NULL
        ");

        $sql->bind_param("i", $id);

        $sql->execute();

        return $sql->affected_rows > 0;
    }
}