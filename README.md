# Aurora Heights VR360

> Trang bán hàng bất động sản tương tác VR360 + hệ thống quản trị nội bộ — dự án căn hộ cao cấp **Aurora Heights** (Khu Tây Hồ Tây, Hà Nội).

**Phiên bản:** v1.2 · **Cập nhật:** 16-05-2026 · **Trạng thái:** Production

---

## Tổng Quan

Dự án gồm **2 phần** chạy độc lập trên cùng một thư mục:

| Phần | Đường dẫn | Mục đích |
|---|---|---|
| **Front-end (FE) công khai** | `index.html` | Trang khách tham quan — VR360 + bảng giá + đặt cọc + AI chat |
| **Trang quản trị (Admin)** | `admin/` | CMS nội bộ cho Chủ Đầu Tư + workspace cho Sales |

Không có backend, không có CMS, không có database. Tất cả dữ liệu nằm trong **một file JSON tĩnh** (`data/project.json`) — admin chỉnh sửa trong `localStorage`, muốn publish thì export + upload lại file JSON.

---

## Tính Năng Chính

### Trang FE (khách tham quan)

- **VR360 viewer** — 6 cảnh panorama (Three.js WebGL): Sky Lounge, Penthouse, Master Suite, Bể bơi, Công viên, Toàn cảnh dự án
- **Hotspot** — pin tương tác trên cảnh VR: `info` (popup mô tả) hoặc `nav` (chuyển cảnh)
- **8 overlay** đầy đủ: Bản đồ 2D · Thư viện ảnh · Tiện ích (4 tab, 25 mục) · Pháp lý · Vị trí (Google Maps + 9 POI) · Tính vay vốn · Tiến độ XD · Mặt bằng & bảng giá
- **Form đặt cọc** với 9 trường, tự điền sẵn căn hộ khách chọn
- **Công cụ tính vay vốn** — slider giá/equity/term/bank, biểu đồ trả nợ, công thức niên kim
- **Trợ lý AI** — chat văn bản + nhận diện giọng nói (Web Speech API) + đọc thành tiếng (TTS), có chế độ "viên" (capsule)
- **i18n 5 ngôn ngữ** — VI · EN · ZH · KO · JA, dịch toàn bộ UI + chuỗi động
- **Help Tour 18 bước** — onboarding kiểu spotlight, hoạt động trên cả desktop và mobile
- **Responsive đầy đủ** — breakpoint ≤ 768px chuyển sang burger menu + drawer + stepper

### Trang Admin

**Hai vai trò** — gated bằng `sessionStorage` guard IIFE inline trên mỗi trang.

| Vai trò | Tài khoản demo | 14 module Owner / 5 module Sales |
|---|---|---|
| **Chủ Đầu Tư (Owner)** | `admin` / `aurora@2025` | Tổng Quan · Căn Hộ · Leads & Booking · Danh Sách VR · Thư Viện · Bản Đồ 2D · Tiện Ích · Tiến Độ · Pháp Lý · Vị Trí · i18n · Theme · Analytics · Cài Đặt |
| **Sales** | `sales` / `sales@2025` (hoặc `sales2`) | Dashboard · Leads & Booking · Lịch Hẹn · Tình Trạng Căn Hộ · Tour VR360 |

**Khả năng**: CRUD đầy đủ với slide-panel form, kéo-thả sắp xếp, upload ảnh (URL hoặc base64), color picker cho theme, xuất CSV leads, biểu đồ Chart.js, export/import/reset JSON backup.

---

## Công Nghệ

- **HTML5** + **CSS3** (CSS custom properties, grid, flex, animations)
- **Vanilla JavaScript** (ES2020+) — không framework
- **Three.js r128** (CDN) — WebGL renderer cho panorama
- **Chart.js 4.4.0** (CDN) — biểu đồ trong admin
- **Web Speech API** — nhận diện + tổng hợp giọng nói
- **Google Fonts** — Cormorant Garamond · Inter · JetBrains Mono · Segoe UI
- **localStorage / sessionStorage** — toàn bộ trạng thái admin

---

## Cấu Trúc Thư Mục

