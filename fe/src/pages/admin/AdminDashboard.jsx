import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

// Hook đếm số động từ 0 -> value
function useCountUp(value, duration = 1000) {
    const [display, setDisplay] = useState(0);
    const startRef = useRef(null);

    useEffect(() => {
        let raf;
        const animate = (ts) => {
            if (!startRef.current) startRef.current = ts;
            const progress = Math.min((ts - startRef.current) / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) raf = requestAnimationFrame(animate);
        };
        startRef.current = null;
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [value, duration]);

    return display;
}

function StatCard({ icon, label, value, color, delay }) {
    const display = useCountUp(value);
    return (
        <div
            className="stat-card"
            style={{ "--accent": color, animationDelay: `${delay}s` }}
        >
            <div className="stat-icon">{icon}</div>
            <div className="stat-meta">
                <div className="stat-value">{display.toLocaleString()}</div>
                <div className="stat-label">{label}</div>
            </div>
        </div>
    );
}

// Donut chart bằng SVG cho sự kiện theo trạng thái
function DonutChart({ data }) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let offset = 0;
    const radius = 65;
    const circ = 2 * Math.PI * radius;

    return (
        <div className="donut-wrap">
            <svg viewBox="0 0 160 160" className="donut">
                {data.map((d, i) => {
                    const frac = d.value / total;
                    const dash = frac * circ;
                    const seg = (
                        <circle
                            key={i}
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="none"
                            stroke={d.color}
                            strokeWidth="18"
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            className="donut-seg"
                            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                        />
                    );
                    offset += dash;
                    return seg;
                })}
                <text x="80" y="74" textAnchor="middle" className="donut-total">
                    {total}
                </text>
                <text x="80" y="94" textAnchor="middle" className="donut-sub">
                    sự kiện
                </text>
            </svg>

            <div className="donut-legend">
                {data.map((d, i) => (
                    <div key={i} className="legend-item">
                        <span className="legend-dot" style={{ background: d.color }}></span>
                        {d.label}: <strong>{d.value}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Bar chart ngang cho bài viết theo danh mục
function BarChart({ data }) {
    const max = Math.max(...data.map((d) => d.total), 1);
    return (
        <div className="bar-chart">
            {data.length === 0 && <p className="muted">Chưa có dữ liệu</p>}
            {data.map((d, i) => (
                <div className="bar-row" key={i}>
                    <span className="bar-label">{d.name}</span>
                    <div className="bar-track">
                        <div
                            className="bar-fill"
                            style={{
                                width: `${(d.total / max) * 100}%`,
                                animationDelay: `${i * 0.08}s`
                            }}
                        >
                            <span className="bar-value">{d.total}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosClient.get("/dashboard/stats");
            if (response.data.success) setStats(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    if (!stats) {
        return (
            <div>
                <div className="admin-header"><h1>Dashboard</h1></div>
                <p>Đang tải số liệu...</p>
            </div>
        );
    }

    const t = stats.totals;

    const eventDonut = [
        { label: "Sắp diễn ra", value: stats.eventStatus.upcoming, color: "#0ea5e9" },
        { label: "Đang diễn ra", value: stats.eventStatus.ongoing, color: "#22c55e" },
        { label: "Đã kết thúc", value: stats.eventStatus.ended, color: "#94a3b8" }
    ];

    return (
        <div className="dashboard">
            <div className="admin-header">
                <h1>Dashboard</h1>
            </div>

            {/* Stat cards */}
            <div className="stat-grid">
                <StatCard icon="👥" label="Người dùng" value={t.users} color="#6366f1" delay={0} />
                <StatCard icon="📝" label="Bài viết" value={t.posts} color="#0ea5e9" delay={0.05} />
                <StatCard icon="🎫" label="Sự kiện" value={t.events} color="#22c55e" delay={0.1} />
                <StatCard icon="🏷️" label="Danh mục" value={t.categories} color="#f59e0b" delay={0.15} />
                <StatCard icon="💬" label="Bình luận" value={t.comments} color="#ec4899" delay={0.2} />
                <StatCard icon="✅" label="Lượt đăng ký" value={t.registrations} color="#14b8a6" delay={0.25} />
                <StatCard icon="👁️" label="Lượt xem" value={t.views} color="#a855f7" delay={0.3} />
            </div>

            {/* Charts */}
            <div className="dashboard-charts">
                <div className="dash-card">
                    <h3>Sự kiện theo trạng thái</h3>
                    <DonutChart data={eventDonut} />
                </div>

                <div className="dash-card">
                    <h3>Bài viết theo danh mục</h3>
                    <BarChart data={stats.postsByCategory} />
                </div>
            </div>

            {/* Lists */}
            <div className="dashboard-lists">
                <div className="dash-card">
                    <h3>Top bài viết xem nhiều</h3>
                    <ul className="dash-list">
                        {stats.topPosts.map((p, i) => (
                            <li key={p.id}>
                                <span className="rank">{i + 1}</span>
                                <Link to={`/admin/posts/edit/${p.id}`} className="dash-list-title">
                                    {p.title}
                                </Link>
                                <span className="dash-list-meta">👁️ {p.views}</span>
                            </li>
                        ))}
                        {stats.topPosts.length === 0 && <li className="muted">Chưa có bài viết</li>}
                    </ul>
                </div>

                <div className="dash-card">
                    <h3>Người dùng mới</h3>
                    <ul className="dash-list">
                        {stats.recentUsers.map((u) => (
                            <li key={u.id}>
                                <span className="mini-avatar">
                                    {u.full_name?.charAt(0).toUpperCase()}
                                </span>
                                <span className="dash-list-title">{u.full_name}</span>
                                <span className="dash-list-meta">{u.email}</span>
                            </li>
                        ))}
                        {stats.recentUsers.length === 0 && <li className="muted">Chưa có user</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}