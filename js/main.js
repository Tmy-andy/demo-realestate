/* ============================================
   AURORA HEIGHTS — UI & APP LOGIC
   ============================================ */

let DATA = null;
let currentPanoramaId = null;
let currentMenuItemId = null;
/* Nhóm gốc của np-list — chỉ Tổng quan + Phân khu. 4 nhóm còn lại
   (Tiện ích nội/ngoại khu, Mặt bằng, View 360) giờ là CON của mỗi phân khu. */
const ROOT_GROUPS = [
  { key: "tongQuan", i18n: "group.tongQuan", label: "Tổng quan", short: "TQ" },
  { key: "phanKhu",  i18n: "group.phanKhu",  label: "Phân khu",  short: "PK" },
];
/* Nhóm con bên trong 1 phân khu */
const CHILD_GROUPS = [
  { key: "tienIchNoiKhu",   i18n: "group.tienIchNoiKhu",   label: "Tiện ích nội khu",    short: "NK" },
  { key: "tienIchNgoaiKhu", i18n: "group.tienIchNgoaiKhu", label: "Tiện ích ngoại khu",  short: "NG" },
  { key: "matBangTang",     i18n: "group.matBangTang",     label: "Mặt bằng tầng",       short: "MB" },
  { key: "view360Can",      i18n: "group.view360",         label: "View 360 căn hộ",     short: "VR" },
];
const _gl = (g) => {
  if (!g) return '';
  if (g.i18n) {
    const v = _t(g.i18n);
    if (v && v !== g.i18n) return v;
  }
  return _tr(g.label);
};
const _tr = (s) => (window.I18n ? window.I18n.tr(s) : s);
const _t  = (k, v) => (window.I18n ? window.I18n.t(k, v) : k);
let openGroupKey = null;   // nhóm gốc đang mở (mặc định Tổng quan thu lại)
let openSubItemId = null;        // id phân khu đang được xổ trong np-list
/* Phân khu đang ACTIVE để tự động lọc 5 overlay + BĐS.
   null = chế độ Tổng quan (không lọc). */
let activeSubdivision = null;
window.getActiveSubdivision = () => activeSubdivision;

/* Đổi phân khu active → rebuild 5 panel (pháp lý/vị trí/tiến độ/thư viện/
   tài liệu) + đồng bộ bộ lọc BĐS. Gọi khi người dùng chọn phân khu ở
   np-list, hoặc về null khi xem Tổng quan. */
function setActiveSubdivision(subId) {
  if (activeSubdivision === subId) return;
  activeSubdivision = subId;
  if (!DATA) return;
  // 5 panel render lại theo phân khu (tab tự nhảy sang phân khu này).
  // Reset *SubKey về null để 5 panel bám theo activeSubdivision mới.
  legalSubKey = locationSubKey = timelineSubKey = resourcesSubKey = gallerySubKey = null;
  buildGallery();
  buildLegalPanel();
  buildLocationPanel();
  buildTimelinePanel();
  buildResourcesPanel();
  renderSubdivisionDock();
  // Project card cần render lại để nút Tiến độ ẩn/hiện theo phân khu mới.
  if (typeof syncProjectCard === "function") syncProjectCard();
  // BĐS: properties.js tự đọc getActiveSubdivision() khi mở modal
  if (typeof window.syncPropertiesSubdivision === "function") {
    window.syncPropertiesSubdivision();
  }
}
window.setActiveSubdivision = setActiveSubdivision;

/* Danh sách phân khu {id,label} — dùng dựng tab/dropdown cho 5 panel */
function subdivisionList() {
  return ((DATA && DATA.menu && DATA.menu.phanKhu) || [])
    .map(p => ({ id: p.id, label: p.label }));
}

async function boot() {
  await window.DataSource.applyTheme(); // áp màu theme từ CSDL trước khi render
  // Chờ I18n nạp xong ngôn ngữ + chuỗi dịch từ CSDL trước khi build UI,
  // nếu không UI sẽ hiện key thô (vd "ui.book") trong giây đầu.
  if (window.I18n && window.I18n.ready) { try { await window.I18n.ready; } catch (e) {} }
  DATA = await window.DataSource.fetchProjectData();
  window.DATA = DATA; // expose for mobile-stepper.js

  // Đồng bộ nguồn dữ liệu: properties là nguồn duy nhất.
  // Bảng giá (floorplan.units) và modal BĐS (properties) dùng chung.
  if (Array.isArray(DATA.properties) && DATA.properties.length) {
    DATA.floorplan = DATA.floorplan || {};
    DATA.floorplan.units = DATA.properties;
  } else {
    DATA.floorplan = DATA.floorplan || { units: [] };
    DATA.properties = DATA.floorplan.units || (DATA.floorplan.units = []);
  }

  buildBrand();
  buildProjectCard();
  if (DATA.project.promoDeadline) startCountdown(DATA.project.promoDeadline);
  buildTimelineAndUnits();
  buildTimelinePanel();
  buildNavPanel();
  buildGallery();
  buildLegalPanel();
  buildLocationPanel();
  buildResourcesPanel();
  bindControls();
  bindModal();
  bindPanelCollapse();
  bindSmartHide();
  bindOverlays();
  bindBotchat();
  bindTour();
  bindLanguage();
  if (window.I18n) {
    window.I18n.applyStatic();
    window.I18n.onChange(() => {
      window.I18n.applyStatic();
      rebuildDynamic();
    });
  }

  // Pick first menu item that has a panorama as the initial view
  const firstGroup = DATA.menu?.tongQuan || [];
  const firstItem = firstGroup.find(m => m.tdvPanoramaId) || firstGroup[0];
  if (firstItem) {
    currentMenuItemId = firstItem.id;
    if (firstItem.tdvPanoramaId) goToPanorama(firstItem.tdvPanoramaId);
  }

  // Hide loader after first paint
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 900);
}

/** Đổi panorama bằng cách gọi trực tiếp TDV.Tour (qua panorama-host.js).
    Nếu tour chưa init xong (boot ban đầu) thì hàng đợi sẽ retry. */
function goToPanorama(panoName) {
  if (!panoName) return;
  currentPanoramaId = panoName;
  window.dispatchEvent(new CustomEvent('panoramaChange', { detail: { panoId: panoName } }));
  if (typeof window.openPanoramaByName === 'function') {
    var ok = window.openPanoramaByName(panoName);
    if (!ok && !window.__panoramaHostReady) {
      // Tour chưa sẵn sàng — chờ tourInitialized rồi thử lại đúng 1 lần.
      var retry = function () {
        window.removeEventListener('tourInitialized', retry);
        window.openPanoramaByName(panoName);
      };
      window.addEventListener('tourInitialized', retry);
    }
  }
  // Update scene info bar
  const item = findMenuItemByPanorama(panoName);
  if (item) {
    const el = document.getElementById("scene-title");
    if (el) el.textContent = _tr(item.label);
    const sub = document.getElementById("scene-subtitle");
    if (sub) sub.textContent = panoName;
    const typ = document.getElementById("scene-type");
    if (typ) typ.textContent = "";
  }
  // #3/#7 — đồng bộ project-card. Ưu tiên menu item đang được chọn
  // (currentMenuItemId) vì nhiều item có thể chung 1 panorama.
  syncProjectCard();
}

/* ------------------------------------------------------------------
   Duyệt menu — np-list giờ 2 cấp: phân khu chứa children.
   walkMenuItems() trả mọi item phẳng kèm ngữ cảnh:
     { item, groupKey, subdivisionId|null }
   subdivisionId = id phân khu cha (null nếu item ở nhóm gốc).
   ------------------------------------------------------------------ */
function walkMenuItems() {
  if (!DATA || !DATA.menu) return [];
  const out = [];
  for (const g of ROOT_GROUPS) {
    for (const it of (DATA.menu[g.key] || [])) {
      out.push({ item: it, groupKey: g.key, subdivisionId: null });
      // Phân khu: duyệt children
      if (it.children) {
        for (const cg of CHILD_GROUPS) {
          for (const child of (it.children[cg.key] || [])) {
            out.push({ item: child, groupKey: cg.key, subdivisionId: it.id });
          }
        }
      }
    }
  }
  return out;
}

/* Render project-card khớp với currentMenuItemId. Nếu item không có
   detail/subdivision → về chế độ overview. */
function getMenuItemById(id) {
  if (!id || !DATA) return null;
  const hit = walkMenuItems().find(e => e.item.id === id);
  return hit ? hit.item : null;
}
/* Trả ngữ cảnh đầy đủ của 1 item (gồm subdivisionId, groupKey) */
function getMenuEntryById(id) {
  if (!id || !DATA) return null;
  return walkMenuItems().find(e => e.item.id === id) || null;
}
function syncProjectCard() {
  if (typeof renderProjectCard !== "function") return;
  const item = getMenuItemById(currentMenuItemId)
            || (currentPanoramaId ? findMenuItemByPanorama(currentPanoramaId) : null);
  renderProjectCard(item);
}

/** Programmatic API: navigate by menu item id (for chatbot integration) */
function goToMenuItem(menuItemId) {
  const entry = getMenuEntryById(menuItemId);
  if (!entry) return false;
  currentMenuItemId = menuItemId;
  lockNavSelection();
  if (entry.subdivisionId) {
    // item con của phân khu — mở nhóm Phân khu, xổ phân khu cha
    openGroupKey = "phanKhu";
    openSubItemId = entry.subdivisionId;
    setActiveSubdivision(entry.subdivisionId);
  } else {
    openGroupKey = entry.groupKey;
    if (entry.groupKey === "phanKhu") {
      openSubItemId = entry.item.id;
      setActiveSubdivision(entry.item.id);
    } else {
      openSubItemId = null;
      setActiveSubdivision(null);
    }
  }
  if (entry.item.tdvPanoramaId) goToPanorama(entry.item.tdvPanoramaId);
  renderNavList();
  return true;
}
window.goToMenuItem = goToMenuItem;
window.goToPanorama = goToPanorama;

/** Find a menu item by its panorama ID */
function findMenuItemByPanorama(panoName) {
  const hit = walkMenuItems().find(e => e.item.tdvPanoramaId === panoName);
  return hit ? hit.item : null;
}

/* ------------------------------------------------------------------
   #1 — Hotspot → np-list sync.
   Khi panorama đổi (kể cả do người dùng click hotspot trong iframe
   3DVista), tìm menu item tương ứng, mở đúng nhóm, set active và
   cuộn np-card vào tầm nhìn. Bỏ qua nếu panorama không khớp item nào.
   ------------------------------------------------------------------ */
/* Cờ: người dùng vừa chọn 1 mục trong np-list. Trong khoảng ngắn
   sau đó, mọi sự kiện panoramaChange/onSceneChange tự động (echo từ
   chính lần chọn đó, hoặc từ iframe) sẽ KHÔNG ghi đè lựa chọn —
   tránh việc click phân khu lại bị active sang Tổng quan do trùng pano. */
let _navLockUntil = 0;
function lockNavSelection() { _navLockUntil = Date.now() + 1200; }

