// API Express — đọc dữ liệu từ MySQL, trả JSON đúng format project.json.
// Chạy:  npm start   ->  http://localhost:3000/api/project
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query, pool } from './db.js';
import { importProjectJson, importSubdivision } from './import-project.js';
import { login, logout, requireAuth } from './auth.js';
import {
  listUsers, createUser, updateUser, deleteUser,
  findSaleBySlug, pickNextSale,
} from './users.js';
import { createPresignedPut, r2Enabled } from './r2.js';
import multer from 'multer';
import fs from 'node:fs';

const app = express();
app.use(cors());
// project.json có thể vài trăm KB — nâng giới hạn body cho PUT /api/project.
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;
const PROJECT_CODE = 'haivanbay';

// Ghép toàn bộ dữ liệu 1 dự án thành object giống hệt project.json.
async function buildProjectJson() {
  const projRows = await query('SELECT * FROM projects WHERE code = ?', [PROJECT_CODE]);
  if (!projRows.rows.length) throw new Error('Chưa có dữ liệu — hãy chạy npm run seed');
  const p = projRows.rows[0];
  const pid = p.id;

  // --- project.stats / cardOverview (mục amenities đã gỡ bỏ) ---
  const stats = (
    await query(
      `SELECT label, unit_label, value_text FROM project_statistics
       WHERE project_id=? AND sort_order < 100 ORDER BY sort_order`,
      [pid]
    )
  ).rows.map((r) => ({ value: r.value_text, unit: r.unit_label, label: r.label }));

  const overviewRow = (
    await query('SELECT description FROM project_card_overviews WHERE project_id=?', [pid])
  ).rows[0];
  const highlights = (
    await query(
      `SELECT icon_code, label, value_text FROM project_card_highlights
       WHERE project_id=? ORDER BY sort_order`,
      [pid]
    )
  ).rows.map((r) => ({ icon: r.icon_code, label: r.label, value: r.value_text }));
  const quickLinks = (
    await query(
      `SELECT action_code, icon_code, label FROM project_card_quick_links
       WHERE project_id=? ORDER BY sort_order`,
      [pid]
    )
  ).rows.map((r) => ({ id: r.action_code, icon: r.icon_code, label: r.label }));

  const project = {
    name: p.name,
    tagline: p.tagline,
    location: p.location_text,
    developer: p.developer_name,
    status: p.sales_status,
    handover: p.handover_text,
    priceFrom: p.price_from_text,
    priceUnit: p.price_unit_text,
    areaRange: p.area_range_text,
    totalUnits: p.total_units,
    totalTowers: p.total_towers,
    floors: p.floors_text,
    density: p.density_pct != null ? `${Number(p.density_pct)}%` : null,
    greenSpace: p.green_space_text,
    unitsLeft: p.units_left,
    totalUnitsForSale: p.total_units_for_sale,
    promoDeadline: (() => {
      if (!p.promo_deadline_at) return null;
      const d = new Date(p.promo_deadline_at);
      return Number.isNaN(d.getTime())
        ? null
        : d.toISOString().replace('.000Z', '');
    })(),
    stats,
    cardOverview: {
      description: overviewRow?.description || '',
      highlights,
      quickLinks,
    },
  };

  // --- sales ---
  // social_links_json (zalo/facebook/...) là cột tùy chọn, có thể chưa được
  // tạo trên DB cũ → bọc try/catch và fallback cột rỗng.
  let salesRows;
  try {
    salesRows = (
      await query(
        `SELECT u.username, u.full_name, u.title, u.phone, u.email, u.avatar_url,
                u.social_links_json, m.public_slug
         FROM users u
         JOIN project_memberships m ON m.user_id = u.id
         JOIN roles r ON r.id = m.role_id
         WHERE m.project_id=? AND r.code='sales' AND m.is_active=TRUE
         ORDER BY u.username`,
        [pid]
      )
    ).rows;
  } catch {
    salesRows = (
      await query(
        `SELECT u.username, u.full_name, u.title, u.phone, u.email, u.avatar_url,
                m.public_slug
         FROM users u
         JOIN project_memberships m ON m.user_id = u.id
         JOIN roles r ON r.id = m.role_id
         WHERE m.project_id=? AND r.code='sales' AND m.is_active=TRUE
         ORDER BY u.username`,
        [pid]
      )
    ).rows;
  }
  const sales = salesRows.map((r) => {
    const social = r.social_links_json || {};
    return {
      username: r.username,
      slug: r.public_slug || r.username,
      name: r.full_name,
      title: r.title,
      phone: r.phone,
      email: r.email || '',
      avatar: r.avatar_url || '',
      zalo:      social.zalo      || (r.phone || '').replace(/\s/g, ''),
      facebook:  social.facebook  || '',
      tiktok:    social.tiktok    || '',
      instagram: social.instagram || '',
      youtube:   social.youtube   || '',
      linkedin:  social.linkedin  || '',
      telegram:  social.telegram  || '',
    };
  });

  // --- menu ---
  // Dựng 1 menu_item đầy đủ: detail/subdivision + children (4 nhóm con của
  // phân khu, lấy từ menu_groups có parent_menu_item_id = it.id).
  async function buildMenuItem(it) {
      const entry = { id: it.item_code, label: it.label };
      if (it.hotspot_code) entry.tdvPanoramaId = it.hotspot_code;

      const detail = (
        await query('SELECT * FROM menu_item_details WHERE menu_item_id=?', [it.id])
      ).rows[0];
      if (detail) {
        const images = (
          await query(
            'SELECT image_url FROM menu_item_detail_images WHERE menu_item_id=? ORDER BY sort_order',
            [it.id]
          )
        ).rows.map((r) => r.image_url);
        const specs = (
          await query(
            'SELECT label, value_text FROM menu_item_detail_specs WHERE menu_item_id=? ORDER BY sort_order',
            [it.id]
          )
        ).rows.map((r) => ({ label: r.label, value: r.value_text }));
        entry.detail = {
          category: detail.category,
          subtitle: detail.subtitle,
          title: detail.title,
          images,
          description: detail.description,
          specs,
        };
      }

      const sd = (
        await query('SELECT * FROM menu_item_subdivisions WHERE menu_item_id=?', [it.id])
      ).rows[0];
      if (sd) {
        const facts = (
          await query(
            'SELECT label, value_text FROM menu_item_subdivision_facts WHERE menu_item_id=? ORDER BY sort_order',
            [it.id]
          )
        ).rows.map((r) => ({ label: r.label, value: r.value_text }));
        const points = (
          await query(
            'SELECT point_text FROM menu_item_subdivision_points WHERE menu_item_id=? ORDER BY sort_order',
            [it.id]
          )
        ).rows.map((r) => r.point_text);
        entry.subdivision = {
          name: sd.name,
          video: sd.video_url || '',
          cover: sd.cover_url || '',
          desc: sd.description,
          facts,
          points,
        };
      }

    // children: nhóm con của phân khu (menu_groups.parent_menu_item_id = it.id)
    const childGroups = (
      await query(
        'SELECT id, code FROM menu_groups WHERE parent_menu_item_id=? ORDER BY sort_order',
        [it.id]
      )
    ).rows;
    if (childGroups.length) {
      entry.children = {};
      for (const cg of childGroups) {
        const childItems = (
          await query(
            'SELECT id, item_code, label, hotspot_code FROM menu_items WHERE menu_group_id=? ORDER BY sort_order',
            [cg.id]
          )
        ).rows;
        entry.children[cg.code] = [];
        for (const ci of childItems) {
          entry.children[cg.code].push(await buildMenuItem(ci));
        }
      }
    }
    return entry;
  }

  // Nhóm gốc: parent_menu_item_id IS NULL (Tổng quan, Phân khu)
  const groups = (
    await query(
      'SELECT id, code FROM menu_groups WHERE project_id=? AND parent_menu_item_id IS NULL ORDER BY sort_order',
      [pid]
    )
  ).rows;
  const menu = {};
  for (const g of groups) {
    const items = (
      await query(
        'SELECT id, item_code, label, hotspot_code FROM menu_items WHERE menu_group_id=? ORDER BY sort_order',
        [g.id]
      )
    ).rows;
    menu[g.code] = [];
    for (const it of items) {
      menu[g.code].push(await buildMenuItem(it));
    }
  }

  // --- siteMap ---
  const settings = (
    await query('SELECT feature_flags_json FROM project_settings WHERE project_id=?', [pid])
  ).rows[0];
  const siteMapMeta = settings?.feature_flags_json?.siteMap || {};
  const smRow = (
    await query('SELECT id FROM site_maps WHERE project_id=? ORDER BY sort_order LIMIT 1', [pid])
  ).rows[0];
  let siteMap = { center: siteMapMeta.center, zoom: siteMapMeta.zoom, points: [] };
  if (smRow) {
    siteMap.points = (
      await query(
        'SELECT point_code, label, metadata FROM site_map_points WHERE site_map_id=? ORDER BY sort_order',
        [smRow.id]
      )
    ).rows.map((r) => ({
      id: r.point_code,
      lat: r.metadata?.lat,
      lng: r.metadata?.lng,
      label: r.label,
      tdvPanoramaId: r.metadata?.tdvPanoramaId,
    }));
  }

  // --- gallery (kèm subdivision_code) ---
  const gallery = (
    await query(
      `SELECT gi.media_type, gi.source_provider, gi.title, gi.source_url,
              gi.poster_url, gi.metadata, gi.subdivision_code, gf.folder_name
       FROM gallery_items gi
       LEFT JOIN gallery_folders gf ON gf.id = gi.gallery_folder_id
       WHERE gi.project_id=? ORDER BY gi.sort_order`,
      [pid]
    )
  ).rows.map((r) => {
    const item = {
      type: r.media_type,
      title: r.title,
      folder: r.folder_name,
      src: r.source_url,
      subdivision: r.subdivision_code || null,
    };
    if (r.media_type === 'video') {
      item.videoSource = r.source_provider;
      item.poster = r.poster_url || '';
    } else {
      item.thumb = r.metadata?.thumb || r.poster_url || '';
    }
    return item;
  });

  // --- legal (gom theo subdivision_code -> {__all, <pk>}) ---
  // skey: subdivision_code NULL -> '__all'
  const skey = (v) => v || '__all';
  const legalStatRows = (
    await query(
      `SELECT subdivision_code, label, unit_label, value_text FROM project_statistics
       WHERE project_id=? AND sort_order >= 100 ORDER BY sort_order`,
      [pid]
    )
  ).rows;
  const legalDocRows = (
    await query(
      `SELECT subdivision_code, document_name, detail_text, is_completed FROM legal_documents
       WHERE project_id=? ORDER BY sort_order`,
      [pid]
    )
  ).rows;
  const legalTestiRows = (
    await query(
      `SELECT subdivision_code, initials, customer_role, unit_label, testimonial_text
       FROM project_testimonials WHERE project_id=? ORDER BY sort_order`,
      [pid]
    )
  ).rows;
  const legal = {};
  const legalSlot = (k) =>
    (legal[k] ||= { developerStats: [], documents: [], testimonials: [] });
  legalSlot('__all'); // luôn có __all
  for (const r of legalStatRows)
    legalSlot(skey(r.subdivision_code)).developerStats.push({
      value: r.value_text, unit: r.unit_label, label: r.label,
    });
  for (const r of legalDocRows)
    legalSlot(skey(r.subdivision_code)).documents.push({
      name: r.document_name, detail: r.detail_text, done: r.is_completed,
    });
  for (const r of legalTestiRows)
    legalSlot(skey(r.subdivision_code)).testimonials.push({
      initials: r.initials, role: r.customer_role, unit: r.unit_label, text: r.testimonial_text,
    });

  // --- location (gom theo subdivision_code -> {__all, <pk>}) ---
  const locRows = (
    await query('SELECT * FROM project_locations WHERE project_id=?', [pid])
  ).rows;
  const location = {};
  for (const locRow of locRows) {
    const nearby = (
      await query(
        `SELECT category_code, name, distance_text, travel_time_text
         FROM nearby_places WHERE project_location_id=? ORDER BY sort_order`,
        [locRow.id]
      )
    ).rows.map((r) => ({
      cat: r.category_code,
      name: r.name,
      dist: r.distance_text,
      time: r.travel_time_text,
    }));
    location[skey(locRow.subdivision_code)] = {
      lat: locRow.latitude != null ? Number(locRow.latitude) : null,
      lng: locRow.longitude != null ? Number(locRow.longitude) : null,
      mapSrc: locRow.map_embed_url,
      nearby,
    };
  }
  if (!location.__all) location.__all = { lat: null, lng: null, mapSrc: '', nearby: [] };

  // --- resources (gom theo subdivision_code -> {__all, <pk>}) ---
  const resources = {};
  for (const r of (
    await query(
      `SELECT subdivision_code, resource_key, title, resource_type, resource_url
       FROM project_resources WHERE project_id=? ORDER BY sort_order`,
      [pid]
    )
  ).rows) {
    const slot = (resources[skey(r.subdivision_code)] ||= {});
    slot[r.resource_key] = {
      url: r.resource_url,
      title: r.title,
      type: r.resource_type,
    };
  }
  if (!resources.__all) resources.__all = {};

  // --- keyVisuals ---
  const kvGroups = (
    await query(
      'SELECT id, code FROM key_visual_groups WHERE project_id=? ORDER BY sort_order',
      [pid]
    )
  ).rows;
  const keyVisuals = {};
  for (const g of kvGroups) {
    keyVisuals[g.code] = (
      await query(
        `SELECT title, resource_type, resource_url FROM key_visual_items
         WHERE key_visual_group_id=? ORDER BY sort_order`,
        [g.id]
      )
    ).rows.map((r) => ({ title: r.title, url: r.resource_url, type: r.resource_type }));
  }

  // --- timeline (gom theo subdivision_code -> {__all:[...], <pk>:[...]}) ---
  const timeline = {};
  for (const r of (
    await query(
      `SELECT subdivision_code, phase_name, milestone_date_text, status_code, description
       FROM construction_milestones WHERE project_id=? ORDER BY sort_order`,
      [pid]
    )
  ).rows) {
    // Bỏ qua row không gắn phân khu — không còn dùng "timeline chung".
    if (!r.subdivision_code) continue;
    (timeline[skey(r.subdivision_code)] ||= []).push({
      phase: r.phase_name,
      date: r.milestone_date_text,
      status: r.status_code,
      desc: r.description,
    });
  }

  // --- masterplan ---
  const mpRow = (
    await query('SELECT * FROM masterplans WHERE project_id=?', [pid])
  ).rows[0];
  let masterplan = {};
  if (mpRow) {
    const categories = (
      await query(
        `SELECT code, label, icon_code FROM masterplan_categories
         WHERE masterplan_id=? ORDER BY sort_order`,
        [mpRow.id]
      )
    ).rows.map((r) => ({ id: r.code, label: r.label, icon: r.icon_code }));
    const markers = (
      await query(
        `SELECT marker_code, category_code, label, description, x_pct, y_pct
         FROM masterplan_markers WHERE masterplan_id=? ORDER BY sort_order`,
        [mpRow.id]
      )
    ).rows.map((r) => {
      const m = {
        id: r.marker_code,
        cat: r.category_code,
        label: r.label,
        desc: r.description,
        x: Number(r.x_pct),
        y: Number(r.y_pct),
      };
      // menuItemId: marker phân khu trỏ tới menu_item cùng code
      if (r.category_code === 'phankhu') m.menuItemId = r.marker_code.replace(/^m-/, 'pk-');
      return m;
    });
    const fgRows = (
      await query(
        'SELECT id, code FROM masterplan_filter_groups WHERE masterplan_id=? ORDER BY sort_order',
        [mpRow.id]
      )
    ).rows;
    const filterSchema = {};
    for (const fg of fgRows) {
      filterSchema[fg.code] = (
        await query(
          `SELECT option_code, label, color_hex FROM masterplan_filter_options
           WHERE filter_group_id=? ORDER BY sort_order`,
          [fg.id]
        )
      ).rows.map((r) => {
        const o = { id: r.option_code, label: r.label };
        if (r.color_hex) o.color = r.color_hex;
        return o;
      });
    }
    masterplan = {
      image: mpRow.image_url,
      intro: mpRow.intro_text,
      categories,
      markers,
      filterSchema,
    };
  }

  // --- properties ---
  const propRows = (
    await query('SELECT * FROM properties WHERE project_id=? ORDER BY sort_order', [pid])
  ).rows;
  // Nạp toàn bộ bản dịch property 1 lần để gắn vào từng item.
  const propTransRows = (await query(
    `SELECT et.entity_id, et.field_name, l.code AS lang_code, et.text_value
       FROM entity_translations et
       JOIN languages l ON l.id = et.language_id
      WHERE et.entity_type='property'`
  )).rows;
  const propTransByItem = {}; // { propertyCode: { field: { lang: text } } }
  for (const r of propTransRows) {
    const code = r.entity_id; // entity_id = property_code
    ((propTransByItem[code] ||= {})[r.field_name] ||= {})[r.lang_code] = r.text_value;
  }
  const properties = [];
  for (const pr of propRows) {
    const meta = pr.metadata || {};
    const images = (
      await query(
        'SELECT image_url FROM property_images WHERE property_id=? ORDER BY sort_order',
        [pr.id]
      )
    ).rows.map((r) => r.image_url);
    const thumbsFloor = (
      await query(
        'SELECT image_url FROM property_floor_plans WHERE property_id=? ORDER BY sort_order',
        [pr.id]
      )
    ).rows.map((r) => r.image_url);
    const policies = (
      await query(
        'SELECT policy_text FROM property_policies WHERE property_id=? ORDER BY sort_order',
        [pr.id]
      )
    ).rows.map((r) => r.policy_text);
    const docs = (
      await query(
        'SELECT document_name, document_type FROM property_documents WHERE property_id=? ORDER BY sort_order',
        [pr.id]
      )
    ).rows.map((r) => ({ name: r.document_name, type: r.document_type }));
    const progress = (
      await query(
        'SELECT phase_name, phase_date_text, is_done FROM property_milestones WHERE property_id=? ORDER BY sort_order',
        [pr.id]
      )
    ).rows.map((r) => ({ phase: r.phase_name, date: r.phase_date_text, done: r.is_done }));
    const propHighlights = (
      await query(
        'SELECT highlight_text FROM property_highlights WHERE property_id=? ORDER BY sort_order',
        [pr.id]
      )
    ).rows.map((r) => r.highlight_text);

    properties.push({
      images,
      thumbsFloor: thumbsFloor.length ? thumbsFloor : meta.thumbsFloor || [],
      policies,
      docs,
      progress,
      consultPhone: meta.consultPhone || '',
      consultEmail: meta.consultEmail || '',
      id: meta.slug || pr.property_code,
      code: pr.property_code,
      name: pr.name,
      phanKhu: pr.subdivision_code,
      phanKhuLabel: pr.subdivision_label,
      type: pr.type_code,
      typeLabel: pr.type_label,
      priceVal: meta.priceVal ?? (pr.price_vnd != null ? Number(pr.price_vnd) / 1e9 : null),
      price: pr.price_display,
      pricePerM2: pr.price_per_sqm_display,
      area: pr.area_sqm != null ? Number(pr.area_sqm) : null,
      bedrooms: pr.bedroom_count,
      bathrooms: pr.bathroom_count,
      direction: pr.facing_direction,
      status: pr.status_code,
      statusLabel: pr.status_label,
      legal: pr.legal_text,
      handover: pr.handover_text,
      desc: pr.description,
      highlights: propHighlights,
      translations: propTransByItem[pr.property_code] || {},
    });
  }

  return {
    project,
    sales,
    menu,
    siteMap,
    gallery,
    floorplan: {},
    legal,
    location,
    resources,
    keyVisuals,
    timeline,
    masterplan,
    properties,
  };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, r2: r2Enabled }));

