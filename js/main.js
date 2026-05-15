/* ============================================
   AURORA HEIGHTS — UI & APP LOGIC
   ============================================ */

let DATA = null;
let currentSceneId = null;
let currentMenuItemId = null;
const MENU_GROUPS = [
  { key: "tongQuan",        label: "Tổng quan",          short: "TQ" },
  { key: "tienIchNoiKhu",   label: "Tiện ích nội khu",    short: "NK" },
  { key: "tienIchNgoaiKhu", label: "Tiện ích ngoại khu",  short: "NG" },
  { key: "matBangTang",     label: "Mặt bằng tầng",       short: "MB" },
  { key: "view360Can",      label: "View 360 căn hộ",     short: "VR" },
];
const _tr = (s) => (window.I18n ? window.I18n.tr(s) : s);
const _t  = (k, v) => (window.I18n ? window.I18n.t(k, v) : k);
let openGroupKey = "tongQuan"; // only one group open at a time

async function boot() {
  const res = await fetch("data/project.json");
  DATA = await res.json();
  window.DATA = DATA; // expose for mobile-stepper.js

  buildBrand();
  buildProjectCard();
  if (DATA.project.promoDeadline) startCountdown(DATA.project.promoDeadline);
  buildAmenities();
  buildTimelineAndUnits();
  buildTimelinePanel();
  buildNavPanel();
  buildSiteMap();
  buildGallery();
  buildAmenitiesDetail();
  buildLegalPanel();
  buildLocationPanel();
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

  const stage = document.getElementById("vr-stage");
  VR360.init(stage, {
    onYawChange: () => updateHotspotPositions()
  });

  // Pick first menu item whose sceneId matches the initial scene as the active highlight
  const firstSceneId = DATA.scenes[0].id;
  for (const g of MENU_GROUPS) {
    const found = (DATA.menu?.[g.key] || []).find(m => m.sceneId === firstSceneId);
    if (found) { currentMenuItemId = found.id; break; }
  }
  switchScene(firstSceneId);

  // Hide loader after first paint
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 900);
}

function buildBrand() {
  document.querySelector(".brand-text .name").textContent = DATA.project.name;
  document.querySelector(".brand-text .sub").textContent = I18n.t("ui.vrExperience");
}