function syncNavToPanorama(panoName) {
  if (!panoName || !DATA) return;
  // Người dùng vừa chủ động chọn mục → không tự đổi active
  if (Date.now() < _navLockUntil) return;

  const bare = panoName.replace(/_0$/, "");
  const matches = (m) =>
    m.tdvPanoramaId === panoName || m.tdvPanoramaId === bare ||
    m.hotspotId === panoName || m.hotspotId === bare;

  // Nếu menu item đang chọn vẫn khớp panorama này → giữ nguyên,
  // tránh nhảy sang nhóm khác khi nhiều item dùng chung 1 panorama
  // (vd. phân khu và tổng quan cùng trỏ tới pano-22).
  const current = getMenuItemById(currentMenuItemId);
  if (current && matches(current)) return;

  const foundEntry = walkMenuItems().find(e => matches(e.item));
  if (!foundEntry) return;
  const found = foundEntry.item;
  if (found.id === currentMenuItemId) return;
  currentMenuItemId = found.id;
  if (foundEntry.subdivisionId) {
    openGroupKey = "phanKhu";
    openSubItemId = foundEntry.subdivisionId;
    setActiveSubdivision(foundEntry.subdivisionId);
  } else {
    openGroupKey = foundEntry.groupKey;
    if (foundEntry.groupKey === "phanKhu") {
      openSubItemId = found.id;
      setActiveSubdivision(found.id);
    } else {
      openSubItemId = null;
      setActiveSubdivision(null);
    }
  }
  renderNavList();
  syncProjectCard();
  const activeCard = document.querySelector(`.np-card[data-id="${found.id}"]`);
  if (activeCard) activeCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
window.addEventListener("panoramaChange", (e) => {
  if (e?.detail?.panoId) syncNavToPanorama(e.detail.panoId);
});
/* vr-bridge.js fires onSceneChange khi iframe 3DVista báo đổi cảnh
   (gồm cả click hotspot bên trong khung 360°). Đăng ký sau khi
   VRBridge sẵn sàng — vr-bridge.js load sau main.js nên defer 1 tick. */
function bindHotspotSync() {
  if (window.VRBridge && typeof window.VRBridge.onSceneChange === "function") {
    window.VRBridge.onSceneChange(({ nodeId }) => syncNavToPanorama(nodeId));
  } else {
    setTimeout(bindHotspotSync, 200);
  }
}
bindHotspotSync();

function buildBrand() {
  const parts = DATA.project.name.split(' ');
  const nameEl = document.querySelector(".brand-text .name");
  const subEl = document.querySelector(".brand-text .sub");
  if (nameEl) nameEl.textContent = parts[0] || DATA.project.name;
  if (subEl) subEl.textContent = parts.slice(1).join(' ') || I18n.t("ui.vrExperience");
}

/* ============================================================
   #3 / #7 — PROJECT CARD render động
   3 chế độ:
     - "overview"     : dự án tổng quan chung (ảnh 1) — khi menu item
                        không có thông tin chi tiết
     - "detail"       : chi tiết điểm đến (ảnh 2) — khi menu item có
                        trường `detail`
     - "subdivision"  : phân khu (ảnh 5/6/7 gom 1 card) — khi menu
                        item thuộc cat phanKhu (có `subdivision`)
   ============================================================ */
const PC_ICONS = {
  area:    'square',
  port:    'anchor',
  transit: 'bus',
  road:    'route',
  leaf:    'leaf',
  map:     'box',
  grid:    'layout-grid',
  home:    'home',
  doc:     'file-text',
  pin:     'map-pin',
};
function pcIcon(name, size = 16) {
  return `<i data-lucide="${PC_ICONS[name] || PC_ICONS.pin}" width="${size}" height="${size}"></i>`;
}
window.pcIcon = pcIcon; // dùng bởi masterplan.js / properties.js

function buildProjectCard() {
  const p = DATA.project;
  document.getElementById("pc-title").textContent = p.name;
  document.getElementById("pc-loc").innerHTML =
    `${pcIcon("pin", 11)} ${_tr(p.location)}`;
  document.getElementById("pc-status").innerHTML = `<span class="dot"></span> ${_tr(p.status)}`;
  renderProjectCard(null);
  applySaleContact();
}

/* Render nội dung project-card theo menu item hiện tại.
   item = null → chế độ overview. */
function renderProjectCard(item) {
  const host = document.getElementById("pc-dynamic");
  if (!host) return;
  if (item && item.subdivision) {
    host.innerHTML = pcSubdivisionHTML(item.subdivision, item.tdvPanoramaId);
  } else if (item && item.detail) {
    host.innerHTML = pcDetailHTML(item.detail);
  } else {
    host.innerHTML = pcOverviewHTML();
  }
  // 5 nút nội dung (pháp lý/vị trí/tiến độ/thư viện/tài liệu) — yêu cầu #3.
  // Đặt cuối project-card. Khi có phân khu active → tự lọc theo phân khu;
  // ở Tổng quan → hiển thị đầy đủ (tab "Tất cả").
  host.insertAdjacentHTML("beforeend", pcContentButtonsHTML());
  bindPcDynamic(host);
}

/* Có mốc tiến độ cho phân khu chỉ định?
   Ở Tổng quan (subId = null) → KHÔNG hiện, vì tiến độ chỉ áp dụng cho
   từng phân khu cụ thể. */
function hasTimelineFor(subId) {
  if (!subId) return false;
  const tl = DATA && DATA.timeline;
  if (!tl) return false;
  const arr = tl[subId];
  return Array.isArray(arr) && arr.length > 0;
}

/* Khối nút nội dung trong project-card */
function pcContentButtonsHTML() {
  const sub = activeSubdivision
    ? subdivisionList().find(s => s.id === activeSubdivision)
    : null;
  const note = sub
    ? `<div class="pc-cbtn-note">${pcIcon("pin", 12)} ${_t("ui.pc.filteringBy")}: <strong>${_tr(sub.label)}</strong></div>`
    : `<div class="pc-cbtn-note">${_t("ui.pc.overviewFull")}</div>`;
  const btn = (action, icon, labelKey, fallback) => `
    <button class="pc-cbtn" data-action="${action}">
      <span class="pc-cbtn-ico">${pcIcon(icon, 15)}</span>
      <span class="pc-cbtn-label">${_t(labelKey) || fallback}</span>
    </button>`;
  return `
    <div class="pc-section pc-content-btns">
      <div class="pc-block-title">${_t("ui.projectContent") || "Nội dung dự án"}</div>
      ${note}
      <div class="pc-cbtn-grid">
        ${btn("open-legal",     "doc",  "ui.legal",     "Pháp lý")}
        ${btn("open-location",  "pin",  "ui.location",  "Vị trí")}
        ${hasTimelineFor(activeSubdivision) ? btn("open-timeline", "road", "ui.timeline", "Tiến độ") : ''}
        ${btn("open-gallery",   "grid", "ui.gallery",   "Thư viện")}
        ${btn("open-resources", "doc",  "ui.resources", "Tài liệu")}
      </div>
    </div>`;
}

/* ── Chế độ overview (ảnh 1) ── */
function pcOverviewHTML() {
  const p = DATA.project;
  const ov = p.cardOverview || {};
  const highlights = (ov.highlights || []).map(h => `
    <div class="pc-hl-row">
      <span class="pc-hl-icon">${pcIcon(h.icon)}</span>
      <span class="pc-hl-label">${_tr(h.label)}</span>
      <span class="pc-hl-value">${_tr(h.value)}</span>
    </div>`).join("");
  const links = (ov.quickLinks || []).map(l => `
    <button class="pc-quick-link" data-action="${l.id}">
      <span class="pc-ql-icon">${pcIcon(l.icon)}</span>
      <span class="pc-ql-label">${_tr(l.label)}</span>
      <i class="pc-ql-arrow" data-lucide="chevron-right" width="14" height="14"></i>
    </button>`).join("");
  return `
    <div class="pc-section pc-overview">
      ${ov.description ? `<p class="pc-desc">${_tr(ov.description)}</p>` : ""}
      ${highlights ? `
        <div class="pc-block-title">${_t('ui.pc.highlightInfo')}</div>
        <div class="pc-hl-list">${highlights}</div>` : ""}
      ${links ? `
        <div class="pc-block-title">Liên kết nhanh</div>
        <div class="pc-quick-links">${links}</div>` : ""}
    </div>`;
}

/* ── Chế độ detail (ảnh 2) ── */
function pcDetailHTML(d) {
  const imgs = d.images || [];
  const main = imgs[0] || "";
  // Thumbnail thanh dưới: lazy load — ảnh nhỏ nhưng vẫn nhiều
  const thumbs = imgs.map((src, i) => `
    <button class="pc-thumb ${i === 0 ? "active" : ""}" data-src="${src}">
      <img data-lazy="${src}" alt="" loading="lazy" decoding="async"
           style="opacity:0;transition:opacity .2s" onload="this.style.opacity=1"/>
    </button>`).join("");
  const specs = (d.specs || []).map(s => `
    <div class="pc-spec-row">
      <span class="pc-spec-label">${_tr(s.label)}</span>
      <span class="pc-spec-value">${_tr(s.value)}</span>
    </div>`).join("");
  return `
    <div class="pc-section pc-detail">
      <div class="pc-detail-head">
        <span class="pc-detail-icon">${pcIcon("pin", 15)}</span>
        <div>
          <div class="pc-detail-eyebrow">Chi tiết điểm đến</div>
          <div class="pc-detail-title">${_tr(d.title)}</div>
        </div>
      </div>
      ${d.category || d.subtitle ? `
        <div class="pc-tag-row">
          ${d.subtitle ? `<span class="pc-tag">${_tr(d.subtitle)}</span>` : ""}
          ${d.category ? `<span class="pc-tag pc-tag-soft">${_tr(d.category)}</span>` : ""}
        </div>` : ""}
      ${main ? `
        <div class="pc-gallery">
          <div class="pc-gallery-main"><img id="pc-gallery-img" src="${main}" alt=""/></div>
          ${imgs.length > 1 ? `<div class="pc-gallery-thumbs">${thumbs}</div>` : ""}
        </div>` : ""}
      ${d.description ? `<p class="pc-desc">${_tr(d.description)}</p>` : ""}
      ${specs ? `<div class="pc-spec-list">${specs}</div>` : ""}
    </div>`;
}

/* ── Chế độ subdivision / phân khu (ảnh 5/6/7) ──
   panoId: panorama riêng của phân khu (item.tdvPanoramaId) */
function pcSubdivisionHTML(s, panoId) {
  const facts = (s.facts || []).map(f => `
    <div class="pc-spec-row">
      <span class="pc-spec-label">${_tr(f.label)}</span>
      <span class="pc-spec-value">${_tr(f.value)}</span>
    </div>`).join("");
  const points = (s.points || []).map((pt, i) => `
    <div class="pc-point-row">
      <span class="pc-point-num">${i + 1}</span>
      <span class="pc-point-text">${_tr(pt)}</span>
    </div>`).join("");
  const mediaInner = s.video
    ? `<button class="pc-video-btn" data-video="${s.video}">
         <i data-lucide="play-circle" width="40" height="40"></i>
         <span>${_t('ui.pc.watchIntroVideo')}</span>
       </button>`
    : "";
  return `
    <div class="pc-section pc-subdivision">
      <div class="pc-detail-eyebrow">${_t('ui.pc.subdivision')}</div>
      <div class="pc-sub-title">${_tr(s.name)}</div>
      ${s.cover ? `
        <div class="pc-sub-media" ${s.cover ? `style="background-image:url('${s.cover}')"` : ""}>
          ${mediaInner}
        </div>` : ""}
      ${facts ? `
        <div class="pc-block-title">${_t('ui.pc.overviewInfo')}</div>
        <div class="pc-spec-list">${facts}</div>` : ""}
      ${s.desc ? `<p class="pc-desc">${_tr(s.desc)}</p>` : ""}
      ${points ? `
        <div class="pc-block-title">${_t('ui.pc.highlightPoints')}</div>
        <div class="pc-point-list">${points}</div>` : ""}
      <div class="pc-sub-actions">
        <button class="tb-btn tb-btn-primary tb-btn-block" data-action="open-properties">${_t('ui.pc.viewProductsInPk')}</button>
        ${panoId
          ? `<button class="tb-btn tb-btn-block" data-action="goto-pano" data-pano="${panoId}">${_t('ui.pc.exploreVrTour')}</button>`
          : `<button class="tb-btn tb-btn-block" data-action="open-masterplan">${_t('ui.pc.exploreVrTour')}</button>`}
      </div>
    </div>`;
}

/* Bind tương tác trong vùng pc-dynamic */
function bindPcDynamic(host) {
  // Lazy load thumbnails trong panel chi tiết
  lazyLoadImages(host.querySelectorAll('img[data-lazy]'), 'data-lazy');
  // Gallery thumbnail switch
  host.querySelectorAll(".pc-thumb").forEach(t => {
    t.addEventListener("click", () => {
      const img = document.getElementById("pc-gallery-img");
      if (img) img.src = t.dataset.src;
      host.querySelectorAll(".pc-thumb").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
    });
  });
  // Quick links / actions
  host.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => handlePcAction(btn.dataset.action, btn.dataset));
  });
  // Video button
  host.querySelectorAll(".pc-video-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const url = btn.dataset.video;
      if (!url) return;
      if (typeof openLightbox === "function" && window.__pcVideoIntoLightbox) return;
      window.open(url, "_blank", "noopener");
    });
  });
}

/* Điều phối action từ project-card */
function handlePcAction(action, data) {
  switch (action) {
    case "open-modal":
      document.getElementById("modal-backdrop")?.classList.add("open");
      break;
    case "goto-pano":
      if (data && data.pano) goToPanorama(data.pano);
      break;
    case "open-masterplan":
      if (typeof window.openMasterplan === "function") window.openMasterplan();
      break;
    case "open-properties":
      if (typeof window.openPropertiesModal === "function") window.openPropertiesModal();
      break;
    case "open-phankhu": {
      // Mở np-list tại nhóm Phân khu
      openGroupKey = "phanKhu";
      renderNavList();
      const np = document.getElementById("nav-panel");
      if (np) { np.classList.remove("collapsed"); document.body.classList.remove("nav-panel-collapsed"); }
      break;
    }
    // 5 overlay nội dung — mở từ nút trong project-card
    case "open-legal":
      document.getElementById("legal-overlay")?.classList.add("open");
      break;
    case "open-location": {
      const ifr = document.getElementById("location-iframe");
      const loc = currentLocationData();
      if (ifr && loc.mapSrc) ifr.setAttribute("src", loc.mapSrc);
      document.getElementById("location-overlay")?.classList.add("open");
      break;
    }
    case "open-timeline":
      document.getElementById("timeline-overlay")?.classList.add("open");
      break;
    case "open-gallery":
      document.getElementById("gallery-overlay")?.classList.add("open");
      break;
    case "open-resources":
      document.getElementById("resources-overlay")?.classList.add("open");
      break;
  }
}

