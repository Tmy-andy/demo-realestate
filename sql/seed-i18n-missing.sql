-- ============================================================
-- Bổ sung 62 i18n key cho các vị trí FE còn hardcoded tiếng Việt
-- Áp dụng cho project 'haivanbay' (id=1). Idempotent: chạy nhiều lần OK.
--
-- Chạy:
--   docker exec -i haivanbay-mysql mysql -uroot -proot123 haivanbay < sql/seed-i18n-missing.sql
-- hoặc dán vào MySQL Workbench / Sequel Pro.
-- ============================================================

-- Ép charset utf8mb4 cho session — phòng khi client mở ở latin1 (làm mất dấu).
SET NAMES utf8mb4;

START TRANSACTION;

-- 1) UPSERT translation_keys (namespace_code='ui', default_text = bản 'vi')
INSERT INTO translation_keys (namespace_code, key_code, default_text) VALUES
  ('ui','ui.group.tongQuan',          'Tổng quan'),
  ('ui','ui.group.phanKhu',           'Phân khu'),
  ('ui','ui.group.tienIchNoiKhu',     'Tiện ích nội khu'),
  ('ui','ui.group.tienIchNgoaiKhu',   'Tiện ích ngoại khu'),
  ('ui','ui.group.matBangTang',       'Mặt bằng tầng'),
  ('ui','ui.group.view360',           'View 360 căn hộ'),
  ('ui','ui.pc.overviewFull',         'Tổng quan — hiển thị đầy đủ'),
  ('ui','ui.pc.filteringBy',          'Đang lọc theo'),
  ('ui','ui.pc.highlightInfo',        'Thông tin nổi bật'),
  ('ui','ui.pc.watchIntroVideo',      'Xem video giới thiệu'),
  ('ui','ui.pc.subdivision',          'Phân khu'),
  ('ui','ui.pc.overviewInfo',         'Thông tin tổng quan'),
  ('ui','ui.pc.highlightPoints',      'Điểm nhấn nổi bật'),
  ('ui','ui.pc.viewProductsInPk',     'Xem sản phẩm tại phân khu'),
  ('ui','ui.pc.exploreVrTour',        'Khám phá VR Tour phân khu'),
  ('ui','ui.pc.status.opening',       'Đang mở bán'),
  ('ui','ui.status.available',        'Còn trống'),
  ('ui','ui.status.holding',          'Đang giữ'),
  ('ui','ui.status.sold',             'Đã bán'),
  ('ui','ui.gallery.emptyVideo',      'Chưa có video nào trong thư viện.'),
  ('ui','ui.gallery.emptyPhoto',      'Chưa có ảnh nào trong thư viện.'),
  ('ui','ui.empty.content',           'Chưa có nội dung'),
  ('ui','ui.empty.location',          'Chưa có địa điểm'),
  ('ui','ui.empty.milestone',         'Chưa có mốc tiến độ'),
  ('ui','ui.timeline.done',           'Hoàn thành'),
  ('ui','ui.timeline.doing',          'Đang thực hiện'),
  ('ui','ui.timeline.upcoming',       'Sắp tới'),
  ('ui','ui.res.brochure',            'Brochure dự án'),
  ('ui','ui.res.brandKit',            'Bộ nhận diện thương hiệu'),
  ('ui','ui.res.priceList',           'Bảng giá & chính sách'),
  ('ui','ui.res.floorPlanPdf',        'TMB mã căn & diện tích'),
  ('ui','ui.props.empty',             'Không có sản phẩm phù hợp bộ lọc.'),
  ('ui','ui.props.filter.type',       'Loại hình'),
  ('ui','ui.props.filter.maxPrice',   'Mức giá tối đa'),
  ('ui','ui.props.detail.consultant', 'Nhân viên tư vấn'),
  ('ui','ui.props.detail.price',      'Giá bán dự kiến'),
  ('ui','ui.props.detail.status',     'Tình trạng'),
  ('ui','ui.props.detail.type',       'Loại hình'),
  ('ui','ui.props.detail.legal',      'Pháp lý'),
  ('ui','ui.props.detail.handover',   'Dự kiến bàn giao'),
  ('ui','ui.props.emptyFloorplan',    'Chưa có mặt bằng.'),
  ('ui','ui.mp.overviewEyebrow',      'Tổng quan dự án'),
  ('ui','ui.mp.filter',               'Lọc'),
  ('ui','ui.mp.exploreVrTour',        'Khám phá VR Tour →'),
  ('ui','ui.mp.group.subdivision',    'Phân khu'),
  ('ui','ui.mp.group.displayType',    'Loại hiển thị'),
  ('ui','ui.mp.group.property',       'Bất động sản'),
  ('ui','ui.mp.group.status',         'Trạng thái'),
  ('ui','ui.mp.selectAll',            'Chọn tất cả'),
  ('ui','ui.ai.title',                'Trợ lý Vinhomes Hai Van Bay'),
  ('ui','ui.ai.active',               'Đang hoạt động'),
  ('ui','ui.ai.listening',            'Đang lắng nghe…'),
  ('ui','ui.ai.thinking',             'Đang suy nghĩ…'),
  ('ui','ui.ai.speaking',             'Đang trả lời…'),
  ('ui','ui.ai.inputPh',              'Nhập câu hỏi…'),
  ('ui','ui.ai.close',                'Đóng'),
  ('ui','ui.ai.errBrowser',           'Trình duyệt không hỗ trợ tính năng này.'),
  ('ui','ui.ai.errMic',               'Bạn cần cho phép truy cập micro.'),
  ('ui','ui.ai.connecting',           'Đang kết nối…'),
  ('ui','ui.ai.disconnected',         'Mất kết nối…'),
  ('ui','ui.ai.alertTitle',           'Thông báo'),
  ('ui','ui.ai.alertOk',              'Đã hiểu')
