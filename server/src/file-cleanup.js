// Tự động xóa file ảnh/tài liệu trên R2 và uploads/ khi không còn
// reference trong DB. Workflow:
//   const before = await collectUsedUrls(c);
//   ...thực hiện thay đổi DB (UPDATE/DELETE/replace)...
//   await cleanupOrphans(before, c);
//
// URL trong "before" mà không có trong snapshot "after" → là orphan,
// được xóa khỏi R2 (nếu là R2 URL) hoặc uploads/ (nếu /uploads/...).
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './db.js';

// Wrapper trông giống connection để collectUsedUrls dùng được khi
// không có transaction (chỉ gọi query lẻ).
export const dbRunner = { query: (sql, params) => query(sql, params) };

const {
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE,
} = process.env;

const r2Enabled = Boolean(
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_BASE
);

const s3 = r2Enabled
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    })
  : null;

const UPLOADS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads'
);

// Mọi truy vấn URL trong DB — thêm vào đây khi có bảng/cột ảnh mới.
// Mỗi truy vấn phải trả cột tên `u` (URL/path).
const URL_QUERIES = [
  'SELECT avatar_url AS u FROM users WHERE avatar_url IS NOT NULL',
  'SELECT image_url AS u FROM menu_item_detail_images',
  'SELECT cover_url AS u FROM menu_item_subdivisions WHERE cover_url IS NOT NULL',
  'SELECT video_url AS u FROM menu_item_subdivisions WHERE video_url IS NOT NULL',
  'SELECT source_url AS u FROM gallery_items',
  'SELECT poster_url AS u FROM gallery_items WHERE poster_url IS NOT NULL',
  'SELECT image_url AS u FROM masterplans',
  'SELECT image_url AS u FROM property_images',
  'SELECT image_url AS u FROM property_floor_plans',
];

/* Lấy snapshot mọi URL đang được DB tham chiếu. `runner` là object có
   .query(sql) — chấp nhận cả connection của transaction lẫn pool helper.
   Trả về Set<string>. */
export async function collectUsedUrls(runner) {
  const used = new Set();
  for (const q of URL_QUERIES) {
    let rows;
    try { ({ rows } = await runner.query(q)); } catch { continue; } // bảng/cột chưa có → skip
    for (const r of rows) {
      if (r.u) extractUrls(String(r.u)).forEach(u => used.add(u));
    }
  }
  // gallery_items.metadata JSON chứa thumb riêng
  try {
    const { rows } = await runner.query('SELECT metadata FROM gallery_items WHERE metadata IS NOT NULL');
    for (const r of rows) {
      let m = r.metadata;
      if (typeof m === 'string') { try { m = JSON.parse(m); } catch { m = null; } }
      if (m && m.thumb) extractUrls(String(m.thumb)).forEach(u => used.add(u));
    }
  } catch {}
  return used;
}

function extractUrls(s) {
  if (!s) return [];
  const out = new Set();
  for (const m of s.matchAll(/https?:\/\/[^\s"'<>]+/g)) out.add(m[0]);
  for (const m of s.matchAll(/\/uploads\/[^\s"'<>]+/g)) out.add(m[0]);
  if (!out.size && /^[\w./-]+$/.test(s)) out.add(s);
  return [...out];
}

/* Biến URL public R2 → key trong bucket. null nếu URL không thuộc R2. */
function r2KeyFromUrl(url) {
  if (!r2Enabled || !url) return null;
  const base = R2_PUBLIC_BASE.replace(/\/+$/, '');
  if (url.startsWith(base + '/')) return url.slice(base.length + 1);
  return null;
}

/* Biến URL local → absolute path file. null nếu không phải local upload. */
function localPathFromUrl(url) {
  if (!url) return null;
  // Match /uploads/xxx, có thể có domain phía trước
  const m = url.match(/(?:^|\/)uploads\/([^?#]+)/);
  if (!m) return null;
  const rel = m[1];
  // Chặn path traversal
  if (rel.includes('..')) return null;
  return path.join(UPLOADS_DIR, rel);
}

/* Xóa 1 URL: thử R2 trước, rồi local. Im lặng nếu không tìm thấy. */
async function deleteOne(url) {
  // R2
  const key = r2KeyFromUrl(url);
  if (key) {
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      console.log('[file-cleanup] R2 deleted:', key);
    } catch (e) {
      console.warn('[file-cleanup] R2 delete fail:', key, e.message);
    }
    return;
  }
  // Local
  const fp = localPathFromUrl(url);
  if (fp) {
    try {
      await fs.unlink(fp);
      console.log('[file-cleanup] local deleted:', path.relative(UPLOADS_DIR, fp));
    } catch (e) {
      if (e.code !== 'ENOENT') console.warn('[file-cleanup] local delete fail:', fp, e.message);
    }
  }
  // URL ngoài (Drive, YouTube, ảnh người dùng dán link) → không xóa
}

/* Diff snapshot trước với DB hiện tại, xóa file orphan.
   Gọi sau khi đã commit transaction. */
export async function cleanupOrphans(beforeSet, runner) {
  if (!beforeSet || !beforeSet.size) return;
  const after = await collectUsedUrls(runner);
  const orphans = [...beforeSet].filter(u => !after.has(u));
  if (!orphans.length) return;
  // Chạy song song nhưng giới hạn để khỏi đè R2 / disk
  const BATCH = 5;
  for (let i = 0; i < orphans.length; i += BATCH) {
    await Promise.all(orphans.slice(i, i + BATCH).map(deleteOne));
  }
  console.log(`[file-cleanup] đã xử lý ${orphans.length} URL orphan.`);
}
