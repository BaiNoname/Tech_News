import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { API_URL } from "../config";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        const response = await axiosClient.get(
            `/posts?search=${search}&page=${page}&limit=6`
        );

        setPosts(response.data.data.posts);
        setPagination(response.data.data.pagination);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPosts();
    };

    return (
        <>
            <section className="hero-section hero-future">
                <div className="container hero-content">
                    <span className="hero-badge">TECH NEWS 2026</span>

                    <h1 className="hero-title future-title">
                        Tin tức công nghệ mới nhất
                    </h1>

                    <p className="hero-desc future-desc">
                        Cập nhật xu hướng AI, phần mềm, thiết bị và thế giới công nghệ mỗi ngày.
                    </p>
                </div>
            </section>

            <main className="container">
                <form onSubmit={handleSearch} className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn">Tìm kiếm</button>
                </form>

                <div className="post-grid">
                    {posts.map((post) => (
                        <div className="post-card" key={post.id}>
                            <Link to={`/posts/${post.id}`} className="card-img-link">
                                <img
                                    src={`${API_URL}/${post.thumbnail}`}
                                    alt={post.title}
                                />
                            </Link>

                            <div className="post-content">
                                <div className="post-category">
                                    {post.category_name}
                                </div>

                                <h2 className="post-title">
                                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                                </h2>

                                <p className="post-meta">
                                    Lượt xem: {post.views}
                                </p>

                                <Link className="btn" to={`/posts/${post.id}`}>
                                    Đọc bài viết
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