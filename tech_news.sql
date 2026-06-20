-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 17, 2026 lúc 09:20 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `tech_news`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'mobile', '2026-05-21 02:47:09'),
(2, 'laptop', '2026-05-21 02:47:09'),
(6, 'nintendo', '2026-05-23 10:46:27'),
(7, 'VR', '2026-05-23 10:46:37'),
(8, 'Hornor', '2026-06-13 14:44:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `rating` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `rating`, `created_at`) VALUES
(1, 5, 1, 'cũng hay\n', 4, '2026-06-07 15:29:06'),
(2, 6, 14, 'hơi tệ\n', 3, '2026-06-08 00:56:13'),
(3, 4, 4, '', 5, '2026-06-08 04:55:24'),
(4, 6, 8, 'ko tệ', 4, '2026-06-12 04:14:18'),
(5, 9, 4, 'bài viết hay', 4, '2026-06-13 15:56:08'),
(7, 9, 8, 'hay', 5, '2026-06-15 17:54:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `max_participants` int(11) DEFAULT 100,
  `status` enum('upcoming','ongoing','ended') DEFAULT 'upcoming',
  `reward_effect` varchar(30) NOT NULL DEFAULT 'neon',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `thumbnail`, `start_time`, `end_time`, `max_participants`, `status`, `reward_effect`, `created_at`) VALUES
(1, 'Champion valorant', 'giải đấu valorant, sự kiện hot nhất năm 2026', 'assets/uploads/events/1780817860_capsule_616x353(15).jpg', '2026-06-07 16:37:00', '2026-06-15 16:37:00', 3, 'ended', 'neon', '2026-06-07 14:37:40'),
(2, 'Hội thảo AI & Machine Learning 2026', 'Khám phá các xu hướng AI mới nhất, mô hình ngôn ngữ lớn và ứng dụng thực tế trong doanh nghiệp.', 'assets/uploads/events/1781521589_baner 2.jpg', '2026-07-10 09:00:00', '2026-07-10 17:00:00', 200, 'upcoming', 'pulse', '2026-06-15 18:03:18'),
(3, 'Workshop Lập trình React nâng cao', 'Buổi thực hành chuyên sâu về React 19, hooks, performance và kiến trúc ứng dụng quy mô lớn.', 'assets/uploads/events/1781521599_capsule_616x353(3).jpg', '2026-06-25 14:00:00', '2026-06-25 18:00:00', 80, 'upcoming', 'galaxy', '2026-06-15 18:03:18'),
(4, 'Triển lãm thiết bị công nghệ TechExpo', 'Trưng bày laptop, smartphone, thiết bị VR/AR và gadget mới nhất từ các hãng công nghệ hàng đầu.', 'assets/uploads/events/1781521610_capsule_616x353(10).jpg', '2026-08-01 08:30:00', '2026-08-03 17:00:00', 500, 'upcoming', 'rainbow', '2026-06-15 18:03:18'),
(5, 'Cuộc thi Hackathon 48 giờ', 'Thử thách lập trình liên tục 48 giờ, xây dựng sản phẩm sáng tạo và tranh giải thưởng hấp dẫn.', 'assets/uploads/events/1781521625_wallhaven-o3rjp5_1920x1080.png', '2026-06-20 08:00:00', '2026-06-22 08:00:00', 120, 'upcoming', 'ice', '2026-06-15 18:03:18'),
(6, 'Meetup cộng đồng DevOps Việt Nam', 'Giao lưu, chia sẻ kinh nghiệm về CI/CD, Docker, Kubernetes và văn hóa DevOps.', 'assets/uploads/events/1781521581_capsule_616x353(15).jpg', '2026-06-15 18:00:00', '2026-06-15 21:00:00', 60, 'ended', 'neon', '2026-06-15 18:03:18'),
(7, 'Khóa học An ninh mạng cơ bản', 'Nhập môn bảo mật: tấn công phổ biến, phòng thủ, mã hóa và bảo vệ dữ liệu cá nhân.', 'assets/uploads/events/1781521572_capsule_231x87(1).jpg', '2026-06-14 09:00:00', '2026-06-16 16:00:00', 100, 'ended', 'fire', '2026-06-15 18:03:18'),
(8, 'Tọa đàm Blockchain & Web3', 'Thảo luận về tương lai của blockchain, hợp đồng thông minh và nền kinh tế phi tập trung.', 'assets/uploads/events/1781521544_2284091-steam77.jpg', '2026-05-30 13:30:00', '2026-05-30 17:30:00', 150, 'ended', 'neon', '2026-06-15 18:03:18'),
(9, 'Giải đấu Esports Mùa Hè', 'Giải đấu game đối kháng quy mô lớn với nhiều đội tuyển và phần thưởng giá trị.', 'assets/uploads/events/1781521529_capsule_616x353(24).jpg', '2026-05-20 09:00:00', '2026-05-21 20:00:00', 300, 'ended', 'neon', '2026-06-15 18:03:18'),
(10, 'Hội nghị Khởi nghiệp Công nghệ', 'Kết nối startup với nhà đầu tư, chia sẻ câu chuyện gọi vốn và mở rộng thị trường.', 'assets/uploads/events/1781521481_wallhaven-e7l12l_1920x1080.png', '2026-05-10 08:00:00', '2026-05-10 18:00:00', 250, 'ended', 'neon', '2026-06-15 18:03:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_messages`
--

CREATE TABLE `event_messages` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `event_messages`
--

INSERT INTO `event_messages` (`id`, `event_id`, `user_id`, `message`, `is_system`, `created_at`) VALUES
(1, 1, 8, 'hello toi la nhan', 0, '2026-06-07 15:35:46'),
(2, 1, 8, 'co ai khong', 0, '2026-06-07 15:35:53'),
(3, 1, 13, 'hello toi là nhan tdc', 0, '2026-06-07 15:38:01'),
(4, 1, 8, 'hello cchao2 ban', 0, '2026-06-07 15:38:58'),
(5, 1, 13, 'hi', 0, '2026-06-07 15:39:11'),
(6, 1, 8, 'hey', 0, '2026-06-08 03:20:46'),
(7, 1, 8, 'hey', 0, '2026-06-15 19:11:21'),
(8, 1, 8, 'hi', 0, '2026-06-15 19:11:36'),
(9, 1, 8, ' đã check-in sự kiện', 1, '2026-06-15 19:11:39'),
(10, 1, 8, 'da checkin', 0, '2026-06-15 19:12:57'),
(11, 7, 8, 'hi', 0, '2026-06-16 02:09:08'),
(12, 7, 8, ' đã check-in sự kiện', 1, '2026-06-16 02:09:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `confirm_token` varchar(255) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `confirmed_at` datetime DEFAULT NULL,
  `checked_in_at` datetime DEFAULT NULL,
  `reward_claimed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `event_registrations`
--

INSERT INTO `event_registrations` (`id`, `event_id`, `user_id`, `confirm_token`, `status`, `confirmed_at`, `checked_in_at`, `reward_claimed_at`, `created_at`) VALUES
(1, 1, 1, '4beb0c351a30d0c1c28d4114ed87cb12', 'pending', NULL, NULL, NULL, '2026-06-07 15:32:42'),
(2, 1, 8, 'b80d23721d562725844e2ecb53ef2501', 'confirmed', '2026-06-07 15:35:09', '2026-06-15 19:11:39', '2026-06-15 19:21:20', '2026-06-07 15:33:57'),
(3, 1, 13, 'c469ec6584ec0aef70a21dcaa13200da', 'confirmed', '2026-06-07 15:37:22', NULL, NULL, '2026-06-07 15:37:11'),
(4, 1, 4, '46688509b204237fdd5c7e35e24c8569', 'pending', NULL, NULL, NULL, '2026-06-08 04:53:46'),
(5, 7, 8, '09a74a802c969107d636cbedd47caf34', 'confirmed', '2026-06-16 02:08:47', '2026-06-16 02:09:24', '2026-06-16 17:10:48', '2026-06-16 02:08:27'),
(6, 5, 8, '70c0b210fcd73e98ec7bf13955a1a21a', 'confirmed', '2026-06-16 23:25:03', NULL, NULL, '2026-06-16 23:23:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT 'event_register',
  `is_read` tinyint(4) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `event_id`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 8, 1, 'Nguyễn Nhân đã xác nhận tham gia sự kiện Champion valorant', 'event_register', 0, '2026-06-07 15:35:09'),
(2, 13, 1, 'Nhan TDC đã xác nhận tham gia sự kiện Champion valorant', 'event_register', 0, '2026-06-07 15:37:22'),
(5, NULL, 8, 'Sự kiện Tọa đàm Blockchain & Web3 đã kết thúc', 'event_ended', 0, '2026-06-15 18:03:21'),
(6, NULL, 9, 'Sự kiện Giải đấu Esports Mùa Hè đã kết thúc', 'event_ended', 0, '2026-06-15 18:03:21'),
(7, NULL, 10, 'Sự kiện Hội nghị Khởi nghiệp Công nghệ đã kết thúc', 'event_ended', 0, '2026-06-15 18:03:21'),
(8, NULL, 1, 'Sự kiện Champion valorant đã kết thúc', 'event_ended', 0, '2026-06-15 19:14:19'),
(9, NULL, 6, 'Sự kiện Meetup cộng đồng DevOps Việt Nam đã kết thúc', 'event_ended', 0, '2026-06-15 21:00:02'),
(10, 8, 7, 'Nguyễn Nhân đã xác nhận tham gia sự kiện Khóa học An ninh mạng cơ bản', 'event_register', 0, '2026-06-16 02:08:47'),
(11, NULL, 7, 'Sự kiện Khóa học An ninh mạng cơ bản đã kết thúc', 'event_ended', 0, '2026-06-16 16:31:47'),
(12, 8, 5, 'Nguyễn Nhân đã xác nhận tham gia sự kiện Cuộc thi Hackathon 48 giờ', 'event_register', 0, '2026-06-16 23:25:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `category_id`, `title`, `slug`, `thumbnail`, `content`, `views`, `created_at`, `updated_at`) VALUES
(3, 2, 'Dell', 'dell-xps', 'assets/uploads/posts/1779464577_avatar_github.jpg', 'may tin hsieu manh', 12, '2026-05-22 22:42:57', NULL),
(4, 1, 'iphone 5', 'iphone-5', 'assets/uploads/posts/1779469438_wallhaven-g7z7gd_1920x1080.png', 'iphone 5 gon nhe', 19, '2026-05-22 23:49:52', '2026-05-23 00:03:58'),
(5, 7, 'oculus quest 2', 'oculus-quest-2', 'assets/uploads/posts/1779508115_-q1kinh-thuc-te-ao-oculus-quest-2-min-mobile-q4_result_9f730879c9cd4d63b416244b08208f82_grande.jpg', 'kham pha the gioi ao', 22, '2026-05-23 10:48:35', NULL),
(6, 6, 'Máy Chơi Game Nintendo Switch 2', 'nintendo-switch-2', 'assets/uploads/posts/1779508315_nintendo-switch-neon-joy-con-46-700x700_d409926bd9af499b9e1de89c9caff557.jpg', 'intendo Switch là máy chơi game cầm tay kiêm máy chơi game gia đình (hybrid) do Nintendo ra mắt. Điểm đột phá của thiết bị là người chơi có thể gắn vào đế (dock) để chơi trên TV tại nhà, hoặc tháo rời cầm tay mang đi bất cứ đâu.', 8, '2026-05-23 10:51:55', NULL),
(7, 8, 'Game kinh di', 'game-kinh-di', 'assets/uploads/posts/1781336726_streetmove.gif', 'Game kinh di năm 2026', 2, '2026-06-13 14:45:26', NULL),
(8, 7, 'vr kala', 'vr-in', 'assets/uploads/posts/1781336774_traidat.gif', 'trai dat', 11, '2026-06-13 14:46:14', NULL),
(9, 1, 'mobile phone', 'mobile-phone', 'assets/uploads/posts/1781336801_rain.gif', 'rain mobile', 13, '2026-06-13 14:46:41', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expired_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` enum('active','inactive') DEFAULT 'active',
  `avatar` varchar(255) DEFAULT NULL,
  `equipped_effect` varchar(30) NOT NULL DEFAULT 'none',
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `otp_code`, `otp_expired_at`, `created_at`, `status`, `avatar`, `equipped_effect`, `deleted_at`) VALUES
(1, 'Nhan', 'nhan@gmail.com', '$2y$10$AHHvVX4PyzjsNkiR3Nd6sOoCEFajkUYUuDAt9CujbNietqREJOCGy', 'user', '655351', '2026-05-21 02:47:08', '2026-05-21 02:32:23', 'active', 'assets/uploads/avatars/1781550850_1_bicycle.gif', 'none', NULL),
(4, 'Admin', 'admin@gmail.com', '$2y$10$nNmSQZMpMDNes0ocD5BjkOCmCA97NboWy9KgidH656pd98W0XYHbe', 'admin', NULL, NULL, '2026-05-21 02:33:49', 'active', NULL, 'none', NULL),
(6, 'jame22', 'jame@gmail.com', '$2y$10$1lmxHwS7vIE3y5E4gFE7Eu.L8JEfStDh9WBJ7Hu8byjMKZsuNKnPW', 'user', NULL, NULL, '2026-05-22 23:19:12', 'inactive', NULL, 'none', '2026-06-15 16:40:06'),
(8, 'Nguyễn Nhân', 'nguyennhan03012016@gmail.com', '$2y$10$pKrQj3Y9.gch1mmb6mHoquY9xyVTCUMsz9ZyW5mRcIMkELjgo/Ytm', 'user', NULL, NULL, '2026-05-23 00:37:29', 'active', 'assets/uploads/avatars/1781550657_8_naruto2.gif', 'neon', NULL),
(13, 'Nhan TDC', '24211TT4099@mail.tdc.edu.vn', '$2y$10$9g9g.tMC9aA/Fg9TyC7Z8unWs6s06PF6QP0jp6jv4Cun7MoTo.b3.', 'user', NULL, NULL, '2026-06-07 15:36:51', 'active', NULL, 'none', NULL),
(14, 'bin', 'binhocit22t@gmail.com', '$2y$10$AC5kCOT3ppRgv3AtnyMNg.y/PzSNgHmr8x75RW.hv9DeOIDXjZHgq', 'user', NULL, NULL, '2026-06-07 15:44:14', 'active', NULL, 'none', NULL),
(15, 'naruto', 'naruto@gmail.com', '$2y$10$FD1lY0t.9w9t5DQpgHMLZuqHXWec/H.TnBTakfVvSj1gtZHfhlSOS', 'user', NULL, NULL, '2026-06-16 22:54:40', 'active', NULL, 'none', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_post` (`user_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Chỉ mục cho bảng `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `event_messages`
--
ALTER TABLE `event_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_event` (`event_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `event_messages`
--
ALTER TABLE `event_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `event_messages`
--
ALTER TABLE `event_messages`
  ADD CONSTRAINT `event_messages_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