function buildProjectCard() {
  const p = DATA.project;
  document.getElementById("pc-title").textContent = p.name;
  document.getElementById("pc-loc").innerHTML =
    `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> ${_tr(p.location)}`;
  document.getElementById("pc-status").innerHTML = `<span class="dot"></span> ${_tr(p.status)}`;
  document.getElementById("pc-price").textContent = _tr(p.priceFrom);

  const statsEl = document.getElementById("pc-stats");
  statsEl.innerHTML = p.stats.map(s => `
    <div class="pc-stat">
      <div class="v">${s.value}<small>${_tr(s.unit)}</small></div>
      <div class="k">${_tr(s.label)}</div>
    </div>
  `).join("");

  // Units left badge
  if (p.unitsLeft !== undefined) {
    const el = document.getElementById("pc-units-left");
    if (el) el.textContent = p.unitsLeft;
  }

  // Hotline
  if (p.hotline) {
    const numEl = document.getElementById("pc-hotline-num");
    const btnEl = document.getElementById("pc-hotline-btn");
    if (numEl) numEl.textContent = p.hotline;
    if (btnEl) btnEl.href = "tel:" + p.hotline.replace(/\s/g, "");
  }

  // Zalo
  if (p.zalo) {
    const zEl = document.getElementById("pc-zalo-btn");
    if (zEl) zEl.href = "https://zalo.me/" + p.zalo;
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

function buildAmenities() {
  const grid = document.getElementById("amen-grid");
  const iconMap = {
    pool: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M7 12V5a2 2 0 014 0M13 12V5a2 2 0 014 0"/></svg>',
    gym: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="9" width="3" height="6"/><rect x="19" y="9" width="3" height="6"/><rect x="5" y="7" width="2" height="10"/><rect x="17" y="7" width="2" height="10"/><path d="M7 12h10"/></svg>',
    spa: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c0 5-4 8-4 12s2 6 4 6 4-2 4-6-4-7-4-12z"/><path d="M5 12c2 1 4 4 4 8M19 12c-2 1-4 4-4 8"/></svg>',
    school: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg>',
    mall: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h18l-2 13H5L3 7z"/><path d="M8 7V4a4 4 0 018 0v3"/></svg>',
    park: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22V12"/><path d="M12 12c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5z"/><path d="M5 18l7-6 7 6"/></svg>',
    sky: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 20h18"/><path d="M5 20V8l7-4 7 4v12"/><path d="M9 20v-6h6v6"/></svg>',
    kid: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="7" r="3"/><path d="M5 20c0-4 3-7 7-7s7 3 7 7"/><circle cx="9" cy="7" r="0.5" fill="currentColor"/><circle cx="15" cy="7" r="0.5" fill="currentColor"/></svg>'
  };
  grid.innerHTML = DATA.project.amenities.map(a => `
    <div class="amen-tile">
      <div class="icon-wrap">${iconMap[a.icon] || ''}</div>
      <div class="label">${_tr(a.label)}</div>
    </div>
  `).join("");
}

function buildTimelineAndUnits() {
  const tlEl = document.getElementById("timeline-list");
  if (tlEl) {
    tlEl.innerHTML = DATA.timeline.map(t => `
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
  // Group by type
  const typeMap = {};
  units.forEach(u => {
    if (!typeMap[u.type]) typeMap[u.type] = { available: 0, total: 0 };
    typeMap[u.type].available += (u.available || 0);
    typeMap[u.type].total     += (u.total || u.available || 1);
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
  const types = [...new Set(DATA.floorplan.units.map(u => u.type))];
  wrap.innerHTML = types.map(t => `
    <button class="fp-tag ${fpState.activeTypes.has(t) ? 'active' : ''}" data-type="${t}">
      ${_tr(t)}
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

  const statusLabel = { available: "Còn trống", holding: "Đang giữ", sold: "Đã bán" };
  tbody.innerHTML = units.map(u => {
    const isSold = u.status === "sold";
    return `
      <tr class="${isSold ? 'row-sold' : ''}">
        <td><span class="fp-code">${u.code}</span></td>
        <td>${_tr(u.type)}</td>
        <td>${u.floor || "—"}</td>
        <td>${u.area} m²</td>
        <td>${u.direction || "—"}</td>
        <td class="fp-price">${u.price}</td>
        <td class="fp-ppm2">${u.pricePerM2 || "—"}</td>
        <td class="fp-avail">${u.available} ${_t("ui.units")}</td>
        <td><span class="fp-badge ${u.status}">${statusLabel[u.status] || u.status}</span></td>
        <td>${isSold ? "" : `<button class="fp-interest-btn" data-code="${u.code}" data-type="${_tr(u.type)}">Quan tâm</button>`}</td>
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

function switchScene(id) {
  const sc = DATA.scenes.find(s => s.id === id);
  if (!sc) return;
  currentSceneId = id;
  VR360.loadScene(sc);

  // update info panel
  document.getElementById("scene-type").textContent = _tr(sc.type);
  document.getElementById("scene-title").textContent = _tr(sc.title);
  document.getElementById("scene-subtitle").textContent = _tr(sc.subtitle);

  // mark active card in nav list (match by menu item id, not sceneId — many items may share a sceneId)
  document.querySelectorAll(".np-card").forEach(c => {
    c.classList.toggle("active", c.dataset.id === currentMenuItemId);
  });

  // Build hotspots
  buildHotspots(sc.hotspots);
  closePopup();
}

function buildHotspots(hotspots) {
  const layer = document.getElementById("hotspot-layer");
  layer.innerHTML = hotspots.map(h => `
    <div class="hotspot" data-id="${h.id}" data-type="${h.type}" data-x="${h.x}" data-y="${h.y}">
      <div class="hotspot-pin"></div>
      <div class="hotspot-label">${_tr(h.label)}</div>
    </div>
  `).join("");
  layer.querySelectorAll(".hotspot").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = el.dataset.id;
      const sc = DATA.scenes.find(s => s.id === currentSceneId);
      const hs = sc.hotspots.find(h => h.id === id);
      if (hs.type === "nav") {
        switchScene(hs.target);
      } else {
        showPopup(hs, el);
      }
    });
  });
  updateHotspotPositions();
}

function updateHotspotPositions() {
  const layer = document.getElementById("hotspot-layer");
  if (!layer) return;
  layer.querySelectorAll(".hotspot").forEach(el => {
    const x = parseFloat(el.dataset.x);
    const y = parseFloat(el.dataset.y);
    const p = VR360.projectHotspot(x, y);
    if (p.visible && p.x >= -50 && p.x <= window.innerWidth + 50) {
      el.style.left = p.x + "px";
      el.style.top = p.y + "px";
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });
}

function showPopup(hs, anchorEl) {
  const popup = document.getElementById("hotspot-popup");
  popup.querySelector("h4").textContent = _tr(hs.label);
  popup.querySelector("p").textContent = _tr(hs.desc);
  const r = anchorEl.getBoundingClientRect();
  popup.style.left = (r.left + r.width / 2) + "px";
  popup.style.top = (r.top - 12) + "px";
  popup.classList.add("open");
}
function closePopup() {
  document.getElementById("hotspot-popup").classList.remove("open");
}

function buildNavPanel() {
  const searchEl = document.getElementById("np-search");
  searchEl?.addEventListener("input", renderNavList);
  renderNavList();
}

function renderNavList() {
  const listEl = document.getElementById("np-list");
  if (!listEl) return;
  const menu = DATA.menu || {};
  const query = (document.getElementById("np-search")?.value || "").trim().toLowerCase();

  const groupsHtml = MENU_GROUPS.map(g => {
    const items = menu[g.key] || [];
    const filtered = query
      ? items.filter(m => _tr(m.label).toLowerCase().includes(query) || m.label.toLowerCase().includes(query))
      : items;

    // When searching, auto-open groups that have matches; otherwise only the single open key
    const isOpen = query ? filtered.length > 0 : openGroupKey === g.key;

    if (query && filtered.length === 0) return ""; // hide empty groups during search

    const cardsHtml = filtered.map((m, i) => {
      const isActive = m.id === currentMenuItemId;
      return `
        <div class="np-card ${isActive ? 'active' : ''}" data-id="${m.id}" data-scene="${m.sceneId || ''}">
          <div class="np-card-idx">${String(i + 1).padStart(2, '0')}</div>
          <div class="np-card-info">
            <div class="np-card-name">${_tr(m.label)}</div>
            <div class="np-card-sub">${m.sceneId ? _t("ui.viewIn360") : _t("ui.nearbyAmenity")}</div>
          </div>
          <svg class="np-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </div>
      `;
    }).join("");

    return `
      <div class="np-group ${isOpen ? 'open' : ''}" data-group="${g.key}">
        <button class="np-group-head" type="button">
          <span class="np-group-icon">${g.short}</span>
          <span class="np-group-title">${_tr(g.label)}</span>
          <span class="np-group-count">${filtered.length}</span>
          <svg class="np-group-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </button>
        <div class="np-group-body">${cardsHtml}</div>
      </div>
    `;
  }).join("");

  if (!groupsHtml.trim()) {
    listEl.innerHTML = `<div class="np-empty">${_t("ui.noResults")}</div>`;
    return;
  }

  listEl.innerHTML = groupsHtml;

  listEl.querySelectorAll(".np-group").forEach(group => {
    const key = group.dataset.group;
    group.querySelector(".np-group-head").addEventListener("click", () => {
      const isOpen = group.classList.contains("open");
      // Close all groups first
      listEl.querySelectorAll(".np-group.open").forEach(g => g.classList.remove("open"));
      if (isOpen) {
        openGroupKey = null;
      } else {
        group.classList.add("open");
        openGroupKey = key;
      }
    });
    group.querySelectorAll(".np-card").forEach(card => {
      card.addEventListener("click", () => {
        currentMenuItemId = card.dataset.id;
        const sceneId = card.dataset.scene;
        if (sceneId) switchScene(sceneId);
        else {
          // No scene attached — just mark active manually
          document.querySelectorAll(".np-card").forEach(c => {
            c.classList.toggle("active", c.dataset.id === currentMenuItemId);
          });
        }
      });
    });
  });
}

function buildSiteMap() {
  const sm = DATA.siteMap;
  if (!sm) return;
  const img = document.getElementById("sm-img");
  if (img && sm.image) img.src = sm.image;
  const points = document.getElementById("sm-points");
  points.innerHTML = (sm.points || []).map(p => `
    <div class="sm-point" data-scene="${p.sceneId || ''}" style="left:${p.x}%; top:${p.y}%;">
      <span class="sm-pin"></span>
      <span class="sm-label">${_tr(p.label)}</span>
    </div>
  `).join("");
  points.querySelectorAll(".sm-point").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.scene;
      if (!id) return;
      document.getElementById("sitemap-overlay").classList.remove("open");
      switchScene(id);
    });
  });
}

function buildGallery() {
  const grid = document.getElementById("gal-grid");
  if (!grid) return;
  const items = DATA.gallery || [];
  grid.innerHTML = items.map((g, i) => `
    <div class="gal-item" data-idx="${i}">
      <img src="${g.src}" alt="${_tr(g.title) || ''}"/>
      ${g.title ? `<div class="gal-cap">${_tr(g.title)}</div>` : ''}
    </div>
  `).join("");
  grid.querySelectorAll(".gal-item").forEach(el => {
    el.addEventListener("click", () => openLightbox(parseInt(el.dataset.idx, 10)));
  });
}

let lbIdx = 0;
function openLightbox(idx) {
  lbIdx = idx;
  const items = DATA.gallery || [];
  if (!items.length) return;
  const lb = document.getElementById("lightbox");
  document.getElementById("lb-img").src = items[lbIdx].src;
  document.getElementById("lb-cap").textContent = _tr(items[lbIdx].title) || "";
  lb.classList.add("open");
}
function navLightbox(dir) {
  const items = DATA.gallery || [];
  lbIdx = (lbIdx + dir + items.length) % items.length;
  document.getElementById("lb-img").src = items[lbIdx].src;
  document.getElementById("lb-cap").textContent = _tr(items[lbIdx].title) || "";
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

function bindOverlays() {
  document.getElementById("btn-amenities-detail")?.addEventListener("click", () => {
    document.getElementById("amenities-detail-overlay").classList.add("open");
  });
  document.getElementById("amenities-detail-close")?.addEventListener("click", () => {
    document.getElementById("amenities-detail-overlay").classList.remove("open");
  });
  document.getElementById("amenities-detail-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "amenities-detail-overlay") e.currentTarget.classList.remove("open");
  });

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
    if (iframe && !iframe.src && DATA.location?.mapSrc) iframe.src = DATA.location.mapSrc;
    document.getElementById("location-overlay").classList.add("open");
  });
  document.getElementById("location-close")?.addEventListener("click", () => {
    document.getElementById("location-overlay").classList.remove("open");
  });
  document.getElementById("location-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "location-overlay") e.currentTarget.classList.remove("open");
  });

  document.getElementById("btn-sitemap")?.addEventListener("click", () => {
    document.getElementById("sitemap-overlay").classList.add("open");
  });
  document.getElementById("sm-close")?.addEventListener("click", () => {
    document.getElementById("sitemap-overlay").classList.remove("open");
  });
  document.getElementById("sitemap-overlay")?.addEventListener("click", (e) => {
    if (e.target.id === "sitemap-overlay") e.currentTarget.classList.remove("open");
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
  let rotating = false;
  document.getElementById("ctrl-rotate").addEventListener("click", (e) => {
    rotating = !rotating;
    VR360.setAutoRotate(rotating);
    e.currentTarget.classList.toggle("active", rotating);
  });
  document.getElementById("ctrl-zoom-in").addEventListener("click", () => VR360.zoomBy(-8));
  document.getElementById("ctrl-zoom-out").addEventListener("click", () => VR360.zoomBy(8));
  document.getElementById("ctrl-fullscreen").addEventListener("click", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });

  document.querySelector(".amenities-overlay").addEventListener("click", (e) => {
    if (e.target.id === "amenities-overlay") {
      e.currentTarget.classList.remove("open");
    }
  });

  document.getElementById("hotspot-popup").querySelector(".close")
    .addEventListener("click", closePopup);
  document.getElementById("vr-stage").addEventListener("pointerdown", closePopup);
}

function bindModal() {
  document.getElementById("open-modal").addEventListener("click", openModal);
  document.getElementById("open-modal-2").addEventListener("click", openModal);
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

    // pc-collapse — toggle collapse (desktop); mobile handled by mobilePatch
    if (!isMob && e.target.closest("#pc-collapse")) {
      pc.classList.toggle("collapsed");
      // Show/hide the pc-expand button
      const pcExp = document.getElementById("pc-expand");
      if (pcExp) pcExp.classList.toggle("visible", pc.classList.contains("collapsed"));
    }

    // pc-expand (desktop only)
    if (!isMob && e.target.closest("#pc-expand")) {
      pc.classList.remove("collapsed");
      const pcExp = document.getElementById("pc-expand");
      if (pcExp) pcExp.classList.remove("visible");
    }
  });
}

function bindSmartHide() {
  const ui = document.getElementById("ui");
  const stage = document.getElementById("vr-stage");
  const restore = document.getElementById("ui-restore");
  if (!ui || !stage) return;

  let hideTimer = null;
  let isDragging = false;

  const hide = () => ui.classList.add("hidden");
  const show = () => {
    ui.classList.remove("hidden");
    clearTimeout(hideTimer);
  };

  stage.addEventListener("pointerdown", () => {
    isDragging = true;
    hide();
    clearTimeout(hideTimer);
  });
  window.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    hideTimer = setTimeout(show, 2200);
  });

  restore?.addEventListener("click", show);
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
    menu.querySelectorAll(".ctrl-lang-item").forEach(it => {
      it.addEventListener("click", (e) => {
        e.stopPropagation();
        window.I18n.set(it.dataset.code);
        codeEl.textContent = it.dataset.code.toUpperCase();
        menu.classList.remove("open");
        renderMenu();
      });
    });
  };
  renderMenu();

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== btn) menu.classList.remove("open");
  });
}

function rebuildDynamic() {
  if (!DATA) return;
  buildProjectCard();
  if (DATA.project.promoDeadline) startCountdown(DATA.project.promoDeadline);
  buildAmenities();
  buildTimelineAndUnits();
  renderNavList();
  // Re-render scene-dependent labels (scene title/subtitle/type, hotspots)
  if (currentSceneId) {
    const sc = DATA.scenes.find(s => s.id === currentSceneId);
    if (sc) {
      document.getElementById("scene-type").textContent = _tr(sc.type);
      document.getElementById("scene-title").textContent = _tr(sc.title);
      document.getElementById("scene-subtitle").textContent = _tr(sc.subtitle);
      buildHotspots(sc.hotspots);
    }
  }
  // Re-render sitemap point labels & gallery captions
  buildSiteMap();
  buildGallery();
  // Refresh active tour step text if active
  if (tourActive) showTourStep();
}

/* ============================================
   HELP TOUR (HELPTOUR_SPEC)
   ============================================ */
const HELP_ITEMS = [
  { target: ".brand",           labelKey: "tour.brand" },
  { target: "#btn-sitemap",     mobileTarget: "#mob-sitemap-btn", openDrawer: true,  labelKey: "tour.sitemap" },
  { target: "#btn-gallery",     mobileTarget: "#mob-gallery-btn", openDrawer: true,  labelKey: "tour.gallery" },
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
  { target: "#project-card",    openPC: true,                     labelKey: "tour.project" },
  { target: "#bb-chat-btn",     round: true,                      labelKey: "tour.bot" },
  { target: "#ui-restore",      labelKey: "tour.restore" },
  { target: () => document.querySelector(".hotspot"),             labelKey: "tour.hotspot" },
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

/* ============================================
   AMENITIES DETAIL PANEL (Bước 4)
   ============================================ */
function buildAmenitiesDetail() {
  if (!DATA.amenitiesDetail) return;
  renderAmenityTab('noiKhu');

  document.getElementById('amenity-tabs')?.querySelectorAll('.adv-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.adv-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAmenityTab(btn.dataset.tab);
    });
  });
}

function renderAmenityTab(tabKey) {
  const grid = document.getElementById('amenity-detail-grid');
  if (!grid || !DATA.amenitiesDetail) return;
  const items = DATA.amenitiesDetail[tabKey] || [];
  const iconMap = {
    pool:      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M7 12V5a2 2 0 014 0M13 12V5a2 2 0 014 0"/></svg>',
    gym:       '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="9" width="3" height="6"/><rect x="19" y="9" width="3" height="6"/><rect x="5" y="7" width="2" height="10"/><rect x="17" y="7" width="2" height="10"/><path d="M7 12h10"/></svg>',
    spa:       '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c0 5-4 8-4 12s2 6 4 6 4-2 4-6-4-7-4-12z"/><path d="M5 12c2 1 4 4 4 8M19 12c-2 1-4 4-4 8"/></svg>',
    kid:       '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="7" r="3"/><path d="M5 20c0-4 3-7 7-7s7 3 7 7"/></svg>',
    bbq:       '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h16M8 4l1 4M16 4l-1 4M10 12v8M14 12v8M6 20h12"/></svg>',
    lib:       '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13"/><path d="M4 19a2 2 0 002 2h12a2 2 0 002-2M9 10h6"/></svg>',
    sky:       '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 20h18M5 20V8l7-4 7 4v12"/><path d="M9 20v-6h6v6"/></svg>',
    cinema:    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 4v16M16 4v16M2 12h20"/></svg>',
    conf:      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 6V4a2 2 0 014 0v2M14 6V4a2 2 0 014 0v2"/></svg>',
    concierge: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3"/><path d="M20 21a8 8 0 10-16 0"/><path d="M12 11v10"/></svg>',
    security:  '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l8 3v7c0 5-3.5 9.75-8 11C7.5 21.75 4 17 4 12V5l8-3z"/></svg>',
    pet:       '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="7" r="2"/><circle cx="15" cy="7" r="2"/><circle cx="5" cy="13" r="2"/><circle cx="19" cy="13" r="2"/><path d="M12 21c-4 0-6-2-6-5 0-2 2-4 6-4s6 2 6 4c0 3-2 5-6 5z"/></svg>',
    parking:   '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M9 8h4a3 3 0 010 6H9V8z"/></svg>',
    elevator:  '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 9l3-3 3 3M9 15l3 3 3-3"/></svg>',
    power:     '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  };
  grid.innerHTML = items.map(item => `
    <div class="adv-item">
      <div class="adv-item-icon">${iconMap[item.icon] || ''}</div>
      <div class="adv-item-body">
        <div class="adv-item-name">${item.name}</div>
        <div class="adv-item-desc">${item.desc}</div>
      </div>
    </div>
  `).join('');
}

/* ============================================
   LEGAL / TRUST PANEL (Bước 5)
   ============================================ */
function buildLegalPanel() {
  if (!DATA.legal) return;

  // Stats
  const statsEl = document.getElementById('legal-stats');
  if (statsEl) {
    statsEl.innerHTML = DATA.legal.developerStats.map(s => `
      <div class="legal-stat">
        <div class="legal-stat-v">${s.value}<span class="legal-stat-u">${s.unit}</span></div>
        <div class="legal-stat-k">${s.label}</div>
      </div>
    `).join('');
  }

  // Checklist
  const checkEl = document.getElementById('legal-checklist');
  if (checkEl) {
    checkEl.innerHTML = DATA.legal.documents.map(d => `
      <div class="legal-check-row ${d.done ? 'done' : 'pending'}">
        <div class="legal-check-icon">
          ${d.done
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>'
            : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>'
          }
        </div>
        <div class="legal-check-body">
          <div class="legal-check-name">${d.name}</div>
          <div class="legal-check-detail">${d.detail}</div>
        </div>
      </div>
    `).join('');
  }

  // Banks
  const banksEl = document.getElementById('legal-banks');
  if (banksEl) {
    banksEl.innerHTML = DATA.legal.banks.map(b => `
      <div class="legal-bank-card">
        <div class="legal-bank-name">${b.name}</div>
        <div class="legal-bank-rate">${b.rate}</div>
        <div class="legal-bank-term">Đến ${b.maxTerm}</div>
      </div>
    `).join('');
  }

  // Testimonials
  const testEl = document.getElementById('legal-testimonials');
  if (testEl) {
    let tIdx = 0;
    const render = () => {
      const t = DATA.legal.testimonials[tIdx];
      testEl.innerHTML = `
        <div class="legal-testi">
          <div class="lt-avatar">${t.initials}</div>
          <div class="lt-body">
            <div class="lt-quote">"${t.text}"</div>
            <div class="lt-meta"><strong>${t.initials}</strong> · ${t.role} · <em>${t.unit}</em></div>
          </div>
          <div class="lt-nav">
            <button class="lt-btn" id="lt-prev">‹</button>
            <span class="lt-dots">${DATA.legal.testimonials.map((_,i) => `<span class="lt-dot ${i===tIdx?'active':''}"></span>`).join('')}</span>
            <button class="lt-btn" id="lt-next">›</button>
          </div>
        </div>`;
      testEl.querySelector('#lt-prev')?.addEventListener('click', () => { tIdx = (tIdx - 1 + DATA.legal.testimonials.length) % DATA.legal.testimonials.length; render(); });
      testEl.querySelector('#lt-next')?.addEventListener('click', () => { tIdx = (tIdx + 1) % DATA.legal.testimonials.length; render(); });
    };
    render();
  }
}

/* ============================================
   LOCATION PANEL (Bước 6)
   ============================================ */
function buildLocationPanel() {
  if (!DATA.location) return;
  // Set iframe src lazily on open
  renderLocationList('');

  document.getElementById('location-filter')?.querySelectorAll('.loc-cat-btn').forEach(btn => {
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
  const items = DATA.location.nearby.filter(n => !cat || n.cat === cat);
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
function buildTimelinePanel() {
  if (!DATA.timeline) return;

  const items   = DATA.timeline;
  const doneN   = items.filter(t => t.status === 'done').length;
  const total   = items.length;
  const pct     = Math.round((doneN / total) * 100);
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
      </div>`;
  }

  // Track
  const trackEl = document.getElementById('tl-track');
  if (!trackEl) return;
  trackEl.innerHTML = items.map((t, i) => {
    const cls = t.status === 'done' ? 'done'
              : t.status === 'active' ? 'active'
              : 'upcoming';
    const isLast = i === items.length - 1;
    return `
      <div class="tl-item ${cls}">
        <div class="tl-spine">
          <div class="tl-node">
            ${t.status === 'done'
              ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4L19 7"/></svg>'
              : t.status === 'active'
                ? '<div class="tl-node-pulse"></div>'
                : '<div class="tl-node-dot"></div>'}
          </div>
          ${!isLast ? '<div class="tl-line"></div>' : ''}
        </div>
        <div class="tl-card">
          <div class="tl-card-top">
            <div class="tl-card-date">${_tr(t.date)}</div>
            <span class="tl-badge ${cls}">${cls === 'done' ? 'Hoàn thành' : cls === 'active' ? 'Đang thực hiện' : 'Sắp tới'}</span>
          </div>
          <div class="tl-card-phase">${_tr(t.phase)}</div>
          ${t.desc ? `<div class="tl-card-desc">${t.desc}</div>` : ''}
        </div>
      </div>`;
  }).join('');
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
   LOAN CALCULATOR
   ============================================ */
(function initLoanCalc() {
  const BANKS = [
    { name: "Vietcombank", rate: 7.5 },
    { name: "BIDV",        rate: 7.8 },
    { name: "Techcombank", rate: 8.0 },
    { name: "VPBank",      rate: 8.2 },
  ];

  const QUICK_PRICES = [4.9, 5.4, 6.8, 8.9, 14.2];

  let selBank = 0;  // index
  let selTerm = 20; // years

  function fmt(bil) {
    if (bil >= 1) return bil.toFixed(2).replace(/\.?0+$/, '') + ' tỷ';
    return (bil * 1000).toFixed(0) + ' triệu';
  }
  function fmtMonth(bil) {
    const m = bil * 1000; // triệu
    return m >= 1000
      ? (m / 1000).toFixed(3).replace(/\.?0+$/, '') + ' tỷ/tháng'
      : m.toFixed(1) + ' triệu/tháng';
  }

  function calc() {
    const price     = parseFloat(document.getElementById('loan-price')?.value) || 5.4;
    const equityPct = parseInt(document.getElementById('loan-equity')?.value)  || 30;
    const equity    = price * equityPct / 100;
    const principal = price - equity;                // tỷ
    const rAnnual   = BANKS[selBank].rate / 100;
    const rMonthly  = rAnnual / 12;
    const n         = selTerm * 12;                  // months

    // Update equity label
    const pctEl = document.getElementById('loan-equity-pct-label');
    const valEl = document.getElementById('loan-equity-val');
    if (pctEl) pctEl.textContent = equityPct + '%';
    if (valEl) valEl.textContent = fmt(equity);

    // Monthly payment (annuity)
    let monthly; // tỷ
    if (rMonthly === 0) {
      monthly = principal / n;
    } else {
      monthly = principal * rMonthly * Math.pow(1 + rMonthly, n) / (Math.pow(1 + rMonthly, n) - 1);
    }
    const totalPay    = monthly * n;
    const totalInt    = totalPay - principal;

    // Update result panel
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('loan-monthly',  fmtMonth(monthly));
    set('loan-amount',   fmt(principal));
    set('loan-interest', fmt(totalInt));
    set('loan-total',    fmt(totalPay));

    // Mini bar chart (yearly principal + interest)
    drawLoanChart(principal, rMonthly, monthly, selTerm);
  }

  function drawLoanChart(principal, rMonthly, monthly, years) {
    const chart = document.getElementById('loan-chart');
    if (!chart) return;
    // Build yearly sums
    let balance = principal;
    const bars = [];
    for (let y = 1; y <= years; y++) {
      let yPrincipal = 0, yInterest = 0;
      for (let m = 0; m < 12; m++) {
        const intPart  = balance * rMonthly;
        const prinPart = Math.min(monthly - intPart, balance);
        yInterest  += intPart;
        yPrincipal += prinPart;
        balance    -= prinPart;
        if (balance <= 0) { balance = 0; break; }
      }
      bars.push({ p: yPrincipal, i: yInterest });
      if (balance <= 0) break;
    }
    const maxBar = Math.max(...bars.map(b => b.p + b.i));
    const show = Math.min(bars.length, 10); // max 10 bars
    const step = Math.ceil(bars.length / show);
    const displayed = bars.filter((_, i) => i % step === 0 || i === bars.length - 1).slice(0, show);

    chart.innerHTML = displayed.map((b, i) => {
      const total = b.p + b.i;
      const pPct  = maxBar > 0 ? (b.p / maxBar) * 100 : 0;
      const iPct  = maxBar > 0 ? (b.i / maxBar) * 100 : 0;
      const yr    = (i + 1) * step;
      return `
        <div class="loan-bar-wrap" title="Năm ${yr}: Gốc ${fmt(b.p)} / Lãi ${fmt(b.i)}">
          <div class="loan-bar">
            <div class="lb-interest"  style="height:${iPct}%"></div>
            <div class="lb-principal" style="height:${pPct}%"></div>
          </div>
          <div class="loan-bar-yr">${yr}</div>
        </div>`;
    }).join('');
  }

  function initUI() {
    // Quick price buttons
    const qWrap = document.getElementById('loan-quick-prices');
    if (qWrap) {
      qWrap.innerHTML = QUICK_PRICES.map(p =>
        `<button class="loan-qp-btn" data-p="${p}">${p} tỷ</button>`
      ).join('');
      qWrap.querySelectorAll('.loan-qp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const inp = document.getElementById('loan-price');
          if (inp) { inp.value = btn.dataset.p; calc(); }
        });
      });
    }

    // Term buttons
    document.getElementById('loan-term-btns')?.querySelectorAll('.loan-term-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.loan-term-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selTerm = parseInt(btn.dataset.val);
        calc();
      });
    });

    // Bank buttons
    const bankWrap = document.getElementById('loan-bank-btns');
    if (bankWrap) {
      bankWrap.innerHTML = BANKS.map((b, i) =>
        `<button class="loan-bank-btn ${i === 0 ? 'active' : ''}" data-i="${i}">
          <span class="lbb-name">${b.name}</span>
          <span class="lbb-rate">${b.rate}%/năm</span>
        </button>`
      ).join('');
      bankWrap.querySelectorAll('.loan-bank-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.loan-bank-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selBank = parseInt(btn.dataset.i);
          calc();
        });
      });
    }

    // Sliders + price input
    document.getElementById('loan-equity')?.addEventListener('input', calc);
    document.getElementById('loan-price')?.addEventListener('input', calc);

    // CTA → open loan appointment modal with pre-filled data
    document.getElementById('loan-open-form')?.addEventListener('click', () => {
      const price     = parseFloat(document.getElementById('loan-price')?.value) || 5.4;
      const equityPct = parseInt(document.getElementById('loan-equity')?.value)  || 30;
      const equity    = price * equityPct / 100;
      const principal = price - equity;
      const bank      = BANKS[selBank];
      const monthly   = document.getElementById('loan-monthly')?.textContent || '—';

      document.getElementById('loan-overlay')?.classList.remove('open');
      openLoanApptModal({ price, equityPct, equity, principal, bank, selTerm, monthly });
    });

    calc();
  }

  // Open/close
  document.getElementById('btn-loan')?.addEventListener('click', () => {
    document.getElementById('loan-overlay')?.classList.add('open');
    initUI(); // idempotent — binds once, re-renders on reopen
  });
  document.getElementById('loan-close')?.addEventListener('click', () => {
    document.getElementById('loan-overlay')?.classList.remove('open');
  });
  document.getElementById('loan-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'loan-overlay') e.target.classList.remove('open');
  });

  // Allow pre-fill from unit table "Tính vay" (future hook)
  window.openLoanWithPrice = function(priceVal) {
    const inp = document.getElementById('loan-price');
    if (inp) inp.value = priceVal;
    document.getElementById('loan-overlay')?.classList.add('open');
    initUI();
  };
})();

