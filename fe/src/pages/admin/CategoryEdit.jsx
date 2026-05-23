import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function CategoryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const fetchCategory = async () => {
        const response = await axiosClient.get(`/categories/${id}`);
        setName(response.data.data.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axiosClient.put(`/categories/${id}`, { name });

        alert(response.data.message);

        navigate("/admin/categories");
    };

    return (
        <div className="admin-form-box">
            <h1>Sửa danh mục</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên danh mục</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <button className="btn">
                    Cập nhật danh mục
                </button>
            </form>
        </div>
    );
}