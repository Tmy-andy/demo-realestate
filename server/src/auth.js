// Xác thực + phân quyền cho admin API.
// - Mật khẩu: hash bcrypt, lưu users.password_hash.
// - Phiên: token ngẫu nhiên, chỉ lưu SHA-256(token) vào auth_sessions.
//   Client giữ token gốc, gửi qua header Authorization: Bearer <token>.
import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const SESSION_TTL_HOURS = 12;

export function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

// Đăng nhập: trả { token, user } hoặc null nếu sai.
export async function login(username, password, meta = {}) {
  const r = await query(
    `SELECT u.id, u.username, u.full_name, u.title, u.password_hash, u.is_active,
            r.code AS role
       FROM users u
       JOIN user_role_bindings b ON b.user_id = u.id
       JOIN roles r ON r.id = b.role_id
      WHERE LOWER(u.username) = LOWER(?)`,
    [username]
  );
  const row = r.rows[0];
  if (!row || !row.is_active) return null;
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 3600_000);
  await query(
    `INSERT INTO auth_sessions (user_id, session_token_hash, ip_address, user_agent, expires_at)
     VALUES (?,?,?,?,?)`,
    [row.id, sha256(token), meta.ip || null, meta.userAgent || null, expiresAt]
  );
  await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [row.id]);

  return {
    token,
    user: {
      id: row.id,
      username: row.username,
      name: row.full_name,
      title: row.title || '',
      role: row.role,
    },
  };
}

export async function logout(token) {
  if (!token) return;
  await query(
    'UPDATE auth_sessions SET revoked_at = NOW() WHERE session_token_hash = ?',
    [sha256(token)]
  );
}

// Tra token -> user đang đăng nhập, hoặc null.
export async function resolveSession(token) {
  if (!token) return null;
  const r = await query(
    `SELECT u.id, u.username, u.full_name, u.title, r.code AS role
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       JOIN user_role_bindings b ON b.user_id = u.id
       JOIN roles r ON r.id = b.role_id
      WHERE s.session_token_hash = ?
        AND s.revoked_at IS NULL
        AND s.expires_at > NOW()
        AND u.is_active = 1`,
    [sha256(token)]
  );
  const row = r.rows[0];
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    name: row.full_name,
    title: row.title || '',
    role: row.role,
  };
}

const bearer = (req) => {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
};

// Middleware: gắn req.user nếu token hợp lệ; chặn nếu không.
// Dùng requireRole(...roles) để giới hạn theo quyền.
export function requireAuth(...roles) {
  return async (req, res, next) => {
    try {
      const user = await resolveSession(bearer(req));
      if (!user) return res.status(401).json({ error: 'Chưa đăng nhập hoặc phiên hết hạn' });
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Không đủ quyền' });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}
