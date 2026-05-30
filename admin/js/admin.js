/* ============================================
   AURORA HEIGHTS — Admin CRM JS
   ============================================ */

// ——— ICON HELPER ————————————————————————————————
const ICO = {
  folder:     '<path d="M4 4h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>',
  overview:   '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  home:       '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  leads:      '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  navpanel:   '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/>',
  globe:      '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  palette:    '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  trending:   '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  settings:   '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  calendar:   '<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  video:      '<polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2"/>',
  save:       '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  edit:       '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  trash:      '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  download:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  upload:     '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  refresh:    '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  plus:       '<path d="M5 12h14"/><path d="M12 5v14"/>',
  bell:       '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  book:       '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  eye:        '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  warning:    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  check:      '<path d="M20 6 9 17l-5-5"/>',
  x:          '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  users:      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  key:        '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  ban:        '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  mappin:     '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  building:   '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  hardhat:    '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15V7a8 8 0 0 1 16 0v8"/>',
  armchair:   '<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/>',
  image:      '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  map:        '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
  leaf:       '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  info:       '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  phone:      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.8a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L5.91 7.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 20 16z"/>',
  link:       '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  plug:       '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 0 0-2 2v2a8 8 0 0 0 8 8 8 8 0 0 0 8-8v-2a2 2 0 0 0-2-2z"/>',
  harddrive:  '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',
  arrowleft:  '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  arrowup:    '<path d="m18 15-6-6-6 6"/>',
  arrowdown:  '<path d="m6 9 6 6 6-6"/>',
  arrowupdown:'<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  grip:       '<circle cx="9" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="19" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="19" r="1" fill="currentColor" stroke="none"/>',
};

function ico(name, size=14) {
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0">${ICO[name]||''}</svg>`;
}

// ——— STATE ————————————————————————————————————
const S = {
  page: 'overview',
  data: null,          // raw project.json
  leads: [],
  bookings: [],
  bookingView: 'list',
  weekStart: null,
  analyticsTab: 'views',
  settingsTab: 'project',
  i18nLang: 'vi',  // mã ngôn ngữ đang xem ở trang i18n (khớp languages.code)
  themeUnsaved: false,
  charts: {},
  dragSrc: null,
  users: [],           // danh sách tài khoản (tab Cài đặt > Người dùng)
  usersLoaded: false,
  usersError: null,
};

// ——— GROUP META ———————————————————————————————
// Nhóm gốc của np-list (cấp dự án)
const GROUP_META = {
  tongQuan:        { label: 'Tổng Quan',           icon: 'building' },
  phanKhu:         { label: 'Phân Khu',            icon: 'mappin' },
};
// Nhóm con bên trong mỗi phân khu
const CHILD_GROUP_META = {
  tienIchNoiKhu:   { label: 'Tiện Ích Nội Khu',    icon: 'leaf' },
  tienIchNgoaiKhu: { label: 'Tiện Ích Ngoại Khu',  icon: 'mappin' },
  matBangTang:     { label: 'Mặt Bằng / Tòa',      icon: 'hardhat' },
  view360Can:      { label: 'View 360° Căn Hộ',    icon: 'armchair' },
};

// ——— LOAD DATA ————————————————————————————————
const LS_KEY = 'ah_admin_data';

async function loadData() {
  // Nguồn sự thật là DB qua /api/project — luôn fetch trước để dashboard
  // hiển thị đúng những gì FE/VR đang thấy. localStorage chỉ là bản nháp
  // offline khi server tắt.
  S.data = null;
  try {
    const r = await fetch(API_BASE + '/api/project', { cache: 'no-store' });
    if (r.ok) {
      S.data = await r.json();
      // Đồng bộ lại nháp localStorage theo DB để lần sau offline vẫn khớp.
      try { localStorage.setItem(LS_KEY, JSON.stringify(S.data)); } catch {}
    }
  } catch {
    /* server tắt — fallback bên dưới */
  }
  if (!S.data) {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      try { S.data = JSON.parse(cached); } catch { S.data = null; }
    }
  }
  if (!S.data) {
    try {
      const r = await fetch('../data/project.json');
      S.data = await r.json();
    } catch {
      S.data = getFallbackData();
    }
  }
  // CRM: leads + lịch hẹn nạp từ API thật (xem loadCRM). Khởi tạo rỗng,
  // renderLeads sẽ gọi loadCRM() nếu chưa nạp.
  S.leads = [];
  S.bookings = [];
  S.crmLoaded = false;
  if (!S.data.menu) S.data.menu = {};
  // Chỉ đảm bảo 2 nhóm gốc tồn tại; 4 nhóm con nằm trong children mỗi phân khu
  Object.keys(GROUP_META).forEach(k => { if (!S.data.menu[k]) S.data.menu[k] = []; });
  // Mỗi phân khu phải có children với 4 nhóm con
  (S.data.menu.phanKhu || []).forEach(pk => {
    pk.children ??= {};
    Object.keys(CHILD_GROUP_META).forEach(ck => { pk.children[ck] ??= []; });
  });
  // Đảm bảo các nhánh nội dung tồn tại để không lỗi khi render lần đầu.
  // timeline/legal/location/resources giờ theo phân khu: {__all, <pk>}.
  S.data.gallery        ??= [];
  S.data.siteMap        ??= { center: [16.2130, 108.1200], zoom: 14, points: [] };
  S.data.timeline       ??= { __all: [] };
  S.data.legal          ??= { __all: { documents: [], developerStats: [], testimonials: [] } };
  S.data.location       ??= { __all: { lat: 0, lng: 0, mapSrc: '', nearby: [] } };
  S.data.resources      ??= { __all: {} };
  S.data.properties     ??= [];
  if (!S.data.project)  S.data.project = {};
  migrateUnitsToProperties();
  // Pre-load panorama list for nav panel editor
  await fetchPanoramas();
  // Nạp theme đã lưu từ DB
  await loadTheme();
}

// ——— THEME API ———————————————————————————————
// Đổi nếu backend deploy ở domain khác.
const API_BASE = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) || '';

async function loadTheme() {
  try {
    const r = await fetch(API_BASE + '/api/theme', { cache: 'no-store' });
    if (!r.ok) return;
    const t = await r.json();
    if (t && t.colors && t.colors.colors) {
      // cột custom_tokens_json lưu { colors:{...}, preset:'...' }
      Object.assign(TC.colors, t.colors.colors);
      if (t.colors.preset) TC.currentPreset = t.colors.preset;
    }
  } catch {
    /* API tắt — dùng màu mặc định, không chặn admin */
  }
}

/* properties là nguồn dữ liệu Bất Động Sản duy nhất.
   floorplan.units cũ không còn dùng — trỏ về properties để tương thích. */
function migrateUnitsToProperties() {
  S.data.floorplan = S.data.floorplan || {};
  S.data.floorplan.units = S.data.properties;
}

async function saveData(msg = 'Đã lưu') {
  // 1) Ghi localStorage ngay — bản nháp offline, không mất khi mất mạng.
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(S.data));
  } catch (e) {
    toast('Lỗi lưu cục bộ: ' + e.message, 'err');
    return;
  }
  // 2) Đồng bộ lên DB để trang VR (đọc từ /api/project) thấy thay đổi.
  try {
    const r = await fetch(API_BASE + '/api/project', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(S.data),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    toast(msg, 'ok');
  } catch (e) {
    // Không chặn admin: dữ liệu vẫn còn ở localStorage, chỉ cảnh báo.
    console.warn('Đồng bộ thất bại:', e);
    toast('Lưu thất bại', 'err');
  }
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(S.data,null,2)],{type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'project.json';
  a.click();
  toast('Đã tải project.json', 'ok');
}

function importJSON() {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'application/json';
  inp.onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const fr = new FileReader();
    fr.onload = ev => {
      try {
        S.data = JSON.parse(ev.target.result);
        saveData('Đã import project.json');
        go(S.page);
      } catch (err) { toast('File JSON không hợp lệ', 'err'); }
    };
    fr.readAsText(f);
  };
  inp.click();
}

function resetData() {
  confirmDel('Reset về project.json gốc?', 'Mọi chỉnh sửa trên admin sẽ mất.', async () => {
    localStorage.removeItem(LS_KEY);
    S.data = null;
    await loadData();
    go(S.page);
    toast('Đã reset về mặc định', 'ok');
  });
}

// ——— FALLBACK DATA ————————————————————————————
function getFallbackData() {
  return {
    project: { name:'Vinhomes Hai Van Bay', developer:'Vinhomes', location:'Hải Vân, Đà Nẵng', status:'Đang mở bán GĐ 2', handover:'Quý IV / 2027', priceFrom:'Từ 4.9 tỷ', totalUnits:1840 },
    menu: { tongQuan:[], tienIchNoiKhu:[], tienIchNgoaiKhu:[], matBangTang:[], view360Can:[] },
    floorplan: { units: [] },
  };
}

// ——— CRM DATA ————————————————————————————————
// Leads + lịch hẹn nạp từ API thật: GET /api/leads, GET /api/appointments.
// Mọi thao tác thêm/sửa/xoá đều gọi API rồi nạp lại (lưu vĩnh viễn vào DB).
async function loadCRM(force) {
  if (S.crmLoaded && !force) return true;
  try {
    const [lr, br] = await Promise.all([
      fetch(API_BASE + '/api/leads', { cache: 'no-store' }),
      fetch(API_BASE + '/api/appointments', { cache: 'no-store' }),
    ]);
    if (!lr.ok || !br.ok) throw new Error('HTTP ' + lr.status + '/' + br.status);
    S.leads = await lr.json();
    S.bookings = await br.json();
    S.crmLoaded = true;
    return true;
  } catch (e) {
    console.warn('Không tải được CRM:', e.message);
    S.crmError = e.message;
    return false;
  }
}

// Gọi API CRM (POST/PUT/DELETE) rồi nạp lại danh sách + render trang Leads.
async function crmApi(method, path, body) {
  const opt = { method };
  if (body) { opt.headers = { 'Content-Type': 'application/json' }; opt.body = JSON.stringify(body); }
  const r = await fetch(API_BASE + path, opt);
  if (!r.ok) {
    let msg = 'HTTP ' + r.status;
    try { msg = (await r.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return r.json();
}

// ——— AUTH ————————————————————————————————————
// Phiên đăng nhập do trang index.html tạo; mọi trang admin dùng chung.
function authSession() {
  try { return JSON.parse(sessionStorage.getItem('ah_session') || 'null'); }
  catch { return null; }
}
function authToken() { return authSession()?.token || ''; }
function authRole()  { return authSession()?.role  || ''; }

// Gọi API cần đăng nhập — tự đính kèm Bearer token, xử lý 401.
async function authApi(method, path, body) {
  const opt = { method, headers: { Authorization: 'Bearer ' + authToken() } };
  if (body) {
    opt.headers['Content-Type'] = 'application/json';
    opt.body = JSON.stringify(body);
  }
  const r = await fetch(API_BASE + path, opt);
  if (r.status === 401) {
    sessionStorage.removeItem('ah_session');
    location.href = adminPath('index.html');
    throw new Error('Phiên đăng nhập đã hết hạn');
  }
  if (!r.ok) {
    let msg = 'HTTP ' + r.status;
    try { msg = (await r.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return r.status === 204 ? null : r.json();
}

// Đường dẫn tuyệt đối tới 1 file trong thư mục admin/ — redirect luôn
// đúng dù URL là /admin, /admin/, hay /admin/owner.html.
function adminPath(file) {
  const p = location.pathname;
  const i = p.lastIndexOf('/admin');
  const dir = i !== -1 ? p.slice(0, i) + '/admin/' : p.replace(/[^/]*$/, '');
  return dir + file;
}

// Đăng xuất — thu hồi phiên ở server rồi quay về trang đăng nhập.
async function doLogout() {
  try { await fetch(API_BASE + '/api/auth/logout', {
    method: 'POST', headers: { Authorization: 'Bearer ' + authToken() },
  }); } catch (e) { /* server tắt vẫn cho thoát */ }
  sessionStorage.removeItem('ah_session');
  location.href = adminPath('index.html');
}

// ——— ROUTER ——————————————————————————————————
function go(page) {
  S.page = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.p === page));
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('p-' + page);
  if (el) { el.classList.add('active'); render(page, el); }
}

function render(page, el) {
  Object.values(S.charts).forEach(c => { try { c.destroy() } catch {} });
  S.charts = {};
  switch (page) {
    case 'overview':  renderOverview(el); break;
    case 'properties': renderPropertiesPage(el); break;
    case 'property-detail': renderPropertyDetailPage(el); break;
    case 'navpanel':  renderNavPanel(el); break;
    case 'masterplan': renderMasterplanPage(el); break;
    case 'i18n':      renderI18n(el); break;
    case 'theme':     renderTheme(el); break;
    case 'analytics': renderAnalytics(el); break;
    case 'settings':  renderSettings(el); break;
    case 'gallery':   renderGalleryPage(el); break;
    case 'sitemap':   renderSiteMapPage(el); break;
    case 'timeline':  renderTimelinePage(el); break;
    case 'legal':     renderLegalPage(el); break;
    case 'location':  renderLocationPage(el); break;
    case 'resources': renderResourcesPage(el); break;
  }
}

// ——— HELPERS —————————————————————————————————
const d = S.data;
const units  = () => S.data?.floorplan?.units  || [];
const proj   = () => S.data?.project           || {};
const menu   = () => S.data?.menu              || {};

/** Dynamically discover available panoramas from the 3DVista locale file */
let _panoramaCache = null;
async function fetchPanoramas() {
  if (_panoramaCache) return _panoramaCache;
  try {
    const res = await fetch('../data/locale/en.txt');
    const txt = await res.text();
    const list = [];
    for (const line of txt.split('\n')) {
      const m = line.match(/^(panorama_[A-F0-9_]+)\.label\s*=\s*(.+)$/);
      if (m) {
        list.push({
          hexId: m[1],
          name: m[2].trim(),
          thumbnail: `../data/media/${m[1]}_t.webp`
        });
      }
    }
    // Sort by pano number
    list.sort((a, b) => {
      const na = parseInt(a.name.replace('pano-','')) || 0;
      const nb = parseInt(b.name.replace('pano-','')) || 0;
      return na - nb;
    });
    _panoramaCache = list;
    return list;
  } catch (e) {
    console.warn('Could not fetch panorama list:', e);
    return [];
  }
}

function vrLink(panoName) {
  if (!panoName) return '../index.html';
  return `../index.html#pano=${panoName}`;
}

// ——— ANALYTICS DATA ————————————————————————————
// Số liệu THẬT từ backend: GET /api/analytics (bảng analytics_* / leads / ai_*)
// Cache 1 lần/lần tải trang; gọi loadAnalytics(true) để buộc tải lại.
let _analyticsCache = null;
async function loadAnalytics(force) {
  if (_analyticsCache && !force) return _analyticsCache;
  try {
    const r = await fetch(API_BASE + '/api/analytics', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    _analyticsCache = await r.json();
  } catch (e) {
    console.warn('Không tải được /api/analytics:', e.message);
    _analyticsCache = null;
  }
  return _analyticsCache;
}

// ——— OVERVIEW ————————————————————————————————
function renderOverview(el) {
  const us = units();
  const totalAvail = us.reduce((s,u)=>s+(u.available||0),0);
  const totalAll   = us.reduce((s,u)=>s+(u.total||0),0);
  const soldPct    = totalAll ? ((totalAll-totalAvail)/totalAll*100).toFixed(1) : 0;
  const p          = proj();
  const gal        = (S.data.gallery||[]);
  const galPending = gal.filter(g=>g && g.pending).length;
  // timeline giờ là {__all:[...], <pk>:[...]} — Tổng quan dùng mảng cấp dự án
  const tlRaw      = S.data.timeline;
  const tl         = Array.isArray(tlRaw) ? tlRaw : ((tlRaw && tlRaw.__all) || []);
  const tlActive   = tl.find(t=>t.status==='active');
  const tlDue      = tl.filter(t=>t.status!=='done').length;

  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span></div><h1>Tổng Quan</h1></div>
      <div class="btn-group">
        <a href="../index.html" target="_blank" class="btn btn-secondary btn-sm">${ico('globe')} Xem trang VR</a>
        <button class="btn btn-primary btn-sm" onclick="go('units')">${ico('plus')} Thêm Căn Hộ</button>
      </div>
    </div>
    <div class="quick-row">
      <button class="btn btn-secondary btn-sm" onclick="go('gallery')">${ico('image')} Duyệt Thư Viện</button>
      <button class="btn btn-secondary btn-sm" onclick="go('timeline')">${ico('calendar')} Cập Nhật Tiến Độ</button>
      <button class="btn btn-secondary btn-sm" onclick="go('navpanel')">${ico('navpanel')} Quản lý Danh Sách VR</button>
      <button class="btn btn-secondary btn-sm" onclick="toast('Đã làm mới','ok')">${ico('refresh')} Làm Mới</button>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon blue">${ico('eye',18)}</div>
        <div class="kpi-label">Lượt xem hôm nay</div>
        <div class="kpi-value" id="kpi-views">—</div>
        <div class="kpi-trend neutral" id="kpi-views-trend">Đang tải…</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon orange">${ico('image',18)}</div>
        <div class="kpi-label">Ảnh chờ duyệt</div>
        <div class="kpi-value">${galPending}</div>
        <div class="kpi-trend neutral">trong tổng ${gal.length} ảnh</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon green">${ico('home',18)}</div>
        <div class="kpi-label">Căn còn lại</div>
        <div class="kpi-value">${totalAvail} <span style="font-size:16px;font-weight:500;color:var(--muted)">/ ${totalAll}</span></div>
        <div class="kpi-trend neutral">${p.status||'—'}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon purple">${ico('calendar',18)}</div>
        <div class="kpi-label">Milestone tới hạn</div>
        <div class="kpi-value">${tlDue}</div>
        <div class="kpi-trend neutral">${tlActive ? 'Đang: '+tlActive.phase : 'Đã hoàn tất tiến độ'}</div>
      </div>
    </div>
    <div class="kpi-grid" style="margin-top:12px">
      <div class="kpi-card">
        <div class="kpi-icon purple">${ico('trending',18)}</div>
        <div class="kpi-label">Tỷ lệ bán</div>
        <div class="kpi-value">${soldPct}%</div>
        <div class="kpi-trend neutral">${totalAll-totalAvail}/${totalAll} căn đã bán</div>
      </div>
    </div>
    <div class="g21">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header"><span class="card-title">Lượt Xem Theo Giờ</span><span class="c-muted" style="font-size:12px">Hôm nay</span></div>
          <div class="card-body"><div class="chart-wrap"><canvas id="ch-hourly"></canvas></div></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">Scene Phổ Biến</span></div>
          <div class="card-body"><div class="chart-wrap"><canvas id="ch-scenes"></canvas></div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Hoạt Động Gần Đây</span></div>
        <div class="card-body p0" style="padding:16px">
          <div class="feed" id="feed">
            <div class="feed-empty" style="padding:8px;color:var(--muted);font-size:13px">Đang tải hoạt động…</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Project info summary ── -->
    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <span class="card-title">${ico('hardhat',16)} Thông Tin Dự Án</span>
        <button class="btn btn-secondary btn-sm" onclick="go('settings')">${ico('edit')} Chỉnh sửa</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0;border-top:1px solid var(--border)">
        ${[
          ['Tên dự án', p.name],
          ['Chủ đầu tư', p.developer],
          ['Vị trí', p.location],
          ['Trạng thái', p.status],
          ['Bàn giao', p.handover],
          ['Giá từ', p.priceFrom],
          ['Số tầng', p.floors],
          ['Tổng số căn', p.totalUnits],
          ['Diện tích', p.areaRange],
          ['Mật độ XD', p.density],
          ['Cây xanh', p.greenSpace],
        ].map(([k,v])=>`
          <div style="padding:12px 16px;border-right:1px solid var(--border);border-bottom:1px solid var(--border)">
            <div style="font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">${k}</div>
            <div style="font-size:13px;font-weight:500;color:var(--text)">${v||'—'}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- ── VR Tour content management ── -->
    <div style="margin-top:24px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:13px;font-weight:700;color:var(--text);letter-spacing:.04em;text-transform:uppercase">Nội Dung Trang VR</div>
      <a href="../index.html" target="_blank" class="btn btn-secondary btn-sm">${ico('globe')} Xem trang VR</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
      ${[
        { icon:'building', label:'Tổng quan dự án',   key:'tongQuan',         hint:'VR Tổng quan',        page:'navpanel' },
        { icon:'mappin',   label:'Phân khu',           key:'phanKhu',          hint:'VR theo phân khu',    page:'navpanel' },
        { icon:'home',     label:'Bất động sản',       key:'properties',       hint:'Sản phẩm BĐS',        page:'properties' },
        { icon:'image',    label:'Thư viện ảnh',       key:'gallery',          hint:'Gallery overlay',     page:'settings', action:'openGalleryPanel' },
        { icon:'map',      label:'Masterplan',          key:'masterplan',       hint:'Quy hoạch & marker',  page:'masterplan' },
        { icon:'calendar', label:'Tiến độ xây dựng',   key:'timeline',         hint:'Construction milestones', page:'settings', action:'openTimelinePanel' },
      ].map(c => {
        const isMenuKey = ['tongQuan','phanKhu'].includes(c.key);
        const data = isMenuKey ? S.data.menu?.[c.key] : S.data[c.key];
        const count = Array.isArray(data) ? data.length : (data?.points?.length ?? (data ? 1 : 0));
        const onclick = c.action ? `onclick="${c.action}()"` : `onclick="go('${c.page}')"`;
        return `
          <div class="card" style="padding:16px 20px;cursor:pointer;transition:border-color .15s" ${onclick}
               onmouseenter="this.style.borderColor='var(--primary)'" onmouseleave="this.style.borderColor=''">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <div style="font-size:22px;line-height:1;display:flex;align-items:center">${ico(c.icon,22)}</div>
              <span class="badge badge-muted" style="font-size:11px">${count} mục</span>
            </div>
            <div style="font-weight:600;font-size:13px;color:var(--text)">${c.label}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${c.hint}</div>
            <div style="margin-top:10px;font-size:11px;color:var(--primary);font-weight:600">Quản lý →</div>
          </div>`;
      }).join('')}
    </div>
  `;
  // Nạp số liệu analytics thật rồi cập nhật KPI + vẽ chart
  loadAnalytics().then((a) => {
    const vEl = document.getElementById('kpi-views');
    const tEl = document.getElementById('kpi-views-trend');
    if (vEl && tEl) {
      if (a) {
        vEl.textContent = (a.viewsToday || 0).toLocaleString('vi-VN');
        const dy = a.viewsYesterday || 0;
        if (dy > 0) {
          const pct = ((a.viewsToday - dy) / dy * 100);
          const up = pct >= 0;
          tEl.className = 'kpi-trend ' + (up ? 'up' : 'down');
          tEl.innerHTML = `${ico(up?'arrowup':'arrowdown',10)}${Math.abs(pct).toFixed(1)}% so hôm qua`;
        } else {
          tEl.className = 'kpi-trend neutral';
          tEl.textContent = 'Chưa có dữ liệu hôm qua để so sánh';
        }
      } else {
        vEl.textContent = '—';
        tEl.className = 'kpi-trend neutral';
        tEl.textContent = 'Không tải được số liệu';
      }
    }
    drawHourly(a); drawScenesBar(a);
  });
  loadActivityFeed();
}

// ——— Hoạt động gần đây: lấy luồng thật từ API ————————————
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)    return 'Vừa xong';
  if (diff < 3600)  return Math.floor(diff / 60) + ' phút';
  if (diff < 86400) return Math.floor(diff / 3600) + ' giờ';
  return Math.floor(diff / 86400) + ' ngày';
}

async function loadActivityFeed() {
  const feed = document.getElementById('feed');
  if (!feed) return;
  try {
    const r = await fetch(API_BASE + '/api/activity?limit=12', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const items = await r.json();
    if (!items.length) {
      feed.innerHTML = '<div class="feed-empty" style="padding:8px;color:var(--muted);font-size:13px">Chưa có hoạt động nào</div>';
      return;
    }
    feed.innerHTML = items.map(it => `
      <div class="feed-item">
        <div class="feed-dot ${it.dot}"></div>
        <div class="feed-msg">${it.msg}</div>
        <div class="feed-time">${timeAgo(it.at)}</div>
      </div>`).join('');
  } catch (e) {
    console.warn('Không tải được hoạt động gần đây:', e);
    feed.innerHTML = '<div class="feed-empty" style="padding:8px;color:var(--muted);font-size:13px">Không kết nối được máy chủ</div>';
  }
}

// Vẽ chart "Lượt xem theo giờ" — số liệu thật từ /api/analytics
function drawHourly(a) {
  const el = document.getElementById('ch-hourly'); if (!el || !window.Chart) return;
  const now = new Date().getHours();
  const data = (a && Array.isArray(a.hourly)) ? a.hourly : Array(24).fill(0);
  S.charts.hourly = new Chart(el, {
    type: 'bar',
    data: { labels: Array.from({length:24},(_,i)=>i+'h'), datasets: [{ data, backgroundColor: data.map((_,i)=>i===now?'#3b82f6':'rgba(59,130,246,.25)'), borderRadius: 3 }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales: { x:{ticks:{color:'#94a3b8',font:{size:10}}}, y:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'rgba(0,0,0,.05)'}} } }
  });
}

// Vẽ chart "Scene phổ biến" — số liệu thật (analytics_events nối vr_scenes)
function drawScenesBar(a) {
  const el = document.getElementById('ch-scenes'); if (!el || !window.Chart) return;
  const scenes = (a && Array.isArray(a.scenes)) ? a.scenes : [];
  const labels = scenes.map(s => s.name);
  const data   = scenes.map(s => s.count);
  S.charts.scenes = new Chart(el, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: 'rgba(59,130,246,.55)', borderRadius: 4 }] },
    options: { indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales: { x:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'rgba(0,0,0,.05)'}}, y:{ticks:{color:'#64748b',font:{size:11}}} } }
  });
}

