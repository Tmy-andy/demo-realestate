// Bổ sung các key i18n cho những vị trí frontend còn hardcoded tiếng Việt.
// Idempotent: nếu key đã tồn tại thì cập nhật default_text; bản dịch upsert
// theo (project_id, language_id, translation_key_id).
//
//   npm run seed:i18n-missing
//
import { pool } from './db.js';

const PROJECT_CODE = 'haivanbay';

// [namespace, key, { vi, en }]
const ENTRIES = [
  // ── main.js: ROOT_GROUPS / CHILD_GROUPS ──
  ['ui', 'group.tongQuan',          { vi: 'Tổng quan',           en: 'Overview' }],
  ['ui', 'group.phanKhu',           { vi: 'Phân khu',            en: 'Subdivisions' }],
  ['ui', 'group.tienIchNoiKhu',     { vi: 'Tiện ích nội khu',    en: 'Internal Amenities' }],
  ['ui', 'group.tienIchNgoaiKhu',   { vi: 'Tiện ích ngoại khu',  en: 'External Amenities' }],
  ['ui', 'group.matBangTang',       { vi: 'Mặt bằng tầng',       en: 'Floor Plans' }],
  ['ui', 'group.view360',           { vi: 'View 360 căn hộ',     en: 'Unit 360 View' }],

  // ── main.js: project-card ──
  ['ui', 'pc.overviewFull',         { vi: 'Tổng quan — hiển thị đầy đủ', en: 'Overview — full view' }],
  ['ui', 'pc.filteringBy',          { vi: 'Đang lọc theo',       en: 'Filtering by' }],
  ['ui', 'pc.highlightInfo',        { vi: 'Thông tin nổi bật',   en: 'Key Highlights' }],
  ['ui', 'pc.watchIntroVideo',      { vi: 'Xem video giới thiệu',en: 'Watch intro video' }],
  ['ui', 'pc.subdivision',          { vi: 'Phân khu',            en: 'Subdivision' }],
  ['ui', 'pc.overviewInfo',         { vi: 'Thông tin tổng quan', en: 'Overview' }],
  ['ui', 'pc.highlightPoints',      { vi: 'Điểm nhấn nổi bật',   en: 'Highlights' }],
  ['ui', 'pc.viewProductsInPk',     { vi: 'Xem sản phẩm tại phân khu', en: 'View products in subdivision' }],
  ['ui', 'pc.exploreVrTour',        { vi: 'Khám phá VR Tour phân khu', en: 'Explore VR Tour' }],
  ['ui', 'pc.status.opening',       { vi: 'Đang mở bán',         en: 'On sale' }],

  // ── main.js: status căn ──
  ['ui', 'status.available',        { vi: 'Còn trống',           en: 'Available' }],
  ['ui', 'status.holding',          { vi: 'Đang giữ',            en: 'On hold' }],
  ['ui', 'status.sold',             { vi: 'Đã bán',              en: 'Sold' }],

  // ── main.js: gallery / empty / timeline ──
  ['ui', 'gallery.emptyVideo',      { vi: 'Chưa có video nào trong thư viện.', en: 'No videos in the library yet.' }],
  ['ui', 'gallery.emptyPhoto',      { vi: 'Chưa có ảnh nào trong thư viện.',   en: 'No photos in the library yet.' }],
  ['ui', 'empty.content',           { vi: 'Chưa có nội dung',    en: 'No content yet' }],
  ['ui', 'empty.location',          { vi: 'Chưa có địa điểm',    en: 'No locations yet' }],
  ['ui', 'empty.milestone',         { vi: 'Chưa có mốc tiến độ', en: 'No milestones yet' }],
  ['ui', 'timeline.done',           { vi: 'Hoàn thành',          en: 'Completed' }],
  ['ui', 'timeline.doing',          { vi: 'Đang thực hiện',      en: 'In progress' }],
  ['ui', 'timeline.upcoming',       { vi: 'Sắp tới',             en: 'Upcoming' }],

  // ── main.js: resources ──
  ['ui', 'res.brochure',            { vi: 'Brochure dự án',           en: 'Project brochure' }],
  ['ui', 'res.brandKit',            { vi: 'Bộ nhận diện thương hiệu', en: 'Brand kit' }],
  ['ui', 'res.priceList',           { vi: 'Bảng giá & chính sách',    en: 'Price list & policy' }],
  ['ui', 'res.floorPlanPdf',        { vi: 'TMB mã căn & diện tích',   en: 'Floor plan codes & area' }],

  // ── properties.js ──
  ['ui', 'props.empty',             { vi: 'Không có sản phẩm phù hợp bộ lọc.', en: 'No products match the filter.' }],
  ['ui', 'props.filter.type',       { vi: 'Loại hình',           en: 'Type' }],
  ['ui', 'props.filter.maxPrice',   { vi: 'Mức giá tối đa',      en: 'Max price' }],
  ['ui', 'props.detail.consultant', { vi: 'Nhân viên tư vấn',    en: 'Consultant' }],
  ['ui', 'props.detail.price',      { vi: 'Giá bán dự kiến',     en: 'Estimated price' }],
  ['ui', 'props.detail.status',     { vi: 'Tình trạng',          en: 'Status' }],
  ['ui', 'props.detail.type',       { vi: 'Loại hình',           en: 'Type' }],
  ['ui', 'props.detail.legal',      { vi: 'Pháp lý',             en: 'Legal' }],
  ['ui', 'props.detail.handover',   { vi: 'Dự kiến bàn giao',    en: 'Expected handover' }],
  ['ui', 'props.emptyFloorplan',    { vi: 'Chưa có mặt bằng.',   en: 'No floor plans yet.' }],

  // ── masterplan.js ──
  ['ui', 'mp.overviewEyebrow',      { vi: 'Tổng quan dự án',     en: 'Project Overview' }],
  ['ui', 'mp.filter',               { vi: 'Lọc',                 en: 'Filter' }],
  ['ui', 'mp.exploreVrTour',        { vi: 'Khám phá VR Tour →',  en: 'Explore VR Tour →' }],
  ['ui', 'mp.group.subdivision',    { vi: 'Phân khu',            en: 'Subdivision' }],
  ['ui', 'mp.group.displayType',    { vi: 'Loại hiển thị',       en: 'Display type' }],
  ['ui', 'mp.group.property',       { vi: 'Bất động sản',        en: 'Property' }],
  ['ui', 'mp.group.status',         { vi: 'Trạng thái',          en: 'Status' }],
  ['ui', 'mp.selectAll',            { vi: 'Chọn tất cả',         en: 'Select all' }],

  // ── ai-panel.js ──
  ['ui', 'ai.title',                { vi: 'Trợ lý Vinhomes Hai Van Bay', en: 'Vinhomes Hai Van Bay Assistant' }],
  ['ui', 'ai.active',               { vi: 'Đang hoạt động',      en: 'Active' }],
  ['ui', 'ai.listening',            { vi: 'Đang lắng nghe…',     en: 'Listening…' }],
  ['ui', 'ai.thinking',             { vi: 'Đang suy nghĩ…',      en: 'Thinking…' }],
  ['ui', 'ai.speaking',             { vi: 'Đang trả lời…',       en: 'Replying…' }],
  ['ui', 'ai.inputPh',              { vi: 'Nhập câu hỏi…',       en: 'Type your question…' }],
  ['ui', 'ai.close',                { vi: 'Đóng',                en: 'Close' }],
  ['ui', 'ai.errBrowser',           { vi: 'Trình duyệt không hỗ trợ tính năng này.', en: 'Your browser does not support this feature.' }],
  ['ui', 'ai.errMic',               { vi: 'Bạn cần cho phép truy cập micro.',         en: 'Please allow microphone access.' }],
  ['ui', 'ai.connecting',           { vi: 'Đang kết nối…',       en: 'Connecting…' }],
  ['ui', 'ai.disconnected',         { vi: 'Mất kết nối…',        en: 'Disconnected…' }],
  ['ui', 'ai.alertTitle',           { vi: 'Thông báo',           en: 'Notice' }],
  ['ui', 'ai.alertOk',              { vi: 'Đã hiểu',             en: 'Got it' }],
];