/* ------------------------------------------------------------------
   Sale attribution: index.html?s=<username> selects which sale's
   contact info (phone, zalo, facebook) is shown on the public VR site.
   Without a valid ?s=, all direct-contact CTAs are hidden — the
   project itself no longer exposes a default hotline/zalo.
   ------------------------------------------------------------------ */
/* Slug sale: ưu tiên path /<id> (vd /sales2), fallback ?s=<id>.
   Bỏ qua file tĩnh và đường dẫn rỗng. */
function getSaleSlug() {
  const seg = location.pathname.split("/").filter(Boolean).pop() || "";
  if (seg && !/\.[a-z0-9]+$/i.test(seg)) return seg.trim().toLowerCase();
  return (new URLSearchParams(location.search).get("s") || "").trim().toLowerCase();
}

function getActiveSale() {
  const sales = (DATA && DATA.sales) || [];
  if (!sales.length) return null;
  const u = getSaleSlug();
  if (!u) return null;
  // ?s= khớp public_slug (id riêng custom được); fallback username.
  return sales.find(s =>
    (s.slug || "").toLowerCase() === u ||
    (s.username || "").toLowerCase() === u
  ) || null;
}

function applySaleContact() {
  const sale = getActiveSale();
  window.__activeSale = sale;

  const contactRow = document.querySelector(".pc-contact-row");
  const hotlineBtn = document.getElementById("pc-hotline-btn");
  const hotlineNum = document.getElementById("pc-hotline-num");
  const zaloBtn    = document.getElementById("pc-zalo-btn");
  const formZalo   = document.getElementById("form-suc-zalo");

  if (!sale) {
    if (contactRow) contactRow.style.display = "none";
    if (formZalo) formZalo.style.display = "none";
    return;
  }

  if (contactRow) contactRow.style.display = "";
  if (formZalo) formZalo.style.display = "";

  if (sale.phone) {
    if (hotlineNum) hotlineNum.textContent = sale.phone;
    if (hotlineBtn) hotlineBtn.href = "tel:" + sale.phone.replace(/\s/g, "");
  } else if (hotlineBtn) {
    hotlineBtn.style.display = "none";
  }

  const zaloUrl = sale.zalo ? "https://zalo.me/" + sale.zalo.replace(/\s/g, "") : "";
  if (sale.zalo) {
    if (zaloBtn)  zaloBtn.href  = zaloUrl;
    if (formZalo) formZalo.href = zaloUrl;
  } else {
    [zaloBtn, formZalo].forEach(el => { if (el) el.style.display = "none"; });
  }
}

