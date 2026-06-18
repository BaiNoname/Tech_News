import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Avatar from "../components/Avatar";
import { EFFECTS } from "../constants/effects";

export default function Profile() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState(null);
    const [unlocked, setUnlocked] = useState(["none"]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!storedUser) {
            navigate("/login");
            return;
        }
        fetchProfile();
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

    const handleUpload = async () => {
        if (!file) {
            alert("Vui lòng chọn ảnh");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await axiosClient.post("/profile/avatar", formData);
            alert(response.data.message);
            setFile(null);
            fetchProfile();
        } catch (error) {
            console.log(error);
            alert("Upload thất bại");
        }
    };

    const handleEquip = async (effectKey) => {
        if (!unlocked.includes(effectKey)) return;

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

    if (!profile) {
        return (
            <div className="container">
                <p style={{ marginTop: 30 }}>Đang tải...</p>
            </div>
        );
    }

    const equipped = profile.equipped_effect || "none";

    return (
        <main className="container">
            <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: 25 }}
                onClick={() => navigate("/")}
            >
                ← Trang chủ
            </button>

            <div className="profile-box">
                <div className="profile-head">
                    <Avatar user={profile} effect={equipped} size={90} />
                    <div>
                        <h1 style={{ margin: 0 }}>{profile.full_name}</h1>
                        <p style={{ margin: "4px 0", color: "#64748b" }}>
                            {profile.email}
                        </p>
                    </div>
                </div>

                <div className="form-group">
                    <label>Đổi ảnh đại diện</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <button className="btn" onClick={handleUpload}>
                    Tải ảnh lên
                </button>

                <h2 style={{ marginTop: 30 }}>Hiệu ứng avatar</h2>
                <p style={{ color: "#64748b", marginTop: 0 }}>
                    Nhận thưởng từ sự kiện để mở khóa thêm hiệu ứng.
                </p>

                <div className="effect-grid">
                    {EFFECTS.map((e) => {
                        const isUnlocked = unlocked.includes(e.key);
                        return (
                            <div
                                key={e.key}
                                className={
                                    "effect-card" +
                                    (equipped === e.key ? " active" : "") +
                                    (isUnlocked ? "" : " locked")
                                }
                                onClick={() => handleEquip(e.key)}
                                title={e.desc}
                            >
                                <Avatar user={profile} effect={e.key} size={54} />
                                <span className="effect-label">{e.name}</span>
                                {!isUnlocked && (
                                    <span className="effect-lock">🔒 Chưa mở</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}