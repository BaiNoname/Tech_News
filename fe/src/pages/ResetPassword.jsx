import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: location.state?.email || "",
        otp: "",
        new_password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axiosClient.post("/reset-password", form);

        alert(response.data.message);

        if (response.data.success) {
            navigate("/login");
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h1>Đặt lại mật khẩu</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mã OTP</label>
                        <input
                            type="text"
                            name="otp"
                            value={form.otp}
                            onChange={handleChange}
                            placeholder="Nhập mã OTP"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="new_password"
                            value={form.new_password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>

                    <button className="btn">
                        Đặt lại mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
}