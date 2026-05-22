// Logic nạp 1 object project.json -> các bảng MySQL.
// Dùng chung cho seed.js (nạp từ file) và API PUT /api/project (nạp từ admin).
// Idempotent: xoá sạch dữ liệu dự án cũ rồi nạp lại — phải gọi trong 1 transaction.

// Tách "27%" -> 27, "12.4 ha ..." -> 12.4
const numFrom = (s) => {
  if (s == null) return null;
  const m = String(s).replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

// MySQL không có "INSERT ... RETURNING". Helper: chạy INSERT rồi trả insertId.
const insertId = (res) => res.insertId;

/**
 * Nạp toàn bộ dữ liệu dự án vào DB.
 * @param {object} c            client đã BEGIN transaction (db.js pool.connect())
 * @param {string} projectCode  mã dự án (vd 'haivanbay')
 * @param {object} data         object giống project.json
 * @returns {Promise<number>}   project_id vừa tạo/cập nhật
 */
export async function importProjectJson(c, projectCode, data) {
  const p = data.project || {};

  // ---- projects: UPSERT, KHÔNG xoá row -----------------------------
  // Không DELETE FROM projects — vì CRM (leads/appointments/reservations)
  // tham chiếu projects bằng ON DELETE CASCADE, xoá project sẽ mất CRM
  // thật. Thay vào đó UPSERT project rồi chỉ xoá các bảng NỘI DUNG dự án.
  // MySQL: ON DUPLICATE KEY UPDATE; sau đó SELECT id để chắc chắn lấy đúng.
  await c.query(
    `INSERT INTO projects
      (code, name, tagline, location_text, developer_name, sales_status,
       handover_text, price_from_text, price_unit_text, price_from_vnd,
       area_range_text, total_units, total_towers, floors_text, density_pct,
       green_space_text, units_left, total_units_for_sale, promo_deadline_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE
       name=VALUES(name), tagline=VALUES(tagline),
       location_text=VALUES(location_text), developer_name=VALUES(developer_name),
       sales_status=VALUES(sales_status), handover_text=VALUES(handover_text),
       price_from_text=VALUES(price_from_text), price_unit_text=VALUES(price_unit_text),
       price_from_vnd=VALUES(price_from_vnd), area_range_text=VALUES(area_range_text),
       total_units=VALUES(total_units), total_towers=VALUES(total_towers),
       floors_text=VALUES(floors_text), density_pct=VALUES(density_pct),
       green_space_text=VALUES(green_space_text), units_left=VALUES(units_left),
       total_units_for_sale=VALUES(total_units_for_sale),
       promo_deadline_at=VALUES(promo_deadline_at)`,
    [
      projectCode, p.name, p.tagline, p.location, p.developer, p.status,
      p.handover, p.priceFrom, p.priceUnit, numFrom(p.priceFrom) != null ? numFrom(p.priceFrom) * 1e9 : null,
      p.areaRange, p.totalUnits, p.totalTowers, p.floors, numFrom(p.density),
      p.greenSpace, p.unitsLeft, p.totalUnitsForSale,
      p.promoDeadline || null,
    ]
  );
  const projectId = (
    await c.query('SELECT id FROM projects WHERE code=?', [projectCode])
  ).rows[0].id;

  // ---- Xoá các bảng NỘI DUNG dự án cũ (KHÔNG đụng CRM) -------------
  // Các bảng con tự CASCADE khi bảng cha của chúng bị xoá.
  await c.query('DELETE FROM property_reservations WHERE project_id=?', [projectId]);
  for (const t of [
    'project_card_overviews', 'project_card_highlights', 'project_card_quick_links',
    'project_statistics', 'amenities', 'amenity_categories', 'menu_groups',
    'site_maps', 'gallery_items', 'gallery_folders', 'project_locations',
    'legal_documents', 'project_testimonials',
    'project_resources', 'key_visual_groups', 'construction_milestones',
    'masterplans', 'properties',
  ]) {
    await c.query(`DELETE FROM ${t} WHERE project_id=?`, [projectId]);
  }

  // ---- project_card_overviews / highlights / quick_links ----------
  const card = p.cardOverview || {};
  await c.query(
    'INSERT INTO project_card_overviews (project_id, description) VALUES (?,?)',
    [projectId, card.description || null]
  );
  for (const [i, h] of (card.highlights || []).entries()) {
    await c.query(
      `INSERT INTO project_card_highlights (project_id, icon_code, label, value_text, sort_order)
       VALUES (?,?,?,?,?)`,
      [projectId, h.icon, h.label, h.value, i]
    );
  }
  for (const [i, q] of (card.quickLinks || []).entries()) {
    await c.query(
      `INSERT INTO project_card_quick_links (project_id, action_code, icon_code, label, sort_order)
       VALUES (?,?,?,?,?)`,
      [projectId, q.id, q.icon, q.label, i]
    );
  }

  // ---- project_statistics (project.stats + legal.developerStats) --
  const legalRaw = data.legal || {};
  const legalByKey =
    legalRaw.__all || legalRaw.documents || legalRaw.developerStats
      ? legalRaw.documents || legalRaw.developerStats || legalRaw.testimonials
        ? { __all: legalRaw } // dạng cũ phẳng
        : legalRaw            // dạng mới đã có __all
      : { __all: legalRaw };
  const subCode = (k) => (k === '__all' ? null : k);

  for (const [i, s] of (p.stats || []).entries()) {
    await c.query(
      `INSERT INTO project_statistics (project_id, label, unit_label, value_text, numeric_value, sort_order)
       VALUES (?,?,?,?,?,?)`,
      [projectId, s.label, s.unit, s.value, numFrom(s.value), i]
    );
  }
  for (const [lk, legal] of Object.entries(legalByKey)) {
    for (const [i, s] of (legal?.developerStats || []).entries()) {
      await c.query(
        `INSERT INTO project_statistics
           (project_id, subdivision_code, label, unit_label, value_text, numeric_value, sort_order)
         VALUES (?,?,?,?,?,?,?)`,
        [projectId, subCode(lk), s.label, s.unit, s.value, numFrom(s.value), 100 + i]
      );
    }
  }

  // ---- sales -> users + user_role_bindings + project_memberships --
  // KHÔNG được đụng password_hash của user đã tồn tại; user mới nhận hash
  // placeholder — phải đặt lại mật khẩu qua /api/users mới đăng nhập được.
  const salesRoleId = (
    await c.query("SELECT id FROM roles WHERE code='sales'")
  ).rows[0].id;
  for (const s of data.sales || []) {
    await c.query(
      `INSERT INTO users (username, password_hash, full_name, email, phone, title, avatar_url)
       VALUES (?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         email     = VALUES(email),
         phone     = VALUES(phone),
         title     = VALUES(title),
         avatar_url = VALUES(avatar_url)`,
      [s.username, 'must-reset', s.name, s.email || null, s.phone, s.title, s.avatar || null]
    );
    const userId = (
      await c.query('SELECT id FROM users WHERE username=?', [s.username])
    ).rows[0].id;
    await c.query(
      'INSERT IGNORE INTO user_role_bindings (user_id, role_id) VALUES (?,?)',
      [userId, salesRoleId]
    );
    const slug = (s.slug || s.username || '').trim().toLowerCase() || null;
    await c.query(
      `INSERT INTO project_memberships (project_id, user_id, role_id, is_primary_sales, public_slug)
       VALUES (?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         public_slug = COALESCE(public_slug, VALUES(public_slug))`,
      [projectId, userId, salesRoleId, 1, slug]
    );
  }

  // ---- menu -> menu_groups + menu_items + chi tiết ----------------
  const groupLabels = {
    tongQuan: 'Tổng quan',
    tienIchNoiKhu: 'Tiện ích nội khu',
    tienIchNgoaiKhu: 'Tiện ích ngoại khu',
    matBangTang: 'Mặt bằng tầng',
    view360Can: 'View 360 căn',
    phanKhu: 'Phân khu',
  };

  // Ghi 1 menu_item đầy đủ (detail/subdivision/children). Trả về itemId.
  async function writeMenuItem(groupId, item, i) {
    const itRes = await c.query(
      `INSERT INTO menu_items (menu_group_id, item_code, label, hotspot_code, sort_order)
       VALUES (?,?,?,?,?)`,
      [groupId, item.id, item.label, item.tdvPanoramaId || null, i]
    );
    const itemId = insertId(itRes);

    if (item.detail) {
      const d = item.detail;
      await c.query(
        `INSERT INTO menu_item_details (menu_item_id, title, subtitle, category, description)
         VALUES (?,?,?,?,?)`,
        [itemId, d.title, d.subtitle, d.category, d.description]
      );
      for (const [ii, url] of (d.images || []).entries()) {
        await c.query(
          `INSERT INTO menu_item_detail_images (menu_item_id, image_url, sort_order)
           VALUES (?,?,?)`,
          [itemId, url, ii]
        );
      }
      for (const [si, sp] of (d.specs || []).entries()) {
        await c.query(
          `INSERT INTO menu_item_detail_specs (menu_item_id, label, value_text, sort_order)
           VALUES (?,?,?,?)`,
          [itemId, sp.label, sp.value, si]
        );
      }
    }

    if (item.subdivision) {
      const sd = item.subdivision;
      await c.query(
        `INSERT INTO menu_item_subdivisions (menu_item_id, name, description, cover_url, video_url)
         VALUES (?,?,?,?,?)`,
        [itemId, sd.name, sd.desc, sd.cover || null, sd.video || null]
      );
      for (const [fi, f] of (sd.facts || []).entries()) {
        await c.query(
          `INSERT INTO menu_item_subdivision_facts (menu_item_id, label, value_text, sort_order)
           VALUES (?,?,?,?)`,
          [itemId, f.label, f.value, fi]
        );
      }
      for (const [pi, pt] of (sd.points || []).entries()) {
        await c.query(
          `INSERT INTO menu_item_subdivision_points (menu_item_id, point_text, sort_order)
           VALUES (?,?,?)`,
          [itemId, pt, pi]
        );
      }
    }

    // children: 4 nhóm con (tienIchNoiKhu/...) của phân khu này
    if (item.children && typeof item.children === 'object') {
      for (const [ci, childCode] of Object.keys(item.children).entries()) {
        const cgRes = await c.query(
          `INSERT INTO menu_groups
             (project_id, parent_menu_item_id, code, display_name, sort_order)
           VALUES (?,?,?,?,?)`,
          [projectId, itemId, childCode, groupLabels[childCode] || childCode, ci]
        );
        const childItems = item.children[childCode] || [];
        for (const [i2, child] of childItems.entries()) {
          await writeMenuItem(insertId(cgRes), child, i2);
        }
      }
    }

    return itemId;
  }

  // Nhóm gốc: chỉ Tổng quan + Phân khu (parent_menu_item_id = NULL)
  for (const [gi, groupCode] of Object.keys(data.menu || {}).entries()) {
    const gRes = await c.query(
      `INSERT INTO menu_groups (project_id, code, display_name, sort_order)
       VALUES (?,?,?,?)`,
      [projectId, groupCode, groupLabels[groupCode] || groupCode, gi]
    );
    const groupId = insertId(gRes);
    for (const [i, item] of data.menu[groupCode].entries()) {
      await writeMenuItem(groupId, item, i);
    }
  }

  // ---- siteMap -> site_maps + site_map_points ---------------------
  const sm = data.siteMap || {};
  const smRes = await c.query(
    `INSERT INTO site_maps (project_id, name, background_url, is_default, sort_order)
     VALUES (?,?,?,?,?)`,
    [projectId, 'Site map chính', '', 1, 0]
  );
  const siteMapId = insertId(smRes);
  for (const [i, pt] of (sm.points || []).entries()) {
    await c.query(
      `INSERT INTO site_map_points (site_map_id, point_code, label, x_pct, y_pct, sort_order, metadata)
       VALUES (?,?,?,?,?,?,?)`,
      [siteMapId, pt.id, pt.label, 0, 0, i,
       JSON.stringify({ lat: pt.lat, lng: pt.lng, tdvPanoramaId: pt.tdvPanoramaId })]
    );
  }
  await c.query(
    `INSERT INTO project_settings (project_id, feature_flags_json)
     VALUES (?,?)
     ON DUPLICATE KEY UPDATE feature_flags_json = VALUES(feature_flags_json)`,
    [projectId, JSON.stringify({ siteMap: { center: sm.center, zoom: sm.zoom } })]
  );

  // ---- gallery -> gallery_folders + gallery_items -----------------
  const folderIds = {};
  for (const g of data.gallery || []) {
    const folderName = g.folder || 'Khác';
    if (!folderIds[folderName]) {
      await c.query(
        `INSERT INTO gallery_folders (project_id, folder_name, sort_order)
         VALUES (?,?,?)
         ON DUPLICATE KEY UPDATE folder_name = VALUES(folder_name)`,
        [projectId, folderName, Object.keys(folderIds).length]
      );
      folderIds[folderName] = (
        await c.query(
          'SELECT id FROM gallery_folders WHERE project_id=? AND folder_name=?',
          [projectId, folderName]
        )
      ).rows[0].id;
    }
  }
  for (const [i, g] of (data.gallery || []).entries()) {
    const provider = g.videoSource || 'external';
    await c.query(
      `INSERT INTO gallery_items
         (project_id, gallery_folder_id, subdivision_code, media_type, source_provider,
          title, source_url, poster_url, sort_order, metadata)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [projectId, folderIds[g.folder || 'Khác'], g.subdivision || null, g.type,
       provider, g.title, g.src, g.poster || g.thumb || null, i,
       JSON.stringify({ thumb: g.thumb || null })]
    );
  }

  // ---- location -> project_locations + nearby_places --------------
  const locRaw = data.location || {};
  const locByKey =
    locRaw.__all || ('nearby' in locRaw) || ('mapSrc' in locRaw)
      ? ('nearby' in locRaw) || ('mapSrc' in locRaw)
        ? { __all: locRaw }
        : locRaw
      : { __all: locRaw };
  for (const [lk, loc] of Object.entries(locByKey)) {
    const locRes = await c.query(
      `INSERT INTO project_locations
         (project_id, subdivision_code, latitude, longitude, map_embed_url)
       VALUES (?,?,?,?,?)`,
      [projectId, subCode(lk), loc.lat ?? null, loc.lng ?? null, loc.mapSrc || null]
    );
    const locId = insertId(locRes);
    for (const [i, n] of (loc.nearby || []).entries()) {
      await c.query(
        `INSERT INTO nearby_places
           (project_location_id, category_code, name, distance_km, distance_text,
            travel_minutes, travel_time_text, sort_order)
         VALUES (?,?,?,?,?,?,?,?)`,
        [locId, n.cat, n.name, numFrom(n.dist), n.dist, numFrom(n.time), n.time, i]
      );
    }
  }

  // ---- legal: documents / testimonials (theo phân khu) ------------
  for (const [lk, legal] of Object.entries(legalByKey)) {
    for (const [i, d] of (legal?.documents || []).entries()) {
      await c.query(
        `INSERT INTO legal_documents
           (project_id, subdivision_code, document_name, detail_text, is_completed, sort_order)
         VALUES (?,?,?,?,?,?)`,
        [projectId, subCode(lk), d.name, d.detail, d.done ? 1 : 0, i]
      );
    }
    for (const [i, t] of (legal?.testimonials || []).entries()) {
      await c.query(
        `INSERT INTO project_testimonials
           (project_id, subdivision_code, initials, customer_role, unit_label, testimonial_text, sort_order)
         VALUES (?,?,?,?,?,?,?)`,
        [projectId, subCode(lk), t.initials, t.role, t.unit, t.text, i]
      );
    }
  }

  // ---- resources -> project_resources (theo phân khu) -------------
  const resRaw = data.resources || {};
  const resByKey = resRaw.__all
    ? resRaw
    : Object.values(resRaw).some((v) => v && typeof v === 'object' && 'url' in v)
      ? { __all: resRaw } // dạng cũ phẳng
      : resRaw;
  for (const [rk, resObj] of Object.entries(resByKey)) {
    for (const [i, key] of Object.keys(resObj || {}).entries()) {
      const r = resObj[key];
      await c.query(
        `INSERT INTO project_resources
           (project_id, subdivision_code, resource_key, title, resource_type, resource_url, sort_order)
         VALUES (?,?,?,?,?,?,?)`,
        [projectId, subCode(rk), key, r.title, r.type, r.url || '', i]
      );
    }
  }

  // ---- keyVisuals -> key_visual_groups + key_visual_items ---------
  for (const [gi, groupCode] of Object.keys(data.keyVisuals || {}).entries()) {
    const gRes = await c.query(
      `INSERT INTO key_visual_groups (project_id, code, name, sort_order)
       VALUES (?,?,?,?)`,
      [projectId, groupCode, groupCode, gi]
    );
    const kvGroupId = insertId(gRes);
    for (const [i, kv] of data.keyVisuals[groupCode].entries()) {
      await c.query(
        `INSERT INTO key_visual_items
           (key_visual_group_id, title, resource_type, resource_url, sort_order)
         VALUES (?,?,?,?,?)`,
        [kvGroupId, kv.title, kv.type, kv.url, i]
      );
    }
  }

  // ---- timeline -> construction_milestones (theo phân khu) --------
  const tlRaw = data.timeline || [];
  const tlByKey = Array.isArray(tlRaw) ? { __all: tlRaw } : tlRaw;
  for (const [tk, milestones] of Object.entries(tlByKey)) {
    for (const [i, t] of (milestones || []).entries()) {
      await c.query(
        `INSERT INTO construction_milestones
           (project_id, subdivision_code, phase_name, milestone_date_text,
            status_code, description, sort_order)
         VALUES (?,?,?,?,?,?,?)`,
        [projectId, subCode(tk), t.phase, t.date, t.status, t.desc, i]
      );
    }
  }

  // ---- masterplan -------------------------------------------------
  const mp = data.masterplan || {};
  const mpRes = await c.query(
    `INSERT INTO masterplans (project_id, image_url, intro_text)
     VALUES (?,?,?)`,
    [projectId, mp.image || null, mp.intro || null]
  );
  const masterplanId = insertId(mpRes);
  for (const [i, cat] of (mp.categories || []).entries()) {
    await c.query(
      `INSERT INTO masterplan_categories (masterplan_id, code, label, icon_code, sort_order)
       VALUES (?,?,?,?,?)`,
      [masterplanId, cat.id, cat.label, cat.icon, i]
    );
  }
  for (const [i, m] of (mp.markers || []).entries()) {
    await c.query(
      `INSERT INTO masterplan_markers
         (masterplan_id, marker_code, category_code, label, description, x_pct, y_pct, sort_order)
       VALUES (?,?,?,?,?,?,?,?)`,
      [masterplanId, m.id, m.cat, m.label, m.desc, m.x, m.y, i]
    );
  }
  for (const [gi, groupCode] of Object.keys(mp.filterSchema || {}).entries()) {
    const fgRes = await c.query(
      `INSERT INTO masterplan_filter_groups (masterplan_id, code, label, sort_order)
       VALUES (?,?,?,?)`,
      [masterplanId, groupCode, groupCode, gi]
    );
    const fgId = insertId(fgRes);
    for (const [i, opt] of mp.filterSchema[groupCode].entries()) {
      await c.query(
        `INSERT INTO masterplan_filter_options
           (filter_group_id, option_code, label, color_hex, sort_order)
         VALUES (?,?,?,?,?)`,
        [fgId, opt.id, opt.label, opt.color || null, i]
      );
    }
  }

  // ---- properties + bảng con --------------------------------------
  for (const [i, pr] of (data.properties || []).entries()) {
    const prRes = await c.query(
      `INSERT INTO properties
         (project_id, property_code, name, subdivision_code, subdivision_label,
          type_code, type_label, description, area_sqm, bedroom_count,
          bathroom_count, facing_direction, price_vnd, price_display,
          price_per_sqm_display, legal_text, handover_text, status_code,
          status_label, sort_order, metadata)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        projectId, pr.code || pr.id, pr.name, pr.phanKhu, pr.phanKhuLabel,
        pr.type, pr.typeLabel, pr.desc, pr.area, pr.bedrooms,
        pr.bathrooms, pr.direction,
        pr.priceVal != null ? pr.priceVal * 1e9 : null, pr.price,
        pr.pricePerM2, pr.legal, pr.handover, pr.status,
        pr.statusLabel, i,
        JSON.stringify({
          slug: pr.id,
          priceVal: pr.priceVal,
          consultPhone: pr.consultPhone,
          consultEmail: pr.consultEmail,
          thumbsFloor: pr.thumbsFloor || [],
        }),
      ]
    );
    const propId = insertId(prRes);

    for (const [ii, url] of (pr.images || []).entries()) {
      await c.query(
        'INSERT INTO property_images (property_id, image_url, sort_order) VALUES (?,?,?)',
        [propId, url, ii]
      );
    }
    for (const [ii, url] of (pr.thumbsFloor || []).entries()) {
      await c.query(
        'INSERT INTO property_floor_plans (property_id, image_url, sort_order) VALUES (?,?,?)',
        [propId, url, ii]
      );
    }
    for (const [ii, h] of (pr.highlights || []).entries()) {
      await c.query(
        'INSERT INTO property_highlights (property_id, highlight_text, sort_order) VALUES (?,?,?)',
        [propId, h, ii]
      );
    }
    for (const [ii, pol] of (pr.policies || []).entries()) {
      await c.query(
        'INSERT INTO property_policies (property_id, policy_text, sort_order) VALUES (?,?,?)',
        [propId, pol, ii]
      );
    }
    for (const [ii, d] of (pr.docs || []).entries()) {
      await c.query(
        `INSERT INTO property_documents (property_id, document_name, document_type, sort_order)
         VALUES (?,?,?,?)`,
        [propId, d.name, d.type || 'PDF', ii]
      );
    }
    for (const [ii, m] of (pr.progress || []).entries()) {
      await c.query(
        `INSERT INTO property_milestones (property_id, phase_name, phase_date_text, is_done, sort_order)
         VALUES (?,?,?,?,?)`,
        [propId, m.phase, m.date, m.done ? 1 : 0, ii]
      );
    }
  }

  return projectId;
}

