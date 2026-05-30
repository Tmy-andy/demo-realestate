# Tổng hợp màn hình & chức năng — Dự án BDS (Hai Van Bay)

Tài liệu liệt kê tất cả màn hình và chức năng hiện có trong project, chia theo 5 khu vực: Public, Sales, Owner, Auth, và Hệ thống dùng chung.

---

## A. Trang public — khách / lead xem ([../index.html](../index.html))

1. **Trang chủ / Hero VR360** — toàn cảnh dự án bằng panorama 360°; header (logo, đổi ngôn ngữ, đăng nhập); nút trợ lý AI nổi; tip kéo/zoom.
2. **Bảng điều hướng VR (nav-panel trái)** — danh sách scene/tiện ích theo accordion, ô tìm kiếm, tiêu đề + mô tả scene đang xem.
3. **Project Card (panel phải)** — trạng thái mở bán, tên dự án, vị trí, nội dung động (overview / chi tiết phân khu / chi tiết tiện ích).
4. **Masterplan tổng** — ảnh mặt bằng tổng, marker phân khu theo danh mục, tooltip thông tin, intro panel góc phải.
5. **Bộ lọc Masterplan (MPF)** — lọc theo nhóm tiêu chí (loại, trạng thái…), nút Reset / Áp dụng.
6. **Chi tiết phân khu + nền VR360** — vào sâu một phân khu, hiện điểm nổi bật, fact, sub-dock danh sách căn/tiện ích.
7. **Danh sách căn (modal mở bán)** — progress bar quỹ căn theo loại; lọc loại / nhóm tầng / trạng thái; bảng sort Mã / Tầng / DT / Giá / Giá/m²; form thu lead + state thành công (CTA Zalo).
8. **Chi tiết căn hộ** — mặt bằng căn (FPV zoom in/out/reset), ảnh, highlight, mốc bàn giao, chính sách, lịch sử giá, tài liệu pháp lý căn.
9. **Pháp lý & Uy tín** — thống kê CĐT, checklist hồ sơ pháp lý, testimonials cư dân.
10. **Vị trí & POI** — bản đồ iframe + filter (trường, bệnh viện, metro, TTTM, sân bay), danh sách điểm.
11. **Tiến độ xây dựng** — overview milestones + track timeline thực địa.
12. **Tài liệu (Resources)** — brochure, bảng giá, bộ nhận diện (grid).
13. **Thư viện ảnh + Lightbox** — gallery có folder; lightbox media (ảnh/video) prev/next + caption.
14. **AI Chat / Gemini Live** — chat trợ lý AI có voice mic (panorama đồng bộ).
15. **Help Tour** — overlay hướng dẫn dùng UI lần đầu.
16. **Mobile Stepper** — bước-tới-bước dành cho mobile (thay layout panel).

---

## B. Khu vực Sales ([../admin/sales.html](../admin/sales.html))

Sidebar chia 3 nhóm: **Công Việc / Dự Án / Cá Nhân**.

- **Dashboard** — tổng quan KPI cá nhân (lead, lịch hẹn, doanh số).
- **Leads & Booking** — danh sách lead được gán (round-robin), trạng thái pipeline, đặt cọc / giữ chỗ.
- **Lịch Hẹn** — appointments (site_visit / call), xác nhận, dời lịch.
- **Tình Trạng Căn Hộ** — bảng quỹ căn theo dự án; đổi trạng thái (available / holding / reserved / sold) ghi lịch sử.
- **Tour VR360** — preview VR cho khách.
- **Bí Kíp Tư Vấn (Saleskit)** — tài liệu & playbook bán hàng.
- **Cài Đặt Cá Nhân** — profile sale, public slug (link công khai), đổi mật khẩu.

---

## C. Khu vực Owner / Chủ đầu tư ([../admin/owner.html](../admin/owner.html))

Sidebar chia: **Quản Lý / Nội Dung VR / Hệ Thống**.

### Quản Lý
- **Tổng Quan** — KPI toàn dự án, leads, doanh số, performance theo sale.
- **Bất Động Sản** — quản lý tower / floor / properties / property_types; giá, mặt bằng, hình ảnh, tài liệu pháp lý.

### Nội Dung VR
- **Thư Viện Media (Gallery)** — folder + items, upload R2.
- **Tài Liệu (Resources)** — brochure, bảng giá theo category.
- **Tiến Độ XD (Timeline)** — `construction_milestones`.
- **Danh Sách VR (Nav Panel)** — cấu hình scene / hotspot / panorama.
- **Masterplan** — ảnh tổng, marker, danh mục, filter group/options.
- **Pháp Lý** — `legal_documents`, testimonials, statistics.
- **Vị Trí & POI** — `project_locations`, `nearby_places`, site_map.
- **Ngôn Ngữ & i18n** — `translation_keys` + `project_translations`.

### Hệ Thống
- **Giao Diện & Theme** — `project_themes`, `theme_presets`, `project_settings`.
- **Analytics** — `analytics_sessions` / events, `ai_conversations`.
- **Cài Đặt** — `project_settings`, `project_card_*`, `project_versions`.

---

## D. Đăng nhập / quản trị tài khoản ([../admin/index.html](../admin/index.html))

- Trang login (dev / owner / sales).
- Quản lý `users` / `roles` (developer / owner / sales), `user_role_bindings`, `project_memberships`, `sales_public_links`.
- `lead_assignment_counters` — round-robin gán lead cho sale.

---

## E. Hệ thống dùng chung (chạy ngầm)

- `audit_logs`, `auth_sessions`, analytics, `lead_consents` (GDPR).
- Notification dropdown ([../admin/js/notif-dropdown.js](../admin/js/notif-dropdown.js)).

---

## Tóm tắt nhanh cho form khảo sát

> Trang chủ / Hero VR360 · Masterplan tổng + marker phân khu · Chi tiết phân khu + nền VR360 · Danh sách căn (lọc loại / giá / trạng thái) · Chi tiết căn hộ (giá, mặt bằng, pháp lý) · Form thu lead · Dashboard Sales xem lead · Lịch hẹn & booking · Quản lý quỹ căn (owner) · Quản lý nội dung VR / Masterplan / Pháp lý / POI / i18n / Theme · Analytics · Auth & phân quyền (dev / owner / sales).
