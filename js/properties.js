/* ============================================================
   #5 / #8 / #9 / #10 — BẤT ĐỘNG SẢN
   - Modal danh sách BĐS + bộ lọc (ảnh 8)
   - Modal chi tiết BĐS (ảnh 9) với cột phải (ảnh 10)
   - Tab Tổng quan / Mặt bằng / Tiến độ / Chính sách / Tài liệu (#10)
   - Mặt bằng viewer (ảnh 11)
   Phụ thuộc: window.DATA, window.I18n (tuỳ chọn).
   ============================================================ */
(function initProperties() {
  "use strict";

  const tr = (s) => (window.I18n && typeof s === "string" ? window.I18n.tr(s) : s);
  const $ = (id) => document.getElementById(id);

  /* Trạng thái bộ lọc danh sách */
  const filter = {
    search: "",
    phanKhu: new Set(),
    type: new Set(),
    status: new Set(),
    priceMax: 0, // 0 = không giới hạn
  };

  function props() { return (window.DATA && window.DATA.properties) || []; }

  /* ── Số liệu cho schema lọc ── */
  function uniq(key, labelKey) {
    const seen = {};
    props().forEach((p) => {
      if (p[key]) seen[p[key]] = p[labelKey] || p[key];
    });
    return Object.keys(seen).map((id) => ({ id, label: seen[id] }));
  }
  function maxPrice() {
    return props().reduce((m, p) => Math.max(m, p.priceVal || 0), 0);
  }

  /* ============================================================
     DANH SÁCH BĐS (#8)
     ============================================================ */
  function openPropertiesModal() {
    renderFilterPanel();
    renderGrid();
    const bd = $("props-backdrop");
    if (bd) bd.classList.add("open");
  }
  function closePropertiesModal() {
    const bd = $("props-backdrop");
    if (bd) bd.classList.remove("open");
    closeFilterSheet();
  }
  window.openPropertiesModal = openPropertiesModal;

  /* ── Bộ lọc dạng bottom-sheet (mobile) ── */
  function openFilterSheet() {
    const f = $("props-filter"), b = $("props-filter-backdrop");
    if (f) f.classList.add("open");
    if (b) b.classList.add("open");
  }
  function closeFilterSheet() {
    const f = $("props-filter"), b = $("props-filter-backdrop");
    if (f) f.classList.remove("open");
    if (b) b.classList.remove("open");
  }

  function statusClass(s) {
    return s === "available" ? "ok" : s === "holding" ? "warn" : "sold";
  }

  function matchFilter(p) {
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const hay = ((p.code || "") + " " + (p.name || "")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    if (filter.phanKhu.size && !filter.phanKhu.has(p.phanKhu)) return false;
    if (filter.type.size && !filter.type.has(p.type)) return false;
    if (filter.status.size && !filter.status.has(p.status)) return false;
    if (filter.priceMax && (p.priceVal || 0) > filter.priceMax) return false;
    return true;
  }

  function renderGrid() {
    const grid = $("props-grid");
    const countEl = $("props-count");
    if (!grid) return;
    const list = props().filter(matchFilter);
    if (countEl) countEl.textContent = list.length + " sản phẩm";
    if (!list.length) {
      grid.innerHTML =
        '<div class="props-empty">Không có sản phẩm phù hợp bộ lọc.</div>';
      return;
    }
    grid.innerHTML = list
      .map((p) => {
        const img = (p.images && p.images[0]) || "";
        return (
          '<div class="prop-card" data-id="' + p.id + '">' +
          '<div class="prop-card-img">' +
          (img ? '<img src="' + img + '" alt="" loading="lazy"/>' : "") +
          '<span class="prop-badge prop-badge-' + statusClass(p.status) + '">' +
          tr(p.statusLabel || "") + "</span>" +
          "</div>" +
          '<div class="prop-card-body">' +
          '<div class="prop-card-code">' + (p.code || "") + "</div>" +
          '<div class="prop-card-name">' + tr(p.name || "") + "</div>" +
          '<div class="prop-card-price">' + formatPrice(p.price) + "</div>" +
          '<div class="prop-card-meta">' +
          metaChip("DT", p.area + " m²") +
          metaChip("PN", p.bedrooms) +
          metaChip("WC", p.bathrooms) +
          "</div>" +
          '<div class="prop-card-sub">' + tr(p.phanKhuLabel || "") + " · " +
          tr(p.typeLabel || "") + "</div>" +
          "</div></div>"
        );
      })
      .join("");
    grid.querySelectorAll(".prop-card").forEach((c) => {
      c.addEventListener("click", () => openPropertyDetail(c.dataset.id));
    });
  }
  function metaChip(k, v) {
    return '<span class="prop-meta-chip"><b>' + v + "</b> " + k + "</span>";
  }
  function formatPrice(p) {
    // p là chuỗi số "5.400.000.000" → "5,4 tỷ"
    if (!p) return "—";
    const num = parseInt(String(p).replace(/\D/g, ""), 10);
    if (!num) return p;
    const ty = num / 1e9;
    return (ty % 1 === 0 ? ty : ty.toFixed(1).replace(".", ",")) + " tỷ";
  }

  /* ── Panel bộ lọc (ảnh 8 — cột phải) ── */
  function renderFilterPanel() {
    const body = $("props-filter-body");
    if (!body) return;
    const pk = uniq("phanKhu", "phanKhuLabel");
    const ty = uniq("type", "typeLabel");
    const st = [
      { id: "available", label: "Đang mở bán" },
      { id: "holding", label: "Đang giữ chỗ" },
      { id: "sold", label: "Đã bán" },
    ];
    const mx = Math.ceil(maxPrice());
    body.innerHTML =
      filterGroup("Phân khu", "phanKhu", pk) +
      filterGroup("Loại hình", "type", ty) +
      filterGroup("Trạng thái", "status", st) +
      '<div class="pf-group">' +
      '<div class="pf-group-title">Mức giá tối đa</div>' +
      '<input type="range" id="pf-price" min="0" max="' + mx +
      '" step="1" value="' + (filter.priceMax || mx) + '" class="pf-range"/>' +
      '<div class="pf-price-label" id="pf-price-label">' +
      (filter.priceMax ? filter.priceMax + " tỷ" : "Không giới hạn") +
      "</div></div>";

    body.querySelectorAll("input[data-pf-group]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const g = cb.dataset.pfGroup;
        if (cb.checked) filter[g].add(cb.value);
        else filter[g].delete(cb.value);
        renderGrid();
      });
    });
    const range = $("pf-price");
    if (range) {
      range.addEventListener("input", () => {
        const v = parseInt(range.value, 10);
        filter.priceMax = v >= mx ? 0 : v;
        const lbl = $("pf-price-label");
        if (lbl) lbl.textContent = filter.priceMax ? filter.priceMax + " tỷ" : "Không giới hạn";
        renderGrid();
      });
    }
  }
  function filterGroup(title, key, opts) {
    const items = opts
      .map(
        (o) =>
          '<label class="pf-opt"><input type="checkbox" data-pf-group="' +
          key + '" value="' + o.id + '" ' +
          (filter[key].has(o.id) ? "checked" : "") +
          "/><span>" + tr(o.label) + "</span></label>"
      )
      .join("");
    return (
      '<div class="pf-group"><div class="pf-group-title">' + title +
      '</div><div class="pf-opts">' + items + "</div></div>"
    );
  }
  function resetFilter() {
    filter.search = "";
    filter.phanKhu.clear();
    filter.type.clear();
    filter.status.clear();
    filter.priceMax = 0;
    const si = $("props-search-input");
    if (si) si.value = "";
    renderFilterPanel();
    renderGrid();
  }

  /* ============================================================
     CHI TIẾT BĐS (#9 / #10)
     ============================================================ */
  let pdActiveId = null;

  function findProp(id) {
    return props().find((p) => p.id === id) || null;
  }

  function openPropertyDetail(id) {
    const p = findProp(id);
    if (!p) return;
    pdActiveId = id;
    const body = $("pd-body");
    if (body) body.innerHTML = buildDetailHTML(p);
    bindDetail(p);
    const bd = $("prop-detail-backdrop");
    if (bd) bd.classList.add("open");
  }
  function closePropertyDetail() {
    const bd = $("prop-detail-backdrop");
    if (bd) bd.classList.remove("open");
  }

  function buildDetailHTML(p) {
    const imgs = p.images || [];
    const thumbs = imgs
      .map(
        (src, i) =>
          '<button class="pd-thumb ' + (i === 0 ? "active" : "") +
          '" data-src="' + src + '"><img src="' + src + '" alt=""/></button>'
      )
      .join("");
    const highlights = (p.highlights || [])
      .map(
        (h) =>
          '<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5L20 7"/></svg>' +
          tr(h) + "</li>"
      )
      .join("");
    return (
      '<div class="pd-grid">' +
      /* ── Cột trái: gallery + thông tin + tab ── */
      '<div class="pd-left">' +
        '<div class="pd-head">' +
          '<div class="pd-code">' + (p.code || "") + "</div>" +
          '<span class="pd-status pd-status-' + statusClass(p.status) + '">' +
          tr(p.statusLabel || "") + "</span>" +
        "</div>" +
        '<h2 class="pd-name">' + tr(p.name || "") + "</h2>" +
        '<div class="pd-gallery">' +
          '<div class="pd-gallery-main"><img id="pd-main-img" src="' +
          (imgs[0] || "") + '" alt=""/></div>' +
          (imgs.length > 1 ? '<div class="pd-thumbs">' + thumbs + "</div>" : "") +
        "</div>" +
        '<div class="pd-quickfacts">' +
          quickFact(p.area + " m²", "Diện tích") +
          quickFact(p.bedrooms, "Phòng ngủ") +
          quickFact(p.bathrooms, "Phòng tắm") +
          quickFact(tr(p.direction || "—"), "Hướng") +
        "</div>" +
        (highlights ?
          '<div class="pd-highlights"><div class="pd-block-title">Điểm nổi bật</div>' +
          "<ul>" + highlights + "</ul></div>" : "") +
        /* Tabs (#10) */
        '<div class="pd-tabs" id="pd-tabs">' +
          '<button class="pd-tab active" data-tab="overview">Tổng quan</button>' +
          '<button class="pd-tab" data-tab="floorplan">Mặt bằng</button>' +
          '<button class="pd-tab" data-tab="progress">Tiến độ</button>' +
          '<button class="pd-tab" data-tab="policy">Chính sách</button>' +
          '<button class="pd-tab" data-tab="docs">Tài liệu</button>' +
        "</div>" +
        '<div class="pd-tab-body" id="pd-tab-body">' +
          tabContent(p, "overview") +
        "</div>" +
      "</div>" +
      /* ── Cột phải (ảnh 10) ── */
      buildSidebar(p) +
      "</div>"
    );
  }
  function quickFact(v, k) {
    return (
      '<div class="pd-qf"><div class="pd-qf-v">' + v +
      '</div><div class="pd-qf-k">' + k + "</div></div>"
    );
  }

  /* ── Cột phải chi tiết (ảnh 10) ── */
  function buildSidebar(p) {
    return (
      '<aside class="pd-side">' +
        '<div class="pd-side-card">' +
          '<div class="pd-side-label">Giá bán dự kiến</div>' +
          '<div class="pd-side-price">' + (p.price ? formatFullPrice(p.price) : "—") + "</div>" +
          (p.pricePerM2 ? '<div class="pd-side-ppm">~ ' + formatFullPrice(p.pricePerM2) + "/m²</div>" : "") +
          '<div class="pd-side-rows">' +
            sideRow("Tình trạng", tr(p.statusLabel || "")) +
            sideRow("Loại hình", tr(p.typeLabel || "")) +
            sideRow("Pháp lý", tr(p.legal || "—")) +
            sideRow("Dự kiến bàn giao", tr(p.handover || "—")) +
          "</div>" +
          '<button class="pd-side-cta" id="pd-quote">Nhận báo giá chi tiết</button>' +
        "</div>" +
        '<div class="pd-side-card">' +
          '<div class="pd-side-label">Liên hệ tư vấn</div>' +
          '<div class="pd-side-note">Để nhận thông tin chi tiết và tư vấn 1:1</div>' +
          (p.consultPhone ? '<a class="pd-contact pd-contact-phone" href="tel:' +
            String(p.consultPhone).replace(/\s/g, "") + '">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L7.1 9.9a16 16 0 006 6l1.5-1.5a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0122 16.9z"/></svg>' +
            p.consultPhone + "</a>" : "") +
          (p.consultEmail ? '<a class="pd-contact pd-contact-mail" href="mailto:' +
            p.consultEmail + '">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>' +
            p.consultEmail + "</a>" : "") +
          '<button class="pd-side-cta pd-side-cta-soft" id="pd-book">Đặt lịch tư vấn</button>' +
        "</div>" +
        '<div class="pd-side-card">' +
          '<div class="pd-side-label">Vị trí</div>' +
          '<div class="pd-side-loc">' + tr(p.phanKhuLabel || "") +
          (p.typeLabel ? " · " + tr(p.typeLabel) : "") + "</div>" +
          '<div class="pd-side-map"></div>' +
          '<button class="pd-side-cta pd-side-cta-soft" id="pd-masterplan">Xem vị trí trên Masterplan</button>' +
        "</div>" +
      "</aside>"
    );
  }
  function sideRow(k, v) {
    return (
      '<div class="pd-side-row"><span>' + k + "</span><b>" + v + "</b></div>"
    );
  }
  function formatFullPrice(p) {
    const num = parseInt(String(p).replace(/\D/g, ""), 10);
    if (!num) return p;
    return num.toLocaleString("vi-VN") + " VNĐ";
  }

  /* ── Nội dung tab (#10) ── */
  function tabContent(p, tab) {
    if (tab === "overview") {
      return '<p class="pd-desc">' + tr(p.desc || "") + "</p>";
    }
    if (tab === "floorplan") {
      const thumbs = (p.thumbsFloor || [])
        .map(
          (src, i) =>
            '<button class="pd-fp-thumb" data-fp-idx="' + i + '">' +
            '<img src="' + src + '" alt="Mặt bằng ' + (i + 1) + '"/>' +
            '<span>Mặt bằng ' + (i + 1) + "</span></button>"
        )
        .join("");
      return (
        '<div class="pd-fp-note">Chọn một bản vẽ để xem chi tiết.</div>' +
        '<div class="pd-fp-grid">' + (thumbs || '<div class="props-empty">Chưa có mặt bằng.</div>') + "</div>"
      );
    }
    if (tab === "progress") {
      const rows = (p.progress || [])
        .map(
          (t) =>
            '<div class="pd-prog-row ' + (t.done ? "done" : "") + '">' +
            '<span class="pd-prog-dot"></span>' +
            '<span class="pd-prog-phase">' + tr(t.phase) + "</span>" +
            '<span class="pd-prog-date">' + tr(t.date) + "</span></div>"
        )
        .join("");
      return '<div class="pd-prog">' + rows + "</div>";
    }
    if (tab === "policy") {
      const rows = (p.policies || [])
        .map(
          (c) =>
            '<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5L20 7"/></svg>' +
            tr(c) + "</li>"
        )
        .join("");
      return '<ul class="pd-policy">' + rows + "</ul>";
    }
    if (tab === "docs") {
      const rows = (p.docs || [])
        .map(
          (d) =>
            '<div class="pd-doc-row"><span class="pd-doc-ico">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>' +
            "</span>" +
            '<span class="pd-doc-name">' + tr(d.name) + "</span>" +
            '<span class="pd-doc-type">' + (d.type || "FILE") + "</span></div>"
        )
        .join("");
      return '<div class="pd-docs">' + rows + "</div>";
    }
    return "";
  }

  function bindDetail(p) {
    const body = $("pd-body");
    if (!body) return;
    /* Gallery thumbnails */
    body.querySelectorAll(".pd-thumb").forEach((t) => {
      t.addEventListener("click", () => {
        const img = $("pd-main-img");
        if (img) img.src = t.dataset.src;
        body.querySelectorAll(".pd-thumb").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
      });
    });
    /* Tabs */
    body.querySelectorAll(".pd-tab").forEach((t) => {
      t.addEventListener("click", () => {
        body.querySelectorAll(".pd-tab").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
        const tb = $("pd-tab-body");
        if (tb) tb.innerHTML = tabContent(p, t.dataset.tab);
        bindTabBody(p);
      });
    });
    bindTabBody(p);
    /* Sidebar actions */
    const quote = $("pd-quote"), book = $("pd-book"), mp = $("pd-masterplan");
    if (quote) quote.addEventListener("click", () => openBookingFor(p));
    if (book) book.addEventListener("click", () => openBookingFor(p));
    if (mp) mp.addEventListener("click", () => {
      closePropertyDetail();
      closePropertiesModal();
      if (typeof window.openMasterplan === "function") window.openMasterplan();
    });
  }

  /* Bind các phần tử trong tab body (mặt bằng → viewer) */
  function bindTabBody(p) {
    const tb = $("pd-tab-body");
    if (!tb) return;
    tb.querySelectorAll(".pd-fp-thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        openFloorplanViewer(p, parseInt(btn.dataset.fpIdx, 10));
      });
    });
  }

  /* Mở modal đặt lịch với BĐS đã chọn */
  function openBookingFor(p) {
    const bd = $("modal-backdrop");
    if (bd) bd.classList.add("open");
    const note = document.querySelector("#modal-backdrop textarea");
    if (note && p.code) {
      const tag = "Quan tâm sản phẩm: " + p.code + " — " + tr(p.name || "");
      if (note.value.indexOf(p.code) === -1) {
        note.value = (note.value ? note.value + "\n" : "") + tag;
      }
    }
  }

  /* ============================================================
     MẶT BẰNG VIEWER (#10 — ảnh 11)
     ============================================================ */
  let fpvProp = null;
  function openFloorplanViewer(p, idx) {
    fpvProp = p;
    const imgs = p.thumbsFloor || [];
    if (!imgs.length) return;
    const title = $("fpv-title");
    if (title) title.textContent = "Mặt bằng " + tr(p.name || "");
    const thumbs = $("fpv-thumbs");
    if (thumbs) {
      thumbs.innerHTML = imgs
        .map(
          (src, i) =>
            '<button class="fpv-thumb ' + (i === idx ? "active" : "") +
            '" data-idx="' + i + '"><img src="' + src + '" alt=""/>' +
            '<span>MB ' + (i + 1) + "</span></button>"
        )
        .join("");
      thumbs.querySelectorAll(".fpv-thumb").forEach((b) => {
        b.addEventListener("click", () => setFpvImage(parseInt(b.dataset.idx, 10)));
      });
    }
    setFpvImage(idx);
    const ov = $("fpv-overlay");
    if (ov) ov.classList.add("open");
  }
  function setFpvImage(idx) {
    if (!fpvProp) return;
    const imgs = fpvProp.thumbsFloor || [];
    const img = $("fpv-img");
    if (img && imgs[idx]) img.src = imgs[idx];
    const thumbs = $("fpv-thumbs");
    if (thumbs) {
      thumbs.querySelectorAll(".fpv-thumb").forEach((b) => {
        b.classList.toggle("active", parseInt(b.dataset.idx, 10) === idx);
      });
    }
    fpvResetZoom(); // ảnh mới → về fit khuôn
  }
  function closeFloorplanViewer() {
    const ov = $("fpv-overlay");
    if (ov) ov.classList.remove("open");
    fpvResetZoom();
  }

  /* ── Zoom / pan cho ảnh mặt bằng (#2) ── */
  const fpvZoom = { scale: 1, x: 0, y: 0, min: 1, max: 5 };
  function fpvApply() {
    const img = $("fpv-img");
    if (!img) return;
    img.style.transform =
      "translate(" + fpvZoom.x + "px," + fpvZoom.y + "px) scale(" + fpvZoom.scale + ")";
    const zoomed = fpvZoom.scale > 1.01;
    img.classList.toggle("zoomed", zoomed);
    const hint = $("fpv-hint");
    if (hint) hint.style.opacity = zoomed ? "0" : "";
  }
  function fpvResetZoom() {
    fpvZoom.scale = 1; fpvZoom.x = 0; fpvZoom.y = 0;
    fpvApply();
  }
  function fpvSetScale(next, originX, originY) {
    const img = $("fpv-img"), main = $("fpv-main");
    if (!img || !main) return;
    next = Math.max(fpvZoom.min, Math.min(fpvZoom.max, next));
    if (next === fpvZoom.scale) return;
    // Zoom quanh điểm con trỏ (nếu có)
    if (originX != null) {
      const r = main.getBoundingClientRect();
      const cx = originX - r.left - r.width / 2;
      const cy = originY - r.top - r.height / 2;
      const ratio = next / fpvZoom.scale;
      fpvZoom.x = cx - (cx - fpvZoom.x) * ratio;
      fpvZoom.y = cy - (cy - fpvZoom.y) * ratio;
    }
    fpvZoom.scale = next;
    if (next <= 1.01) { fpvZoom.x = 0; fpvZoom.y = 0; }
    fpvApply();
  }
  function bindFpvZoom() {
    const main = $("fpv-main"), img = $("fpv-img");
    if (!main || !img) return;

    // Cuộn chuột để zoom
    main.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      fpvSetScale(fpvZoom.scale * delta, e.clientX, e.clientY);
    }, { passive: false });

    // Nút +/− / reset
    $("fpv-zoom-in") && $("fpv-zoom-in").addEventListener("click", () => fpvSetScale(fpvZoom.scale * 1.4));
    $("fpv-zoom-out") && $("fpv-zoom-out").addEventListener("click", () => fpvSetScale(fpvZoom.scale / 1.4));
    $("fpv-zoom-reset") && $("fpv-zoom-reset").addEventListener("click", fpvResetZoom);

    // Double click — zoom in/out nhanh
    img.addEventListener("dblclick", (e) => {
      if (fpvZoom.scale > 1.01) fpvResetZoom();
      else fpvSetScale(2.5, e.clientX, e.clientY);
    });

    // Kéo ảnh khi đã zoom (chuột)
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    img.addEventListener("mousedown", (e) => {
      if (fpvZoom.scale <= 1.01) return;
      dragging = true; sx = e.clientX; sy = e.clientY;
      ox = fpvZoom.x; oy = fpvZoom.y;
      img.classList.add("dragging");
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      fpvZoom.x = ox + (e.clientX - sx);
      fpvZoom.y = oy + (e.clientY - sy);
      fpvApply();
    });
    window.addEventListener("mouseup", () => {
      dragging = false;
      img.classList.remove("dragging");
    });

    // Touch — pinch zoom + kéo 1 ngón
    let pinchDist = 0, pinchScale = 1, tDrag = false, tsx = 0, tsy = 0, tox = 0, toy = 0;
    const dist = (t) => Math.hypot(
      t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    main.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        pinchDist = dist(e.touches);
        pinchScale = fpvZoom.scale;
      } else if (e.touches.length === 1 && fpvZoom.scale > 1.01) {
        tDrag = true;
        tsx = e.touches[0].clientX; tsy = e.touches[0].clientY;
        tox = fpvZoom.x; toy = fpvZoom.y;
      }
    }, { passive: true });
    main.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && pinchDist) {
        e.preventDefault();
        const mid0 = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const mid1 = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        fpvSetScale(pinchScale * (dist(e.touches) / pinchDist), mid0, mid1);
      } else if (tDrag && e.touches.length === 1) {
        e.preventDefault();
        fpvZoom.x = tox + (e.touches[0].clientX - tsx);
        fpvZoom.y = toy + (e.touches[0].clientY - tsy);
        fpvApply();
      }
    }, { passive: false });
    main.addEventListener("touchend", (e) => {
      if (e.touches.length < 2) pinchDist = 0;
      if (e.touches.length === 0) tDrag = false;
    });
  }

  /* ============================================================
     BIND
     ============================================================ */
  function bind() {
    if ($("btn-properties")) $("btn-properties").addEventListener("click", openPropertiesModal);
    if ($("props-close")) $("props-close").addEventListener("click", closePropertiesModal);
    if ($("props-backdrop"))
      $("props-backdrop").addEventListener("click", (e) => {
        if (e.target.id === "props-backdrop") closePropertiesModal();
      });
    if ($("props-search-input"))
      $("props-search-input").addEventListener("input", (e) => {
        filter.search = e.target.value.trim();
        renderGrid();
      });
    if ($("props-filter-reset"))
      $("props-filter-reset").addEventListener("click", resetFilter);
    // Bộ lọc bottom-sheet (mobile)
    if ($("props-filter-toggle"))
      $("props-filter-toggle").addEventListener("click", openFilterSheet);
    if ($("props-filter-close"))
      $("props-filter-close").addEventListener("click", closeFilterSheet);
    if ($("props-filter-backdrop"))
      $("props-filter-backdrop").addEventListener("click", closeFilterSheet);

    if ($("pd-close")) $("pd-close").addEventListener("click", closePropertyDetail);
    if ($("pd-back")) $("pd-back").addEventListener("click", closePropertyDetail);
    if ($("prop-detail-backdrop"))
      $("prop-detail-backdrop").addEventListener("click", (e) => {
        if (e.target.id === "prop-detail-backdrop") closePropertyDetail();
      });

    if ($("fpv-close")) $("fpv-close").addEventListener("click", closeFloorplanViewer);
    if ($("fpv-overlay"))
      $("fpv-overlay").addEventListener("click", (e) => {
        if (e.target.id === "fpv-overlay") closeFloorplanViewer();
      });
    bindFpvZoom();

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if ($("fpv-overlay") && $("fpv-overlay").classList.contains("open")) closeFloorplanViewer();
      else if ($("prop-detail-backdrop") && $("prop-detail-backdrop").classList.contains("open")) closePropertyDetail();
      else if ($("props-backdrop") && $("props-backdrop").classList.contains("open")) closePropertiesModal();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
