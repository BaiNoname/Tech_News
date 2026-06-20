<?php
require_once __DIR__ . "/../config/env.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

function sendOTP($to, $otp)
{
    $mail = new PHPMailer(true);

    try {

        $mail->isSMTP();

        $mail->Host = 'smtp.gmail.com';

        $mail->SMTPAuth = true;

        $mail->Username = 'nguyennhan03012016@gmail.com';

        $mail->Password = 'sgiv hwlh mhhd zwyq';

        $mail->SMTPSecure = 'tls';

        $mail->Port = 587;

        $mail->setFrom(
            'nguyennhan03012016@gmail.com',
            'Tech News'
        );

        $mail->addAddress($to);

        $mail->isHTML(true);

        $mail->Subject = 'OTP Reset Password';

        $mail->Body = "
            <h2>Your OTP Code</h2>
            <h1>$otp</h1>
        ";

        $mail->send();

        return true;

    } catch (Exception $e) {

        return false;
    }
}

function sendEventConfirmMail($to, $eventTitle, $token)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = 'tls';
        $mail->Port = SMTP_PORT;

        $mail->setFrom(SMTP_FROM, 'Tech News');
        $mail->addAddress($to);

        // $confirmLink = APP_BASE_URL . "/events/confirm?token=" . $token;
        $confirmLink = "http://localhost/tech_news/be/events/confirm?token=" . $token;

        $mail->isHTML(true);
        $mail->Subject = "Xac nhan tham gia su kien";
        $mail->Body = "
            <h2>Xác nhận tham gia sự kiện</h2>
            <p>Bạn đã đăng ký sự kiện: <b>$eventTitle</b></p>
            <p>Bấm vào link bên dưới để xác nhận:</p>
            <a href='$confirmLink'>$confirmLink</a>
        ";

        $mail->send();

        return true;
    } catch (Exception $e) {
        return false;
    }
}