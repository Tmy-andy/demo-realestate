# Đề Xuất Hoàn Thiện Dashboard Admin — Vinhomes Hai Van Bay

> Phân tích & đề xuất các hạng mục cần bổ sung / cải tiến cho admin dashboard để vận hành sales bất động sản (BĐS) chuẩn chỉnh, đồng bộ với trang VR người dùng (`index.html`) và cấu trúc `data/project.json`.

---

## 1. Tổng Kết Hiện Trạng

### 1.1 Trang VR người dùng (`index.html`)
Đầy đủ các overlay/section:
- **Top bar** + **project card** (giá từ, căn còn lại, countdown ưu đãi)
- **Nav panel** danh mục VR (Tổng quan / Tiện ích / Mặt bằng / View căn)
- **Site map 2D**, **Gallery + Lightbox**, **Help tour**, **Botchat AI**
- **Amenities detail** (nội khu / sky amenity / dịch vụ / hạ tầng)
- **Legal & Trust** (developer stats, documents, banks, testimonials)
- **Location** (lat/lng, map embed, nearby POI)
- **Loan calculator** + **Appointment modal**
- **Timeline / Tiến độ xây dựng**

Toàn bộ nội dung được nạp từ `data/project.json` (≈ 825 dòng).

### 1.2 Admin Dashboard hiện có

**Owner (`admin/js/admin.js`)**
| Module | Trạng thái |
|---|---|
| Overview (KPI, biểu đồ) | ✅ Đầy đủ, có Chart.js |
| Units (Căn hộ) | ✅ CRUD đầy đủ |
| Leads & Booking | ✅ CRUD + xuất CSV |
| Danh Sách VR (menu groups) | ✅ Drag & drop |
| i18n (5 ngôn ngữ) | ✅ Edit inline |
| Theme & Giao Diện | ✅ Preset + export CSS/JSON |
| Analytics | ✅ 4 tab (views, vr, conversion, leads) |
| Settings | ✅ project / social / api / users / backup |
| Gallery / SiteMap / Timeline | ⚠️ Chỉ **xem**, chưa edit |
| Scenes VR | ⚠️ Có form sửa cơ bản (palette, horizon), **chưa quản lý hotspots** |

**Sales (`admin/js/sales.js`)**
| Module | Trạng thái |
|---|---|
| Dashboard cá nhân | ✅ |
| Leads (add/edit/quick-status/appt) | ✅ |
| Lịch hẹn (today / week / all) | ✅ |
| Units (read-only) | ✅ |
| VR Tour (link xem) | ✅ |

### 1.3 Khoảng Trống Lớn (Gap Analysis)

Các trường dữ liệu **đã có trong `project.json`** và **đã render ở frontend** nhưng **chưa có UI quản lý** trong admin:

| Trường JSON | Frontend dùng | Admin |
|---|---|---|
| `legal.documents[]` | ✅ Legal overlay | ❌ |
| `legal.banks[]` | ✅ Loan calculator | ❌ |
| `legal.developerStats[]` | ✅ Legal overlay | ❌ |
| `legal.testimonials[]` | ✅ Legal overlay | ❌ |
| `location.nearby[]` | ✅ Location overlay | ❌ |
| `location.mapSrc` | ✅ Map embed | ❌ (chỉ ở social tab) |
| `amenitiesDetail.{noiKhu,skyAmenity,dichVu,haTang}` | ✅ | ❌ |
| `timeline[]` | ✅ Progress overlay | ⚠️ readonly |
| `siteMap.points[]` | ✅ Sitemap 2D | ⚠️ readonly |
| `gallery[]` | ✅ Gallery | ⚠️ readonly |
| `scenes[*].hotspots[]` | ✅ Hotspot 3D | ❌ |
| `project.amenities[]` (icon list trên card) | ✅ project-card | ❌ |
| `project.stats[]` | ✅ pc-stats | ✅ (có 4 ô) |

→ **Owner phải sửa file JSON tay** cho 8/13 module trên.

---

## 2. Đề Xuất Cải Tiến / Bổ Sung

Sắp xếp theo mức **ưu tiên** (P0 → P3) và **giá trị kinh doanh BĐS**.

### 🔴 P0 — Bắt buộc cho một sàn BĐS chuẩn chỉnh

#### 2.1 Pipeline / Kanban Leads (Sales)
Hiện tại Leads chỉ là bảng. BĐS cần **phễu trực quan** để sales kéo thả qua các giai đoạn.
- View **Kanban** 5 cột: `Mới → Đã gọi → Đang quan tâm → Đặt cọc → Đã chốt` (+ cột `Stopped`)
- Drag-drop card giữa các cột, tự log thời điểm chuyển trạng thái
- Card hiển thị: tên, SĐT, loại căn, ngân sách, **SLA timer** (giờ kể từ lần liên hệ cuối)
- Badge "**Quá hạn follow-up**" nếu > 24h chưa liên hệ với lead `new`/`called`