/* ============================================
   LOAN APPOINTMENT MODAL
   ============================================ */
(function initLoanApptModal() {
  function fmtBil(bil) {
    if (bil >= 1) return bil.toFixed(2).replace(/\.?0+$/, '') + ' tỷ';
    return (bil * 1000).toFixed(0) + ' triệu';
  }

  window.openLoanApptModal = function({ price, equityPct, equity, principal, bank, selTerm, monthly }) {
    // Build summary card
    const summary = document.getElementById('lap-summary');
    if (summary) {
      summary.innerHTML = `
        <div class="lap-sum-item">
          <span class="lap-sum-label">Giá trị căn hộ</span>
          <span class="lap-sum-value">${fmtBil(price)}</span>
        </div>
        <div class="lap-sum-item">
          <span class="lap-sum-label">Vốn tự có (${equityPct}%)</span>
          <span class="lap-sum-value">${fmtBil(equity)}</span>
        </div>
        <div class="lap-sum-item">
          <span class="lap-sum-label">Số tiền vay</span>
          <span class="lap-sum-value">${fmtBil(principal)}</span>
        </div>
        <div class="lap-sum-item">
          <span class="lap-sum-label">Thời hạn</span>
          <span class="lap-sum-value">${selTerm} năm</span>
        </div>
        <div class="lap-sum-item">
          <span class="lap-sum-label">Ngân hàng</span>
          <span class="lap-sum-value">${bank.name} · ${bank.rate}%/năm</span>
        </div>
        <div class="lap-sum-item">
          <span class="lap-sum-label">Trả hàng tháng</span>
          <span class="lap-sum-value highlight">${monthly}</span>
        </div>
      `;
    }

    // Reset form
    ['lap-name', 'lap-phone', 'lap-date', 'lap-note'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.querySelectorAll('.lap-check-item input').forEach(cb => {
      cb.checked = cb.value === 'rate' || cb.value === 'plan';
    });
    document.querySelectorAll('.lap-time-btn').forEach(b => b.classList.remove('active'));
    const flexBtn = document.querySelector('.lap-time-btn[data-val="flexible"]');
    if (flexBtn) flexBtn.classList.add('active');

    const err = document.getElementById('lap-error');
    if (err) { err.style.display = 'none'; err.textContent = ''; }
    const lapSuccess = document.getElementById('lap-success');
    if (lapSuccess) lapSuccess.style.display = 'none';
    const lapFooter = document.querySelector('.lap-footer');
    if (lapFooter) lapFooter.style.display = '';
    const lapBody = document.querySelector('.lap-body');
    if (lapBody)  lapBody.style.display = '';
    const lapSumm = document.getElementById('lap-summary');
    if (lapSumm)  lapSumm.style.display = '';

    document.getElementById('loan-appt-backdrop')?.classList.add('open');
  };

  function closeLoanAppt() {
    document.getElementById('loan-appt-backdrop')?.classList.remove('open');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Close handlers
    document.getElementById('loan-appt-close')?.addEventListener('click', closeLoanAppt);
    document.getElementById('loan-appt-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'loan-appt-backdrop') closeLoanAppt();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLoanAppt();
    });

    // Time slot selection
    document.getElementById('lap-time-btns')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.lap-time-btn');
      if (!btn) return;
      document.querySelectorAll('.lap-time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    // Submit
    document.getElementById('lap-submit')?.addEventListener('click', () => {
      const name  = document.getElementById('lap-name')?.value.trim();
      const phone = document.getElementById('lap-phone')?.value.trim();
      const err   = document.getElementById('lap-error');

      if (!name || !phone) {
        err.textContent = 'Vui lòng nhập họ tên và số điện thoại.';
        err.style.display = 'block';
        return;
      }
      if (!/^(0|\+84)\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
        err.textContent = 'Số điện thoại không hợp lệ.';
        err.style.display = 'block';
        return;
      }

      err.style.display = 'none';
      const footer = document.querySelector('.lap-footer');
      const body   = document.querySelector('.lap-body');
      const summ   = document.getElementById('lap-summary');
      if (footer) footer.style.display = 'none';
      if (body)   body.style.display   = 'none';
      if (summ)   summ.style.display   = 'none';
      document.getElementById('lap-success').style.display = 'flex';
    });

    // Reset
    document.getElementById('lap-reset')?.addEventListener('click', () => {
      const footer = document.querySelector('.lap-footer');
      const body   = document.querySelector('.lap-body');
      const summ   = document.getElementById('lap-summary');
      if (footer) footer.style.display = '';
      if (body)   body.style.display   = '';
      if (summ)   summ.style.display   = '';
      document.getElementById('lap-success').style.display = 'none';
    });
  });
})();

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

  // ── Unit code tags (từ bảng giá → form) ──
  // openModalWithUnit đã có sẵn trong main.js — ta extend nó
  const _originalOpenModalWithUnit = window.openModalWithUnit || openModalWithUnit;
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

    // Collect data (log ra console thay vì gửi API thật)
    const payload = {
      name,
      phone,
      email:   document.getElementById('cf-email')?.value.trim(),
      zalo:    document.getElementById('cf-zalo')?.value.trim(),
      unitType: document.getElementById('cf-unit-type')?.value,
      unitCodes: [...document.querySelectorAll('.cf-unit-tag')].map(t => t.dataset.code),
      budget:  document.querySelector('#cf-budget-group .cf-choice-btn.selected')?.dataset.val,
      purpose: document.querySelector('#cf-purpose-group .cf-choice-btn.selected')?.dataset.val,
      timing:  document.querySelector('#cf-time-group .cf-choice-btn.selected')?.dataset.val,
      note:    document.getElementById('cf-note')?.value.trim(),
      consentZalo: document.getElementById('cf-consent-zalo')?.checked,
      consentSms:  document.getElementById('cf-consent-sms')?.checked,
      source: 'vr360-form',
      timestamp: new Date().toISOString(),
    };
    console.log('[Aurora CRM] Lead payload:', payload);

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = I18n.t('modal.sending');

    // Simulate API call (replace with real endpoint)
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      // Show success
      document.getElementById('contact-form-wrap').style.display = 'none';
      const suc = document.getElementById('form-success');
      suc.style.display = '';
      suc.style.display = 'flex';
      // Update Zalo link if user gave a different Zalo number
      const zaloNum = payload.zalo || payload.phone;
      const zaloLink = document.getElementById('form-suc-zalo');
      if (zaloLink) zaloLink.href = 'https://zalo.me/' + zaloNum.replace(/\s/g, '');
    }, 800);
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
   URGENCY TOAST — Social proof (Bước 9)
   ============================================ */