ON DUPLICATE KEY UPDATE default_text = VALUES(default_text);

-- Tạo UNIQUE INDEX nếu chưa có (tương thích MySQL < 8.0.29 — không có IF NOT EXISTS).
-- Dùng information_schema để check trước khi ALTER.
DROP PROCEDURE IF EXISTS _add_unique_if_missing;
DELIMITER //
CREATE PROCEDURE _add_unique_if_missing(
  IN p_table  VARCHAR(128),
  IN p_index  VARCHAR(128),
  IN p_cols   VARCHAR(255)
)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.statistics
     WHERE table_schema = DATABASE()
       AND table_name   = p_table
       AND index_name   = p_index
  ) THEN
    SET @sql = CONCAT('ALTER TABLE `', p_table, '` ADD UNIQUE INDEX `', p_index, '` (', p_cols, ')');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END //
DELIMITER ;

CALL _add_unique_if_missing('translation_keys',     'uk_ns_key',        '`namespace_code`, `key_code`');
CALL _add_unique_if_missing('project_translations', 'uk_proj_lang_key', '`project_id`, `language_id`, `translation_key_id`');

DROP PROCEDURE IF EXISTS _add_unique_if_missing;

-- Helper: tạo bảng tạm gồm (key_code, lang_code, text)
DROP TEMPORARY TABLE IF EXISTS _tmp_i18n;
CREATE TEMPORARY TABLE _tmp_i18n (
  key_code   VARCHAR(255) NOT NULL,
  lang_code  VARCHAR(10)  NOT NULL,
  text_value VARCHAR(1000) NOT NULL,
  KEY (key_code), KEY (lang_code)
) ENGINE=Memory CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- VI (bản gốc)
INSERT INTO _tmp_i18n (key_code, lang_code, text_value) VALUES
  ('ui.group.tongQuan','vi','Tổng quan'),
  ('ui.group.phanKhu','vi','Phân khu'),
  ('ui.group.tienIchNoiKhu','vi','Tiện ích nội khu'),
  ('ui.group.tienIchNgoaiKhu','vi','Tiện ích ngoại khu'),
  ('ui.group.matBangTang','vi','Mặt bằng tầng'),
  ('group.view360','vi','View 360 căn hộ'),
  ('ui.pc.overviewFull','vi','Tổng quan — hiển thị đầy đủ'),
  ('ui.pc.filteringBy','vi','Đang lọc theo'),
  ('ui.pc.highlightInfo','vi','Thông tin nổi bật'),
  ('ui.pc.watchIntroVideo','vi','Xem video giới thiệu'),
  ('ui.pc.subdivision','vi','Phân khu'),
  ('ui.pc.overviewInfo','vi','Thông tin tổng quan'),
  ('ui.pc.highlightPoints','vi','Điểm nhấn nổi bật'),
  ('ui.pc.viewProductsInPk','vi','Xem sản phẩm tại phân khu'),
  ('ui.pc.exploreVrTour','vi','Khám phá VR Tour phân khu'),
  ('ui.pc.status.opening','vi','Đang mở bán'),
  ('ui.status.available','vi','Còn trống'),
  ('ui.status.holding','vi','Đang giữ'),
  ('ui.status.sold','vi','Đã bán'),
  ('ui.gallery.emptyVideo','vi','Chưa có video nào trong thư viện.'),
  ('ui.gallery.emptyPhoto','vi','Chưa có ảnh nào trong thư viện.'),
  ('ui.empty.content','vi','Chưa có nội dung'),
  ('ui.empty.location','vi','Chưa có địa điểm'),
  ('ui.empty.milestone','vi','Chưa có mốc tiến độ'),
  ('ui.timeline.done','vi','Hoàn thành'),
  ('ui.timeline.doing','vi','Đang thực hiện'),
  ('ui.timeline.upcoming','vi','Sắp tới'),
  ('ui.res.brochure','vi','Brochure dự án'),
  ('ui.res.brandKit','vi','Bộ nhận diện thương hiệu'),
  ('ui.res.priceList','vi','Bảng giá & chính sách'),
  ('ui.res.floorPlanPdf','vi','TMB mã căn & diện tích'),
  ('ui.props.empty','vi','Không có sản phẩm phù hợp bộ lọc.'),
  ('ui.props.filter.type','vi','Loại hình'),
  ('ui.props.filter.maxPrice','vi','Mức giá tối đa'),
  ('ui.props.detail.consultant','vi','Nhân viên tư vấn'),
  ('ui.props.detail.price','vi','Giá bán dự kiến'),
  ('ui.props.detail.status','vi','Tình trạng'),
  ('ui.props.detail.type','vi','Loại hình'),
  ('ui.props.detail.legal','vi','Pháp lý'),
  ('ui.props.detail.handover','vi','Dự kiến bàn giao'),
  ('ui.props.emptyFloorplan','vi','Chưa có mặt bằng.'),
  ('ui.mp.overviewEyebrow','vi','Tổng quan dự án'),
  ('ui.mp.filter','vi','Lọc'),
  ('ui.mp.exploreVrTour','vi','Khám phá VR Tour →'),
  ('ui.mp.group.subdivision','vi','Phân khu'),
  ('ui.mp.group.displayType','vi','Loại hiển thị'),
  ('ui.mp.group.property','vi','Bất động sản'),
  ('ui.mp.group.status','vi','Trạng thái'),
  ('ui.mp.selectAll','vi','Chọn tất cả'),
  ('ui.ai.title','vi','Trợ lý Vinhomes Hai Van Bay'),
  ('ui.ai.active','vi','Đang hoạt động'),
  ('ui.ai.listening','vi','Đang lắng nghe…'),
  ('ui.ai.thinking','vi','Đang suy nghĩ…'),
  ('ui.ai.speaking','vi','Đang trả lời…'),
  ('ui.ai.inputPh','vi','Nhập câu hỏi…'),
  ('ui.ai.close','vi','Đóng'),
  ('ui.ai.errBrowser','vi','Trình duyệt không hỗ trợ tính năng này.'),
  ('ui.ai.errMic','vi','Bạn cần cho phép truy cập micro.'),
  ('ui.ai.connecting','vi','Đang kết nối…'),
  ('ui.ai.disconnected','vi','Mất kết nối…'),
  ('ui.ai.alertTitle','vi','Thông báo'),
  ('ui.ai.alertOk','vi','Đã hiểu');

