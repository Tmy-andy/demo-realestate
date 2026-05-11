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

  buildBrand();
  buildProjectCard();
  buildAmenities();
  buildTimelineAndUnits();
  buildNavPanel();
  buildSiteMap();
  buildGallery();
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
  document.querySelector(".brand-text .sub").textContent = "VR360 EXPERIENCE";
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
  tlEl.innerHTML = DATA.timeline.map(t => `
    <div class="tl-row ${t.done ? 'done' : ''}">
      <div class="tl-dot"></div>
      <div class="tl-phase">${_tr(t.phase)}</div>
      <div class="tl-date">${_tr(t.date)}</div>
    </div>
  `).join("");

  const unitEl = document.getElementById("unit-rows");
  unitEl.innerHTML = DATA.floorplan.units.map(u => `
    <tr>
      <td>${u.code}</td>
      <td>${_tr(u.type)}</td>
      <td>${u.area}</td>
      <td class="price">${_tr(u.price)}</td>
      <td class="avail">${u.available} ${_t("ui.units")}</td>
    </tr>
  `).join("");
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
function openModal() { document.getElementById("modal-backdrop").classList.add("open"); }
function closeModal() { document.getElementById("modal-backdrop").classList.remove("open"); }

function bindPanelCollapse() {
  const np = document.getElementById("nav-panel");
  const pc = document.getElementById("project-card");

  document.getElementById("np-collapse")?.addEventListener("click", () => {
    np.classList.add("collapsed");
    document.body.classList.add("nav-panel-collapsed");
  });
  document.getElementById("np-expand")?.addEventListener("click", () => {
    np.classList.remove("collapsed");
    document.body.classList.remove("nav-panel-collapsed");
  });
  document.getElementById("pc-collapse")?.addEventListener("click", () => {
    pc.classList.toggle("collapsed");
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
  { target: ".brand",         labelKey: "tour.brand" },
  { target: "#btn-sitemap",   labelKey: "tour.sitemap" },
  { target: "#btn-gallery",   labelKey: "tour.gallery" },
  { target: "#open-modal",    labelKey: "tour.book" },
  { target: "#tb-ctrlgroup",  labelKey: "tour.ctrlgroup" },
  { target: "#ctrl-rotate",   labelKey: "tour.rotate" },
  { target: "#ctrl-zoom-in",  labelKey: "tour.zoomIn" },
  { target: "#ctrl-zoom-out", labelKey: "tour.zoomOut" },
  { target: "#ctrl-fullscreen", labelKey: "tour.fullscreen" },
  { target: "#ctrl-lang-wrap", labelKey: "tour.lang" },
  { target: "#help-btn",      labelKey: "tour.help" },
  { target: "#nav-panel",     labelKey: "tour.nav" },
  { target: "#np-search-wrap", labelKey: "tour.search" },
  { target: "#np-list",       labelKey: "tour.list" },
  { target: "#project-card",  labelKey: "tour.project" },
  { target: "#bb-chat-btn",   round: true,  labelKey: "tour.bot" },
  { target: "#ui-restore",    labelKey: "tour.restore" },
  { target: () => document.querySelector(".hotspot"), labelKey: "tour.hotspot" },
];

let tourIdx = -1;
let tourActive = false;
let tourItems = HELP_ITEMS;

function startTour(items = HELP_ITEMS, fromIndex = 0) {
  tourItems = items;
  tourIdx = fromIndex;
  tourActive = true;
  // Make sure UI is visible during tour
  document.getElementById("ui")?.classList.remove("hidden");
  // Make sure nav-panel is open
  document.getElementById("nav-panel")?.classList.remove("collapsed");
  document.body.classList.remove("nav-panel-collapsed");
  document.getElementById("tour-overlay").classList.add("open");
  showTourStep();
}

function endTour() {
  tourActive = false;
  tourIdx = -1;
  document.getElementById("tour-overlay")?.classList.remove("open");
}

function showTourStep() {
  if (!tourActive) return;
  if (tourIdx >= tourItems.length) { endTour(); return; }

  const item = tourItems[tourIdx];

  // Resolve target
  let target = null;
  if (typeof item.target === "function") target = item.target();
  else if (typeof item.target === "string") target = document.querySelector(item.target);

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

document.addEventListener("DOMContentLoaded", boot);
