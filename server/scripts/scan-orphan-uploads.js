// Script quét file orphan: file tồn tại trên R2 hoặc trong uploads/
// nhưng KHÔNG còn reference trong DB.
//
// Chạy:
//   cd server
//   node scripts/scan-orphan-uploads.js              # liệt kê, không xóa
//   node scripts/scan-orphan-uploads.js --delete     # xóa thật
//   node scripts/scan-orphan-uploads.js --json       # xuất JSON
//
// Cài deps trước (1 lần): npm i -D @aws-sdk/client-s3 (đã có sẵn)
import 'dotenv/config';
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { query } from '../src/db.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const {
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE,
} = process.env;

const DO_DELETE = process.argv.includes('--delete');
const AS_JSON   = process.argv.includes('--json');

const SITE_ROOT   = path.resolve(fileURLToPath(import.meta.url), '../../..');
const UPLOADS_DIR = path.join(SITE_ROOT, 'server', 'uploads');

const log = (...a) => { if (!AS_JSON) console.log(...a); };

/* === 1. Thu thập mọi URL/path đang được dùng trong DB === */
// Mọi cột chứa URL ảnh/file — extend khi thêm bảng mới
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
// Bảng có thể có hoặc không — bọc try
const URL_QUERIES_OPTIONAL = [
  'SELECT resource_url AS u FROM resources',
  'SELECT background_url AS u FROM project_card_overviews WHERE background_url IS NOT NULL',
  'SELECT logo_url AS u FROM projects WHERE logo_url IS NOT NULL',
];

async function collectUsedUrls() {
  const used = new Set();
  const addRows = (rows) => {
    for (const r of rows) {
      if (r.u) extractUrls(String(r.u)).forEach(x => used.add(x));
    }
  };
  for (const q of URL_QUERIES) {
    const { rows } = await query(q);
    addRows(rows);
  }
  for (const q of URL_QUERIES_OPTIONAL) {
    try { const { rows } = await query(q); addRows(rows); } catch {}
  }
  // metadata JSON của gallery có thumb nhúng — quét luôn
  try {
    const { rows } = await query('SELECT metadata FROM gallery_items WHERE metadata IS NOT NULL');
    for (const r of rows) {
      let m = r.metadata;
      if (typeof m === 'string') { try { m = JSON.parse(m); } catch { m = null; } }
      if (m && m.thumb) extractUrls(String(m.thumb)).forEach(x => used.add(x));
    }
  } catch {}
  return used;
}

// Một field có thể chứa nhiều URL (vd. HTML, JSON). Tách URL bằng regex
function extractUrls(s) {
  if (!s) return [];
  // Match URL absolute hoặc relative /uploads/...
  const out = new Set();
  // absolute
  for (const m of s.matchAll(/https?:\/\/[^\s"'<>]+/g)) out.add(m[0]);
  // relative uploads
  for (const m of s.matchAll(/\/uploads\/[^\s"'<>]+/g)) out.add(m[0]);
  if (!out.size && /^[\w./-]+$/.test(s)) out.add(s); // chuỗi đơn (vd "uploads/x.jpg")
  return [...out];
}

/* === 2. So với R2 === */
async function* listR2() {
  if (!R2_BUCKET) return;
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
  let token;
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET, ContinuationToken: token,
    }));
    for (const o of res.Contents || []) yield { key: o.Key, size: o.Size, s3 };
    token = res.IsTruncated ? res.NextContinuationToken : null;
  } while (token);
}

function r2KeyInUsed(key, used) {
  // URL R2 có dạng {R2_PUBLIC_BASE}/{key}. Check cả publicUrl và key thuần.
  if (used.has(key)) return true;
  if (R2_PUBLIC_BASE) {
    const full = `${R2_PUBLIC_BASE.replace(/\/+$/, '')}/${key}`;
    if (used.has(full)) return true;
  }
  // Có thể URL trong DB lưu encode khác — check bằng cách bao gồm key
  for (const u of used) {
    if (u.endsWith('/' + key) || u.endsWith(key)) return true;
  }
  return false;
}

/* === 3. So với uploads/ local === */
async function* listLocal(dir, base = '') {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel  = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) yield* listLocal(full, rel);
    else if (e.isFile()) {
      const stat = await fs.stat(full);
      yield { relPath: rel, fullPath: full, size: stat.size };
    }
  }
}

