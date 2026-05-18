/* ============================================
   AURORA HEIGHTS — Notification Dropdown + Center
   ============================================ */
(function () {
  const SAMPLE = [
    { id: 1,  cat: 'deal',     type: 'ok',     text: '<strong>Nguyễn An</strong> vừa đặt cọc căn <strong>A-1205</strong>', ts: Date.now() - 2*60*1000, unread: true },
    { id: 2,  cat: 'deal',     type: 'info',   text: '<strong>Trần Bình</strong> đã ký hợp đồng căn <strong>B-0808</strong>', ts: Date.now() - 60*60*1000, unread: true },
    { id: 3,  cat: 'appt',     type: 'warn',   text: 'Lịch hẹn xem nhà với <strong>Lê Cường</strong> lúc 14:00 hôm nay', ts: Date.now() - 3*60*60*1000, unread: true },
    { id: 4,  cat: 'system',   type: 'info',   text: 'Báo cáo doanh số tuần mới đã sẵn sàng để xem', ts: Date.now() - 26*60*60*1000, unread: false },
    { id: 5,  cat: 'appt',     type: 'danger', text: 'Khách hàng <strong>Phạm Dũng</strong> đã huỷ lịch hẹn', ts: Date.now() - 50*60*60*1000, unread: false },
    { id: 6,  cat: 'lead',     type: 'info',   text: 'Lead mới: <strong>Hoàng Mai</strong> quan tâm căn 2PN view sông', ts: Date.now() - 4*60*60*1000, unread: true },
    { id: 7,  cat: 'lead',     type: 'info',   text: 'Lead mới: <strong>Vũ Hà</strong> từ chiến dịch Facebook tháng 5', ts: Date.now() - 28*60*60*1000, unread: false },
    { id: 8,  cat: 'deal',     type: 'ok',     text: '<strong>Đỗ Quân</strong> đã thanh toán đợt 2 căn C-1502', ts: Date.now() - 3*24*60*60*1000, unread: false },
    { id: 9,  cat: 'system',   type: 'warn',   text: 'Sao lưu dữ liệu hàng tuần đã hoàn tất lúc 03:00', ts: Date.now() - 4*24*60*60*1000, unread: false },
    { id: 10, cat: 'appt',     type: 'info',   text: 'Nhắc: Lịch hẹn với <strong>Bùi Lan</strong> ngày mai 10:00', ts: Date.now() - 5*24*60*60*1000, unread: false },
    { id: 11, cat: 'lead',     type: 'info',   text: 'Lead mới: <strong>Ngô Tuấn</strong> qua website (referral)', ts: Date.now() - 6*24*60*60*1000, unread: false },
    { id: 12, cat: 'system',   type: 'danger', text: 'Phát hiện đăng nhập từ thiết bị mới — vui lòng xác minh', ts: Date.now() - 8*24*60*60*1000, unread: false },
  ];

  const ICONS = {
    ok:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    info:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warn:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    danger: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  };

  const CATS = [
    { id: 'all',    label: 'Tất cả',     ico: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' },
    { id: 'unread', label: 'Chưa đọc',   ico: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>' },
    { id: 'lead',   label: 'Lead mới',   ico: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>' },
    { id: 'appt',   label: 'Lịch hẹn',   ico: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>' },
    { id: 'deal',   label: 'Hợp đồng',   ico: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>' },
    { id: 'system', label: 'Hệ thống',   ico: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m17.36-7.36-4.24 4.24M9.88 14.12l-4.24 4.24m12.72 0-4.24-4.24M9.88 9.88 5.64 5.64"/></svg>' },
  ];

  const CAT_LABELS = { lead: 'Lead', appt: 'Lịch hẹn', deal: 'Hợp đồng', system: 'Hệ thống' };

  const TAG_LABELS = { ok: 'Thành công', info: 'Thông tin', warn: 'Cảnh báo', danger: 'Quan trọng' };

  let items = SAMPLE.slice();
  let activeFilter = 'all';
  let searchQ = '';

  function unreadCount() { return items.filter(x => x.unread).length; }

  function relTime(ts) {
    const d = Math.floor((Date.now() - ts) / 1000);
    if (d < 60) return 'Vừa xong';
    if (d < 3600) return Math.floor(d/60) + ' phút trước';
    if (d < 86400) return Math.floor(d/3600) + ' giờ trước';
    if (d < 7*86400) return Math.floor(d/86400) + ' ngày trước';
    return new Date(ts).toLocaleDateString('vi-VN');
  }

  function dayLabel(ts) {
    const now = new Date(); now.setHours(0,0,0,0);
    const t = new Date(ts); t.setHours(0,0,0,0);
    const diff = Math.round((now - t) / 86400000);
    if (diff === 0) return 'Hôm nay';
    if (diff === 1) return 'Hôm qua';
    if (diff < 7) return diff + ' ngày trước';
    return new Date(ts).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function dayKey(ts) {
    const d = new Date(ts); d.setHours(0,0,0,0);
    return d.getTime();
  }

  /* ===== DROPDOWN ===== */
  function renderDD() {
    const dd = document.getElementById('notif-dd');
    const dot = document.getElementById('notif-dot');
    if (!dd) return;
    const n = unreadCount();
    if (dot) dot.style.display = n > 0 ? '' : 'none';
    const recent = items.slice(0, 5);

    const listHtml = recent.length === 0
      ? '<div class="tb-dd-empty">Chưa có thông báo nào</div>'
      : `<div class="tb-dd-list">${recent.map(it => `
          <div class="tb-dd-item ${it.unread ? 'unread' : ''}" data-id="${it.id}">
            <div class="tb-dd-ico ${it.type}">${ICONS[it.type] || ''}</div>
            <div class="tb-dd-body">
              <div class="tb-dd-text">${it.text}</div>
              <div class="tb-dd-time">${relTime(it.ts)}</div>
            </div>
          </div>`).join('')}</div>`;

    dd.innerHTML = `
      <div class="tb-dd-head">
        <div class="tb-dd-title">Thông báo ${n > 0 ? `<span class="tb-dd-count">${n}</span>` : ''}</div>
        ${n > 0 ? '<button class="tb-dd-action" data-act="read-all">Đánh dấu đã đọc</button>' : ''}
      </div>
      ${listHtml}
      <div class="tb-dd-foot"><a href="#" data-act="view-all">Xem tất cả thông báo →</a></div>`;
  }

  function closeDD() {
    document.getElementById('notif-btn')?.classList.remove('is-open');
    document.getElementById('notif-dd')?.classList.remove('is-open');
  }
  function openDD() {
    document.getElementById('notif-btn')?.classList.add('is-open');
    document.getElementById('notif-dd')?.classList.add('is-open');
  }

  /* ===== NOTIFICATION CENTER ===== */
  function ensureCenter() {
    if (document.getElementById('nc-backdrop')) return;
    const back = document.createElement('div');
    back.id = 'nc-backdrop';
    back.className = 'nc-backdrop';
    const modal = document.createElement('div');
    modal.id = 'nc-modal';
    modal.className = 'nc-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    document.body.appendChild(back);
    document.body.appendChild(modal);

    back.addEventListener('click', closeCenter);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeCenter();
    });
  }

  function filteredItems() {
    let arr = items.slice();
    if (activeFilter === 'unread') arr = arr.filter(x => x.unread);
    else if (activeFilter !== 'all') arr = arr.filter(x => x.cat === activeFilter);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      arr = arr.filter(x => x.text.toLowerCase().includes(q));
    }
    return arr.sort((a, b) => b.ts - a.ts);
  }

  function renderCenter() {
    const modal = document.getElementById('nc-modal');
    if (!modal) return;

    const counts = {
      all: items.length,
      unread: items.filter(x => x.unread).length,
      lead: items.filter(x => x.cat === 'lead').length,
      appt: items.filter(x => x.cat === 'appt').length,
      deal: items.filter(x => x.cat === 'deal').length,
      system: items.filter(x => x.cat === 'system').length,
    };

    const list = filteredItems();
    const groups = new Map();
    list.forEach(it => {
      const k = dayKey(it.ts);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(it);
    });

    let listHtml = '';
    if (list.length === 0) {
      listHtml = `
        <div class="nc-empty">
          <div class="nc-empty-ico"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg></div>
          <div>${searchQ ? 'Không tìm thấy thông báo phù hợp' : 'Chưa có thông báo nào'}</div>
        </div>`;
    } else {
      for (const [k, arr] of groups) {
        listHtml += `<div class="nc-day">${dayLabel(k)}</div>`;
        arr.forEach(it => {
          listHtml += `
            <div class="nc-item ${it.unread ? 'unread' : ''}" data-id="${it.id}">
              <div class="tb-dd-ico ${it.type}">${ICONS[it.type] || ''}</div>
              <div class="nc-item-body">
                <div class="nc-item-text">${it.text}</div>
                <div class="nc-item-meta">
                  <span class="nc-item-tag ${it.type}">${TAG_LABELS[it.type]}</span>
                  <span>${CAT_LABELS[it.cat] || ''}</span>
                  <span>•</span>
                  <span>${relTime(it.ts)}</span>
                </div>
              </div>
              <button class="nc-item-del" data-act="del" data-id="${it.id}" title="Xoá">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
              </button>
            </div>`;
        });
      }
    }

    modal.innerHTML = `
      <div class="nc-head">
        <div class="nc-head-title">
          <h2>Trung tâm thông báo</h2>
          ${counts.unread > 0 ? `<span class="tb-dd-count">${counts.unread} mới</span>` : ''}
        </div>
        <div class="nc-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="nc-search-input" placeholder="Tìm thông báo..." value="${searchQ.replace(/"/g,'&quot;')}"/>
        </div>
        <button class="nc-close" data-act="close" title="Đóng (Esc)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="nc-body">
        <div class="nc-side">
          <div class="nc-side-label">Bộ lọc</div>
          ${CATS.map(c => `
            <div class="nc-filter ${activeFilter === c.id ? 'active' : ''}" data-filter="${c.id}">
              <div class="nc-filter-ico">${c.ico}</div>
              <div class="nc-filter-label">${c.label}</div>
              <div class="nc-filter-num">${counts[c.id] || 0}</div>
            </div>`).join('')}
        </div>
        <div class="nc-main">
          <div class="nc-toolbar">
            <div class="nc-toolbar-info">Hiển thị <strong>${list.length}</strong> thông báo</div>
            <div class="nc-toolbar-actions">
              ${counts.unread > 0 ? `<button class="nc-btn" data-act="read-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Đánh dấu đã đọc tất cả
              </button>` : ''}
              ${items.length > 0 ? `<button class="nc-btn danger" data-act="clear-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                Xoá tất cả
              </button>` : ''}
            </div>
          </div>
          <div class="nc-list">${listHtml}</div>
        </div>
      </div>`;

    const input = document.getElementById('nc-search-input');
    if (input) {
      input.addEventListener('input', (e) => { searchQ = e.target.value; renderCenter(); restoreFocus(); });
    }
  }

  let focusEnd = false;
  function restoreFocus() {
    const input = document.getElementById('nc-search-input');
    if (input && searchQ) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }

  function openCenter() {
    ensureCenter();
    closeDD();
    renderCenter();
    requestAnimationFrame(() => {
      document.getElementById('nc-backdrop')?.classList.add('is-open');
      document.getElementById('nc-modal')?.classList.add('is-open');
    });
  }
  function closeCenter() {
    document.getElementById('nc-backdrop')?.classList.remove('is-open');
    document.getElementById('nc-modal')?.classList.remove('is-open');
    searchQ = '';
    activeFilter = 'all';
  }

  /* ===== EVENT WIRING ===== */
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('notif-btn');
    const dd = document.getElementById('notif-dd');
    if (!btn || !dd) return;

    renderDD();

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      // On mobile, open the full-screen notification center directly
      if (window.matchMedia('(max-width: 768px)').matches) {
        closeDD();
        openCenter();
        return;
      }
      dd.classList.contains('is-open') ? closeDD() : openDD();
    });

    dd.addEventListener('click', (e) => {
      e.stopPropagation();
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'read-all') {
        items = items.map(x => ({ ...x, unread: false }));
        renderDD();
        return;
      }
      if (act === 'view-all') {
        e.preventDefault();
        openCenter();
        return;
      }
      const item = e.target.closest('.tb-dd-item');
      if (item) {
        const id = +item.dataset.id;
        items = items.map(x => x.id === id ? { ...x, unread: false } : x);
        renderDD();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#notif-wrap')) closeDD();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDD();
    });

    // Notification Center delegated events
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('nc-modal');
      if (!modal || !modal.contains(e.target)) return;

      const filterEl = e.target.closest('[data-filter]');
      if (filterEl) { activeFilter = filterEl.dataset.filter; renderCenter(); return; }

      const actEl = e.target.closest('[data-act]');
      const act = actEl?.dataset.act;
      if (act === 'close') { closeCenter(); return; }
      if (act === 'read-all') {
        items = items.map(x => ({ ...x, unread: false }));
        renderCenter(); renderDD(); return;
      }
      if (act === 'clear-all') {
        if (confirm('Xoá tất cả thông báo?')) {
          items = [];
          renderCenter(); renderDD();
        }
        return;
      }
      if (act === 'del') {
        const id = +actEl.dataset.id;
        items = items.filter(x => x.id !== id);
        renderCenter(); renderDD();
        return;
      }

      const item = e.target.closest('.nc-item');
      if (item) {
        const id = +item.dataset.id;
        items = items.map(x => x.id === id ? { ...x, unread: false } : x);
        renderCenter(); renderDD();
      }
    });
  });
})();
