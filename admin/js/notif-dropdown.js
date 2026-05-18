/* ============================================
   AURORA HEIGHTS — Notification Dropdown
   ============================================ */
(function () {
  const SAMPLE = [
    { id: 1, type: 'ok',     icon: '✓', text: '<strong>Nguyễn An</strong> vừa đặt cọc căn <strong>A-1205</strong>', time: '2 phút trước', unread: true },
    { id: 2, type: 'info',   icon: 'i', text: '<strong>Trần Bình</strong> đã ký hợp đồng căn <strong>B-0808</strong>', time: '1 giờ trước', unread: true },
    { id: 3, type: 'warn',   icon: '!', text: 'Lịch hẹn xem nhà với <strong>Lê Cường</strong> lúc 14:00 hôm nay', time: '3 giờ trước', unread: true },
    { id: 4, type: 'info',   icon: '◆', text: 'Báo cáo doanh số tuần mới đã sẵn sàng', time: 'Hôm qua', unread: false },
    { id: 5, type: 'danger', icon: '×', text: 'Khách hàng <strong>Phạm Dũng</strong> đã huỷ lịch hẹn', time: '2 ngày trước', unread: false },
  ];

  const ICONS = {
    ok:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    info:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    warn:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    danger: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  };

  let items = SAMPLE.slice();

  function unreadCount() { return items.filter(x => x.unread).length; }

  function render() {
    const dd = document.getElementById('notif-dd');
    const dot = document.getElementById('notif-dot');
    if (!dd) return;
    const n = unreadCount();
    if (dot) dot.style.display = n > 0 ? '' : 'none';

    const listHtml = items.length === 0
      ? '<div class="tb-dd-empty">Chưa có thông báo nào</div>'
      : `<div class="tb-dd-list">${items.map(it => `
          <div class="tb-dd-item ${it.unread ? 'unread' : ''}" data-id="${it.id}">
            <div class="tb-dd-ico ${it.type}">${ICONS[it.type] || ''}</div>
            <div class="tb-dd-body">
              <div class="tb-dd-text">${it.text}</div>
              <div class="tb-dd-time">${it.time}</div>
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

  function close() {
    document.getElementById('notif-btn')?.classList.remove('is-open');
    document.getElementById('notif-dd')?.classList.remove('is-open');
  }
  function open() {
    document.getElementById('notif-btn')?.classList.add('is-open');
    document.getElementById('notif-dd')?.classList.add('is-open');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('notif-btn');
    const dd = document.getElementById('notif-dd');
    if (!btn || !dd) return;

    render();

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dd.classList.contains('is-open') ? close() : open();
    });

    dd.addEventListener('click', (e) => {
      e.stopPropagation();
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'read-all') {
        items = items.map(x => ({ ...x, unread: false }));
        render();
        return;
      }
      if (act === 'view-all') {
        e.preventDefault();
        close();
        return;
      }
      const item = e.target.closest('.tb-dd-item');
      if (item) {
        const id = +item.dataset.id;
        items = items.map(x => x.id === id ? { ...x, unread: false } : x);
        render();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#notif-wrap')) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  });
})();
