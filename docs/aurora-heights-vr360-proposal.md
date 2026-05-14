# Aurora Heights VR360 — Đánh giá & Đề xuất chức năng

> Trang demo: https://demo-realestate-link.netlify.app/
> Loại ứng dụng: **Full-screen VR360 web app** — không scroll, toàn bộ tương tác qua panel / modal overlay đè lên khung 360°

---

## Kiến trúc UI hiện tại

```
┌─────────────────────────────────────────────────────┐
│  [Logo]   [Bản đồ 2D] [Thư viện] [Đặt lịch]  [VI] [?]  ← Floating top nav
│                                                     │
│                                                     │
│              KHUNG VR360 TOÀN MÀN HÌNH             │
│                                                     │
│  ┌──────────────────┐                               │
│  │ Tên dự án        │   ← Info sidebar trái         │
│  │ Giá từ X tỷ      │                               │
│  │ [Xem bảng giá]   │                               │
│  │ [Tải brochure]   │                               │
│  └──────────────────┘                               │
│                                                     │
│  [Tiện ích]                    [Chatbot] ←  Floating│
│                          Kéo để xoay · Cuộn để zoom │
└─────────────────────────────────────────────────────┘
```

**Cơ chế tương tác:** Người dùng bấm nút trên nav hoặc sidebar → mở panel/modal overlay → đóng lại để quay về VR360.

---

## Hiện trạng các panel đang có

| Panel / Chức năng | Trạng thái | Ghi chú |
|---|---|---|
| VR360 viewer | ✅ Hoạt động tốt | Core experience |
| Bản đồ 2D (mặt bằng) | ✅ Hoạt động tốt | Click điểm → vào VR360 tương ứng |
| Thư viện hình ảnh | ✅ Hoạt động tốt | Slideshow ảnh dự án |
| Chatbot | ✅ Đã có | Floating góc màn hình |
| Bảng giá | ⚠️ Có panel, bảng trống | Không có dữ liệu, không có filter |
| Form tư vấn | ⚠️ Có nhưng thiếu trường | Chỉ có tên / SĐT / loại căn / ghi chú |
| Tiện ích dự án | ❌ Chỉ có nút, không có panel nội dung | |
| Pháp lý / Trust | ❌ Không có | |
| Vị trí / Bản đồ thực tế | ❌ Không có (bản đồ 2D là mặt bằng thiết kế, không phải map) | |
| Máy tính vay | ❌ Không có | |
| Tiến độ xây dựng | ❌ Có nút "Tiến độ dự án" nhưng không dẫn đến đâu | |
| Hotline / Zalo nổi bật | ❌ Không có | |
| Urgency / Scarcity | ❌ Không có | |

---

## Đề xuất cải thiện theo từng thành phần

---

### 1. Info Sidebar (đang có — cần bổ sung)

**Hiện tại:** Tên dự án + Giá từ + 2 nút CTA.

**Bổ sung thêm vào sidebar:**
- Hotline dạng tap-to-call (icon + số)
- Nút Zalo (deep link)
- Badge trạng thái: "Đang mở bán" + số căn còn lại tổng
- Countdown ưu đãi nhỏ: `DD:HH:MM` — 1 dòng gọn

**Lưu ý:** Sidebar không được che khuất quá nhiều khung VR360, có thể thu gọn/mở rộng.

---

### 2. Panel Bảng giá (đang có — cần hoàn thiện)

**Vấn đề:** Có `<table>` nhưng không có dữ liệu, không có filter.

**Cần thêm — Filter bar:**

| Filter | Kiểu input | Giá trị |
|---|---|---|
| Loại căn | Tag select (multi) | Theo loại căn của dự án |
| Nhóm tầng | Dropdown | Thấp / Trung / Cao |
| Hướng | Dropdown | Các hướng của dự án |
| Trạng thái | Dropdown | Còn trống / Đang giữ / Đã bán |

**Cột bảng cần có:**