#### 2.2 Quản Lý Lịch Hẹn Toàn Sàn (Owner)
Owner hiện không có module Calendar — chỉ Sales mới có.
- Thêm trang **Calendar** ở Owner xem **toàn bộ lịch hẹn của mọi sales**
- View **Day / Week / Month**, lọc theo sales agent, theo loại lịch (xem nhà / ký HĐ / tư vấn vay)
- Thêm trường `apptType`, `apptLocation` (sàn / online / căn mẫu) vào lead

#### 2.3 Đặt Cọc / Booking Căn Hộ (Unit Holds)
Đang có status `holding` nhưng **không có quy trình giữ chỗ**.
- Thêm bảng **Hold/Booking** liên kết Unit ↔ Lead
- Trường: `holdAt`, `expireAt` (đếm ngược tự động giải phóng), `depositVnd`, `holdBy` (sales agent), `paymentMethod`
- Cảnh báo khi 2 sales giữ trùng căn (lock optimistic)
- Khi hết hạn hold → tự đổi `status: available` + toast notify sales

#### 2.4 Phân Quyền & Audit Log
Hiện tại auth chỉ qua `sessionStorage` (yếu).
- Thêm **role thứ 3: `manager`** (giữa owner và sales) — duyệt giá, duyệt chiết khấu
- **Audit log**: ai sửa căn nào, ai chuyển trạng thái lead nào, lúc nào
- Tab "Nhật ký hệ thống" hiển thị 100 hành động gần nhất, filter theo user/action
- Hiển thị toast cảnh báo khi 2 admin sửa cùng 1 căn cùng lúc

#### 2.5 Quản Lý Legal / Pháp Lý (Owner)
Tab **Settings → Pháp Lý** mới:
- CRUD `legal.documents[]` (giấy phép, QĐ giao đất, PCCC, bảo lãnh…)
- CRUD `legal.banks[]` (tên, lãi suất, kỳ hạn) — đồng bộ với loan calculator
- CRUD `legal.developerStats[]` (4 ô số liệu chủ đầu tư)
- CRUD `legal.testimonials[]` (testimonial khách hàng + ảnh)
- **Upload PDF** cho từng document (yêu cầu backend)

#### 2.6 Quản Lý Vị Trí & POI Lân Cận
Tab **Settings → Vị Trí**:
- Sửa `location.lat`, `location.lng`, `location.mapSrc`
- CRUD `location.nearby[]` với danh mục cố định: `school`, `hospital`, `metro`, `mall`, `airport`, `park`, `office`
- Optional: pick toạ độ trực tiếp trên map embed

---

### 🟠 P1 — Nâng cao hiệu quả vận hành

#### 2.7 Trình Sửa Hotspot VR
Hiện sửa scene chỉ có `palette` + `horizonY`. Hotspot là **trái tim của VR sales**.
- Panel chia 2 cột: trái là preview 360° (embed `index.html?scene=…&edit=1`), phải là list hotspot
- Mỗi hotspot: `position {yaw, pitch}`, `label`, `type` (info / link-scene / link-unit / video / image), `targetSceneId`
- Click trên ảnh 360° để **thêm** hotspot mới — gửi message từ iframe về admin
- Reorder, ẩn/hiện, copy giữa các scene

#### 2.8 Trình Sửa Site Map 2D
Bản đồ 2D đang chỉ xem.
- Upload ảnh nền mặt bằng
- **Click trên ảnh để thả điểm** → mở form (label, sceneId, icon, mô tả)
- Drag để di chuyển điểm, hiển thị toạ độ %
- Test "Preview như user" mở trong tab mới

#### 2.9 Quản Lý Gallery (Upload)
Hiện gallery chỉ xem.
- Upload ảnh (yêu cầu backend hoặc tích hợp Cloudinary / S3)
- Crop / aspect ratio chuẩn (16:9 cho hero, 4:3 cho lightbox)
- Sắp xếp drag-drop, gán nhóm (exterior / interior / amenity / view)
- **WebP auto-convert** + lazy-load tag

#### 2.10 Quản Lý Tiện Ích (amenitiesDetail + project.amenities)
Tab **Tiện Ích** riêng biệt:
- 4 nhóm `noiKhu / skyAmenity / dichVu / haTang` với icon picker
- Drag-drop reorder
- Đồng bộ với `project.amenities[]` ngắn (hiển thị trên project-card)

