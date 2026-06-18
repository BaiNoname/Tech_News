import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Avatar from "./Avatar";
import { EFFECTS } from "../constants/effects";

export default function Header() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [unlocked, setUnlocked] = useState(["none"]);

    useEffect(() => {
        if (storedUser) {
            fetchProfile();
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axiosClient.get("/profile/me");
            if (response.data.success) {
                setProfile(response.data.data);
                setUnlocked(response.data.data.unlocked_effects || ["none"]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    const handleEquip = async (effectKey) => {
        try {
            const response = await axiosClient.put("/profile/effect", {
                effect: effectKey
            });
            if (response.data.success) {
                setProfile({ ...profile, equipped_effect: effectKey });
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const equipped = profile?.equipped_effect || "none";
    const myEffects = EFFECTS.filter((e) => unlocked.includes(e.key));

    return (
        <header className="header">
            <div className="container header-inner">
                <Link to="/" className="logo">
                    TechNews
                </Link>

                <nav className="nav">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/events">Sự kiện</Link>

                    {storedUser ? (
                        <>
                            {storedUser.role === "admin" && (
                                <Link to="/admin/posts">Admin</Link>
                            )}

                            <div className="user-dropdown">
                                <button
                                    className="user-btn"
                                    onClick={() => setOpen(!open)}
                                >
                                    <Avatar
                                        user={profile || storedUser}
                                        effect={equipped}
                                        size={34}
                                    />
                                    {storedUser.full_name} ▼
                                </button>

                                {open && (
                                    <div className="dropdown-menu">
                                        <Link to="/profile" onClick={() => setOpen(false)}>
                                            Trang cá nhân
                                        </Link>

                                        <Link to="/change-password" onClick={() => setOpen(false)}>
                                            Đổi mật khẩu
                                        </Link>

                                        {/* {myEffects.length > 1 && (
                                            <div className="dropdown-effects">
                                                <div className="dropdown-title">
                                                    Hiệu ứng avatar
                                                </div>

                                                {myEffects.map((e) => (
                                                    <div
                                                        key={e.key}
                                                        className={
                                                            "effect-row" +
                                                            (equipped === e.key ? " active" : "")
                                                        }
                                                        onClick={() => handleEquip(e.key)}
                                                    >
                                                        <Avatar
                                                            user={profile || storedUser}
                                                            effect={e.key}
                                                            size={28}
                                                        />
                                                        <span className="effect-name">
                                                            {e.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )} */}

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