```
BDS/
├── index.html                    # FE single-page entry (1.351 dòng)
├── data/
│   └── project.json              # Toàn bộ nội dung & cấu hình FE (825 dòng)
│
├── js/                           # Runtime Front-end
│   ├── i18n.js                   # window.I18n        (1.025 dòng)
│   ├── vr360.js                  # window.VR360         (369 dòng)
│   ├── ai-panel.js               # window.AiPanel       (359 dòng)
│   ├── main.js                   # Điều phối UI chính (1.784 dòng)
│   └── mobile-stepper.js         # Carousel mặt bằng mobile (710 dòng)
│
├── css/
│   ├── style.css                 # Design system FE   (3.816 dòng)
│   └── mobile-stepper.css        # Style stepper        (700 dòng)
│
├── img/                          # AI avatars, Zalo icon, ảnh nền sitemap
│
├── admin/                        # Trang quản trị (NEW ở v1.2)
│   ├── index.html                # Đăng nhập
│   ├── owner.html                # Workspace Chủ Đầu Tư
│   ├── sales.html                # Workspace Sales
│   ├── css/admin.css             # Design system admin (642 dòng)
│   └── js/
│       ├── admin.js              # Owner core         (2.123 dòng)
│       ├── admin-content.js      # Owner content        (814 dòng)
│       └── sales.js              # Sales role           (963 dòng)
│
├── docs/                         # Tài liệu
│   ├── index.html                # Đặc tả dự án v1.2 (rendered)
│   ├── huong-dan-khach.html      # HDSD khách tham quan
│   ├── huong-dan-owner.html      # HDSD Chủ Đầu Tư
│   ├── huong-dan-sales.html      # HDSD nhân viên Sales
│   ├── DASHBOARD_SPEC.md
│   ├── ADMIN_IMPROVEMENT_PROPOSAL.md
│   └── features/
│       ├── BOTCHAT_SPEC.md
│       ├── HELPTOUR_SPEC.md
│       ├── VRINFO_MOBILE_SPEC.md
│       └── aurora-heights-vr360-proposal.md
│
├── note để hôm sau sửa.MD        # Ghi chú việc còn dở
└── README.md                     # File này
```

---

## Bắt Đầu Nhanh

Vì là **trang HTML tĩnh**, không cần build. Chỉ cần serve bằng web server bất kỳ.

### Phương án 1 — Mở thẳng

Bấm đôi vào `index.html`. **Cảnh báo:** một số trình duyệt (Chrome strict mode) chặn `fetch()` từ `file://` — khi đó JSON không tải được.

### Phương án 2 — Web server local (khuyến nghị)

```bash
# Python 3
python -m http.server 8080

# Node.js (cần npm i -g http-server)
http-server -p 8080

# PHP
php -S localhost:8080
```

Sau đó mở:
- **FE công khai:** http://localhost:8080/
- **Trang đăng nhập admin:** http://localhost:8080/admin/

### Tài Khoản Demo

| Vai trò | Username | Password |
|---|---|---|
| Chủ Đầu Tư | `admin` | `aurora@2025` |
| Sales 1 | `sales` | `sales@2025` |
| Sales 2 | `sales2` | `sales@2025` |

> Tài khoản hardcode trong mảng `USERS` ở `admin/index.html`. Khi triển khai thật, **bắt buộc đổi** và tốt hơn là chuyển sang backend.

---

## Mô Hình Dữ Liệu (`data/project.json`)

Root JSON có 10 key:

| Key | Kiểu | Mô Tả |
|---|---|---|
| `project` | object | Thông tin dự án + `amenities[]` + `stats[]` lồng bên trong |
| `menu` | object | 5 nhóm menu accordion (`tongQuan`, `tienIchNoiKhu`, `tienIchNgoaiKhu`, `matBangTang`, `view360Can`) |
| `scenes` | array | 6 cảnh VR360 (mỗi cảnh có `hotspots[]`) |
| `floorplan` | `{ units: [...] }` | 9 căn mẫu (2PN / 2PN+1 / 3PN / Duplex) |
| `siteMap` | `{ image, points: [...] }` | Bản đồ 2D + điểm bấm |
| `gallery` | array | 6 ảnh dự án |
| `legal` | object | `developerStats`, `documents`, `banks`, `testimonials` |
| `location` | object | `lat`, `lng`, `mapSrc`, `nearby[]` (9 POI) |
| `amenitiesDetail` | object | 4 tab tiện ích chi tiết |
| `timeline` | array | 8 giai đoạn thi công |

