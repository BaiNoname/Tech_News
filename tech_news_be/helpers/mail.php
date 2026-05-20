<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/env.php';

function sendOTP($to, $otp)
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

        $mail->isHTML(true);
        $mail->Subject = "OTP Reset Password";
        $mail->Body = "Your OTP code is: <b>$otp</b>";

        $mail->send();

        return true;

    } catch (Exception $e) {
        return false;
    }
}