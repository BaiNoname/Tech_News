import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function EventRegistrations() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchRegistrations();
    }, [id, page]);

    const fetchRegistrations = async () => {
        const response = await axiosClient.get(
            `/events/${id}/registrations?page=${page}&limit=10`
        );
        setRegistrations(response.data.data.registrations || []);
        setPagination(response.data.data.pagination);
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Danh sách đăng ký sự kiện</h1>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/events")}
                >
                    ← Quay lại
                </button>
            </div>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                            <th>Ngày đăng ký</th>
                            <th>Ngày xác nhận</th>
                        </tr>
                    </thead>

                    <tbody>
                        {registrations.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan={6}>Chưa có người đăng ký</td>
                            </tr>
                        )}

                        {registrations.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.full_name}</td>
                                <td>{item.email}</td>
                                <td>{item.status}</td>
                                <td>{item.created_at}</td>
                                <td>{item.confirmed_at || "Chưa xác nhận"}</td>
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