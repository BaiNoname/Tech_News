import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { API_URL } from "../config";

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user && user.role === "admin";

    const [event, setEvent] = useState(null);
    const [myStatus, setMyStatus] = useState({
        registered: false,
        status: null,
        checked_in: false,
        reward_claimed: false
    });

    useEffect(() => {
        fetchEvent();
        if (user) fetchMyStatus();
    }, [id]);

    const fetchEvent = async () => {
        const response = await axiosClient.get(`/events/${id}`);
        setEvent(response.data.data);
    };

    const fetchMyStatus = async () => {
        try {
            const response = await axiosClient.get(`/events/${id}/my-status`);
            if (response.data.success) setMyStatus(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleRegister = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        const response = await axiosClient.post(`/events/${id}/register`);
        alert(response.data.message);
        fetchMyStatus();
    };

    const handleEnterChat = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        navigate(`/events/${event.id}/chat`);
    };

    if (!event) {
        return (
            <div className="container">
                <p>Đang tải sự kiện...</p>
            </div>
        );
    }

    const isClosed = event.status === "ended" || event.status === "cancelled";

    // Đã xác nhận tham gia (hoặc admin) thì mới được vào group chat
    const canEnterChat = isAdmin || myStatus.status === "confirmed";

    return (
        <main className="container">
            <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: "25px" }}
                onClick={() => navigate("/events")}
            >
                ← Quay lại sự kiện
            </button>

            <article className="detail-box">
                <span className={`event-status status-${event.status}`}>
                    {event.status}
                </span>

                <h1 className="hero-title">{event.title}</h1>

                <p className="post-meta">
                    👥 {event.registered_count}/{event.max_participants} người tham gia
                </p>

                <p className="post-meta">
                    🕒 {event.start_time} - {event.end_time}
                </p>

                {event.thumbnail && (
                    <img
                        className="detail-img"
                        src={`${API_URL}/${event.thumbnail}`}
                        alt={event.title}
                    />
                )}

                <div
                    style={{
                        marginTop: "25px",
                        lineHeight: "1.8",
                        fontSize: "17px"
                    }}
                >
                    {event.description}
                </div>

                <div className="event-actions">
                    {/* Nút đăng ký: chỉ hiện khi chưa đăng ký và sự kiện chưa kết thúc */}
                    {!myStatus.registered && !isAdmin && (
                        <button
                            className="btn"
                            disabled={isClosed}
                            onClick={handleRegister}
                        >
                            Đăng ký tham gia
                        </button>
                    )}

                    {/* Đã đăng ký nhưng chưa xác nhận email */}
                    {myStatus.registered && myStatus.status !== "confirmed" && (
                        <span className="event-pending-note">
                            ⏳ Bạn đã đăng ký, vui lòng kiểm tra email để xác nhận tham gia.
                        </span>
                    )}

                    {/* Nút group chat: chỉ hiện khi đã xác nhận (hoặc admin) */}
                    {canEnterChat && (
                        <button
                            className="btn btn-success"
                            onClick={handleEnterChat}
                        >
                            Vào group chat
                        </button>
                    )}
                </div>

                {isClosed && (
                    <p className="event-closed-note">
                        Sự kiện đã kết thúc. Bạn không thể đăng ký mới
                        {canEnterChat
                            ? ", nhưng vẫn vào group chat để xem lại và nhận thưởng (nếu đã check-in)."
                            : "."}
                    </p>
                )}
            </article>
        </main>
    );
}