(function initUrgencyToasts() {
  const SVG = {
    view:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    book:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
    alert: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  };

  const MESSAGES = [
    { cls: "view",  title: "18 người đang xem",          sub: "dự án Aurora Heights ngay lúc này" },
    { cls: "book",  title: "Vừa đặt giữ 2PN+1 tầng 22", sub: "3 phút trước · Khách Hà Nội" },
    { cls: "book",  title: "Vừa đặt giữ Duplex tầng 40", sub: "12 phút trước · Khách TP.HCM" },
    { cls: "alert", title: "Còn 49 căn trong đợt này",   sub: "Ưu đãi 8% kết thúc sớm" },
    { cls: "view",  title: "24 người đang xem",           sub: "dự án Aurora Heights ngay lúc này" },
    { cls: "book",  title: "Vừa đặt giữ 3PN tầng 35",   sub: "7 phút trước · Khách nước ngoài" },
    { cls: "alert", title: "Căn 3PN tầng 28 vừa giữ",   sub: "Chỉ còn 9 căn 3PN" },
    { cls: "view",  title: "31 người đang xem",           sub: "dự án Aurora Heights ngay lúc này" },
  ];

  const wrap = document.createElement('div');
  wrap.id = 'urgency-toast-wrap';
  document.body.appendChild(wrap);

  let msgIdx = 0;
  const SHOW_AFTER  = 30 * 1000;
  const INTERVAL    = 18 * 1000;
  const VISIBLE_DUR =  6 * 1000;

  function showToast() {
    const msg = MESSAGES[msgIdx % MESSAGES.length];
    msgIdx++;

    const el = document.createElement('div');
    el.className = 'urgency-toast';
    el.innerHTML = `
      <div class="toast-icon ${msg.cls}">${SVG[msg.cls]}</div>
      <div class="toast-body">
        <div class="toast-title">${I18n.tr(msg.title)}</div>
        <div class="toast-sub">${I18n.tr(msg.sub)}</div>
      </div>
      <button class="toast-close" aria-label="${I18n.t('ai.close')}">×</button>
    `;
    wrap.appendChild(el);

    const dismissTimer = setTimeout(() => dismiss(el), VISIBLE_DUR);
    el.querySelector('.toast-close').addEventListener('click', () => { clearTimeout(dismissTimer); dismiss(el); });
    el.addEventListener('click', (e) => {
      if (!e.target.classList.contains('toast-close')) { clearTimeout(dismissTimer); dismiss(el); }
    });
  }

  function dismiss(el) {
    el.classList.add('hiding');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  setTimeout(() => { showToast(); setInterval(showToast, INTERVAL); }, SHOW_AFTER);
})();