function localInUsed(relPath, used) {
  const candidate1 = '/uploads/' + relPath;
  const candidate2 = 'uploads/' + relPath;
  return used.has(candidate1) || used.has(candidate2)
      || [...used].some(u => u.endsWith(candidate1) || u.endsWith(candidate2));
}

function fmt(b) {
  if (b < 1024) return b + 'B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + 'KB';
  return (b / 1024 / 1024).toFixed(2) + 'MB';
}

/* === Main === */
(async () => {
  log(`[scan-orphan] delete=${DO_DELETE}`);
  const used = await collectUsedUrls();
  log(`Đã thu thập ${used.size} URL/path đang dùng trong DB.\n`);

  const orphanR2 = [];
  const orphanLocal = [];
  let r2Total = 0, r2Used = 0, localTotal = 0, localUsed = 0;

  // R2
  if (R2_BUCKET) {
    log('Quét R2 bucket ' + R2_BUCKET + '...');
    let s3Ref;
    for await (const o of listR2()) {
      r2Total++;
      s3Ref = o.s3;
      if (r2KeyInUsed(o.key, used)) r2Used++;
      else orphanR2.push({ key: o.key, size: o.size });
    }
    log(`  R2: ${r2Total} object, ${r2Used} đang dùng, ${orphanR2.length} orphan.`);

    if (DO_DELETE && orphanR2.length) {
      log('  Xóa orphan trên R2...');
      for (const o of orphanR2) {
        await s3Ref.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: o.key }));
      }
      log(`  Đã xóa ${orphanR2.length} object R2.`);
    }
  } else {
    log('R2 chưa cấu hình — skip.');
  }

  // Local uploads/
  log('\nQuét ' + UPLOADS_DIR + '...');
  for await (const f of listLocal(UPLOADS_DIR)) {
    localTotal++;
    if (localInUsed(f.relPath, used)) localUsed++;
    else orphanLocal.push(f);
  }
  log(`  Local: ${localTotal} file, ${localUsed} đang dùng, ${orphanLocal.length} orphan.`);

  if (DO_DELETE && orphanLocal.length) {
    log('  Xóa orphan local...');
    for (const f of orphanLocal) await fs.unlink(f.fullPath).catch(() => {});
    log(`  Đã xóa ${orphanLocal.length} file local.`);
  }

  // Output
  if (AS_JSON) {
    console.log(JSON.stringify({
      r2: { total: r2Total, used: r2Used, orphan: orphanR2 },
      local: { total: localTotal, used: localUsed, orphan: orphanLocal.map(f => ({ path: f.relPath, size: f.size })) },
    }, null, 2));
  } else {
    if (orphanR2.length) {
      log('\n=== Orphan R2 ===');
      let sum = 0;
      for (const o of orphanR2.slice(0, 100)) {
        log(`  ${fmt(o.size).padStart(10)}  ${o.key}`);
        sum += o.size;
      }
      if (orphanR2.length > 100) log(`  ... và ${orphanR2.length - 100} file nữa`);
      const totalSum = orphanR2.reduce((s, o) => s + o.size, 0);
      log(`  Tổng: ${fmt(totalSum)}`);
    }
    if (orphanLocal.length) {
      log('\n=== Orphan local uploads/ ===');
      for (const f of orphanLocal.slice(0, 100)) {
        log(`  ${fmt(f.size).padStart(10)}  ${f.relPath}`);
      }
      if (orphanLocal.length > 100) log(`  ... và ${orphanLocal.length - 100} file nữa`);
      const totalSum = orphanLocal.reduce((s, f) => s + f.size, 0);
      log(`  Tổng: ${fmt(totalSum)}`);
    }
    if (!DO_DELETE && (orphanR2.length || orphanLocal.length)) {
      log('\n→ Chạy lại với --delete để xóa thật. Hoặc --json để xuất danh sách JSON.');
    }
  }

  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
