import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post("/register", form);

            alert(response.data.message);

            navigate("/login");
        } catch (error) {
            console.log(error);
            alert("Đăng ký thất bại");
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h1>Đăng ký</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ tên</label>
                        <input
                            type="text"
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            placeholder="Nhập họ tên"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button className="btn" type="submit">
                        Đăng ký
                    </button>
                </form>

                <p style={{ marginTop: "15px" }}>
                    Đã có tài khoản? <Link to="/login" style={{
                                color: "#0284c7",
                                fontWeight: "bold"
                            }}>Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}