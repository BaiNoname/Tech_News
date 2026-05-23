import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        old_password: "",
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

        const response = await axiosClient.post("/change-password", form);

        alert(response.data.message);

        if (response.data.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h1>Đổi mật khẩu</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Mật khẩu cũ</label>
                        <input
                            type="password"
                            name="old_password"
                            value={form.old_password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="new_password"
                            value={form.new_password}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "20px"
                    }}>
                        <button className="btn">
                            Đổi mật khẩu
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