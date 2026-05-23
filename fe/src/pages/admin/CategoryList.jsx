import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const response = await axiosClient.get("/categories");
        setCategories(response.data.data);
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
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}