/* Countdown timer for promo deadline */
let _cdInterval = null;
function startCountdown(deadlineStr) {
  const cdEl = document.getElementById("pc-cd-time");
  if (!cdEl || !deadlineStr) return;

  function tick() {
    const now = new Date();
    const end = new Date(deadlineStr);
    const diff = end - now;
    if (diff <= 0) {
      cdEl.textContent = I18n.t("ui.expired");
      cdEl.setAttribute("data-i18n", "ui.expired");
      cdEl.classList.add("expired");
      clearInterval(_cdInterval);
      return;
    }
    const totalH = Math.floor(diff / 3600000);
    const d = Math.floor(totalH / 24);
    const h = totalH % 24;
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, "0");
    cdEl.textContent = d > 0
      ? `${d}N ${pad(h)}:${pad(m)}:${pad(s)}`
      : `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  clearInterval(_cdInterval);
  tick();
  _cdInterval = setInterval(tick, 1000);
}

/* timeline giờ là {__all:[...], <pk>:[...]} — helper lấy mảng cấp dự án */
function timelineAllArray() {
  const tl = DATA && DATA.timeline;
  if (Array.isArray(tl)) return tl;             // tương thích dạng cũ
  return (tl && tl.__all) || [];
}

function buildTimelineAndUnits() {
  const tlEl = document.getElementById("timeline-list");
  if (tlEl) {
    tlEl.innerHTML = timelineAllArray().map(t => `
      <div class="tl-row ${t.done ? 'done' : ''}">
        <div class="tl-dot"></div>
        <div class="tl-phase">${_tr(t.phase)}</div>
        <div class="tl-date">${_tr(t.date)}</div>
      </div>
    `).join("");
  }
  buildFloorplanPanel();
}

/* ============================================
   FLOORPLAN PANEL — State & rendering
   ============================================ */
const fpState = {
  activeTypes: new Set(),
  floorGroup: "",
  status: "",
  sortKey: "",
  sortDir: 1,
};

function buildFloorplanPanel() {
  buildFpProgressBars();
  buildFpTypeTags();
  bindFpFilters();
  renderFpTable();
}

function buildFpProgressBars() {
  const wrap = document.getElementById("fp-progress-wrap");
  if (!wrap) return;
  const units = DATA.floorplan.units;
  // Group by type — dùng nhãn loại nếu có
  const typeMap = {};
  units.forEach(u => {
    const key = u.typeLabel || u.type || "Khác";
    if (!typeMap[key]) typeMap[key] = { available: 0, total: 0 };
    typeMap[key].available += (u.available || 0);
    typeMap[key].total     += (u.total || u.available || 1);
  });
  wrap.innerHTML = Object.entries(typeMap).map(([type, d]) => {
    const pct = d.total > 0 ? Math.round((d.available / d.total) * 100) : 0;
    const cls = pct > 50 ? "low" : pct > 20 ? "med" : "hi";
    return `
      <div class="fp-progress-row">
        <div class="fp-progress-type">${_tr(type)}</div>
        <div class="fp-progress-bar-wrap">
          <div class="fp-progress-bar ${cls}" style="width:${pct}%"></div>
        </div>
        <div class="fp-progress-count">${d.available}/${d.total} căn</div>
      </div>`;
  }).join("");
}

function buildFpTypeTags() {
  const wrap = document.getElementById("fp-type-tags");
  if (!wrap) return;
  // Loại duy nhất theo id, kèm nhãn hiển thị
  const seen = {};
  DATA.floorplan.units.forEach(u => {
    if (u.type && !(u.type in seen)) seen[u.type] = u.typeLabel || u.type;
  });
  wrap.innerHTML = Object.entries(seen).map(([t, label]) => `
    <button class="fp-tag ${fpState.activeTypes.has(t) ? 'active' : ''}" data-type="${t}">
      ${_tr(label)}
    </button>
  `).join("");
  wrap.querySelectorAll(".fp-tag").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.type;
      if (fpState.activeTypes.has(t)) fpState.activeTypes.delete(t);
      else fpState.activeTypes.add(t);
      btn.classList.toggle("active", fpState.activeTypes.has(t));
      renderFpTable();
    });
  });
}

function bindFpFilters() {
  const floorSel  = document.getElementById("fp-floor-select");
  const statusSel = document.getElementById("fp-status-select");
  const resetBtn  = document.getElementById("fp-filter-reset");
  if (floorSel)  floorSel.addEventListener("change",  () => { fpState.floorGroup = floorSel.value;  renderFpTable(); });
  if (statusSel) statusSel.addEventListener("change", () => { fpState.status     = statusSel.value; renderFpTable(); });
  if (resetBtn)  resetBtn.addEventListener("click",   () => {
    fpState.activeTypes.clear();
    fpState.floorGroup = "";
    fpState.status     = "";
    fpState.sortKey    = "";
    if (floorSel)  floorSel.value  = "";
    if (statusSel) statusSel.value = "";
    document.querySelectorAll(".fp-tag.active").forEach(t => t.classList.remove("active"));
    renderFpTable();
  });

  // Sortable headers
  document.querySelectorAll(".fp-full-table thead th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (fpState.sortKey === key) fpState.sortDir *= -1;
      else { fpState.sortKey = key; fpState.sortDir = 1; }
      document.querySelectorAll(".fp-full-table thead th").forEach(h => {
        h.classList.remove("sort-asc", "sort-desc");
      });
      th.classList.add(fpState.sortDir === 1 ? "sort-asc" : "sort-desc");
      renderFpTable();
    });
  });
}

function renderFpTable() {
  const tbody = document.getElementById("unit-rows");
  if (!tbody) return;
  let units = [...DATA.floorplan.units];

  // Filter by type
  if (fpState.activeTypes.size > 0) {
    units = units.filter(u => fpState.activeTypes.has(u.type));
  }
  // Filter by floor group
  if (fpState.floorGroup) {
    units = units.filter(u => {
      const f = u.floor || 0;
      if (fpState.floorGroup === "low")  return f >= 1  && f <= 15;
      if (fpState.floorGroup === "mid")  return f >= 16 && f <= 30;
      if (fpState.floorGroup === "high") return f >= 31;
      return true;
    });
  }
  // Filter by status
  if (fpState.status) {
    units = units.filter(u => u.status === fpState.status);
  }
  // Sort
  if (fpState.sortKey) {
    units.sort((a, b) => {
      let av = a[fpState.sortKey], bv = b[fpState.sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return av < bv ? -fpState.sortDir : av > bv ? fpState.sortDir : 0;
    });
  }

  if (!units.length) {
    tbody.innerHTML = `<tr class="fp-empty-row"><td colspan="10">${I18n.t("ui.noFilterResults")}</td></tr>`;
    return;
  }

  const statusLabel = {
    available: _t('ui.status.available'),
    holding:   _t('ui.status.holding'),
    sold:      _t('ui.status.sold'),
  };
  /* properties lưu giá dạng số ("5400000000") — chuyển sang "5.4 tỷ" */
  const fpMoney = (v) => {
    if (v == null || v === "") return "—";
    const s = String(v);
    if (/tỷ|triệu|tr\//i.test(s)) return s; // đã định dạng sẵn
    const n = parseInt(s.replace(/\D/g, ""), 10);
    if (!n) return s;
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.?0+$/, "") + " tr/m²";
    return s;
  };
  tbody.innerHTML = units.map(u => {
    const isSold = u.status === "sold";
    const typeLabel = u.typeLabel || u.type || "—";
    const availTxt = u.available != null ? `${u.available} ${_t("ui.units")}` : "—";
    return `
      <tr class="${isSold ? 'row-sold' : ''}">
        <td><span class="fp-code">${u.code}</span></td>
        <td>${_tr(typeLabel)}</td>
        <td>${u.floor || "—"}</td>
        <td>${u.area} m²</td>
        <td>${u.direction || "—"}</td>
        <td class="fp-price">${fpMoney(u.price)}</td>
        <td class="fp-ppm2">${fpMoney(u.pricePerM2)}</td>
        <td class="fp-avail">${availTxt}</td>
        <td><span class="fp-badge ${u.status}">${statusLabel[u.status] || u.status}</span></td>
        <td>${isSold ? "" : `<button class="fp-interest-btn" data-code="${u.code}" data-type="${_tr(typeLabel)}">Quan tâm</button>`}</td>
      </tr>`;
  }).join("");

  // Bind "Quan tâm" buttons
  tbody.querySelectorAll(".fp-interest-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code;
      const type = btn.dataset.type;
      openModalWithUnit(code, type);
    });
  });
}

/* Open modal and pre-fill unit info */
function openModalWithUnit(code, type) {
  // Open the modal
  document.getElementById("modal-backdrop").classList.add("open");
  // Pre-fill: find the interest select and set it, add code tag
  const sel = document.querySelector("#modal-backdrop select");
  if (sel && type) {
    // try to match option text
    for (const opt of sel.options) {
      if (opt.textContent.includes(type) || type.includes(opt.textContent)) {
        opt.selected = true;
        break;
      }
    }
  }
  // Add code to note field
  const note = document.querySelector("#modal-backdrop textarea");
  if (note && code) {
    const existing = note.value;
    if (!existing.includes(code)) {
      note.value = (existing ? existing + "\n" : "") + `Quan tâm căn: ${code}`;
    }
  }
}

function buildNavPanel() {
  const searchEl = document.getElementById("np-search");
  searchEl?.addEventListener("input", renderNavList);
  renderNavList();
}

/* HTML 1 thẻ item trong np-list */
function npCardHTML(m, i, opts = {}) {
  const isActive = m.id === currentMenuItemId;
  const sub = m.tdvPanoramaId || _t("ui.nearbyAmenity");
  return `
    <div class="np-card ${isActive ? 'active' : ''} ${opts.child ? 'np-card-child' : ''}"
         data-id="${m.id}" data-panorama="${m.tdvPanoramaId || ''}">
      <div class="np-card-idx">${String(i + 1).padStart(2, '0')}</div>
      <div class="np-card-info">
        <div class="np-card-name">${_tr(m.label)}</div>
        <div class="np-card-sub">${sub}</div>
      </div>
      <i class="np-card-arrow" data-lucide="chevron-right" width="14" height="14"></i>
    </div>`;
}

/* Khớp query với label item */
function npMatch(m, query) {
  if (!query) return true;
  return _tr(m.label).toLowerCase().includes(query) ||
         (m.label || "").toLowerCase().includes(query);
}

function renderNavList() {
  const listEl = document.getElementById("np-list");
  if (!listEl) return;
  const menu = DATA.menu || {};
  const query = (document.getElementById("np-search")?.value || "").trim().toLowerCase();

  // Nhóm Tổng quan (xổ list các điểm) + 4 card phân khu phẳng.
  const tqItems = (menu.tongQuan || []).filter(m => npMatch(m, query));
  const pkList = menu.phanKhu || [];

  const parts = [];

  // ── Nhóm Tổng quan: gom thành group có thể xổ/thu ──
  if (tqItems.length || !query) {
    const isOpen = query ? tqItems.length > 0 : openGroupKey === "tongQuan";
    const cards = tqItems.map((m, i) => npCardHTML(m, i)).join("");
    parts.push(`
      <div class="np-group ${isOpen ? 'open' : ''}" data-group="tongQuan">
        <button class="np-group-head" type="button">
          <span class="np-group-icon">TQ</span>
          <span class="np-group-title">${_t('ui.group.tongQuan')}</span>
          <span class="np-group-count">${tqItems.length}</span>
          <i class="np-group-chev" data-lucide="chevron-right" width="14" height="14"></i>
        </button>
        <div class="np-group-body">${cards}</div>
      </div>`);
  }

  // ── 4 phân khu: card phẳng ──
  pkList.forEach((pk, i) => {
    if (!npMatch(pk, query)) return;
    const isActive = pk.id === activeSubdivision || pk.id === currentMenuItemId;
    parts.push(`
      <div class="np-card np-card-flat np-pk-head ${pk.id === activeSubdivision ? 'pk-active' : ''} ${isActive ? 'active' : ''}"
           data-kind="phanKhu" data-pk="${pk.id}" data-id="${pk.id}" data-panorama="${pk.tdvPanoramaId || ''}">
        <div class="np-card-idx">${String(i + 1).padStart(2, '0')}</div>
        <div class="np-card-info">
          <div class="np-card-name">${_tr(pk.label)}</div>
          <div class="np-card-sub">${pk.id === activeSubdivision ? _t('ui.filtering') : (pk.tdvPanoramaId || '')}</div>
        </div>
        <i class="np-card-arrow" data-lucide="chevron-right" width="14" height="14"></i>
      </div>`);
  });

  if (!parts.length) {
    listEl.innerHTML = `<div class="np-empty">${_t("ui.noResults")}</div>`;
    return;
  }
  listEl.innerHTML = parts.join("");
  bindNavListEvents(listEl);
}

/* Gắn sự kiện cho np-list (group Tổng quan + card phân khu phẳng) */
function bindNavListEvents(listEl) {
  /* Toggle group Tổng quan */
  listEl.querySelectorAll(".np-group > .np-group-head").forEach(head => {
    const group = head.parentElement;
    head.addEventListener("click", () => {
      const key = group.dataset.group;
      const wasOpen = group.classList.contains("open");
      group.classList.toggle("open", !wasOpen);
      if (!wasOpen) openGroupKey = key;
      else if (openGroupKey === key) openGroupKey = null;
    });
  });

  /* Click 1 item bên trong Tổng quan */
  listEl.querySelectorAll(".np-group[data-group='tongQuan'] .np-card").forEach(card => {
    card.addEventListener("click", () => {
      currentMenuItemId = card.dataset.id;
      lockNavSelection();
      setActiveSubdivision(null);
      const panoId = card.dataset.panorama;
      if (panoId) goToPanorama(panoId);
      else syncProjectCard();
      listEl.querySelectorAll(".np-card").forEach(c =>
        c.classList.toggle("active", c.dataset.id === currentMenuItemId));
    });
  });

  /* Click 1 card phân khu phẳng */
  listEl.querySelectorAll(".np-card-flat").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      currentMenuItemId = id;
      openGroupKey = "phanKhu";
      openSubItemId = id;
      lockNavSelection();
      setActiveSubdivision(id);
      const panoId = card.dataset.panorama;
      if (panoId) goToPanorama(panoId);
      else syncProjectCard();
      // Chọn ngoài Tổng quan → thu group Tổng quan lại
      const tqGroup = listEl.querySelector(".np-group[data-group='tongQuan']");
      if (tqGroup) tqGroup.classList.remove("open");
      listEl.querySelectorAll(".np-card-flat").forEach(c => {
        c.classList.toggle("active", c.dataset.id === currentMenuItemId);
        c.classList.toggle("pk-active", c.dataset.pk === activeSubdivision);
      });
    });
  });
}

/* ============================================================
   SUBDIVISION DOCK — 4 nút ngang ở bottom trang.
   Chỉ hiện khi có phân khu active. Click → mở popup liệt kê
   items của nhóm con thuộc phân khu đó. Chọn item → goToMenuItem.
   ============================================================ */
const DOCK_ICONS = {
  tienIchNoiKhu:   "leaf",
  tienIchNgoaiKhu: "map-pin",
  matBangTang:     "layout-grid",
  view360Can:      "box",
};
function renderSubdivisionDock() {
  const dock = document.getElementById("sub-dock");
  if (!dock) return;
  if (!activeSubdivision || !DATA) {
    dock.classList.remove("visible");
    document.body.classList.remove("sub-dock-visible");
    dock.innerHTML = "";
    return;
  }
  const pk = (DATA.menu.phanKhu || []).find(p => p.id === activeSubdivision);
  if (!pk) {
    dock.classList.remove("visible");
    document.body.classList.remove("sub-dock-visible");
    dock.innerHTML = "";
    return;
  }
  const children = pk.children || {};
  dock.innerHTML =
    `<div class="sub-dock-label">${pcIcon("pin", 12)} <span>${_tr(pk.label)}</span></div>` +
    `<div class="sub-dock-row">` +
    CHILD_GROUPS.map(cg => {
      const items = children[cg.key] || [];
      const ico = DOCK_ICONS[cg.key] || "box";
      return `
        <button class="sub-dock-btn" data-group="${cg.key}" ${items.length ? "" : "disabled"}>
          <i data-lucide="${ico}" width="18" height="18"></i>
          <span class="sub-dock-btn-label">${_gl(cg)}</span>
          <span class="sub-dock-btn-count">${items.length}</span>
        </button>`;
    }).join("") +
    `</div>`;
  dock.classList.add("visible");
  document.body.classList.add("sub-dock-visible");
  dock.querySelectorAll(".sub-dock-btn").forEach(btn => {
    btn.addEventListener("click", () => openSubDockPopup(btn.dataset.group));
  });
}
function openSubDockPopup(groupKey) {
  const pop = document.getElementById("sub-dock-popup");
  if (!pop || !activeSubdivision || !DATA) return;
  const pk = (DATA.menu.phanKhu || []).find(p => p.id === activeSubdivision);
  if (!pk) return;
  const cg = CHILD_GROUPS.find(g => g.key === groupKey);
  const items = (pk.children && pk.children[groupKey]) || [];
  if (!items.length) return;
  pop.innerHTML =
    `<div class="sdp-head">
       <div>
         <div class="sdp-eyebrow">${_tr(pk.label)}</div>
         <div class="sdp-title">${_gl(cg)} <span class="sdp-count">${items.length}</span></div>
       </div>
       <button class="sdp-close" id="sdp-close" aria-label="Đóng">×</button>
     </div>
     <div class="sdp-list">` +
    items.map((m, i) => `
      <button class="sdp-item" data-id="${m.id}">
        <span class="sdp-idx">${String(i + 1).padStart(2, "0")}</span>
        <span class="sdp-info">
          <span class="sdp-name">${_tr(m.label)}</span>
          <span class="sdp-sub">${m.tdvPanoramaId || ""}</span>
        </span>
        <i data-lucide="chevron-right" width="14" height="14"></i>
      </button>`).join("") +
    `</div>`;
  pop.classList.add("open");
  document.getElementById("sub-dock").querySelectorAll(".sub-dock-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.group === groupKey));
  pop.querySelector("#sdp-close")?.addEventListener("click", closeSubDockPopup);
  pop.querySelectorAll(".sdp-item").forEach(it => {
    it.addEventListener("click", () => {
      const id = it.dataset.id;
      closeSubDockPopup();
      if (typeof window.goToMenuItem === "function") window.goToMenuItem(id);
    });
  });
}
function closeSubDockPopup() {
  const pop = document.getElementById("sub-dock-popup");
  if (pop) pop.classList.remove("open");
  document.getElementById("sub-dock")?.querySelectorAll(".sub-dock-btn.active")
    .forEach(b => b.classList.remove("active"));
}
document.addEventListener("click", (e) => {
  const pop = document.getElementById("sub-dock-popup");
  const dock = document.getElementById("sub-dock");
  if (!pop || !pop.classList.contains("open")) return;
  if (pop.contains(e.target)) return;
  if (dock && dock.contains(e.target)) return;
  closeSubDockPopup();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSubDockPopup();
});
window.renderSubdivisionDock = renderSubdivisionDock;

let galleryFolderFilter = '__all'; // '__all' | '__none' | folder name
let galleryTabFilter = 'image';    // 'image' | 'video'
let gallerySubKey = null;          // null = bám activeSubdivision

/* Ảnh/video của phân khu đang chọn. Tab "Tất cả" (__all) = toàn bộ gallery. */
function galleryItemsBySub() {
  const key = effectiveSubKey(gallerySubKey);
  const all = (DATA.gallery || []).map(g => ({ type: 'image', ...g }));
  if (key === '__all') return all;
  return all.filter(g => (g.subdivision || null) === key);
}

function galleryItemsByTab() {
  return galleryItemsBySub()
    .filter(g => galleryTabFilter === 'video' ? g.type === 'video' : g.type !== 'video');
}

function visibleGalleryItems() {
  const items = galleryItemsByTab();
  if (galleryFolderFilter === '__all')  return items;
  if (galleryFolderFilter === '__none') return items.filter(g => !g.folder);
  return items.filter(g => g.folder === galleryFolderFilter);
}

function buildGallery() {
  const grid = document.getElementById("gal-grid");
  if (!grid) return;
  // Thanh chọn phân khu (chèn vào đầu .gal-frame, dưới .gal-head)
  const galKey = effectiveSubKey(gallerySubKey);
  renderSubdivisionTabs('.gal-frame', 'gallery-subtabs', galKey, (k) => {
    gallerySubKey = k;
    galleryFolderFilter = '__all';
    buildGallery();
  });
  const allItems = galleryItemsBySub();
  const imgCount = allItems.filter(g => g.type !== 'video').length;
  const vidCount = allItems.filter(g => g.type === 'video').length;
  const tabItems = galleryItemsByTab();

  // Build tab bar (Image / Video)
  let tabBar = document.getElementById('gal-type-tabs');
  if (!tabBar) {
    tabBar = document.createElement('div');
    tabBar.id = 'gal-type-tabs';
    tabBar.style.cssText = 'display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:14px';
    grid.parentNode.insertBefore(tabBar, grid);
  }
  const tabBtn = (key, label, count) => {
    const active = galleryTabFilter === key;
    const icon = key === 'video'
      ? '<i data-lucide="video" width="14" height="14"></i>'
      : '<i data-lucide="image" width="14" height="14"></i>';
    return `<button data-tab="${key}" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border:none;border-bottom:2px solid ${active?'#3b82f6':'transparent'};background:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:${active?'600':'500'};color:${active?'#fff':'rgba(255,255,255,.55)'};transition:all .15s">${icon} ${label} <span style="font-size:11px;background:${active?'rgba(59,130,246,.25)':'rgba(255,255,255,.06)'};color:${active?'#fff':'rgba(255,255,255,.5)'};padding:1px 8px;border-radius:10px">${count}</span></button>`;
  };
  tabBar.innerHTML = tabBtn('image', 'Ảnh', imgCount) + tabBtn('video', 'Video', vidCount);
  tabBar.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (galleryTabFilter === btn.dataset.tab) return;
      galleryTabFilter = btn.dataset.tab;
      galleryFolderFilter = '__all';
      buildGallery();
    });
  });

  // Build folder chip bar (theo tab hiện hành)
  const folders = [...new Set(tabItems.map(g => g.folder).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
  let chipBar = document.getElementById('gal-folder-chips');
  if (!chipBar) {
    chipBar = document.createElement('div');
    chipBar.id = 'gal-folder-chips';
    chipBar.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:0 0 12px';
    grid.parentNode.insertBefore(chipBar, grid);
  }
  if (folders.length || tabItems.some(g => !g.folder)) {
    const chip = (val, label) => {
      const active = galleryFolderFilter === val;
      const count = val === '__all' ? tabItems.length
                  : val === '__none' ? tabItems.filter(g => !g.folder).length
                  : tabItems.filter(g => g.folder === val).length;
      return `<button data-folder="${val}" style="padding:6px 12px;border-radius:999px;border:1px solid ${active?'#3b82f6':'rgba(255,255,255,.18)'};background:${active?'rgba(59,130,246,.25)':'rgba(255,255,255,.04)'};color:${active?'#fff':'rgba(255,255,255,.7)'};font-size:12px;font-weight:600;cursor:pointer;transition:all .15s">${label} <span style="opacity:.6;font-weight:400">${count}</span></button>`;
    };
    chipBar.innerHTML = chip('__all', 'Tất cả')
      + (tabItems.some(g=>!g.folder) ? chip('__none', 'Chưa phân loại') : '')
      + folders.map(f => chip(f, f)).join('');
    chipBar.style.display = 'flex';
    chipBar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        galleryFolderFilter = btn.dataset.folder;
        buildGallery();
      });
    });
  } else {
    chipBar.innerHTML = '';
    chipBar.style.display = 'none';
  }

  const items = visibleGalleryItems();
  if (items.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:48px 20px;text-align:center;color:rgba(255,255,255,.5);font-size:14px">
      ${galleryTabFilter === 'video' ? _t('ui.gallery.emptyVideo') : _t('ui.gallery.emptyPhoto')}
    </div>`;
    return;
  }
  grid.innerHTML = items.map((g, i) => {
    let thumb = g.poster || g.thumb || '';
    if (!thumb) {
      // Drive → API thumbnail kích thước nhỏ; YouTube → i.ytimg; còn lại dùng chính src
      const did = driveFileId(g.src);
      if (did) thumb = `https://drive.google.com/thumbnail?id=${did}&sz=w320`;
      else {
        const yt = (g.src || '').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
        if (yt) thumb = `https://i.ytimg.com/vi/${yt[1]}/mqdefault.jpg`;
        else thumb = g.src || '';
      }
    }
    const isVideo = g.type === 'video';
    return `
      <div class="gal-item" data-idx="${i}" style="position:relative">
        ${thumb
          ? `<img data-src="${thumb}" alt="${_tr(g.title) || ''}"
                  loading="lazy" decoding="async"
                  style="opacity:0;transition:opacity .25s;background:#1e293b"
                  onload="this.style.opacity=1"/>`
          : `<div style="aspect-ratio:1;background:#0f172a;display:flex;align-items:center;justify-content:center;color:#475569"><i data-lucide="play" width="36" height="36"></i></div>`}
        ${isVideo ? `
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none">
            <div style="width:48px;height:48px;border-radius:50%;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;color:#fff">
              <i data-lucide="play" width="20" height="20"></i>
            </div>
          </div>
          <div style="position:absolute;top:8px;left:8px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:.04em">VIDEO</div>` : ''}
        ${g.title ? `<div class="gal-cap">${_tr(g.title)}</div>` : ''}
      </div>`;
  }).join("");
  grid.querySelectorAll(".gal-item").forEach(el => {
    el.addEventListener("click", () => openLightbox(parseInt(el.dataset.idx, 10)));
  });
  setupPublicGalleryLazyLoad(grid);
}

