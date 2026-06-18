import { useState } from "react";
import axiosClient from "../api/axiosClient";

const SUGGESTIONS = [
    "Sự kiện này khi nào bắt đầu?",
    "Tôi đã check-in chưa?",
    "Còn chỗ trống không?",
    "Làm sao để nhận thưởng?"
];

export default function EventAssistant({ eventId }) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    // mỗi item: { role: 'user' | 'ai', text }
    const [history, setHistory] = useState([]);

    const ask = async (question) => {
        const q = question.trim();
        if (q === "" || loading) return;

        setHistory((prev) => [...prev, { role: "user", text: q }]);
        setInput("");
        setLoading(true);

        try {
            const response = await axiosClient.post(
                `/events/${eventId}/assistant`,
                { message: q }
            );

            if (response.data.success) {
                setHistory((prev) => [
                    ...prev,
                    { role: "ai", text: response.data.data.answer }
                ]);
            } else {
                setHistory((prev) => [
                    ...prev,
                    { role: "ai", text: response.data.message }
                ]);
            }
        } catch (error) {
            console.log(error);
            setHistory((prev) => [
                ...prev,
                { role: "ai", text: "Trợ lý AI tạm thời không phản hồi." }
            ]);
        }

        setLoading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        ask(input);
    };

    return (
        <div className={"assistant-box" + (open ? " open" : "")}>
            <button
                className="assistant-toggle"
                onClick={() => setOpen(!open)}
            >
                🤖 Trợ lý AI {open ? "▾" : "▸"}
            </button>

            {open && (
                <div className="assistant-body">
                    <div className="assistant-messages">
                        {history.length === 0 && (
                            <div className="assistant-hint">
                                Hỏi trợ lý về sự kiện này. Bấm gợi ý bên dưới hoặc tự nhập câu hỏi.
                            </div>
                        )}

                        {history.map((m, i) => (
                            <div
                                key={i}
                                className={
                                    "assistant-msg " +
                                    (m.role === "user" ? "from-user" : "from-ai")
                                }
                            >
                                {m.role === "ai" && <span className="ai-tag">🤖</span>}
                                <span>{m.text}</span>
                            </div>
                        ))}

                        {loading && (
                            <div className="assistant-msg from-ai">
                                <span className="ai-tag">🤖</span>
                                <span className="ai-typing">Đang trả lời...</span>
                            </div>
                        )}
                    </div>

                    <div className="assistant-suggestions">
                        {SUGGESTIONS.map((s) => (
                            <button
                                key={s}
                                className="assistant-chip"
                                disabled={loading}
                                onClick={() => ask(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <form className="assistant-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            disabled={loading}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Hỏi trợ lý AI..."
                        />
                        <button className="btn" disabled={loading}>
                            Gửi
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}