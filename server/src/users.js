// Quản lý người dùng (developer / owner / sales) + logic gán lead cho sale.
import { query, pool } from './db.js';
import { hashPassword } from './auth.js';

const VALID_ROLES = ['developer', 'owner', 'sales'];

async function roleId(c, code) {
  const r = await c.query('SELECT id FROM roles WHERE code = ?', [code]);
  if (!r.rows.length) throw new Error(`Role không tồn tại: ${code}`);
  return r.rows[0].id;
}

// Danh sách đầy đủ mọi tài khoản của 1 dự án, kèm role + slug công khai.
export async function listUsers(projectId) {
  const r = await query(
    `SELECT u.id, u.username, u.full_name, u.title, u.email, u.phone,
            u.avatar_url, u.is_active, r.code AS role,
            m.public_slug, m.is_primary_sales
       FROM users u
       JOIN user_role_bindings b ON b.user_id = u.id
       JOIN roles r ON r.id = b.role_id
       LEFT JOIN project_memberships m
              ON m.user_id = u.id AND m.project_id = ?
      ORDER BY CASE r.code WHEN 'developer' THEN 0 WHEN 'owner' THEN 1 ELSE 2 END,
               u.username`,
    [projectId]
  );
  return r.rows.map((x) => ({
    id: x.id,
    username: x.username,
    name: x.full_name,
    title: x.title || '',
    email: x.email || '',
    phone: x.phone || '',
    avatar: x.avatar_url || '',
    role: x.role,
    slug: x.public_slug || '',
    isActive: x.is_active,
  }));
}

// Tạo tài khoản mới. password bắt buộc; slug chỉ dùng cho sale.
export async function createUser(projectId, body) {
  const role = (body.role || 'sales').toLowerCase();
  if (!VALID_ROLES.includes(role)) throw new Error('Role không hợp lệ');
  const username = (body.username || '').trim().toLowerCase();
  if (!/^[a-z0-9_.-]+$/.test(username)) throw new Error('Username chỉ gồm a-z 0-9 _ . -');
  if (!body.name) throw new Error('Thiếu họ tên');
  if (!body.password || body.password.length < 6) {
    throw new Error('Mật khẩu tối thiểu 6 ký tự');
  }

  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    const dup = await c.query('SELECT 1 FROM users WHERE LOWER(username) = ?', [username]);
    if (dup.rows.length) throw new Error('Username đã tồn tại');

    const hash = await hashPassword(body.password);
    const ur = await c.query(
      `INSERT INTO users (username, password_hash, full_name, email, phone, title, avatar_url)
       VALUES (?,?,?,?,?,?,?)`,
      [username, hash, body.name, body.email || null, body.phone || null,
       body.title || null, body.avatar || null]
    );
    const userId = ur.insertId;
    const rid = await roleId(c, role);
    await c.query(
      'INSERT INTO user_role_bindings (user_id, role_id) VALUES (?,?)',
      [userId, rid]
    );

    const slug = role === 'sales'
      ? ((body.slug || username).trim().toLowerCase())
      : null;
    if (slug && !/^[a-z0-9_.-]+$/.test(slug)) throw new Error('Slug chỉ gồm a-z 0-9 _ . -');
    await c.query(
      `INSERT INTO project_memberships (project_id, user_id, role_id, public_slug)
       VALUES (?,?,?,?)`,
      [projectId, userId, rid, slug]
    );

    await c.query('COMMIT');
    return userId;
  } catch (err) {
    await c.query('ROLLBACK');
    throw err;
  } finally {
    c.release();
  }
}