// =====================================================================
// Upload — cấp presigned PUT URL để frontend upload trực tiếp lên R2
// Body: { filename, contentType, folder? }
// =====================================================================
// =====================================================================
// Upload local — lưu file vào thư mục uploads/ trên server, trả URL công khai.
// Giới hạn dung lượng đọc từ project_settings.feature_flags_json.upload.maxMb
// (mặc định 100MB nếu chưa cấu hình). Cho phép mọi loại file.
// =====================================================================
const SITE_ROOT_EARLY = path.resolve(fileURLToPath(import.meta.url), '../../..');
const UPLOADS_DIR = path.join(SITE_ROOT_EARLY, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

async function getUploadMaxBytes() {
  try {
    const pid = await getProjectId();
    const r = await query(
      'SELECT feature_flags_json FROM project_settings WHERE project_id=?',
      [pid]
    );
    const raw = r.rows[0]?.feature_flags_json;
    const flags = typeof raw === 'string' ? (JSON.parse(raw) || {}) : (raw || {});
    const mb = flags.upload?.maxMb;
    if (mb && Number(mb) > 0) return Number(mb) * 1024 * 1024;
  } catch {}
  return 100 * 1024 * 1024; // default 100MB
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    // giữ extension, đổi tên gốc để tránh trùng + ký tự lạ
    const safeBase = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 40) || 'file';
    cb(null, `${ts}-${rand}-${safeBase}${path.extname(file.originalname)}`);
  },
});

