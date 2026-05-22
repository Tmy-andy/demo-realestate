// Tạo / đặt lại các tài khoản đăng nhập với mật khẩu bcrypt.
// Không đụng dữ liệu dự án — an toàn chạy lại nhiều lần.
//   node src/seed-accounts.js
import { pool } from './db.js';
import { hashPassword } from './auth.js';

const PROJECT_CODE = 'haivanbay';

const ACCOUNTS = [
  { username: 'dev',    password: 'dev@2025',    name: 'Developer',     title: 'Kỹ thuật — Toàn quyền',     role: 'developer' },
  { username: 'admin',  password: 'aurora@2025', name: 'Chủ Đầu Tư',    title: 'Quản trị dự án',            role: 'owner' },
  { username: 'sales',  password: 'sales@2025',  name: 'Nguyễn Minh Anh', title: 'Chuyên viên tư vấn cao cấp', role: 'sales', slug: 'sales' },
  { username: 'sales2', password: 'sales@2025',  name: 'Trần Bảo Khánh',  title: 'Chuyên viên tư vấn',         role: 'sales', slug: 'sales2' },
];

async function main() {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    const projectId = (
      await c.query('SELECT id FROM projects WHERE code=?', [PROJECT_CODE])
    ).rows[0]?.id;
    if (!projectId) throw new Error('Chưa có dự án — hãy chạy npm run seed trước');

    const roleIds = {};
    for (const code of ['developer', 'owner', 'sales']) {
      roleIds[code] = (await c.query('SELECT id FROM roles WHERE code=?', [code])).rows[0].id;
    }

    for (const a of ACCOUNTS) {
      const hash = await hashPassword(a.password);
      await c.query(
        `INSERT INTO users (username, password_hash, full_name, title)
         VALUES (?,?,?,?)
         ON DUPLICATE KEY UPDATE
           password_hash = VALUES(password_hash),
           full_name     = VALUES(full_name),
           title         = VALUES(title)`,
        [a.username, hash, a.name, a.title]
      );
      const userId = (
        await c.query('SELECT id FROM users WHERE username=?', [a.username])
      ).rows[0].id;

      await c.query(
        'INSERT IGNORE INTO user_role_bindings (user_id, role_id) VALUES (?,?)',
        [userId, roleIds[a.role]]
      );
      await c.query(
        `INSERT INTO project_memberships (project_id, user_id, role_id, public_slug)
         VALUES (?,?,?,?)
         ON DUPLICATE KEY UPDATE public_slug = VALUES(public_slug)`,
        [projectId, userId, roleIds[a.role], a.slug || null]
      );
      console.log(`  ✓ ${a.username} (${a.role})`);
    }

    await c.query('COMMIT');
    console.log('✓ Đã tạo/đặt lại tài khoản đăng nhập.');
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
