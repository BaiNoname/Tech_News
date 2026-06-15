import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [trashCount, setTrashCount] = useState(0);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchTrashCount();
    }, [page]);

    const fetchUsers = async () => {
        const response = await axiosClient.get(
            `/users?search=${search}&page=${page}&limit=5`
        );
        setUsers(response.data.data.users || []);
        setPagination(response.data.data.pagination);
    };

    const fetchTrashCount = async () => {
        try {
            const response = await axiosClient.get("/users/trash");
            setTrashCount((response.data.data || []).length);
        } catch {
            setTrashCount(0);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleLock = async (id) => {
        if (!confirm("Khóa tài khoản này? User sẽ không đăng nhập được.")) return;
        const response = await axiosClient.put(`/users/${id}/lock`);
        alert(response.data.message);
        fetchUsers();
    };

    const handleUnlock = async (id) => {
        if (!confirm("Mở khóa tài khoản này?")) return;
        const response = await axiosClient.put(`/users/${id}/unlock`);
        alert(response.data.message);
        fetchUsers();
    };

    const handleSoftDelete = async (id) => {
        if (!confirm("Chuyển user này vào thùng rác? Bạn có thể khôi phục sau.")) return;
        const response = await axiosClient.delete(`/users/${id}`);
        alert(response.data.message);
        fetchUsers();
        fetchTrashCount();
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Quản lý user</h1>

                <Link className="btn" to="/admin/users/create">
                    + Thêm user
                </Link>
            </div>

            <div className="admin-tabs">
                <button className="admin-tab active">
                    Đang hoạt động
                </button>

                <Link to="/admin/users/trash" className="admin-tab">
                    Thùng rác
                    <span className="badge-count">{trashCount}</span>
                </Link>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm theo tên hoặc email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn">Tìm kiếm</button>
            </form>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan={7}>Không có user nào</td>
                            </tr>
                        )}

                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>

                                <td>
                                    <span
                                        className={
                                            user.status === "active"
                                                ? "status-active"
                                                : "status-inactive"
                                        }
                                    >
                                        {user.status === "active"
                                            ? "Hoạt động"
                                            : "Đã khóa"}
                                    </span>
                                </td>

                                <td>{user.created_at}</td>

                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            className="btn btn-small"
                                            to={`/admin/users/edit/${user.id}`}
                                        >
                                            Sửa
                                        </Link>

                                        {user.status === "active" ? (
                                            <button
                                                className="btn btn-warning btn-small"
                                                onClick={() => handleLock(user.id)}
                                            >
                                                Khóa
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-small"
                                                onClick={() => handleUnlock(user.id)}
                                            >
                                                Mở khóa
                                            </button>
                                        )}

                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleSoftDelete(user.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPage > 0 && (
                <div className="pagination">
                    <button
                        className="btn"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Trước
                    </button>

                    <span>
                        Trang {pagination.page} / {pagination.totalPage}
                    </span>

                    <button
                        className="btn"
                        disabled={page >= pagination.totalPage}
                        onClick={() => setPage(page + 1)}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}