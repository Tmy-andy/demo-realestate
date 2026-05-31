// Script migrate 1 lần: liệt kê toàn bộ ảnh trên R2, file nào > MIN_SIZE
// và resolution > MAX_DIM thì tải về, resize bằng sharp, upload đè cùng
// key (URL không đổi → DB không cần sửa).
//
// Chạy:  cd server && node scripts/migrate-r2-resize.js [--dry-run]
//
// .env cần có: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
//              R2_BUCKET, R2_PUBLIC_BASE
//
// Cài deps trước (1 lần): cd server && npm i -D sharp
import 'dotenv/config';
import {
  S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';

const {
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error('Thiếu biến .env R2_*');
  process.exit(1);
}

const DRY_RUN = process.argv.includes('--dry-run');
const MIN_SIZE = 500 * 1024;      // bỏ qua file < 500KB
const MAX_DIM = 2000;             // cạnh dài nhất sau resize
const QUALITY = 85;               // JPEG quality
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i; // SVG/GIF không resize

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function* listAll() {
  let token;
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: R2_BUCKET, ContinuationToken: token,
    }));
    for (const o of res.Contents || []) yield o;
    token = res.IsTruncated ? res.NextContinuationToken : null;
  } while (token);
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  return Buffer.concat(chunks);
}

function fmt(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / 1024 / 1024).toFixed(2) + 'MB';
}

async function processOne(obj) {
  const { Key: key, Size: size } = obj;
  if (size < MIN_SIZE) return { key, status: 'skip-small' };
  if (!IMAGE_EXT.test(key)) return { key, status: 'skip-ext' };

  const get = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const buf = await streamToBuffer(get.Body);
  const meta = await sharp(buf).metadata().catch(() => null);
  if (!meta || !meta.width) return { key, status: 'skip-decode' };

  // Pipeline: resize nếu cần + encode JPEG/WebP/PNG tương ứng.
  const needResize = Math.max(meta.width, meta.height) > MAX_DIM;
  let pipeline = sharp(buf).rotate(); // tôn trọng EXIF orientation
  if (needResize) {
    pipeline = pipeline.resize({
      width: meta.width >= meta.height ? MAX_DIM : null,
      height: meta.height > meta.width ? MAX_DIM : null,
      withoutEnlargement: true,
    });
  }
  // PNG có alpha → giữ PNG; không thì ép JPEG cho nhẹ
  const hasAlpha = meta.hasAlpha;
  let outBuf, contentType;
  if (hasAlpha && /\.png$/i.test(key)) {
    outBuf = await pipeline.png({ compressionLevel: 9 }).toBuffer();
    contentType = 'image/png';
  } else if (/\.webp$/i.test(key)) {
    outBuf = await pipeline.webp({ quality: QUALITY }).toBuffer();
    contentType = 'image/webp';
  } else {
    outBuf = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    contentType = 'image/jpeg';
  }

  if (outBuf.length >= size) return { key, status: 'skip-not-smaller', oldSize: size, newSize: outBuf.length };

  if (!DRY_RUN) {
    await s3.send(new PutObjectCommand({
      Bucket: R2_BUCKET, Key: key, Body: outBuf, ContentType: contentType,
    }));
  }
  return { key, status: DRY_RUN ? 'would-resize' : 'resized', oldSize: size, newSize: outBuf.length };
}

(async () => {
  console.log(`[migrate-r2-resize] bucket=${R2_BUCKET} dryRun=${DRY_RUN}`);
  let total = 0, processed = 0, saved = 0;
  for await (const obj of listAll()) {
    total++;
    try {
      const r = await processOne(obj);
      if (r.status === 'resized' || r.status === 'would-resize') {
        processed++;
        saved += (r.oldSize - r.newSize);
        console.log(`  ${r.status.padEnd(13)} ${r.key}  ${fmt(r.oldSize)} → ${fmt(r.newSize)}`);
      } else if (r.status.startsWith('skip')) {
        // im lặng để log gọn; bật dòng dưới nếu muốn xem chi tiết
        // console.log(`  ${r.status.padEnd(13)} ${r.key}`);
      }
    } catch (e) {
      console.error(`  ERROR ${obj.Key}: ${e.message}`);
    }
  }
  console.log(`\nXong. Quét ${total} object, ${processed} resize, tiết kiệm ${fmt(saved)}.`);
})();
