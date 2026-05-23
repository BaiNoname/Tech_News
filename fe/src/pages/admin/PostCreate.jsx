import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function PostCreate() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        category_id: "",
        title: "",
        slug: "",
        content: "",
    });

    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {

        fetchCategories();

    }, []);

    const fetchCategories = async () => {

        try {

            const response = await axiosClient.get("/categories");

            setCategories(response.data.data);

        } catch (error) {

            console.log(error);
        }
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

        try {

            const formData = new FormData();

            formData.append("category_id", form.category_id);
            formData.append("title", form.title);
            formData.append("slug", form.slug);
            formData.append("content", form.content);

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            const response = await axiosClient.post(
                "/posts",
                formData
            );

            alert(response.data.message);

            navigate("/admin/posts");

        } catch (error) {

            console.log(error);

            alert("Thêm bài viết thất bại");
        }
    };

    return (
        <div className="admin-form-box">

            <h1>Thêm bài viết</h1>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Danh mục</label>

                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                    >
                        <option value="">
                            Chọn danh mục
                        </option>

                        {
                            categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label>Tiêu đề</label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Slug</label>

                    <input
                        type="text"
                        name="slug"
                        value={form.slug}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Ảnh thumbnail</label>

                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="form-group">
                    <label>Nội dung</label>

                    <textarea
                        name="content"
                        rows="8"
                        value={form.content}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button className="btn">
                    Thêm bài viết
                </button>

            </form>
        </div>
    );
}