// ——— UNITS ————————————————————————————————————
let uf = { search:'', type:'', status:'' };

function renderUnits(el) {
  const us = filteredUnits();
  const st = unitStats();
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Căn Hộ</div><h1>Quản Lý Căn Hộ</h1></div>
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm" onclick="toast('Đang xuất Excel…','info')">${ico('download')} Xuất Excel</button>
        <button class="btn btn-primary btn-sm" onclick="propEdit(-1)">${ico('plus')} Thêm Sản Phẩm</button>
      </div>
    </div>
    <div class="card">
      <div class="filter-bar">
        <input class="fi" style="min-width:200px" placeholder="Tìm mã, loại, hướng…" value="${uf.search}" oninput="uf.search=this.value;reloadUnitsTbody()">
        <select class="fi fi-select" onchange="uf.type=this.value;reloadUnitsTbody()">
          <option value="">Tất cả loại</option>
          ${[...new Set(units().map(u=>u.type))].map(t=>`<option ${uf.type===t?'selected':''}>${t}</option>`).join('')}
        </select>
        <select class="fi fi-select" onchange="uf.status=this.value;reloadUnitsTbody()">
          <option value="">Tất cả trạng thái</option>
          <option value="available" ${uf.status==='available'?'selected':''}>Còn hàng</option>
          <option value="holding"   ${uf.status==='holding'  ?'selected':''}>Đang giữ</option>
          <option value="sold"      ${uf.status==='sold'     ?'selected':''}>Đã bán</option>
        </select>
        <div class="filter-spacer"></div>
        <span class="c-muted" style="font-size:12px" id="u-count">${us.length} căn</span>
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr>
            <th>Mã căn</th><th>Loại</th><th class="sort">Tầng ${ico('arrowupdown',11)}</th>
            <th>Diện tích</th><th>Hướng</th><th>Giá/m²</th><th>Giá tổng</th>
            <th>Còn/Tổng</th><th>Trạng thái</th><th>Thao tác</th>
          </tr></thead>
          <tbody id="u-body">${us.map(unitRow).join('')}</tbody>
        </table>
      </div>
      <div class="stats-row">
        <div class="stat-cell"><div class="stat-v">${st.total}</div><div class="stat-l">Tổng căn</div></div>
        <div class="stat-cell"><div class="stat-v c-ok">${st.avail}</div><div class="stat-l">Còn hàng</div></div>
        <div class="stat-cell"><div class="stat-v" style="color:var(--warning)">${st.hold}</div><div class="stat-l">Đang giữ</div></div>
        <div class="stat-cell"><div class="stat-v c-danger">${st.sold}</div><div class="stat-l">Đã bán</div></div>
        <div class="stat-cell"><div class="stat-v">${st.pct}%</div><div class="stat-l">Tỷ lệ bán</div></div>
        <div class="stat-cell"><div class="stat-v">${st.avg} tỷ</div><div class="stat-l">Giá TB</div></div>
      </div>
    </div>
  `;
}

function unitRow(u) {
  const bm = { available:'badge-ok', holding:'badge-warning', sold:'badge-danger' };
  const bl = { available:'Còn hàng', holding:'Đang giữ', sold:'Đã bán' };
  const idx = units().indexOf(u);
  const avail = (u.available != null || u.total != null)
    ? `${u.available ?? '—'} / ${u.total ?? '—'}` : '—';
  return `<tr>
    <td class="mono fw6">${esc(u.code||'—')}</td>
    <td><span class="badge badge-primary">${esc(u.typeLabel||u.type||'—')}</span></td>
    <td>${u.floor ?? '—'}</td>
    <td>${u.area||0} m²</td>
    <td>${esc(u.direction||'—')}</td>
    <td class="mono">${esc(u.pricePerM2||'—')}</td>
    <td class="mono fw6 c-primary">${esc(u.price||'—')}</td>
    <td>${avail}</td>
    <td><span class="badge ${bm[u.status]||'badge-muted'}">${bl[u.status]||u.status}</span></td>
    <td><div class="row-actions">
      <button class="act-btn" onclick="propEdit(${idx})">${ico('edit')} Sửa</button>
      <button class="act-btn danger" onclick="propDelete(${idx})">${ico('trash')}</button>
    </div></td>
  </tr>`;
}

function reloadUnitsTbody() {
  const b = document.getElementById('u-body'), c = document.getElementById('u-count');
  const us = filteredUnits();
  if (b) b.innerHTML = us.map(unitRow).join('');
  if (c) c.textContent = us.length + ' căn';
}

function filteredUnits() {
  return units().filter(u => {
    const q = uf.search.toLowerCase();
    if (q && !JSON.stringify(u).toLowerCase().includes(q)) return false;
    if (uf.type   && u.type   !== uf.type)   return false;
    if (uf.status && u.status !== uf.status) return false;
    return true;
  });
}

function unitStats() {
  const us = units();
  const avail = us.reduce((s,u)=>s+(u.available||0),0);
  const total = us.reduce((s,u)=>s+(u.total||0),0);
  const sold  = us.filter(u=>u.status==='sold').reduce((s,u)=>s+(u.total||0),0);
  const hold  = us.filter(u=>u.status==='holding').length;
  const avg   = us.length ? (us.reduce((s,u)=>s+(u.priceVal||0),0)/us.length).toFixed(1) : 0;
  return { total, avail, sold, hold, pct: total?(((total-avail)/total)*100).toFixed(1):0, avg };
}

function deleteUnit(code) {
  S.data.floorplan.units = units().filter(u=>u.code!==code);
  render('units', document.getElementById('p-units'));
  toast(`Đã xoá căn ${code}`, 'ok');
}

function openUnitPanel(code) {
  const u = code ? units().find(x=>x.code===code) : null;
  const isNew = !u;
  const def = { code:'', type:'2PN', floor:'', area:'', direction:'Đông Nam', priceVal:'', price:'', pricePerM2:'', available:'', total:'', status:'available' };
  const v = u || def;
  showPanel(`${isNew?'Thêm':'Sửa'} Căn Hộ`, `
    <div class="form-section">Thông Tin Cơ Bản</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Mã căn <span class="req">*</span></label><input class="form-control" id="fp-code" value="${v.code}" ${!isNew?'readonly':''}></div>
      <div class="form-group"><label class="form-label">Loại căn <span class="req">*</span></label>
        <select class="form-control form-select" id="fp-type">${['2PN','2PN+1','3PN','Duplex 3PN','Penthouse'].map(t=>`<option ${v.type===t?'selected':''}>${t}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tầng</label><input class="form-control" type="number" id="fp-floor" value="${v.floor}" min="1" max="42"></div>
      <div class="form-group"><label class="form-label">Diện tích (m²)</label><input class="form-control" type="number" id="fp-area" value="${v.area}"></div>
    </div>
    <div class="form-group"><label class="form-label">Hướng ban công</label>
      <select class="form-control form-select" id="fp-dir">${['Đông','Tây','Nam','Bắc','Đông Nam','Tây Nam','Đông Bắc','Tây Bắc','Panorama'].map(d=>`<option ${v.direction===d?'selected':''}>${d}</option>`).join('')}</select>
    </div>
    <div class="form-section">Thông Tin Giá</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Giá tổng (tỷ VND)</label><input class="form-control" type="number" id="fp-price" value="${v.priceVal}" step="0.1"></div>
      <div class="form-group"><label class="form-label">Giá/m² (tự tính)</label><input class="form-control" id="fp-ppm2" value="${v.pricePerM2}" readonly></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Số lượng tổng</label><input class="form-control" type="number" id="fp-total" value="${v.total}"></div>
      <div class="form-group"><label class="form-label">Số còn lại</label><input class="form-control" type="number" id="fp-avail" value="${v.available}"></div>
    </div>
    <div class="form-section">Trạng Thái</div>
    <div class="form-group"><label class="form-label">Trạng thái bán</label>
      <select class="form-control form-select" id="fp-status">
        <option value="available" ${v.status==='available'?'selected':''}>Còn hàng</option>
        <option value="holding"   ${v.status==='holding'  ?'selected':''}>Đang giữ chỗ</option>
        <option value="sold"      ${v.status==='sold'     ?'selected':''}>Đã bán hết</option>
      </select>
    </div>
  `, () => {
    const code2 = document.getElementById('fp-code').value.trim();
    const price  = parseFloat(document.getElementById('fp-price').value)||0;
    const area   = parseFloat(document.getElementById('fp-area').value)||0;
    if (!code2 || !price) { toast('Điền đủ thông tin bắt buộc', 'warn'); return; }
    const ppm2 = area ? Math.round(price*1000/area)+' tr/m²' : v.pricePerM2;
    const nu = {
      code: code2,
      type:      document.getElementById('fp-type').value,
      floor:     parseInt(document.getElementById('fp-floor').value)||0,
      area,
      direction: document.getElementById('fp-dir').value,
      priceVal:  price,
      price:     price+' tỷ',
      pricePerM2: ppm2,
      total:     parseInt(document.getElementById('fp-total').value)||0,
      available: parseInt(document.getElementById('fp-avail').value)||0,
      status:    document.getElementById('fp-status').value,
    };
    if (isNew) { S.data.floorplan.units.push(nu); }
    else { const i = units().findIndex(x=>x.code===code); if (i>=0) S.data.floorplan.units[i]=nu; }
    closePanel();
    render('units', document.getElementById('p-units'));
    toast(isNew?'Đã thêm căn hộ':'Đã cập nhật căn hộ', 'ok');
  });
}

// ——— LEADS ————————————————————————————————————
let lf = { search:'', status:'', source:'' };

// Mã trạng thái khớp leads.status_code trong CSDL (chk_leads_status)
const LEAD_STATUS  = { new:'Mới', called:'Đã gọi', interested:'Đang quan tâm', qualified:'Đủ điều kiện', closed:'Đã chốt', stopped:'Không tiếp tục', lost:'Đã mất' };
const LEAD_BADGE   = { new:'badge-info', called:'badge-warning', interested:'badge-primary', qualified:'badge-primary', closed:'badge-ok', stopped:'badge-muted', lost:'badge-muted' };
// Nguồn lead — gom theo nhóm để hiển thị optgroup
const SOURCE_GROUPS = {
  'Website / VR':       ['VR Web','Live Chat website'],
  'Quảng cáo trả phí':  ['Google Ads','Facebook Ads','Zalo Ads'],
  'Mạng xã hội':        ['Facebook','TikTok','YouTube','Instagram'],
  'Sàn BĐS / Portal':   ['Batdongsan.com.vn','Chợ Tốt Nhà','Mogi','Alonhadat','Nhà Tốt'],
  'Đại lý / CTV':       ['Sàn F1','Cộng tác viên'],
  'Liên hệ trực tiếp':  ['Hotline','Telesale','Zalo OA','Zalo cá nhân','Email','SMS / Brandname'],
  'Offline':            ['Walk-in','Sự kiện','Banner / Tờ rơi','Báo chí / PR'],
  'Khác':               ['Giới thiệu','Khách cũ','Re-marketing','Khác'],
};
const SOURCE_LIST = Object.values(SOURCE_GROUPS).flat();
const SOURCE_BADGE = {
  'VR Web':'badge-purple','Live Chat website':'badge-purple',
  'Google Ads':'badge-warning','Facebook Ads':'badge-warning','Zalo Ads':'badge-warning',
  'Facebook':'badge-primary','TikTok':'badge-primary','YouTube':'badge-primary','Instagram':'badge-primary',
  'Batdongsan.com.vn':'badge-info','Chợ Tốt Nhà':'badge-info','Mogi':'badge-info','Alonhadat':'badge-info','Nhà Tốt':'badge-info',
  'Sàn F1':'badge-purple','Cộng tác viên':'badge-purple',
  'Hotline':'badge-ok','Telesale':'badge-warning','Zalo OA':'badge-ok','Zalo cá nhân':'badge-ok','Email':'badge-info','SMS / Brandname':'badge-info',
  'Walk-in':'badge-warning','Sự kiện':'badge-purple','Banner / Tờ rơi':'badge-muted','Báo chí / PR':'badge-muted',
  'Giới thiệu':'badge-info','Khách cũ':'badge-ok','Re-marketing':'badge-warning','Khác':'badge-muted',
  // Backward-compat cho mock data cũ
  'Zalo':'badge-ok','Call':'badge-warning',
};
function sourceOptions(selected='') {
  return Object.entries(SOURCE_GROUPS).map(([g,items]) =>
    `<optgroup label="${g}">${items.map(s=>`<option ${selected===s?'selected':''}>${s}</option>`).join('')}</optgroup>`
  ).join('');
}

// ——— Searchable combobox cho nguồn lead ———————
// Usage: sourceCombo('al-source', 'Walk-in')
function sourceCombo(id, selected='', placeholder='Tìm nguồn…', onChange='') {
  const has = selected ? 'has-value' : '';
  return `
    <div class="combo ${has}" data-combo="${id}" data-cb="${onChange}">
      <input type="hidden" id="${id}" value="${selected}">
      <input type="text" class="form-control combo-input" id="${id}-q" value="${selected}" placeholder="${placeholder}" autocomplete="off"
        oninput="comboFilter('${id}',this.value);comboShow('${id}')"
        onfocus="comboShow('${id}')"
        onkeydown="comboKey(event,'${id}')">
      <button type="button" class="combo-clear" onclick="comboClear('${id}')" tabindex="-1">×</button>
      <span class="combo-caret">▾</span>
      <div class="combo-pop" id="${id}-pop">${comboRender('')}</div>
    </div>`;
}

function comboFireCb(wrap) {
  const cb = wrap && wrap.dataset.cb;
  if (cb && typeof window[cb] === 'function') window[cb](document.getElementById(wrap.dataset.combo).value);
}

function comboRender(q) {
  const ql = (q||'').toLowerCase().trim();
  let html = '';
  let count = 0;
  for (const [g, items] of Object.entries(SOURCE_GROUPS)) {
    const matched = items.filter(s => !ql || s.toLowerCase().includes(ql));
    if (!matched.length) continue;
    html += `<div class="combo-group">${g}</div>`;
    html += matched.map(s => `<div class="combo-opt" data-val="${s}" onmousedown="comboPick(event)">${highlightMatch(s, ql)}</div>`).join('');
    count += matched.length;
  }
  if (!count) html = `<div class="combo-empty">Không tìm thấy nguồn "${q}"</div>`;
  return html;
}

function highlightMatch(text, q) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text;
  return text.slice(0,i) + '<b style="color:var(--primary)">' + text.slice(i, i+q.length) + '</b>' + text.slice(i+q.length);
}

function comboFilter(id, q) {
  const pop = document.getElementById(id+'-pop');
  if (pop) pop.innerHTML = comboRender(q);
  const wrap = document.querySelector(`[data-combo="${id}"]`);
  if (wrap) wrap.classList.toggle('has-value', !!q);
}

function comboShow(id) {
  document.querySelectorAll('.combo.open').forEach(c => { if (c.dataset.combo !== id) c.classList.remove('open'); });
  const wrap = document.querySelector(`[data-combo="${id}"]`);
  if (wrap) wrap.classList.add('open');
}

function comboHide(id) {
  const wrap = document.querySelector(`[data-combo="${id}"]`);
  if (wrap) wrap.classList.remove('open');
}

function comboPick(e) {
  e.preventDefault();
  const opt = e.currentTarget;
  const val = opt.dataset.val;
  const wrap = opt.closest('.combo');
  const id = wrap.dataset.combo;
  document.getElementById(id).value = val;
  document.getElementById(id+'-q').value = val;
  wrap.classList.add('has-value');
  comboHide(id);
  comboFireCb(wrap);
}