/* IntersectionObserver: chỉ tải thumbnail khi card vào gần viewport */
let _publicGalleryIO = null;
function setupPublicGalleryLazyLoad(grid) {
  if (_publicGalleryIO) { _publicGalleryIO.disconnect(); _publicGalleryIO = null; }
  _publicGalleryIO = lazyLoadImages(grid.querySelectorAll('img[data-src]'), 'data-src');
}

/* Helper chung: nhận NodeList img + tên attribute chứa URL thật, trả observer */
window.lazyLoadImages = lazyLoadImages;
function lazyLoadImages(imgs, attrName) {
  imgs = imgs && imgs.length ? imgs : [];
  if (!imgs.length) return null;
  if (!('IntersectionObserver' in window)) {
    imgs.forEach(img => { img.src = img.getAttribute(attrName); img.removeAttribute(attrName); });
    return null;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const img = e.target;
        const src = img.getAttribute(attrName);
        if (src) { img.src = src; img.removeAttribute(attrName); }
        io.unobserve(img);
      }
    }
  }, { rootMargin: '400px 0px', threshold: 0.01 });
  imgs.forEach(img => io.observe(img));
  return io;
}

/* Trích FILE_ID từ link Google Drive (file hoặc ?id=) */
function driveFileId(url) {
  if (!url || !/drive\.google\.com|docs\.google\.com/.test(url)) return null;
  let m;
  if ((m = url.match(/\/file\/d\/([\w-]+)/))) return m[1];
  if ((m = url.match(/[?&]id=([\w-]+)/))) return m[1];
  return null;
}

function lbVideoEmbedUrl(url) {
  if (!url) return null;
  let m;
  if ((m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/))) return `https://www.youtube.com/embed/${m[1]}`;
  if (/youtube\.com\/embed\//.test(url)) return url;
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return `https://player.vimeo.com/video/${m[1]}`;
  if (url.startsWith('https://player.vimeo.com/')) return url;
  // Google Drive — dùng trang preview để xem video/ảnh trực tiếp
  const did = driveFileId(url);
  if (did) return `https://drive.google.com/file/d/${did}/preview`;
  return null;
}

function setLightboxMedia(item) {
  const host = document.getElementById('lb-media-host');
  const cap  = document.getElementById('lb-cap');
  if (!host) return;
  host.innerHTML = '';
  if (item.type === 'video') {
    const embed = lbVideoEmbedUrl(item.src);
    if (embed) {
      const sep = embed.includes('?') ? '&' : '?';
      host.innerHTML = `<iframe src="${embed}${sep}autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0" style="width:min(1100px,90vw);aspect-ratio:16/9;background:#000;border-radius:8px;max-height:80vh"></iframe>`;
    } else {
      host.innerHTML = `<video src="${item.src}" ${item.poster?`poster="${item.poster}"`:''} controls autoplay style="max-width:90vw;max-height:80vh;background:#000;border-radius:8px"></video>`;
    }
  } else {
    // Ảnh Google Drive: link /file/d/.../view không hiển thị trực tiếp
    // trong <img> → chuyển sang dạng thumbnail kích thước lớn.
    const did = driveFileId(item.src);
    const imgSrc = did
      ? `https://drive.google.com/thumbnail?id=${did}&sz=w1600`
      : item.src;
    host.innerHTML = `<img id="lb-img" src="${imgSrc}" alt="${_tr(item.title) || ''}"/>`;
  }
  if (cap) cap.textContent = _tr(item.title) || '';
}

let lbIdx = 0;
function openLightbox(idx) {
  const items = visibleGalleryItems();
  if (!items.length) return;
  lbIdx = idx;
  setLightboxMedia(items[lbIdx]);
  document.getElementById("lightbox").classList.add("open");
}
function navLightbox(dir) {
  const items = visibleGalleryItems();
  if (!items.length) return;
  lbIdx = (lbIdx + dir + items.length) % items.length;
  setLightboxMedia(items[lbIdx]);
}
function closeLightbox() {
  // stop any playing video / iframe before hiding
  const host = document.getElementById('lb-media-host');
  if (host) host.innerHTML = '<img id="lb-img" src="" alt=""/>';
  document.getElementById("lightbox").classList.remove("open");
}

function bindOverlays() {
  document.getElementById("btn-legal")?.addEventListener("click", () => {
    document.getElementById("legal-overlay").classList.add("open");
  });
  document.getElementById("legal-close")?.addEventListener("click", () => {
    document.getElementById("legal-overlay").classList.remove("open");
  });
  document.getElementById("legal-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "legal-overlay") e.currentTarget.classList.remove("open");
  });

  document.getElementById("btn-location")?.addEventListener("click", () => {
    const iframe = document.getElementById("location-iframe");
    // Dùng getAttribute: iframe.src trả về URL trang hiện tại khi attr rỗng
    if (iframe && !iframe.getAttribute("src") && DATA.location?.mapSrc) {
      iframe.src = DATA.location.mapSrc;
    }
    document.getElementById("location-overlay").classList.add("open");
  });
  document.getElementById("location-close")?.addEventListener("click", () => {
    document.getElementById("location-overlay").classList.remove("open");
  });
  document.getElementById("location-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "location-overlay") e.currentTarget.classList.remove("open");
  });

  document.getElementById("btn-gallery")?.addEventListener("click", () => {
    document.getElementById("gallery-overlay").classList.add("open");
  });
  document.getElementById("gal-close")?.addEventListener("click", () => {
    document.getElementById("gallery-overlay").classList.remove("open");
  });
  document.getElementById("gallery-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "gallery-overlay") e.currentTarget.classList.remove("open");
  });

  document.getElementById("btn-resources")?.addEventListener("click", () => {
    document.getElementById("resources-overlay").classList.add("open");
  });
  document.getElementById("resources-close")?.addEventListener("click", () => {
    document.getElementById("resources-overlay").classList.remove("open");
  });
  document.getElementById("resources-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "resources-overlay") e.currentTarget.classList.remove("open");
  });

  document.getElementById("lb-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lb-prev")?.addEventListener("click", () => navLightbox(-1));
  document.getElementById("lb-next")?.addEventListener("click", () => navLightbox(1));
  document.getElementById("lightbox")?.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    const lb = document.getElementById("lightbox");
    if (!lb || !lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") navLightbox(-1);
    else if (e.key === "ArrowRight") navLightbox(1);
  });
}

function bindBotchat() {
  const btn = document.getElementById("bb-chat-btn");
  if (!btn || !window.AiPanel) return;
  btn.addEventListener("click", () => window.AiPanel.toggle());
}

function bindControls() {
  /* VR rotation/zoom controls removed — 3DVista has its own controls */
  ["ctrl-rotate", "ctrl-zoom-in", "ctrl-zoom-out"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  document.getElementById("ctrl-fullscreen").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });
}

function bindModal() {
  document.getElementById("open-modal").addEventListener("click", openModal);
  document.getElementById("open-modal-2")?.addEventListener("click", openModal);
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") closeModal();
  });
}
function openModal() {
  document.getElementById("modal-backdrop").classList.add("open");
  // Re-bind filter events each time modal opens (DOM may have been rebuilt)
  bindFpFilters();
}
function closeModal() { document.getElementById("modal-backdrop").classList.remove("open"); }

function bindPanelCollapse() {
  const np = document.getElementById("nav-panel");
  const pc = document.getElementById("project-card");

  // Use delegation on document so clone/replace in mobilePatch doesn't break listeners
  document.addEventListener("click", (e) => {
    const isMob = window.matchMedia("(max-width: 768px)").matches;

    // np-collapse
    if (e.target.closest("#np-collapse")) {
      np.classList.add("collapsed");
      document.body.classList.add("nav-panel-collapsed");
    }

    // np-expand (desktop only — mobile handled by mobilePatch)
    if (!isMob && e.target.closest("#np-expand")) {
      np.classList.remove("collapsed");
      document.body.classList.remove("nav-panel-collapsed");
    }

    // pc-collapse — toggle collapse (desktop); mobile handled by mobilePatch.
    // Khi card đã thu gọn, chính nó là nút bấm để mở lại — không cần nút riêng.
    if (!isMob && e.target.closest("#pc-collapse")) {
      pc.classList.toggle("collapsed");
    }
  });
}

