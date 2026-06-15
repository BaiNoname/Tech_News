import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";

export default function CategoryCreate() {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axiosClient.post("/categories", { name });

        alert(response.data.message);

        navigate("/admin/categories");
    };

    return (
        <div className="admin-form-box">
            <div className="admin-header">
                <h1>Thêm danh mục</h1>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/categories")}>← Quay lại</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên danh mục</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên danh mục"
                    />
                </div>

                <button className="btn">
                    Thêm danh mục
                </button>
            </form>
        </div>
    );
}