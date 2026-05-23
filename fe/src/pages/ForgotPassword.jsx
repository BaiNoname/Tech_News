import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axiosClient.post("/forgot-password", {
            email: email
        });

        alert(response.data.message);

        if (response.data.success) {
            navigate("/reset-password", {
                state: { email: email }
            });
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h1>Quên mật khẩu</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email tài khoản"
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            marginTop: "20px"
                        }}
                    >
                        <button className="btn">
                            Gửi OTP
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{
                                border: "none",
                                padding: "10px 16px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                background: "#64748b",
                                color: "white"
                            }}
                        >
                            ← Quay lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}