function bindSmartHide() {
  const ui = document.getElementById("ui");
  const stage = document.getElementById("viewer");
  const restore = document.getElementById("ui-restore");
  if (!ui || !stage) return;

  /* Khóa cứng: khi true, mọi yêu cầu show() đều bị bỏ qua.
     Chỉ click vào #ui-restore mới mở khóa. */
  let uiLocked = false;

  const hide = () => {
    ui.classList.add("hidden");
    document.body.classList.add("ux-hidden");
    uiLocked = true;
  };
  const show = () => {
    if (uiLocked) return;
    ui.classList.remove("hidden");
    document.body.classList.remove("ux-hidden");
  };
  const forceShow = () => {
    uiLocked = false;
    ui.classList.remove("hidden");
    document.body.classList.remove("ux-hidden");
  };
  window.__uxShow = show;
  window.__uxHide = hide;
  window.__uxForceShow = forceShow;

  /* Helper: target có thuộc về UI interactive element không?
     Trả về true nếu touch xuất phát từ button/panel của UI hoặc nút restore. */
  const isUiTarget = (target) => {
    if (!target || target.nodeType !== 1) return false;
    if (target.closest("#ui-restore")) return true;
    /* Modal/overlay/popup nằm ngoài #ui vẫn phải được coi là UI để không
       kích hoạt smart-hide khi user thao tác trong chúng. */
    if (target.closest(
      "#masterplan-overlay, #modal-backdrop, .modal, .modal-backdrop, " +
      ".mp-overlay, .adv-overlay, .fpv-overlay, .gallery-overlay, " +
      ".lightbox, .image-viewer, .video-viewer, " +
      ".popup, .popover, .dropdown, .menu, [role='dialog'], " +
      "[data-ui-keep]"
    )) return true;
    if (target.closest("#ui")) {
      /* Nếu nằm trong một button/link/input thực sự thì coi là UI ngay —
         không xét pointer-events vì SVG/icon con của Lucide có thể trả
         pointer-events:none nhưng click vẫn được bubble qua button cha. */
      if (target.closest("button, a, input, select, textarea, [role='button']")) return true;
      /* Bên trong .ui — chỉ tính là UI nếu element thật sự có pointer-events
         (tức là button/panel con); .ui và .tip có pointer-events:none */
      const cs = getComputedStyle(target);
      if (cs.pointerEvents !== "none") return true;
    }
    return false;
  };

  /* Bắt ở CAPTURE phase trên window để KHÔNG bị TDV stopPropagation cản.
     Hỗ trợ cả pointer/touch/mouse vì các browser/device khác nhau. */
  const onDown = (e) => {
    const t = e.target;
    if (isUiTarget(t)) return;
    hide();
  };
  window.addEventListener("pointerdown", onDown, true);
  window.addEventListener("touchstart",  onDown, true);
  window.addEventListener("mousedown",   onDown, true);

  if (restore) {
    const onRestore = (e) => {
      e.stopPropagation();
      e.preventDefault();
      forceShow();
    };
    restore.addEventListener("click",       onRestore, true);
    restore.addEventListener("pointerdown", onRestore, true);
    restore.addEventListener("touchstart",  onRestore, true);
  }
}

/* ============================================
   LANGUAGE SWITCHER
   ============================================ */
function bindLanguage() {
  if (!window.I18n) return;
  const btn = document.getElementById("ctrl-lang");
  const menu = document.getElementById("ctrl-lang-menu");
  const codeEl = document.getElementById("ctrl-lang-code");
  if (!btn || !menu) return;

  const renderMenu = () => {
    const cur = window.I18n.get();
    codeEl.textContent = cur.toUpperCase();
    menu.innerHTML = window.I18n.langs().map(l => `
      <button type="button" class="ctrl-lang-item ${l.code === cur ? 'active' : ''}" data-code="${l.code}">
        <span class="cli-flag">${l.flag}</span>
        <span class="cli-label">${l.label}</span>
        <span class="cli-code">${l.code.toUpperCase()}</span>
      </button>
    `).join("");
  };
  renderMenu();

  // Event delegation — handlers gắn 1 lần trên menu, không bị mất sau re-render.
  menu.addEventListener("click", (e) => {
    const it = e.target.closest(".ctrl-lang-item");
    if (!it) return;
    e.stopPropagation();
    window.I18n.set(it.dataset.code);
    menu.classList.remove("open");
    renderMenu();
  });

  // Bắt ở capture phase ngay trên window — chạy TRƯỚC mọi handler khác
  // (kể cả bindSmartHide). Dùng pointerdown để không bị Lucide SVG / icon
  // pointer-events nuốt.
  window.addEventListener("pointerdown", (e) => {
    const hit = e.target.closest && e.target.closest("#ctrl-lang");
    if (hit) {
      e.stopPropagation();
      // Đợi micro-task để toggle xảy ra sau khi DOM ổn định
      setTimeout(() => menu.classList.toggle("open"), 0);
      return;
    }
    // Click ngoài → đóng menu
    if (menu.classList.contains("open") && !menu.contains(e.target)) {
      menu.classList.remove("open");
    }
  }, true);

  // Đồng bộ menu khi ngôn ngữ đổi từ nơi khác (mobile drawer, admin, v.v.)
  window.I18n.onChange(renderMenu);
}

function rebuildDynamic() {
  if (!DATA) return;
  buildProjectCard();
  syncProjectCard(); // giữ đúng chế độ card sau khi đổi ngôn ngữ
  if (DATA.project.promoDeadline) startCountdown(DATA.project.promoDeadline);
  buildTimelineAndUnits();
  renderNavList();
  // Re-render scene-dependent labels
  if (currentPanoramaId) {
    const item = findMenuItemByPanorama(currentPanoramaId);
    if (item) {
      const el = document.getElementById("scene-title");
      if (el) el.textContent = _tr(item.label);
    }
  }
  // Re-render gallery captions
  buildGallery();
  // Refresh active tour step text if active
  if (tourActive) showTourStep();
}

/* ============================================
   HELP TOUR (HELPTOUR_SPEC)
   ============================================ */
const HELP_ITEMS = [
  { target: ".brand",                labelKey: "tour.brand" },
  { target: "#btn-masterplan",       mobileTarget: "#mob-masterplan-btn",  openDrawer: true,  labelKey: "tour.masterplan" },
  { target: "#btn-properties",       mobileTarget: "#mob-properties-btn",  openDrawer: true,  labelKey: "tour.properties" },
  { target: "#btn-legal",            mobileTarget: "#mob-legal-btn",       openDrawer: true,  labelKey: "tour.legal" },
  { target: "#btn-location",         mobileTarget: "#mob-location-btn",    openDrawer: true,  labelKey: "tour.location" },
  { target: "#btn-timeline",    mobileTarget: "#mob-timeline-btn",  openDrawer: true,  labelKey: "tour.timeline" },
  { target: "#btn-gallery",     mobileTarget: "#mob-gallery-btn",   openDrawer: true,  labelKey: "tour.gallery" },
  { target: "#btn-resources",   mobileTarget: "#mob-resources-btn", openDrawer: true,  labelKey: "tour.resources" },
  { target: "#open-modal",      mobileTarget: "#mob-book-btn",    openDrawer: true,  labelKey: "tour.book" },
  { target: "#tb-ctrlgroup",    labelKey: "tour.ctrlgroup" },
  { target: "#ctrl-rotate",     mobileTarget: "#mob-rotate",      openDrawer: true,  labelKey: "tour.rotate" },
  { target: "#ctrl-zoom-in",    mobileTarget: "#mob-zoom-in",     openDrawer: true,  labelKey: "tour.zoomIn" },
  { target: "#ctrl-zoom-out",   mobileTarget: "#mob-zoom-out",    openDrawer: true,  labelKey: "tour.zoomOut" },
  { target: "#ctrl-fullscreen", mobileTarget: "#mob-fs",          openDrawer: true,  labelKey: "tour.fullscreen" },
  { target: "#ctrl-lang-wrap",  mobileTarget: "#mob-lang",        openDrawer: true,  labelKey: "tour.lang" },
  { target: "#help-btn",        mobileTarget: "#mob-help",        openDrawer: true,  labelKey: "tour.help" },
  { target: "#nav-panel",       openNav: true,                    labelKey: "tour.nav" },
  { target: "#np-search-wrap",  openNav: true,                    labelKey: "tour.search" },
  { target: "#np-list",         openNav: true,                    labelKey: "tour.list" },
  { target: "#np-collapse",     openNav: true,                    labelKey: "tour.collapse" },
  { target: "#project-card",    openPC: true,                     labelKey: "tour.project" },
  { target: "#pc-collapse",     openPC: true,                     labelKey: "tour.pcCollapse" },
  { target: "#bb-chat-btn",     round: true,                      labelKey: "tour.bot" },
  { target: "#ui-restore",      labelKey: "tour.restore" },
];

let tourIdx = -1;
let tourActive = false;
let tourItems = HELP_ITEMS;

function startTour(items = HELP_ITEMS, fromIndex = 0) {
  tourItems = items;
  tourIdx = fromIndex;
  tourActive = true;
  document.getElementById("ui")?.classList.remove("hidden");
  // On desktop, pre-open nav-panel; on mobile, steps open panels lazily
  if (!window.matchMedia("(max-width: 768px)").matches) {
    document.getElementById("nav-panel")?.classList.remove("collapsed");
    document.body.classList.remove("nav-panel-collapsed");
  }
  document.getElementById("tour-overlay").classList.add("open");
  showTourStep();
}

function endTour() {
  tourActive = false;
  tourIdx = -1;
  document.getElementById("tour-overlay")?.classList.remove("open");
  // Close mobile drawer if it was opened during tour
  document.getElementById("mobile-drawer")?.classList.remove("open");
}

function showTourStep() {
  if (!tourActive) return;
  if (tourIdx >= tourItems.length) { endTour(); return; }

  const item = tourItems[tourIdx];
  const isMob = window.matchMedia("(max-width: 768px)").matches;
  const drawer = document.getElementById("mobile-drawer");

  // On mobile: manage panel state before measuring targets
  if (isMob) {
    // Close drawer when a step doesn't need it (nav/project-card/other steps)
    if (!item.openDrawer && drawer?.classList.contains("open")) {
      drawer.classList.remove("open");
    }

    // openNav: ensure nav-panel is expanded
    if (item.openNav) {
      const np = document.getElementById("nav-panel");
      if (np?.classList.contains("collapsed")) {
        np.classList.remove("collapsed");
        document.body.classList.remove("nav-panel-collapsed");
        setTimeout(showTourStep, 380);
        return;
      }
    }

    // openPC: ensure project-card is expanded
    if (item.openPC) {
      const pc = document.getElementById("project-card");
      if (pc?.classList.contains("collapsed")) {
        pc.classList.remove("collapsed");
        setTimeout(showTourStep, 500);
        return;
      }
    }

    // openDrawer: ensure mobile drawer is open
    if (item.openDrawer && drawer && !drawer.classList.contains("open")) {
      drawer.classList.add("open");
      setTimeout(showTourStep, 420);
      return;
    }
  }

  // Resolve target — use mobileTarget on mobile when available
  let target = null;
  if (isMob && item.mobileTarget) {
    target = document.querySelector(item.mobileTarget);
  } else if (typeof item.target === "function") {
    target = item.target();
  } else if (typeof item.target === "string") {
    target = document.querySelector(item.target);
  }

  if (!target) { tourIdx++; showTourStep(); return; }

  const rect = target.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) { tourIdx++; showTourStep(); return; }

  // Spot
  const pad = 6;
  const sx = rect.left - pad;
  const sy = rect.top - pad;
  const sw = rect.width + pad * 2;
  const sh = rect.height + pad * 2;

  const spot = document.getElementById("tour-spot");
  spot.style.left = sx + "px";
  spot.style.top = sy + "px";
  spot.style.width = sw + "px";
  spot.style.height = sh + "px";
  spot.classList.toggle("round", !!item.round);

  // Tip
  const tip = document.getElementById("tour-tip");
  let label = "";
  if (item.labelKey) label = _t(item.labelKey);
  else label = typeof item.label === "function" ? item.label() : item.label;
  tip.querySelector(".tt-step").textContent = _t("ui.step", { n: tourIdx + 1, total: tourItems.length });
  tip.querySelector(".tt-label").textContent = label || "";

  const tipW = tip.offsetWidth || 280;
  const tipH = tip.offsetHeight || 100;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 18;

  const space = {
    bottom: vh - (sy + sh),
    top: sy,
    right: vw - (sx + sw),
    left: sx,
  };

  let side = "bottom";
  if (space.bottom < tipH + gap && space.top >= tipH + gap) side = "top";
  else if (space.bottom < tipH + gap && space.right >= tipW + gap) side = "right";
  else if (space.bottom < tipH + gap && space.left >= tipW + gap) side = "left";

  let tx, ty;
  if (side === "bottom") { tx = sx + sw / 2 - tipW / 2; ty = sy + sh + gap; }
  else if (side === "top") { tx = sx + sw / 2 - tipW / 2; ty = sy - tipH - gap; }
  else if (side === "right") { tx = sx + sw + gap; ty = sy + sh / 2 - tipH / 2; }
  else { tx = sx - tipW - gap; ty = sy + sh / 2 - tipH / 2; }

  // Clamp inside viewport
  tx = Math.max(10, Math.min(vw - tipW - 10, tx));
  ty = Math.max(10, Math.min(vh - tipH - 10, ty));

  tip.style.left = tx + "px";
  tip.style.top = ty + "px";

  tip.classList.remove("arrow-up", "arrow-down", "arrow-left", "arrow-right");
  const arrowClass = { bottom: "arrow-up", top: "arrow-down", right: "arrow-left", left: "arrow-right" }[side];
  tip.classList.add(arrowClass);

  // arrow position
  if (side === "bottom" || side === "top") {
    const spotCenterX = sx + sw / 2;
    const ax = Math.max(14, Math.min(tipW - 28, spotCenterX - tx - 7));
    tip.style.setProperty("--arrow-x", ax + "px");
  } else {
    const spotCenterY = sy + sh / 2;
    const ay = Math.max(14, Math.min(tipH - 28, spotCenterY - ty - 7));
    tip.style.setProperty("--arrow-y", ay + "px");
  }
}

