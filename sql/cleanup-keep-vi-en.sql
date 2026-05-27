-- ============================================================
-- DỌN i18n: chỉ giữ Tiếng Việt (vi) và Tiếng Anh (en).
-- Xoá toàn bộ bản dịch ja/ko/zh và disable 3 ngôn ngữ đó.
--
-- Chạy trên phpMyAdmin: chọn database 'haivanbay' → tab SQL → dán → Go.
-- Idempotent: chạy nhiều lần vẫn an toàn.
-- ============================================================

SET NAMES utf8mb4;

START TRANSACTION;

-- 1) Xoá toàn bộ project_translations của các ngôn ngữ ngoài vi/en
DELETE pt FROM project_translations pt
  JOIN languages l ON l.id = pt.language_id
 WHERE l.code NOT IN ('vi', 'en');

-- 2) Disable các ngôn ngữ ja/ko/zh (giữ row để không vỡ FK ở chỗ khác).
--    Frontend đọc qua API /api/i18n chỉ trả ngôn ngữ is_active=1.
UPDATE languages
   SET is_active = 0
 WHERE code IN ('ja', 'ko', 'zh');

-- 3) Đảm bảo vi/en đang active và vi là default
UPDATE languages SET is_active = 1, is_default = 1 WHERE code = 'vi';
UPDATE languages SET is_active = 1, is_default = 0 WHERE code = 'en';

COMMIT;

-- ── Kiểm tra ────────────────────────────────────────────────
SELECT code, name, is_default, is_active FROM languages ORDER BY is_default DESC, code;

SELECT l.code, COUNT(*) AS translations
  FROM project_translations pt
  JOIN languages l ON l.id = pt.language_id
 WHERE pt.project_id = (SELECT id FROM projects WHERE code='haivanbay')
 GROUP BY l.code;