Chi tiết schema, kiểu trường, ràng buộc — xem [`docs/index.html`](docs/index.html) phần "Mô Hình Dữ Liệu".

---

## Quy Trình Công Bố Thay Đổi (Admin → FE)

**Quan trọng:** admin lưu trong `localStorage.ah_admin_data`, **không tự** đẩy lên FE. Quy trình thủ công:

1. Vào admin → **Cài Đặt** → **Export JSON** → tải file về máy
2. Đổi tên file thành `project.json`
3. Upload đè lên `data/project.json` trên server
4. Refresh FE — thay đổi hiển thị

Khi tích hợp backend trong tương lai, nút "Publish" sẽ tự động hoá bước 2–3 qua API.

---

## Tài Liệu

| File | Đối tượng |
|---|---|
| [`docs/index.html`](docs/index.html) | Đặc tả kỹ thuật v1.2 — cho dev / kiến trúc sư |
| [`docs/huong-dan-khach.html`](docs/huong-dan-khach.html) | HDSD chi tiết cho khách tham quan VR (21 mục) |
| [`docs/huong-dan-owner.html`](docs/huong-dan-owner.html) | HDSD cho Chủ Đầu Tư — 14 module admin (22 mục) |
| [`docs/huong-dan-sales.html`](docs/huong-dan-sales.html) | HDSD cho nhân viên Sales — workflow hằng ngày (15 mục) |
| [`docs/DASHBOARD_SPEC.md`](docs/DASHBOARD_SPEC.md) | Đặc tả gốc của trang admin (markdown) |
| [`docs/features/`](docs/features/) | Đặc tả từng tính năng: AI chat, Help Tour, behavior mobile |

---

## Giới Hạn Hiện Tại

- **Không có backend** — form trên FE không được lưu; admin không sync giữa các máy
- **Panorama mẫu** — ảnh được sinh procedural, cần thay bằng ảnh 360° thực tế của dự án
- **AI chat stub** — chưa kết nối Claude / OpenAI; trả lời theo template
- **STT trên Firefox / Safari** không ổn định — tự fallback về chế độ văn bản
- **Không có URL routing** — không deep-link được tới cảnh VR cụ thể
- **Không có analytics** — sẵn sàng để gắn GA4 / Mixpanel
- **`sessionStorage` cho ngôn ngữ** — mất khi đóng tab
- **`localStorage` cho admin** — giới hạn ~5 MB, gắn với từng trình duyệt

Chi tiết + đề xuất khắc phục: xem [`docs/index.html`](docs/index.html) phần "Giới Hạn Hiện Tại" và [`docs/ADMIN_IMPROVEMENT_PROPOSAL.md`](docs/ADMIN_IMPROVEMENT_PROPOSAL.md).

---

## Lộ Trình Phát Triển

Việc còn tồn đọng theo [`note để hôm sau sửa.MD`](note%20%C4%91%E1%BB%83%20h%C3%B4m%20sau%20s%E1%BB%ADa.MD):

1. **Sales · Lịch Hẹn** — cho phép đổi trạng thái booking ngay khi click lịch hẹn, không phải quay về trang Leads & Booking
2. **Owner · i18n** — mặc định chỉ hiển thị tiếng Việt; có nút **"Thêm ngôn ngữ mới"** để scaffold bảng dịch khi cần

Đề xuất trung hạn (xem `ADMIN_IMPROVEMENT_PROPOSAL.md`):

- Tích hợp backend + API publish
- Audit log thao tác admin
- Phân quyền sales theo người dùng (mỗi sales thấy lead riêng)
- Webhook gửi notification (Zalo / SMS) khi có lead mới
- CDN cho ảnh + lazy load
- URL hash routing cho cảnh VR (deep link)
- Đổi `sessionStorage` ngôn ngữ → `localStorage`

---

## Đóng Góp / Báo Lỗi

Dự án nội bộ — liên hệ trực tiếp với đội phát triển hoặc Chủ Đầu Tư.

**Hotline khách hàng:** `0901 234 567`

---

*Aurora Heights VR360 · README v1.0 · 16-05-2026*