async function main() {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    const pr = await c.query('SELECT id FROM projects WHERE code=?', [PROJECT_CODE]);
    if (!pr.rows.length) throw new Error('Chưa có dự án — chạy npm run seed trước');
    const projectId = pr.rows[0].id;

    const langRows = (await c.query('SELECT id, code FROM languages')).rows;
    const langId = {};
    for (const r of langRows) langId[r.code] = r.id;

    let inserted = 0, updated = 0;
    for (const [ns, key, perLang] of ENTRIES) {
      // 1) upsert translation_keys (default_text = bản 'vi')
      const def = perLang.vi || key;
      const existing = await c.query(
        'SELECT id FROM translation_keys WHERE namespace_code=? AND key_code=?',
        [ns, key]
      );
      let keyId;
      if (existing.rows.length) {
        keyId = existing.rows[0].id;
        await c.query('UPDATE translation_keys SET default_text=? WHERE id=?', [def, keyId]);
      } else {
        const ins = await c.query(
          'INSERT INTO translation_keys (namespace_code, key_code, default_text) VALUES (?, ?, ?)',
          [ns, key, def]
        );
        keyId = ins.insertId;
      }

      // 2) upsert project_translations cho mỗi ngôn ngữ có giá trị
      for (const code of Object.keys(perLang)) {
        const lid = langId[code];
        if (!lid) continue;
        const text = perLang[code];
        const exist = await c.query(
          'SELECT id FROM project_translations WHERE project_id=? AND language_id=? AND translation_key_id=?',
          [projectId, lid, keyId]
        );
        if (exist.rows.length) {
          await c.query(
            'UPDATE project_translations SET translated_text=? WHERE id=?',
            [text, exist.rows[0].id]
          );
          updated++;
        } else {
          await c.query(
            'INSERT INTO project_translations (project_id, language_id, translation_key_id, translated_text) VALUES (?, ?, ?, ?)',
            [projectId, lid, keyId, text]
          );
          inserted++;
        }
      }
    }

    await c.query('COMMIT');
    console.log(`✔ i18n bổ sung: ${ENTRIES.length} keys, ${inserted} dịch mới, ${updated} cập nhật`);
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('✗ Lỗi:', err.message);
    process.exitCode = 1;
  } finally {
    c.release();
    await pool.end();
  }
}

main();
