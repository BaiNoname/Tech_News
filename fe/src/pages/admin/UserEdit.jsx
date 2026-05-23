import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        password: "",
        role: "user"
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
            role: user.role
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
            <h1>Sửa user</h1>

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

                <button className="btn">
                    Cập nhật user
                </button>
            </form>
        </div>
    );
}