// Cập nhật user. password tùy chọn — chỉ đổi khi có giá trị.
export async function updateUser(projectId, userId, body) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    const cur = await c.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (!cur.rows.length) throw new Error('User không tồn tại');

    await c.query(
      `UPDATE users SET full_name=?, email=?, phone=?, title=?,
              avatar_url=?, is_active=?, updated_at=NOW()
        WHERE id=?`,
      [body.name, body.email || null, body.phone || null, body.title || null,
       body.avatar || null, body.isActive !== false ? 1 : 0, userId]
    );

    if (body.password) {
      if (body.password.length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự');
      const hash = await hashPassword(body.password);
      await c.query('UPDATE users SET password_hash=? WHERE id=?', [hash, userId]);
    }

    // Đổi role nếu được gửi.
    if (body.role) {
      const role = body.role.toLowerCase();
      if (!VALID_ROLES.includes(role)) throw new Error('Role không hợp lệ');
      const rid = await roleId(c, role);
      await c.query('UPDATE user_role_bindings SET role_id=? WHERE user_id=?', [rid, userId]);
      await c.query(
        'UPDATE project_memberships SET role_id=? WHERE user_id=? AND project_id=?',
        [rid, userId, projectId]
      );
    }

    // Slug: admin có thể custom id riêng cho sale.
    if (body.slug !== undefined) {
      const slug = (body.slug || '').trim().toLowerCase();
      if (slug && !/^[a-z0-9_.-]+$/.test(slug)) throw new Error('Slug chỉ gồm a-z 0-9 _ . -');
      const clash = await c.query(
        `SELECT 1 FROM project_memberships
          WHERE project_id=? AND public_slug=? AND user_id<>?`,
        [projectId, slug || null, userId]
      );
      if (slug && clash.rows.length) throw new Error('Slug đã được dùng bởi sale khác');
      await c.query(
        'UPDATE project_memberships SET public_slug=? WHERE user_id=? AND project_id=?',
        [slug || null, userId, projectId]
      );
    }

    await c.query('COMMIT');
  } catch (err) {
    await c.query('ROLLBACK');
    throw err;
  } finally {
    c.release();
  }
}

export async function deleteUser(userId) {
  // user_role_bindings / project_memberships có ON DELETE CASCADE.
  await query('DELETE FROM users WHERE id = ?', [userId]);
}

// Tìm sale theo slug công khai (?s=...). Trả user_id hoặc null.
export async function findSaleBySlug(projectId, slug) {
  if (!slug) return null;
  const r = await query(
    `SELECT m.user_id
       FROM project_memberships m
       JOIN roles r ON r.id = m.role_id
      WHERE m.project_id=? AND r.code='sales' AND m.is_active=1
        AND LOWER(m.public_slug)=LOWER(?)`,
    [projectId, slug]
  );
  return r.rows[0]?.user_id || null;
}

// Round-robin: chọn sale kế tiếp khi không có ?s=.
// Dùng counter lưu DB, lock dòng để tuần tự đúng dù nhiều request song song.
export async function pickNextSale(projectId) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    const sales = (
      await c.query(
        `SELECT m.user_id
           FROM project_memberships m
           JOIN roles r ON r.id = m.role_id
          WHERE m.project_id=? AND r.code='sales' AND m.is_active=1
          ORDER BY m.user_id`,
        [projectId]
      )
    ).rows.map((x) => x.user_id);

    if (!sales.length) { await c.query('COMMIT'); return null; }

    // Lock dòng counter (tạo nếu chưa có). MySQL: INSERT IGNORE bỏ qua trùng PK.
    await c.query(
      'INSERT IGNORE INTO lead_assignment_counters (project_id) VALUES (?)',
      [projectId]
    );
    const cur = (
      await c.query(
        'SELECT last_user_id FROM lead_assignment_counters WHERE project_id=? FOR UPDATE',
        [projectId]
      )
    ).rows[0];

    const lastIdx = sales.indexOf(cur?.last_user_id);
    const next = sales[(lastIdx + 1) % sales.length];

    await c.query(
      'UPDATE lead_assignment_counters SET last_user_id=?, updated_at=NOW() WHERE project_id=?',
      [next, projectId]
    );
    await c.query('COMMIT');
    return next;
  } catch (err) {
    await c.query('ROLLBACK');
    throw err;
  } finally {
    c.release();
  }
}
