// Kết nối MySQL dùng chung cho seed + API.
// Bọc mysql2 để giữ API quen thuộc: query() trả { rows }, pool.connect()
// trả client có .query()/.release() — nhờ vậy code gọi gần như không đổi.
import 'dotenv/config'; // nạp file .env -> process.env (mọi file import db.js đều có)
import mysql from 'mysql2/promise';

// Cho phép cấu hình qua DATABASE_URL (mysql://user:pass@host:port/db)
// hoặc các biến rời. Mặc định khớp container MySQL phát triển cục bộ.
const url = process.env.DATABASE_URL;

const baseConfig = url
  ? url
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root123',
      database: process.env.DB_NAME || 'haivanbay',
    };

// Pool mysql2. namedPlaceholders tắt — ta dùng '?' theo thứ tự.
const mysqlPool = mysql.createPool(
  typeof baseConfig === 'string'
    ? baseConfig
    : {
        ...baseConfig,
        waitForConnections: true,
        connectionLimit: 10,
        charset: 'utf8mb4',
        // Trả DECIMAL/BIGINT về dạng số/chuỗi nhất quán với code cũ:
        // - decimalNumbers: DECIMAL -> Number (code dùng Number(...) nên an toàn)
        dateStrings: false,
        decimalNumbers: true,
      }
);

// Chuẩn hoá kết quả mysql2 -> { rows, rowCount } giống pg.
function wrap(result) {
  // SELECT: result[0] là mảng rows. INSERT/UPDATE/DELETE: result[0] là OkPacket.
  const payload = Array.isArray(result) ? result[0] : result;
  if (Array.isArray(payload)) {
    return { rows: payload, rowCount: payload.length };
  }
  // OkPacket: { affectedRows, insertId, ... }
  return {
    rows: [],
    rowCount: payload?.affectedRows ?? 0,
    insertId: payload?.insertId,
    affectedRows: payload?.affectedRows,
  };
}

// query(sql, params) -> { rows } . Dùng cho thao tác không cần transaction.
export async function query(text, params) {
  const result = await mysqlPool.query(text, params);
  return wrap(result);
}

// pool.connect() -> client có .query()/.release(), giữ nguyên 1 kết nối
// để chạy transaction (BEGIN/COMMIT/ROLLBACK) như pg.PoolClient.
export const pool = {
  async connect() {
    const conn = await mysqlPool.getConnection();
    return {
      async query(text, params) {
        const result = await conn.query(text, params);
        return wrap(result);
      },
      release() {
        conn.release();
      },
    };
  },
  // Đóng toàn bộ pool (dùng cuối các script seed).
  async end() {
    await mysqlPool.end();
  },
};
