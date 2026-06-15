import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function CommentBox({ postId }) {
    const user = JSON.parse(localStorage.getItem("user"));

    const [comments, setComments] = useState([]);
    const [ratingInfo, setRatingInfo] = useState({
        average_rating: 0,
        total_rating: 0
    });

    const [form, setForm] = useState({
        content: "",
        rating: 5
    });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        content: "",
        rating: 5
    });

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await axiosClient.get(`/posts/${postId}/comments`);

            setComments(response.data.data?.comments || []);

            setRatingInfo(
                response.data.data?.rating || {
                    average_rating: 0,
                    total_rating: 0
                }
            );
        } catch (error) {
            console.log(error);

            setComments([]);
            setRatingInfo({
                average_rating: 0,
                total_rating: 0
            });
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Bạn cần đăng nhập để đánh giá");
            return;
        }

        const response = await axiosClient.post(
            `/posts/${postId}/comments`,
            form
        );

        alert(response.data.message);

        setForm({
            content: "",
            rating: 5
        });

        fetchComments();
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditForm({
            content: comment.content,
            rating: comment.rating
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ content: "", rating: 5 });
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (id) => {
        const response = await axiosClient.put(`/comments/${id}`, editForm);
        alert(response.data.message);
        cancelEdit();
        fetchComments();
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

        const response = await axiosClient.delete(`/comments/${id}`);
        alert(response.data.message);
        fetchComments();
    };

    return (
        <section className="comment-section">
            <div className="rating-summary">
                <h2>Đánh giá bài viết</h2>

                <p>
                    ⭐ {ratingInfo?.average_rating || 0}/5 từ{" "}
                    {ratingInfo?.total_rating || 0} lượt đánh giá
                </p>
            </div>

            {user ? (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Số sao</label>
                        <select
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                        >
                            <option value="5">5 sao</option>
                            <option value="4">4 sao</option>
                            <option value="3">3 sao</option>
                            <option value="2">2 sao</option>
                            <option value="1">1 sao</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Bình luận</label>
                        <textarea
                            name="content"
                            rows="4"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="Nhập cảm nhận của bạn..."
                        ></textarea>
                    </div>

                    <button className="btn">
                        Gửi đánh giá
                    </button>
                </form>
            ) : (
                <p className="login-note">
                    Vui lòng{" "}
                    <Link to="/login" className="login-link">
                        đăng nhập
                    </Link>{" "}
                    để đánh giá bài viết.
                </p>
            )}

            <div className="comment-list">
                {comments.map((comment) => {
                    const isOwner =
                        user &&
                        Number(comment.user_id) === Number(user.id);

                    return (
                        <div className="comment-item" key={comment.id}>
                            {editingId === comment.id ? (
                                <div className="comment-edit">
                                    <div className="form-group">
                                        <label>Số sao</label>
                                        <select
                                            name="rating"
                                            value={editForm.rating}
                                            onChange={handleEditChange}
                                        >
                                            <option value="5">5 sao</option>
                                            <option value="4">4 sao</option>
                                            <option value="3">3 sao</option>
                                            <option value="2">2 sao</option>
                                            <option value="1">1 sao</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Bình luận</label>
                                        <textarea
                                            name="content"
                                            rows="3"
                                            value={editForm.content}
                                            onChange={handleEditChange}
                                        ></textarea>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-small"
                                            onClick={() => handleUpdate(comment.id)}
                                        >
                                            Lưu
                                        </button>

                                        <button
                                            className="btn btn-secondary btn-small"
                                            onClick={cancelEdit}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="comment-head">
                                        <strong>{comment.full_name}</strong>
                                        <span>⭐ {comment.rating}/5</span>
                                    </div>

                                    <p>{comment.content}</p>

                                    <small>{comment.created_at}</small>

                                    {isOwner && (
                                        <div className="action-buttons comment-actions">
                                            <button
                                                className="btn btn-small"
                                                onClick={() => startEdit(comment)}
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                className="btn btn-danger btn-small"
                                                onClick={() => handleDelete(comment.id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}