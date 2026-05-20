/* ============================================================
   #4 / #6 — MASTERPLAN
   Overlay quy hoạch tổng thể: bản đồ + marker + thanh danh mục,
   kèm bộ lọc cấu hình theo DATA.masterplan.filterSchema.
   Phụ thuộc: window.DATA, window.pcIcon, window._tr, goToMenuItem.
   ============================================================ */
(function initMasterplan() {
  "use strict";

  let mpCat = "all";   // danh mục đang chọn ở thanh trên
  let mpFilter = null; // trạng thái bộ lọc (Set theo nhóm)

  const tr = (s) => (window.I18n ? window.I18n.tr(s) : s);
  function icon(name, size) {
    return typeof window.pcIcon === "function"
      ? window.pcIcon(name, size || 16)
      : "";
  }
  function mp() { return (window.DATA && window.DATA.masterplan) || null; }

  function defaultFilter() {
    const m = mp();
    if (!m || !m.filterSchema) return {};
    const f = {};
    for (const key of Object.keys(m.filterSchema)) {
      f[key] = new Set(m.filterSchema[key].map((o) => o.id)); // mặc định chọn tất cả
    }
    return f;
  }

  /* ── Mở / đóng overlay ── */
  function openMasterplan() {
    const m = mp();
    if (!m) return;
    if (!mpFilter) mpFilter = defaultFilter();
    const ov = document.getElementById("masterplan-overlay");
    const img = document.getElementById("mp-image");
    if (img && m.image) img.src = m.image;
    renderMpCats();
    renderMpIntro();
    renderMpMarkers();
    if (ov) ov.classList.add("open");
  }
  function closeMasterplan() {
    const ov = document.getElementById("masterplan-overlay");
    if (ov) ov.classList.remove("open");
    const tip = document.getElementById("mp-tooltip");
    if (tip) tip.classList.remove("visible");
  }
  window.openMasterplan = openMasterplan;

  /* ── Thanh danh mục ── */
  function renderMpCats() {
    const wrap = document.getElementById("mp-cats");
    const m = mp();
    if (!wrap || !m) return;
    wrap.innerHTML = (m.categories || [])
      .map(
        (c) =>
          '<button class="mp-cat ' +
          (c.id === mpCat ? "active" : "") +
          '" data-cat="' +
          c.id +
          '">' +
          icon(c.icon, 15) +
          "<span>" +
          tr(c.label) +
          "</span></button>"
      )
      .join("");
    wrap.querySelectorAll(".mp-cat").forEach((btn) => {
      btn.addEventListener("click", () => {
        mpCat = btn.dataset.cat;
        renderMpCats();
        renderMpMarkers();
      });
    });
  }

  /* ── Intro panel ── */
  function renderMpIntro() {
    const el = document.getElementById("mp-intro");
    const m = mp();
    if (!el || !m) return;
    const stats = ((window.DATA.project.stats || []).slice(0, 3))
      .map(
        (s) =>
          '<div class="mp-intro-stat"><div class="mp-intro-val">' +
          s.value +
          "<small>" +
          tr(s.unit) +
          '</small></div><div class="mp-intro-key">' +
          tr(s.label) +
          "</div></div>"
      )
      .join("");
    el.innerHTML =
      '<div class="mp-intro-eyebrow">Tổng quan dự án</div>' +
      '<p class="mp-intro-desc">' +
      tr(m.intro || "") +
      "</p>" +
      '<div class="mp-intro-stats">' +
      stats +
      "</div>" +
      '<button class="mp-filter-btn" id="mp-filter-btn">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h18M6 12h12M10 19h4"/></svg>' +
      "<span>Lọc</span></button>";
    // Bind lại nút Lọc (được render mỗi lần mở overlay)
    const fb = document.getElementById("mp-filter-btn");
    if (fb) fb.addEventListener("click", openFilterPanel);
  }

  /* ── Marker hiển thị theo bộ lọc ── */
  function markerVisible(mk) {
    if (mpCat !== "all" && mk.cat !== mpCat) return false;
    if (mpFilter) {
      if (mk.cat === "phankhu" && mpFilter.phanKhu && mk.menuItemId) {
        if (!mpFilter.phanKhu.has(mk.menuItemId)) return false;
      }
      if (mpFilter.loaiHienThi && mk.cat !== "phankhu") {
        const mapCat = { tienich: "tienich", phuchop: "phuchop", hatang: "hatang" };
        const lh = mapCat[mk.cat];
        if (lh) {
          const ids = (mp().filterSchema.loaiHienThi || []).map((o) => o.id);
          if (ids.indexOf(lh) !== -1 && !mpFilter.loaiHienThi.has(lh)) return false;
        }
      }
    }
    return true;
  }
  function renderMpMarkers() {
    const wrap = document.getElementById("mp-markers");
    const m = mp();
    if (!wrap || !m) return;
    wrap.innerHTML = (m.markers || [])
      .filter(markerVisible)
      .map(
        (mk) =>
          '<button class="mp-marker mp-marker-' +
          mk.cat +
          '" data-id="' +
          mk.id +
          '" style="left:' +
          mk.x +
          "%;top:" +
          mk.y +
          '%"><span class="mp-marker-dot"></span>' +
          '<span class="mp-marker-label">' +
          tr(mk.label) +
          "</span></button>"
      )
      .join("");
    wrap.querySelectorAll(".mp-marker").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const mk = (m.markers || []).find((x) => x.id === btn.dataset.id);
        if (mk) showMpTooltip(mk, btn);
      });
    });
  }

  /* ── Tooltip marker ── */
  function showMpTooltip(mk, anchorEl) {
    const tip = document.getElementById("mp-tooltip");
    if (!tip) return;
    const hasItem = !!mk.menuItemId;
    tip.innerHTML =
      '<div class="mp-tip-label">' +
      tr(mk.label) +
      "</div>" +
      (mk.desc ? '<div class="mp-tip-desc">' + tr(mk.desc) + "</div>" : "") +
      (hasItem
        ? '<button class="mp-tip-go" data-go="' +
          mk.menuItemId +
          '">Khám phá VR Tour →</button>'
        : "");
    tip.style.left = anchorEl.style.left;
    tip.style.top = anchorEl.style.top;
    tip.classList.add("visible");
    const goBtn = tip.querySelector("[data-go]");
    if (goBtn) {
      goBtn.addEventListener("click", () => {
        closeMasterplan();
        if (typeof window.goToMenuItem === "function") {
          window.goToMenuItem(goBtn.dataset.go);
        }
      });
    }
  }

  /* ── Bộ lọc (ảnh 4) ── */
  const GROUP_TITLES = {
    phanKhu: "Phân khu",
    loaiHienThi: "Loại hiển thị",
    batDongSan: "Bất động sản",
    trangThai: "Trạng thái",
  };
  function renderFilterPanel() {
    const body = document.getElementById("mpf-body");
    const m = mp();
    if (!body || !m || !m.filterSchema) return;
    const schema = m.filterSchema;
    body.innerHTML = Object.keys(schema)
      .map((key) => {
        const opts = schema[key];
        const sel = mpFilter[key] || new Set();
        const allOn = opts.every((o) => sel.has(o.id));
        const items = opts
          .map(
            (o) =>
              '<label class="mpf-opt"><input type="checkbox" data-group="' +
              key +
              '" value="' +
              o.id +
              '" ' +
              (sel.has(o.id) ? "checked" : "") +
              "/>" +
              (o.color
                ? '<span class="mpf-dot" style="background:' + o.color + '"></span>'
                : "") +
              "<span>" +
              tr(o.label) +
              "</span></label>"
          )
          .join("");
        return (
          '<div class="mpf-group"><div class="mpf-group-head">' +
          '<span class="mpf-group-title">' +
          (GROUP_TITLES[key] || key) +
          "</span>" +
          '<label class="mpf-all"><input type="checkbox" data-all="' +
          key +
          '" ' +
          (allOn ? "checked" : "") +
          "/> Chọn tất cả</label></div>" +
          '<div class="mpf-opts">' +
          items +
          "</div></div>"
        );
      })
      .join("");

    body.querySelectorAll("input[data-group]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const g = cb.dataset.group;
        if (!mpFilter[g]) mpFilter[g] = new Set();
        if (cb.checked) mpFilter[g].add(cb.value);
        else mpFilter[g].delete(cb.value);
        const allCb = body.querySelector('input[data-all="' + g + '"]');
        if (allCb) allCb.checked = schema[g].every((o) => mpFilter[g].has(o.id));
      });
    });
    body.querySelectorAll("input[data-all]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const g = cb.dataset.all;
        const opts = schema[g];
        mpFilter[g] = new Set(cb.checked ? opts.map((o) => o.id) : []);
        body
          .querySelectorAll('input[data-group="' + g + '"]')
          .forEach((x) => {
            x.checked = cb.checked;
          });
      });
    });
  }
  function openFilterPanel() {
    if (!mpFilter) mpFilter = defaultFilter();
    renderFilterPanel();
    const bd = document.getElementById("mpf-backdrop");
    if (bd) bd.classList.add("open");
  }
  function closeFilterPanel() {
    const bd = document.getElementById("mpf-backdrop");
    if (bd) bd.classList.remove("open");
  }

  /* ── Bind controls ── */
  function bind() {
    const $ = (id) => document.getElementById(id);
    if ($("btn-masterplan")) $("btn-masterplan").addEventListener("click", openMasterplan);
    if ($("mp-close")) $("mp-close").addEventListener("click", closeMasterplan);
    if ($("mp-stage"))
      $("mp-stage").addEventListener("click", (e) => {
        if (e.target.id === "mp-stage" || e.target.id === "mp-image") {
          const tip = $("mp-tooltip");
          if (tip) tip.classList.remove("visible");
        }
      });
    /* mp-filter-btn được bind trong renderMpIntro() vì render động */
    if ($("mpf-close")) $("mpf-close").addEventListener("click", closeFilterPanel);
    if ($("mpf-backdrop"))
      $("mpf-backdrop").addEventListener("click", (e) => {
        if (e.target.id === "mpf-backdrop") closeFilterPanel();
      });
    if ($("mpf-apply"))
      $("mpf-apply").addEventListener("click", () => {
        renderMpMarkers();
        closeFilterPanel();
      });
    if ($("mpf-reset"))
      $("mpf-reset").addEventListener("click", () => {
        mpFilter = defaultFilter();
        renderFilterPanel();
        renderMpMarkers();
      });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if ($("mpf-backdrop") && $("mpf-backdrop").classList.contains("open")) {
        closeFilterPanel();
      } else if (
        $("masterplan-overlay") &&
        $("masterplan-overlay").classList.contains("open")
      ) {
        closeMasterplan();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
