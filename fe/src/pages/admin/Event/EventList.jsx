import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

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
            `/events?search=${search}&page=${page}&limit=5`
        );
        setEvents(response.data.data.events || []);
        setPagination(response.data.data.pagination);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchEvents();
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa sự kiện này?")) return;
        const response = await axiosClient.delete(`/events/${id}`);
        alert(response.data.message);
        fetchEvents();
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Quản lý sự kiện</h1>

                <Link className="btn" to="/admin/events/create">
                    Thêm sự kiện
                </Link>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm sự kiện..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn">Tìm kiếm</button>
            </form>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ảnh</th>
                            <th>Tên sự kiện</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th>Thời gian</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan={7}>Không có sự kiện nào</td>
                            </tr>
                        )}

                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>{event.id}</td>

                                <td>
                                    {event.thumbnail && (
                                        <img
                                            src={`http://localhost/tech_news/be/${event.thumbnail}`}
                                            width="80"
                                            alt={event.title}
                                        />
                                    )}
                                </td>

                                <td>{event.title}</td>

                                <td>
                                    {event.registered_count}/{event.max_participants}
                                </td>

                                <td>
                                    <span className={`event-status status-${event.status}`}>
                                        {event.status}
                                    </span>
                                </td>

                                <td>
                                    {event.start_time}
                                    <br />
                                    {event.end_time}
                                </td>

                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            className="btn btn-small"
                                            to={`/admin/events/edit/${event.id}`}
                                        >
                                            Sửa
                                        </Link>

                                        <Link
                                            className="btn btn-success btn-small"
                                            to={`/admin/events/${event.id}/registrations`}
                                        >
                                            Người đăng ký
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDelete(event.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPage > 0 && (
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
        </div>
    );
}