function bindTour() {
  document.getElementById("help-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    startTour(HELP_ITEMS);
  });

  document.getElementById("tour-overlay")?.addEventListener("click", (e) => {
    if (e.target.closest("#tour-skip")) return;
    tourIdx++;
    showTourStep();
  });

  document.getElementById("tour-skip")?.addEventListener("click", (e) => {
    e.stopPropagation();
    endTour();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && tourActive) endTour();
  });

  window.addEventListener("resize", () => {
    if (tourActive) showTourStep();
  });
}

/* ============================================================
   BỘ CHỌN PHÂN KHU cho 5 overlay (pháp lý/vị trí/tiến độ/
   thư viện/tài liệu). Desktop = tab; mobile (≤768px) = dropdown.
   Tab "Tất cả" = __all (dữ liệu cấp dự án).
   Mỗi overlay tự nhớ phân khu đang xem qua biến state riêng.
   ============================================================ */
function isMobileView() {
  return window.matchMedia("(max-width: 768px)").matches;
}

/* Dựng/cập nhật thanh chọn phân khu trong 1 overlay.
   - hostSel: selector của phần tử cha sẽ chèn thanh chọn vào (đầu)
   - barId: id duy nhất của thanh
   - current: khoá đang chọn ('__all' | '<pkId>')
   - onPick: callback(key) khi đổi */
function renderSubdivisionTabs(hostSel, barId, current, onPick) {
  const host = document.querySelector(hostSel);
  if (!host) return;
  let bar = document.getElementById(barId);
  if (!bar) {
    bar = document.createElement("div");
    bar.id = barId;
    bar.className = "sub-tabbar";
    host.insertBefore(bar, host.firstChild);
  }
  const subs = subdivisionList();
  const opts = [{ id: "__all", label: _t("ui.allTab") || "Tất cả" }, ...subs];

  if (isMobileView()) {
    // Mobile — dropdown
    bar.classList.add("sub-tabbar-mobile");
    bar.innerHTML = `
      <label class="sub-dd-label">${_t("ui.subdivision") || "Phân khu"}</label>
      <select class="sub-dd-select">
        ${opts.map(o => `<option value="${o.id}" ${o.id === current ? "selected" : ""}>${_tr(o.label)}</option>`).join("")}
      </select>`;
    bar.querySelector("select").addEventListener("change", e => onPick(e.target.value));
  } else {
    // Desktop — tab
    bar.classList.remove("sub-tabbar-mobile");
    bar.innerHTML = opts.map(o => `
      <button class="sub-tab ${o.id === current ? "active" : ""}" data-key="${o.id}">
        ${_tr(o.label)}
      </button>`).join("");
    bar.querySelectorAll(".sub-tab").forEach(btn => {
      btn.addEventListener("click", () => onPick(btn.dataset.key));
    });
  }
}

/* Lấy dữ liệu của 1 mục theo khoá phân khu, fallback __all.
   data có thể là dạng mới {__all,...} hoặc cũ (object/array phẳng). */
function pickSubData(data, key) {
  if (!data) return null;
  // dạng mới có __all
  if (typeof data === "object" && !Array.isArray(data) && ("__all" in data)) {
    return data[key] != null ? data[key] : data.__all;
  }
  // dạng cũ phẳng — trả nguyên
  return data;
}

/* Khoá phân khu hiện hành cho 1 overlay:
   nếu có phân khu active → mặc định mở phân khu đó; ngược lại __all.
   stateVar: giá trị state đang lưu (có thể null nghĩa là chưa chọn). */
function effectiveSubKey(stateVar) {
  if (stateVar) return stateVar;
  return activeSubdivision || "__all";
}

/* ============================================
   LEGAL / TRUST PANEL (Bước 5)
   ============================================ */
let legalSubKey = null;   // null = bám theo activeSubdivision

function buildLegalPanel() {
  if (!DATA.legal) return;
  const key = effectiveSubKey(legalSubKey);
  renderSubdivisionTabs('.legal-content', 'legal-subtabs', key, (k) => {
    legalSubKey = k;
    buildLegalPanel();
  });
  const legal = pickSubData(DATA.legal, key) || {};

  // Stats
  const statsEl = document.getElementById('legal-stats');
  if (statsEl) {
    statsEl.innerHTML = (legal.developerStats || []).map(s => `
      <div class="legal-stat">
        <div class="legal-stat-v">${s.value}<span class="legal-stat-u">${s.unit}</span></div>
        <div class="legal-stat-k">${s.label}</div>
      </div>
    `).join('');
  }

  // Checklist
  const checkEl = document.getElementById('legal-checklist');
  if (checkEl) {
    const docs = legal.documents || [];
    checkEl.innerHTML = docs.length ? docs.map(d => `
      <div class="legal-check-row ${d.done ? 'done' : 'pending'}">
        <div class="legal-check-icon">
          ${d.done
            ? '<i data-lucide="check-circle" width="14" height="14"></i>'
            : '<i data-lucide="alert-circle" width="14" height="14"></i>'
          }
        </div>
        <div class="legal-check-body">
          <div class="legal-check-name">${d.name}</div>
          <div class="legal-check-detail">${d.detail}</div>
        </div>
      </div>
    `).join('') : `<div class="np-empty">${_t('ui.empty.content')}</div>`;
  }

  // Testimonials
  const testEl = document.getElementById('legal-testimonials');
  if (testEl) {
    const list = legal.testimonials || [];
    if (!list.length) {
      testEl.innerHTML = `<div class="np-empty">${_t('ui.empty.content')}</div>`;
    } else {
      let tIdx = 0;
      const render = () => {
        const t = list[tIdx];
        testEl.innerHTML = `
          <div class="legal-testi">
            <div class="lt-avatar">${t.initials}</div>
            <div class="lt-body">
              <div class="lt-quote">"${t.text}"</div>
              <div class="lt-meta"><strong>${t.initials}</strong> · ${t.role} · <em>${t.unit}</em></div>
            </div>
            <div class="lt-nav">
              <button class="lt-btn" id="lt-prev">‹</button>
              <span class="lt-dots">${list.map((_,i) => `<span class="lt-dot ${i===tIdx?'active':''}"></span>`).join('')}</span>
              <button class="lt-btn" id="lt-next">›</button>
            </div>
          </div>`;
        testEl.querySelector('#lt-prev')?.addEventListener('click', () => { tIdx = (tIdx - 1 + list.length) % list.length; render(); });
        testEl.querySelector('#lt-next')?.addEventListener('click', () => { tIdx = (tIdx + 1) % list.length; render(); });
      };
      render();
    }
  }
}

/* ============================================
   LOCATION PANEL (Bước 6)
   ============================================ */
let locationSubKey = null;

function currentLocationData() {
  const key = effectiveSubKey(locationSubKey);
  return pickSubData(DATA.location, key) || { nearby: [], mapSrc: '' };
}

function buildLocationPanel() {
  if (!DATA.location) return;
  const key = effectiveSubKey(locationSubKey);
  renderSubdivisionTabs('.location-body', 'location-subtabs', key, (k) => {
    locationSubKey = k;
    buildLocationPanel();
  });
  const loc = currentLocationData();
  // Nạp bản đồ theo phân khu
  const iframe = document.getElementById('location-iframe');
  if (iframe && loc.mapSrc) iframe.setAttribute('src', loc.mapSrc);
  // reset bộ lọc danh mục về "Tất cả"
  document.querySelectorAll('.loc-cat-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.cat === ''));
  renderLocationList('');

  // bind 1 lần (idempotent — gỡ listener cũ bằng cloneNode không cần thiết
  // vì handler chỉ đọc state hiện hành)
  document.getElementById('location-filter')?.querySelectorAll('.loc-cat-btn').forEach(btn => {
    if (btn._locBound) return;
    btn._locBound = true;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.loc-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLocationList(btn.dataset.cat);
    });
  });
}

function renderLocationList(cat) {
  const el = document.getElementById('location-list');
  if (!el || !DATA.location) return;
  const loc = currentLocationData();
  const items = (loc.nearby || []).filter(n => !cat || n.cat === cat);
  if (!items.length) {
    el.innerHTML = `<div class="np-empty">${_t('ui.empty.location')}</div>`;
    return;
  }
  el.innerHTML = items.map(n => `
    <div class="loc-item">
      <div class="loc-item-icon ${n.cat}">${locCatIcon(n.cat)}</div>
      <div class="loc-item-body">
        <div class="loc-item-name">${n.name}</div>
        <div class="loc-item-meta">${n.dist} · ${n.time} lái xe</div>
      </div>
    </div>
  `).join('');
}

function locCatIcon(cat) {
  const m = {
    school: '🏫', hospital: '🏥', metro: '🚇', mall: '🛍', airport: '✈️'
  };
  return m[cat] || '📍';
}

/* ============================================
   TIMELINE PANEL
   ============================================ */
let timelineSubKey = null;

