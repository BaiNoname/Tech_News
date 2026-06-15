import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function NotificationBar() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axiosClient.get("/notifications/latest");
            setNotifications(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (notifications.length === 0) {
        return null;
    }

    const iconFor = (type) => {
        if (type === "event_ended") return "🏁";
        return "🔔";
    };

    return (
        <div className="notification-bar">
            <div className="notification-track">
                {notifications.map((item) => (
                    <span key={item.id} className="notification-item">
                        {iconFor(item.type)} {item.message}
                    </span>
                ))}
            </div>
        </div>
    );
}