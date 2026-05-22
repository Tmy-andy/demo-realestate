// Seed i18n: nạp toàn bộ chuỗi dịch từ data/i18n-source.json -> các bảng
//   languages / translation_keys / project_translations
// Chạy:  npm run seed:i18n
//
// Nguồn: data/i18n-source.json gồm { langs, dict, dynamic }:
//   - dict     : chuỗi UI tĩnh, dạng { vi:{key:txt}, en:{...}, ... }
//   - dynamic  : chuỗi nội dung động, key = chuỗi tiếng Việt gốc
// Đổ vào DB theo 2 namespace:
//   - namespace 'ui'      : key tĩnh (dict)    -> default_text lấy bản 'vi'
//   - namespace 'dynamic' : key động (dynamic) -> default_text = chính key
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_CODE = 'haivanbay';

async function main() {
  const source = JSON.parse(
    readFileSync(join(__dirname, '../../data/i18n-source.json'), 'utf8')
  );
  const DICT = source.dict;
  const DYNAMIC = source.dynamic;
  if (!DICT || !DYNAMIC) {
    throw new Error('data/i18n-source.json thiếu "dict" hoặc "dynamic"');
  }

  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    // 1) project_id
    const pr = await c.query('SELECT id FROM projects WHERE code=?', [PROJECT_CODE]);
    if (!pr.rows.length) throw new Error('Chưa có dự án — chạy npm run seed trước');
    const projectId = pr.rows[0].id;

    // 2) map mã ngôn ngữ -> language_id (bảng languages đã seed sẵn trong schema)
    const langRows = (await c.query('SELECT id, code FROM languages')).rows;
    const langId = {};
    for (const r of langRows) langId[r.code] = r.id;

    // 3) Dọn dịch cũ của dự án để idempotent
    await c.query('DELETE FROM project_translations WHERE project_id=?', [projectId]);

    // 4) Gom tất cả key: ui.* từ DICT, dynamic.* từ DYNAMIC
    //    keyEntries = [{ namespace, key, defaultText, perLang: {code: text} }]
    const keyEntries = [];

    // DICT: key tĩnh — bản 'vi' là default_text
    const allUiKeys = new Set();
    for (const code of Object.keys(DICT)) {
      for (const k of Object.keys(DICT[code])) allUiKeys.add(k);
    }
    for (const k of allUiKeys) {
      const perLang = {};
      for (const code of Object.keys(DICT)) {
        if (DICT[code][k] != null) perLang[code] = DICT[code][k];
      }
      keyEntries.push({
        namespace: 'ui',
        key: k,
        defaultText: DICT.vi[k] ?? k,
        perLang,
      });
    }

    // DYNAMIC: key = chuỗi tiếng Việt gốc; perLang gồm cả 'vi' (= chính key)
    for (const viStr of Object.keys(DYNAMIC)) {
      const entry = DYNAMIC[viStr];
      const perLang = { vi: viStr };
      for (const code of Object.keys(entry)) perLang[code] = entry[code];
      keyEntries.push({
        namespace: 'dynamic',
        key: viStr,
        defaultText: viStr,
        perLang,
      });
    }

    // 5) UPSERT translation_keys, rồi INSERT project_translations
    let keyCount = 0;
    let transCount = 0;
    for (const e of keyEntries) {
      await c.query(
        `INSERT INTO translation_keys (namespace_code, key_code, default_text)
         VALUES (?,?,?)
         ON DUPLICATE KEY UPDATE default_text = VALUES(default_text)`,
        [e.namespace, e.key, e.defaultText]
      );
      const keyId = (
        await c.query(
          'SELECT id FROM translation_keys WHERE namespace_code=? AND key_code=?',
          [e.namespace, e.key]
        )
      ).rows[0].id;
      keyCount++;

      for (const [code, text] of Object.entries(e.perLang)) {
        const lid = langId[code];
        if (!lid) continue; // ngôn ngữ không có trong bảng languages
        await c.query(
          `INSERT INTO project_translations
             (project_id, language_id, translation_key_id, translated_text)
           VALUES (?,?,?,?)`,
          [projectId, lid, keyId, text]
        );
        transCount++;
      }
    }

    await c.query('COMMIT');
    console.log(`✓ Seed i18n xong. ${keyCount} key, ${transCount} bản dịch.`);
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('✗ Seed i18n lỗi:', err.message);
    process.exitCode = 1;
  } finally {
    c.release();
    await pool.end();
  }
}

main();
