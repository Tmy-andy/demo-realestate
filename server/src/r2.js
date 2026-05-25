// Cloudflare R2 presigned-URL helper.
// Frontend xin presigned PUT URL ở /api/upload/presign rồi upload thẳng lên R2.
// Cần các biến .env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
// R2_BUCKET, R2_PUBLIC_BASE (vd https://pub-xxx.r2.dev hoặc custom domain).
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';
import path from 'node:path';

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_BASE,
} = process.env;

export const r2Enabled = Boolean(
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_PUBLIC_BASE
);

const s3 = r2Enabled
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
]);

function sanitizeName(name) {
  const ext = path.extname(name || '').toLowerCase().replace(/[^.a-z0-9]/g, '').slice(0, 8);
  return ext || '.bin';
}

// Trả { uploadUrl, publicUrl, key, headers } để frontend PUT trực tiếp.
export async function createPresignedPut({ filename, contentType, folder = 'uploads' }) {
  if (!r2Enabled) throw new Error('R2 chưa được cấu hình (.env)');
  if (!contentType || !ALLOWED_MIME.has(contentType)) {
    throw new Error('Content-Type không hợp lệ');
  }
  const ext = sanitizeName(filename);
  const safeFolder = String(folder).replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '') || 'uploads';
  const key = `${safeFolder}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

  const cmd = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 300 });
  const publicUrl = `${R2_PUBLIC_BASE.replace(/\/+$/, '')}/${key}`;
  return { uploadUrl, publicUrl, key, headers: { 'Content-Type': contentType } };
}
