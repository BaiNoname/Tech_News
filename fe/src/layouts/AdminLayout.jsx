import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    if (!user || user.role !== "admin") {
        return (
            <div className="container">
                <h2>Bạn không có quyền truy cập trang admin</h2>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2>TechNews Admin</h2>

                <Link to="/admin/users">
                    Quản lý user
                </Link>

                <Link to="/admin/posts">
                    Quản lý bài viết
                </Link>

                <Link to="/admin/categories">
                    Quản lý danh mục
                </Link>

                <Link to="/admin/events">
                    Quản lý sự kiện
                </Link>

                <button onClick={handleLogout}>
                    Đăng xuất
                </button>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}