#### 2.11 Quản Lý Timeline (Tiến độ XD)
Hiện chỉ xem.
- CRUD `timeline[]`: phase, date, status (`done`/`active`/`upcoming`), desc
- **Upload ảnh tiến độ** đính kèm mỗi mốc (timelapse, drone shot)
- Auto chuyển `active → done` khi qua mốc thời gian

#### 2.12 Phân Bổ Lead Tự Động (Lead Routing)
- Cấu hình rule: round-robin / theo ngân sách / theo nguồn → gán sales nào
- Hot lead (budget > 12 tỷ) → ưu tiên Sales Manager
- "**Lead chưa được nhận**" pool, sales tự pick (FIFO)
- SMS/Zalo notify sales khi có lead mới

#### 2.13 Bảng Giá Động & Chính Sách Bán
- Tab **Pricing Policy**: bảng giá theo tầng × hướng × view (matrix)
- Quản lý **chiến dịch ưu đãi**: chiết khấu %, quà tặng, ưu đãi vay, áp dụng giai đoạn nào
- Liên kết với `project.promoDeadline` (countdown ở frontend)
- Lịch sử thay đổi giá (audit) — quan trọng để khách không khiếu nại

---

### 🟡 P2 — Tăng trải nghiệm & ra quyết định

#### 2.14 KPI & Commission Sales
- Dashboard Owner thêm tab **Hiệu Suất Sales**:
  - Số lead / sales / tuần
  - Tỷ lệ chuyển đổi `interested → closed` từng người
  - Doanh số (giá trị HĐ) / sales / tháng
  - Bảng xếp hạng (leaderboard)
- Cấu hình **commission rule** (% theo loại căn, có bonus chốt nhanh)

#### 2.15 Quản Lý Botchat AI & Help Tour
Frontend đã có Botchat & Help Tour overlay nhưng **không edit nội dung** được.
- Tab **Nội Dung AI**:
  - System prompt cho Botchat (kèm context dự án)
  - FAQ pairs (Q ↔ A) để fallback
  - Bước Help Tour (selector, label, mô tả) — drag-drop
  - Test trực tiếp trong iframe

#### 2.16 Form Đặt Lịch Tùy Biến
- Cấu hình các trường form đặt lịch ở frontend (drag-drop builder)
- Conditional logic: nếu chọn "Đầu tư" thì hiện thêm trường "Số căn quan tâm"
- Tích hợp captcha / OTP SMS để chống spam

#### 2.17 Đa Ngôn Ngữ Nâng Cao
i18n hiện có 5 ngôn ngữ key cố định.
- **Auto-translate** dùng API (Claude / Google Translate)
- Cảnh báo key thiếu bản dịch khi save
- Import/export `.po` hoặc Excel để dịch hàng loạt
- Hỗ trợ RTL nếu thêm tiếng Ả Rập

#### 2.18 Notifications Center
Hiện chỉ có dot trên chuông.
- Drawer khi click vào chuông: list 20 notification gần nhất
- Loại: lead mới / appt sắp tới (1h) / hold sắp hết hạn / căn vừa được bán
- Mark read / unread, filter

#### 2.19 Mobile-Responsive Admin
Hiện admin chỉ tốt trên desktop.
- Sales hay dùng điện thoại khi đi gặp khách → cần mobile UI
- Hamburger sidebar, tap-friendly table → card view, bottom action bar

---

### 🟢 P3 — Hoàn thiện & mở rộng

#### 2.20 Bảo Mật Đăng Nhập
- Hash password (bcrypt) — hiện đang **plaintext** trong `admin/index.html`
- 2FA optional cho role owner
- Session timeout (auto-logout sau 30 phút idle)
- Rate-limit login (3 lần sai → khoá 5 phút)
- **Tách user data ra backend**, không hard-code trong HTML

#### 2.21 Tích Hợp CRM Bên Ngoài
- Webhook ra HubSpot / Salesforce / Bitrix24 khi có lead mới
- Sync 2 chiều (lead status trên admin ↔ CRM)
- Tab API Settings đã có form rỗng → cần implement

#### 2.22 Email / SMS Marketing
- Mẫu email gửi giới thiệu dự án, gửi báo giá, follow-up sau xem nhà
- Tích hợp Zalo OA gửi mass message
- Track open rate / click rate

#### 2.23 Backup / Restore Tự Động
- Cron backup `project.json` mỗi 6h vào storage (Drive / S3)
- Versioning: rollback về bản 7 ngày trước
- Diff viewer khi import (so sánh trước/sau)

#### 2.24 SEO & Open Graph
- Tab cài đặt meta title / description / OG image cho trang VR
- Schema.org `RealEstateListing` cho từng căn (giúp Google index)

