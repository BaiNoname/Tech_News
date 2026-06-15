import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, [page]);

    const fetchEvents = async () => {
        const response = await axiosClient.get(
            `/events?search=${search}&page=${page}&limit=6`
        );

        setEvents(response.data.data.events || []);
        setPagination(response.data.data.pagination);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchEvents();
    };

    const getStatusText = (status) => {
        if (status === "upcoming") return "Sắp diễn ra";
        if (status === "ongoing") return "Đang diễn ra";
        if (status === "ended") return "Đã kết thúc";
        if (status === "cancelled") return "Đã hủy";
        return status;
    };

    return (
        <>
            <section className="hero-section hero-future">
                <div className="container hero-content">
                    <span className="hero-badge">TECH EVENTS</span>

                    <h1 className="hero-title future-title">
                        Sự kiện công nghệ
                    </h1>

                    <p className="hero-desc future-desc">
                        Tham gia các sự kiện công nghệ, AI, phần mềm và giao lưu cộng đồng.
                    </p>
                </div>
            </section>

            <main className="container">
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sự kiện..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn">Tìm kiếm</button>
                </form>

                <div className="event-grid">
                    {events.map((event) => (
                        <div className="event-card" key={event.id}>
                            <Link to={`/events/${event.id}`} className="card-img-link">
                                <img
                                    src={`http://localhost/tech_news/be/${event.thumbnail}`}
                                    alt={event.title}
                                />
                            </Link>

                            <div className="event-content">
                                <span className={`event-status status-${event.status}`}>
                                    {getStatusText(event.status)}
                                </span>

                                <h2>
                                    <Link to={`/events/${event.id}`}>{event.title}</Link>
                                </h2>

                                <p className="event-desc">
                                    {event.description}
                                </p>

                                <p className="event-meta">
                                    👥 {event.registered_count}/{event.max_participants} người tham gia
                                </p>

                                <p className="event-meta">
                                    🕒 {event.start_time} - {event.end_time}
                                </p>

                                <Link className="btn" to={`/events/${event.id}`}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {pagination && (
                    <div className="pagination">
                        <button
                            className="btn"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Trước
                        </button>

                        <span>
                            Trang {pagination.page} / {pagination.totalPage}
                        </span>

                        <button
                            className="btn"
                            disabled={page >= pagination.totalPage}
                            onClick={() => setPage(page + 1)}
                        >
                            Sau
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}