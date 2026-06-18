import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import { EFFECTS } from "../../../constants/effects";

export default function EventCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        max_participants: 100,
        reward_effect: "neon"
    });

    const [thumbnail, setThumbnail] = useState(null);

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
        formData.append("reward_effect", form.reward_effect);
        // status do hệ thống tự set theo thời gian, gửi mặc định "upcoming"
        formData.append("status", "upcoming");

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        const response = await axiosClient.post("/events", formData);

        alert(response.data.message);

        navigate("/admin/events");
    };

    return (
        <div className="admin-form-box">
            <div className="admin-header">
                <h1>Thêm sự kiện</h1>

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
                    <label>Ảnh sự kiện</label>
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

                <div className="form-group">
                    <label>Hiệu ứng phần thưởng (mở khóa cho người nhận thưởng)</label>
                    <select name="reward_effect" value={form.reward_effect} onChange={handleChange}>
                        {EFFECTS.filter((ef) => ef.key !== "none").map((ef) => (
                            <option key={ef.key} value={ef.key}>{ef.name} — {ef.desc}</option>
                        ))}
                    </select>
                </div>



                <p className="form-note">
                    Trạng thái sự kiện được hệ thống tự cập nhật theo thời gian bắt đầu / kết thúc.
                </p>

                <button className="btn">
                    Thêm sự kiện
                </button>
            </form>
        </div>
    );
}