#### 2.25 Smart Embed & Share
- Generate **link rút gọn** cho từng căn / scene VR để sales share Zalo
- QR code in tờ rơi → mở thẳng vào VR căn cụ thể
- Tracking UTM tự động (`?utm_source=zalo&utm_campaign=salesA`)

---

## 3. Đề Xuất Cải Tiến UX/Code Hiện Có

### 3.1 Code quality
- `admin.js` đang **1568 dòng monolith** → tách module (units.js, leads.js, theme.js, settings.js…)
- Duplicate `ICO`, `showPanel`, `closePanel`, `toast`, `confirmDel` giữa `admin.js` và `sales.js` → tách `admin/js/common.js`
- Thay `onclick="…"` inline bằng event delegation để CSP-safe
- Không **persist** state khi reload — mọi thay đổi mất hết vì không gọi API/`localStorage`
  - Tạm thời nên `localStorage.setItem('ah_data', ...)` sau mỗi mutation cho demo

### 3.2 UX nhỏ
- Owner sidebar thiếu **Calendar** & **Scenes** (đã có `renderScenes` trong code nhưng không có nav-item)
- Topbar thiếu **global search** (Cmd-K) để tìm nhanh lead / căn / scene
- Confirm modal hiện cùng văn bản cho mọi action — đã có title/sub nhưng nhiều chỗ chưa truyền
- Tab "Backup" có nút "Reset về mặc định" rất nguy hiểm → cần double-confirm gõ tên project
- Theme preview hiện không apply lên admin shell — nên có preview "iframe trang VR thật" inline

### 3.3 Tính nhất quán dữ liệu
- Sales `UNIT_STATUS_LABEL` dùng `booked` còn Owner dùng `holding` → cần thống nhất schema
- Lead source list hard-code 2 chỗ (`admin.js`, `sales.js`) → đưa về `data/project.json` `meta.leadSources`
- `GROUP_META` (5 nhóm VR) lặp ở cả 2 file → chung 1 nguồn

### 3.4 Bổ sung field trong `project.json`
```jsonc
{
  "project": {
    // bổ sung:
    "videos": [],          // YouTube tour link
    "brochureUrl": "",     // PDF brochure
    "salesOffice": {       // địa chỉ sàn giao dịch
      "address": "", "hours": "8:00 - 20:00",
      "lat": 0, "lng": 0
    },
    "socialLinks": { "facebook": "", "zaloOA": "", "youtube": "", "tiktok": "" }
  },
  "campaigns": [           // ưu đãi theo giai đoạn
    {
      "id": "promo-q2-2026",
      "name": "Ưu đãi mở bán GĐ 2",
      "discount": 8,
      "rentBack": 7,
      "from": "2026-05-01", "to": "2026-07-31",
      "active": true
    }
  ],
  "audit": []              // [{ user, action, target, timestamp, diff }]
}
```

---

## 4. Lộ Trình Triển Khai Đề Xuất

| Sprint | Hạng mục | Thời gian ước tính |
|---|---|---|
| **Sprint 1** (P0) | Kanban leads, Calendar Owner, Unit Hold, Audit Log cơ bản | 1.5 tuần |
| **Sprint 2** (P0) | Legal/Banks/Testimonial CRUD, Location/POI CRUD | 1 tuần |
| **Sprint 3** (P1) | Hotspot editor, Site Map editor, Gallery upload | 2 tuần (cần backend) |
| **Sprint 4** (P1) | Lead routing, Pricing matrix, Promo campaigns | 1.5 tuần |
| **Sprint 5** (P2) | KPI/Commission, Botchat content, Notifications | 1.5 tuần |
| **Sprint 6** (P2/P3) | Mobile responsive admin, Security hardening | 1 tuần |
| **Sprint 7** (P3) | CRM integration, Email/SMS, Backup auto | 2 tuần |

**Yêu cầu hạ tầng song song:**
- Backend API (Node/Express + SQLite/Postgres) thay sessionStorage + JSON file
- Object storage (S3 / Cloudinary) cho ảnh/PDF
- Webhook gateway cho CRM/Zalo OA

---

## 5. Tóm Tắt 1-Câu

> Admin hiện đã **tốt cho demo** nhưng còn **thiếu các module thiết yếu của một sàn BĐS thực tế**: Kanban pipeline, quản lý hold/booking căn, pháp lý, vị trí/POI, hotspot VR editor, lead routing, campaign ưu đãi, audit log và lớp bảo mật/đa quyền — đây là nhóm P0/P1 cần ưu tiên triển khai để đưa hệ thống lên production.
