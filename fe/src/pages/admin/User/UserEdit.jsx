import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        password: "",
        role: "user",
        status: "active"
    });

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        const response = await axiosClient.get(`/users/${id}`);

        const user = response.data.data;

        setForm({
            full_name: user.full_name,
            password: "",
            role: user.role,
            status: user.status
        });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axiosClient.put(`/users/${id}`, form);

        alert(response.data.message);

        navigate("/admin/users");
    };

    return (
        <div className="admin-form-box">
            <div className="admin-header">
                <h1>Sửa user</h1>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/users")}>← Quay lại</button>
            </div>

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
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Bỏ trống nếu không đổi"
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

                <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <button className="btn">
                    Cập nhật user
                </button>
            </form>
        </div>
    );
}