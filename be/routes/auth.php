<?php

if ($uri == "register") {
    if ($method == "POST") {
        $userModel->register(
            $data["full_name"],
            $data["email"],
            $data["password"]
        );

        jsonResponse(true, "Register success");
    }
}

if ($uri == "login") {
    if ($method == "POST") {
        $user = $userModel->findByEmail($data["email"]);

        if (!$user) {
            jsonResponse(false, "Email not found");
        }

        if ($user["status"] == "inactive") {
            jsonResponse(false, "Tài khoản đã bị khóa");
        }

        if (!password_verify($data["password"], $user["password"])) {
            jsonResponse(false, "Password incorrect");
        }

        $token = generateToken($user);

        jsonResponse(true, "Login success", [
            "token" => $token,
            "user" => $user
        ]);
    }
}

if ($uri == "change-password") {
    if ($method == "POST") {
        $authUser = checkAuth();

        $oldPassword = $data["old_password"];
        $newPassword = $data["new_password"];

        $result = $userModel->changePassword(
            $authUser["id"],
            $oldPassword,
            $newPassword
        );

        if (!$result) {
            jsonResponse(false, "Mật khẩu cũ không đúng");
        }

        jsonResponse(true, "Đổi mật khẩu thành công");
    }
}

if ($uri == "forgot-password") {
    if ($method == "POST") {
        $email = $data["email"];

        $user = $userModel->findByEmail($email);

        if (!$user) {
            jsonResponse(false, "Email không tồn tại");
        }

        $otp = rand(100000, 999999);

        $userModel->saveOTP($email, $otp);

        $sendMail = sendOTP($email, $otp);

        if (!$sendMail) {
            jsonResponse(false, "Gửi OTP thất bại");
        }

        jsonResponse(true, "OTP đã được gửi về email");
    }
}

if ($uri == "verify-otp") {
    if ($method == "POST") {
        $email = $data["email"];
        $otp = $data["otp"];

        $user = $userModel->verifyOTP($email, $otp);

        if (!$user) {
            jsonResponse(false, "OTP không đúng hoặc đã hết hạn");
        }

        jsonResponse(true, "Xác thực OTP thành công");
    }
}

if ($uri == "reset-password") {
    if ($method == "POST") {
        $email = $data["email"];
        $otp = $data["otp"];
        $newPassword = $data["new_password"];

        $user = $userModel->verifyOTP($email, $otp);

        if (!$user) {
            jsonResponse(false, "OTP không đúng hoặc đã hết hạn");
        }

        $userModel->resetPassword($email, $newPassword);

        jsonResponse(true, "Đặt lại mật khẩu thành công");
    }
}