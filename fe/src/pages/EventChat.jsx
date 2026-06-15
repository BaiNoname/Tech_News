import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function EventChat() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [event, setEvent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchEvent();
        fetchMessages();

        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, [id]);

    const fetchEvent = async () => {
        try {
            const response = await axiosClient.get(`/events/${id}`);
            setEvent(response.data.data);
        } catch (error) {
            console.log(error);
            setErrorMessage("Không tải được sự kiện");
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

    const handleSend = async (e) => {
        e.preventDefault();

        if (message.trim() === "") {
            return;
        }

        try {
            const response = await axiosClient.post(`/events/${id}/messages`, {
                message: message
            });

            alert(response.data.message);

            if (response.data.success) {
                setMessage("");
                fetchMessages();
            }
        } catch (error) {
            console.log(error);
            alert("Không thể gửi tin nhắn");
        }
    };

    if (!event) {
        return (
            <div className="container">
                <button
                    type="button"
                    className="btn-back"
                    style={{ marginTop: "25px" }}
                    onClick={() => navigate("/events")}
                >
                    ← Quay lại sự kiện
                </button>

                <p>Đang tải group chat...</p>
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

                {errorMessage && (
                    <div className="event-closed-note">
                        {errorMessage}
                    </div>
                )}

                {isClosed && (
                    <div className="event-closed-note">
                        Sự kiện đã kết thúc hoặc đã hủy, group chat đã bị khóa.
                    </div>
                )}

                <div className="chat-messages">
                    {messages.map((item) => (
                        <div className="chat-message" key={item.id}>
                            <div className="chat-name">
                                {item.full_name}
                            </div>

                            <div className="chat-content">
                                {item.message}
                            </div>

                            <small>{item.created_at}</small>
                        </div>
                    ))}
                </div>

                <form className="chat-form" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={message}
                        disabled={isClosed || errorMessage !== ""}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                            errorMessage
                                ? errorMessage
                                : isClosed
                                    ? "Sự kiện đã kết thúc"
                                    : "Nhập tin nhắn..."
                        }
                    />

                    <button
                        className="btn"
                        disabled={isClosed || errorMessage !== ""}
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </main>
    );
}