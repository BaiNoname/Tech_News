import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        const response = await axiosClient.get(
            `/posts?search=${search}&page=${page}&limit=5`
        );

        setPosts(response.data.data.posts);
        setPagination(response.data.data.pagination);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchPosts();
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa bài viết này?")) {
            return;
        }

        const response = await axiosClient.delete(`/posts/${id}`);

        alert(response.data.message);

        fetchPosts();
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Quản lý bài viết</h1>

                <Link className="btn" to="/admin/posts/create">
                    Thêm bài viết
                </Link>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button className="btn">
                    Tìm kiếm
                </button>
            </form>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ảnh</th>
                            <th>Tiêu đề</th>
                            <th>Danh mục</th>
                            <th>Lượt xem</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>

                                <td>
                                    <img
                                        src={`http://localhost/tech_news/be/${post.thumbnail}`}
                                        width="80"
                                        alt={post.title}
                                    />
                                </td>

                                <td>{post.title}</td>
                                <td>{post.category_name}</td>
                                <td>{post.views}</td>

                                <td>
                                    <Link
                                        className="btn btn-small"
                                        to={`/admin/posts/edit/${post.id}`}
                                    >
                                        Sửa
                                    </Link>

                                    <button
                                        className="btn btn-danger btn-small"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </div>
    );
}