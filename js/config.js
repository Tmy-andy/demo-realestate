/*
 * Cấu hình toàn site — chỗ DUY NHẤT để đổi URL backend.
 *
 * - '' (chuỗi rỗng): gọi API cùng domain với trang (frontend & backend cùng host).
 *   → Dùng khi deploy lên Coolify / production (Express serve cả frontend lẫn API).
 * - 'https://api.domain.com': frontend & backend tách domain → điền URL backend.
 * - 'http://localhost:3000': local dev với Live Server (port 5500) + server riêng (port 3000).
 *
 * File này phải load TRƯỚC mọi file gọi API (data-source.js, admin.js, sales.js, i18n.js).
 */
window.APP_CONFIG = {
  API_BASE: '',   // '' = cùng domain (production). Đổi thành 'http://localhost:3000' khi dev local với Live Server.
};
