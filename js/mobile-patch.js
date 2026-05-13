/* ============================================================
   AURORA HEIGHTS — MOBILE PATCH
   Injects: burger button, slide-down drawer, pc-info-fab
   Load AFTER main.js  (only runs on mobile widths)
   ============================================================ */

(function () {
  if (window.innerWidth > 768) return;

  /* ── 1. Burger button ────────────────────────────────── */
  const topBar = document.querySelector('.top-bar');
  const burger = document.createElement('button');
  burger.id = 'mobile-burger';
  burger.setAttribute('aria-label', 'Menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = `
    <span class="bur-line"></span>
    <span class="bur-line"></span>
    <span class="bur-line"></span>
  `;
  topBar.appendChild(burger);

  /* ── 2. Slide-down drawer ─────────────────────────────── */
  const drawer = document.createElement('div');
  drawer.id = 'mobile-drawer';
  drawer.innerHTML = `
    <div id="mobile-drawer-inner">
      <div class="mob-drawer-row">
        <button class="mob-drawer-cta-primary" id="mob-book-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <span data-i18n="ui.book">Đặt lịch</span>
        </button>
      </div>
      <div class="mob-drawer-row">
        <button class="mob-drawer-btn" id="mob-sitemap-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>
          <span data-i18n="ui.sitemap">Bản đồ 2D</span>
        </button>
        <button class="mob-drawer-btn" id="mob-gallery-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>
          <span data-i18n="ui.gallery">Thư viện</span>
        </button>
      </div>
      <div class="mob-drawer-divider"></div>
      <div class="mob-drawer-controls">
        <button class="ctrl-btn" id="mob-ctrl-rotate" title="Auto-rotate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 4v5h-5"/></svg>
        </button>
        <button class="ctrl-btn" id="mob-ctrl-zoom-in" title="Zoom in">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M8 11h6M11 8v6"/></svg>
        </button>
        <button class="ctrl-btn" id="mob-ctrl-zoom-out" title="Zoom out">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M8 11h6"/></svg>
        </button>
        <button class="ctrl-btn" id="mob-ctrl-fs" title="Fullscreen">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
        </button>
        <div class="ctrl-lang-wrap">
          <button class="ctrl-btn" id="mob-ctrl-lang" type="button" title="Language">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>
            <span class="ctrl-lang-code" id="mob-ctrl-lang-code">VI</span>
          </button>
          <div class="ctrl-lang-menu" id="mob-ctrl-lang-menu" role="menu"></div>
        </div>
        <button class="ctrl-btn ctrl-btn-help" id="mob-help-btn" title="Help">?</button>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);

  /* ── 3. Burger toggle ─────────────────────────────────── */
  let drawerOpen = false;
  const openDrawer  = () => { drawerOpen = true;  drawer.classList.add('open');    burger.classList.add('open');    burger.setAttribute('aria-expanded','true'); };
  const closeDrawer = () => { drawerOpen = false; drawer.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); };

  burger.addEventListener('click', (e) => { e.stopPropagation(); drawerOpen ? closeDrawer() : openDrawer(); });
  document.addEventListener('click', (e) => { if (drawerOpen && !drawer.contains(e.target) && e.target !== burger) closeDrawer(); });

  /* ── 4. Drawer button wiring ──────────────────────────── */
  drawer.querySelector('#mob-book-btn')?.addEventListener('click', () => { closeDrawer(); document.getElementById('modal-backdrop')?.classList.add('open'); });
  drawer.querySelector('#mob-sitemap-btn')?.addEventListener('click', () => { closeDrawer(); document.getElementById('sitemap-overlay')?.classList.add('open'); });
  drawer.querySelector('#mob-gallery-btn')?.addEventListener('click', () => { closeDrawer(); document.getElementById('gallery-overlay')?.classList.add('open'); });

  let mobRotating = false;
  drawer.querySelector('#mob-ctrl-rotate')?.addEventListener('click', (e) => {
    mobRotating = !mobRotating;
    window.VR360?.setAutoRotate(mobRotating);
    e.currentTarget.classList.toggle('active', mobRotating);
    document.getElementById('ctrl-rotate')?.classList.toggle('active', mobRotating);
  });
  drawer.querySelector('#mob-ctrl-zoom-in')?.addEventListener('click', () => window.VR360?.zoomBy(-8));
  drawer.querySelector('#mob-ctrl-zoom-out')?.addEventListener('click', () => window.VR360?.zoomBy(8));
  drawer.querySelector('#mob-ctrl-fs')?.addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });
  drawer.querySelector('#mob-help-btn')?.addEventListener('click', () => {
    closeDrawer();
    document.getElementById('help-btn')?.click();
  });

  /* Language in drawer */
  (function() {
    if (!window.I18n) return;
    const btn    = drawer.querySelector('#mob-ctrl-lang');
    const menu   = drawer.querySelector('#mob-ctrl-lang-menu');
    const codeEl = drawer.querySelector('#mob-ctrl-lang-code');
    const render = () => {
      const cur = window.I18n.get();
      if (codeEl) codeEl.textContent = cur.toUpperCase();
      menu.innerHTML = window.I18n.langs().map(l =>
        `<button type="button" class="ctrl-lang-item ${l.code===cur?'active':''}" data-code="${l.code}">
          <span class="cli-flag">${l.flag}</span>
          <span class="cli-label">${l.label}</span>
          <span class="cli-code">${l.code.toUpperCase()}</span>
        </button>`
      ).join('');
      menu.querySelectorAll('.ctrl-lang-item').forEach(it =>
        it.addEventListener('click', (e) => { e.stopPropagation(); window.I18n.set(it.dataset.code); menu.classList.remove('open'); render(); })
      );
    };
    render();
    btn.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('open'); });
    window.I18n.onChange(render);
  })();

  /* ── 5. Project-card info FAB ─────────────────────────── */
  const pc = document.getElementById('project-card');
  if (pc) {
    // Start collapsed
    pc.classList.add('collapsed');
    document.body.classList.add('pc-collapsed');

    // Inject FAB as next sibling (CSS uses ~ selector)
    const fab = document.createElement('button');
    fab.id = 'pc-info-fab';
    fab.setAttribute('title', 'Thông tin dự án');
    fab.setAttribute('aria-label', 'Mở thông tin dự án');
    /* info circle icon — clear, readable at 36px */
    fab.innerHTML = `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
      </svg>`;
    pc.insertAdjacentElement('afterend', fab);

    /* FAB → expand */
    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      pc.classList.remove('collapsed');
      document.body.classList.remove('pc-collapsed');
    });

    /* Collapse chevron → collapse */
    const colBtn = pc.querySelector('#pc-collapse');
    if (colBtn) {
      const fresh = colBtn.cloneNode(true);  // strip existing listeners
      colBtn.replaceWith(fresh);
      fresh.addEventListener('click', (e) => {
        e.stopPropagation();
        pc.classList.add('collapsed');
        document.body.classList.add('pc-collapsed');
      });
    }

    /* Tap outside panel → collapse */
    document.addEventListener('click', (e) => {
      if (!pc.classList.contains('collapsed') && !pc.contains(e.target) && e.target !== fab) {
        pc.classList.add('collapsed');
        document.body.classList.add('pc-collapsed');
      }
    });
  }

  /* ── 6. i18n sync for drawer ──────────────────────────── */
  if (window.I18n) {
    window.I18n.onChange(() => {
      drawer.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = window.I18n.t(el.getAttribute('data-i18n'));
      });
    });
  }

})();
