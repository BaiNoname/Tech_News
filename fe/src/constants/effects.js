// 8 hiệu ứng avatar (key phải khớp với reward_effect bên backend)
export const EFFECTS = [
    { key: "none", name: "Không hiệu ứng", desc: "Avatar thường" },
    { key: "neon", name: "Neon", desc: "Viền neon xanh phát sáng" },
    { key: "gold", name: "Vàng kim", desc: "Vòng vàng lấp lánh" },
    { key: "fire", name: "Lửa", desc: "Viền lửa cam đỏ" },
    { key: "ice", name: "Băng giá", desc: "Viền băng xanh lạnh" },
    { key: "rainbow", name: "Cầu vồng", desc: "Vòng cầu vồng xoay" },
    { key: "galaxy", name: "Thiên hà", desc: "Vòng tím vũ trụ" },
    { key: "pulse", name: "Nhịp đập", desc: "Vòng nhấp nháy theo nhịp" }
];

export const getEffect = (key) =>
    EFFECTS.find((e) => e.key === key) || EFFECTS[0];