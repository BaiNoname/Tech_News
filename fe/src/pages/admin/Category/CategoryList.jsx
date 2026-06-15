import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [page]);

    const fetchCategories = async () => {
        const response = await axiosClient.get(
            `/categories?search=${search}&page=${page}&limit=5`
        );
        setCategories(response.data.data.categories || []);
        setPagination(response.data.data.pagination);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchCategories();
    };

    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        const response = await axiosClient.delete(`/categories/${id}`);
        alert(response.data.message);
        fetchCategories();
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Quản lý danh mục</h1>

                <Link className="btn" to="/admin/categories/create">
                    Thêm danh mục
                </Link>
            </div>

            <form className="search-box" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Tìm danh mục..."
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
                            <th>Tên danh mục</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan={3}>Không có danh mục nào</td>
                            </tr>
                        )}

                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <div className="action-buttons">
                                        <Link
                                            className="btn btn-small"
                                            to={`/admin/categories/edit/${category.id}`}
                                        >
                                            Sửa
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-small"
                                            onClick={() => handleDelete(category.id)}
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