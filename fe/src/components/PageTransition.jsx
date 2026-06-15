import { useLocation } from "react-router-dom";

/**
 * Bọc nội dung trang. Mỗi khi đường dẫn đổi, key thay đổi khiến React
 * remount -> animation "page-enter" chạy lại => hiệu ứng chuyển trang.
 */
export default function PageTransition({ children }) {
    const location = useLocation();

    return (
        <div key={location.pathname} className="page-transition">
            {children}
        </div>
    );
}