/**
 * Ghi nội dung của MỘT phân khu (hoặc cấp dự án khi code='__all').
 * Chỉ động tới dữ liệu của phân khu đó — phần còn lại của dự án giữ nguyên.
 * Dùng cho endpoint PUT /api/subdivision/:code (nút "Lưu" từng phân khu).
 *
 * @param {object} c           client đã BEGIN transaction
 * @param {number} projectId   id dự án
 * @param {string} code        mã phân khu, hoặc '__all'
 * @param {object} payload     { legal, location, timeline, resources, gallery, children }
 */
export async function importSubdivision(c, projectId, code, payload) {
  const sub = code === '__all' ? null : code;
  // MySQL: ràng buộc cột NULL — dùng "IS NULL" / "= ?" tuỳ trường hợp.
  const eqSub = sub === null ? 'IS NULL' : '= ?';
  const subParams = sub === null ? [projectId] : [projectId, sub];

  // ---- legal: project_statistics(>=100) + legal_documents + testimonials
  await c.query(
    `DELETE FROM project_statistics
       WHERE project_id=? AND sort_order>=100 AND subdivision_code ${eqSub}`,
    subParams
  );
  await c.query(
    `DELETE FROM legal_documents WHERE project_id=? AND subdivision_code ${eqSub}`,
    subParams
  );
  await c.query(
    `DELETE FROM project_testimonials WHERE project_id=? AND subdivision_code ${eqSub}`,
    subParams
  );
  const legal = payload.legal || {};
  for (const [i, s] of (legal.developerStats || []).entries()) {
    await c.query(
      `INSERT INTO project_statistics
         (project_id, subdivision_code, label, unit_label, value_text, numeric_value, sort_order)
       VALUES (?,?,?,?,?,?,?)`,
      [projectId, sub, s.label, s.unit, s.value, numFrom(s.value), 100 + i]
    );
  }
  for (const [i, d] of (legal.documents || []).entries()) {
    await c.query(
      `INSERT INTO legal_documents
         (project_id, subdivision_code, document_name, detail_text, is_completed, sort_order)
       VALUES (?,?,?,?,?,?)`,
      [projectId, sub, d.name, d.detail, d.done ? 1 : 0, i]
    );
  }
  for (const [i, t] of (legal.testimonials || []).entries()) {
    await c.query(
      `INSERT INTO project_testimonials
         (project_id, subdivision_code, initials, customer_role, unit_label, testimonial_text, sort_order)
       VALUES (?,?,?,?,?,?,?)`,
      [projectId, sub, t.initials, t.role, t.unit, t.text, i]
    );
  }

  // ---- location + nearby_places ----
  const oldLoc = await c.query(
    `SELECT id FROM project_locations WHERE project_id=? AND subdivision_code ${eqSub}`,
    subParams
  );
  for (const r of oldLoc.rows) {
    await c.query('DELETE FROM nearby_places WHERE project_location_id=?', [r.id]);
  }
  await c.query(
    `DELETE FROM project_locations WHERE project_id=? AND subdivision_code ${eqSub}`,
    subParams
  );
  if (payload.location) {
    const loc = payload.location;
    const locRes = await c.query(
      `INSERT INTO project_locations
         (project_id, subdivision_code, latitude, longitude, map_embed_url)
       VALUES (?,?,?,?,?)`,
      [projectId, sub, loc.lat ?? null, loc.lng ?? null, loc.mapSrc || null]
    );
    const locId = insertId(locRes);
    for (const [i, n] of (loc.nearby || []).entries()) {
      await c.query(
        `INSERT INTO nearby_places
           (project_location_id, category_code, name, distance_km, distance_text,
            travel_minutes, travel_time_text, sort_order)
         VALUES (?,?,?,?,?,?,?,?)`,
        [locId, n.cat, n.name, numFrom(n.dist), n.dist,
         numFrom(n.time), n.time, i]
      );
    }
  }

  // ---- timeline ----
  await c.query(
    `DELETE FROM construction_milestones WHERE project_id=? AND subdivision_code ${eqSub}`,
    subParams
  );
  for (const [i, t] of (payload.timeline || []).entries()) {
    await c.query(
      `INSERT INTO construction_milestones
         (project_id, subdivision_code, phase_name, milestone_date_text,
          status_code, description, sort_order)
       VALUES (?,?,?,?,?,?,?)`,
      [projectId, sub, t.phase, t.date, t.status, t.desc, i]
    );
  }

  // ---- resources ----
  await c.query(
    `DELETE FROM project_resources WHERE project_id=? AND subdivision_code ${eqSub}`,
    subParams
  );
  for (const [i, key] of Object.keys(payload.resources || {}).entries()) {
    const r = payload.resources[key];
    await c.query(
      `INSERT INTO project_resources
         (project_id, subdivision_code, resource_key, title, resource_type, resource_url, sort_order)
       VALUES (?,?,?,?,?,?,?)`,
      [projectId, sub, key, r.title, r.type, r.url || '', i]
    );
  }

  // ---- gallery của phân khu này ----
  await c.query(
    `DELETE FROM gallery_items WHERE project_id=? AND subdivision_code ${eqSub}`,
    subParams
  );
  for (const [i, g] of (payload.gallery || []).entries()) {
    let folderId = null;
    if (g.folder) {
      await c.query(
        `INSERT INTO gallery_folders (project_id, folder_name, sort_order)
         VALUES (?,?,0)
         ON DUPLICATE KEY UPDATE folder_name = VALUES(folder_name)`,
        [projectId, g.folder]
      );
      folderId = (
        await c.query(
          'SELECT id FROM gallery_folders WHERE project_id=? AND folder_name=?',
          [projectId, g.folder]
        )
      ).rows[0].id;
    }
    await c.query(
      `INSERT INTO gallery_items
         (project_id, gallery_folder_id, subdivision_code, media_type, source_provider,
          title, source_url, poster_url, sort_order, metadata)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [projectId, folderId, sub, g.type, g.videoSource || 'external', g.title,
       g.src, g.poster || g.thumb || null, i,
       JSON.stringify({ thumb: g.thumb || null })]
    );
  }

  // ---- children: nhóm con (chỉ áp dụng cho phân khu thật, không phải __all)
  if (sub && payload.children && typeof payload.children === 'object') {
    const itRow = await c.query(
      `SELECT mi.id FROM menu_items mi
         JOIN menu_groups mg ON mg.id = mi.menu_group_id
        WHERE mg.project_id=? AND mg.code='phanKhu' AND mi.item_code=?`,
      [projectId, sub]
    );
    if (itRow.rows.length) {
      const parentItemId = itRow.rows[0].id;
      // Xoá nhóm con cũ của phân khu (CASCADE xoá menu_items con)
      await c.query(
        'DELETE FROM menu_groups WHERE parent_menu_item_id=?', [parentItemId]
      );
      const childLabels = {
        tienIchNoiKhu: 'Tiện ích nội khu',
        tienIchNgoaiKhu: 'Tiện ích ngoại khu',
        matBangTang: 'Mặt bằng tầng',
        view360Can: 'View 360 căn',
      };
      for (const [ci, childCode] of Object.keys(payload.children).entries()) {
        const cgRes = await c.query(
          `INSERT INTO menu_groups
             (project_id, parent_menu_item_id, code, display_name, sort_order)
           VALUES (?,?,?,?,?)`,
          [projectId, parentItemId, childCode, childLabels[childCode] || childCode, ci]
        );
        const childGroupId = insertId(cgRes);
        for (const [i2, child] of (payload.children[childCode] || []).entries()) {
          await c.query(
            `INSERT INTO menu_items (menu_group_id, item_code, label, hotspot_code, sort_order)
             VALUES (?,?,?,?,?)`,
            [childGroupId, child.id, child.label, child.tdvPanoramaId || null, i2]
          );
        }
      }
    }
  }
}
