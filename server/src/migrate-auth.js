// Migration một lần: cập nhật DB hiện có cho hệ thống tài khoản mới.
// - Gọn 3 role: developer / owner / sales (xoá manager, content_editor, admin).
// - Thêm bảng lead_assignment_counters (round-robin gán lead).
// An toàn chạy lại nhiều lần (idempotent).
//   node src/migrate-auth.js
import { pool } from './db.js';

async function main() {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    // 1) Đảm bảo 3 role chuẩn tồn tại.
    await c.query(`
      INSERT IGNORE INTO roles (code, name, description) VALUES
        ('developer', 'Developer', 'Toàn quyền — gồm cả thao tác kỹ thuật'),
        ('owner', 'Owner', 'Chủ đầu tư / admin — quản lý dự án và sales'),
        ('sales', 'Sales', 'Nhân viên tư vấn bán hàng')
    `);

    // 2) Chuyển binding của role bị bỏ sang role tương đương:
    //    admin -> owner, manager -> owner, content_editor -> owner.
    const ids = {};
    for (const code of ['developer', 'owner', 'sales']) {
      ids[code] = (await c.query('SELECT id FROM roles WHERE code=?', [code])).rows[0].id;
    }
    const obsolete = (
      await c.query("SELECT id, code FROM roles WHERE code IN ('admin','manager','content_editor')")
    ).rows;
    for (const r of obsolete) {
      // Tránh tạo binding trùng (user đã có owner).
      // MySQL không cho tham chiếu bảng đang UPDATE trong subquery -> bọc 1 lớp.
      await c.query(
        `UPDATE user_role_bindings b SET role_id=?
          WHERE role_id=? AND NOT EXISTS (
            SELECT 1 FROM (SELECT user_id, role_id FROM user_role_bindings) x
             WHERE x.user_id=b.user_id AND x.role_id=?)`,
        [ids.owner, r.id, ids.owner]
      );
      await c.query('DELETE FROM user_role_bindings WHERE role_id=?', [r.id]);
      await c.query(
        `UPDATE project_memberships m SET role_id=?
          WHERE role_id=? AND NOT EXISTS (
            SELECT 1 FROM (SELECT project_id, user_id, role_id FROM project_memberships) x
             WHERE x.project_id=m.project_id AND x.user_id=m.user_id AND x.role_id=?)`,
        [ids.owner, r.id, ids.owner]
      );
      await c.query('DELETE FROM project_memberships WHERE role_id=?', [r.id]);
      await c.query('DELETE FROM roles WHERE id=?', [r.id]);
    }

    // 3) Bảng round-robin (nếu chưa có).
    await c.query(`
      CREATE TABLE IF NOT EXISTS lead_assignment_counters (
        project_id   BIGINT PRIMARY KEY,
        last_user_id BIGINT NULL,
        updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_lac_project FOREIGN KEY (project_id)
          REFERENCES projects(id) ON DELETE CASCADE,
        CONSTRAINT fk_lac_user FOREIGN KEY (last_user_id)
          REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await c.query('COMMIT');
    console.log('✓ Migration auth xong.');
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('✗ Migration lỗi:', err.message);
    process.exitCode = 1;
  } finally {
    c.release();
    await pool.end();
  }
}

main();
