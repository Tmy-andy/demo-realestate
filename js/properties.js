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
  const t  = (k, fb) => (window.I18n ? window.I18n.t(k) : (fb || k));
  // Lấy bản dịch cho 1 field của property theo lang hiện tại; fallback bản gốc.
  const tField = (p, field) => {
    const lang = window.I18n ? window.I18n.get() : 'vi';
    const orig = p && p[field];
    if (lang === 'vi') return orig;
    const v = p && p.translations && p.translations[field] && p.translations[field][lang];
    return (v != null && v !== '') ? v : orig;
  };
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

  /* Đồng bộ bộ lọc BĐS theo phân khu đang active (yêu cầu #2).
     Tự động bật lọc khi có phân khu active; người dùng vẫn có thể
     bỏ tick trong bộ lọc để xem tổng quan. */
  function syncPropertiesSubdivision() {
    const sub = typeof window.getActiveSubdivision === "function"
      ? window.getActiveSubdivision() : null;
    filter.phanKhu.clear();
    if (sub) filter.phanKhu.add(sub);
    // Nếu modal đang mở → re-render ngay
    const bd = $("props-backdrop");
    if (bd && bd.classList.contains("open")) {
      renderFilterPanel();
      renderGrid();
    }
  }
  window.syncPropertiesSubdivision = syncPropertiesSubdivision;

  /* ============================================================
     DANH SÁCH BĐS (#8)
     ============================================================ */
  function openPropertiesModal() {
    // Mỗi lần mở: tự lọc theo phân khu active (nếu có)
    syncPropertiesSubdivision();
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
        '<div class="props-empty">' + t('ui.props.empty') + '</div>';
      return;
    }
    grid.innerHTML = list
      .map((p) => {
        const img = (p.images && p.images[0]) || "";
        return (
          '<div class="prop-card" data-id="' + p.id + '">' +
          '<div class="prop-card-img">' +
          (img ? '<img src="' + img + '" alt="" loading="lazy" decoding="async" style="background:#1e293b"/>' : "") +
          '<span class="prop-badge prop-badge-' + statusClass(p.status) + '">' +
          tr(p.statusLabel || "") + "</span>" +
          "</div>" +
          '<div class="prop-card-body">' +
          '<div class="prop-card-code">' + (p.code || "") + "</div>" +
          '<div class="prop-card-name">' + (tField(p,'name') || "") + "</div>" +
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
    if (typeof window.lazyLoadImages === 'function') {
      window.lazyLoadImages(grid.querySelectorAll('img[data-lazy]'), 'data-lazy');
    }
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
      filterGroup(t('ui.props.filter.type'), "type", ty) +
      filterGroup("Trạng thái", "status", st) +
      '<div class="pf-group">' +
      '<div class="pf-group-title">' + t('ui.props.filter.maxPrice') + '</div>' +
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
          '" data-src="' + src + '"><img src="' + src +
          '" alt="" loading="lazy" decoding="async"/></button>'
      )
      .join("");
    const lang = window.I18n ? window.I18n.get() : 'vi';
    const hlSrc = (p.translations && p.translations.highlights && p.translations.highlights[lang])
      ? String(p.translations.highlights[lang]).split('\n').filter(Boolean)
      : (p.highlights || []);
    const highlights = hlSrc
      .map(
        (h) =>
          '<li><i data-lucide="check" width="14" height="14"></i>' +
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
        '<h2 class="pd-name">' + (tField(p,'name') || "") + "</h2>" +
        '<div class="pd-gallery">' +
          '<div class="pd-gallery-main"><img id="pd-main-img" src="' +
          (imgs[0] || "") + '" alt="" decoding="async"/></div>' +
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
        /* Tabs (#10) — tab Tiến độ chỉ hiện khi BDS có mốc tiến độ */
        '<div class="pd-tabs" id="pd-tabs">' +
          '<button class="pd-tab active" data-tab="overview">Tổng quan</button>' +
          '<button class="pd-tab" data-tab="floorplan">Mặt bằng</button>' +
          ((p.progress && p.progress.length) ? '<button class="pd-tab" data-tab="progress">Tiến độ</button>' : '') +
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
  /* Card liên hệ tư vấn — dùng thông tin nhân viên Sales.
     Ưu tiên: sale gán cho sản phẩm (saleUsername) → sale theo ?s= URL
     → sale đầu tiên trong danh sách. */
  function resolveSale(p) {
    const sales = (window.DATA && window.DATA.sales) || [];
    if (!sales.length) return null;
    if (p && p.saleUsername) {
      const s = sales.find(x => x.username === p.saleUsername);
      if (s) return s;
    }
    if (window.__activeSale) return window.__activeSale;
    return sales[0];
  }
  function buildContactCard(p) {
    const s = resolveSale(p);
    if (!s) return "";
    const phoneSvg = '<i data-lucide="phone" width="14" height="14"></i>';
    const mailSvg = '<i data-lucide="mail" width="14" height="14"></i>';
    const zaloSvg = '<i data-lucide="message-circle" width="14" height="14"></i>';
    return (
      '<div class="pd-side-card">' +
        '<div class="pd-side-label">' + t('ui.props.detail.consultant') + '</div>' +
        '<div class="pd-sale-name">' + (s.name || "") + "</div>" +
        (s.title ? '<div class="pd-sale-title">' + s.title + "</div>" : "") +
        (s.phone ? '<a class="pd-contact pd-contact-phone" href="tel:' +
          String(s.phone).replace(/\s/g, "") + '">' + phoneSvg + s.phone + "</a>" : "") +
        (s.zalo ? '<a class="pd-contact" href="https://zalo.me/' +
          String(s.zalo).replace(/\s/g, "") + '" target="_blank" rel="noopener">' + zaloSvg + "Zalo: " + s.zalo + "</a>" : "") +
        (s.email ? '<a class="pd-contact pd-contact-mail" href="mailto:' +
          s.email + '">' + mailSvg + s.email + "</a>" : "") +
        (s.facebook ? '<a class="pd-contact" href="' + s.facebook +
          '" target="_blank" rel="noopener">' + mailSvg + "Facebook" + "</a>" : "") +
        '<button class="pd-side-cta pd-side-cta-soft" id="pd-book">Đặt lịch tư vấn</button>' +
      "</div>"
    );
  }

  function buildSidebar(p) {
    return (
      '<aside class="pd-side">' +
        '<div class="pd-side-card">' +
          '<div class="pd-side-label">' + t('ui.props.detail.price') + '</div>' +
          '<div class="pd-side-price">' + (p.price ? formatFullPrice(p.price) : "—") + "</div>" +
          (p.pricePerM2 ? '<div class="pd-side-ppm">~ ' + formatFullPrice(p.pricePerM2) + "/m²</div>" : "") +
          '<div class="pd-side-rows">' +
            sideRow(t('ui.props.detail.status'),   tr(p.statusLabel || "")) +
            sideRow(t('ui.props.detail.type'),     tr(p.typeLabel || "")) +
            sideRow(t('ui.props.detail.legal'),    (tField(p,'legal')    || "—")) +
            sideRow(t('ui.props.detail.handover'), (tField(p,'handover') || "—")) +
          "</div>" +
          '<button class="pd-side-cta" id="pd-quote">Nhận báo giá chi tiết</button>' +
        "</div>" +
        buildContactCard(p) +
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
      return '<p class="pd-desc">' + (tField(p,'desc') || "") + "</p>";
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
        '<div class="pd-fp-grid">' + (thumbs || '<div class="props-empty">' + t('ui.props.emptyFloorplan') + '</div>') + "</div>"
      );
    }
    if (tab === "progress") {
      // Bản dịch progress lưu dạng text: mỗi dòng "phase | date | done".
      // Khớp số dòng với p.progress để giữ trạng thái done từ bản gốc.
      const lang = window.I18n ? window.I18n.get() : 'vi';
      const transText = p.translations && p.translations.progress && p.translations.progress[lang];
      let items = p.progress || [];
      if (lang !== 'vi' && transText) {
        const lines = String(transText).split('\n').map(s => s.trim()).filter(Boolean);
        items = lines.map((ln, i) => {
          const parts = ln.split('|').map(s => s.trim());
          const fb = items[i] || {};
          return {
            phase: parts[0] || fb.phase || '',
            date:  parts[1] || fb.date  || '',
            done:  parts[2] != null ? (parts[2] === '1' || /^true$/i.test(parts[2])) : !!fb.done,
          };
        });
      }
      const rows = items
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
            '<li><i data-lucide="check" width="14" height="14"></i>' +
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
            '<i data-lucide="file-text" width="16" height="16"></i>' +
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
    /* Lazy load thumbnails — chỉ tải khi vào viewport */
    if (typeof window.lazyLoadImages === 'function') {
      window.lazyLoadImages(body.querySelectorAll('img[data-lazy]'), 'data-lazy');
    }
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
    // Dùng tag chính thức để payload submit có trường "Căn quan tâm".
    if (p && p.code && typeof window.addUnitCodeTag === "function") {
      window.addUnitCodeTag(p.code);
    }
    // Ghi tên sản phẩm vào note để sale có thêm ngữ cảnh (không trùng mã).
    const note = document.querySelector("#modal-backdrop textarea");
    if (note && p && p.name) {
      const ctx = "Sản phẩm: " + tr(p.name);
      if (note.value.indexOf(ctx) === -1) {
        note.value = (note.value ? note.value + "\n" : "") + ctx;
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