function buildTimelinePanel() {
  if (!DATA.timeline) return;
  // Ẩn nút mở overlay (cả desktop & mobile) nếu không có bất kỳ mốc nào.
  const hasAny = Object.keys(DATA.timeline || {}).some(k => Array.isArray(DATA.timeline[k]) && DATA.timeline[k].length);
  ['btn-timeline', 'mob-timeline-btn'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.style.display = hasAny ? '' : 'none';
  });
  if (!hasAny) return;
  const key = effectiveSubKey(timelineSubKey);
  renderSubdivisionTabs('.timeline-frame', 'timeline-subtabs', key, (k) => {
    timelineSubKey = k;
    buildTimelinePanel();
  });

  // timeline theo phân khu (dạng mới {__all,...}) hoặc mảng cũ
  let items = pickSubData(DATA.timeline, key) || [];
  if (!Array.isArray(items)) items = [];
  let pulseAt = 0;
  // Override realtime chỉ áp dụng cho tab Tất cả
  if (key === '__all') {
    try {
      const override = JSON.parse(localStorage.getItem('ah_timeline_data') || 'null');
      if (Array.isArray(override) && override.length) items = override;
      pulseAt = +localStorage.getItem('ah_timeline_pulse') || 0;
    } catch (e) {}
  }
  const trackEl0 = document.getElementById('tl-track');
  if (trackEl0 && !items.length) {
    document.getElementById('tl-overview').innerHTML = '';
    trackEl0.innerHTML = `<div class="np-empty">${_t('ui.empty.milestone')}</div>`;
    return;
  }

  const doneN   = items.filter(t => t.status === 'done').length;
  const total   = items.length;
  const pct     = total ? Math.round((doneN / total) * 100) : 0;
  const activeI = items.findIndex(t => t.status === 'active');

  // Overview bar
  const overviewEl = document.getElementById('tl-overview');
  if (overviewEl) {
    overviewEl.innerHTML = `
      <div class="tlo-bar-wrap">
        <div class="tlo-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="tlo-meta">
        <span class="tlo-pct">${pct}% hoàn thành</span>
        <span class="tlo-count">${doneN} / ${total} mốc</span>
        ${activeI >= 0 ? `<span class="tlo-active-badge">● Đang thi công: ${items[activeI].phase}</span>` : ''}
        ${pulseAt ? `<span class="tlo-live-badge" style="margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;background:rgba(239,68,68,.14);color:#f87171;font-size:11px;font-weight:600"><span style="width:6px;height:6px;border-radius:50%;background:#ef4444;box-shadow:0 0 0 0 rgba(239,68,68,.6);animation:tlPulse 1.6s infinite"></span>LIVE · ${fmtRelativeTime(pulseAt)}</span>` : ''}
      </div>`;
  }
  // expose items override for the track below
  DATA.__timelineLive = items;

  // Track
  const trackEl = document.getElementById('tl-track');
  if (!trackEl) return;
  trackEl.innerHTML = (DATA.__timelineLive || items).map((t, i) => {
    const cls = t.status === 'done' ? 'done'
              : t.status === 'active' ? 'active'
              : 'upcoming';
    const isLast = i === items.length - 1;
    return `
      <div class="tl-item ${cls}">
        <div class="tl-spine">
          <div class="tl-node">
            ${t.status === 'done'
              ? '<i data-lucide="check" width="12" height="12"></i>'
              : t.status === 'active'
                ? '<div class="tl-node-pulse"></div>'
                : '<div class="tl-node-dot"></div>'}
          </div>
          ${!isLast ? '<div class="tl-line"></div>' : ''}
        </div>
        <div class="tl-card">
          <div class="tl-card-top">
            <div class="tl-card-date">${_tr(t.date)}</div>
            <span class="tl-badge ${cls}">${cls === 'done' ? _t('ui.timeline.done') : cls === 'active' ? _t('ui.timeline.doing') : _t('ui.timeline.upcoming')}</span>
          </div>
          <div class="tl-card-phase">${_tr(t.phase)}</div>
          ${t.desc ? `<div class="tl-card-desc">${t.desc}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}

function fmtRelativeTime(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'vừa cập nhật';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.floor(h / 24)} ngày trước`;
}

/* Real-time timeline: re-render when admin broadcasts an update */
let _lastTimelinePulse = 0;
function watchTimelinePulse() {
  try {
    const p = +localStorage.getItem('ah_timeline_pulse') || 0;
    if (p && p !== _lastTimelinePulse) {
      _lastTimelinePulse = p;
      buildTimelinePanel();
    } else if (p && document.querySelector('.tlo-live-badge')) {
      // refresh the relative-time label
      buildTimelinePanel();
    }
  } catch (e) {}
}
window.addEventListener('storage', e => {
  if (e.key === 'ah_timeline_pulse' || e.key === 'ah_timeline_data') buildTimelinePanel();
});
setInterval(watchTimelinePulse, 30000);

// Inject pulse keyframe once
if (!document.getElementById('tl-pulse-style')) {
  const st = document.createElement('style');
  st.id = 'tl-pulse-style';
  st.textContent = '@keyframes tlPulse{0%{box-shadow:0 0 0 0 rgba(239,68,68,.6)}70%{box-shadow:0 0 0 8px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}';
  document.head.appendChild(st);
}

// Bind open/close
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-timeline')?.addEventListener('click', () => {
    document.getElementById('timeline-overlay')?.classList.add('open');
  });
  document.getElementById('timeline-close')?.addEventListener('click', () => {
    document.getElementById('timeline-overlay')?.classList.remove('open');
  });
  document.getElementById('timeline-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'timeline-overlay') e.target.classList.remove('open');
  });
});

document.addEventListener("DOMContentLoaded", boot);

/* ============================================
   FORM TƯ VẤN MỞ RỘNG
   ============================================ */
(function initContactForm() {
  // ── Single-select choice buttons ──
  document.querySelectorAll('.cf-btn-group').forEach(group => {
    group.querySelectorAll('.cf-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.cf-choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.toggle('selected', true);
      });
    });
  });

  /* ── Custom dropdown: thay native <select> để không bị OS render trắng.
        Giữ nguyên <select> ẩn để form submit + i18n vẫn hoạt động. ── */
  function buildCustomDropdown(sel) {
    if (!sel || sel.dataset.cdBuilt) return;
    sel.dataset.cdBuilt = '1';
    sel.classList.add('cd-native-hidden');

    const wrap = document.createElement('div');
    wrap.className = 'cd-wrap';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cd-trigger';
    const label = document.createElement('span');
    label.className = 'cd-label';
    const arrow = document.createElement('span');
    arrow.className = 'cd-arrow';
    arrow.textContent = '▾';
    trigger.append(label, arrow);
    const menu = document.createElement('ul');
    menu.className = 'cd-menu';
    menu.setAttribute('role', 'listbox');
    wrap.append(trigger, menu);
    sel.insertAdjacentElement('afterend', wrap);

    function syncFromSelect() {
      const opt = sel.options[sel.selectedIndex];
      label.textContent = opt ? opt.textContent : '';
      label.classList.toggle('cd-placeholder', !sel.value);
      menu.innerHTML = '';
      Array.from(sel.options).forEach((o, i) => {
        const li = document.createElement('li');
        li.className = 'cd-item' + (i === sel.selectedIndex ? ' selected' : '') + (o.disabled ? ' disabled' : '');
        li.textContent = o.textContent;
        li.dataset.value = o.value;
        li.setAttribute('role', 'option');
        li.addEventListener('click', () => {
          if (o.disabled) return;
          sel.selectedIndex = i;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          syncFromSelect();
          close();
        });
        menu.appendChild(li);
      });
    }
    function open()  { wrap.classList.add('open');  document.addEventListener('click', onDocClick, true); }
    function close() { wrap.classList.remove('open'); document.removeEventListener('click', onDocClick, true); }
    function onDocClick(e) { if (!wrap.contains(e.target)) close(); }
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      wrap.classList.contains('open') ? close() : open();
    });
    // i18n có thể đổi text option → re-sync
    const mo = new MutationObserver(syncFromSelect);
    mo.observe(sel, { childList: true, subtree: true, characterData: true });
    syncFromSelect();
  }
  document.querySelectorAll('#cf-unit-type').forEach(buildCustomDropdown);

  // ── Unit code tags (từ bảng giá → form) ──
  window.addUnitCodeTag = function(code) {
    const wrap = document.getElementById('cf-codes-wrap');
    const row  = document.getElementById('cf-codes-tags');
    if (!wrap || !row) return;
    // Không thêm trùng
    if (row.querySelector(`[data-code="${code}"]`)) return;
    wrap.style.display = '';
    const tag = document.createElement('span');
    tag.className = 'cf-unit-tag';
    tag.dataset.code = code;
    tag.innerHTML = `${code}<button type="button" aria-label="${I18n.t('modal.removeUnit')}">×</button>`;
    tag.querySelector('button').addEventListener('click', () => {
      tag.remove();
      if (!row.children.length) wrap.style.display = 'none';
    });
    row.appendChild(tag);
    // Cũng điền vào note (backward compat giữ lại logic cũ trong note)
    const note = document.getElementById('cf-note');
    if (note && !note.value.includes(code)) {
      note.value = (note.value ? note.value + '\n' : '') + `Quan tâm căn: ${code}`;
    }
  };

  // Patch openModalWithUnit để dùng tag mới thay vì chỉ note
  window.openModalWithUnit = function(code, type) {
    document.getElementById('modal-backdrop').classList.add('open');
    // Set type select
    const sel = document.getElementById('cf-unit-type');
    if (sel && type) {
      for (const opt of sel.options) {
        if (opt.textContent.trim().toLowerCase().includes(type.toLowerCase()) ||
            type.toLowerCase().includes(opt.textContent.trim().toLowerCase())) {
          opt.selected = true; break;
        }
      }
    }
    // Add tag
    if (code) window.addUnitCodeTag(code);
    // Scroll to form
    const formWrap = document.getElementById('contact-form-wrap');
    if (formWrap) setTimeout(() => formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  };

  // ── Validation + submit ──
  const submitBtn = document.getElementById('cf-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const name  = document.getElementById('cf-name')?.value.trim();
    const phone = document.getElementById('cf-phone')?.value.trim();
    const errEl = document.getElementById('cf-error');

    // Validate
    if (!name || !phone) {
      errEl.textContent = I18n.t('modal.errRequired');
      errEl.style.display = '';
      return;
    }
    const phoneRe = /^(0|\+84)[0-9]{8,10}$/;
    if (!phoneRe.test(phone.replace(/\s/g, ''))) {
      errEl.textContent = I18n.t('modal.errPhone');
      errEl.style.display = '';
      return;
    }
    errEl.style.display = 'none';

    // Gom dữ liệu form. "s" = slug sale trong URL (?s=...) — backend dùng
    // để gán đúng sale; không có thì backend phân tuần tự (round-robin).
    const unitCodes = [...document.querySelectorAll('.cf-unit-tag')].map(t => t.dataset.code);
    const payload = {
      name,
      phone,
      email:   document.getElementById('cf-email')?.value.trim() || '',
      zalo:    document.getElementById('cf-zalo')?.value.trim() || '',
      budget:  document.querySelector('#cf-budget-group .cf-choice-btn.selected')?.dataset.val || '',
      purpose: document.querySelector('#cf-purpose-group .cf-choice-btn.selected')?.dataset.val || '',
      timing:  document.querySelector('#cf-time-group .cf-choice-btn.selected')?.dataset.val || '',
      notes: [
        document.getElementById('cf-unit-type')?.value,
        unitCodes.length ? 'Căn quan tâm: ' + unitCodes.join(', ') : '',
        document.getElementById('cf-note')?.value.trim(),
      ].filter(Boolean).join(' · '),
      source: 'VR Web',
      s: getSaleSlug(),
    };

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = I18n.t('modal.sending');

    // Gửi lead thật về backend.
    (async () => {
      try {
        if (!window.DataSource || !window.DataSource.submitLead) {
          throw new Error('Thiếu DataSource');
        }
        await window.DataSource.submitLead(payload);
        submitBtn.classList.remove('loading');
        document.getElementById('contact-form-wrap').style.display = 'none';
        const suc = document.getElementById('form-success');
        suc.style.display = 'flex';
        const zaloNum = payload.zalo || payload.phone;
        const zaloLink = document.getElementById('form-suc-zalo');
        if (zaloLink) zaloLink.href = 'https://zalo.me/' + zaloNum.replace(/\s/g, '');
      } catch (err) {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = window.I18n ? window.I18n.t('modal.submit') : 'Gửi yêu cầu tư vấn';
        errEl.textContent = 'Gửi không thành công, vui lòng thử lại. (' + err.message + ')';
        errEl.style.display = '';
      }
    })();
  });

  // Reset form
  document.getElementById('form-suc-reset')?.addEventListener('click', () => {
    document.getElementById('form-success').style.display = 'none';
    const formWrap = document.getElementById('contact-form-wrap');
    formWrap.style.display = '';
    // Clear fields
    ['cf-name','cf-phone','cf-email','cf-zalo','cf-note'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    document.getElementById('cf-unit-type').selectedIndex = 0;
    document.querySelectorAll('.cf-choice-btn.selected').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.cf-unit-tag').forEach(t => t.remove());
    document.getElementById('cf-codes-wrap').style.display = 'none';
    document.getElementById('cf-consent-zalo').checked = false;
    document.getElementById('cf-consent-sms').checked = false;
    document.getElementById('cf-error').style.display = 'none';
    // Reset submit btn
    submitBtn.textContent = window.I18n ? window.I18n.t('modal.submit') : 'Gửi yêu cầu tư vấn';
  });
})();

/* ============================================
   RESOURCES PANEL
   ============================================ */
const RES_ICONS = {
  doc:    '<i data-lucide="file-text" width="22" height="22"></i>',
  kit:    '<i data-lucide="briefcase" width="22" height="22"></i>',
  brand:  '<i data-lucide="globe" width="22" height="22"></i>',
  price:  '<i data-lucide="tag" width="22" height="22"></i>',
  plan:   '<i data-lucide="layout-grid" width="22" height="22"></i>',
  folder: '<i data-lucide="folder" width="22" height="22"></i>',
  image:  '<i data-lucide="image" width="22" height="22"></i>',
  video:  '<i data-lucide="play-circle" width="22" height="22"></i>',
  link:   '<i data-lucide="link" width="22" height="22"></i>',
  file:   '<i data-lucide="file" width="22" height="22"></i>',
};

// Đoán icon từ key/title/type của tài liệu
function resourceIconFor(key, item) {
  const k = String(key || '').toLowerCase();
  const t = String(item.title || '').toLowerCase();
  const type = String(item.type || '').toLowerCase();
  if (/brand|nhan-dien|nhận diện/.test(k + ' ' + t)) return 'brand';
  if (/price|gia|giá|bảng giá/.test(k + ' ' + t)) return 'price';
  if (/plan|floor|tmb|mặt bằng/.test(k + ' ' + t)) return 'plan';
  if (/sales?-?kit|bi-kip|bí kíp/.test(k + ' ' + t)) return 'kit';
  if (type === 'folder') return 'folder';
  if (type === 'image') return 'image';
  if (type === 'video') return 'video';
  if (type === 'link') return 'link';
  if (type === 'pdf' || /brochure/.test(k + ' ' + t)) return 'doc';
  return 'file';
}

let resourcesSubKey = null;

function buildResourcesPanel() {
  const grid = document.getElementById('res-grid');
  if (!grid) return;
  const key = effectiveSubKey(resourcesSubKey);
  renderSubdivisionTabs('.resources-frame', 'resources-subtabs', key, (k) => {
    resourcesSubKey = k;
    buildResourcesPanel();
  });
  const res = pickSubData(DATA.resources, key) || {};
  const keys = Object.keys(res);

  if (keys.length === 0) {
    grid.innerHTML = `<div class="res-empty" style="grid-column:1/-1;text-align:center;padding:32px;color:var(--muted,#888)">Chưa có tài liệu nào.</div>`;
    if (window.lucide?.createIcons) window.lucide.createIcons();
    return;
  }

  grid.innerHTML = keys.map(k => {
    const item = res[k] || {};
    const title = item.title || k;
    const has = !!item.url;
    const typeTag = item.type ? `<span class="res-type">${item.type.toUpperCase()}</span>` : '';
    const iconKey = resourceIconFor(k, item);
    return `
      <a class="res-card ${has ? '' : 'res-disabled'}"
         ${has ? `href="${item.url}" target="_blank" rel="noopener"` : ''}>
        <div class="res-icon">${RES_ICONS[iconKey] || RES_ICONS.file}</div>
        <div class="res-body">
          <div class="res-title">${title}</div>
          <div class="res-sub">${has ? 'Mở / Tải xuống' : 'Chưa cập nhật'}</div>
        </div>
        ${typeTag}
      </a>
    `;
  }).join('');
  if (window.lucide?.createIcons) window.lucide.createIcons();
}