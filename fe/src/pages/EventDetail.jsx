import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [event, setEvent] = useState(null);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        const response = await axiosClient.get(`/events/${id}`);
        setEvent(response.data.data);
    };

    const handleRegister = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        const response = await axiosClient.post(`/events/${id}/register`);

        alert(response.data.message);
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

    return (
        <main className="container">
            <button
                type="button"
                className="btn-back"
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
                        src={`http://localhost/tech_news/be/${event.thumbnail}`}
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
                    <button
                        className="btn"
                        disabled={isClosed}
                        onClick={handleRegister}
                    >
                        Đăng ký tham gia
                    </button>

                    <button
                        className="btn btn-success"
                        disabled={isClosed}
                        onClick={handleEnterChat}
                    >
                        Vào group chat
                    </button>
                </div>

                {isClosed && (
                    <p className="event-closed-note">
                        Sự kiện đã kết thúc hoặc đã hủy, không thể tương tác.
                    </p>
                )}
            </article>
        </main>
    );
}