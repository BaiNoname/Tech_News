import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function UserTrash() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchTrashed();
    }, []);

    const fetchTrashed = async () => {
        const response = await axiosClient.get("/users/trash");
        setUsers(response.data.data || []);
    };

    // Khôi phục user đã xóa mềm (deleted_at -> NULL)
    const handleRestore = async (id) => {
        if (!confirm("Khôi phục user này về danh sách hoạt động?")) return;

        const response = await axiosClient.put(`/users/${id}/restore`);
        alert(response.data.message);
        fetchTrashed();
    };

    // Xóa cứng vĩnh viễn (DELETE /users/{id}/force)
    const handleForceDelete = async (id) => {
        if (!confirm("XÓA VĨNH VIỄN user này? Hành động KHÔNG thể hoàn tác.")) return;

        const response = await axiosClient.delete(`/users/${id}/force`);
        alert(response.data.message);
        fetchTrashed();
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Thùng rác user</h1>

                <Link className="btn" to="/admin/users">
                    ← Quay lại danh sách
                </Link>
            </div>

            <div className="admin-tabs">
                <Link to="/admin/users" className="admin-tab">
                    Đang hoạt động
                </Link>

                <button className="admin-tab active">
                    Thùng rác
                    <span className="badge-count">{users.length}</span>
                </button>
            </div>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Trạng thái</th>
                            <th>Ngày xóa</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan={7}>Thùng rác trống</td>
                            </tr>
                        )}

                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>

                                <td>
                                    <span className="status-deleted">
                                        Đã xóa
                                    </span>
                                </td>

                                <td>{user.deleted_at}</td>

                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-success btn-small"
                                            onClick={() => handleRestore(user.id)}
                                        >
                                            Khôi phục
                                        </button>

                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleForceDelete(user.id)}
                                        >
                                            Xóa vĩnh viễn
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}