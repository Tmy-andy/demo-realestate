# Deploy demo-realestate lên Coolify

## Kiến trúc

Dự án chạy như **1 container duy nhất** (Node.js Express) phục vụ cả frontend
tĩnh lẫn API, kết nối tới **MySQL** (service riêng trong Coolify).

```
Coolify
├── Service: MySQL 8           ← database
└── Service: App (Node.js)     ← Express serve frontend + API  :3000
```

---

## Bước 1 — Tạo MySQL Database

1. Coolify → **New Resource** → **Database** → **MySQL**
2. Chọn version **MySQL 8.0**
3. Đặt tên vd `haivanbay-db`, tạo database `haivanbay`
4. Ghi lại **Internal Database URL** dạng:
   ```
   mysql://root:<password>@<service-host>:3306/haivanbay
   ```

### Import schema + dữ liệu ban đầu

Sau khi MySQL service running, import file `haivanbay_mysql.sql` (nằm ở thư
mục gốc repo) vào database:

```bash
# Từ máy local (thay <host> và <port> bằng địa chỉ expose của Coolify MySQL):
mysql -h <host> -P <port> -u root -p haivanbay < haivanbay_mysql.sql
```

Hoặc dùng **TablePlus / DBeaver** kết nối rồi chạy file SQL.

---

## Bước 2 — Tạo Application (Node.js)

1. Coolify → **New Resource** → **Application**
2. Source: **Git Repository** → trỏ tới repo này
3. **Root Directory**: `/` (gốc repo)
4. **Build Pack**: Coolify tự detect `Dockerfile` → chọn **Dockerfile**
5. **Port**: `3000`

---

## Bước 3 — Environment Variables

Vào tab **Environment Variables** và thêm:

| Biến | Giá trị | Bắt buộc |
|---|---|---|
| `DATABASE_URL` | `mysql://root:<pass>@<host>:3306/haivanbay` | ✅ |
| `PORT` | `3000` | ✅ |

> **Lưu ý:** Dùng **Internal Host** của MySQL service trong Coolify (không phải
> IP public) — các service trong cùng network Coolify nói chuyện được với nhau
> qua hostname nội bộ.

---

## Bước 4 — Domain & HTTPS

- **Domain**: vd `haivanbay.yourdomain.com`
- **Port**: `3000`
- **HTTPS**: bật (Coolify + Let's Encrypt tự động)

---

## Bước 5 — Seed dữ liệu (nếu cần)

Nếu `haivanbay_mysql.sql` chỉ có schema (không có data), chạy seed sau khi
container đã running:

```bash
# Vào tab "Terminal" của App trong Coolify, hoặc exec vào container:
cd /app/server
npm run seed            # seed dự án + căn hộ
npm run seed:accounts   # tạo tài khoản admin/sales mặc định
```

---

## Bước 6 — Kiểm tra sau deploy

| URL | Mô tả |
|---|---|
| `https://haivanbay.yourdomain.com/` | Trang VR frontend |
| `https://haivanbay.yourdomain.com/admin/` | Admin panel |
| `https://haivanbay.yourdomain.com/api/health` | Health check → `{"ok":true}` |
| `https://haivanbay.yourdomain.com/api/project` | Dữ liệu dự án (JSON) |

---

## Dev Local vs Production

| | Local (Live Server) | Local (Node server) | Production (Coolify) |
|---|---|---|---|
| `API_BASE` trong `js/config.js` | `'http://localhost:3000'` | `''` | `''` |

File đã được set sẵn `''` cho production. Khi dev local với Live Server
(port 5500), đổi tạm thành `'http://localhost:3000'`.

---

## Tài khoản demo mặc định (sau seed)

| Vai trò | Username | Password |
|---|---|---|
| Chủ Đầu Tư | `admin` | `aurora@2025` |
| Sales | `sales` | `sales@2025` |

> Đổi mật khẩu ngay sau khi deploy lên production qua trang Admin → Cài Đặt.
