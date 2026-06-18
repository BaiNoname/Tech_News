import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import NotificationBar from "../components/NotificationBar";
import PageTransition from "../components/PageTransition";

export default function UserLayout() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const publicPaths = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/change-password",
        "/profile"
    ];

    if (
        user &&
        user.role === "admin" &&
        !publicPaths.includes(location.pathname)
    ) {
        return <Navigate to="/admin/posts" replace />;
    }

    return (
        <>
            <Header />
            <NotificationBar />
            <PageTransition>
                <Outlet />
            </PageTransition>
        </>
    );
}