| Cột | Kiểu | Ghi chú |
|---|---|---|
| Mã căn | Text | Clickable — mở sub-panel chi tiết căn |
| Loại căn | Text | |
| Tầng | Number | Sortable |
| Diện tích | Number (m²) | Sortable |
| Hướng | Text | |
| Giá | Number (tỷ) | Font đậm — sortable |
| Giá/m² | Number | Tính tự động — màu phụ |
| Trạng thái | Badge màu | Xanh=còn / Vàng=đang giữ / Đỏ=đã bán |
| Hành động | Button | "Quan tâm" → tự điền vào form |

**Progress bar quỹ căn** — đặt đầu panel, trước filter:
- Mỗi loại căn: `[████████░░] X / Y căn còn lại`

**Hành vi:**
- Bấm "Quan tâm" → đóng panel bảng giá → mở panel form → mã căn tự điền dạng tag
- Hàng "Đã bán" → mờ, disabled

---

### 3. Panel Form tư vấn (đang có — cần mở rộng trường)

**Trường hiện tại:** Họ tên / SĐT / Loại căn (dropdown) / Ghi chú

**Bổ sung thêm:**

| Trường | Kiểu | Ghi chú |
|---|---|---|
| Email | `email input` | Không bắt buộc |
| Zalo (nếu khác SĐT) | `tel input` | Không bắt buộc |
| Ngân sách dự kiến | Single-select tag | Không bắt buộc |
| Mục đích mua | Single-select tag | Ở thực / Đầu tư / Cả hai |
| Thời gian muốn xem | Single-select tag | Cuối tuần / Tuần tới / Linh hoạt |
| Mã căn quan tâm | Tags tự điền | Từ bảng giá — có thể xóa thủ công |
| Đồng ý nhận thông tin | Checkbox | Zalo / SMS |

**Sau khi submit:**
- Không reset form trắng
- Hiển thị xác nhận ngay trong panel: icon check + thời gian phản hồi dự kiến
- 2 nút: Tải brochure / Mở Zalo

---

### 4. Panel Tiện ích (nút có, panel chưa có)

**Bố cục panel:** Tabs theo danh mục + grid ảnh

**Danh mục tabs:**
- Nội khu (hồ bơi, gym, sân chơi...)
- Tiện ích cao tầng (sky lounge, rooftop, BBQ...)
- Dịch vụ (sảnh, bảo vệ, camera...)
- Hạ tầng (bãi xe, thang máy...)

**Mỗi item trong grid:** Ảnh + tên tiện ích + mô tả ngắn 1–2 câu

---

### 5. Panel Pháp lý & Trust (chưa có — cần tạo mới)

**Trigger:** Thêm nút vào top nav hoặc sidebar — ví dụ icon shield hoặc text "Pháp lý"

**Nội dung panel:**

**Metric cards chủ đầu tư** (3–4 ô ngang):
- Năm kinh nghiệm
- Số căn đã bàn giao
- Số dự án / tỉnh thành
- Số cư dân

**Checklist pháp lý** (có thể expand từng item):
- Mỗi item: icon check + tên giấy tờ + số / ngày cấp
- Nút "Xem tài liệu đầy đủ" → mở PDF tab mới

**Logo ngân hàng bảo lãnh:**
- Hàng ngang trong panel
- Hover: thông tin lãi suất / điều kiện

**Testimonials:**
- Carousel nhỏ trong panel
- Mỗi card: tên viết tắt / nghề / loại căn mua / nội dung ngắn

---

### 6. Panel Vị trí (chưa có — cần tạo mới)

> Lưu ý: "Bản đồ 2D" hiện tại là mặt bằng thiết kế dự án, **không phải** bản đồ địa lý.

**Trigger:** Thêm nút "Vị trí" vào top nav

