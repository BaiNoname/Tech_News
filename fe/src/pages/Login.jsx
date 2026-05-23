import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
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
            const response = await axiosClient.post("/login", form);

            if (response.data.success) {
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));

                navigate("/");
                window.location.reload();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Đăng nhập thất bại");
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <h1>Đăng nhập</h1>

                <form onSubmit={handleSubmit}>
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
                        Đăng nhập
                    </button>
                </form>

                <div style={{ marginTop: "15px" }}>

                    <p>
                        Chưa có tài khoản?{" "}
                        <Link
                            to="/register"
                            style={{
                                color: "#0284c7",
                                fontWeight: "bold"
                            }}
                        >
                            Đăng ký
                        </Link>
                    </p>

                    <p style={{ marginTop: "10px" }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                color: "#ef4444",
                                fontWeight: "bold"
                            }}
                        >
                            Quên mật khẩu?
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}