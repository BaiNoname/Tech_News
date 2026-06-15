import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <header className="header">
            <div className="container header-inner">
                <Link to="/" className="logo">
                    TechNews
                </Link>

                <nav className="nav">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/events">Sự kiện</Link>


                    {user ? (
                        <>
                            {user.role === "admin" && (
                                <Link to="/admin/posts">
                                    Admin
                                </Link>
                            )}

                            <div className="user-dropdown">
                                <button
                                    className="user-btn"
                                    onClick={() => setOpen(!open)}
                                >
                                    Xin chào, {user.full_name} ▼
                                </button>

                                {open && (
                                    <div className="dropdown-menu">
                                        <Link to="/change-password">
                                            Đổi mật khẩu
                                        </Link>

                                        <button onClick={handleLogout}>
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Đăng nhập</Link>
                            <Link to="/register">Đăng ký</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}