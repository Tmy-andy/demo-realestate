# Aurora Heights VR360 — Admin Dashboard Specification

**Version:** 1.0  
**Date:** 2026-05-14  
**Scope:** Trang quản trị nội bộ cho Aurora Heights VR360 Experience  

---

## Table of Contents

1. [Tổng Quan Dashboard](#1-tổng-quan-dashboard)
2. [Layout & Navigation](#2-layout--navigation)
3. [Module: Overview (Tổng Quan)](#3-module-overview-tổng-quan)
4. [Module: Quản Lý Căn Hộ](#4-module-quản-lý-căn-hộ)
5. [Module: Leads & Booking](#5-module-leads--booking)
6. [Module: Quản Lý Nội Dung VR](#6-module-quản-lý-nội-dung-vr)
7. [Module: Hotspot Editor](#7-module-hotspot-editor)
8. [Module: Giao Diện & Theme](#8-module-giao-diện--theme)
9. [Module: Ngôn Ngữ & i18n](#9-module-ngôn-ngữ--i18n)
10. [Module: Analytics](#10-module-analytics)
11. [Module: Cài Đặt Hệ Thống](#11-module-cài-đặt-hệ-thống)
12. [Trường Dữ Liệu Chi Tiết](#12-trường-dữ-liệu-chi-tiết)
13. [Phân Quyền Người Dùng](#13-phân-quyền-người-dùng)
14. [API Contracts](#14-api-contracts)
15. [Trạng Thái & Thông Báo](#15-trạng-thái--thông-báo)

---

## 1. Tổng Quan Dashboard

Dashboard quản trị cho phép nhóm bán hàng, marketing và kỹ thuật:

- Theo dõi lượt truy cập và tương tác VR theo thời gian thực
- Quản lý toàn bộ inventory căn hộ (trạng thái, giá)
- Xem, xử lý và xuất danh sách leads đặt lịch
- Chỉnh sửa nội dung VR360 (scenes, hotspots, texts)
- **Tùy chỉnh màu sắc chủ đạo (theme)** của trang VR không cần code
- Quản lý bản dịch đa ngôn ngữ
- Xem báo cáo chuyển đổi

### 1.1 Người Dùng Mục Tiêu

| Role | Chức năng chính |
|------|----------------|
| Admin | Toàn quyền |
| Sales Manager | Leads, booking, inventory |
| Content Editor | Texts, translations, gallery |
| Developer | Theme, VR scenes, hotspots |

### 1.2 Nguyên Tắc Thiết Kế

- **Dark mode** — đồng nhất với giao diện VR trang chính
- **Real-time** — dữ liệu cập nhật không cần refresh
- **Inline edit** — chỉnh sửa trực tiếp trên bảng, không cần form riêng
- **Preview đồng bộ** — mọi thay đổi theme/content đều có preview trực tiếp

---

## 2. Layout & Navigation

### 2.1 Layout Tổng Thể

```
┌──────────────────────────────────────────────────────────────┐
│  Top Bar: [Logo] [Project Name]     [Notif] [User] [Logout] │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                    │
│ Sidebar  │  Main Content Area                                │
│ (240px)  │                                                    │
│          │  ┌─ Page Header ──────────────────────────────┐  │
│ [nav     │  │  Breadcrumb + Title + Action buttons       │  │
│ items]   │  └────────────────────────────────────────────┘  │
│          │                                                    │
│          │  ┌─ Content Body ─────────────────────────────┐  │
│          │  │  (changes per module)                      │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                    │
└──────────┴───────────────────────────────────────────────────┘
```

### 2.2 Sidebar Navigation Items

| Icon | Label | Route | Quyền |
|------|-------|-------|-------|
| 📊 | Tổng Quan | `/dashboard` | All |
| 🏠 | Căn Hộ | `/units` | Admin, Sales |
| 📋 | Leads & Booking | `/leads` | Admin, Sales |
| 🎬 | Scenes VR | `/scenes` | Admin, Dev |
| 📍 | Hotspots | `/hotspots` | Admin, Dev |
| 🖼 | Gallery | `/gallery` | Admin, Content |
| 🌐 | Ngôn Ngữ | `/i18n` | Admin, Content |
| 🎨 | Giao Diện & Theme | `/theme` | Admin, Dev |
| 📈 | Analytics | `/analytics` | Admin, Sales |
| ⚙️ | Cài Đặt | `/settings` | Admin |

### 2.3 Top Bar

| Element | Detail |
|---------|--------|
| Logo | Aurora Heights brand mark |
| Project selector | Dropdown (nếu multi-project) |
| Notification bell | Badge với số chưa đọc |
| User avatar | Tên + role badge |
| Logout | Xác nhận trước khi logout |

---

## 3. Module: Overview (Tổng Quan)

**Route:** `/dashboard`  
**Quyền:** Tất cả roles

### 3.1 KPI Cards (hàng trên cùng)

4 thẻ ngang, mỗi thẻ hiển thị:

| Card | Metric | Trend |
|------|--------|-------|
| Lượt xem hôm nay | Số session | ▲/▼ so hôm qua |
| Leads mới | Số leads 24h | ▲/▼ so 7 ngày trước |
| Căn còn lại | Số unit available | Thay đổi hôm nay |
| Tỷ lệ chuyển đổi | View → Lead % | So tháng trước |

Mỗi KPI card gồm:
- Số lớn (primary metric)
- Label tên chỉ số
- Trend badge (màu xanh = tăng, đỏ = giảm)
- Mini sparkline chart (7 ngày gần nhất)

### 3.2 Charts (hàng giữa)

**Chart 1 — Lượt Xem Theo Giờ (line chart)**
- Trục X: 24 giờ hôm nay (0h–23h)
- Trục Y: Số session
- Highlight giờ hiện tại

**Chart 2 — Scene Phổ Biến Nhất (bar chart ngang)**
- 6 bars — mỗi bar = một VR scene
- Sort theo lượt xem
- Màu bar theo palette của scene

### 3.3 Activity Feed (cột phải)

Real-time stream các sự kiện:
- 🔵 Lead mới: "Nguyễn Văn A vừa đặt lịch xem căn 3PN"
- 🟡 Booking: "Căn B-3BR-105-20 được đặt giữ chỗ"
- 🟢 Session: "X người đang xem VR ngay lúc này"

Mỗi item: icon + message + timestamp (relative: "2 phút trước")

### 3.4 Quick Actions

Row các nút nhanh:
- `+ Thêm Căn Hộ` → modal nhanh
- `Xuất Leads CSV` → download ngay
- `Xem Trang VR` → mở tab mới
- `Làm Mới Dữ Liệu` → force refresh

---

## 4. Module: Quản Lý Căn Hộ

**Route:** `/units`  
**Quyền:** Admin, Sales Manager

### 4.1 Bộ Lọc & Tìm Kiếm (toolbar trên bảng)

| Filter | Type | Options |
|--------|------|---------|
| Tìm kiếm | Text input | Tìm theo mã, loại, tầng |
| Loại căn | Multi-select | 2PN, 3PN, 3PN+, Penthouse |
| Nhóm tầng | Select | Tất cả, Thấp (8–15), Trung (16–30), Cao (31–42) |
| Trạng thái | Multi-select | Còn hàng, Đang giữ, Đã bán |
| Hướng | Select | Tất cả, Đông Nam, Tây Bắc, ... |
| Giá | Range slider | 4.9 – 14.2 tỷ |

### 4.2 Bảng Danh Sách Căn Hộ

**Columns:**

| Column | Type | Sortable | Editable |
|--------|------|---------|---------|
| Mã căn | string | ✓ | ✗ |
| Loại | badge | ✓ | ✓ (select) |
| Tầng | number | ✓ | ✓ |
| Diện tích (m²) | number | ✓ | ✓ |
| Hướng | string | ✓ | ✓ (select) |
| Giá/m² | currency | ✓ | ✓ |
| Giá tổng | currency | ✓ | ✓ |
| SL còn | number | ✗ | ✓ |
| SL tổng | number | ✗ | ✓ |
| Trạng thái | status badge | ✓ | ✓ (dropdown) |
| Thao tác | actions | ✗ | ✗ |

**Inline Edit:** Click vào ô → edit trực tiếp → Enter/blur để lưu. Ô đang sửa highlight vàng.

**Actions per row:**
- `✏️ Sửa` — mở form chi tiết
- `📋 Xem Leads` — filter leads panel theo căn này
- `🔁 Đổi Trạng Thái` — quick action dropdown
- `🗑 Xoá` — xác nhận trước khi xoá

### 4.3 Form Chi Tiết Căn Hộ (Slide-in Panel)

Mở từ nút "Sửa" hoặc "Thêm căn":

**Thông Tin Cơ Bản:**

| Trường | Type | Validation | Ghi Chú |
|--------|------|-----------|---------|
| Mã căn | text | required, unique | Format: X-YY-ZZZ-FF |
| Loại căn | select | required | 2PN / 3PN / 3PN+ / Penthouse |
| Tháp | select | required | A, B, C, D, E, F |
| Tầng | number | required, 1–42 | |
| Diện tích (m²) | number | required, > 0 | Chỉ số dương |
| Hướng ban công | select | required | Đông / Tây / Nam / Bắc / ĐN / TN / ĐB / TB |
| Số phòng ngủ | number | 1–6 | Auto từ loại |
| Số phòng vệ sinh | number | 1–5 | |

**Thông Tin Giá:**

| Trường | Type | Validation | Ghi Chú |
|--------|------|-----------|---------|
| Giá tổng (tỷ VND) | decimal | required, > 0 | 2 chữ số thập phân |
| Giá/m² (triệu VND) | decimal | auto-calc | = Giá tổng / Diện tích × 1000 |
| Số lượng trong đợt | number | ≥ 0 | |
| Số lượng còn lại | number | 0 ≤ x ≤ số lượng | |
| Ưu đãi hiện tại | textarea | max 200 ký tự | Hiển thị trên trang |

**Trạng Thái:**

| Trường | Type | Options |
|--------|------|---------|
| Trạng thái bán | select | Còn hàng / Đang giữ chỗ / Đã bán hết |
| Ngày cập nhật | date (auto) | System-set |
| Ghi chú nội bộ | textarea | Không hiển thị trên trang |

### 4.4 Thống Kê Tóm Tắt (bên dưới bảng)

| Stat | Value |
|------|-------|
| Tổng số căn | 9 loại / 1,840 căn |
| Còn hàng | X căn |
| Đang giữ | Y căn |
| Đã bán | Z căn |
| Tỷ lệ bán | Z / 1840 × 100% |
| Giá trung bình | avg tỷ |

---

## 5. Module: Leads & Booking

**Route:** `/leads`  
**Quyền:** Admin, Sales Manager

### 5.1 Bộ Lọc Leads

| Filter | Type | Options |
|--------|------|---------|
| Tìm kiếm | Text | Tên, SĐT, email |
| Trạng thái | Select | Mới, Đã gọi, Đang quan tâm, Đã chốt, Không tiếp tục |
| Căn quan tâm | Select | Dropdown all loại căn |
| Ngân sách | Select | Theo range tỷ VND |
| Nguồn | Select | VR Web, Zalo, Call, Giới thiệu |
| Ngày | Date range | Từ–Đến |
| Mục đích | Select | Ở thực / Đầu tư / Cho thuê |

### 5.2 Bảng Leads

| Column | Type | Sortable |
|--------|------|---------|
| # | number | — |
| Họ tên | string | ✓ |
| Số điện thoại | tel | — |
| Email | email | — |
| Zalo | string | — |
| Căn quan tâm | string | ✓ |
| Ngân sách | string | ✓ |
| Mục đích | string | ✓ |
| Thời điểm mua | string | — |
| Nguồn | badge | ✓ |
| Trạng thái | badge | ✓ |
| Ngày tạo | datetime | ✓ |
| Người phụ trách | string | ✓ |
| Thao tác | actions | — |

**Màu badge trạng thái:**

| Trạng thái | Màu |
|-----------|-----|
| Mới | Blue |
| Đã gọi | Yellow |
| Đang quan tâm | Orange |
| Đã chốt | Green |
| Không tiếp tục | Gray |

**Actions per row:**
- `📞 Gọi` — mở tel: link
- `💬 Zalo` — mở Zalo link
- `✏️ Cập nhật` — mở slide panel
- `📋 Ghi Chú` — inline note
- `🗑 Xoá` — xác nhận

### 5.3 Form Chi Tiết Lead (Slide-in Panel)

**Thông Tin Liên Hệ:**

| Trường | Type | Required |
|--------|------|---------|
| Họ và tên | text | Yes |
| Số điện thoại | tel | Yes |
| Email | email | No |
| Zalo | text | No |
| Nguồn lead | select | Yes |

**Căn Hộ Quan Tâm:**

| Trường | Type | Options |
|--------|------|---------|
| Loại căn | select | 2PN / 3PN / 3PN+ / Penthouse |
| Mã căn cụ thể | select | All unit codes |
| Ngân sách | select | < 5 tỷ / 5–8 tỷ / 8–12 tỷ / > 12 tỷ |
| Mục đích | select | Ở thực / Đầu tư / Cho thuê |
| Thời điểm mua | select | Trong 1 tháng / 3 tháng / 6 tháng / Hơn 6 tháng |

**Quản Lý CRM:**

| Trường | Type | Options |
|--------|------|---------|
| Trạng thái | select | Mới / Đã gọi / Đang quan tâm / Đã chốt / Không tiếp tục |
| Người phụ trách | select | Danh sách nhân viên |
| Ngày hẹn xem nhà | datetime | — |
| Ghi chú CRM | textarea | max 1000 ký tự |
| Lịch sử tương tác | timeline | Auto-append |

**Consent (từ form gốc):**

| Trường | Type |
|--------|------|
| Đồng ý Zalo | boolean |
| Đồng ý SMS | boolean |
| Đồng ý ĐKBH | boolean |

### 5.4 Export

- `Xuất CSV` — tất cả fields, UTF-8 BOM
- `Xuất Excel` — với định dạng cột + màu badge
- `Gửi Email tóm tắt` — scheduled daily/weekly report

---

## 6. Module: Quản Lý Nội Dung VR

**Route:** `/scenes`  
**Quyền:** Admin, Developer

### 6.1 Danh Sách Scenes

Grid 6 cards, mỗi card:

```
┌─────────────────────────────┐
│  [Thumbnail 280×140]        │
│  Sky Lounge Tầng 42         │
│  interior · 3 hotspots      │
│  [Sửa] [Xem Preview] [...]  │
└─────────────────────────────┘
```

Drag-to-reorder: thay đổi thứ tự hiển thị trong nav menu.

### 6.2 Form Chỉnh Sửa Scene (Full Panel)

**Thông Tin Cơ Bản:**

| Trường | Type | Required | Ghi Chú |
|--------|------|---------|---------|
| ID scene | text | Yes | Slug, không dấu, không space |
| Tiêu đề | text | Yes | Hiển thị trong nav và overlay |
| Tiêu đề phụ | text | No | Subtitle dưới title |
| Loại | select | Yes | interior / exterior |
| Menu group | select | Yes | tongQuan / tienIchNoiKhu / ... |

**Panorama Image:**

| Trường | Type | Validation |
|--------|------|-----------|
| Upload ảnh 360° | file upload | JPEG/PNG, khuyến nghị 4096×2048 |
| URL ảnh ngoài | text URL | Thay thế cho upload |
| Procedural palette | Color picker ×4 | 4 màu cho sky gradient |
| Horizon Y | slider 0–1 | 0 = top, 1 = bottom |

**Procedural Preview (real-time):**  
Canvas nhỏ 400×200 preview gradient sky bằng 4 màu đã chọn.

**Camera Defaults:**

| Trường | Type | Range |
|--------|------|-------|
| Yaw mặc định (°) | number | 0–360 |
| Pitch mặc định (°) | number | -90–90 |
| FOV mặc định (°) | number | 40–95 |
| Auto-rotate | toggle | on/off |

---

## 7. Module: Hotspot Editor

**Route:** `/hotspots`  
**Quyền:** Admin, Developer

### 7.1 Scene Selector

Dropdown chọn scene → load hotspot list của scene đó.

### 7.2 Visual Hotspot Editor

```
┌────────────────────────────────────────────────────┐
│  [Scene Preview — mini panorama 800×400]           │
│                                                    │
│    ● Hotspot A (info)       ● Hotspot B (nav)      │
│         (draggable)              (draggable)       │
│                                                    │
│  [+ Thêm Hotspot]                                  │
└────────────────────────────────────────────────────┘
```

Hotspots được render trên mini panorama. Có thể:
- **Drag** để thay đổi vị trí (cập nhật x/y equirectangular)
- **Click** để mở edit panel của hotspot đó
- **Delete** (×) để xoá

### 7.3 Form Hotspot

**Thông Tin Chung:**

| Trường | Type | Required |
|--------|------|---------|
| ID hotspot | text | Yes (auto-gen) |
| Nhãn (label) | text | Yes |
| Loại | select | Yes |
| Vị trí X | number 0–1 | Yes (auto từ drag) |
| Vị trí Y | number 0–1 | Yes (auto từ drag) |

**Nếu loại = `info`:**

| Trường | Type | Required |
|--------|------|---------|
| Tiêu đề popup | text | Yes |
| Mô tả popup | textarea | Yes |
| Màu icon | color picker | No |

**Nếu loại = `nav`:**

| Trường | Type | Required |
|--------|------|---------|
| Scene đích | select | Yes (all scenes) |
| Label điều hướng | text | No |

---

## 8. Module: Giao Diện & Theme

**Route:** `/theme`  
**Quyền:** Admin, Developer

> Đây là module chỉnh màu sắc chủ đạo của toàn bộ trang VR mà không cần chỉnh sửa CSS.

### 8.1 Layout Module Theme

```
┌────────────────────────────────────────────────────────────────┐
│  Giao Diện & Theme                          [Lưu] [Reset]     │
├────────────────────────────────────────────────┬───────────────┤
│  PANEL CHỈNH SỬA                              │  LIVE PREVIEW │
│                                               │               │
│  ┌─ Màu Chủ Đạo ───────────────────────────┐  │  [iframe VR   │
│  │  Background       [■ #0a0d12]            │  │   trang chính │
│  │  Primary Text     [■ #f5f1e8]            │  │   thu nhỏ]   │
│  │  Accent / Gold    [■ #e8c089]            │  │               │
│  │  Success / OK     [■ #7ad79a]            │  │  Auto-update  │
│  │  Error / Danger   [■ #ff6b6b]            │  │  khi chỉnh   │
│  │  Panel Glass      [■ rgba...]            │  │  màu          │
│  │  Border / Hairline[■ rgba...]            │  │               │
│  └──────────────────────────────────────────┘  │               │
│                                               │               │
│  ┌─ Typography ────────────────────────────┐  │               │
│  │  Display Font     [select dropdown]      │  │               │
│  │  Body Font        [select dropdown]      │  │               │
│  └──────────────────────────────────────────┘  │               │
│                                               │               │
│  ┌─ Theme Presets ─────────────────────────┐  │               │
│  │  [● Hiện tại] [○ Midnight Blue]          │  │               │
│  │  [○ Forest Dark] [○ Rose Gold]           │  │               │
│  │  [○ Ocean Deep] [+ Tạo Preset Mới]       │  │               │
│  └──────────────────────────────────────────┘  │               │
│                                               │               │
│  ┌─ Hiệu Ứng & Animation ──────────────────┐  │               │
│  │  Tốc độ transition   [●── 0.25s]         │  │               │
│  │  Blur backdrop      [toggle ON]          │  │               │
│  │  Pulse hotspot      [toggle ON]          │  │               │
│  │  Vignette VR        [toggle ON]          │  │               │
│  └──────────────────────────────────────────┘  │               │
└────────────────────────────────────────────────┴───────────────┘
```

### 8.2 Bảng Màu CSS — Toàn Bộ Biến Có Thể Chỉnh

| CSS Variable | Tên Thân Thiện | Type | Mô Tả |
|-------------|----------------|------|-------|
| `--bg` | Màu nền trang | Color | Background toàn trang |
| `--fg` | Màu chữ chính | Color | Primary text color |
| `--accent` | Màu accent | Color | Nút CTA, highlights, số tiền |
| `--ok` | Màu thành công | Color | Badge "Còn hàng", success states |
| `--danger` | Màu nguy hiểm | Color | Badge "Đã bán", lỗi form |
| `--warning` | Màu cảnh báo | Color | Badge "Đang giữ" |
| `--panel` | Màu panel | Color (rgba) | Background các panel kính |
| `--hairline` | Màu viền mảnh | Color (rgba) | Đường kẻ chia section |
| `--panel-hover` | Panel khi hover | Color (rgba) | Hover state panels |
| `--btn-bg` | Nền nút chính | Color | Background CTA buttons |
| `--btn-fg` | Chữ nút chính | Color | Text trong CTA buttons |
| `--btn-hover` | Nền nút khi hover | Color | |
| `--input-bg` | Nền ô nhập | Color | Input, select backgrounds |
| `--input-border` | Viền ô nhập | Color | |
| `--input-focus` | Viền focus | Color | |
| `--overlay-bg` | Nền overlay | Color (rgba) | Backdrop các overlay |
| `--top-bar-bg` | Nền top bar | Color (rgba) | |
| `--nav-panel-bg` | Nền nav panel | Color (rgba) | |
| `--card-bg` | Nền project card | Color (rgba) | |
| `--hotspot-color` | Màu hotspot | Color | Pin và label hotspot |
| `--hotspot-glow` | Glow hotspot | Color (rgba) | Pulse animation |
| `--countdown-color` | Màu đồng hồ | Color | Countdown timer digits |
| `--toast-bg` | Nền toast | Color (rgba) | Urgency toast background |
| `--loader-accent` | Màu loader | Color | Loading animation |
| `--r` | Bo tròn nhỏ | px | Radius các element nhỏ |
| `--r2` | Bo tròn lớn | px | Radius panels, overlays |
| `--t` | Tốc độ transition | string | Transition duration + easing |

### 8.3 Typography Settings

| Trường | Type | Options |
|--------|------|---------|
| Font Display (Heading) | Select | Cormorant Garamond, Playfair Display, Libre Baskerville, Merriweather, EB Garamond |
| Font Sans (Body) | Select | Inter, Roboto, Source Sans Pro, Lato, Nunito |
| Font Mono (Data) | Select | JetBrains Mono, Fira Code, Cascadia Code, Source Code Pro |
| Font size cơ sở | Slider px | 12–18px |
| Line height | Slider | 1.4–2.0 |

### 8.4 Theme Presets

Mỗi preset lưu toàn bộ CSS variables + typography:

| Preset | Màu accent | Nền | Mood |
|--------|-----------|-----|------|
| Aurora (default) | `#e8c089` Gold | `#0a0d12` Dark navy | Luxury |
| Midnight Blue | `#4a9eff` Blue | `#060b14` Deep navy | Corporate |
| Forest Dark | `#7ad79a` Green | `#0a130c` Dark green | Nature |
| Rose Gold | `#f4b8c1` Rose | `#120a0d` Dark rose | Elegant |
| Ocean Deep | `#5eeaff` Cyan | `#020f18` Ocean black | Modern |

**Thao tác Preset:**

| Action | Description |
|--------|-------------|
| Chọn Preset | Áp dụng tất cả variables của preset → preview update |
| Lưu Preset Mới | Đặt tên → save current state |
| Xoá Preset | Chỉ xoá custom presets, không xoá built-in |
| Export Preset | Download JSON file |
| Import Preset | Upload JSON file |

### 8.5 Animation & Effects

| Setting | Type | Default |
|---------|------|---------|
| Tốc độ transition toàn trang | Slider 0.1–1.0s | 0.25s |
| Backdrop blur panels | Toggle | ON |
| Pulse animation hotspot | Toggle | ON |
| Vignette overlay VR | Toggle | ON |
| Auto-rotate VR mặc định | Toggle | OFF |
| Urgency toast | Toggle | ON |
| Countdown timer | Toggle | ON |

### 8.6 Custom CSS

Textarea cho phép Admin/Dev nhập CSS tùy chỉnh:
- Syntax highlighting (CodeMirror hoặc tương tự)
- Áp dụng sau tất cả stylesheets
- Validate cú pháp trước khi save
- Version history (lưu 10 phiên bản gần nhất)

### 8.7 Export Theme

| Format | Content |
|--------|---------|
| CSS Variables | File `.css` với `:root { ... }` |
| JSON Config | Toàn bộ settings dạng JSON |
| Inline Snippet | Code embed vào `index.html` |

---

## 9. Module: Ngôn Ngữ & i18n

**Route:** `/i18n`  
**Quyền:** Admin, Content Editor

### 9.1 Language Selector

Tab bar: VI | EN | ZH | KO | JA

### 9.2 Translation Table

| Column | Description |
|--------|-------------|
| Key | Dot-notation key (e.g. `ui.bookNow`) |
| Namespace | ui / modal / tour / ai / ... |
| VI (base) | Vietnamese (non-editable, reference) |
| [Selected Lang] | Editable translation field |
| Status | ✓ Translated / ⚠ Missing / ⚡ Auto-translated |

**Inline edit:** Click ô translation → input trực tiếp → blur để save.

**Batch actions:**
- `Auto-translate tất cả` — gọi API dịch (Google Translate / DeepL)
- `Export JSON` — download file i18n
- `Import JSON` — upload file dịch từ người dịch thuật
- `Tìm Missing` — filter chỉ hiện keys chưa dịch

### 9.3 Namespaces

| Namespace | Số Keys |
|-----------|---------|
| `ui` | 50+ |
| `modal` | 20+ |
| `sitemap` | 5 |
| `gallery` | 5 |
| `amenities` | 10 |
| `legal` | 10 |
| `location` | 10 |
| `loan` | 15 |
| `timeline` | 5 |
| `ai` | 15 |
| `tour` | 35+ |

---

## 10. Module: Analytics

**Route:** `/analytics`  
**Quyền:** Admin, Sales Manager

### 10.1 Bộ Lọc Thời Gian

| Preset | Range |
|--------|-------|
| Hôm nay | 0h–now |
| 7 ngày qua | Last 7 days |
| 30 ngày qua | Last 30 days |
| Tháng này | MTD |
| Tuỳ chỉnh | Date range picker |

### 10.2 Tab: Lượt Xem

| Chart | Type | Data |
|-------|------|------|
| Lượt xem theo ngày | Line chart | Sessions / day |
| Thiết bị | Donut | Desktop / Mobile / Tablet |
| Ngôn ngữ | Bar | VI / EN / ZH / KO / JA |
| Thời gian phiên | Histogram | 0–30s, 30s–2m, 2m–5m, 5m+ |

### 10.3 Tab: VR Engagement

| Metric | Chart Type |
|--------|-----------|
| Scene nào được xem nhiều nhất | Horizontal bar |
| Thời gian trung bình mỗi scene | Bar |
| Hotspot nào được click nhiều nhất | Bubble chart |
| Số scene trung bình mỗi phiên | Gauge |
| Tỷ lệ dùng voice AI | Donut |

### 10.4 Tab: Chuyển Đổi

| Funnel Stage | Metric |
|-------------|--------|
| Lượt xem trang | 100% |
| Mở Bảng Giá | X% |
| Mở Form Đặt Lịch | Y% |
| Điền Form | Z% |
| Submit thành công | W% |

**Funnel chart** theo từng loại căn hộ.

### 10.5 Tab: Leads

| Chart | Type |
|-------|------|
| Leads theo ngày | Bar chart |
| Leads theo nguồn | Donut (Web/Zalo/Call) |
| Leads theo loại căn | Bar |
| Tỷ lệ chuyển đổi theo ngân sách | Bar |
| Leads chưa xử lý | Counter + list |

---

## 11. Module: Cài Đặt Hệ Thống

**Route:** `/settings`  
**Quyền:** Admin only

### 11.1 Thông Tin Dự Án

| Trường | Type | Required |
|--------|------|---------|
| Tên dự án | text | Yes |
| Địa chỉ | text | Yes |
| Chủ đầu tư | text | Yes |
| Trạng thái bán | text | Yes |
| Ngày bàn giao | text | Yes |
| Giá từ (hiển thị) | text | Yes |
| Tổng số căn | number | Yes |
| Số tháp | number | Yes |
| Số tầng | number | Yes |
| Số điện thoại hotline | tel | Yes |
| Số Zalo | text | Yes |
| Ngày hết hạn khuyến mãi | datetime | Yes |

### 11.2 Cài Đặt Mạng Xã Hội & Liên Kết

| Trường | Type |
|--------|------|
| Zalo OA link | URL |
| Facebook Fanpage | URL |
| Google Maps embed URL | URL |
| YouTube project tour | URL |

### 11.3 Tích Hợp API

| Trường | Type | Mô Tả |
|--------|------|-------|
| CRM webhook URL | text | POST leads khi submit form |
| CRM API key | password | |
| AI chatbot API key | password | Claude / OpenAI key |
| Google Analytics ID | text | GA4 Measurement ID |
| Google Maps API key | password | |

### 11.4 Quản Lý Người Dùng Dashboard

**Bảng users:**

| Column | Type |
|--------|------|
| Tên | text |
| Email | email |
| Role | select: Admin / Sales Manager / Content Editor / Developer |
| Trạng thái | Active / Inactive |
| Lần đăng nhập cuối | datetime |
| Thao tác | Edit / Deactivate / Reset password |

**Form thêm/sửa user:**

| Trường | Type | Required |
|--------|------|---------|
| Họ và tên | text | Yes |
| Email | email | Yes |
| Mật khẩu | password | Yes (tạo mới) |
| Role | select | Yes |
| Phân công dự án | multi-select | Yes |

### 11.5 Backup & Restore

| Action | Description |
|--------|-------------|
| Export toàn bộ data | Download `project.json` hiện tại |
| Import data | Upload `project.json` mới |
| Lịch sử thay đổi | Danh sách 20 phiên bản gần nhất + restore |
| Reset về mặc định | Xác nhận 2 lần, restore factory data |

---

## 12. Trường Dữ Liệu Chi Tiết

### 12.1 Tất Cả Trường Căn Hộ (Unit)

| Trường | Key JSON | Type | Bắt buộc | Validate |
|--------|---------|------|---------|---------|
| Mã căn | `code` | string | Yes | Regex: `[A-Z]-[23]BR[P]?-\d{2,3}-\d{2}` |
| Loại | `type` | string | Yes | Enum: 2PN, 3PN, 3PN+, Penthouse |
| Tầng | `floor` | number | Yes | 1–42 |
| Diện tích | `area` | number | Yes | > 0 |
| Hướng | `direction` | string | Yes | — |
| Giá (tỷ) | `priceVal` | number | Yes | > 0 |
| Giá (hiển thị) | `price` | string | Yes | — |
| Giá/m² | `pricePerM2` | string | Yes | — |
| SL còn | `available` | number | Yes | 0 ≤ x ≤ total |
| SL tổng | `total` | number | Yes | > 0 |
| Trạng thái | `status` | string | Yes | Enum: available, holding, sold |

### 12.2 Tất Cả Trường Lead

| Trường | Key | Type | Bắt buộc | Validate |
|--------|-----|------|---------|---------|
| Họ tên | `name` | string | Yes | min 2 ký tự |
| SĐT | `phone` | string | Yes | 10 số, bắt đầu 0 |
| Email | `email` | string | No | RFC 5322 |
| Zalo | `zalo` | string | No | — |
| Căn quan tâm | `unitType` | string | No | — |
| Ngân sách | `budget` | string | No | — |
| Mục đích | `purpose` | string | No | — |
| Thời điểm | `timing` | string | No | — |
| Đồng ý Zalo | `consentZalo` | boolean | No | — |
| Đồng ý SMS | `consentSms` | boolean | No | — |
| Đồng ý ĐKBH | `consentReg` | boolean | No | — |
| Nguồn | `source` | string | Yes | Auto: "vr-web" |
| Ngày tạo | `createdAt` | ISO datetime | Yes | Auto |
| Trạng thái CRM | `crmStatus` | string | Auto | Mặc định: "new" |
| Người phụ trách | `assignee` | string | No | — |
| Ghi chú | `notes` | string | No | max 1000 |

### 12.3 Tất Cả Trường Theme

Xem đầy đủ ở [§8.2 Bảng Màu CSS](#82-bảng-màu-css--toàn-bộ-biến-có-thể-chỉnh) — 25 CSS variables + 5 typography fields + 7 animation toggles.

---

## 13. Phân Quyền Người Dùng

### 13.1 Ma Trận Quyền

| Module | Admin | Sales Manager | Content Editor | Developer |
|--------|-------|-------------|---------------|-----------|
| Overview | ✓ Đọc | ✓ Đọc | ✗ | ✗ |
| Căn hộ — xem | ✓ | ✓ | ✗ | ✓ Đọc |
| Căn hộ — sửa | ✓ | ✓ | ✗ | ✗ |
| Leads — xem | ✓ | ✓ | ✗ | ✗ |
| Leads — sửa/xoá | ✓ | ✓ | ✗ | ✗ |
| Leads — export | ✓ | ✓ | ✗ | ✗ |
| Scenes — xem | ✓ | ✗ | ✓ | ✓ |
| Scenes — sửa | ✓ | ✗ | ✓ | ✓ |
| Hotspots | ✓ | ✗ | ✗ | ✓ |
| Gallery | ✓ | ✗ | ✓ | ✓ |
| i18n — xem | ✓ | ✗ | ✓ | ✓ |
| i18n — sửa | ✓ | ✗ | ✓ | ✓ |
| Theme — xem | ✓ | ✗ | ✗ | ✓ |
| Theme — sửa màu | ✓ | ✗ | ✗ | ✓ |
| Theme — Custom CSS | ✓ | ✗ | ✗ | ✓ |
| Analytics | ✓ | ✓ | ✗ | ✓ Đọc |
| Cài đặt hệ thống | ✓ | ✗ | ✗ | ✗ |
| Quản lý users | ✓ | ✗ | ✗ | ✗ |

---

## 14. API Contracts

### 14.1 Endpoints (Dự Kiến)

| Method | Endpoint | Body | Response |
|--------|---------|------|---------|
| `GET` | `/api/units` | — | `Unit[]` |
| `PUT` | `/api/units/:code` | `Partial<Unit>` | `Unit` |
| `POST` | `/api/units` | `Unit` | `Unit` |
| `DELETE` | `/api/units/:code` | — | `{ ok }` |
| `GET` | `/api/leads` | ?filter | `Lead[]` |
| `POST` | `/api/leads` | `Lead` | `Lead` |
| `PUT` | `/api/leads/:id` | `Partial<Lead>` | `Lead` |
| `DELETE` | `/api/leads/:id` | — | `{ ok }` |
| `GET` | `/api/theme` | — | `ThemeConfig` |
| `PUT` | `/api/theme` | `ThemeConfig` | `ThemeConfig` |
| `GET` | `/api/scenes` | — | `Scene[]` |
| `PUT` | `/api/scenes/:id` | `Partial<Scene>` | `Scene` |
| `GET` | `/api/i18n/:lang` | — | `TranslationMap` |
| `PUT` | `/api/i18n/:lang` | `TranslationMap` | `TranslationMap` |
| `GET` | `/api/analytics` | ?from&to | `Analytics` |
| `GET` | `/api/settings` | — | `Settings` |
| `PUT` | `/api/settings` | `Partial<Settings>` | `Settings` |

### 14.2 ThemeConfig Object

```json
{
  "colors": {
    "bg": "#0a0d12",
    "fg": "#f5f1e8",
    "accent": "#e8c089",
    "ok": "#7ad79a",
    "danger": "#ff6b6b",
    "warning": "#f5a623",
    "panel": "rgba(12,16,22,0.62)",
    "hairline": "rgba(245,241,232,0.14)",
    "panelHover": "...",
    "btnBg": "...",
    "btnFg": "...",
    "btnHover": "...",
    "inputBg": "...",
    "inputBorder": "...",
    "inputFocus": "...",
    "overlayBg": "...",
    "topBarBg": "...",
    "navPanelBg": "...",
    "cardBg": "...",
    "hotspotColor": "...",
    "hotspotGlow": "...",
    "countdownColor": "...",
    "toastBg": "...",
    "loaderAccent": "..."
  },
  "typography": {
    "fontDisplay": "Cormorant Garamond",
    "fontSans": "Inter",
    "fontMono": "JetBrains Mono",
    "baseFontSize": 14,
    "lineHeight": 1.7
  },
  "effects": {
    "transitionDuration": "0.25s",
    "backdropBlur": true,
    "hotspotPulse": true,
    "vignetteVR": true,
    "autoRotate": false,
    "urgencyToast": true,
    "countdown": true
  },
  "radius": {
    "sm": 8,
    "lg": 16
  },
  "customCss": "",
  "presetName": "Aurora",
  "updatedAt": "2026-05-14T10:00:00Z"
}
```

---

## 15. Trạng Thái & Thông Báo

### 15.1 Toast Notifications (Dashboard)

| Loại | Khi nào | Màu |
|------|---------|-----|
| Success | Save thành công | Green |
| Error | Save thất bại | Red |
| Warning | Có trường chưa điền | Yellow |
| Info | Lead mới vào | Blue |

Mỗi toast: icon + message + auto-dismiss 4s + nút đóng thủ công.

### 15.2 Trạng Thái Lưu Theme

| State | Indicator |
|-------|-----------|
| Chưa lưu | Nút "Lưu" active, badge "Chưa lưu" |
| Đang lưu | Spinner trong nút |
| Đã lưu | Checkmark + "Đã lưu lúc HH:mm" |
| Lỗi | Nút đỏ + message lỗi |
| Preview only | Badge "Chỉ xem trước, chưa áp dụng" |

### 15.3 Xác Nhận Hành Động Nguy Hiểm

Các hành động yêu cầu confirm dialog:
- Xoá căn hộ
- Xoá lead
- Reset theme về mặc định
- Restore backup
- Xoá user
- Import data (ghi đè)

Confirm dialog hiển thị:
- Mô tả hành động sẽ xảy ra
- Danh sách dữ liệu bị ảnh hưởng (nếu có)
- Nút "Huỷ" (primary) và "Xác Nhận Xoá" (danger)
