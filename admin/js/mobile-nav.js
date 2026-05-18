/* ============================================
   Mobile bottom navigation (≤768px)
   - Picks the first N nav-items from #sidebar
   - Last slot is "Khác" which opens full sidebar as a drawer
   - Keeps in sync with the existing go(page) router
   ============================================ */
(function () {
  'use strict';

  const PRIMARY_COUNT = 4; // 4 quick items + 1 "Khác" button = 5 total

  function init() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const navItems = Array.from(sidebar.querySelectorAll('.nav-item[data-p]'));
    if (!navItems.length) return;

    // ---- Build bottom nav ----
    const bottom = document.createElement('nav');
    bottom.className = 'mobile-nav';
    bottom.setAttribute('aria-label', 'Mobile navigation');

    const list = document.createElement('div');
    list.className = 'mobile-nav-list';

    const primary = navItems.slice(0, PRIMARY_COUNT);
    primary.forEach(item => {
      const page = item.dataset.p;
      const iconEl = item.querySelector('.ni-icon');
      const labelText = (item.querySelector('.ni-label')?.textContent || '').trim();

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mn-item';
      btn.dataset.p = page;

      const iconWrap = document.createElement('span');
      iconWrap.className = 'mn-icon-wrap';
      if (iconEl) iconWrap.innerHTML = iconEl.innerHTML;

      const label = document.createElement('span');
      label.className = 'mn-label';
      label.textContent = labelText;

      btn.appendChild(iconWrap);
      btn.appendChild(label);

      btn.addEventListener('click', () => {
        // Re-use the existing sidebar item's click handler (works for owner.go and sales.nav)
        item.click();
        closeDrawer();
      });

      list.appendChild(btn);
    });

    // "More" button -> opens sidebar as drawer
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'mn-item';
    more.dataset.role = 'more';
    more.innerHTML = `
      <span class="mn-icon-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </span>
      <span class="mn-label">Khác</span>`;
    more.addEventListener('click', toggleDrawer);
    list.appendChild(more);

    bottom.appendChild(list);
    document.body.appendChild(bottom);

    // ---- Drawer backdrop ----
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-drawer-backdrop';
    backdrop.addEventListener('click', closeDrawer);
    document.body.appendChild(backdrop);

    // ---- Sync active state ----
    function syncActive() {
      const active = sidebar.querySelector('.nav-item.active')?.dataset.p;
      list.querySelectorAll('.mn-item[data-p]').forEach(el => {
        el.classList.toggle('active', el.dataset.p === active);
      });
      // If active page isn't in primary list, highlight "Khác"
      const inPrimary = primary.some(it => it.dataset.p === active);
      more.classList.toggle('active', !inPrimary && !!active);
    }

    // Sync when sidebar items get clicked inside drawer (also closes the drawer)
    sidebar.addEventListener('click', e => {
      if (e.target.closest('.nav-item')) {
        closeDrawer();
        // MutationObserver below picks up the class change
      }
    });

    // Initial sync (after a tick so router has run)
    setTimeout(syncActive, 0);
    // Observe sidebar class changes as a fallback
    const mo = new MutationObserver(syncActive);
    navItems.forEach(it => mo.observe(it, { attributes: true, attributeFilter: ['class'] }));

    // ---- Drawer helpers ----
    function openDrawer() {
      sidebar.classList.add('mobile-open');
      backdrop.classList.add('open');
    }
    function closeDrawer() {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('open');
    }
    function toggleDrawer() {
      if (sidebar.classList.contains('mobile-open')) closeDrawer();
      else openDrawer();
    }

    // Close drawer on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
