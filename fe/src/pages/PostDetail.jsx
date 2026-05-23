import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, useParams } from "react-router-dom";

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetchPostDetail();
    }, [id]);

    const fetchPostDetail = async () => {
        try {
            const response = await axiosClient.get(`/posts/${id}`);
            setPost(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!post) {
        return (
            <div className="container">
                <p>Đang tải bài viết...</p>
            </div>
        );
    }

    return (
        <main className="container">
            <article className="detail-box">
                <p className="post-category">
                    {post.category_name}
                </p>

                <h1 className="hero-title">
                    {post.title}
                </h1>

                <p className="post-meta">
                    Lượt xem: {post.views}
                </p>

                <img
                    className="detail-img"
                    src={`http://localhost/tech_news/be/${post.thumbnail}`}
                    alt={post.title}
                />

                <div style={{ marginTop: "25px", lineHeight: "1.8", fontSize: "17px" }}>
                    {post.content}
                </div>
                <button
                    className="btn"
                    style={{ marginTop: "25px" }}
                    onClick={() => navigate(-1)}
                >
                    ← Quay lại
                </button>
            </article>
        </main>
    );
}