// Multer cần limits sync → đọc cài đặt trong middleware riêng và bơm vào.
app.post('/api/upload/local', async (req, res) => {
  let maxBytes;
  try { maxBytes = await getUploadMaxBytes(); }
  catch { maxBytes = 100 * 1024 * 1024; }
  const upload = multer({ storage: uploadStorage, limits: { fileSize: maxBytes } }).single('file');
  upload(req, res, (err) => {
    if (err) {
      const code = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(code).json({ error: err.message, maxBytes });
    }
    if (!req.file) return res.status(400).json({ error: 'Không có file' });
    const url = `/uploads/${req.file.filename}`;
    res.json({
      url,
      name: req.file.originalname,
      size: req.file.size,
      mime: req.file.mimetype,
    });
  });
});

// =====================================================================
// Cài đặt upload — đọc/ghi maxMb vào project_settings.feature_flags_json.upload
// =====================================================================
// MySQL driver có lúc trả JSON column dạng string (tuỳ driver/version) — chuẩn hoá về object.
function parseFlags(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) || {}; } catch { return {}; }
  }
  return raw;
}

app.get('/api/settings/upload', async (_req, res) => {
  try {
    const pid = await getProjectId();
    const r = await query(
      'SELECT feature_flags_json FROM project_settings WHERE project_id=?',
      [pid]
    );
    const flags = parseFlags(r.rows[0]?.feature_flags_json);
    const cfg = flags.upload || {};
    res.json({
      maxMb:      Number(cfg.maxMb)      || 100,
      imageMaxMb: Number(cfg.imageMaxMb) || 10,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings/upload', async (req, res) => {
  try {
    const pid = await getProjectId();
    const maxMb      = Math.max(1, Math.min(10240, Number(req.body?.maxMb)      || 100));
    const imageMaxMb = Math.max(1, Math.min(1024,  Number(req.body?.imageMaxMb) || 10));
    const r = await query(
      'SELECT feature_flags_json FROM project_settings WHERE project_id=?',
      [pid]
    );
    const flags = parseFlags(r.rows[0]?.feature_flags_json);
    flags.upload = { ...(flags.upload || {}), maxMb, imageMaxMb };
    await query(
      `INSERT INTO project_settings (project_id, feature_flags_json)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE feature_flags_json = VALUES(feature_flags_json)`,
      [pid, JSON.stringify(flags)]
    );
    res.json({ ok: true, maxMb, imageMaxMb });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload/presign', async (req, res) => {
  try {
    if (!r2Enabled) {
      return res.status(503).json({ error: 'R2 chưa được cấu hình trên server (.env)' });
    }
    const { filename, contentType, folder } = req.body || {};
    if (!contentType) return res.status(400).json({ error: 'Thiếu contentType' });
    const out = await createPresignedPut({ filename, contentType, folder });
    res.json(out);
  } catch (err) {
    console.error('[upload/presign]', err);
    res.status(400).json({ error: err.message });
  }
});

// =====================================================================
// Auth — đăng nhập / đăng xuất / phiên hiện tại
// =====================================================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Thiếu tên đăng nhập hoặc mật khẩu' });
    }
    const result = await login(username, password, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    if (!result) return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', requireAuth(), async (req, res) => {
  try {
    const h = req.headers.authorization || '';
    await logout(h.startsWith('Bearer ') ? h.slice(7) : null);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', requireAuth(), (req, res) => res.json({ user: req.user }));

// =====================================================================
// Sale tự sửa profile của chính mình. Mạng xã hội & các trường mở rộng
// lưu trong users.social_links_json (cột JSON nullable).
// =====================================================================
const SOCIAL_KEYS = ['zalo', 'facebook', 'tiktok', 'instagram', 'youtube', 'linkedin', 'telegram'];

async function ensureUsersSocialColumn() {
  // MySQL 8 không có ADD COLUMN IF NOT EXISTS; check INFORMATION_SCHEMA trước.
  const r = await query(
    `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users' AND COLUMN_NAME = 'social_links_json'`
  );
  if (!r.rows.length) {
    await query('ALTER TABLE users ADD COLUMN social_links_json JSON NULL');
    console.log('  ✓ Thêm cột users.social_links_json');
  }
}

app.get('/api/sale/profile', requireAuth(), async (req, res) => {
  try {
    const r = await query(
      `SELECT username, full_name, title, phone, email, avatar_url, social_links_json
         FROM users WHERE id=?`,
      [req.user.id]
    );
    const u = r.rows[0];
    if (!u) return res.status(404).json({ error: 'Không tìm thấy user' });
    const social = u.social_links_json || {};
    res.json({
      username: u.username,
      name: u.full_name || '',
      title: u.title || '',
      phone: u.phone || '',
      email: u.email || '',
      avatar: u.avatar_url || '',
      zalo:      social.zalo      || '',
      facebook:  social.facebook  || '',
      tiktok:    social.tiktok    || '',
      instagram: social.instagram || '',
      youtube:   social.youtube   || '',
      linkedin:  social.linkedin  || '',
      telegram:  social.telegram  || '',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/sale/profile', requireAuth(), async (req, res) => {
  try {
    const b = req.body || {};
    const social = {};
    for (const k of SOCIAL_KEYS) {
      const v = (b[k] || '').toString().trim();
      if (v) social[k] = v;
    }
    await query(
      `UPDATE users SET
         full_name = ?, title = ?, phone = ?, email = ?, avatar_url = ?,
         social_links_json = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        (b.name  || '').trim() || null,
        (b.title || '').trim() || null,
        (b.phone || '').trim() || null,
        (b.email || '').trim() || null,
        (b.avatar|| '').trim() || null,
        Object.keys(social).length ? JSON.stringify(social) : null,
        req.user.id,
      ]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================================
// Quản lý người dùng — developer + owner cấp tài khoản, đặt mật khẩu
// =====================================================================
app.get('/api/users', requireAuth('developer', 'owner'), async (_req, res) => {
  try {
    const pid = await getProjectId();
    res.json(await listUsers(pid));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', requireAuth('developer', 'owner'), async (req, res) => {
  try {
    const pid = await getProjectId();
    // owner không được tạo tài khoản developer.
    if (req.user.role === 'owner' && (req.body.role || '').toLowerCase() === 'developer') {
      return res.status(403).json({ error: 'Owner không thể tạo tài khoản Developer' });
    }
    const id = await createUser(pid, req.body || {});
    res.json({ ok: true, id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:id', requireAuth('developer', 'owner'), async (req, res) => {
  try {
    const pid = await getProjectId();
    if (req.user.role === 'owner' && (req.body.role || '').toLowerCase() === 'developer') {
      return res.status(403).json({ error: 'Owner không thể gán quyền Developer' });
    }
    await updateUser(pid, parseInt(req.params.id, 10), req.body || {});
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/users/:id', requireAuth('developer', 'owner'), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Không thể xoá chính tài khoản đang đăng nhập' });
    }
    await deleteUser(id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Theme: đọc / ghi màu giao diện (bảng project_themes) ------------
async function getProjectId() {
  const r = await query('SELECT id FROM projects WHERE code=?', [PROJECT_CODE]);
  if (!r.rows.length) throw new Error('Chưa có dự án — hãy chạy npm run seed');
  return r.rows[0].id;
}

app.get('/api/theme', async (_req, res) => {
  try {
    const pid = await getProjectId();
    const r = await query(
      'SELECT custom_tokens_json, effects_json FROM project_themes WHERE project_id=?',
      [pid]
    );
    res.json({
      colors: r.rows[0]?.custom_tokens_json || null,
      effects: r.rows[0]?.effects_json || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/theme', async (req, res) => {
  try {
    const pid = await getProjectId();
    const { colors, effects, preset } = req.body || {};
    if (!colors || typeof colors !== 'object') {
      return res.status(400).json({ error: 'Thiếu "colors"' });
    }
    // UPSERT — mỗi dự án 1 dòng theme (project_id là khóa chính).
    await query(
      `INSERT INTO project_themes (project_id, custom_tokens_json, effects_json)
       VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE
         custom_tokens_json = VALUES(custom_tokens_json),
         effects_json       = VALUES(effects_json),
         updated_at         = NOW()`,
      [pid, JSON.stringify({ colors, preset: preset || null }), effects ? JSON.stringify(effects) : null]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- i18n: trả toàn bộ chuỗi dịch theo ngôn ngữ -----------------------
// Format khớp với js/i18n.js:
//   { langs: [{code,name,is_default}], dict: { vi:{key:txt}, en:{...} },
//     dynamic: { "<chuỗi vi>": { en:"...", zh:"..." } } }
app.get('/api/i18n', async (_req, res) => {
  try {
    const pid = await getProjectId();
    const langs = (
      await query(
        'SELECT code, name, is_default FROM languages WHERE is_active=1 ORDER BY is_default DESC, code'
      )
    ).rows;

    const rows = (
      await query(
        `SELECT tk.namespace_code, tk.key_code, l.code AS lang_code, pt.translated_text
           FROM project_translations pt
           JOIN translation_keys tk ON tk.id = pt.translation_key_id
           JOIN languages l ON l.id = pt.language_id
          WHERE pt.project_id = ?`,
        [pid]
      )
    ).rows;

    const dict = {};
    const dynamic = {};
    for (const r of rows) {
      if (r.namespace_code === 'ui') {
        (dict[r.lang_code] ||= {})[r.key_code] = r.translated_text;
      } else if (r.namespace_code === 'dynamic') {
        // bỏ qua bản 'vi' của dynamic — frontend dùng chính chuỗi gốc làm fallback
        if (r.lang_code === 'vi') continue;
        (dynamic[r.key_code] ||= {})[r.lang_code] = r.translated_text;
      }
    }

    res.json({ langs, dict, dynamic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- i18n cho trang admin: dạng bảng (mỗi key kèm mọi bản dịch) -------
// Trả { langs:[{code,name,is_default}], rows:[{namespace,key,default_text,
//       translations:{vi,en,...}}] }
app.get('/api/i18n/admin', async (_req, res) => {
  try {
    const pid = await getProjectId();
    const langs = (
      await query(
        'SELECT code, name, is_default FROM languages WHERE is_active=1 ORDER BY is_default DESC, code'
      )
    ).rows;

    const rows = (
      await query(
        `SELECT tk.id, tk.namespace_code, tk.key_code, tk.default_text,
                l.code AS lang_code, pt.translated_text
           FROM translation_keys tk
           LEFT JOIN project_translations pt
             ON pt.translation_key_id = tk.id AND pt.project_id = ?
           LEFT JOIN languages l ON l.id = pt.language_id
          ORDER BY tk.namespace_code, tk.key_code`,
        [pid]
      )
    ).rows;

    // Gom theo key_id
    const byKey = new Map();
    for (const r of rows) {
      let entry = byKey.get(r.id);
      if (!entry) {
        entry = {
          namespace: r.namespace_code,
          key: r.key_code,
          default_text: r.default_text,
          translations: {},
        };
        byKey.set(r.id, entry);
      }
      if (r.lang_code) entry.translations[r.lang_code] = r.translated_text;
    }
    res.json({ langs, rows: [...byKey.values()] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Lưu/sửa 1 bản dịch (admin) --------------------------------------
// Body: { namespace, key, lang, text }
app.put('/api/i18n/entry', async (req, res) => {
  try {
    const { namespace, key, lang, text } = req.body || {};
    if (!namespace || !key || !lang) {
      return res.status(400).json({ error: 'Thiếu namespace/key/lang' });
    }
    const pid = await getProjectId();
    const lr = await query('SELECT id FROM languages WHERE code=?', [lang]);
    if (!lr.rows.length) return res.status(404).json({ error: 'Ngôn ngữ không tồn tại' });
    const langId = lr.rows[0].id;

    // translation_keys: tạo nếu chưa có (UPSERT no-op để chắc chắn tồn tại,
    // rồi SELECT lấy id — MySQL không có RETURNING).
    await query(
      `INSERT INTO translation_keys (namespace_code, key_code, default_text)
       VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE key_code = VALUES(key_code)`,
      [namespace, key, namespace === 'dynamic' ? key : (text || key)]
    );
    const keyId = (
      await query(
        'SELECT id FROM translation_keys WHERE namespace_code=? AND key_code=?',
        [namespace, key]
      )
    ).rows[0].id;

    await query(
      `INSERT INTO project_translations
         (project_id, language_id, translation_key_id, translated_text)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE
         translated_text = VALUES(translated_text), updated_at = NOW()`,
      [pid, langId, keyId, text || '']
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Thêm ngôn ngữ mới (admin) ---------------------------------------
// Body: { code, name }
app.post('/api/i18n/language', async (req, res) => {
  try {
    const { code, name } = req.body || {};
    if (!code) return res.status(400).json({ error: 'Thiếu mã ngôn ngữ' });
    await query(
      `INSERT INTO languages (code, name, is_default, is_active)
       VALUES (?,?,0,1)
       ON DUPLICATE KEY UPDATE is_active = 1, name = VALUES(name)`,
      [code.toLowerCase(), name || code]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Xoá ngôn ngữ (admin) — không cho xoá ngôn ngữ mặc định ----------
app.delete('/api/i18n/language/:code', async (req, res) => {
  try {
    const code = (req.params.code || '').toLowerCase();
    const lr = await query('SELECT id, is_default FROM languages WHERE code=?', [code]);
    if (!lr.rows.length) return res.status(404).json({ error: 'Ngôn ngữ không tồn tại' });
    if (lr.rows[0].is_default) {
      return res.status(400).json({ error: 'Không thể xoá ngôn ngữ mặc định' });
    }
    // Xoá bản dịch rồi xoá ngôn ngữ
    await query('DELETE FROM project_translations WHERE language_id=?', [lr.rows[0].id]);
    await query('DELETE FROM languages WHERE id=?', [lr.rows[0].id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/project', async (_req, res) => {
  try {
    res.json(await buildProjectJson());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Ghi toàn bộ nội dung dự án từ admin -> DB -----------------------
// Nhận nguyên object project.json (giống GET /api/project trả ra).
// Idempotent: xoá-nạp-lại trong 1 transaction. CHỈ ảnh hưởng dữ liệu nội
// dung dự án; dữ liệu CRM (customers/leads/appointments) KHÔNG bị đụng vì
// importProjectJson không xoá projects bằng CASCADE — xem chú thích bên dưới.
app.put('/api/project', async (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object' || !data.project) {
    return res.status(400).json({ error: 'Body thiếu object "project"' });
  }
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const projectId = await importProjectJson(c, PROJECT_CODE, data);
    await c.query('COMMIT');
    res.json({ ok: true, projectId });
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('PUT /api/project lỗi:', err);
    res.status(500).json({ error: err.message });
  } finally {
    c.release();
  }
});

// --- Ghi nội dung MỘT phân khu (nút "Lưu" từng phân khu trên dashboard) ---
// :code = mã phân khu (vd 'pk-bach-van') hoặc '__all' cho cấp dự án.
// Body: { legal, location, timeline, resources, gallery, children }
app.put('/api/subdivision/:code', async (req, res) => {
  const code = req.params.code;
  const payload = req.body || {};
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const projectId = await getProjectId();
    await importSubdivision(c, projectId, code, payload);
    await c.query('COMMIT');
    res.json({ ok: true, code });
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('PUT /api/subdivision lỗi:', err);
    // Trả thêm chi tiết để debug từ DevTools (sqlMessage / code / sqlState)
    res.status(500).json({
      error: err.message,
      code: err.code,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      sql: err.sql ? String(err.sql).slice(0, 500) : undefined,
      stack: String(err.stack || '').split('\n').slice(0, 6).join('\n'),
    });
  } finally {
    c.release();
  }
});

// --- Hoạt động gần đây: gộp sự kiện thật từ nhiều bảng, sắp theo thời gian ---
app.get('/api/activity', async (req, res) => {
  try {
    const pid = await getProjectId();
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);

    // Mỗi nguồn trả về: kind, dot (b/y/g), msg (HTML), at (timestamp)
    // MySQL: nối chuỗi bằng CONCAT; "at" là từ khoá nên đặt trong backtick.
    const sql = `
      (SELECT 'lead' AS kind, 'b' AS dot, l.created_at AS \`at\`,
              CONCAT('<b>', c.full_name, '</b> gửi form đặt lịch') AS msg
         FROM leads l JOIN customers c ON c.id = l.customer_id
        WHERE l.project_id = ?)
      UNION ALL
      (SELECT 'appointment' AS kind, 'b' AS dot, a.created_at AS \`at\`,
              CONCAT('<b>', c.full_name, '</b> đặt lịch xem ',
                COALESCE(pt.type_name, 'căn hộ')) AS msg
         FROM appointments a
         JOIN customers c ON c.id = a.customer_id
         LEFT JOIN leads l ON l.id = a.lead_id
         LEFT JOIN property_types pt ON pt.id = l.interested_property_type_id
        WHERE a.project_id = ?)
      UNION ALL
      (SELECT 'reservation' AS kind, 'y' AS dot, r.created_at AS \`at\`,
              CONCAT('Căn <b>', p.property_code, '</b> đang được giữ chỗ') AS msg
         FROM property_reservations r
         JOIN properties p ON p.id = r.property_id
        WHERE r.project_id = ? AND r.status_code IN ('requested','holding','confirmed'))
      UNION ALL
      (SELECT 'property_status' AS kind, 'g' AS dot, h.changed_at AS \`at\`,
              CONCAT('Căn <b>', p.property_code, '</b> chuyển trạng thái ',
                h.new_status_code) AS msg
         FROM property_status_history h
         JOIN properties p ON p.id = h.property_id
        WHERE p.project_id = ?)
      ORDER BY \`at\` DESC
      LIMIT ${limit}`;

    const rows = (await query(sql, [pid, pid, pid, pid])).rows;
    res.json(
      rows.map((r) => ({
        kind: r.kind,
        dot: r.dot,
        msg: r.msg,
        at: r.at,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Analytics: số liệu THẬT cho Tổng quan + trang Analytics ---------
// Tổng hợp từ analytics_sessions / analytics_events / leads / lead_sources
// / ai_conversations. Khi DB chưa có traffic, các mảng trả về toàn số 0
// (đúng thực tế) — KHÔNG bịa số.
app.get('/api/analytics', async (_req, res) => {
  try {
    const pid = await getProjectId();

    // 1) Lượt xem hôm nay + hôm qua (analytics_sessions)
    // MySQL: DATE(col) thay ::date; CURDATE() thay CURRENT_DATE;
    // CURDATE() - INTERVAL n DAY thay CURRENT_DATE - n.
    const viewsToday = Number(
      (
        await query(
          `SELECT COUNT(*) AS c FROM analytics_sessions
            WHERE project_id=? AND DATE(started_at) = CURDATE()`,
          [pid]
        )
      ).rows[0].c
    );
    const viewsYesterday = Number(
      (
        await query(
          `SELECT COUNT(*) AS c FROM analytics_sessions
            WHERE project_id=? AND DATE(started_at) = CURDATE() - INTERVAL 1 DAY`,
          [pid]
        )
      ).rows[0].c
    );

    // 2) Lượt xem theo 24 giờ hôm nay
    const hourlyRows = (
      await query(
        `SELECT HOUR(started_at) AS h, COUNT(*) AS c
           FROM analytics_sessions
          WHERE project_id=? AND DATE(started_at) = CURDATE()
          GROUP BY h`,
        [pid]
      )
    ).rows;
    const hourly = Array(24).fill(0);
    hourlyRows.forEach((r) => { hourly[Number(r.h)] = Number(r.c); });

    // 3) Lượt xem 7 ngày gần nhất
    const dailyRows = (
      await query(
        `SELECT DATE(started_at) AS d, COUNT(*) AS c
           FROM analytics_sessions
          WHERE project_id=? AND started_at >= CURDATE() - INTERVAL 6 DAY
          GROUP BY d ORDER BY d`,
        [pid]
      )
    ).rows;
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const hit = dailyRows.find((r) => r.d.toISOString().slice(0, 10) === key);
      daily.push({ date: key, count: hit ? hit.c : 0 });
    }

    // 4) Phân bố thiết bị
    const deviceRows = (
      await query(
        `SELECT COALESCE(device_type,'unknown') AS device, COUNT(*) AS c
           FROM analytics_sessions WHERE project_id=? GROUP BY device ORDER BY c DESC`,
        [pid]
      )
    ).rows;

    // 5) Scene xem nhiều nhất (analytics_events nối vr_scenes)
    const sceneRows = (
      await query(
        `SELECT s.scene_name AS name, COUNT(*) AS c
           FROM analytics_events e
           JOIN vr_scenes s ON s.id = e.scene_id
          WHERE e.project_id=? AND e.scene_id IS NOT NULL
          GROUP BY name ORDER BY c DESC LIMIT 8`,
        [pid]
      )
    ).rows;

    // 6) Tỷ lệ dùng Voice AI: số session có ai_conversations / tổng session
    const totalSessions = Number(
      (
        await query(
          'SELECT COUNT(*) AS c FROM analytics_sessions WHERE project_id=?',
          [pid]
        )
      ).rows[0].c
    );
    const aiSessions = Number(
      (
        await query(
          `SELECT COUNT(DISTINCT analytics_session_id) AS c
             FROM ai_conversations
            WHERE project_id=? AND analytics_session_id IS NOT NULL`,
          [pid]
        )
      ).rows[0].c
    );

    // 7) Leads theo 7 ngày + theo nguồn
    const leadDailyRows = (
      await query(
        `SELECT DATE(created_at) AS d, COUNT(*) AS c
           FROM leads WHERE project_id=? AND created_at >= CURDATE() - INTERVAL 6 DAY
          GROUP BY d ORDER BY d`,
        [pid]
      )
    ).rows;
    const leadsDaily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const hit = leadDailyRows.find((r) => r.d.toISOString().slice(0, 10) === key);
      leadsDaily.push({ date: key, count: hit ? hit.c : 0 });
    }
    const leadSourceRows = (
      await query(
        `SELECT COALESCE(ls.source_name, 'Khác') AS source, COUNT(*) AS c
           FROM leads l
           LEFT JOIN lead_sources ls ON ls.id = l.source_id
          WHERE l.project_id=? GROUP BY source ORDER BY c DESC`,
        [pid]
      )
    ).rows;

    // 8) Phễu chuyển đổi: dựng từ event thật + leads
    const evCount = async (name) =>
      Number(
        (
          await query(
            `SELECT COUNT(*) AS c FROM analytics_events
              WHERE project_id=? AND event_name=?`,
            [pid, name]
          )
        ).rows[0].c
      );
    const funnel = [
      { stage: 'Lượt xem trang', value: totalSessions },
      { stage: 'Mở Bảng Giá', value: await evCount('open_pricing') },
      { stage: 'Mở Form Đặt Lịch', value: await evCount('open_booking_form') },
      {
        stage: 'Submit thành công',
        value: Number(
          (
            await query('SELECT COUNT(*) AS c FROM leads WHERE project_id=?', [pid])
          ).rows[0].c
        ),
      },
    ];

    res.json({
      viewsToday,
      viewsYesterday,
      hourly,
      daily,
      devices: deviceRows.map((r) => ({ device: r.device, count: Number(r.c) })),
      scenes: sceneRows.map((r) => ({ name: r.name, count: Number(r.c) })),
      voiceAI: { used: aiSessions, total: totalSessions },
      leadsDaily,
      leadsBySource: leadSourceRows.map((r) => ({ source: r.source, count: Number(r.c) })),
      funnel,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================================
// CRM: Leads + Appointments — dữ liệu thật cho trang admin "Leads"
// Admin dùng format phẳng; DB tách customers/leads/lead_sources/appointments.
// Các hàm dưới ánh xạ qua lại 2 chiều.
// =====================================================================

// status_code DB <-> nhãn admin: dùng chung tập mã, admin tự map sang nhãn.
// budget: admin gửi nhãn ("8–12 tỷ"); ta lưu vào leads.budget_label.

// GET /api/leads — danh sách lead dạng phẳng
app.get('/api/leads', async (_req, res) => {
  try {
    const pid = await getProjectId();
    const rows = (
      await query(
        `SELECT l.id, c.full_name, c.phone, c.email, c.zalo_phone,
                l.budget_label, l.purchase_purpose, l.purchase_timing,
                l.status_code, l.crm_note, l.is_manual, l.created_at,
                ls.source_name, u.full_name AS assignee_name,
                pt.type_name AS interested_type
           FROM leads l
           JOIN customers c ON c.id = l.customer_id
           LEFT JOIN lead_sources ls ON ls.id = l.source_id
           LEFT JOIN users u ON u.id = l.assigned_user_id
           LEFT JOIN property_types pt ON pt.id = l.interested_property_type_id
          WHERE l.project_id = ?
          ORDER BY l.created_at DESC`,
        [pid]
      )
    ).rows;
    res.json(
      rows.map((r) => ({
        id: r.id,
        name: r.full_name,
        phone: r.phone,
        email: r.email || '',
        zalo: r.zalo_phone || '',
        unitType: r.interested_type || '',
        budget: r.budget_label || '',
        purpose: r.purchase_purpose || '',
        timing: r.purchase_timing || '',
        source: r.source_name || 'Khác',
        status: r.status_code,
        assignee: r.assignee_name || '',
        notes: r.crm_note || '',
        manual: r.is_manual,
        createdAt: r.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Tạo/đảm bảo customer theo phone (CRM gom khách theo số điện thoại)
async function upsertCustomer(c, { name, phone, email, zalo }) {
  const found = await c.query('SELECT id FROM customers WHERE phone=?', [phone]);
  if (found.rows.length) {
    await c.query(
      `UPDATE customers SET full_name=?, email=?, zalo_phone=?, updated_at=NOW()
        WHERE id=?`,
      [name, email || null, zalo || null, found.rows[0].id]
    );
    return found.rows[0].id;
  }
  const ins = await c.query(
    `INSERT INTO customers (full_name, phone, email, zalo_phone)
     VALUES (?,?,?,?)`,
    [name, phone, email || null, zalo || null]
  );
  return ins.insertId;
}

// Tạo/đảm bảo lead_source theo tên
async function ensureSource(c, projectId, sourceName) {
  if (!sourceName) return null;
  const code = sourceName.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 90);
  await c.query(
    `INSERT INTO lead_sources (project_id, source_group, source_code, source_name)
     VALUES (?,'other',?,?)
     ON DUPLICATE KEY UPDATE source_name=VALUES(source_name)`,
    [projectId, code, sourceName]
  );
  const r = await c.query(
    'SELECT id FROM lead_sources WHERE project_id=? AND source_code=?',
    [projectId, code]
  );
  return r.rows[0].id;
}

// POST /api/leads — thêm lead thủ công
app.post('/api/leads', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.phone) return res.status(400).json({ error: 'Thiếu tên/SĐT' });
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const pid = (await c.query('SELECT id FROM projects WHERE code=?', [PROJECT_CODE])).rows[0].id;
    const custId = await upsertCustomer(c, b);
    const srcId = await ensureSource(c, pid, b.source);
    await c.query(
      `INSERT INTO leads
         (project_id, customer_id, source_id, budget_label, purchase_purpose,
          purchase_timing, status_code, crm_note, is_manual, created_from)
       VALUES (?,?,?,?,?,?,?,?,TRUE,'manual')`,
      [pid, custId, srcId, b.budget || null, b.purpose || null,
       b.timing || null, b.status || 'new', b.notes || null]
    );
    await c.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await c.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    c.release();
  }
});

// POST /api/leads/public — form liên hệ từ trang VR công khai (index.html).
// Không cần đăng nhập. Gán sale theo nguyên tắc:
//   - body.s (slug sale trong ?s=) khớp 1 sale  -> gán đúng sale đó.
//   - không có / không khớp                     -> round-robin tuần tự.
app.post('/api/leads/public', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.phone) return res.status(400).json({ error: 'Thiếu tên/SĐT' });
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const pid = (await c.query('SELECT id FROM projects WHERE code=?', [PROJECT_CODE])).rows[0].id;

    let assignedUserId = await findSaleBySlug(pid, (b.s || '').trim());
    if (!assignedUserId) assignedUserId = await pickNextSale(pid);

    const custId = await upsertCustomer(c, b);
    const srcId = await ensureSource(c, pid, b.source || 'VR Web');
    const lr = await c.query(
      `INSERT INTO leads
         (project_id, customer_id, source_id, assigned_user_id, budget_label,
          purchase_purpose, purchase_timing, customer_note, status_code,
          is_manual, created_from)
       VALUES (?,?,?,?,?,?,?,?,'new',FALSE,'web_form')`,
      [pid, custId, srcId, assignedUserId, b.budget || null, b.purpose || null,
       b.timing || null, b.notes || null]
    );
    if (assignedUserId) {
      await c.query(
        'INSERT INTO lead_assignments (lead_id, user_id) VALUES (?,?)',
        [lr.insertId, assignedUserId]
      );
    }
    await c.query('COMMIT');
    res.json({ ok: true, assigned: !!assignedUserId });
  } catch (err) {
    await c.query('ROLLBACK');
    console.error('POST /api/leads/public lỗi:', err);
    res.status(500).json({ error: err.message });
  } finally {
    c.release();
  }
});

// PUT /api/leads/:id — cập nhật lead
app.put('/api/leads/:id', async (req, res) => {
  const b = req.body || {};
  const id = parseInt(req.params.id, 10);
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const lr = await c.query('SELECT customer_id, project_id FROM leads WHERE id=?', [id]);
    if (!lr.rows.length) { await c.query('ROLLBACK'); return res.status(404).json({ error: 'Lead không tồn tại' }); }
    const { customer_id, project_id } = lr.rows[0];
    await c.query(
      `UPDATE customers SET full_name=?, phone=?, email=?, zalo_phone=?, updated_at=NOW()
        WHERE id=?`,
      [b.name, b.phone, b.email || null, b.zalo || null, customer_id]
    );
    const srcId = await ensureSource(c, project_id, b.source);
    await c.query(
      `UPDATE leads SET source_id=?, budget_label=?, purchase_purpose=?,
              purchase_timing=?, status_code=?, crm_note=?, updated_at=NOW()
        WHERE id=?`,
      [srcId, b.budget || null, b.purpose || null, b.timing || null,
       b.status || 'new', b.notes || null, id]
    );
    await c.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await c.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    c.release();
  }
});

// DELETE /api/leads/:id
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await query('DELETE FROM leads WHERE id=?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appointments — danh sách lịch hẹn dạng phẳng
app.get('/api/appointments', async (_req, res) => {
  try {
    const pid = await getProjectId();
    const rows = (
      await query(
        `SELECT a.id, a.lead_id, c.full_name, c.phone,
                a.start_at, a.appointment_type, a.status_code, a.notes,
                a.created_at, u.full_name AS assignee_name
           FROM appointments a
           JOIN customers c ON c.id = a.customer_id
           LEFT JOIN users u ON u.id = a.assigned_user_id
          WHERE a.project_id = ?
          ORDER BY a.start_at DESC`,
        [pid]
      )
    ).rows;
    res.json(
      rows.map((r) => {
        let d = r.start_at ? new Date(r.start_at) : null;
        if (d && Number.isNaN(d.getTime())) d = null;
        return {
          id: r.id,
          leadId: r.lead_id,
          name: r.full_name,
          phone: r.phone,
          date: d ? d.toISOString().slice(0, 10) : '',
          time: d ? d.toTimeString().slice(0, 5) : '',
          type: r.appointment_type || '',
          assignee: r.assignee_name || '',
          status: r.status_code,
          notes: r.notes || '',
          createdAt: r.created_at,
        };
      })
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appointments — đặt lịch thủ công
app.post('/api/appointments', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.phone || !b.date || !b.time) {
    return res.status(400).json({ error: 'Thiếu tên/SĐT/ngày/giờ' });
  }
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const pid = (await c.query('SELECT id FROM projects WHERE code=?', [PROJECT_CODE])).rows[0].id;
    const custId = await upsertCustomer(c, b);
    await c.query(
      `INSERT INTO appointments
         (project_id, lead_id, customer_id, appointment_type, start_at,
          status_code, notes)
       VALUES (?,?,?,?,?,?,?)`,
      [pid, b.leadId || null, custId, b.type || null,
       `${b.date} ${b.time}`, b.status || 'pending', b.notes || null]
    );
    await c.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await c.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    c.release();
  }
});

// PUT /api/appointments/:id
app.put('/api/appointments/:id', async (req, res) => {
  const b = req.body || {};
  const id = parseInt(req.params.id, 10);
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const ar = await c.query('SELECT customer_id FROM appointments WHERE id=?', [id]);
    if (!ar.rows.length) { await c.query('ROLLBACK'); return res.status(404).json({ error: 'Lịch hẹn không tồn tại' }); }
    await c.query(
      `UPDATE customers SET full_name=?, phone=?, updated_at=NOW() WHERE id=?`,
      [b.name, b.phone, ar.rows[0].customer_id]
    );
    await c.query(
      `UPDATE appointments SET lead_id=?, appointment_type=?, start_at=?,
              status_code=?, notes=?, updated_at=NOW()
        WHERE id=?`,
      [b.leadId || null, b.type || null, `${b.date} ${b.time}`,
       b.status || 'pending', b.notes || null, id]
    );
    await c.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await c.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    c.release();
  }
});

// DELETE /api/appointments/:id
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await query('DELETE FROM appointments WHERE id=?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================================
// Serve trang VR tĩnh — gốc dự án nằm 1 cấp trên thư mục server/.
// Nhờ vậy có URL đẹp dạng /<id-sale> mà không cần Live Server.
// =====================================================================
const SITE_ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');
const INDEX_HTML = path.join(SITE_ROOT, 'index.html');

// File tĩnh thật (js, css, ảnh, data/...) — index:false để không tự
// nuốt mọi request '/', dành quyền đó cho catch-all bên dưới.
app.use(express.static(SITE_ROOT, { index: false, extensions: ['html'] }));

// 3DVista tour + app dùng relative path — khi URL là /sales1 trình duyệt
// có thể request /sales1/<file> hoặc /<file>. Map về vị trí thật để tránh 404.
const DATA_DIR_VR = path.join(SITE_ROOT, 'data');
const JS_DIR = path.join(SITE_ROOT, 'js');
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const fileName = req.path.split('/').pop();
  if (!fileName) return next();

  // 1) File JS của 3DVista — ưu tiên data/
  const TDV_FILES = new Set(['script_general.js', 'script.js', 'tdvplayer.js', 'script_mobile.js', 'tdvplayersw.js']);
  if (TDV_FILES.has(fileName) && req.path !== '/data/' + fileName) {
    return res.sendFile(path.join(DATA_DIR_VR, fileName), err => err && next());
  }

  // 2) config.js của app — thường được preload relative ở trang sale → map về js/
  if (fileName === 'config.js' && req.path !== '/js/config.js') {
    return res.sendFile(path.join(JS_DIR, 'config.js'), err => err && next());
  }

  // 3) Thư mục locale/, skin/, media/ — tài sản của tour 3DVista
  for (const d of ['/locale/', '/skin/', '/media/']) {
    const i = req.path.indexOf(d);
    if (i !== -1 && !req.path.startsWith('/data/')) {
      return res.sendFile(path.join(DATA_DIR_VR, req.path.slice(i + 1)), err => err && next());
    }
  }

  next();
});

// Thư mục admin — serve index.html tương ứng khi truy cập không có tên file.
app.get(['/admin', '/admin/'], (_req, res) => {
  res.sendFile(path.join(SITE_ROOT, 'admin', 'index.html'));
});

// =====================================================================
// Entity translations — bản dịch text động (tên BDS, mô tả, ...) cho
// các bảng nghiệp vụ. Whitelist entity + field để không cho dịch bừa.
// =====================================================================
const TRANSLATABLE = {
  property: ['name', 'desc', 'legal', 'handover', 'highlights', 'progress'],
};

// GET /api/translations/:entity/:id
// → { name: { en: '...' }, desc: { en: '...' }, ... }
app.get('/api/translations/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    if (!TRANSLATABLE[entity]) return res.status(400).json({ error: 'Unknown entity' });
    const rows = (await query(
      `SELECT et.field_name, l.code AS lang_code, et.text_value
         FROM entity_translations et
         JOIN languages l ON l.id = et.language_id
        WHERE et.entity_type=? AND et.entity_id=?`,
      [entity, id]
    )).rows;
    const out = {};
    for (const r of rows) (out[r.field_name] ||= {})[r.lang_code] = r.text_value;
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/translations/:entity/:id
// Body: { field, lang, text }  (text rỗng → xoá bản dịch)
app.put('/api/translations/:entity/:id', async (req, res) => {
  try {
    const { entity, id } = req.params;
    const { field, lang, text } = req.body || {};
    if (!TRANSLATABLE[entity]) return res.status(400).json({ error: 'Unknown entity' });
    if (!TRANSLATABLE[entity].includes(field)) return res.status(400).json({ error: 'Unknown field' });
    const langRow = (await query('SELECT id FROM languages WHERE code=? AND is_active=1', [lang])).rows[0];
    if (!langRow) return res.status(400).json({ error: 'Unknown language' });

    if (text == null || text === '') {
      await query(
        'DELETE FROM entity_translations WHERE entity_type=? AND entity_id=? AND field_name=? AND language_id=?',
        [entity, id, field, langRow.id]
      );
    } else {
      await query(
        `INSERT INTO entity_translations (entity_type, entity_id, field_name, language_id, text_value)
              VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE text_value=VALUES(text_value)`,
        [entity, id, field, langRow.id, text]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Catch-all: '/' và '/<id-sale>' đều trả index.html.
// FE (getSaleSlug) tự đọc id sale từ path. Loại trừ:
//   - /api/*, /uploads/* (handler riêng)
//   - Path chứa dấu chấm (.js, .css, .pdf, ảnh…) — phải là file asset thật,
//     không tìm thấy thì trả 404 thay vì HTML (tránh lỗi "Unexpected token '<'").
app.get(/^\/(?!api\/|uploads\/).*/, (req, res, next) => {
  if (req.path.includes('.')) return next();
  res.sendFile(INDEX_HTML);
});

// 404 cho asset không tồn tại — trả text thay vì HTML để client biết file thiếu.
app.use((req, res) => {
  res.status(404).type('text/plain').send('Not Found: ' + req.originalUrl);
});

(async () => {
  try { await ensureUsersSocialColumn(); } catch (e) {
    console.warn('Bỏ qua ensureUsersSocialColumn:', e.message);
  }
  app.listen(PORT, () => {
    console.log(`API + trang VR chạy tại http://localhost:${PORT}/`);
    console.log(`  Trang sale:  http://localhost:${PORT}/<id-sale>`);
  });
})();
