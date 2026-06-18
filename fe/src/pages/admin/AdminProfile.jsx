import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.new_password !== form.confirm_password) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        const response = await axiosClient.post("/change-password", {
            old_password: form.old_password,
            new_password: form.new_password
        });

        alert(response.data.message);

        if (response.data.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            window.location.reload();
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Hồ sơ admin</h1>
            </div>

            <div className="admin-profile-grid">
                <div className="admin-profile-card">
                    <div className="admin-profile-avatar">
                        {user?.full_name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <h2>{user?.full_name}</h2>
                    <p>{user?.email}</p>
                    <span className="admin-role-badge">Quản trị viên</span>
                </div>

                <div className="admin-form-box admin-password-card">
                    <h2>Đổi mật khẩu</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                name="old_password"
                                value={form.old_password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                name="new_password"
                                value={form.new_password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={form.confirm_password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button className="btn">Cập nhật mật khẩu</button>
                    </form>
                </div>
            </div>
        </div>
    );
}