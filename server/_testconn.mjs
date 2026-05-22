import { query } from './src/db.js';

try {
  const r = await query('SELECT VERSION() AS v, DATABASE() AS db');
  console.log('KET NOI OK!');
  console.log('  MySQL:', r.rows[0].v);
  console.log('  Database:', r.rows[0].db);
  const t = await query(
    'SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema=DATABASE()'
  );
  console.log('  So bang trong DB:', t.rows[0].n);
  process.exit(0);
} catch (e) {
  console.log('LOI KET NOI:', e.code || '', '-', e.message);
  process.exit(1);
}
