// Seed: import data/project.json -> các bảng MySQL.
// Chạy 1 lần:  npm run seed
// Idempotent: xoá sạch dữ liệu dự án cũ rồi nạp lại.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './db.js';
import { importProjectJson } from './import-project.js';
import { hashPassword } from './auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  readFileSync(join(__dirname, '../../data/project.json'), 'utf8')
);

const PROJECT_CODE = 'haivanbay';

async function main() {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');

    const projectId = await importProjectJson(c, PROJECT_CODE, data);

    // ---- Tài khoản đăng nhập: developer / owner / sales --------------
    // Mật khẩu hash bcrypt. importProjectJson đã tạo user cho từng sale
    // trong project.json (password placeholder) — ở đây đặt mật khẩu thật.
    const roleIds = {};
    for (const code of ['developer', 'owner', 'sales']) {
      roleIds[code] = (
        await c.query('SELECT id FROM roles WHERE code=?', [code])
      ).rows[0].id;
    }

    // Đặt mật khẩu + role cho 1 tài khoản (tạo mới nếu chưa có).
    async function ensureAccount({ username, password, name, title, role, slug }) {
      const hash = await hashPassword(password);
      await c.query(
        `INSERT INTO users (username, password_hash, full_name, title)
         VALUES (?,?,?,?)
         ON DUPLICATE KEY UPDATE
           password_hash = VALUES(password_hash),
           full_name     = VALUES(full_name),
           title         = VALUES(title)`,
        [username, hash, name, title]
      );
      const userId = (
        await c.query('SELECT id FROM users WHERE username=?', [username])
      ).rows[0].id;
      await c.query(
        'INSERT IGNORE INTO user_role_bindings (user_id, role_id) VALUES (?,?)',
        [userId, roleIds[role]]
      );
      await c.query(
        `INSERT INTO project_memberships (project_id, user_id, role_id, public_slug)
         VALUES (?,?,?,?)
         ON DUPLICATE KEY UPDATE public_slug = VALUES(public_slug)`,
        [projectId, userId, roleIds[role], slug || null]
      );
      return userId;
    }

    await ensureAccount({
      username: 'dev', password: 'dev@2025',
      name: 'Developer', title: 'Kỹ thuật — Toàn quyền', role: 'developer',
    });
    await ensureAccount({
      username: 'admin', password: 'aurora@2025',
      name: 'Chủ Đầu Tư', title: 'Quản trị dự án', role: 'owner',
    });
    // sales / sales2 đã được importProjectJson tạo; đặt mật khẩu thật + slug.
    await ensureAccount({
      username: 'sales', password: 'sales@2025',
      name: 'Nguyễn Minh Anh', title: 'Chuyên viên tư vấn cao cấp',
      role: 'sales', slug: 'sales',
    });
    await ensureAccount({
      username: 'sales2', password: 'sales@2025',
      name: 'Trần Bảo Khánh', title: 'Chuyên viên tư vấn',
      role: 'sales', slug: 'sales2',
    });

    // ---- CRM mẫu: customers / leads / appointments / reservations ----
    // Dữ liệu để "Hoạt Động Gần Đây" có nội dung thật. created_at lùi
    // dần về quá khứ để feed hiển thị "x phút / x giờ" đa dạng.
    // MySQL DATETIME: 'YYYY-MM-DD HH:MM:SS' (bỏ 'T' và 'Z' của ISO).
    const ago = (mins) =>
      new Date(Date.now() - mins * 60000)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');

    const firstSales = (
      await c.query(
        `SELECT u.id FROM users u
           JOIN project_memberships m ON m.user_id = u.id
          WHERE m.project_id = ? ORDER BY u.id LIMIT 1`,
        [projectId]
      )
    ).rows[0]?.id || null;

    await c.query(
      `INSERT INTO lead_sources (project_id, source_group, source_code, source_name, is_paid)
       VALUES (?,'social','zalo_oa','Zalo OA',1)
       ON DUPLICATE KEY UPDATE source_name = VALUES(source_name)`,
      [projectId]
    );
    const sourceId = (
      await c.query(
        "SELECT id FROM lead_sources WHERE project_id=? AND source_code='zalo_oa'",
        [projectId]
      )
    ).rows[0].id;

    await c.query(
      `INSERT INTO property_types (project_id, type_code, type_name, bedroom_count)
       VALUES (?,'3pn','Căn 3 phòng ngủ',3)
       ON DUPLICATE KEY UPDATE type_name = VALUES(type_name)`,
      [projectId]
    );
    const typeId = (
      await c.query(
        "SELECT id FROM property_types WHERE project_id=? AND type_code='3pn'",
        [projectId]
      )
    ).rows[0].id;

    const someProps = (
      await c.query(
        `SELECT id, property_code FROM properties
          WHERE project_id = ? ORDER BY sort_order LIMIT 3`,
        [projectId]
      )
    ).rows;

    const sampleCustomers = [
      { name: 'Vũ Thị Giang', phone: '0901234567' },
      { name: 'Nguyễn Văn An', phone: '0902345678' },
      { name: 'Trần Thị Bình', phone: '0903456789' },
      { name: 'Lê Hoàng Cường', phone: '0904567890' },
    ];
    const custIds = [];
    for (const cu of sampleCustomers) {
      const cr = await c.query(
        'INSERT INTO customers (full_name, phone) VALUES (?,?)',
        [cu.name, cu.phone]
      );
      custIds.push(cr.insertId);
    }

    const leadIds = [];
    const leadTimes = [15, 130, 320];
    for (let i = 0; i < 3; i++) {
      const lr = await c.query(
        `INSERT INTO leads
           (project_id, customer_id, source_id, assigned_user_id,
            interested_property_type_id, status_code, pipeline_stage,
            created_from, created_at)
         VALUES (?,?,?,?,?,'new','lead','web_form',?)`,
        [projectId, custIds[i], sourceId, firstSales, typeId, ago(leadTimes[i])]
      );
      leadIds.push(lr.insertId);
    }

    const apptTimes = [2, 45];
    for (let i = 0; i < 2; i++) {
      await c.query(
        `INSERT INTO appointments
           (project_id, lead_id, customer_id, assigned_user_id,
            appointment_type, start_at, status_code, created_at)
         VALUES (?,?,?,?,'site_visit',?,'pending',?)`,
        [projectId, leadIds[i], custIds[i], firstSales, ago(-1440), ago(apptTimes[i])]
      );
    }

    if (someProps[0]) {
      await c.query(
        `INSERT INTO property_reservations
           (project_id, property_id, lead_id, customer_id, sales_user_id,
            reservation_type, status_code, created_at)
         VALUES (?,?,?,?,?,'hold','holding',?)`,
        [projectId, someProps[0].id, leadIds[0], custIds[0], firstSales, ago(8)]
      );
    }

    if (someProps[1]) {
      await c.query(
        `INSERT INTO property_status_history
           (property_id, old_status_code, new_status_code, changed_by_user_id, changed_at)
         VALUES (?,'available','reserved',?,?)`,
        [someProps[1].id, firstSales, ago(180)]
      );
    }

    await c.query('COMMIT');
    console.log(`✓ Seed xong. project_id = ${projectId}`);
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('✗ Seed lỗi:', err.message);
    process.exitCode = 1;
  } finally {
    c.release();
    await pool.end();
  }
}

main();
