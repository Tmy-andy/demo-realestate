/*
 * Nguồn dữ liệu dự án — một chỗ duy nhất.
 *
 * Mặc định: gọi API backend (PostgreSQL). Nếu API không phản hồi
 * (chưa bật server), tự động fallback về file tĩnh data/project.json
 * để site vẫn chạy được.
 *
 * Đổi API_BASE nếu deploy backend ở domain khác.
 */
(function () {
  const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || '';
  const API_URL = API_BASE + '/api/project';
  const STATIC_URL = 'data/project.json';

  // Cho phép tắt API qua localStorage khi cần test offline:
  //   localStorage.setItem('useStaticData','1')
  const forceStatic = localStorage.getItem('useStaticData') === '1';

  // Cảnh báo trực quan khi đang dùng data fallback (project.json) thay vì API thật.
  function showStaleDataBanner(reason) {
    if (document.getElementById('stale-data-banner')) return;
    const b = document.createElement('div');
    b.id = 'stale-data-banner';
    b.style.cssText = `position:fixed;top:0;left:0;right:0;z-index:99999;
      background:#fbbf24;color:#78350f;padding:8px 16px;text-align:center;
      font:600 13px/1.4 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.15)`;
    b.innerHTML = `⚠️ Đang hiển thị dữ liệu mẫu (${reason}). Mọi thay đổi từ admin chưa hiển thị — kiểm tra kết nối API.
      <button onclick="this.parentElement.remove()" style="margin-left:12px;background:#78350f;color:#fff;border:none;padding:2px 10px;border-radius:4px;cursor:pointer">Đóng</button>`;
    document.body.appendChild(b);
  }

  async function fetchProjectData() {
    if (!forceStatic) {
      try {
        const res = await fetch(API_URL, { cache: 'no-store' });
        if (res.ok) {
          console.info('[data-source] Dữ liệu lấy từ API PostgreSQL');
          return await res.json();
        }
        console.warn('[data-source] API trả lỗi', res.status, '— dùng file tĩnh');
        setTimeout(() => showStaleDataBanner(`API trả lỗi ${res.status}`), 500);
      } catch (e) {
        console.warn('[data-source] Không gọi được API (' + e.message + ') — dùng file tĩnh');
        setTimeout(() => showStaleDataBanner('không gọi được API'), 500);
      }
    } else {
      setTimeout(() => showStaleDataBanner('chế độ static được bật'), 500);
    }
    const res = await fetch(STATIC_URL, { cache: 'no-store' });
    console.info('[data-source] Dữ liệu lấy từ file tĩnh project.json');
    return await res.json();
  }

  // Map key màu (admin) -> CSS variable trên :root
  const THEME_VAR_MAP = {
    bg: '--bg',
    fg: '--fg',
    accent: '--accent',
    ok: '--ok',
    danger: '--danger',
    warning: '--warning',
    hotspot: '--hotspot-color',
    countdown: '--countdown-color',
    loader: '--loader-accent',
  };

  // Lấy theme từ API và áp lên :root. API tắt -> giữ màu mặc định trong CSS.
  async function applyTheme() {
    if (forceStatic) return;
    try {
      const res = await fetch(API_BASE + '/api/theme', { cache: 'no-store' });
      if (!res.ok) return;
      const t = await res.json();
      const colors = t && t.colors && t.colors.colors;
      if (!colors) return;
      const root = document.documentElement;
      for (const [key, cssVar] of Object.entries(THEME_VAR_MAP)) {
        if (colors[key]) root.style.setProperty(cssVar, colors[key]);
      }
      console.info('[data-source] Đã áp theme từ CSDL');
    } catch {
      /* API tắt — giữ màu mặc định */
    }
  }

  // Gửi form liên hệ về backend. Trả {ok, assigned} hoặc ném lỗi.
  // Backend tự gán sale theo body.s (slug trong ?s=) hoặc round-robin.
  async function submitLead(payload) {
    const res = await fetch(API_BASE + '/api/leads/public', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      let msg = 'HTTP ' + res.status;
      try { msg = (await res.json()).error || msg; } catch {}
      throw new Error(msg);
    }
    return res.json();
  }

  // Expose toàn cục cho main.js, ai-panel.js...
  window.DataSource = { fetchProjectData, applyTheme, submitLead, API_BASE, API_URL, STATIC_URL };
})();