function comboClear(id) {
  document.getElementById(id).value = '';
  document.getElementById(id+'-q').value = '';
  comboFilter(id, '');
  document.getElementById(id+'-q').focus();
  comboFireCb(document.querySelector(`[data-combo="${id}"]`));
}

function comboKey(e, id) {
  const pop = document.getElementById(id+'-pop'); if (!pop) return;
  const opts = [...pop.querySelectorAll('.combo-opt')];
  let i = opts.findIndex(o => o.classList.contains('active'));
  if (e.key === 'ArrowDown') { e.preventDefault(); i = Math.min(opts.length-1, i+1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); i = Math.max(0, i-1); }
  else if (e.key === 'Enter') { if (i>=0 && opts[i]) { e.preventDefault(); opts[i].dispatchEvent(new MouseEvent('mousedown')); } return; }
  else if (e.key === 'Escape') { comboHide(id); return; }
  else return;
  opts.forEach(o => o.classList.remove('active'));
  if (opts[i]) { opts[i].classList.add('active'); opts[i].scrollIntoView({block:'nearest'}); }
}

// Đóng combobox khi click ra ngoài
document.addEventListener('click', e => {
  if (!e.target.closest('.combo')) document.querySelectorAll('.combo.open').forEach(c => c.classList.remove('open'));
});
// Mã trạng thái khớp appointments.status_code (chk_appointments_status)
const BOOKING_STATUS = { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', completed:'Đã hoàn tất', cancelled:'Đã huỷ', no_show:'Khách không đến' };
const BOOKING_BADGE  = { pending:'badge-warning', confirmed:'badge-info', completed:'badge-ok', cancelled:'badge-muted', no_show:'badge-muted' };
const BOOKING_TYPES  = ['Xem nhà mẫu','Tư vấn tại VP','Xem VR online','Khác'];

function renderLeads(el) {
  // Nạp CRM thật lần đầu vào trang
  if (!S.crmLoaded) {
    el.innerHTML = `<div class="ph"><div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Leads</div><h1>Leads & Booking</h1></div></div>
      <div class="card"><div style="padding:40px;text-align:center;color:var(--muted)">Đang tải dữ liệu CRM từ máy chủ…</div></div>`;
    loadCRM().then((ok) => {
      if (!ok) {
        el.innerHTML = `<div class="ph"><div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Leads</div><h1>Leads & Booking</h1></div></div>
          <div class="card"><div style="padding:40px;text-align:center;color:var(--danger,#e66)">
            Không tải được dữ liệu CRM: ${S.crmError||''}<br><br>
            <button class="btn btn-secondary btn-sm" onclick="render('leads',document.getElementById('p-leads'))">Thử lại</button>
            <div style="margin-top:10px;font-size:12px">Hãy chắc máy chủ API đang chạy.</div>
          </div></div>`;
        return;
      }
      render('leads', el);
    });
    return;
  }
  const ls = filteredLeads();
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Leads</div><h1>Leads & Booking</h1></div>
      <div class="btn-group">
        <button class="btn btn-primary btn-sm" onclick="openAddLeadPanel()">${ico('plus')||'+'} Thêm Lead</button>
        <button class="btn btn-primary btn-sm" onclick="openAddBookingPanel()">${ico('calendar')||'📅'} Đặt Lịch</button>
        <button class="btn btn-secondary btn-sm" onclick="exportLeadsCSV()">${ico('download')} CSV</button>
        <button class="btn btn-secondary btn-sm" onclick="toast('Đang xuất Excel…','info')">${ico('download')} Excel</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Danh Sách Leads</span><span class="c-muted" style="font-size:12px">Bao gồm cả lead nhập thủ công từ Walk-in, gọi điện, sự kiện…</span></div>
      <div class="filter-bar">
        <input class="fi" style="min-width:200px" placeholder="Tên, SĐT, email…" value="${lf.search}" oninput="lf.search=this.value;reloadLeadsTbody()">
        <select class="fi fi-select" onchange="lf.status=this.value;reloadLeadsTbody()">
          <option value="">Tất cả trạng thái</option>
          ${Object.entries(LEAD_STATUS).map(([k,v])=>`<option value="${k}" ${lf.status===k?'selected':''}>${v}</option>`).join('')}
        </select>
        <div style="min-width:220px">${sourceCombo('lf-source', lf.source, 'Tất cả nguồn — gõ để tìm…', 'onSourceFilter')}</div>
        <div class="filter-spacer"></div>
        <span class="c-muted" style="font-size:12px" id="l-count">${ls.length} leads</span>
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr><th>#</th><th>Họ tên</th><th>Điện thoại</th><th>Căn quan tâm</th><th>Ngân sách</th><th>Nguồn</th><th>Trạng thái</th><th>Ngày tạo</th><th>Phụ trách</th><th>Thao tác</th></tr></thead>
          <tbody id="l-body">${ls.map(leadRow).join('')}</tbody>
        </table>
      </div>
      <div class="paging">
        <span class="paging-info">Hiển thị ${ls.length} / ${S.leads.length} leads</span>
        <button class="pager active">1</button><button class="pager">2</button>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <span class="card-title">Lịch Hẹn / Booking</span>
        <div style="display:flex;gap:8px;align-items:center">
          <div class="view-toggle" id="bk-toggle">
            <button class="${S.bookingView==='week'?'':'active'}" onclick="setBookingView('list')">${ico('leads',12)} Danh sách</button>
            <button class="${S.bookingView==='week'?'active':''}" onclick="setBookingView('week')">${ico('calendar',12)} Lịch tuần</button>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="openAddBookingPanel()">+ Đặt lịch thủ công</button>
        </div>
      </div>
      <div id="bk-view">${renderBookingView()}</div>
    </div>
  `;
}

function setBookingView(v) {
  S.bookingView = v;
  const c = document.getElementById('bk-view'); if (c) c.innerHTML = renderBookingView();
  document.querySelectorAll('#bk-toggle button').forEach((b,i) => b.classList.toggle('active', (i===0&&v==='list')||(i===1&&v==='week')));
}

function renderBookingView() {
  return S.bookingView === 'week' ? renderBookingWeek() : renderBookingList();
}

function renderBookingList() {
  const bs = S.bookings;
  return `<div class="table-wrap">
    <table class="tbl">
      <thead><tr><th>#</th><th>Khách hàng</th><th>Điện thoại</th><th>Ngày</th><th>Giờ</th><th>Loại</th><th>Phụ trách</th><th>Trạng thái</th><th>Ghi chú</th><th>Thao tác</th></tr></thead>
      <tbody id="b-body">${bs.map(bookingRow).join('')}</tbody>
    </table>
    ${bs.length===0 ? '<div class="c-muted" style="padding:16px;text-align:center">Chưa có lịch hẹn nào</div>' : ''}
  </div>`;
}

// ——— Lịch tuần ————————————————————————————————
function startOfWeek(d) {
  const x = new Date(d); x.setHours(0,0,0,0);
  const day = (x.getDay() + 6) % 7; // T2 = 0
  x.setDate(x.getDate() - day);
  return x;
}

function fmtRange(start) {
  const end = new Date(start); end.setDate(end.getDate()+6);
  const f = d => d.toLocaleDateString('vi-VN', {day:'2-digit',month:'2-digit'});
  return `${f(start)} – ${f(end)} / ${end.getFullYear()}`;
}

function shiftWeek(days) {
  const cur = S.weekStart || startOfWeek(new Date());
  const nx = new Date(cur); nx.setDate(nx.getDate()+days);
  S.weekStart = startOfWeek(nx);
  setBookingView('week');
}

function gotoToday() { S.weekStart = startOfWeek(new Date()); setBookingView('week'); }

function renderBookingWeek() {
  if (!S.weekStart) S.weekStart = startOfWeek(new Date());
  const ws = S.weekStart;
  const today = new Date(); today.setHours(0,0,0,0);
  const days = Array.from({length:7}, (_,i) => { const d = new Date(ws); d.setDate(d.getDate()+i); return d; });
  const dows = ['T2','T3','T4','T5','T6','T7','CN'];
  const hours = []; for (let h=8; h<=19; h++) hours.push(h);

  // Group bookings theo "YYYY-MM-DD|H"
  const byCell = {};
  S.bookings.forEach(b => {
    if (!b.date || !b.time) return;
    const h = parseInt(b.time.split(':')[0]);
    const key = `${b.date}|${h}`;
    (byCell[key] = byCell[key] || []).push(b);
  });

  const head = `<div class="cal-cell cal-head"></div>` + days.map((d,i) => {
    const isToday = d.getTime() === today.getTime();
    return `<div class="cal-cell cal-head ${isToday?'today':''}">
      <div class="cal-dow">${dows[i]}</div>
      <div class="cal-day">${d.getDate()}/${d.getMonth()+1}</div>
    </div>`;
  }).join('');

  const rows = hours.map(h => {
    const cells = days.map(d => {
      const ds = d.toISOString().slice(0,10);
      const list = byCell[`${ds}|${h}`] || [];
      return `<div class="cal-cell">${list.map(b => `
        <div class="cal-event s-${b.status}" onclick="openEditBookingPanel(${b.id})" title="${b.name} · ${b.time} · ${b.type||''}">
          <div class="ev-time">${b.time}</div>
          <div class="ev-name">${b.name}</div>
          <div class="ev-meta">${b.type||''}${b.assignee?' · '+b.assignee:''}</div>
        </div>`).join('')}</div>`;
    }).join('');
    return `<div class="cal-cell cal-time">${String(h).padStart(2,'0')}:00</div>${cells}`;
  }).join('');

  return `
    <div class="cal-toolbar">
      <div class="cal-nav">
        <button onclick="shiftWeek(-7)" title="Tuần trước">‹</button>
        <button onclick="gotoToday()" title="Hôm nay" style="width:auto;padding:0 10px;font-size:12px">Hôm nay</button>
        <button onclick="shiftWeek(7)" title="Tuần sau">›</button>
      </div>
      <div class="cal-range">${fmtRange(ws)}</div>
      <div style="font-size:12px;color:var(--muted)">
        <span style="display:inline-block;width:10px;height:10px;background:rgba(245,158,11,.4);border-left:2px solid #f59e0b;margin-right:4px;vertical-align:middle"></span>Chờ
        <span style="display:inline-block;width:10px;height:10px;background:rgba(59,130,246,.4);border-left:2px solid #3b82f6;margin:0 4px 0 10px;vertical-align:middle"></span>Xác nhận
        <span style="display:inline-block;width:10px;height:10px;background:rgba(16,185,129,.4);border-left:2px solid #10b981;margin:0 4px 0 10px;vertical-align:middle"></span>Hoàn tất
      </div>
    </div>
    <div class="cal-week">${head}${rows}</div>
  `;
}

function onSourceFilter(v) {
  lf.source = v || '';
  reloadLeadsTbody();
}

function leadRow(l, i) {
  const dt = l.createdAt ? new Date(l.createdAt).toLocaleDateString('vi-VN') : '';
  return `<tr>
    <td class="c-muted">${i+1}</td>
    <td class="fw6">${l.name}</td>
    <td><a href="tel:${l.phone}" class="c-primary mono">${l.phone}</a></td>
    <td>${l.unitType||'—'}</td>
    <td>${l.budget||'—'}</td>
    <td><span class="badge ${SOURCE_BADGE[l.source]||'badge-muted'}">${l.source}</span>${l.manual?' <span class="badge badge-muted" title="Nhập thủ công" style="font-size:10px">✎ Thủ công</span>':''}</td>
    <td><span class="badge ${LEAD_BADGE[l.status]||'badge-muted'}">${LEAD_STATUS[l.status]||l.status}</span></td>
    <td class="c-muted">${dt}</td>
    <td>${l.assignee||'<span class="c-muted">—</span>'}</td>
    <td><div class="row-actions">
      <a href="tel:${l.phone}" class="act-btn" title="Gọi điện">${ico('phone')}</a>
      ${l.zalo
        ? `<a href="https://zalo.me/${l.zalo}" target="_blank" class="act-btn act-btn-zalo" title="Mở Zalo"><img src="../img/Icon_of_Zalo.svg" alt="Zalo" width="14" height="14"></a>`
        : `<span class="act-btn act-btn-zalo disabled" title="Chưa có Zalo" aria-disabled="true"><img src="../img/Icon_of_Zalo.svg" alt="Zalo" width="14" height="14"></span>`}
      <button class="act-btn" onclick="openLeadPanel(${l.id})" title="Sửa">${ico('edit')}</button>
      <button class="act-btn danger" onclick="confirmDel('Xoá lead ${l.name}?','Lead sẽ bị xoá vĩnh viễn.',()=>deleteLead(${l.id}))" title="Xoá">${ico('trash')}</button>
    </div></td>
  </tr>`;
}

function reloadLeadsTbody() {
  const b = document.getElementById('l-body'), c = document.getElementById('l-count');
  const ls = filteredLeads();
  if (b) b.innerHTML = ls.map(leadRow).join('');
  if (c) c.textContent = ls.length + ' leads';
}

function filteredLeads() {
  return S.leads.filter(l => {
    const q = lf.search.toLowerCase();
    if (q && !l.name.toLowerCase().includes(q) && !l.phone.includes(q) && !(l.email||'').toLowerCase().includes(q)) return false;
    if (lf.status && l.status !== lf.status) return false;
    if (lf.source && l.source !== lf.source) return false;
    return true;
  });
}

async function deleteLead(id) {
  try {
    await crmApi('DELETE', '/api/leads/' + id);
    await loadCRM(true);
    render('leads', document.getElementById('p-leads'));
    toast('Đã xoá lead', 'ok');
  } catch (e) {
    toast('Xoá thất bại: ' + e.message, 'err');
  }
}

function openLeadPanel(id) {
  const l = S.leads.find(x=>x.id===id); if (!l) return;
  showPanel('Cập Nhật Lead', `
    <div class="form-section">Thông Tin Liên Hệ</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Họ tên <span class="req">*</span></label><input class="form-control" id="lp-name" value="${l.name}"></div>
      <div class="form-group"><label class="form-label">Số điện thoại <span class="req">*</span></label><input class="form-control" id="lp-phone" value="${l.phone}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Email</label><input class="form-control" id="lp-email" value="${l.email||''}"></div>
      <div class="form-group"><label class="form-label">Zalo</label><input class="form-control" id="lp-zalo" value="${l.zalo||''}"></div>
    </div>
    <div class="form-section">Căn Hộ Quan Tâm</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Loại căn</label>
        <select class="form-control form-select" id="lp-type">${['','2PN','2PN+1','3PN','Duplex 3PN'].map(t=>`<option ${l.unitType===t?'selected':''}>${t||'Chưa xác định'}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Ngân sách</label>
        <select class="form-control form-select" id="lp-budget">${['< 5 tỷ','5–8 tỷ','8–12 tỷ','> 12 tỷ'].map(b=>`<option ${l.budget===b?'selected':''}>${b}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-section">Quản Lý CRM</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nguồn</label>
        ${sourceCombo('lp-source', l.source||'', 'Tìm nguồn…')}
      </div>
      <div class="form-group"><label class="form-label">Trạng thái</label>
        <select class="form-control form-select" id="lp-status">${Object.entries(LEAD_STATUS).map(([k,v])=>`<option value="${k}" ${l.status===k?'selected':''}>${v}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Người phụ trách</label>
        <select class="form-control form-select" id="lp-assign">${['','Sales A','Sales B','Sales C'].map(a=>`<option ${l.assignee===a?'selected':''}>${a||'Chưa phân công'}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Mục đích</label>
        <select class="form-control form-select" id="lp-purpose">${['','Ở thực','Đầu tư','Cho thuê'].map(p=>`<option ${l.purpose===p?'selected':''}>${p||'—'}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú CRM</label><textarea class="form-control" id="lp-notes" rows="3">${l.notes||''}</textarea></div>
  `, async () => {
    const payload = {
      name:     document.getElementById('lp-name').value.trim(),
      phone:    document.getElementById('lp-phone').value.trim(),
      email:    document.getElementById('lp-email').value,
      zalo:     document.getElementById('lp-zalo').value,
      budget:   document.getElementById('lp-budget').value,
      source:   document.getElementById('lp-source').value,
      status:   document.getElementById('lp-status').value,
      purpose:  document.getElementById('lp-purpose').value,
      notes:    document.getElementById('lp-notes').value,
    };
    if (!payload.name || !payload.phone) { toast('Vui lòng nhập họ tên và số điện thoại','err'); return; }
    try {
      await crmApi('PUT', '/api/leads/' + id, payload);
      await loadCRM(true);
      closePanel();
      render('leads', document.getElementById('p-leads'));
      toast('Đã cập nhật lead', 'ok');
    } catch (e) {
      toast('Cập nhật thất bại: ' + e.message, 'err');
    }
  });
}

function exportLeadsCSV() {
  const hdr = ['Họ tên','SĐT','Email','Zalo','Căn','Ngân sách','Mục đích','Nguồn','Trạng thái','Ngày tạo','Phụ trách','Ghi chú'];
  const rows = S.leads.map(l => [l.name,l.phone,l.email,l.zalo,l.unitType,l.budget,l.purpose,l.source,l.status,l.createdAt,l.assignee,l.notes].map(v=>`"${(v||'').replace(/"/g,'""')}"`).join(','));
  const blob = new Blob(['﻿'+[hdr.join(','),...rows].join('\n')], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'leads-aurora.csv'; a.click();
  toast('Đã xuất CSV', 'ok');
}

// ——— THÊM LEAD THỦ CÔNG ———————————————————————
function openAddLeadPanel() {
  showPanel('Thêm Lead Thủ Công', `
    <div class="form-section">Thông Tin Liên Hệ</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Họ tên <span class="req">*</span></label><input class="form-control" id="al-name" placeholder="VD: Nguyễn Văn A"></div>
      <div class="form-group"><label class="form-label">Số điện thoại <span class="req">*</span></label><input class="form-control" id="al-phone" placeholder="09xx xxx xxx"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Email</label><input class="form-control" id="al-email" placeholder="email@domain.com"></div>
      <div class="form-group"><label class="form-label">Zalo</label><input class="form-control" id="al-zalo" placeholder="Số Zalo (nếu khác SĐT)"></div>
    </div>
    <div class="form-section">Căn Hộ Quan Tâm</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Loại căn</label>
        <select class="form-control form-select" id="al-type">${['','2PN','2PN+1','3PN','Duplex 3PN'].map(t=>`<option value="${t}">${t||'Chưa xác định'}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Ngân sách</label>
        <select class="form-control form-select" id="al-budget"><option value="">Chưa xác định</option>${['< 5 tỷ','5–8 tỷ','8–12 tỷ','> 12 tỷ'].map(b=>`<option>${b}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Mục đích</label>
        <select class="form-control form-select" id="al-purpose"><option value="">—</option>${['Ở thực','Đầu tư','Cho thuê'].map(p=>`<option>${p}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Thời điểm mua</label>
        <select class="form-control form-select" id="al-timing"><option value="">—</option>${['Trong 1 tháng','Trong 3 tháng','Trong 6 tháng','Hơn 6 tháng'].map(t=>`<option>${t}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-section">Nguồn & Phân Công</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nguồn lead <span class="req">*</span></label>
        ${sourceCombo('al-source', 'Walk-in', 'Gõ để tìm nguồn (vd: tiktok, batdongsan…)…')}
        <small class="c-muted" style="font-size:11px">Lead từ VR Web tự động đẩy vào hệ thống. Chọn nguồn tương ứng cho lead nhập thủ công để tracking ROI từng kênh.</small>
      </div>
      <div class="form-group"><label class="form-label">Phụ trách</label>
        <select class="form-control form-select" id="al-assign">${['','Sales A','Sales B','Sales C'].map(a=>`<option>${a||'Chưa phân công'}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label><textarea class="form-control" id="al-notes" rows="3" placeholder="Nội dung trao đổi, yêu cầu đặc biệt…"></textarea></div>
  `, async () => {
    const name  = document.getElementById('al-name').value.trim();
    const phone = document.getElementById('al-phone').value.trim();
    if (!name || !phone) { toast('Vui lòng nhập họ tên và số điện thoại','err'); return; }
    const payload = {
      name, phone,
      email:    document.getElementById('al-email').value.trim(),
      zalo:     document.getElementById('al-zalo').value.trim(),
      budget:   document.getElementById('al-budget').value,
      purpose:  document.getElementById('al-purpose').value,
      timing:   document.getElementById('al-timing').value,
      source:   document.getElementById('al-source').value,
      status:   'new',
      notes:    document.getElementById('al-notes').value,
    };
    try {
      await crmApi('POST', '/api/leads', payload);
      await loadCRM(true);
      closePanel();
      render('leads', document.getElementById('p-leads'));
      toast('Đã thêm lead thủ công', 'ok');
    } catch (e) {
      toast('Thêm thất bại: ' + e.message, 'err');
    }
  });
}

// ——— BOOKING ———————————————————————————————————
function bookingRow(b, i) {
  const dt = b.date ? new Date(b.date).toLocaleDateString('vi-VN') : '—';
  return `<tr>
    <td class="c-muted">${i+1}</td>
    <td class="fw6">${b.name}${b.manual?' <span class="badge badge-muted" style="font-size:10px" title="Đặt lịch thủ công">✎</span>':''}</td>
    <td><a href="tel:${b.phone}" class="c-primary mono">${b.phone}</a></td>
    <td>${dt}</td>
    <td class="mono">${b.time||'—'}</td>
    <td>${b.type||'—'}</td>
    <td>${b.assignee||'<span class="c-muted">—</span>'}</td>
    <td><span class="badge ${BOOKING_BADGE[b.status]||'badge-muted'}">${BOOKING_STATUS[b.status]||b.status}</span></td>
    <td class="c-muted" style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${(b.notes||'').replace(/"/g,'&quot;')}">${b.notes||'—'}</td>
    <td><div class="row-actions">
      <a href="tel:${b.phone}" class="act-btn" title="Gọi điện">${ico('phone')}</a>
      <button class="act-btn" onclick="openEditBookingPanel(${b.id})" title="Sửa">${ico('edit')}</button>
      <button class="act-btn danger" onclick="confirmDel('Xoá lịch hẹn của ${b.name}?','Lịch hẹn sẽ bị xoá vĩnh viễn.',()=>deleteBooking(${b.id}))" title="Xoá">${ico('trash')}</button>
    </div></td>
  </tr>`;
}

async function deleteBooking(id) {
  try {
    await crmApi('DELETE', '/api/appointments/' + id);
    await loadCRM(true);
    render('leads', document.getElementById('p-leads'));
    toast('Đã xoá lịch hẹn', 'ok');
  } catch (e) {
    toast('Xoá thất bại: ' + e.message, 'err');
  }
}

function bookingFormHTML(b={}) {
  const today = new Date().toISOString().slice(0,10);
  const leadOpts = ['<option value="">— Khách mới (chưa có lead) —</option>']
    .concat(S.leads.map(l=>`<option value="${l.id}" ${b.leadId===l.id?'selected':''}>${l.name} · ${l.phone}</option>`)).join('');
  return `
    <div class="form-section">Khách Hàng</div>
    <div class="form-group"><label class="form-label">Liên kết với Lead có sẵn</label>
      <select class="form-control form-select" id="ab-lead" onchange="onBookingLeadChange()">${leadOpts}</select>
      <small class="c-muted" style="font-size:11px">Chọn lead có sẵn để tự điền tên/SĐT, hoặc để trống nếu khách mới.</small>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Họ tên <span class="req">*</span></label><input class="form-control" id="ab-name" value="${b.name||''}"></div>
      <div class="form-group"><label class="form-label">Số điện thoại <span class="req">*</span></label><input class="form-control" id="ab-phone" value="${b.phone||''}"></div>
    </div>
    <div class="form-section">Chi Tiết Lịch Hẹn</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Ngày <span class="req">*</span></label><input type="date" class="form-control" id="ab-date" value="${b.date||today}"></div>
      <div class="form-group"><label class="form-label">Giờ <span class="req">*</span></label><input type="time" class="form-control" id="ab-time" value="${b.time||'10:00'}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Loại</label>
        <select class="form-control form-select" id="ab-type">${BOOKING_TYPES.map(t=>`<option ${b.type===t?'selected':''}>${t}</option>`).join('')}</select>
      </div>
      <div class="form-group"><label class="form-label">Phụ trách</label>
        <select class="form-control form-select" id="ab-assign">${['','Sales A','Sales B','Sales C'].map(a=>`<option ${b.assignee===a?'selected':''}>${a||'Chưa phân công'}</option>`).join('')}</select>
      </div>
    </div>
    <div class="form-group"><label class="form-label">Trạng thái</label>
      <select class="form-control form-select" id="ab-status">${Object.entries(BOOKING_STATUS).map(([k,v])=>`<option value="${k}" ${(b.status||'pending')===k?'selected':''}>${v}</option>`).join('')}</select>
    </div>
    <div class="form-group"><label class="form-label">Ghi chú</label><textarea class="form-control" id="ab-notes" rows="3" placeholder="Yêu cầu của khách, nội dung tư vấn…">${b.notes||''}</textarea></div>
  `;
}

function onBookingLeadChange() {
  const id = parseInt(document.getElementById('ab-lead').value);
  if (!id) return;
  const l = S.leads.find(x=>x.id===id); if (!l) return;
  document.getElementById('ab-name').value  = l.name;
  document.getElementById('ab-phone').value = l.phone;
}

function bookingPayload() {
  return {
    leadId:   parseInt(document.getElementById('ab-lead').value) || null,
    name:     document.getElementById('ab-name').value.trim(),
    phone:    document.getElementById('ab-phone').value.trim(),
    date:     document.getElementById('ab-date').value,
    time:     document.getElementById('ab-time').value,
    type:     document.getElementById('ab-type').value,
    status:   document.getElementById('ab-status').value,
    notes:    document.getElementById('ab-notes').value,
  };
}

function openAddBookingPanel() {
  showPanel('Đặt Lịch Hẹn Thủ Công', bookingFormHTML(), async () => {
    const p = bookingPayload();
    if (!p.name || !p.phone || !p.date || !p.time) { toast('Vui lòng nhập tên, SĐT, ngày và giờ','err'); return; }
    try {
      await crmApi('POST', '/api/appointments', p);
      await loadCRM(true);
      closePanel();
      render('leads', document.getElementById('p-leads'));
      toast('Đã đặt lịch hẹn', 'ok');
    } catch (e) {
      toast('Đặt lịch thất bại: ' + e.message, 'err');
    }
  });
}

function openEditBookingPanel(id) {
  const b = S.bookings.find(x=>x.id===id); if (!b) return;
  showPanel('Cập Nhật Lịch Hẹn', bookingFormHTML(b), async () => {
    const p = bookingPayload();
    if (!p.name || !p.phone || !p.date || !p.time) { toast('Vui lòng nhập tên, SĐT, ngày và giờ','err'); return; }
    try {
      await crmApi('PUT', '/api/appointments/' + id, p);
      await loadCRM(true);
      closePanel();
      render('leads', document.getElementById('p-leads'));
      toast('Đã cập nhật lịch hẹn', 'ok');
    } catch (e) {
      toast('Cập nhật thất bại: ' + e.message, 'err');
    }
  });
}

// ——— DANH SÁCH VR (np-list) ———————————————————
/* Trang np-list dùng dropdown phân khu (S.subKey['navpanel']):
   - '__all'  : hiện nhóm Tổng quan + danh sách Phân khu (chỉ sửa được
                các điểm Tổng quan; phân khu là cấp container).
   - '<pkId>' : hiện 4 nhóm con của phân khu đó.
   Lưu nội dung phân khu qua nút "Lưu phân khu" (PUT /api/subdivision). */
function renderNavPanel(el) {
  const m = menu();
  const subKey = curSubKey('navpanel');
  let groupsHtml;
  if (subKey === '__all') {
    // Tổng quan (phẳng) + danh sách phân khu (chỉ đọc, dẫn hướng)
    groupsHtml = renderNpGroup('tongQuan', GROUP_META.tongQuan, m.tongQuan || [], null)
      + renderPhanKhuNavGroup(m.phanKhu || []);
  } else {
    // 4 nhóm con của phân khu đang chọn
    const pk = (m.phanKhu || []).find(p => p.id === subKey);
    const children = (pk && pk.children) || {};
    groupsHtml = Object.entries(CHILD_GROUP_META)
      .map(([k, meta]) => renderNpGroup(k, meta, children[k] || [], subKey))
      .join('');
  }
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Nội Dung VR</div><h1>Danh Sách VR</h1></div>
      <div class="btn-group">
        <button class="btn btn-primary btn-sm" onclick="toast('Đã lưu thứ tự danh sách VR','ok')">${ico('save')} Lưu Thứ Tự</button>
      </div>
    </div>
    <p class="c-muted" style="margin-bottom:16px;font-size:13px">
      Quản lý danh sách điểm tham quan VR360. Chọn phân khu để sửa các điểm thuộc phân khu đó.
      Tiện ích nội/ngoại khu, Mặt bằng, View 360 là <b>con của từng phân khu</b>.
    </p>
    ${subSelectorBar('navpanel')}
    <div class="np-list" id="np-list">${groupsHtml}</div>
  `;
  initNpDrag();
}

/* Nhóm "Phân khu" ở tab Tất cả — liệt kê các phân khu, mỗi dòng có nút
   "Sửa nội dung" để nhảy sang tab phân khu đó. */
function renderPhanKhuNavGroup(list) {
  return `
    <div class="np-group" data-group="phanKhu">
      <div class="np-group-head">
        <span class="np-group-icon">${ico('mappin', 16)}</span>
        <span class="np-group-name">Phân Khu</span>
        <span class="np-group-count">${list.length} phân khu</span>
        <div class="np-group-actions">
          <button class="btn btn-secondary btn-xs" onclick="openAddCardPanel('phanKhu')">+ Thêm phân khu</button>
        </div>
      </div>
      <div class="np-cards" id="cards-phanKhu" data-group="phanKhu">
        ${list.length ? list.map(pk => `
          <div class="np-card" data-group="phanKhu" data-id="${pk.id}">
            <div class="np-card-icon">${ico('mappin',13)}</div>
            <div class="np-card-info">
              <div class="np-card-label">${esc(pk.label||'')}</div>
              <div class="np-card-scene mono" style="font-size:11px;color:var(--muted)">
                ${childTotalCount(pk)} điểm con · ${pk.tdvPanoramaId||'chưa gán panorama'}
              </div>
            </div>
            <div class="np-card-actions">
              <button class="btn btn-secondary btn-xs" onclick="onSubSelectChange('navpanel','${pk.id}')">Sửa nội dung →</button>
              <button class="act-btn" onclick="openEditCardPanel('phanKhu','${pk.id}')">${ico('edit')}</button>
              <button class="act-btn danger" onclick="deleteNpCard('phanKhu','${pk.id}')">${ico('trash')}</button>
            </div>
          </div>`).join('')
        : `<div class="np-empty c-muted">Chưa có phân khu nào.</div>`}
        <div class="np-add-card" onclick="openAddCardPanel('phanKhu')">
          <span>＋</span> <span>Thêm phân khu</span>
        </div>
      </div>
    </div>`;
}
function childTotalCount(pk) {
  const ch = pk.children || {};
  return Object.keys(CHILD_GROUP_META).reduce((n,k) => n + ((ch[k]||[]).length), 0);
}

/* renderNpGroup: subId = null cho nhóm gốc, hoặc id phân khu cho nhóm con */
function renderNpGroup(key, meta, items, subId) {
  const ctx = subId ? `'${key}','${subId}'` : `'${key}'`;
  return `
    <div class="np-group" data-group="${key}" data-sub="${subId||''}">
      <div class="np-group-head">
        <span class="np-group-icon">${ico(meta.icon, 16)}</span>
        <span class="np-group-name">${meta.label}</span>
        <span class="np-group-count">${items.length} điểm</span>
        <div class="np-group-actions">
          <button class="btn btn-secondary btn-xs" onclick="openAddCardPanel(${ctx})">+ Thêm</button>
        </div>
      </div>
      <div class="np-cards" id="cards-${key}" data-group="${key}" data-sub="${subId||''}">
        ${items.length ? items.map(item => renderNpCard(key, item, subId)).join('') : `<div class="np-empty c-muted">Chưa có điểm nào — nhấn <b>+ Thêm</b> để thêm điểm VR</div>`}
        <div class="np-add-card" onclick="openAddCardPanel(${ctx})">
          <span>＋</span> <span>Thêm điểm VR360</span>
        </div>
      </div>
    </div>
  `;
}

function renderNpCard(groupKey, item, subId) {
  const hasPano = !!item.tdvPanoramaId;
  const panoDisplay = item.tdvPanoramaId || 'Chưa gán panorama';
  const thumbSrc = hasPano && _panoramaCache
    ? (_panoramaCache.find(p => p.name === item.tdvPanoramaId)?.thumbnail || '')
    : '';
  return `
    <div class="np-card" draggable="true" data-group="${groupKey}" data-id="${item.id}">
      <span class="np-card-handle" title="Kéo để sắp xếp">${ico('grip',12)}</span>
      ${thumbSrc ? `<img src="${thumbSrc}" class="np-card-thumb" alt="${item.tdvPanoramaId}" style="width:48px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0">` : `<div class="np-card-icon">${ico('mappin',13)}</div>`}
      <div class="np-card-info">
        <div class="np-card-label">${item.label}</div>
        <div class="np-card-scene mono" style="font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px"
             title="${panoDisplay}">${panoDisplay}</div>
      </div>
      <div class="np-card-actions">
        ${hasPano
          ? `<span class="badge" style="background:var(--accent-soft);color:var(--accent);font-size:10px">${ico('video',11)} ${item.tdvPanoramaId}</span>`
          : `<span class="badge badge-warning">${ico('warning')} Chưa gán</span>`}
        <button class="act-btn" onclick="openEditCardPanel('${groupKey}','${item.id}'${subId?`,'${subId}'`:''})">${ico('edit')}</button>
        <button class="act-btn danger" onclick="deleteNpCard('${groupKey}','${item.id}'${subId?`,'${subId}'`:''})">${ico('trash')}</button>
      </div>
    </div>
  `;
}

function openAddGroupPanel() {
  const newKey = 'custom_' + Date.now();
  showPanel('Thêm Danh Mục Mới', `
    <div class="form-group"><label class="form-label">Tên danh mục <span class="req">*</span></label><input class="form-control" id="ng-label" placeholder="VD: Khu Thương Mại"></div>
    <div class="form-group"><label class="form-label">Icon (tên icon)</label><input class="form-control" id="ng-icon" value="mappin" maxlength="20"></div>
    <p class="form-hint">Danh mục mới sẽ được thêm vào cuối danh sách.</p>
  `, () => {
    const label = document.getElementById('ng-label').value.trim();
    const icon  = document.getElementById('ng-icon').value.trim() || 'mappin';
    if (!label) { toast('Nhập tên nhóm', 'warn'); return; }
    GROUP_META[newKey] = { label, icon };
    S.data.menu[newKey] = [];
    closePanel();
    render('navpanel', document.getElementById('p-navpanel'));
    toast('Đã thêm nhóm', 'ok');
  });
}

function openEditGroupPanel(key) {
  const meta = GROUP_META[key];
  showPanel('Sửa Nhóm', `
    <div class="form-group"><label class="form-label">Tên nhóm</label><input class="form-control" id="eg-label" value="${meta.label}"></div>
    <div class="form-group"><label class="form-label">Icon</label><input class="form-control" id="eg-icon" value="${meta.icon}" maxlength="4"></div>
  `, () => {
    GROUP_META[key].label = document.getElementById('eg-label').value.trim() || meta.label;
    GROUP_META[key].icon  = document.getElementById('eg-icon').value.trim()  || meta.icon;
    closePanel();
    render('navpanel', document.getElementById('p-navpanel'));
    toast('Đã cập nhật nhóm', 'ok');
  });
}

/* Mảng item của 1 nhóm np-list.
   subId null  → nhóm gốc S.data.menu[groupKey]
   subId set   → nhóm con: phanKhu[subId].children[groupKey] */
function npGroupArr(groupKey, subId) {
  if (!subId) {
    S.data.menu[groupKey] ??= [];
    return S.data.menu[groupKey];
  }
  const pk = (S.data.menu.phanKhu || []).find(p => p.id === subId);
  if (!pk) return [];
  pk.children ??= {};
  pk.children[groupKey] ??= [];
  return pk.children[groupKey];
}

async function openAddCardPanel(groupKey, subId) {
  const panos = await fetchPanoramas();
  const panoOptions = panos.map(p =>
    `<option value="${p.name}">${p.name}</option>`
  ).join('');
  showPanel('Thêm Điểm VR360', `
    <div class="form-group">
      <label class="form-label">Tên hiển thị <span class="req">*</span></label>
      <input class="form-control" id="nc-label" placeholder="VD: Bể bơi vô cực">
    </div>
    <div class="form-group">
      <label class="form-label">Chọn Panorama 3DVista</label>
      <select class="form-control form-select" id="nc-pano" onchange="previewPano('nc')">
        <option value="">— Chưa chọn panorama —</option>
        ${panoOptions}
      </select>
      <div class="form-hint">${panos.length} panorama có sẵn trong thư mục data/media.</div>
    </div>
    <div id="nc-pano-preview" style="margin:-4px 0 12px;border-radius:6px;overflow:hidden;display:none">
      <img id="nc-pano-thumb" style="width:100%;height:120px;object-fit:cover;display:block" alt="">
    </div>
    <div class="form-group">
      <label class="form-label">ID định danh (tùy chọn)</label>
      <input class="form-control mono" id="nc-id" placeholder="vd: be-boi-tang-8">
    </div>
    <div class="form-group">
      <label class="form-label">ID Hotspot 3DVista (tùy chọn)</label>
      <input class="form-control mono" id="nc-hotspot" placeholder="vd: hs-be-boi">
      <div class="form-hint">Khi người dùng click hotspot này trên VR360, mục tương ứng ở Danh Sách VR sẽ tự động được chọn.</div>
    </div>
    ${panos.length === 0 ? `<div class="badge badge-warning" style="padding:8px;width:100%;justify-content:center">${ico('warning')} Không tìm thấy panorama nào trong data/locale/en.txt</div>` : ''}
  `, () => {
    const label  = document.getElementById('nc-label').value.trim();
    const panoId = document.getElementById('nc-pano').value;
    const hotspot = document.getElementById('nc-hotspot').value.trim();
    const idVal  = document.getElementById('nc-id').value.trim() || label.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'') || 'item-'+Date.now();
    if (!label) { toast('Nhập tên hiển thị', 'warn'); return; }
    const newItem = { id: idVal, label, tdvPanoramaId: panoId || undefined, hotspotId: hotspot || undefined };
    // Phân khu mới cần khung children rỗng
    if (groupKey === 'phanKhu') {
      newItem.children = {};
      Object.keys(CHILD_GROUP_META).forEach(ck => { newItem.children[ck] = []; });
    }
    npGroupArr(groupKey, subId).push(newItem);
    if (subId) markSubDirty('navpanel');
    closePanel();
    render('navpanel', document.getElementById('p-navpanel'));
    toast('Đã thêm điểm VR360', 'ok');
  });
}

function previewPano(prefix) {
  const sel = document.getElementById(prefix + '-pano');
  const preview = document.getElementById(prefix + '-pano-preview');
  const thumb = document.getElementById(prefix + '-pano-thumb');
  if (!sel || !preview || !thumb) return;
  const panoName = sel.value;
  if (!panoName || !_panoramaCache) { preview.style.display = 'none'; return; }
  const p = _panoramaCache.find(x => x.name === panoName);
  if (p) {
    thumb.src = p.thumbnail;
    thumb.alt = p.name;
    preview.style.display = '';
  } else {
    preview.style.display = 'none';
  }
}

async function openEditCardPanel(groupKey, itemId, subId) {
  const group = npGroupArr(groupKey, subId);
  const item  = group.find(x=>x.id===itemId); if (!item) return;
  const panos = await fetchPanoramas();
  const panoOptions = panos.map(p =>
    `<option value="${p.name}" ${item.tdvPanoramaId===p.name?'selected':''}>${p.name}</option>`
  ).join('');
  showPanel('Sửa Điểm VR360', `
    <div class="form-group">
      <label class="form-label">Nhãn hiển thị <span class="req">*</span></label>
      <input class="form-control" id="ec-label" value="${item.label}">
    </div>
    <div class="form-group">
      <label class="form-label">Chọn Panorama 3DVista</label>
      <select class="form-control form-select" id="ec-pano" onchange="previewPano('ec')">
        <option value="">— Không gắn panorama —</option>
        ${panoOptions}
      </select>
      <div class="form-hint">${panos.length} panorama có sẵn. Chọn để xem preview bên dưới.</div>
    </div>
    <div id="ec-pano-preview" style="margin:-4px 0 12px;border-radius:6px;overflow:hidden;${item.tdvPanoramaId ? '' : 'display:none'}">
      <img id="ec-pano-thumb" style="width:100%;height:120px;object-fit:cover;display:block"
           src="${item.tdvPanoramaId && _panoramaCache ? (_panoramaCache.find(p=>p.name===item.tdvPanoramaId)?.thumbnail||'') : ''}" alt="${item.tdvPanoramaId||''}">
    </div>
    <div class="form-group">
      <label class="form-label">ID định danh</label>
      <input class="form-control mono" id="ec-id" value="${item.id}" readonly style="opacity:.6">
    </div>
    <div class="form-group">
      <label class="form-label">ID Hotspot 3DVista (tùy chọn)</label>
      <input class="form-control mono" id="ec-hotspot" value="${item.hotspotId||''}" placeholder="vd: hs-be-boi">
      <div class="form-hint">Khi click hotspot này trên VR360, mục này sẽ tự động được chọn ở Danh Sách VR.</div>
    </div>
    ${groupKey === 'phanKhu' ? `
    <div class="form-group" style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--surface2)">
      <label class="form-label" style="font-weight:700">Media phân khu (hiển thị ở project-card)</label>
      <div class="form-hint" style="margin-bottom:10px">Ảnh bìa & video giới thiệu — tải lên hoặc dán link.</div>
      <label class="form-label">Ảnh / Video bìa (cover)</label>
      <div style="display:flex;gap:8px;margin-bottom:6px">
        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('ec-cover-file').click()">${ico('upload',12)} Tải ảnh / video lên</button>
        <input type="file" id="ec-cover-file" accept="image/*,video/*" style="display:none" onchange="subdivPickCover(this)">
      </div>
      <input class="form-control" id="ec-sub-cover" value="${esc((item.subdivision&&item.subdivision.cover)||'')}" placeholder="https://... hoặc img/...">
      ${(() => {
        const cv = (item.subdivision&&item.subdivision.cover)||'';
        if (!cv) return `<img id="ec-cover-preview" src="" style="display:none;width:100%;max-height:140px;object-fit:cover;border-radius:6px;margin-top:8px" alt="">`;
        const src = /^(data:|https?:)/.test(cv) ? cv : '../' + cv;
        const isVid = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(cv) || /^data:video\//.test(cv);
        return isVid
          ? `<video id="ec-cover-preview" src="${esc(src)}" controls style="width:100%;max-height:140px;object-fit:cover;border-radius:6px;margin-top:8px"></video>`
          : `<img id="ec-cover-preview" src="${esc(src)}" style="width:100%;max-height:140px;object-fit:cover;border-radius:6px;margin-top:8px" alt="">`;
      })()}
      <label class="form-label" style="margin-top:12px">Link video giới thiệu</label>
      <input class="form-control" id="ec-sub-video" value="${esc((item.subdivision&&item.subdivision.video)||'')}" placeholder="https://youtube.com/... hoặc link mp4">
      <div class="form-hint">Hỗ trợ YouTube, Vimeo hoặc link video trực tiếp.</div>
    </div>
    <div class="form-group" id="ec-sub-fields">
      <label class="form-label">Tên phân khu</label>
      <input class="form-control" id="ec-sub-name" value="${esc((item.subdivision&&item.subdivision.name)||item.label||'')}" placeholder="VD: Phân khu Bạch Vân">

      <label class="form-label" style="margin-top:12px">Mô tả</label>
      <textarea class="form-control" id="ec-sub-desc" rows="3" placeholder="Giới thiệu phân khu...">${esc((item.subdivision&&item.subdivision.desc)||'')}</textarea>

      <label class="form-label" style="margin-top:12px">Thông tin tổng quan</label>
      <div class="form-hint" style="margin-bottom:6px">Mỗi dòng một mục, dạng <b>Nhãn | Giá trị</b>. VD: Quy mô | ~ 320 ha</div>
      <textarea class="form-control" id="ec-sub-facts" rows="5" placeholder="Quy mô | ~ 320 ha&#10;Định hướng | Logistics & cảng biển">${esc(((item.subdivision&&item.subdivision.facts)||[]).map(f=>`${f.label||''} | ${f.value||''}`).join('\n'))}</textarea>

      <label class="form-label" style="margin-top:12px">Điểm nhấn nổi bật</label>
      <div class="form-hint" style="margin-bottom:6px">Mỗi dòng một ý.</div>
      <textarea class="form-control" id="ec-sub-points" rows="5" placeholder="Trung tâm logistics quốc tế&#10;Cảng Liên Chiểu chiến lược">${esc(((item.subdivision&&item.subdivision.points)||[]).join('\n'))}</textarea>
    </div>` : ''}
    ${groupKey !== 'phanKhu' ? `
    <div class="form-group" id="ec-detail-fields" style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--surface2)">
      <label class="form-label" style="font-weight:700">Chi tiết điểm đến (tùy chọn)</label>
      <div class="form-hint" style="margin-bottom:10px">Điền để project-card hiện chế độ chi tiết. Bỏ trống tất cả → chế độ tổng quan.</div>

      <label class="form-label">Tiêu đề</label>
      <input class="form-control" id="ec-dt-title" value="${esc((item.detail&&item.detail.title)||'')}" placeholder="VD: Bệnh viện Quốc tế Vinmec">

      <div style="display:flex;gap:10px">
        <div style="flex:1"><label class="form-label" style="margin-top:10px">Nhãn phụ</label>
          <input class="form-control" id="ec-dt-subtitle" value="${esc((item.detail&&item.detail.subtitle)||'')}" placeholder="VD: Bệnh viện"></div>
        <div style="flex:1"><label class="form-label" style="margin-top:10px">Danh mục</label>
          <input class="form-control" id="ec-dt-category" value="${esc((item.detail&&item.detail.category)||'')}" placeholder="VD: Hạ tầng trọng điểm"></div>
      </div>

      <label class="form-label" style="margin-top:10px">Mô tả</label>
      <textarea class="form-control" id="ec-dt-desc" rows="3" placeholder="Mô tả điểm đến...">${esc((item.detail&&item.detail.description)||'')}</textarea>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
        <label class="form-label" style="margin:0">Ảnh</label>
        <div style="display:flex;gap:6px">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('ec-dt-img-file').click()">${ico('upload',12)} Tải lên</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="ecMediaAddLink()">${ico('globe',12)} Dán link</button>
          <input type="file" id="ec-dt-img-file" accept="image/*" multiple style="display:none" onchange="ecMediaUpload(this)">
        </div>
      </div>
      <div id="ec-dt-images-grid" style="margin-top:6px">${ecMediaGridHTML((item.detail&&item.detail.images)||[])}</div>

      <label class="form-label" style="margin-top:10px">Thông số nổi bật</label>
      <div class="form-hint" style="margin-bottom:6px">Mỗi dòng dạng <b>Nhãn | Giá trị</b>. VD: Quy mô | 12 ha</div>
      <textarea class="form-control" id="ec-dt-specs" rows="5" placeholder="Quy mô | 12 ha&#10;Khoảng cách | 1.2 km">${esc(((item.detail&&item.detail.specs)||[]).map(s=>`${s.label||''} | ${s.value||''}`).join('\n'))}</textarea>
    </div>` : ''}
  `, () => {
    const idx = group.findIndex(x=>x.id===itemId);
    if (idx < 0) return;
    const label  = document.getElementById('ec-label').value.trim() || item.label;
    const panoId = document.getElementById('ec-pano').value;
    const hotspot = document.getElementById('ec-hotspot').value.trim();
    const next = { ...item, label, tdvPanoramaId: panoId || undefined, hotspotId: hotspot || undefined };
    // Subdivision (cat Phân Khu) — đọc từ các ô nhập có cấu trúc
    const subFields = document.getElementById('ec-sub-fields');
    if (subFields) {
      const gv = (id) => (document.getElementById(id)?.value || '').trim();
      // facts: mỗi dòng "Nhãn | Giá trị"
      const facts = gv('ec-sub-facts').split('\n')
        .map(line => {
          const i = line.indexOf('|');
          if (i < 0) return line.trim() ? { label: line.trim(), value: '' } : null;
          return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
        })
        .filter(Boolean);
      const points = gv('ec-sub-points').split('\n')
        .map(s => s.trim()).filter(Boolean);
      const cover = gv('ec-sub-cover');
      const video = gv('ec-sub-video');
      const sub = { ...(item.subdivision || {}) };
      sub.name = gv('ec-sub-name');
      sub.desc = gv('ec-sub-desc');
      sub.facts = facts;
      sub.points = points;
      if (cover) sub.cover = cover; else delete sub.cover;
      if (video) sub.video = video; else delete sub.video;
      // Bỏ field rỗng để dữ liệu gọn
      Object.keys(sub).forEach(k => {
        if (sub[k] === '' || (Array.isArray(sub[k]) && !sub[k].length)) delete sub[k];
      });
      next.subdivision = Object.keys(sub).length ? sub : undefined;
    }
    // Detail — đọc từ các ô nhập có cấu trúc
    const detFields = document.getElementById('ec-detail-fields');
    if (detFields) {
      const gv = (id) => (document.getElementById(id)?.value || '').trim();
      const specs = gv('ec-dt-specs').split('\n')
        .map(line => {
          const i = line.indexOf('|');
          if (!line.trim()) return null;
          if (i < 0) return { label: line.trim(), value: '' };
          return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
        })
        .filter(Boolean);
      const det = {
        title: gv('ec-dt-title'),
        subtitle: gv('ec-dt-subtitle'),
        category: gv('ec-dt-category'),
        description: gv('ec-dt-desc'),
        images: (window.__ecImages || []).slice(),
        specs: specs,
      };
      Object.keys(det).forEach(k => {
        if (det[k] === '' || (Array.isArray(det[k]) && !det[k].length)) delete det[k];
      });
      next.detail = Object.keys(det).length ? det : undefined;
    }
    group[idx] = next;
    // Clean up old sceneId/customLink fields
    delete group[idx].sceneId;
    delete group[idx].customLink;
    if (subId) markSubDirty('navpanel');
    saveData('Đã cập nhật điểm VR360');
    closePanel();
    render('navpanel', document.getElementById('p-navpanel'));
  });
}

/* ── Media grid cho ảnh "Chi tiết điểm đến" trong form sửa card VR ──
   Lưu vào mảng tạm window.__ecImages; đọc lại khi lưu form. */
function ecResolveImg(src) {
  if (!src) return '';
  if (/^(data:|https?:|\/\/)/.test(src)) return src;
  return '../' + src;
}
function ecMediaGridHTML(arr) {
  window.__ecImages = (arr || []).slice();
  return ecMediaRender();
}
function ecMediaRender() {
  const arr = window.__ecImages || [];
  if (!arr.length) {
    return `<div style="padding:16px;text-align:center;color:var(--muted);font-size:12px;border:1px dashed var(--border);border-radius:8px">Chưa có ảnh.</div>`;
  }
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">
    ${arr.map((src, i) => `
      <div style="position:relative;border:1px solid var(--border);border-radius:8px;overflow:hidden;aspect-ratio:4/3;background:#0b1220">
        <img src="${esc(ecResolveImg(src))}" style="width:100%;height:100%;object-fit:cover" alt="" onerror="this.style.opacity=.2">
        <button type="button" class="act-btn danger" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.6)"
                onclick="ecMediaRemove(${i})">${ico('trash',12)}</button>
      </div>`).join('')}
  </div>`;
}
function ecMediaRefresh() {
  const host = document.getElementById('ec-dt-images-grid');
  if (host) host.innerHTML = ecMediaRender();
}
async function ecMediaUpload(input) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  window.__ecImages = window.__ecImages || [];
  toast(`Đang tải ${files.length} ảnh lên R2...`, 'info');
  let ok = 0, fail = 0;
  for (const f of files) {
    if (!f.type.startsWith('image/')) { fail++; continue; }
    try {
      const url = await uploadImageToR2(f, { folder: 'detail' });
      window.__ecImages.push(url);
      ok++;
      ecMediaRefresh();
    } catch (err) {
      console.error(err);
      fail++;
    }
  }
  input.value = '';
  toast(`Đã tải ${ok}/${files.length} ảnh${fail ? ` (lỗi ${fail})` : ''}`, fail ? 'warn' : 'ok');
}
function ecMediaAddLink() {
  showPanel('Dán link ảnh', `
    <div class="form-group">
      <label class="form-label">URL ảnh *</label>
      <input class="form-control" id="ecm-url" placeholder="https://... hoặc img/...">
    </div>`, () => {
    const url = document.getElementById('ecm-url').value.trim();
    if (!url) { toast('Nhập URL', 'warn'); return false; }
    window.__ecImages = window.__ecImages || [];
    window.__ecImages.push(url);
    ecMediaRefresh();
    closePanel();
  });
}
function ecMediaRemove(i) {
  if (window.__ecImages) { window.__ecImages.splice(i, 1); ecMediaRefresh(); }
}

/* Upload ảnh/video bìa phân khu — push lên R2, lưu public URL + preview.
   Tự đổi thẻ <img> ↔ <video> theo loại file. */
async function subdivPickCover(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const isVideo = (file.type || '').startsWith('video/');
  const isImage = (file.type || '').startsWith('image/');
  if (!isImage && !isVideo) { toast('File không phải ảnh hoặc video', 'err'); return; }
  const inp = document.getElementById('ec-sub-cover');
  let preview = document.getElementById('ec-cover-preview');
  // Đổi thẻ preview nếu lệch loại
  if (preview) {
    const wantTag = isVideo ? 'VIDEO' : 'IMG';
    if (preview.tagName !== wantTag) {
      const parent = preview.parentNode;
      const next = document.createElement(isVideo ? 'video' : 'img');
      next.id = 'ec-cover-preview';
      next.style.cssText = preview.style.cssText;
      if (isVideo) next.controls = true; else next.alt = '';
      parent.replaceChild(next, preview);
      preview = next;
    }
  }
  const localPreview = URL.createObjectURL(file);
  if (preview) { preview.src = localPreview; preview.style.display = ''; preview.style.opacity = .55; }
  try {
    const url = await uploadImageToR2(file, { folder: 'subdivision-cover' });
    URL.revokeObjectURL(localPreview);
    if (inp) inp.value = url;
    if (preview) { preview.src = url; preview.style.opacity = 1; }
    toast(isVideo ? 'Đã tải video bìa' : 'Đã tải ảnh bìa', 'ok');
  } catch (err) {
    URL.revokeObjectURL(localPreview);
    console.error(err);
    toast('Upload thất bại: ' + err.message, 'err');
    if (preview) { preview.style.display = 'none'; preview.style.opacity = 1; }
    input.value = '';
  }
}

function deleteNpCard(groupKey, itemId, subId) {
  confirmDel('Xoá điểm VR360 này?', 'Hành động không thể hoàn tác.', () => {
    const arr = npGroupArr(groupKey, subId);
    const i = arr.findIndex(x => x.id === itemId);
    if (i >= 0) arr.splice(i, 1);
    if (subId) markSubDirty('navpanel');
    else saveData('Đã xoá điểm');
    render('navpanel', document.getElementById('p-navpanel'));
    toast('Đã xoá điểm', 'ok');
  });
}

// ——— DRAG & DROP (np-list) ————————————————————
function initNpDrag() {
  // Group drag
  document.querySelectorAll('.np-group').forEach(group => {
    group.addEventListener('dragstart', e => {
      if (!e.target.classList.contains('np-group')) return;
      S.dragSrc = group;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', group.dataset.group);
      setTimeout(() => group.style.opacity = '.4', 0);
    });
    group.addEventListener('dragend', () => { group.style.opacity = ''; });
    group.addEventListener('dragover', e => {
      e.preventDefault();
      if (S.dragSrc && S.dragSrc !== group && S.dragSrc.classList.contains('np-group')) {
        group.classList.add('drag-over');
      }
    });
    group.addEventListener('dragleave', () => group.classList.remove('drag-over'));
    group.addEventListener('drop', e => {
      e.preventDefault(); e.stopPropagation();
      group.classList.remove('drag-over');
      if (!S.dragSrc || S.dragSrc === group || !S.dragSrc.classList.contains('np-group')) return;
      const list = document.getElementById('np-list');
      const groups = [...list.querySelectorAll('.np-group')];
      const fromIdx = groups.indexOf(S.dragSrc);
      const toIdx   = groups.indexOf(group);
      if (fromIdx < toIdx) list.insertBefore(S.dragSrc, group.nextSibling);
      else                 list.insertBefore(S.dragSrc, group);
      toast('Đã sắp xếp lại nhóm', 'ok');
    });
  });

  // Card drag within groups
  document.querySelectorAll('.np-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      S.dragSrc = card;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.id);
      e.stopPropagation();
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', e => {
      e.preventDefault(); e.stopPropagation();
      if (S.dragSrc && S.dragSrc !== card && S.dragSrc.classList.contains('np-card')) {
        document.querySelectorAll('.np-card').forEach(c => c.classList.remove('drag-over-card'));
        card.classList.add('drag-over-card');
      }
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over-card'));
    card.addEventListener('drop', e => {
      e.preventDefault(); e.stopPropagation();
      card.classList.remove('drag-over-card');
      if (!S.dragSrc || S.dragSrc === card || !S.dragSrc.classList.contains('np-card')) return;
      const container = card.parentElement;
      const cards = [...container.querySelectorAll('.np-card')];
      const fromIdx = cards.indexOf(S.dragSrc);
      const toIdx   = cards.indexOf(card);
      if (fromIdx < toIdx) container.insertBefore(S.dragSrc, card.nextSibling);
      else                 container.insertBefore(S.dragSrc, card);
      // Sync to data — nhóm gốc hoặc nhóm con của phân khu
      const gKey = container.dataset.group;
      const sKey = container.dataset.sub || null;
      const arr = gKey ? npGroupArr(gKey, sKey) : null;
      if (arr) {
        const newOrder = [...container.querySelectorAll('.np-card')].map(c=>c.dataset.id);
        arr.sort((a,b)=>newOrder.indexOf(a.id)-newOrder.indexOf(b.id));
        if (sKey) markSubDirty('navpanel');
      }
      toast('Đã sắp xếp lại điểm', 'ok');
    });
  });
}

// ——— PANORAMA BROWSER ——————————————————————————————————
function renderScenes(el) {
  const panos = _panoramaCache || [];
  // Collect which panoramas are currently assigned to menu items
  // (duyệt cả nhóm gốc lẫn nhóm con của từng phân khu)
  const assigned = new Map();
  const noteItem = (item) => {
    if (item && item.tdvPanoramaId) {
      if (!assigned.has(item.tdvPanoramaId)) assigned.set(item.tdvPanoramaId, []);
      assigned.get(item.tdvPanoramaId).push(item.label);
    }
  };
  for (const items of Object.values(S.data.menu || {})) {
    for (const item of (items || [])) {
      noteItem(item);
      if (item.children) {
        for (const childArr of Object.values(item.children)) {
          for (const child of (childArr || [])) noteItem(child);
        }
      }
    }
  }
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Panorama 3DVista</div><h1>Thư Viện Panorama (${panos.length})</h1></div>
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm" onclick="go('navpanel')">${ico('navpanel')} Quản lý Nav Panel</button>
        <button class="btn btn-secondary btn-sm" onclick="_panoramaCache=null;fetchPanoramas().then(()=>render('scenes',document.getElementById('p-scenes')))">${ico('refresh')} Tải lại</button>
      </div>
    </div>
    ${panos.length === 0 ? `<div class="card"><div class="card-body"><div class="empty"><div class="empty-icon">${ico('video',40)}</div><p>Không tìm thấy panorama. Kiểm tra data/locale/en.txt</p></div></div></div>` : ''}
    <div class="scene-grid">
      ${panos.map(p => {
        const users = assigned.get(p.name) || [];
        return `
          <div class="scene-card">
            <div class="scene-thumb" style="position:relative;overflow:hidden">
              <img src="${p.thumbnail}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">
              <div class="scene-thumb-icon" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.3);opacity:.6">${ico('video',28)}</div>
            </div>
            <div class="scene-info">
              <div class="scene-name">${p.name}</div>
              <div class="scene-meta" style="font-size:11px;color:var(--muted)">
                ${users.length ? `Gán cho: ${users.join(', ')}` : '<span style="color:var(--warning)">Chưa gán cho menu nào</span>'}
              </div>
              <div class="scene-meta mono" style="font-size:9px;color:var(--muted);margin-top:2px;word-break:break-all">${p.hexId}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ——— i18n ————————————————————————————————————
// Dữ liệu THẬT từ backend: GET /api/i18n/admin
//   I18N.langs = [{code,name,is_default}]
//   I18N.rows  = [{namespace,key,default_text,translations:{vi,en,...}}]
const I18N = { langs: [], rows: [], loaded: false, loading: false, error: null };

// Tên hiển thị gợi ý cho mã ngôn ngữ phổ biến (khi thêm mới)
const I18N_LANG_NAMES = {
  vi:'Tiếng Việt', en:'English', zh:'中文', ko:'한국어', ja:'日本語',
  fr:'Français', de:'Deutsch', es:'Español', ru:'Русский', th:'ไทย',
};

async function loadI18n() {
  I18N.loading = true; I18N.error = null;
  try {
    const r = await fetch(API_BASE + '/api/i18n/admin', { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    I18N.langs = data.langs || [];
    I18N.rows  = data.rows || [];
    I18N.loaded = true;
  } catch (e) {
    I18N.error = e.message;
  } finally {
    I18N.loading = false;
  }
}

// Lưu 1 ô bản dịch lên CSDL
async function saveI18nEntry(namespace, key, lang, text) {
  try {
    const r = await fetch(API_BASE + '/api/i18n/entry', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace, key, lang, text }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const row = I18N.rows.find(x => x.namespace === namespace && x.key === key);
    if (row) row.translations[lang] = text;
    toast('Đã lưu', 'ok');
  } catch (e) {
    toast('Lưu thất bại: ' + e.message, 'err');
  }
}

function addI18nLang() {
  const existing = I18N.langs.map(l => l.code);
  const choices = Object.keys(I18N_LANG_NAMES).filter(c => !existing.includes(c));
  const opts = choices.map(c => `<option value="${c}">${c.toUpperCase()} — ${I18N_LANG_NAMES[c]}</option>`).join('');
  showPanel('Thêm Ngôn Ngữ Mới', `
    <div class="form-group">
      <label class="form-label">Chọn ngôn ngữ có sẵn</label>
      <select class="form-control" id="il-pick">
        <option value="">— Chọn —</option>
        ${opts}
      </select>
    </div>
    <div style="text-align:center;color:var(--muted);font-size:12px;margin:8px 0">— hoặc —</div>
    <div class="form-group">
      <label class="form-label">Mã ngôn ngữ tuỳ chỉnh (2-3 ký tự)</label>
      <input class="form-control" id="il-code" placeholder="VD: it, pt, ar" maxlength="3">
    </div>
    <div class="form-group">
      <label class="form-label">Tên hiển thị (tuỳ chọn)</label>
      <input class="form-control" id="il-name" placeholder="VD: Italiano">
    </div>
  `, async () => {
    const pick = document.getElementById('il-pick').value;
    const code = (document.getElementById('il-code').value || '').trim().toLowerCase();
    const name = document.getElementById('il-name').value.trim();
    const lang = (pick || code).toLowerCase();
    if (!lang) { toast('Chọn hoặc nhập mã ngôn ngữ', 'warn'); return; }
    if (I18N.langs.some(l => l.code === lang)) { toast('Ngôn ngữ đã tồn tại', 'warn'); return; }
    try {
      const r = await fetch(API_BASE + '/api/i18n/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: lang, name: name || I18N_LANG_NAMES[lang] || lang }),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      closePanel();
      await loadI18n();
      S.i18nLang = lang;
      render('i18n', document.getElementById('p-i18n'));
      toast(`Đã thêm ngôn ngữ ${lang.toUpperCase()}`, 'ok');
    } catch (e) {
      toast('Thêm thất bại: ' + e.message, 'err');
    }
  });
}

function removeI18nLang(lang) {
  const l = I18N.langs.find(x => x.code === lang);
  if (l && l.is_default) { toast('Không thể xoá ngôn ngữ gốc', 'warn'); return; }
  confirmDel(`Xoá ngôn ngữ ${lang.toUpperCase()}?`, 'Toàn bộ bản dịch của ngôn ngữ này sẽ bị xoá.', async () => {
    try {
      const r = await fetch(API_BASE + '/api/i18n/language/' + lang, { method: 'DELETE' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      await loadI18n();
      if (S.i18nLang === lang) S.i18nLang = 'vi';
      render('i18n', document.getElementById('p-i18n'));
      toast(`Đã xoá ngôn ngữ ${lang.toUpperCase()}`, 'ok');
    } catch (e) {
      toast('Xoá thất bại: ' + e.message, 'err');
    }
  });
}

function renderI18n(el) {
  // Lần đầu vào trang: nạp dữ liệu rồi render lại
  if (!I18N.loaded && !I18N.loading) {
    el.innerHTML = `<div class="ph"><div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Ngôn Ngữ</div><h1>Quản Lý Ngôn Ngữ & i18n</h1></div></div>
      <div class="card"><div style="padding:40px;text-align:center;color:var(--muted)">Đang tải dữ liệu từ máy chủ…</div></div>`;
    loadI18n().then(() => render('i18n', el));
    return;
  }
  if (I18N.error) {
    el.innerHTML = `<div class="ph"><div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Ngôn Ngữ</div><h1>Quản Lý Ngôn Ngữ & i18n</h1></div></div>
      <div class="card"><div style="padding:40px;text-align:center;color:var(--danger,#e66)">
        Không tải được dữ liệu i18n: ${I18N.error}<br><br>
        <button class="btn btn-secondary btn-sm" onclick="I18N.loaded=false;I18N.error=null;render('i18n',document.getElementById('p-i18n'))">Thử lại</button>
        <div style="margin-top:10px;font-size:12px">Hãy chắc máy chủ API đang chạy (npm start trong thư mục server).</div>
      </div></div>`;
    return;
  }

  const langs = I18N.langs;
  const defCode = (langs.find(l => l.is_default) || langs[0] || { code: 'vi' }).code;
  if (!S.i18nLang || !langs.some(l => l.code === S.i18nLang)) S.i18nLang = defCode;
  const lang = S.i18nLang;

  // Danh sách namespace có trong dữ liệu (cho dropdown lọc)
  const namespaces = [...new Set(I18N.rows.map(r => r.namespace))].sort();
  const total = I18N.rows.length;
  const shown = filteredI18nRows().length;

  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Ngôn Ngữ</div><h1>Quản Lý Ngôn Ngữ & i18n</h1></div>
      <div class="btn-group">
        <button class="btn btn-primary btn-sm" onclick="addI18nLang()">+ Thêm ngôn ngữ mới</button>
        <button class="btn btn-secondary btn-sm" onclick="I18N.loaded=false;render('i18n',document.getElementById('p-i18n'))">${ico('refresh',14)} Tải lại</button>
      </div>
    </div>
    <div class="tabs">
      ${langs.map(l => `
        <div class="tab ${lang===l.code?'active':''}" onclick="S.i18nLang='${l.code}';render('i18n',document.getElementById('p-i18n'))" title="${esc(l.name)}">
          ${l.code.toUpperCase()}${!l.is_default ? ` <span style="margin-left:6px;opacity:.55;cursor:pointer" onclick="event.stopPropagation();removeI18nLang('${l.code}')" title="Xoá">×</span>` : ''}
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="filter-bar">
        <input class="fi" style="min-width:240px" placeholder="Tìm theo key hoặc nội dung…"
               value="${esc(I18NF.search)}" oninput="I18NF.search=this.value;reloadI18nTbody()">
        <select class="fi fi-select" onchange="I18NF.namespace=this.value;reloadI18nTbody()">
          <option value="">Tất cả namespace</option>
          ${namespaces.map(ns => `<option value="${esc(ns)}" ${I18NF.namespace===ns?'selected':''}>${esc(ns)}</option>`).join('')}
        </select>
        <select class="fi fi-select" onchange="I18NF.status=this.value;reloadI18nTbody()">
          <option value="">Tất cả trạng thái</option>
          <option value="translated" ${I18NF.status==='translated'?'selected':''}>Đã dịch</option>
          <option value="missing" ${I18NF.status==='missing'?'selected':''}>Thiếu bản dịch</option>
        </select>
        <div class="filter-spacer"></div>
        <span class="c-muted" style="font-size:12px" id="i18n-count">${shown} / ${total} key</span>
      </div>
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr><th>Key</th><th>Namespace</th><th>${defCode.toUpperCase()} (gốc)</th><th>${lang.toUpperCase()} (dịch)</th><th>Trạng thái</th></tr></thead>
          <tbody id="i18n-body">${i18nRowsHTML()}</tbody>
        </table>
      </div>
    </div>
  `;
}

// Bộ lọc trang i18n: tìm kiếm + namespace + trạng thái dịch
const I18NF = { search: '', namespace: '', status: '' };

// Lọc I18N.rows theo I18NF cho ngôn ngữ đang xem
function filteredI18nRows() {
  const langs = I18N.langs;
  const defCode = (langs.find(l => l.is_default) || langs[0] || { code: 'vi' }).code;
  const lang = S.i18nLang;
  const q = I18NF.search.trim().toLowerCase();
  return I18N.rows.filter(row => {
    if (I18NF.namespace && row.namespace !== I18NF.namespace) return false;
    if (I18NF.status) {
      const has = !!(row.translations[lang] && String(row.translations[lang]).trim());
      // Ngôn ngữ gốc luôn coi như "đã dịch"
      const translated = lang === defCode ? true : has;
      if (I18NF.status === 'translated' && !translated) return false;
      if (I18NF.status === 'missing' && translated) return false;
    }
    if (q) {
      const orig = (row.translations[defCode] ?? row.default_text ?? '').toLowerCase();
      const trans = (row.translations[lang] ?? '').toLowerCase();
      if (!row.key.toLowerCase().includes(q) && !orig.includes(q) && !trans.includes(q)) return false;
    }
    return true;
  });
}

// Dựng HTML các dòng bảng i18n (theo bộ lọc hiện tại)
function i18nRowsHTML() {
  const langs = I18N.langs;
  const defCode = (langs.find(l => l.is_default) || langs[0] || { code: 'vi' }).code;
  const lang = S.i18nLang;
  const isDef = lang === defCode;
  const rows = filteredI18nRows();
  if (rows.length === 0) {
    return `<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--muted)">Không có key nào khớp bộ lọc.</td></tr>`;
  }
  return rows.map(row => {
    const orig  = row.translations[defCode] ?? row.default_text ?? '';
    const trans = row.translations[lang] ?? '';
    const status = isDef ? '<span class="badge badge-ok">Gốc</span>' :
      !trans      ? `<span class="badge badge-warning">${ico('warning',12)} Thiếu</span>` :
                    '<span class="badge badge-ok">OK</span>';
    const keyAttr = encodeURIComponent(row.key);
    return `<tr>
      <td class="mono" style="font-size:12px">${esc(row.key)}</td>
      <td><span class="badge badge-muted">${esc(row.namespace)}</span></td>
      <td class="c-muted">${esc(orig)}</td>
      <td ${!isDef?`contenteditable="true" data-ns="${esc(row.namespace)}" data-key="${keyAttr}"
          onblur="saveI18nEntry(this.dataset.ns,decodeURIComponent(this.dataset.key),'${lang}',this.textContent.trim())"`:''}
          style="${!isDef?'min-width:160px;cursor:text':''}">${esc(isDef?orig:trans)}</td>
      <td>${status}</td>
    </tr>`;
  }).join('');
}

// Vẽ lại chỉ phần tbody khi gõ tìm kiếm / đổi bộ lọc (không render cả trang)
function reloadI18nTbody() {
  const body = document.getElementById('i18n-body');
  const count = document.getElementById('i18n-count');
  if (body) body.innerHTML = i18nRowsHTML();
  if (count) count.textContent = filteredI18nRows().length + ' / ' + I18N.rows.length + ' key';
}

// ——— THEME ———————————————————————————————————
const THEME_COLORS = [
  ['bg','Màu nền trang','--bg','#0a0d12'],
  ['fg','Màu chữ chính','--fg','#f5f1e8'],
  ['accent','Màu accent / Gold','--accent','#e8c089'],
  ['ok','Màu thành công','--ok','#7ad79a'],
  ['danger','Màu nguy hiểm','--danger','#ff6b6b'],
  ['warning','Màu cảnh báo','--warning','#f5a623'],
  ['hotspot','Màu hotspot','--hotspot-color','#e8c089'],
  ['countdown','Màu đồng hồ','--countdown-color','#e8c089'],
  ['loader','Màu loader','--loader-accent','#e8c089'],
];
const PRESETS = [
  { name:'Aurora (Mặc định)', bg:'#0a0d12', accent:'#e8c089', fg:'#f5f1e8' },
  { name:'Midnight Blue',     bg:'#060b14', accent:'#4a9eff', fg:'#e8f0ff' },
  { name:'Forest Dark',       bg:'#0a130c', accent:'#7ad79a', fg:'#e8f5ea' },
  { name:'Rose Gold',         bg:'#120a0d', accent:'#f4b8c1', fg:'#faebed' },
  { name:'Ocean Deep',        bg:'#020f18', accent:'#5eeaff', fg:'#e8faff' },
];
let TC = { colors:{}, currentPreset:'Aurora (Mặc định)' };
THEME_COLORS.forEach(([k,,,def]) => TC.colors[k] = def);

function renderTheme(el) {
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Giao Diện</div><h1>Giao Diện & Theme</h1></div>
      <div class="btn-group">
        <span style="font-size:12px;color:var(--muted)" id="theme-save-state">${S.themeUnsaved?'Chưa lưu':'Đã lưu'}</span>
        <button class="btn btn-secondary btn-sm" onclick="resetTheme()">↺ Reset</button>
        <button class="btn btn-primary btn-sm" onclick="saveTheme()">${ico('save')} Lưu Theme</button>
      </div>
    </div>
    <div class="g2">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header"><span class="card-title">${ico('palette',16)} Bảng Màu CSS</span></div>
          <div class="card-body">
            ${THEME_COLORS.map(([k,name,cssVar]) => `
              <div class="color-row">
                <div class="color-swatch"><input type="color" value="${TC.colors[k]}" oninput="TC.colors['${k}']=this.value;document.getElementById('hex-${k}').textContent=this.value;S.themeUnsaved=true;document.getElementById('theme-save-state').textContent='● Chưa lưu'"></div>
                <span class="color-name" style="margin-left:10px">${name}</span>
                <span class="color-var">${cssVar}</span>
                <span class="color-hex" id="hex-${k}">${TC.colors[k]}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">${ico('settings',16)} Hiệu Ứng</span></div>
          <div class="card-body">
            ${[['backdropBlur','Blur backdrop panels',true],['hotspotPulse','Pulse animation hotspot',true],['vignetteVR','Vignette overlay VR',true],['autoRotate','Auto-rotate VR mặc định',false],['urgencyToast','Urgency toast',true],['countdown','Countdown timer',true]].map(([,label,def])=>`
              <div class="toggle-wrap">
                <div><div class="toggle-label">${label}</div></div>
                <label class="toggle">
                  <input type="checkbox" ${def?'checked':''} onchange="S.themeUnsaved=true">
                  <div class="toggle-track"></div>
                  <div class="toggle-thumb"></div>
                </label>
              </div>`).join('')}
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header"><span class="card-title">${ico('settings',16)} Preset Themes</span></div>
          <div class="card-body">
            <div class="preset-grid">
              ${PRESETS.map(p=>`
                <div class="preset-item ${TC.currentPreset===p.name?'active':''}" onclick="applyPreset('${p.name}')">
                  <div style="font-size:12px;font-weight:700">${p.name}</div>
                  <div class="preset-dots">
                    <div class="preset-dot" style="background:${p.bg}"></div>
                    <div class="preset-dot" style="background:${p.accent}"></div>
                    <div class="preset-dot" style="background:${p.fg}"></div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">${ico('eye',16)} Preview</span></div>
          <div class="card-body">
            <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Màu accent hiện tại:</div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
              <div id="prev-swatch" style="width:44px;height:44px;border-radius:8px;background:${TC.colors.accent};border:1px solid var(--border)"></div>
              <div><div id="prev-hex" class="mono fw7" style="font-size:16px">${TC.colors.accent}</div><div style="font-size:11px;color:var(--muted)">--accent</div></div>
            </div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Preview nút:</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
              <div id="prev-btn" style="padding:8px 16px;border-radius:6px;font-size:13px;font-weight:700;background:${TC.colors.accent};color:${TC.colors.bg}">Đặt lịch tư vấn</div>
              <div style="padding:8px 16px;border-radius:6px;font-size:13px;border:1px solid ${TC.colors.accent};color:${TC.colors.accent}">Xem giá</div>
            </div>
            <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Preview badge:</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <div style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${TC.colors.ok}22;color:${TC.colors.ok}">Còn hàng</div>
              <div style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${TC.colors.danger}22;color:${TC.colors.danger}">Đã bán</div>
              <div style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${TC.colors.warning}22;color:${TC.colors.warning}">Đang giữ</div>
            </div>
            <div style="margin-top:16px"><a href="../index.html" target="_blank" class="btn btn-secondary btn-sm" style="width:100%;justify-content:center">${ico('globe')} Mở trang VR thật</a></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">${ico('download',16)} Export Theme</span></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-secondary" onclick="exportThemeCSS()">Export CSS Variables</button>
            <button class="btn btn-secondary" onclick="exportThemeJSON()">Export JSON Config</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function applyPreset(name) {
  const p = PRESETS.find(x=>x.name===name); if (!p) return;
  TC.colors.bg = p.bg; TC.colors.accent = p.accent; TC.colors.fg = p.fg;
  TC.currentPreset = name; S.themeUnsaved = true;
  render('theme', document.getElementById('p-theme'));
  toast('Đã áp dụng preset: '+name, 'ok');
}

async function saveTheme() {
  const stateEl = document.getElementById('theme-save-state');
  if (stateEl) stateEl.textContent = 'Đang lưu…';
  try {
    const r = await fetch(API_BASE + '/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ colors: TC.colors, preset: TC.currentPreset }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    S.themeUnsaved = false;
    toast('Đã lưu theme vào CSDL', 'ok');
    if (stateEl) stateEl.textContent =
      'Đã lưu lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    toast('Lưu theme thất bại: ' + e.message + ' — kiểm tra server backend', 'err');
    if (stateEl) stateEl.textContent = '● Chưa lưu';
  }
}
function resetTheme() { confirmDel('Reset về theme mặc định?','Toàn bộ tùy chỉnh màu sẽ bị đặt lại.',()=>{ THEME_COLORS.forEach(([k,,,def])=>TC.colors[k]=def); TC.currentPreset='Aurora (Mặc định)'; render('theme',document.getElementById('p-theme')); toast('Đã reset theme','ok'); }); }

function exportThemeCSS() {
  const css = `:root {\n${THEME_COLORS.map(([k,_,cssVar])=>`  ${cssVar}: ${TC.colors[k]};`).join('\n')}\n}`;
  const blob = new Blob([css],{type:'text/css'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='aurora-theme.css'; a.click();
  toast('Đã xuất CSS', 'ok');
}
function exportThemeJSON() {
  const blob = new Blob([JSON.stringify({colors:TC.colors,preset:TC.currentPreset},null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='aurora-theme.json'; a.click();
  toast('Đã xuất JSON', 'ok');
}

// ——— ANALYTICS ———————————————————————————————
function renderAnalytics(el) {
  // Cần số liệu thật trước khi dựng phễu chuyển đổi (HTML) → nạp xong mới render
  if (!_analyticsCache) {
    el.innerHTML = `<div class="ph"><div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Analytics</div><h1>Analytics & Báo Cáo</h1></div></div>
      <div class="card"><div style="padding:40px;text-align:center;color:var(--muted)">Đang tải số liệu từ máy chủ…</div></div>`;
    loadAnalytics().then(() => render('analytics', el));
    return;
  }
  const a = _analyticsCache;
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Analytics</div><h1>Analytics & Báo Cáo</h1></div>
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm" onclick="loadAnalytics(true).then(()=>render('analytics',document.getElementById('p-analytics')))">${ico('refresh',14)} Tải lại</button>
      </div>
    </div>
    <div class="atab-row">
      ${[['views',`${ico('overview',14)} Lượt Xem`],['vr',`${ico('video',14)} VR Engagement`],['conv',`${ico('trending',14)} Chuyển Đổi`],['leads',`${ico('leads',14)} Leads`]].map(([id,label])=>`
        <div class="atab ${S.analyticsTab===id?'active':''}" onclick="S.analyticsTab='${id}';render('analytics',document.getElementById('p-analytics'))">${label}</div>`).join('')}
    </div>
    <div id="atab-content">${analyticsTabHTML(a)}</div>
  `;
  setTimeout(() => drawAnalyticsCharts(a), 30);
}

function analyticsTabHTML(a) {
  const t = S.analyticsTab;
  if (t==='views') return `
    <div class="g2">
      <div class="card"><div class="card-header"><span class="card-title">Lượt Xem Theo Ngày</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-daily"></canvas></div></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Thiết Bị</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-device"></canvas></div></div></div>
    </div>`;
  if (t==='vr') return `
    <div class="g2">
      <div class="card"><div class="card-header"><span class="card-title">Scene Xem Nhiều Nhất</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-scenes2"></canvas></div></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Tỷ Lệ Dùng Voice AI</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-ai"></canvas></div></div></div>
    </div>`;
  if (t==='conv') {
    const funnel = (a && a.funnel) || [];
    const base = funnel[0] ? funnel[0].value : 0;
    return `
    <div class="card" style="max-width:600px"><div class="card-header"><span class="card-title">Phễu Chuyển Đổi</span></div><div class="card-body">
      ${funnel.length === 0 ? '<div style="padding:20px;text-align:center;color:var(--muted)">Chưa có dữ liệu chuyển đổi.</div>' :
        funnel.map(f => {
          const p = base ? (f.value / base * 100) : 0;
          return `
        <div class="funnel-item">
          <div class="funnel-row"><span>${esc(f.stage)}</span><span class="fw6">${(f.value||0).toLocaleString('vi-VN')} (${p.toFixed(1)}%)</span></div>
          <div class="funnel-bar-bg"><div class="funnel-bar" style="width:${p}%"></div></div>
        </div>`;
        }).join('')}
    </div></div>`;
  }
  return `
    <div class="g2">
      <div class="card"><div class="card-header"><span class="card-title">Leads Theo Ngày</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-lday"></canvas></div></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Leads Theo Nguồn</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-lsrc"></canvas></div></div></div>
    </div>`;
}

// Vẽ các chart trang Analytics — toàn bộ số liệu thật từ /api/analytics
function drawAnalyticsCharts(a) {
  if (!window.Chart || !a) return;
  const xOpts = (label) => ({
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:label, labels:{ color:'#64748b', font:{size:11} } } },
    scales:{ x:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}}, y:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}} }
  });
  const donut = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{color:'#64748b',font:{size:11}} } } };
  const palette = ['#3b82f6','#10b981','#f59e0b','#06b6d4','#ef4444','#7c3aed','#22c55e','#94a3b8'];
  // nhãn ngày dạng dd/mm
  const dayLabel = (iso) => { const d = new Date(iso); return d.getDate()+'/'+(d.getMonth()+1); };

  if (document.getElementById('ac-daily')) {
    const d = a.daily || [];
    new Chart('ac-daily',{type:'line',data:{labels:d.map(x=>dayLabel(x.date)),datasets:[{label:'Sessions',data:d.map(x=>x.count),borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,.1)',tension:.4,fill:true}]},options:xOpts(false)});
  }
  if (document.getElementById('ac-device')) {
    const dv = a.devices || [];
    new Chart('ac-device',{type:'doughnut',data:{labels:dv.map(x=>x.device),datasets:[{data:dv.map(x=>x.count),backgroundColor:palette,borderWidth:0}]},options:donut});
  }
  if (document.getElementById('ac-scenes2')) {
    const sc = a.scenes || [];
    new Chart('ac-scenes2',{type:'bar',data:{labels:sc.map(x=>x.name),datasets:[{data:sc.map(x=>x.count),backgroundColor:'rgba(59,130,246,.6)',borderRadius:4}]},options:{indexAxis:'y',...xOpts(false)}});
  }
  if (document.getElementById('ac-ai')) {
    const v = a.voiceAI || { used:0, total:0 };
    const notUsed = Math.max(0, (v.total||0) - (v.used||0));
    new Chart('ac-ai',{type:'doughnut',data:{labels:['Dùng Voice AI','Không dùng'],datasets:[{data:[v.used||0,notUsed],backgroundColor:['#7c3aed','#e2e8f0'],borderWidth:0}]},options:donut});
  }
  if (document.getElementById('ac-lday')) {
    const ld = a.leadsDaily || [];
    new Chart('ac-lday',{type:'bar',data:{labels:ld.map(x=>dayLabel(x.date)),datasets:[{label:'Leads',data:ld.map(x=>x.count),backgroundColor:'rgba(16,185,129,.6)',borderRadius:4}]},options:xOpts(false)});
  }
  if (document.getElementById('ac-lsrc')) {
    const ls = a.leadsBySource || [];
    new Chart('ac-lsrc',{type:'doughnut',data:{labels:ls.map(x=>x.source),datasets:[{data:ls.map(x=>x.count),backgroundColor:palette,borderWidth:0}]},options:donut});
  }
}

// ——— SETTINGS ————————————————————————————————
/* ===== USER (Sales) MANAGEMENT ===== */
function userAdd() {
  userForm(null);
}
// Mở form sửa 1 user. id từ onclick là số; x.id từ API là chuỗi
// (Postgres BIGINT) — so sánh dạng chuỗi để khớp.
function userEdit(id) {
  const u = (S.users || []).find(x => String(x.id) === String(id));
  if (!u) return;
  userForm({ ...u });
}
function userDel(id) {
  const u = (S.users || []).find(x => String(x.id) === String(id));
  if (!u) return;
  confirmDel(
    `Xoá tài khoản <b>${esc(u.name||'')}</b> (${esc(u.username)})?`,
    'Hành động này không thể hoàn tác.',
    async () => {
      try {
        await authApi('DELETE', '/api/users/' + u.id);
        toast('Đã xoá tài khoản', 'ok');
        await loadUsers(true);
        render('settings', document.getElementById('p-settings'));
      } catch (e) { toast(e.message, 'err'); }
    }
  );
}

// Role mà người đang đăng nhập được phép cấp.
//   developer: cấp được mọi role.  owner: chỉ owner + sales.
function assignableRoles() {
  return authRole() === 'developer'
    ? [['developer','Developer'],['owner','Chủ đầu tư'],['sales','Sales']]
    : [['owner','Chủ đầu tư'],['sales','Sales']];
}

function userForm(u) {
  const isNew = !u;
  u = u || { username:'', name:'', title:'', phone:'', email:'', avatar:'', role:'sales', slug:'' };
  const roleOpts = assignableRoles()
    .map(([v,l]) => `<option value="${v}" ${u.role===v?'selected':''}>${l}</option>`)
    .join('');
  const body = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
      <div id="u-avatar-prev" style="width:64px;height:64px;border-radius:50%;background:var(--surface2);border:1px solid var(--border);overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--muted);font-weight:700;font-size:20px">
        ${u.avatar
          ? `<img src="${esc(u.avatar)}" style="width:100%;height:100%;object-fit:cover">`
          : esc((u.name||'?').trim().split(/\s+/).pop()[0] || '?')}
      </div>
      <div style="flex:1;min-width:0">
        <div class="fw6" style="font-size:15px">${isNew ? 'Thêm tài khoản' : esc(u.name||'')}</div>
        <div class="c-muted" style="font-size:12px">${isNew ? 'Tạo tài khoản đăng nhập mới' : 'Chỉnh sửa tài khoản · username không đổi được'}</div>
      </div>
    </div>

    <div class="form-section">Tài khoản</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Username <span class="req">*</span></label>
        <input class="form-control" id="u-username" value="${esc(u.username||'')}" placeholder="VD: sales3" ${isNew?'':'readonly style="background:var(--surface2);color:var(--muted)"'}>
        ${isNew ? '<small class="form-hint">Dùng để đăng nhập. Không đổi được sau khi tạo.</small>' : '<small class="form-hint c-muted">Username không thể chỉnh sửa.</small>'}
      </div>
      <div class="form-group">
        <label class="form-label">Quyền <span class="req">*</span></label>
        <select class="form-control form-select" id="u-role">${roleOpts}</select>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">${isNew ? 'Mật khẩu' : 'Đặt lại mật khẩu'} ${isNew?'<span class="req">*</span>':''}</label>
        <input class="form-control" type="text" id="u-password" value="" placeholder="${isNew?'Tối thiểu 6 ký tự':'Để trống nếu không đổi'}">
        <small class="form-hint">${isNew?'Cấp mật khẩu cho người dùng đăng nhập.':'Nhập mật khẩu mới để thay đổi.'}</small>
      </div>
      <div class="form-group">
        <label class="form-label">Họ và tên <span class="req">*</span></label>
        <input class="form-control" id="u-name" value="${esc(u.name||'')}" placeholder="VD: Nguyễn Minh Anh">
      </div>
    </div>

    <div class="form-group" id="u-slug-row" style="${u.role==='sales'?'':'display:none'}">
      <label class="form-label">ID giới thiệu (slug)</label>
      <input class="form-control" id="u-slug" value="${esc(u.slug||'')}" placeholder="VD: sales3 — dùng trong link ?s=...">
      <small class="form-hint">Khách mở <code>index.html?s=&lt;slug&gt;</code> sẽ được gán cho sale này. Bỏ trống = dùng username.</small>
    </div>

    <div class="form-section">Hồ sơ</div>
    <div class="form-group">
      <label class="form-label">Chức danh</label>
      <input class="form-control" id="u-title" value="${esc(u.title||'')}" placeholder="VD: Chuyên viên tư vấn cao cấp">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Điện thoại</label>
        <input class="form-control" id="u-phone" value="${esc(u.phone||'')}" placeholder="VD: 0911 222 333">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-control" type="email" id="u-email" value="${esc(u.email||'')}" placeholder="ten@auroraheights.vn">
      </div>
    </div>

    <div class="form-section">Ảnh đại diện</div>
    ${imageField('u-avatar', 'Avatar', u.avatar||'')}
  `;
  showPanel(isNew ? 'Thêm tài khoản' : 'Sửa tài khoản', body, () => userSave(isNew ? null : u.id));
  // Ẩn/hiện trường slug theo role đang chọn.
  const roleSel = document.getElementById('u-role');
  if (roleSel) roleSel.addEventListener('change', () => {
    const row = document.getElementById('u-slug-row');
    if (row) row.style.display = roleSel.value === 'sales' ? '' : 'none';
  });
}

async function userSave(id) {
  const g = sel => (document.getElementById(sel)?.value || '').trim();
  const isNew = !id;

  const username = g('u-username').toLowerCase();
  const name     = g('u-name');
  const password = document.getElementById('u-password')?.value || '';
  const role     = g('u-role');

  if (isNew && !username) { toast('Vui lòng nhập Username', 'warn'); return; }
  if (isNew && !/^[a-z0-9_.-]+$/.test(username)) {
    toast('Username chỉ dùng a-z, 0-9, _ . -', 'warn'); return;
  }
  if (!name) { toast('Vui lòng nhập Họ và tên', 'warn'); return; }
  if (isNew && password.length < 6) { toast('Mật khẩu tối thiểu 6 ký tự', 'warn'); return; }
  if (!isNew && password && password.length < 6) {
    toast('Mật khẩu mới tối thiểu 6 ký tự', 'warn'); return;
  }

  const payload = {
    name,
    role,
    title:  g('u-title'),
    phone:  g('u-phone'),
    email:  g('u-email'),
    avatar: (document.getElementById('u-avatar-val')?.value || '').trim(),
  };
  if (role === 'sales') payload.slug = g('u-slug');
  if (password) payload.password = password;
  if (isNew) payload.username = username;

  try {
    if (isNew) await authApi('POST', '/api/users', payload);
    else       await authApi('PUT', '/api/users/' + id, payload);
    closePanel();
    toast(isNew ? 'Đã tạo tài khoản' : 'Đã cập nhật tài khoản', 'ok');
    await loadUsers(true);
    render('settings', document.getElementById('p-settings'));
  } catch (e) {
    toast(e.message, 'err');
  }
}

// Nạp danh sách tài khoản từ API (cache trong S.users).
async function loadUsers(force) {
  if (S.usersLoaded && !force) return true;
  try {
    S.users = await authApi('GET', '/api/users');
    S.usersLoaded = true;
    S.usersError = null;
    return true;
  } catch (e) {
    S.usersError = e.message;
    return false;
  }
}

function logoSlotHTML(id, label, currentValue, usedIn, bgMode) {
  const bgStyle = bgMode === 'dark'
    ? 'background:#1e293b;border-radius:10px;padding:16px;display:flex;align-items:center;justify-content:center;min-height:80px'
    : 'background:#f1f5f9;border-radius:10px;padding:16px;display:flex;align-items:center;justify-content:center;min-height:80px';
  return `
    <div class="logo-slot" style="border:1px solid var(--border);border-radius:var(--r2);padding:16px;margin-bottom:14px">
      <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
        <div id="${id}-slot-bg" style="${bgStyle};flex:0 0 180px">
          <img id="${id}-slot-img" src="${esc(currentValue||'')}" alt="${esc(label)}"
               style="max-height:56px;max-width:150px;width:auto;object-fit:contain"
               onerror="this.style.opacity=.2">
        </div>
        <div style="flex:1;min-width:200px">
          <div class="fw6" style="margin-bottom:4px">${label}</div>
          <div class="c-muted" style="font-size:12px;margin-bottom:10px">${ico('info',11)} Dùng tại: ${usedIn}</div>
          ${imageField(id, '', currentValue)}
        </div>
      </div>
    </div>`;
}


function renderSettings(el) {
  const p = proj();
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Cài Đặt</div><h1>Cài Đặt Hệ Thống</h1></div>
    </div>
    <div class="vtab-layout">
      <div class="vtabs">
        ${[
          ['project',`${ico('hardhat',14)} Dự án`],
          // Tab API & Tải lên là phần kỹ thuật — chỉ developer thấy.
          ...(authRole()==='developer' ? [
            ['api',`${ico('plug',14)} API & Tích hợp`],
            ['upload',`${ico('upload',14)} Tải lên`],
          ] : []),
          ['users',`${ico('users',14)} Người dùng`],
          ['backup',`${ico('harddrive',14)} Backup`],
        ].map(([id,l])=>`
          <div class="vtab ${S.settingsTab===id?'active':''}" onclick="S.settingsTab='${id}';render('settings',document.getElementById('p-settings'))">${l}</div>`).join('')}
      </div>
      <div class="vtab-content">${settingsTabHTML(p)}</div>
    </div>
  `;
  // Đồng bộ cấu hình upload từ server khi mở tab tương ứng
  if (S.settingsTab === 'upload') {
    fetch(API_BASE + '/api/settings/upload').then(r => r.ok ? r.json() : null).then(j => {
      if (!j) return;
      const f = document.getElementById('sp-upload-file-maxmb');
      const i = document.getElementById('sp-upload-image-maxmb');
      if (f && !f.dataset.touched) f.value = j.maxMb || 100;
      if (i && !i.dataset.touched) i.value = j.imageMaxMb || 10;
    }).catch(() => {});
  }
}

function settingsTabHTML(p) {
  const VALID_TABS = authRole()==='developer'
    ? ['project','api','upload','users','backup']
    : ['project','users','backup'];   // owner không thấy API & Tải lên (kỹ thuật)
  if (!VALID_TABS.includes(S.settingsTab)) S.settingsTab = 'project';
  const t = S.settingsTab;
  if (t==='project') return `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">Thông Tin Cơ Bản</span><span class="card-subtitle">Hiển thị trên project-card & trang VR</span></div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Tên dự án</label><input class="form-control" id="sp-name" value="${p.name||''}"></div>
          <div class="form-group"><label class="form-label">Chủ đầu tư</label><input class="form-control" id="sp-developer" value="${p.developer||''}"></div>
        </div>
        <div class="form-group"><label class="form-label">Tagline (phụ đề)</label><input class="form-control" id="sp-tagline" value="${p.tagline||''}" placeholder="VD: Sống trên tầng mây — Đô thị sinh thái cao cấp"></div>
        <div class="form-group"><label class="form-label">Địa chỉ / Vị trí</label><input class="form-control" id="sp-location" value="${p.location||''}"></div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Trạng thái bán <small class="c-muted">(badge trên card)</small></label><input class="form-control" id="sp-status" value="${p.status||''}"></div>
          <div class="form-group"><label class="form-label">Ngày bàn giao</label><input class="form-control" id="sp-handover" value="${p.handover||''}"></div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">Giá Bán</span><span class="card-subtitle">Thông tin liên hệ trực tiếp lấy từ profile của từng Sale</span></div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Giá từ <small class="c-muted">(hiển thị lớn trên card)</small></label><input class="form-control" id="sp-priceFrom" value="${p.priceFrom||''}" placeholder="VD: Từ 4.9 tỷ"></div>
          <div class="form-group"><label class="form-label">Đơn vị giá</label><input class="form-control" id="sp-priceUnit" value="${p.priceUnit||''}" placeholder="VD: VND / căn"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Số căn đang mở bán</label><input class="form-control" type="number" id="sp-totalUnitsForSale" value="${p.totalUnitsForSale||312}"></div>
          <div class="form-group"><label class="form-label">Căn còn lại <small class="c-muted">(badge ưu đãi)</small></label><input class="form-control" type="number" id="sp-unitsLeft" value="${p.unitsLeft||49}"></div>
        </div>
        <div class="form-group"><label class="form-label">Ngày hết hạn ưu đãi <small class="c-muted">(đồng hồ đếm ngược)</small></label><input class="form-control" type="datetime-local" id="sp-promo" value="${p.promoDeadline?p.promoDeadline.slice(0,16):''}"></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">Thông Số Dự Án</span><span class="card-subtitle">Hiển thị trong ô thống kê (pc-stats)</span></div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Tổng số căn</label><input class="form-control" type="number" id="sp-totalUnits" value="${p.totalUnits||1840}"></div>
          <div class="form-group"><label class="form-label">Số tòa</label><input class="form-control" type="number" id="sp-totalTowers" value="${p.totalTowers||6}"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Số tầng</label><input class="form-control" id="sp-floors" value="${p.floors||''}" placeholder="VD: 42 tầng"></div>
          <div class="form-group"><label class="form-label">Diện tích căn</label><input class="form-control" id="sp-areaRange" value="${p.areaRange||''}" placeholder="VD: 58 — 142 m²"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Mật độ xây dựng</label><input class="form-control" id="sp-density" value="${p.density||''}" placeholder="VD: 27%"></div>
          <div class="form-group"><label class="form-label">Cây xanh nội khu</label><input class="form-control" id="sp-greenSpace" value="${p.greenSpace||''}" placeholder="VD: 12.4 ha công viên nội khu"></div>
        </div>
        <div class="form-section" style="margin-top:8px">4 ô thống kê nhỏ (pc-stats)</div>
        ${(p.stats||[{value:'12.4',unit:'ha',label:'Cây xanh nội khu'},{value:'27',unit:'%',label:'Mật độ xây dựng'},{value:'8',unit:'phút',label:'Tới hồ Tây'},{value:'42',unit:'tầng',label:'Tầm view panorama'}]).slice(0,4).map((st,i)=>`
          <div class="form-row" style="align-items:flex-end;gap:8px">
            <div class="form-group" style="flex:1"><label class="form-label">Số ${i+1} · Giá trị</label><input class="form-control" id="sp-stv${i}" value="${st.value||''}"></div>
            <div class="form-group" style="flex:0 0 70px"><label class="form-label">Đơn vị</label><input class="form-control" id="sp-stu${i}" value="${st.unit||''}"></div>
            <div class="form-group" style="flex:2"><label class="form-label">Nhãn</label><input class="form-control" id="sp-stl${i}" value="${st.label||''}"></div>
          </div>`).join('')}
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">Project Card — Chế độ tổng quan</span>
        <span class="card-subtitle">Nội dung hiển thị ở project-card khi xem tổng quan dự án</span>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">Mô tả tổng quan</label>
          <textarea class="form-control" id="sp-co-desc" rows="3" placeholder="Trung tâm logistics và cảng biển hiện đại...">${esc((p.cardOverview&&p.cardOverview.description)||'')}</textarea>
        </div>
        <div class="form-group">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <label class="form-label" style="margin:0">Thông tin nổi bật</label>
            <button type="button" class="btn btn-secondary btn-sm" onclick="coAddHighlight()">${ico('plus',12)} Thêm</button>
          </div>
          <div id="sp-co-hl-list">${coHighlightsHTML((p.cardOverview&&p.cardOverview.highlights)||[])}</div>
        </div>
        <div class="form-group">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <label class="form-label" style="margin:0">Liên kết nhanh</label>
            <button type="button" class="btn btn-secondary btn-sm" onclick="coAddLink()">${ico('plus',12)} Thêm</button>
          </div>
          <div id="sp-co-link-list">${coLinksHTML((p.cardOverview&&p.cardOverview.quickLinks)||[])}</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">Logo & Thương Hiệu</span><span class="card-subtitle">Quản lý tất cả logo hiển thị trên website</span></div>
      <div class="card-body">
        <div class="logo-slots">
          ${logoSlotHTML('sp-logoDark', 'Logo sáng (nền tối)', p.logoDark || '../img/logo/LOGO-LV (1).png',
            'Sidebar admin, loader VR, brand topbar VR', 'dark')}
          ${logoSlotHTML('sp-logoLight', 'Logo màu (nền sáng)', p.logoLight || '../img/logo/LOGO-LV (2).png',
            'Topbar admin, trang đăng nhập', 'light')}
        </div>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-top:4px">
      <button class="btn btn-primary" onclick="saveProjectSettings()">${ico('save')} Lưu tất cả</button>
    </div>`;

  if (t==='upload') return `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">Cấu Hình Tải Lên</span>
        <span class="card-subtitle">Giới hạn dung lượng cho ảnh và file tài liệu</span>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">Giới hạn ảnh (MB / ảnh)</label>
          <input class="form-control" type="number" min="1" max="1024" id="sp-upload-image-maxmb"
            value="10" placeholder="10" oninput="this.dataset.touched=1">
          <small class="c-muted">Áp dụng cho thư viện ảnh và logo. Mặc định 10 MB / ảnh.</small>
        </div>
        <div class="form-group">
          <label class="form-label">Giới hạn file tài liệu (MB / file)</label>
          <input class="form-control" type="number" min="1" max="10240" id="sp-upload-file-maxmb"
            value="100" placeholder="100" oninput="this.dataset.touched=1">
          <small class="c-muted">Áp dụng cho PDF, video, file lớn. Mặc định 100 MB / file.</small>
        </div>
        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-primary" onclick="saveUploadSettings()">${ico('save')} Lưu cấu hình</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Ghi chú</span>
      </div>
      <div class="card-body">
        <div style="font-size:13px;color:var(--muted);line-height:1.6">
          <p>• Tất cả file tải lên (ảnh + tài liệu) được lưu trên <b>Cloudflare R2</b> — không phụ thuộc storage server, không mất khi redeploy.</p>
          <p>• Giới hạn ở đây chỉ kiểm soát phía client trước khi upload. Để tăng cao hơn cho video lớn, cần đảm bảo proxy (Traefik/Coolify) cũng cho phép body lớn tương ứng.</p>
        </div>
      </div>
    </div>`;

  if (t==='social') return `
    <div class="card">
      <div class="card-header"><span class="card-title">Mạng Xã Hội & Liên Kết</span></div>
      <div class="card-body">
        ${[['Zalo OA','text'],['Facebook Fanpage','url'],['Google Maps embed URL','url'],['YouTube tour','url']].map(([l,tp])=>`<div class="form-group"><label class="form-label">${l}</label><input class="form-control" type="${tp}" placeholder="https://…"></div>`).join('')}
        <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="toast('Đã lưu liên kết','ok')">${ico('save')} Lưu</button></div>
      </div>
    </div>`;
  if (t==='api') return `
    <div class="card">
      <div class="card-header"><span class="card-title">Tích Hợp API</span></div>
      <div class="card-body">
        <div class="form-group"><label class="form-label">CRM Webhook URL</label><input class="form-control" placeholder="https://crm.example.com/webhook"></div>
        <div class="form-group"><label class="form-label">CRM API Key</label><input class="form-control" type="password" placeholder="••••••••••••••••"></div>
        <div class="form-group"><label class="form-label">AI Chatbot API Key (Claude)</label><input class="form-control" type="password" placeholder="sk-ant-••••••••"></div>
        <div class="form-group"><label class="form-label">Google Analytics ID</label><input class="form-control" placeholder="G-XXXXXXXXXX"></div>
        <div class="form-group"><label class="form-label">Google Maps API Key</label><input class="form-control" type="password" placeholder="AIza••••••••"></div>
        <div style="display:flex;justify-content:flex-end"><button class="btn btn-primary" onclick="toast('Đã lưu cài đặt API','ok')">${ico('save')} Lưu</button></div>
      </div>
    </div>`;
  if (t==='users') {
    // Danh sách nạp bất đồng bộ qua API; lần đầu render placeholder rồi
    // gọi loadUsers() và re-render khi có dữ liệu.
    if (!S.usersLoaded && !S.usersError) {
      loadUsers().then(() => {
        if (S.page === 'settings' && S.settingsTab === 'users') {
          render('settings', document.getElementById('p-settings'));
        }
      });
      return `<div class="card"><div class="card-body" style="text-align:center;padding:40px;color:var(--muted)">Đang tải danh sách tài khoản…</div></div>`;
    }
    if (S.usersError) {
      return `<div class="card"><div class="card-body" style="text-align:center;padding:32px;color:var(--muted)">
        Không tải được danh sách tài khoản: ${esc(S.usersError)}<br>
        <small>Hãy chắc chắn server đang chạy.</small><br>
        <button class="btn btn-secondary btn-sm" style="margin-top:12px" onclick="S.usersLoaded=false;S.usersError=null;render('settings',document.getElementById('p-settings'))">${ico('refresh',12)} Thử lại</button>
      </div></div>`;
    }
    const users = S.users || [];
    const roleBadge = (role) => {
      const map = {
        developer: ['Developer', 'rgba(99,102,241,.2)', '#818cf8'],
        owner:     ['Chủ đầu tư', 'rgba(245,158,11,.2)', '#fbbf24'],
        sales:     ['Sales', 'rgba(16,185,129,.2)', '#34d399'],
      };
      const [label, bg, fg] = map[role] || [role, 'rgba(148,163,184,.2)', '#94a3b8'];
      return `<span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:${bg};color:${fg}">${label}</span>`;
    };
    return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Quản Lý Người Dùng</span>
        <button class="btn btn-primary btn-sm" onclick="userAdd()">${ico('plus')} Thêm tài khoản</button>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr>
            <th>Người dùng</th><th>Username</th><th>Quyền</th><th>ID giới thiệu</th><th>Chức danh</th><th>Điện thoại</th><th>Email</th><th>Thao tác</th>
          </tr></thead>
          <tbody>
            ${users.length === 0 ? `
              <tr><td colspan="8" style="text-align:center;padding:32px;color:var(--muted)">Chưa có tài khoản nào.</td></tr>
            ` : users.map((u)=>`
              <tr${u.isActive ? '' : ' style="opacity:.5"'}>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    ${u.avatar
                      ? `<img src="${esc(u.avatar)}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0">`
                      : `<div class="user-av">${esc((u.name||'?').trim().split(/\s+/).pop()[0]||'?')}</div>`}
                    <span class="fw6">${esc(u.name||'(chưa đặt tên)')}</span>
                  </div>
                </td>
                <td class="mono" style="font-size:12px">${esc(u.username||'')}</td>
                <td>${roleBadge(u.role)}</td>
                <td class="mono" style="font-size:12px">${u.role==='sales' ? esc(u.slug||u.username||'') : '<span class="c-muted">—</span>'}</td>
                <td class="c-muted">${esc(u.title||'')}</td>
                <td class="mono" style="font-size:12px">${esc(u.phone||'')}</td>
                <td class="mono c-muted" style="font-size:12px">${esc(u.email||'')}</td>
                <td><div class="row-actions">
                  <button class="act-btn" title="Sửa" onclick="userEdit(${u.id})">${ico('edit')}</button>
                  <button class="act-btn danger" title="Xoá" onclick="userDel(${u.id})">${ico('trash')}</button>
                </div></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">Backup & Restore</span></div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:10px">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r)">
          <div><div class="fw6">Export toàn bộ data</div><div class="c-muted" style="font-size:12px">Tải project.json hiện tại</div></div>
          <button class="btn btn-secondary btn-sm" onclick="exportBackup()">${ico('download')} Export</button>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r)">
          <div><div class="fw6">Import data</div><div class="c-muted" style="font-size:12px">Upload project.json mới — ghi đè localStorage</div></div>
          <button class="btn btn-secondary btn-sm" onclick="importJSON()">${ico('upload')} Import</button>
        </div>
        <div style="padding:12px 14px;background:var(--primary-soft);border:1px solid var(--primary-dim);border-radius:var(--r);font-size:12px;color:var(--primary)">
          <b>Lưu ý:</b> Mỗi lần lưu, dữ liệu được đồng bộ thẳng lên CSDL qua <code>PUT /api/project</code> — trang VR đọc <code>/api/project</code> sẽ thấy ngay. Bản nháp cũng giữ ở <code>localStorage</code> phòng khi mất mạng. Nếu toast báo "chỉ cục bộ — chưa lên CSDL" nghĩa là máy chủ đang tắt, hãy bật lại rồi lưu lại.
        </div>
        <div style="padding:12px 14px;background:var(--danger-soft);border:1px solid var(--danger-dim);border-radius:var(--r)">
          <div class="c-danger fw6" style="margin-bottom:4px">${ico('warning')} Vùng nguy hiểm</div>
          <div class="c-muted" style="font-size:13px;margin-bottom:10px">Reset sẽ xoá toàn bộ chỉnh sửa và đọc lại <code>data/project.json</code> gốc.</div>
          <button class="btn btn-danger btn-sm" onclick="resetData()">Reset về mặc định</button>
        </div>
      </div>
    </div>`;
}

// Các hàm openGalleryPanel/openSiteMapPanel/openTimelinePanel cũ
// đã được chuyển thành trang riêng. Giữ wrapper để overview cards vẫn chạy.
function openGalleryPanel()  { go('gallery'); }
function openSiteMapPanel()  { go('sitemap'); }
function openTimelinePanel() { go('timeline'); }

/* ── Project Card tổng quan — Thông tin nổi bật ── */
const CO_ICONS = ['area','port','transit','road','leaf','map','grid','home','doc','pin'];
const CO_ACTIONS = [
  { id: 'open-masterplan', label: 'Mở Masterplan' },
  { id: 'open-phankhu',    label: 'Mở danh sách Phân khu' },
  { id: 'open-properties', label: 'Mở Bất động sản' },
  { id: 'open-modal',      label: 'Mở form đặt lịch' },
];
function coIconSelect(attr, cur) {
  return `<select class="form-control" ${attr} style="flex:0 0 110px">
    ${CO_ICONS.map(ic => `<option ${ic===cur?'selected':''}>${ic}</option>`).join('')}
  </select>`;
}
function coHighlightsHTML(list) {
  list = list || [];
  if (!list.length) return `<div class="c-muted" style="font-size:12px;padding:4px">Chưa có mục.</div>`;
  return list.map((h,i)=>`
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px" data-co-hl="${i}">
      ${coIconSelect(`data-hl-icon="${i}"`, h.icon||'pin')}
      <input class="form-control" data-hl-label="${i}" value="${esc(h.label||'')}" placeholder="Nhãn" style="flex:1">
      <input class="form-control" data-hl-value="${i}" value="${esc(h.value||'')}" placeholder="Giá trị" style="flex:1">
      <button class="act-btn danger" onclick="coRemoveHighlight(${i})">${ico('trash',12)}</button>
    </div>`).join('');
}
function coLinksHTML(list) {
  list = list || [];
  if (!list.length) return `<div class="c-muted" style="font-size:12px;padding:4px">Chưa có liên kết.</div>`;
  return list.map((l,i)=>`
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px" data-co-link="${i}">
      ${coIconSelect(`data-link-icon="${i}"`, l.icon||'doc')}
      <input class="form-control" data-link-label="${i}" value="${esc(l.label||'')}" placeholder="Nhãn nút" style="flex:1">
      <select class="form-control" data-link-id="${i}" style="flex:0 0 190px">
        ${CO_ACTIONS.map(a=>`<option value="${a.id}" ${a.id===l.id?'selected':''}>${a.label}</option>`).join('')}
      </select>
      <button class="act-btn danger" onclick="coRemoveLink(${i})">${ico('trash',12)}</button>
    </div>`).join('');
}
function coReadHighlights() {
  const host = document.getElementById('sp-co-hl-list');
  const out = [];
  host && host.querySelectorAll('[data-co-hl]').forEach(row => {
    const i = row.dataset.coHl;
    out.push({
      icon: host.querySelector(`[data-hl-icon="${i}"]`)?.value || 'pin',
      label: (host.querySelector(`[data-hl-label="${i}"]`)?.value || '').trim(),
      value: (host.querySelector(`[data-hl-value="${i}"]`)?.value || '').trim(),
    });
  });
  return out.filter(h => h.label || h.value);
}
function coReadLinks() {
  const host = document.getElementById('sp-co-link-list');
  const out = [];
  host && host.querySelectorAll('[data-co-link]').forEach(row => {
    const i = row.dataset.coLink;
    out.push({
      id: host.querySelector(`[data-link-id="${i}"]`)?.value || 'open-modal',
      icon: host.querySelector(`[data-link-icon="${i}"]`)?.value || 'doc',
      label: (host.querySelector(`[data-link-label="${i}"]`)?.value || '').trim(),
    });
  });
  return out.filter(l => l.label);
}
function coAddHighlight() {
  const list = coReadHighlights();
  list.push({ icon: 'pin', label: '', value: '' });
  document.getElementById('sp-co-hl-list').innerHTML = coHighlightsHTML(list);
}
function coRemoveHighlight(i) {
  const list = coReadHighlights();
  list.splice(i, 1);
  document.getElementById('sp-co-hl-list').innerHTML = coHighlightsHTML(list);
}
function coAddLink() {
  const list = coReadLinks();
  list.push({ id: 'open-modal', icon: 'doc', label: '' });
  document.getElementById('sp-co-link-list').innerHTML = coLinksHTML(list);
}
function coRemoveLink(i) {
  const list = coReadLinks();
  list.splice(i, 1);
  document.getElementById('sp-co-link-list').innerHTML = coLinksHTML(list);
}

async function saveUploadSettings() {
  const fileEl  = document.getElementById('sp-upload-file-maxmb');
  const imageEl = document.getElementById('sp-upload-image-maxmb');
  const maxMb      = Math.max(1, parseInt(fileEl?.value, 10) || 100);
  const imageMaxMb = Math.max(1, parseInt(imageEl?.value, 10) || 10);
  try {
    const r = await fetch(API_BASE + '/api/settings/upload', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxMb, imageMaxMb }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || 'Lỗi không xác định');
    toast(`Đã lưu — ảnh ${j.imageMaxMb} MB · file ${j.maxMb} MB`, 'ok');
    // Áp dụng ngay cho session hiện tại — không cần reload
    if (typeof window.refreshUploadLimits === 'function') {
      await window.refreshUploadLimits();
    }
  } catch (err) {
    toast('Lưu thất bại: ' + err.message, 'err');
  }
}

function saveProjectSettings() {
  const g = id => { const el = document.getElementById(id); return el ? el.value.trim() : undefined; };
  const gn = id => { const el = document.getElementById(id); return el ? (parseFloat(el.value)||0) : undefined; };
  const stats = [0,1,2,3].map(i => ({
    value: g(`sp-stv${i}`), unit: g(`sp-stu${i}`), label: g(`sp-stl${i}`)
  }));
  Object.assign(S.data.project, {
    name: g('sp-name'), developer: g('sp-developer'), tagline: g('sp-tagline'),
    location: g('sp-location'), status: g('sp-status'), handover: g('sp-handover'),
    priceFrom: g('sp-priceFrom'), priceUnit: g('sp-priceUnit'),
    totalUnitsForSale: gn('sp-totalUnitsForSale'), unitsLeft: gn('sp-unitsLeft'),
    promoDeadline: g('sp-promo'),
    totalUnits: gn('sp-totalUnits'), totalTowers: gn('sp-totalTowers'),
    floors: g('sp-floors'), areaRange: g('sp-areaRange'),
    density: g('sp-density'), greenSpace: g('sp-greenSpace'),
    stats,
  });
  const logoDark  = imgFieldValue('sp-logoDark');
  const logoLight = imgFieldValue('sp-logoLight');
  if (logoDark)  S.data.project.logoDark  = logoDark;  else delete S.data.project.logoDark;
  if (logoLight) S.data.project.logoLight = logoLight; else delete S.data.project.logoLight;

  // Project Card — chế độ tổng quan (cardOverview)
  const coDescEl = document.getElementById('sp-co-desc');
  if (coDescEl) {
    const co = S.data.project.cardOverview || (S.data.project.cardOverview = {});
    co.description = coDescEl.value.trim();
    co.highlights = coReadHighlights();
    co.quickLinks = coReadLinks();
  }
  saveData('Đã lưu thông tin dự án');
}

function exportBackup() { exportJSON(); }

// ——— UI: PANEL / MODAL / TOAST ———————————————
function showPanel(title, bodyHTML, onSave) {
  document.getElementById('sp-title').textContent = title;
  document.getElementById('sp-body').innerHTML    = bodyHTML;
  document.getElementById('sp-save').onclick      = onSave;
  document.getElementById('sp').classList.add('open');
  document.getElementById('sp-backdrop').classList.add('open');
}
function closePanel() {
  const sp = document.getElementById('sp');
  sp.classList.remove('open');
  sp.classList.remove('sp-wide');
  document.getElementById('sp-backdrop').classList.remove('open');
}

function openConfirmModal({ title='Xác nhận', sub='', body='', okText='Xác Nhận', cancelText='Huỷ bỏ', okClass='btn-danger', showCancel=true, onOk, onCancel } = {}) {
  document.getElementById('cm-title').innerHTML = title;
  const subEl = document.getElementById('cm-sub');
  subEl.textContent = sub || '';
  subEl.style.display = sub ? '' : 'none';
  const bodyEl = document.getElementById('cm-body');
  if (bodyEl) bodyEl.innerHTML = body || '';
  const cancelBtn = document.getElementById('cm-cancel');
  if (cancelBtn) {
    cancelBtn.textContent = cancelText;
    cancelBtn.style.display = showCancel ? '' : 'none';
    cancelBtn.onclick = () => { closeConfirm(); if (onCancel) onCancel(); };
  }
  const okBtn = document.getElementById('cm-ok');
  okBtn.textContent = okText;
  okBtn.className = `btn ${okClass}`;
  okBtn.onclick = () => {
    if (onOk) {
      const r = onOk();
      if (r === false) return; // validation failure keeps modal open
    }
    closeConfirm();
  };
  document.getElementById('cm-back').classList.add('open');
  setTimeout(() => {
    const input = document.querySelector('#cm-body input, #cm-body textarea');
    if (input) input.focus();
  }, 30);
}
function closeConfirm() {
  document.getElementById('cm-back').classList.remove('open');
  const bodyEl = document.getElementById('cm-body');
  if (bodyEl) bodyEl.innerHTML = '';
}
function confirmDel(title, sub, onOk) {
  openConfirmModal({ title, sub, body: 'Hành động này không thể hoàn tác. Bạn có chắc chắn?', okText:'Xác Nhận', okClass:'btn-danger', onOk });
}
function uiConfirm(message, onOk, { title='Xác nhận', okText='Xác Nhận', okClass='btn-primary' } = {}) {
  openConfirmModal({ title, body: esc(message), okText, okClass, onOk });
}
function uiAlert(message, { title='Thông báo', okText='Đã hiểu' } = {}) {
  return new Promise(res => {
    openConfirmModal({ title, body: esc(message), okText, okClass:'btn-primary', showCancel:false, onOk: () => res(true) });
  });
}
function uiPrompt(message, defaultValue='', onOk, { title='Nhập thông tin', okText='Xác Nhận', placeholder='' } = {}) {
  const inputHtml = `<div style="margin-bottom:8px">${esc(message)}</div>
    <input type="text" id="cm-prompt-input" class="form-control" value="${esc(defaultValue)}" placeholder="${esc(placeholder)}" style="width:100%">`;
  openConfirmModal({
    title, body: inputHtml, okText, okClass:'btn-primary',
    onOk: () => {
      const v = document.getElementById('cm-prompt-input')?.value ?? '';
      return onOk(v);
    }
  });
}

function toast(msg, type='info') {
  const wrap  = document.getElementById('toast-wrap');
  const icons = { ok: ico('check',14), err: ico('x',14), warn: ico('warning',14), info: ico('info',14) };
  const div   = document.createElement('div');
  div.className = `toast ${type}`;
  div.innerHTML = `<span class="toast-icon">${icons[type]||ico('info',14)}</span><span class="toast-msg">${msg}</span><span class="toast-x" onclick="this.parentElement.remove()">×</span>`;
  wrap.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

// ——— INIT ————————————————————————————————————
async function init() {
  // Chặn truy cập khi chưa đăng nhập — owner.html chỉ dành cho developer/owner.
  const _sess = authSession();
  if (!_sess || !_sess.token) { location.replace(adminPath('index.html')); return; }
  if (_sess.role === 'sales')  { location.replace(adminPath('sales.html')); return; }
  if (_sess) {
    const av = document.getElementById('tb-avatar');
    const nm = document.getElementById('tb-name');
    const rl = document.getElementById('tb-role');
    if (av) av.textContent = _sess.name.slice(0,2).toUpperCase();
    if (nm) nm.textContent = _sess.name;
    if (rl) rl.textContent = _sess.title;
  }

  await loadData();
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => go(el.dataset.p));
  });
  document.getElementById('sp-backdrop').addEventListener('click', closePanel);
  go('overview');

  // Tự làm mới luồng hoạt động thật khi đang ở trang Tổng Quan
  setInterval(() => {
    if (S.page === 'overview') loadActivityFeed();
  }, 30000);
}

document.addEventListener('DOMContentLoaded', init);