-- EN
INSERT INTO _tmp_i18n (key_code, lang_code, text_value) VALUES
  ('ui.group.tongQuan','en','Overview'),
  ('ui.group.phanKhu','en','Subdivisions'),
  ('ui.group.tienIchNoiKhu','en','Internal Amenities'),
  ('ui.group.tienIchNgoaiKhu','en','External Amenities'),
  ('ui.group.matBangTang','en','Floor Plans'),
  ('group.view360','en','Unit 360 View'),
  ('ui.pc.overviewFull','en','Overview — full view'),
  ('ui.pc.filteringBy','en','Filtering by'),
  ('ui.pc.highlightInfo','en','Key Highlights'),
  ('ui.pc.watchIntroVideo','en','Watch intro video'),
  ('ui.pc.subdivision','en','Subdivision'),
  ('ui.pc.overviewInfo','en','Overview'),
  ('ui.pc.highlightPoints','en','Highlights'),
  ('ui.pc.viewProductsInPk','en','View products in subdivision'),
  ('ui.pc.exploreVrTour','en','Explore VR Tour'),
  ('ui.pc.status.opening','en','On sale'),
  ('ui.status.available','en','Available'),
  ('ui.status.holding','en','On hold'),
  ('ui.status.sold','en','Sold'),
  ('ui.gallery.emptyVideo','en','No videos in the library yet.'),
  ('ui.gallery.emptyPhoto','en','No photos in the library yet.'),
  ('ui.empty.content','en','No content yet'),
  ('ui.empty.location','en','No locations yet'),
  ('ui.empty.milestone','en','No milestones yet'),
  ('ui.timeline.done','en','Completed'),
  ('ui.timeline.doing','en','In progress'),
  ('ui.timeline.upcoming','en','Upcoming'),
  ('ui.res.brochure','en','Project brochure'),
  ('ui.res.brandKit','en','Brand kit'),
  ('ui.res.priceList','en','Price list & policy'),
  ('ui.res.floorPlanPdf','en','Floor plan codes & area'),
  ('ui.props.empty','en','No products match the filter.'),
  ('ui.props.filter.type','en','Type'),
  ('ui.props.filter.maxPrice','en','Max price'),
  ('ui.props.detail.consultant','en','Consultant'),
  ('ui.props.detail.price','en','Estimated price'),
  ('ui.props.detail.status','en','Status'),
  ('ui.props.detail.type','en','Type'),
  ('ui.props.detail.legal','en','Legal'),
  ('ui.props.detail.handover','en','Expected handover'),
  ('ui.props.emptyFloorplan','en','No floor plans yet.'),
  ('ui.mp.overviewEyebrow','en','Project Overview'),
  ('ui.mp.filter','en','Filter'),
  ('ui.mp.exploreVrTour','en','Explore VR Tour →'),
  ('ui.mp.group.subdivision','en','Subdivision'),
  ('ui.mp.group.displayType','en','Display type'),
  ('ui.mp.group.property','en','Property'),
  ('ui.mp.group.status','en','Status'),
  ('ui.mp.selectAll','en','Select all'),
  ('ui.ai.title','en','Vinhomes Hai Van Bay Assistant'),
  ('ui.ai.active','en','Active'),
  ('ui.ai.listening','en','Listening…'),
  ('ui.ai.thinking','en','Thinking…'),
  ('ui.ai.speaking','en','Replying…'),
  ('ui.ai.inputPh','en','Type your question…'),
  ('ui.ai.close','en','Close'),
  ('ui.ai.errBrowser','en','Your browser does not support this feature.'),
  ('ui.ai.errMic','en','Please allow microphone access.'),
  ('ui.ai.connecting','en','Connecting…'),
  ('ui.ai.disconnected','en','Disconnected…'),
  ('ui.ai.alertTitle','en','Notice'),
  ('ui.ai.alertOk','en','Got it');

-- UPSERT vào project_translations
INSERT INTO project_translations (project_id, language_id, translation_key_id, translated_text)
SELECT
  (SELECT id FROM projects WHERE code='haivanbay'),
  l.id,
  tk.id,
  tmp.text_value
FROM _tmp_i18n tmp
JOIN translation_keys tk
  ON tk.namespace_code = 'ui' AND tk.key_code = tmp.key_code
JOIN languages l
  ON l.code = tmp.lang_code
ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text);

DROP TEMPORARY TABLE IF EXISTS _tmp_i18n;

COMMIT;

-- Kiểm tra:
SELECT COUNT(*) AS keys_added
  FROM translation_keys
 WHERE namespace_code='ui'
   AND key_code IN (
     'group.tongQuan','status.available','props.empty','mp.filter','ai.title'
   );

SELECT l.code, COUNT(*) AS translations
  FROM project_translations pt
  JOIN languages l ON l.id = pt.language_id
  JOIN translation_keys tk ON tk.id = pt.translation_key_id
 WHERE pt.project_id = (SELECT id FROM projects WHERE code='haivanbay')
   AND tk.key_code LIKE 'ai.%'
 GROUP BY l.code;
