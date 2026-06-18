import { API_URL } from "../config";

const API_BASE = API_URL + "/";

export default function Avatar({ user, effect = "none", size = 40 }) {
    const name = user?.full_name || "?";
    const initial = name.trim().charAt(0).toUpperCase();
    const avatar = user?.avatar;

    return (
        <span
            className={`avatar-wrap avatar-fx-${effect}`}
            style={{ width: size, height: size }}
        >
            <span className="avatar-inner">
                {avatar ? (
                    <img
                        src={`${API_BASE}${avatar}`}
                        alt={name}
                        className="avatar-img"
                    />
                ) : (
                    <span
                        className="avatar-initial"
                        style={{ fontSize: size * 0.42 }}
                    >
                        {initial}
                    </span>
                )}
            </span>
        </span>
    );
}