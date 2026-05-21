<?php

require_once './vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();

    $mail->Host = 'smtp.gmail.com';

    $mail->SMTPAuth = true;

    $mail->Username = 'nguyennhan03012016@gmail.com';

    $mail->Password = 'sgiv hwlh mhhd zwyq';

    $mail->SMTPSecure = 'tls';

    $mail->Port = 587;

    $mail->setFrom('nguyennhan03012016@gmail.com', 'Tech News');

    $mail->addAddress('24211TT4099@mail.tdc.edu.vn');

    $mail->isHTML(true);

    $mail->Subject = 'Test SMTP';

    $mail->Body = '<h1>Hello SMTP</h1>';

    $mail->send();

    echo "Send success";

} catch (Exception $e) {

    echo $mail->ErrorInfo;
}