**Nội dung panel:**
- Google Map nhúng, đánh dấu pin vị trí dự án
- Filter danh mục tiện ích xung quanh: Trường / BV / Metro / TTTM / Sân bay
- Danh sách tiện ích lân cận bên cạnh map:

| Trường | Kiểu |
|---|---|
| Icon danh mục | SVG |
| Tên địa điểm | Text |
| Khoảng cách | km |
| Thời gian di chuyển | Phút (lái xe / đi bộ) |

- Click item trong danh sách → map pan tới điểm đó

---

### 7. Panel Máy tính vay (chưa có — cần tạo mới)

**Trigger:** Nút trong sidebar hoặc bên trong panel Bảng giá

**Input:**

| Trường | Kiểu | Ghi chú |
|---|---|---|
| Giá trị căn | Number (tỷ) | Tự điền nếu đã chọn căn |
| Vốn tự có | Slider (%) | 10%–70% |
| Thời hạn vay | Select | 10 / 15 / 20 / 25 / 30 năm |
| Ngân hàng | Select | Kèm lãi suất |

**Output (tính real-time khi kéo slider):**
- Số tiền vay
- Trả hàng tháng
- Tổng lãi

**CTA trong panel:** "Đăng ký tư vấn vay" → mở form

---

### 8. Panel Tiến độ (nút có, panel chưa có)

**Bố cục:** Timeline ngang hoặc dọc

**Mỗi mốc:**

| Trường | Kiểu |
|---|---|
| Thời gian | Tháng / Quý / Năm |
| Tên giai đoạn | Text |
| Trạng thái | Badge: Hoàn thành / Đang thực hiện / Sắp tới |
| Ảnh tiến độ thực tế | Image (tùy chọn) |

---

### 9. Urgency & Scarcity (chưa có)

Vì không scroll, không dùng được banner section truyền thống. Thay vào đó:

- **Trong sidebar:** Countdown 1 dòng `DD:HH:MM` + badge "Còn X căn"
- **Trong panel Bảng giá:** Progress bar quỹ căn theo loại
- **Toast notification** góc màn hình (tự ẩn sau 5 giây):
  - "X người đang xem dự án này"
  - "Vừa có khách đặt giữ [loại căn] — X phút trước"

---

## Cấu trúc nav đề xuất

**Top nav (floating, hiện tại có):**
```
[Logo] | [VR360*] [Bản đồ 2D] [Thư viện] [Tiện ích] [Vị trí*] [Pháp lý*] [Tiến độ*] | [VI] [?]
```
*Các nút cần thêm mới hoặc hoàn thiện panel

**Sidebar trái (hiện tại có — cần bổ sung):**
```
[Tên dự án]
[Badge trạng thái + số căn còn lại]
[Countdown ưu đãi]
[Giá từ X tỷ]
[Xem bảng giá & ưu đãi]  → mở panel Bảng giá
[Tính khoản vay*]         → mở panel Máy tính vay
[Hotline tap-to-call*]
[Zalo*]
[Tải brochure PDF]
```

**Floating (hiện tại có):**
```
[Chatbot] — góc phải dưới
[Toast social proof*] — góc trái dưới, xuất hiện luân phiên
```

---

## Ghi chú kỹ thuật

| Hạng mục | Yêu cầu |
|---|---|
| CRM | Mọi submit form (panel form, chatbot) ghi vào CRM với tag nguồn |
| VR360 trigger | Sau ≥ 30 giây trong VR360 → toast nhỏ gợi ý mở panel form / đặt lịch |
| Bảng giá → Form | Truyền `mã căn` qua state khi bấm "Quan tâm" — không reload page |
| Panel đóng/mở | Phím ESC hoặc click ngoài panel → đóng, quay về VR360 |
| Mobile | Các panel cần full-screen trên mobile, có nút X rõ ràng |
| Performance | Lazy load nội dung panel — không preload tất cả khi khởi động |

---

*Tài liệu đặc tả chức năng cho VR360 web app — nội dung điền vào khi triển khai thực tế*
