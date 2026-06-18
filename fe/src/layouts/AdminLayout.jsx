import { NavLink, Outlet, useNavigate } from "react-router-dom";

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
                <div className="admin-brand">
                    <span className="admin-brand-logo">⚡</span>
                    <span>TechNews Admin</span>
                </div>

                <div className="admin-user-mini">
                    <div className="admin-user-avatar">
                        {user.full_name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="admin-user-info">
                        <strong>{user.full_name}</strong>
                        <small>Quản trị viên</small>
                    </div>
                </div>

                <nav className="admin-nav">
                    <NavLink end to="/admin">
                        <span className="nav-ico">📊</span> Dashboard
                    </NavLink>
                    <NavLink to="/admin/users">
                        <span className="nav-ico">👥</span> Quản lý user
                    </NavLink>
                    <NavLink to="/admin/posts">
                        <span className="nav-ico">📝</span> Quản lý bài viết
                    </NavLink>
                    <NavLink to="/admin/categories">
                        <span className="nav-ico">🏷️</span> Quản lý danh mục
                    </NavLink>
                    <NavLink to="/admin/events">
                        <span className="nav-ico">🎫</span> Quản lý sự kiện
                    </NavLink>
                    <NavLink to="/admin/profile">
                        <span className="nav-ico">⚙️</span> Hồ sơ & mật khẩu
                    </NavLink>
                </nav>

                <button className="admin-logout" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}