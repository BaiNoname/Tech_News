<?php

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