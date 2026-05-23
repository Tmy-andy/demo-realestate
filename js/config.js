/*
 * Cấu hình toàn site — chỗ DUY NHẤT để đổi URL backend.
 *
 * - '' (chuỗi rỗng): gọi API cùng domain với trang (frontend & backend cùng host).
 * - 'https://api.domain.com': frontend & backend tách domain → điền URL backend.
 *
 * File này phải load TRƯỚC mọi file gọi API (data-source.js, admin.js, sales.js, i18n.js).
 */
window.APP_CONFIG = {
  API_BASE: 'https://haivanbay-api.onrender.com',
};
