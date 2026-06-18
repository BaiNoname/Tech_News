import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import EventAssistant from "../components/EventAssistant";

export default function EventChat() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user && user.role === "admin";

    const [event, setEvent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [asSystem, setAsSystem] = useState(false);

    const [myStatus, setMyStatus] = useState({
        registered: false,
        status: null,
        checked_in: false,
        reward_claimed: false
    });

    const [showReward, setShowReward] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchEvent();
        fetchMessages();
        fetchMyStatus();

        const interval = setInterval(() => {
            fetchMessages();
            fetchEvent();
        }, 3000);

        return () => clearInterval(interval);
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await axiosClient.get(`/events/${id}`);
            setEvent(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axiosClient.get(`/events/${id}/messages`);

            if (response.data.success) {
                setMessages(response.data.data);
                setErrorMessage("");
            } else {
                setMessages([]);
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            console.log(error);
            setMessages([]);
            setErrorMessage("Bạn chưa được phép vào group chat");
        }
    };

    const fetchMyStatus = async () => {
        try {
            const response = await axiosClient.get(`/events/${id}/my-status`);
            if (response.data.success) {
                setMyStatus(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (message.trim() === "") {
            return;
        }

        try {
            const response = await axiosClient.post(`/events/${id}/messages`, {
                message: message,
                is_system: asSystem ? 1 : 0
            });

            if (response.data.success) {
                setMessage("");
                setAsSystem(false);
                fetchMessages();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Không thể gửi tin nhắn");
        }
    };

    const handleCheckIn = async () => {
        try {
            const response = await axiosClient.post(`/events/${id}/checkin`);
            alert(response.data.message);
            fetchMyStatus();
            fetchMessages();
        } catch (error) {
            console.log(error);
            alert("Check-in thất bại");
        }
    };

    const handleClaimReward = async () => {
        try {
            const response = await axiosClient.post(`/events/${id}/claim-reward`);
            if (response.data.success) {
                setShowReward(true);
                fetchMyStatus();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Nhận thưởng thất bại");
        }
    };

    if (!event) {
        return (
            <div className="container">
                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginTop: "25px" }}
                    onClick={() => navigate("/events")}
                >
                    ← Quay lại sự kiện
                </button>

                <p>Đang tải group chat...</p>
            </div>
        );
    }

    const isOngoing = event.status === "ongoing";
    const isEnded = event.status === "ended" || event.status === "cancelled";

    // Chỉ KHÓA GỬI khi kết thúc, vẫn xem được chat + nhận thưởng
    const inputDisabled = isEnded || errorMessage !== "";

    const showRewardBtn =
        event.status === "ended" &&
        myStatus.status === "confirmed";

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

            <div className="chat-box">
                <div className="chat-header">
                    <div>
                        <h1>Group chat sự kiện</h1>
                        <p>{event.title}</p>
                    </div>

                    <span className={`event-status status-${event.status}`}>
                        {event.status}
                    </span>
                </div>

                <EventAssistant eventId={event.id} />

                {/* Khu vực check-in / nhận thưởng - luôn hiển thị cho người confirmed */}
                {myStatus.status === "confirmed" && (
                    <div className="event-action-bar">
                        {myStatus.checked_in ? (
                            <span className="checkin-badge">✓ Đã check-in</span>
                        ) : (
                            isOngoing && (
                                <button
                                    className="btn btn-success"
                                    onClick={handleCheckIn}
                                >
                                    📍 Check-in ngay
                                </button>
                            )
                        )}

                        {showRewardBtn && (
                            myStatus.reward_claimed ? (
                                <span className="reward-badge">🏆 Đã nhận thưởng</span>
                            ) : myStatus.checked_in ? (
                                <button
                                    className="btn btn-reward"
                                    onClick={handleClaimReward}
                                >
                                    🎁 Nhận thưởng
                                </button>
                            ) : (
                                <span className="reward-locked">
                                    🔒 Bạn chưa check-in nên không thể nhận thưởng
                                </span>
                            )
                        )}
                    </div>
                )}

                {/* Banner: chỉ là thông báo, KHÔNG chặn xem chat */}
                {errorMessage && (
                    <div className="event-closed-note">
                        {errorMessage}
                    </div>
                )}

                {isEnded && !errorMessage && (
                    <div className="event-closed-note">
                        Sự kiện đã kết thúc, bạn vẫn xem được nội dung nhưng không thể gửi tin nhắn mới.
                    </div>
                )}

                <div className="chat-messages">
                    {messages.map((item) => (
                        item.is_system == 1 ? (
                            <div className="chat-system" key={item.id}>
                                📢 {item.message}
                            </div>
                        ) : (
                            <div className="chat-message" key={item.id}>
                                <div className="chat-name">
                                    {item.full_name}
                                </div>

                                <div className="chat-content">
                                    {item.message}
                                </div>

                                <small>{item.created_at}</small>
                            </div>
                        )
                    ))}
                </div>

                {isAdmin && !isEnded && (
                    <label className="system-toggle">
                        <input
                            type="checkbox"
                            checked={asSystem}
                            onChange={(e) => setAsSystem(e.target.checked)}
                        />
                        Gửi dưới dạng thông báo (📢)
                    </label>
                )}

                <form className="chat-form" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={message}
                        disabled={inputDisabled}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                            isEnded
                                ? "Sự kiện đã kết thúc"
                                : errorMessage
                                    ? errorMessage
                                    : asSystem
                                        ? "Nhập thông báo gửi cho cả nhóm..."
                                        : "Nhập tin nhắn..."
                        }
                    />

                    <button className="btn" disabled={inputDisabled}>
                        Gửi
                    </button>
                </form>
            </div>

            {showReward && (
                <div className="reward-overlay" onClick={() => setShowReward(false)}>
                    <div className="confetti">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <span
                                key={i}
                                className="confetti-piece"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 0.6}s`,
                                    background: ["#0284c7", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"][i % 5]
                                }}
                            />
                        ))}
                    </div>

                    <div className="reward-card">
                        <div className="reward-medal">🏅</div>
                        <h2>Chúc mừng!</h2>
                        <p>Bạn đã nhận được huy hiệu tham gia sự kiện</p>
                        <strong className="reward-title">{event.title}</strong>
                        <button className="btn" onClick={() => setShowReward(false)}>
                            Tuyệt vời!
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}