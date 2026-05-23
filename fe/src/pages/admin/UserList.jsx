import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await axiosClient.get("/users");
        setUsers(response.data.data);
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa user này?")) return;

        const response = await axiosClient.delete(`/users/${id}`);

        alert(response.data.message);

        fetchUsers();
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Quản lý user</h1>
                <Link className="btn" to="/admin/users/create">
                    Thêm user
                </Link>
            </div>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.created_at}</td>

                                <td>
                                    <Link
                                        className="btn btn-small"
                                        to={`/admin/users/edit/${user.id}`}
                                    >
                                        Sửa
                                    </Link>

                                    <button
                                        className="btn btn-danger btn-small"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}