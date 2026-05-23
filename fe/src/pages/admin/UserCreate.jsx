import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function UserCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "user"
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axiosClient.post("/users", form);

        alert(response.data.message);

        navigate("/admin/users");
    };

    return (
        <div className="admin-form-box">
            <h1>Thêm user</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Họ tên</label>
                    <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                    />
                </div>

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
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Vai trò</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button className="btn">
                    Thêm user
                </button>
            </form>
        </div>
    );
}