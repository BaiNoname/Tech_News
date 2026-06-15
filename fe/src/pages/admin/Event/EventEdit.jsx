import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function EventEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [oldThumbnail, setOldThumbnail] = useState("");
    const [thumbnail, setThumbnail] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        max_participants: 100
    });

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        const response = await axiosClient.get(`/events/${id}`);
        const event = response.data.data;

        setForm({
            title: event.title,
            description: event.description,
            start_time: event.start_time?.replace(" ", "T"),
            end_time: event.end_time?.replace(" ", "T"),
            max_participants: event.max_participants
        });

        setOldThumbnail(event.thumbnail);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("start_time", form.start_time);
        formData.append("end_time", form.end_time);
        formData.append("max_participants", form.max_participants);
        // status do hệ thống tự set theo thời gian, gửi mặc định "upcoming"
        formData.append("status", "upcoming");

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        const response = await axiosClient.post(
            `/events/update/${id}`,
            formData
        );

        alert(response.data.message);

        navigate("/admin/events");
    };

    return (
        <div className="admin-form-box">
            <div className="admin-header">
                <h1>Sửa sự kiện</h1>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/events")}
                >
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên sự kiện</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        rows="6"
                        value={form.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Ảnh hiện tại</label>
                    <br />
                    {oldThumbnail && (
                        <img
                            src={`http://localhost/tech_news/be/${oldThumbnail}`}
                            width="180"
                            alt="event"
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Ảnh mới nếu muốn đổi</label>
                    <input type="file" onChange={handleFileChange} />
                </div>

                <div className="form-group">
                    <label>Thời gian bắt đầu</label>
                    <input
                        type="datetime-local"
                        name="start_time"
                        value={form.start_time}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Thời gian kết thúc</label>
                    <input
                        type="datetime-local"
                        name="end_time"
                        value={form.end_time}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Số lượng tối đa</label>
                    <input
                        type="number"
                        name="max_participants"
                        value={form.max_participants}
                        onChange={handleChange}
                    />
                </div>

                <p className="form-note">
                    Trạng thái sự kiện được hệ thống tự cập nhật theo thời gian bắt đầu / kết thúc.
                </p>

                <button className="btn">
                    Cập nhật sự kiện
                </button>
            </form>
        </div>
    );
}