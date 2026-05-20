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
  i18nLang: 'VI',
  i18nLangs: ['VI'],
  themeUnsaved: false,
  charts: {},
  dragSrc: null,
};

// ——— GROUP META ———————————————————————————————
const GROUP_META = {
  tongQuan:        { label: 'Tổng Quan',           icon: 'building' },
  phanKhu:         { label: 'Phân Khu',            icon: 'mappin' },
  tienIchNoiKhu:   { label: 'Tiện Ích Nội Khu',    icon: 'leaf' },
  tienIchNgoaiKhu: { label: 'Tiện Ích Ngoại Khu',  icon: 'mappin' },
  matBangTang:     { label: 'Mặt Bằng / Tòa',      icon: 'hardhat' },
  view360Can:      { label: 'View 360° Căn Hộ',    icon: 'armchair' },
};

// ——— LOAD DATA ————————————————————————————————
const LS_KEY = 'ah_admin_data';

async function loadData() {
  // Ưu tiên localStorage (admin đã sửa) — nếu không có, fetch JSON gốc
  const cached = localStorage.getItem(LS_KEY);
  if (cached) {
    try { S.data = JSON.parse(cached); } catch { S.data = null; }
  }
  if (!S.data) {
    try {
      const r = await fetch('../data/project.json');
      S.data = await r.json();
    } catch {
      S.data = getFallbackData();
    }
  }
  S.leads = getMockLeads();
  S.bookings = getMockBookings();
  if (!S.data.menu) S.data.menu = {};
  Object.keys(GROUP_META).forEach(k => { if (!S.data.menu[k]) S.data.menu[k] = []; });
  // Đảm bảo các nhánh nội dung tồn tại để không lỗi khi render lần đầu
  S.data.gallery        ??= [];
  S.data.siteMap        ??= { center: [16.2130, 108.1200], zoom: 14, points: [] };
  S.data.timeline       ??= [];
  S.data.legal          ??= { documents: [], banks: [], developerStats: [], testimonials: [] };
  S.data.location       ??= { lat: 0, lng: 0, mapSrc: '', nearby: [] };
  S.data.amenitiesDetail??= { noiKhu: [], skyAmenity: [], dichVu: [], haTang: [] };
  S.data.resources      ??= {};
  S.data.properties     ??= [];
  if (!S.data.project)  S.data.project = {};
  S.data.project.amenities ??= [];
  migrateUnitsToProperties();
  // Pre-load panorama list for nav panel editor
  await fetchPanoramas();
}

/* properties là nguồn dữ liệu Bất Động Sản duy nhất.
   floorplan.units cũ không còn dùng — trỏ về properties để tương thích. */
function migrateUnitsToProperties() {
  S.data.floorplan = S.data.floorplan || {};
  S.data.floorplan.units = S.data.properties;
}

function saveData(msg = 'Đã lưu') {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(S.data));
    toast(msg, 'ok');
  } catch (e) {
    toast('Lỗi lưu: ' + e.message, 'err');
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

function getMockLeads() {
  return [
    { id:1, name:'Nguyễn Văn An',  phone:'0901234567', email:'an@gmail.com',   zalo:'0901234567', unitType:'3PN',        budget:'8–12 tỷ', purpose:'Ở thực',  timing:'Trong 3 tháng', source:'VR Web',       status:'new',       createdAt:'2026-05-15T08:30', assignee:'Sales A', notes:'' },
    { id:2, name:'Trần Thị Bích',  phone:'0912345678', email:'bich@gmail.com', zalo:'',           unitType:'2PN',        budget:'5–8 tỷ',  purpose:'Đầu tư',  timing:'Trong 6 tháng', source:'Zalo',         status:'called',    createdAt:'2026-05-14T14:00', assignee:'Sales B', notes:'Đã gọi lần 1' },
    { id:3, name:'Lê Minh Cường',  phone:'0923456789', email:'',              zalo:'0923456789', unitType:'Duplex 3PN', budget:'> 12 tỷ', purpose:'Ở thực',  timing:'Trong 1 tháng', source:'Giới thiệu',  status:'interested', createdAt:'2026-05-13T10:15', assignee:'Sales A', notes:'Khách VIP' },
    { id:4, name:'Phạm Thu Dung',  phone:'0934567890', email:'dung@mail.vn',  zalo:'0934567890', unitType:'3PN',        budget:'8–12 tỷ', purpose:'Cho thuê', timing:'Hơn 6 tháng', source:'Call',         status:'closed',    createdAt:'2026-05-12T16:00', assignee:'Sales C', notes:'Đã chốt căn A-3BR-104-35' },
    { id:5, name:'Hoàng Đức Em',   phone:'0945678901', email:'em@mail.com',   zalo:'',           unitType:'2PN',        budget:'< 5 tỷ',  purpose:'Đầu tư',  timing:'Hơn 6 tháng', source:'VR Web',       status:'stopped',   createdAt:'2026-05-11T09:00', assignee:'Sales B', notes:'Không phù hợp ngân sách' },
    { id:6, name:'Vũ Thị Giang',   phone:'0956789012', email:'giang@vn.vn',  zalo:'0956789012', unitType:'3PN',        budget:'8–12 tỷ', purpose:'Ở thực',  timing:'Trong 3 tháng', source:'VR Web',       status:'new',       createdAt:'2026-05-15T10:00', assignee:'',       notes:'' },
    { id:7, name:'Đỗ Minh Khang',  phone:'0967890123', email:'',              zalo:'0967890123', unitType:'2PN',        budget:'5–8 tỷ',  purpose:'Ở thực',  timing:'Trong 3 tháng', source:'Walk-in',     status:'interested', createdAt:'2026-05-14T15:30', assignee:'Sales A', notes:'Khách đến nhà mẫu thứ 7', manual:true },
    { id:8, name:'Bùi Thanh Hà',   phone:'0978901234', email:'ha@fb.vn',     zalo:'',           unitType:'3PN',        budget:'8–12 tỷ', purpose:'Đầu tư',  timing:'Trong 6 tháng', source:'Facebook',    status:'called',    createdAt:'2026-05-13T09:00', assignee:'Sales C', notes:'Inbox từ Fanpage', manual:true },
  ];
}

function getMockBookings() {
  return [
    { id:1, leadId:1, name:'Nguyễn Văn An',  phone:'0901234567', date:'2026-05-18', time:'10:00', type:'Xem nhà mẫu',  assignee:'Sales A', status:'confirmed', notes:'Khách quan tâm tầng cao',         createdAt:'2026-05-15T09:00', manual:false },
    { id:2, leadId:7, name:'Đỗ Minh Khang',  phone:'0967890123', date:'2026-05-17', time:'14:30', type:'Tư vấn tại VP', assignee:'Sales A', status:'pending',   notes:'Hẹn lại sau khi gọi xác nhận',    createdAt:'2026-05-14T16:00', manual:true  },
    { id:3, leadId:null,name:'Lý Quốc Hùng', phone:'0989012345', date:'2026-05-19', time:'09:30', type:'Xem nhà mẫu',  assignee:'Sales B', status:'confirmed', notes:'Khách giới thiệu — chưa có lead', createdAt:'2026-05-15T11:00', manual:true  },
  ];
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
    case 'amenities': renderAmenitiesPage(el); break;
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

// ——— OVERVIEW ————————————————————————————————
function renderOverview(el) {
  const us = units();
  const totalAvail = us.reduce((s,u)=>s+(u.available||0),0);
  const totalAll   = us.reduce((s,u)=>s+(u.total||0),0);
  const soldPct    = totalAll ? ((totalAll-totalAvail)/totalAll*100).toFixed(1) : 0;
  const p          = proj();
  const gal        = (S.data.gallery||[]);
  const galPending = gal.filter(g=>g && g.pending).length;
  const tl         = (S.data.timeline||[]);
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
        <div class="kpi-value">2,847</div>
        <div class="kpi-trend up">${ico('arrowup',10)}12.4% so hôm qua</div>
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
        <div class="kpi-trend up">${ico('arrowup',10)}2.1% so tháng trước</div>
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
            <div class="feed-item"><div class="feed-dot b"></div><div class="feed-msg"><b>Vũ Thị Giang</b> đặt lịch xem căn 3PN</div><div class="feed-time">2 phút</div></div>
            <div class="feed-item"><div class="feed-dot y"></div><div class="feed-msg">Căn <b>A-3BR-104-28</b> đang được giữ chỗ</div><div class="feed-time">8 phút</div></div>
            <div class="feed-item"><div class="feed-dot g"></div><div class="feed-msg"><b>12 người</b> đang xem VR ngay lúc này</div><div class="feed-time">Trực tiếp</div></div>
            <div class="feed-item"><div class="feed-dot b"></div><div class="feed-msg"><b>Nguyễn Văn An</b> gửi form đặt lịch</div><div class="feed-time">15 phút</div></div>
            <div class="feed-item"><div class="feed-dot y"></div><div class="feed-msg">3 leads mới từ kênh <b>Zalo OA</b></div><div class="feed-time">2 giờ</div></div>
            <div class="feed-item"><div class="feed-dot g"></div><div class="feed-msg">Scene <b>Sky Lounge</b> xem nhiều nhất hôm nay</div><div class="feed-time">3 giờ</div></div>
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
        { icon:'leaf',     label:'Tiện ích nội khu',   key:'tienIchNoiKhu',   hint:'Amenities overlay',   page:'navpanel' },
        { icon:'mappin',   label:'Tiện ích ngoại khu', key:'tienIchNgoaiKhu', hint:'Tiện ích lân cận',     page:'navpanel' },
        { icon:'building', label:'Tổng quan dự án',   key:'tongQuan',         hint:'VR Tổng quan',        page:'navpanel' },
        { icon:'mappin',   label:'Phân khu',           key:'phanKhu',          hint:'VR theo phân khu',    page:'navpanel' },
        { icon:'home',     label:'Bất động sản',       key:'properties',       hint:'Sản phẩm BĐS',        page:'properties' },
        { icon:'hardhat',  label:'Mặt bằng / Tòa',    key:'matBangTang',      hint:'Layout & floorplan',  page:'navpanel' },
        { icon:'armchair', label:'View 360° Căn hộ',  key:'view360Can',       hint:'Tour căn mẫu',        page:'navpanel' },
        { icon:'image',    label:'Thư viện ảnh',       key:'gallery',          hint:'Gallery overlay',     page:'settings', action:'openGalleryPanel' },
        { icon:'map',      label:'Masterplan',          key:'masterplan',       hint:'Quy hoạch & marker',  page:'masterplan' },
        { icon:'calendar', label:'Tiến độ xây dựng',   key:'timeline',         hint:'Construction milestones', page:'settings', action:'openTimelinePanel' },
      ].map(c => {
        const isMenuKey = ['tienIchNoiKhu','tienIchNgoaiKhu','tongQuan','phanKhu','matBangTang','view360Can'].includes(c.key);
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
  setTimeout(() => {
    drawHourly(); drawScenesBar();
  }, 30);
}

function drawHourly() {
  const el = document.getElementById('ch-hourly'); if (!el || !window.Chart) return;
  const now = new Date().getHours();
  const data = [12,8,5,4,6,18,65,120,180,210,195,230,215,190,200,220,310,420,390,350,280,220,160,110];
  S.charts.hourly = new Chart(el, {
    type: 'bar',
    data: { labels: Array.from({length:24},(_,i)=>i+'h'), datasets: [{ data, backgroundColor: data.map((_,i)=>i===now?'#3b82f6':'rgba(59,130,246,.25)'), borderRadius: 3 }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales: { x:{ticks:{color:'#94a3b8',font:{size:10}}}, y:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'rgba(0,0,0,.05)'}} } }
  });
}

function drawScenesBar() {
  const el = document.getElementById('ch-scenes'); if (!el || !window.Chart) return;
  const panos = _panoramaCache || [];
  const labels = panos.length ? panos.slice(0,8).map(p=>p.name) : ['pano-01','pano-02','pano-03','pano-04','pano-05','pano-06'];
  const data   = labels.map((_,i)=>[1240,980,820,710,650,540,480,400][i]||300);
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

const LEAD_STATUS  = { new:'Mới', called:'Đã gọi', interested:'Đang quan tâm', closed:'Đã chốt', stopped:'Không tiếp tục' };
const LEAD_BADGE   = { new:'badge-info', called:'badge-warning', interested:'badge-primary', closed:'badge-ok', stopped:'badge-muted' };
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
const BOOKING_STATUS = { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', done:'Đã hoàn tất', cancelled:'Đã huỷ' };
const BOOKING_BADGE  = { pending:'badge-warning', confirmed:'badge-info', done:'badge-ok', cancelled:'badge-muted' };
const BOOKING_TYPES  = ['Xem nhà mẫu','Tư vấn tại VP','Xem VR online','Khác'];

function renderLeads(el) {
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

function deleteLead(id) {
  S.leads = S.leads.filter(l=>l.id!==id);
  render('leads', document.getElementById('p-leads'));
  toast('Đã xoá lead', 'ok');
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
  `, () => {
    const idx = S.leads.findIndex(x=>x.id===id);
    if (idx < 0) return;
    S.leads[idx] = { ...l,
      name:     document.getElementById('lp-name').value,
      phone:    document.getElementById('lp-phone').value,
      email:    document.getElementById('lp-email').value,
      zalo:     document.getElementById('lp-zalo').value,
      unitType: document.getElementById('lp-type').value,
      budget:   document.getElementById('lp-budget').value,
      source:   document.getElementById('lp-source').value,
      status:   document.getElementById('lp-status').value,
      assignee: document.getElementById('lp-assign').value,
      purpose:  document.getElementById('lp-purpose').value,
      notes:    document.getElementById('lp-notes').value,
    };
    closePanel();
    render('leads', document.getElementById('p-leads'));
    toast('Đã cập nhật lead', 'ok');
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
  `, () => {
    const name  = document.getElementById('al-name').value.trim();
    const phone = document.getElementById('al-phone').value.trim();
    if (!name || !phone) { toast('Vui lòng nhập họ tên và số điện thoại','err'); return; }
    const newId = (S.leads.reduce((m,l)=>Math.max(m,l.id),0)||0) + 1;
    S.leads.unshift({
      id: newId,
      name, phone,
      email:    document.getElementById('al-email').value.trim(),
      zalo:     document.getElementById('al-zalo').value.trim(),
      unitType: document.getElementById('al-type').value,
      budget:   document.getElementById('al-budget').value,
      purpose:  document.getElementById('al-purpose').value,
      timing:   document.getElementById('al-timing').value,
      source:   document.getElementById('al-source').value,
      status:   'new',
      createdAt:new Date().toISOString().slice(0,16),
      assignee: document.getElementById('al-assign').value,
      notes:    document.getElementById('al-notes').value,
      manual:   true,
    });
    closePanel();
    render('leads', document.getElementById('p-leads'));
    toast('Đã thêm lead thủ công', 'ok');
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

function deleteBooking(id) {
  S.bookings = S.bookings.filter(b=>b.id!==id);
  render('leads', document.getElementById('p-leads'));
  toast('Đã xoá lịch hẹn', 'ok');
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

function openAddBookingPanel() {
  showPanel('Đặt Lịch Hẹn Thủ Công', bookingFormHTML(), () => {
    const name  = document.getElementById('ab-name').value.trim();
    const phone = document.getElementById('ab-phone').value.trim();
    const date  = document.getElementById('ab-date').value;
    const time  = document.getElementById('ab-time').value;
    if (!name || !phone || !date || !time) { toast('Vui lòng nhập tên, SĐT, ngày và giờ','err'); return; }
    const leadId = parseInt(document.getElementById('ab-lead').value) || null;
    const newId = (S.bookings.reduce((m,b)=>Math.max(m,b.id),0)||0) + 1;
    S.bookings.unshift({
      id: newId, leadId, name, phone, date, time,
      type:     document.getElementById('ab-type').value,
      assignee: document.getElementById('ab-assign').value,
      status:   document.getElementById('ab-status').value,
      notes:    document.getElementById('ab-notes').value,
      createdAt:new Date().toISOString().slice(0,16),
      manual:   true,
    });
    closePanel();
    render('leads', document.getElementById('p-leads'));
    toast('Đã đặt lịch hẹn', 'ok');
  });
}

function openEditBookingPanel(id) {
  const b = S.bookings.find(x=>x.id===id); if (!b) return;
  showPanel('Cập Nhật Lịch Hẹn', bookingFormHTML(b), () => {
    const idx = S.bookings.findIndex(x=>x.id===id); if (idx<0) return;
    S.bookings[idx] = { ...b,
      leadId:   parseInt(document.getElementById('ab-lead').value) || null,
      name:     document.getElementById('ab-name').value,
      phone:    document.getElementById('ab-phone').value,
      date:     document.getElementById('ab-date').value,
      time:     document.getElementById('ab-time').value,
      type:     document.getElementById('ab-type').value,
      assignee: document.getElementById('ab-assign').value,
      status:   document.getElementById('ab-status').value,
      notes:    document.getElementById('ab-notes').value,
    };
    closePanel();
    render('leads', document.getElementById('p-leads'));
    toast('Đã cập nhật lịch hẹn', 'ok');
  });
}

// ——— DANH SÁCH VR (np-list) ———————————————————
function renderNavPanel(el) {
  const m = menu();
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Nội Dung VR</div><h1>Danh Sách VR</h1></div>
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm" onclick="openAddGroupPanel()">+ Thêm Danh Mục</button>
        <button class="btn btn-primary btn-sm" onclick="toast('Đã lưu thứ tự danh sách VR','ok')">${ico('save')} Lưu Thứ Tự</button>
      </div>
    </div>
    <p class="c-muted" style="margin-bottom:16px;font-size:13px">
      Quản lý danh sách điểm tham quan VR360. Kéo thả để sắp xếp thứ tự. Mỗi điểm có link riêng tới cảnh VR tương ứng.
    </p>
    <div class="np-list" id="np-list">
      ${Object.entries(GROUP_META).map(([key, meta]) => renderNpGroup(key, meta, m[key]||[])).join('')}
    </div>
  `;
  initNpDrag();
}

function renderNpGroup(key, meta, items) {
  return `
    <div class="np-group" data-group="${key}" draggable="true">
      <div class="np-group-head">
        <span class="np-drag-handle" title="Kéo để sắp xếp">${ico('grip',14)}</span>
        <span class="np-group-icon">${ico(meta.icon, 16)}</span>
        <span class="np-group-name">${meta.label}</span>
        <span class="np-group-count">${items.length} điểm</span>
        <div class="np-group-actions">
          <button class="btn btn-secondary btn-xs" onclick="openAddCardPanel('${key}')">+ Thêm</button>
          <button class="btn btn-secondary btn-xs" onclick="openEditGroupPanel('${key}')">${ico('edit')}</button>
        </div>
      </div>
      <div class="np-cards" id="cards-${key}" data-group="${key}">
        ${items.length ? items.map(item => renderNpCard(key, item)).join('') : `<div class="np-empty c-muted">Chưa có điểm nào — nhấn <b>+ Thêm</b> để thêm điểm VR</div>`}
        <div class="np-add-card" onclick="openAddCardPanel('${key}')">
          <span>＋</span> <span>Thêm điểm VR360</span>
        </div>
      </div>
    </div>
  `;
}

function renderNpCard(groupKey, item) {
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
        <button class="act-btn" onclick="openEditCardPanel('${groupKey}','${item.id}')">${ico('edit')}</button>
        <button class="act-btn danger" onclick="deleteNpCard('${groupKey}','${item.id}')">${ico('trash')}</button>
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

async function openAddCardPanel(groupKey) {
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
    if (!S.data.menu[groupKey]) S.data.menu[groupKey] = [];
    S.data.menu[groupKey].push(newItem);
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

async function openEditCardPanel(groupKey, itemId) {
  const group = S.data.menu[groupKey]||[];
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
      <label class="form-label">Ảnh bìa (cover)</label>
      <div style="display:flex;gap:8px;margin-bottom:6px">
        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('ec-cover-file').click()">${ico('upload',12)} Tải ảnh lên</button>
        <input type="file" id="ec-cover-file" accept="image/*" style="display:none" onchange="subdivPickCover(this)">
      </div>
      <input class="form-control" id="ec-sub-cover" value="${esc((item.subdivision&&item.subdivision.cover)||'')}" placeholder="https://... hoặc img/...">
      <img id="ec-cover-preview" src="${(item.subdivision&&item.subdivision.cover)?(/^(data:|https?:)/.test(item.subdivision.cover)?item.subdivision.cover:'../'+item.subdivision.cover):''}" style="${(item.subdivision&&item.subdivision.cover)?'':'display:none;'}width:100%;max-height:140px;object-fit:cover;border-radius:6px;margin-top:8px" alt="">
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
function ecMediaUpload(input) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  window.__ecImages = window.__ecImages || [];
  let pending = files.length;
  files.forEach(f => {
    const r = new FileReader();
    r.onload = () => {
      window.__ecImages.push(r.result);
      if (--pending === 0) ecMediaRefresh();
    };
    r.readAsDataURL(f);
  });
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

/* Upload ảnh bìa phân khu — đọc thành data URL, điền vào ô + preview */
function subdivPickCover(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const inp = document.getElementById('ec-sub-cover');
    const img = document.getElementById('ec-cover-preview');
    if (inp) inp.value = reader.result;
    if (img) { img.src = reader.result; img.style.display = ''; }
  };
  reader.readAsDataURL(file);
}

function deleteNpCard(groupKey, itemId) {
  confirmDel('Xoá điểm VR360 này?', 'Hành động không thể hoàn tác.', () => {
    S.data.menu[groupKey] = (S.data.menu[groupKey]||[]).filter(x=>x.id!==itemId);
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
      // Sync to data
      const gKey = container.dataset.group;
      if (gKey && S.data.menu[gKey]) {
        const newOrder = [...container.querySelectorAll('.np-card')].map(c=>c.dataset.id);
        S.data.menu[gKey].sort((a,b)=>newOrder.indexOf(a.id)-newOrder.indexOf(b.id));
      }
      toast('Đã sắp xếp lại điểm', 'ok');
    });
  });
}

// ——— PANORAMA BROWSER ——————————————————————————————————
function renderScenes(el) {
  const panos = _panoramaCache || [];
  // Collect which panoramas are currently assigned to menu items
  const assigned = new Map();
  for (const [gKey, items] of Object.entries(S.data.menu || {})) {
    for (const item of items) {
      if (item.tdvPanoramaId) {
        if (!assigned.has(item.tdvPanoramaId)) assigned.set(item.tdvPanoramaId, []);
        assigned.get(item.tdvPanoramaId).push(item.label);
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
const i18n = {
  'ui.bookNow':    { vi:'Đặt lịch tư vấn',     en:'Book a Consultation', zh:'预约咨询', ko:'상담 예약' },
  'ui.viewVR':     { vi:'Tham quan VR 360°',    en:'Virtual Tour 360°',  zh:'VR 360° 参观', ko:'VR 360° 투어' },
  'ui.priceList':  { vi:'Bảng giá',             en:'Price List',         zh:'价格表',   ko:'가격표' },
  'modal.title':   { vi:'Đặt lịch xem căn hộ', en:'Schedule a Viewing', zh:'预约看房',  ko:'관람 예약' },
  'modal.name':    { vi:'Họ và tên',            en:'Full Name',          zh:'姓名',    ko:'성명' },
  'modal.phone':   { vi:'Số điện thoại',        en:'Phone Number',       zh:'电话号码', ko:'전화번호' },
  'modal.submit':  { vi:'Gửi đăng ký',          en:'Submit',             zh:'提交',    ko:'제출' },
  'tour.scene':    { vi:'Cảnh VR',              en:'VR Scene',           zh:'VR 场景', ko:'VR 장면' },
  'ai.greeting':   { vi:'Xin chào! Tôi là trợ lý Vinhomes.', en:'Hello! I am Vinhomes assistant.', zh:'你好！我是Vinhomes助手。', ko:'' },
};

const I18N_LANG_NAMES = { VI:'Tiếng Việt', EN:'English', ZH:'中文', KO:'한국어', JA:'日本語', FR:'Français', DE:'Deutsch', ES:'Español', RU:'Русский', TH:'ไทย' };

function addI18nLang() {
  const existing = (S.i18nLangs || ['VI']).map(l => l.toUpperCase());
  const choices = Object.keys(I18N_LANG_NAMES).filter(l => !existing.includes(l));
  const opts = choices.map(l => `<option value="${l}">${l} — ${I18N_LANG_NAMES[l]}</option>`).join('');
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
      <input class="form-control" id="il-code" placeholder="VD: IT, PT, AR" maxlength="3">
    </div>
    <div class="form-group">
      <label class="form-label">Tên hiển thị (tuỳ chọn)</label>
      <input class="form-control" id="il-name" placeholder="VD: Italiano">
    </div>
  `, () => {
    const pick = document.getElementById('il-pick').value;
    const code = (document.getElementById('il-code').value || '').trim().toUpperCase();
    const name = document.getElementById('il-name').value.trim();
    const lang = pick || code;
    if (!lang) { toast('Chọn hoặc nhập mã ngôn ngữ', 'warn'); return; }
    if ((S.i18nLangs || []).includes(lang)) { toast('Ngôn ngữ đã tồn tại', 'warn'); return; }
    S.i18nLangs = [...(S.i18nLangs || ['VI']), lang];
    if (name && !I18N_LANG_NAMES[lang]) I18N_LANG_NAMES[lang] = name;
    const lk = lang.toLowerCase();
    Object.values(i18n).forEach(vals => { if (!(lk in vals)) vals[lk] = ''; });
    S.i18nLang = lang;
    closePanel();
    render('i18n', document.getElementById('p-i18n'));
    toast(`Đã thêm ngôn ngữ ${lang}`, 'ok');
  });
}

function removeI18nLang(lang) {
  if (lang === 'VI') { toast('Không thể xoá ngôn ngữ gốc', 'warn'); return; }
  confirmDel(`Xoá ngôn ngữ ${lang}?`, 'Toàn bộ bản dịch của ngôn ngữ này sẽ bị xoá.', () => {
    S.i18nLangs = (S.i18nLangs || ['VI']).filter(l => l !== lang);
    const lk = lang.toLowerCase();
    Object.values(i18n).forEach(vals => { delete vals[lk]; });
    if (S.i18nLang === lang) S.i18nLang = 'VI';
    render('i18n', document.getElementById('p-i18n'));
    toast(`Đã xoá ngôn ngữ ${lang}`, 'ok');
  });
}

function renderI18n(el) {
  if (!S.i18nLangs || !S.i18nLangs.length) S.i18nLangs = ['VI'];
  if (!S.i18nLangs.includes(S.i18nLang)) S.i18nLang = 'VI';
  const lang = S.i18nLang;
  const lk   = lang.toLowerCase();
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Ngôn Ngữ</div><h1>Quản Lý Ngôn Ngữ & i18n</h1></div>
      <div class="btn-group">
        <button class="btn btn-primary btn-sm" onclick="addI18nLang()">+ Thêm ngôn ngữ mới</button>
        <button class="btn btn-secondary btn-sm" onclick="toast('Đang dịch tự động…','info')">${ico('refresh',14)} Auto-translate thiếu</button>
        <button class="btn btn-secondary btn-sm" onclick="toast('Đang xuất JSON…','info')">${ico('download')} Export JSON</button>
      </div>
    </div>
    <div class="tabs">
      ${S.i18nLangs.map(l => `
        <div class="tab ${lang===l?'active':''}" onclick="S.i18nLang='${l}';render('i18n',document.getElementById('p-i18n'))" title="${I18N_LANG_NAMES[l]||l}">
          ${l}${l!=='VI' ? ` <span style="margin-left:6px;opacity:.55;cursor:pointer" onclick="event.stopPropagation();removeI18nLang('${l}')" title="Xoá">×</span>` : ''}
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr><th>Key</th><th>Namespace</th><th>VI (gốc)</th><th>${lang} (dịch)</th><th>Trạng thái</th></tr></thead>
          <tbody>
            ${Object.entries(i18n).map(([key,vals]) => {
              const ns    = key.split('.')[0];
              const vi    = vals.vi||'';
              const trans = vals[lk]||'';
              const status = lang==='VI' ? '<span class="badge badge-ok">Gốc</span>' :
                !trans      ? `<span class="badge badge-warning">${ico('warning',12)} Thiếu</span>` :
                              '<span class="badge badge-ok">OK</span>';
              return `<tr>
                <td class="mono" style="font-size:12px">${key}</td>
                <td><span class="badge badge-muted">${ns}</span></td>
                <td class="c-muted">${vi}</td>
                <td ${lang!=='VI'?`contenteditable="true" onblur="i18n['${key}']['${lk}']=this.textContent;toast('Đã lưu','ok')"`:''}
                    style="${lang!=='VI'?'min-width:160px;cursor:text':''}">${lang==='VI'?vi:trans}</td>
                <td>${status}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
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

function saveTheme()  { S.themeUnsaved=false; toast('Đã lưu theme','ok'); document.getElementById('theme-save-state').textContent='Đã lưu lúc '+new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}); }
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
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Dashboard</span> / Analytics</div><h1>Analytics & Báo Cáo</h1></div>
      <div class="btn-group">
        ${['Hôm nay','7 ngày','30 ngày','Tháng này'].map((t,i)=>`<button class="btn ${i===1?'btn-primary':'btn-secondary'} btn-sm">${t}</button>`).join('')}
      </div>
    </div>
    <div class="atab-row">
      ${[['views',`${ico('overview',14)} Lượt Xem`],['vr',`${ico('video',14)} VR Engagement`],['conv',`${ico('trending',14)} Chuyển Đổi`],['leads',`${ico('leads',14)} Leads`]].map(([id,label])=>`
        <div class="atab ${S.analyticsTab===id?'active':''}" onclick="S.analyticsTab='${id}';render('analytics',document.getElementById('p-analytics'))">${label}</div>`).join('')}
    </div>
    <div id="atab-content">${analyticsTabHTML()}</div>
  `;
  setTimeout(drawAnalyticsCharts, 30);
}

function analyticsTabHTML() {
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
  if (t==='conv') return `
    <div class="card" style="max-width:600px"><div class="card-header"><span class="card-title">Phễu Chuyển Đổi</span></div><div class="card-body">
      ${[['Lượt xem trang',2847,100],['Mở Bảng Giá',1480,52],['Mở Form Đặt Lịch',640,22.5],['Điền Form',320,11.2],['Submit thành công',186,6.5]].map(([s,v,p])=>`
        <div class="funnel-item">
          <div class="funnel-row"><span>${s}</span><span class="fw6">${v.toLocaleString()} (${p}%)</span></div>
          <div class="funnel-bar-bg"><div class="funnel-bar" style="width:${p}%"></div></div>
        </div>`).join('')}
    </div></div>`;
  return `
    <div class="g2">
      <div class="card"><div class="card-header"><span class="card-title">Leads Theo Ngày</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-lday"></canvas></div></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Leads Theo Nguồn</span></div><div class="card-body"><div class="chart-wrap"><canvas id="ac-lsrc"></canvas></div></div></div>
    </div>`;
}

function drawAnalyticsCharts() {
  if (!window.Chart) return;
  const xOpts = (label) => ({
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ display:label, labels:{ color:'#64748b', font:{size:11} } } },
    scales:{ x:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}}, y:{ticks:{color:'#94a3b8',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}} }
  });
  const donut = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{color:'#64748b',font:{size:11}} } } };
  const days = ['T2','T3','T4','T5','T6','T7','CN'];
  const panos = _panoramaCache || [];
  if (document.getElementById('ac-daily')) new Chart('ac-daily',{type:'line',data:{labels:days,datasets:[{label:'Sessions',data:[320,410,380,490,560,720,840],borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,.1)',tension:.4,fill:true}]},options:xOpts(false)});
  if (document.getElementById('ac-device')) new Chart('ac-device',{type:'doughnut',data:{labels:['Desktop','Mobile','Tablet'],datasets:[{data:[58,35,7],backgroundColor:['#3b82f6','#10b981','#f59e0b'],borderWidth:0}]},options:donut});
  if (document.getElementById('ac-scenes2')) {
    const labels = panos.length ? panos.slice(0,6).map(p=>p.name) : ['pano-01','pano-02','pano-03','pano-04','pano-05'];
    const data   = [1240,980,820,710,650,540].slice(0,labels.length);
    new Chart('ac-scenes2',{type:'bar',data:{labels,datasets:[{data,backgroundColor:'rgba(59,130,246,.6)',borderRadius:4}]},options:{indexAxis:'y',...xOpts(false)}});
  }
  if (document.getElementById('ac-ai')) new Chart('ac-ai',{type:'doughnut',data:{labels:['Dùng Voice AI','Không dùng'],datasets:[{data:[32,68],backgroundColor:['#7c3aed','#e2e8f0'],borderWidth:0}]},options:donut});
  if (document.getElementById('ac-lday')) new Chart('ac-lday',{type:'bar',data:{labels:days,datasets:[{label:'Leads',data:[3,5,4,8,6,12,10],backgroundColor:'rgba(16,185,129,.6)',borderRadius:4}]},options:xOpts(false)});
  if (document.getElementById('ac-lsrc')) new Chart('ac-lsrc',{type:'doughnut',data:{labels:['VR Web','Zalo OA','Hotline','Facebook Ads','Sàn BĐS','Walk-in','Giới thiệu','Khác'],datasets:[{data:[42,18,10,12,8,4,4,2],backgroundColor:['#3b82f6','#10b981','#22c55e','#f59e0b','#06b6d4','#ef4444','#7c3aed','#94a3b8'],borderWidth:0}]},options:donut});
}

// ——— SETTINGS ————————————————————————————————
const mockUsers = [
  { name:'Nguyễn Admin', email:'admin@aurora.vn',   role:'Admin',          status:'active',   last:'2026-05-15 09:30' },
  { name:'Trần Sales A',  email:'salesa@aurora.vn',  role:'Sales Manager',  status:'active',   last:'2026-05-15 08:15' },
  { name:'Lê Content',    email:'content@aurora.vn', role:'Content Editor', status:'active',   last:'2026-05-14 17:00' },
  { name:'Phạm Dev',      email:'dev@aurora.vn',     role:'Developer',      status:'inactive', last:'2026-05-10 12:00' },
];

/* ===== USER (Sales) MANAGEMENT ===== */
function userAdd() {
  const blank = { username: '', name: '', title: '', phone: '', zalo: '', facebook: '', email: '', avatar: '' };
  userForm(blank, -1);
}
function userEdit(idx) {
  const u = (S.data.sales || [])[idx];
  if (!u) return;
  userForm({ ...u }, idx);
}
function userDel(idx) {
  const u = (S.data.sales || [])[idx];
  if (!u) return;
  confirmDel(
    `Xoá nhân viên Sales <b>${esc(u.name||'')}</b>?`,
    'Hành động này không thể hoàn tác.',
    () => {
      S.data.sales.splice(idx, 1);
      saveData('Đã xoá nhân viên Sales');
      render('settings', document.getElementById('p-settings'));
    }
  );
}
function userForm(u, idx) {
  const isNew = idx < 0;
  const body = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
      <div id="u-avatar-prev" style="width:64px;height:64px;border-radius:50%;background:var(--surface2);border:1px solid var(--border);overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--muted);font-weight:700;font-size:20px">
        ${u.avatar
          ? `<img src="${esc(u.avatar)}" style="width:100%;height:100%;object-fit:cover">`
          : esc((u.name||'?').trim().split(/\s+/).pop()[0] || '?')}
      </div>
      <div style="flex:1;min-width:0">
        <div class="fw6" style="font-size:15px">${isNew ? 'Thêm nhân viên Sales' : esc(u.name||'')}</div>
        <div class="c-muted" style="font-size:12px">${isNew ? 'Tạo tài khoản mới · login tại trang index' : 'Chỉnh sửa profile · hiển thị trên trang VR khi khách chọn liên hệ'}</div>
      </div>
    </div>

    <div class="form-section">Tài khoản</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Username <span class="req">*</span></label>
        <input class="form-control" id="u-username" value="${esc(u.username||'')}" placeholder="VD: sales" ${isNew?'':'readonly style="background:var(--surface2);color:var(--muted)"'}>
        ${isNew ? '<small class="form-hint">Dùng để đăng nhập admin. Không đổi được sau khi tạo.</small>' : '<small class="form-hint c-muted">Username không thể chỉnh sửa.</small>'}
      </div>
      <div class="form-group">
        <label class="form-label">Họ và tên <span class="req">*</span></label>
        <input class="form-control" id="u-name" value="${esc(u.name||'')}" placeholder="VD: Nguyễn Minh Anh">
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Chức danh</label>
      <input class="form-control" id="u-title" value="${esc(u.title||'')}" placeholder="VD: Chuyên viên tư vấn cao cấp">
    </div>

    <div class="form-section">Liên hệ</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Điện thoại</label>
        <input class="form-control" id="u-phone" value="${esc(u.phone||'')}" placeholder="VD: 0911 222 333">
      </div>
      <div class="form-group">
        <label class="form-label">Zalo</label>
        <input class="form-control" id="u-zalo" value="${esc(u.zalo||'')}" placeholder="VD: 0911222333">
        <small class="form-hint">Số Zalo (không có dấu cách)</small>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-control" type="email" id="u-email" value="${esc(u.email||'')}" placeholder="ten@auroraheights.vn">
    </div>

    <div class="form-group">
      <label class="form-label">Facebook URL</label>
      <input class="form-control" type="url" id="u-facebook" value="${esc(u.facebook||'')}" placeholder="https://facebook.com/...">
    </div>

    <div class="form-section">Ảnh đại diện</div>
    ${imageField('u-avatar', 'Avatar', u.avatar||'')}
  `;
  showPanel(isNew ? 'Thêm nhân viên Sales' : 'Sửa thông tin Sales', body, () => userSave(idx));
}

function userSave(idx) {
  const g = id => (document.getElementById(id)?.value || '').trim();
  const isNew = idx < 0;

  const username = g('u-username').toLowerCase();
  const name = g('u-name');
  if (!username) { toast('Vui lòng nhập Username', 'warn'); return; }
  if (!name)     { toast('Vui lòng nhập Họ và tên', 'warn'); return; }
  if (!/^[a-z0-9_.-]+$/.test(username)) { toast('Username chỉ dùng a-z, 0-9, _ . -', 'warn'); return; }

  S.data.sales = S.data.sales || [];
  if (isNew && S.data.sales.some(s => (s.username||'').toLowerCase() === username)) {
    toast('Username đã tồn tại', 'err'); return;
  }

  const payload = {
    username,
    name,
    title:    g('u-title'),
    phone:    g('u-phone'),
    zalo:     g('u-zalo'),
    facebook: g('u-facebook'),
    email:    g('u-email'),
    avatar:   (document.getElementById('u-avatar-val')?.value || '').trim()
  };

  if (isNew) S.data.sales.push(payload);
  else {
    // Keep username immutable on edit
    payload.username = S.data.sales[idx].username;
    S.data.sales[idx] = payload;
  }

  closePanel();
  saveData(isNew ? 'Đã thêm nhân viên Sales' : 'Đã cập nhật thông tin Sales');
  render('settings', document.getElementById('p-settings'));
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
        ${[['project',`${ico('hardhat',14)} Dự án`],['api',`${ico('plug',14)} API & Tích hợp`],['users',`${ico('users',14)} Người dùng`],['backup',`${ico('harddrive',14)} Backup`]].map(([id,l])=>`
          <div class="vtab ${S.settingsTab===id?'active':''}" onclick="S.settingsTab='${id}';render('settings',document.getElementById('p-settings'))">${l}</div>`).join('')}
      </div>
      <div class="vtab-content">${settingsTabHTML(p)}</div>
    </div>
  `;
}

function settingsTabHTML(p) {
  const VALID_TABS = ['project','api','users','backup'];
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
    const salesList = (S.data && S.data.sales) ? S.data.sales : [];
    return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Quản Lý Người Dùng</span>
        <button class="btn btn-primary btn-sm" onclick="userAdd()">${ico('plus')} Thêm Sales</button>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr>
            <th>Sales</th><th>Username</th><th>Chức danh</th><th>Điện thoại</th><th>Zalo</th><th>Email</th><th>Facebook</th><th>Thao tác</th>
          </tr></thead>
          <tbody>
            ${salesList.length === 0 ? `
              <tr><td colspan="8" style="text-align:center;padding:32px;color:var(--muted)">Chưa có nhân viên Sales nào. Bấm <b>+ Thêm Sales</b> để bắt đầu.</td></tr>
            ` : salesList.map((u,i)=>`
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    ${u.avatar
                      ? `<img src="${esc(u.avatar)}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0">`
                      : `<div class="user-av">${esc((u.name||'?').trim().split(/\\s+/).pop()[0])}</div>`}
                    <span class="fw6">${esc(u.name||'(chưa đặt tên)')}</span>
                  </div>
                </td>
                <td class="mono" style="font-size:12px">${esc(u.username||'')}</td>
                <td class="c-muted">${esc(u.title||'')}</td>
                <td class="mono" style="font-size:12px">${esc(u.phone||'')}</td>
                <td class="mono" style="font-size:12px">${esc(u.zalo||'')}</td>
                <td class="mono c-muted" style="font-size:12px">${esc(u.email||'')}</td>
                <td style="font-size:12px">${u.facebook ? `<a class="link" href="${esc(u.facebook)}" target="_blank" rel="noopener">${ico('link',12)} Facebook</a>` : '<span class="c-muted">—</span>'}</td>
                <td><div class="row-actions">
                  <button class="act-btn" title="Sửa thông tin" onclick="userEdit(${i})">${ico('edit')}</button>
                  <button class="act-btn danger" title="Xoá" onclick="userDel(${i})">${ico('trash')}</button>
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
          <b>Lưu ý:</b> Dữ liệu admin đang lưu trong <code>localStorage</code> của trình duyệt. Bấm <b>Export</b> để tải file <code>project.json</code> đã sửa rồi thay tay vào thư mục <code>data/</code> để frontend đọc.
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

function confirmDel(title, sub, onOk) {
  document.getElementById('cm-title').innerHTML   = title;
  document.getElementById('cm-sub').textContent   = sub;
  document.getElementById('cm-ok').onclick        = () => { document.getElementById('cm-back').classList.remove('open'); onOk(); };
  document.getElementById('cm-back').classList.add('open');
}
function closeConfirm() { document.getElementById('cm-back').classList.remove('open'); }

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
  // Populate topbar user info from session
  const _sess = JSON.parse(sessionStorage.getItem('ah_session') || 'null');
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

  // Simulate real-time feed
  setInterval(() => {
    const feed = document.getElementById('feed');
    if (!feed) return;
    const msgs = [
      ['b', `<b>${['Trần Văn B','Lê Thị C','Phạm Đ'][Math.floor(Math.random()*3)]}</b> vừa xem trang VR`],
      ['g', `<b>${Math.floor(8+Math.random()*15)} người</b> đang online ngay lúc này`],
      ['y', 'Lead mới từ kênh <b>Zalo OA</b>'],
    ];
    const [dot, msg] = msgs[Math.floor(Math.random()*msgs.length)];
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `<div class="feed-dot ${dot}"></div><div class="feed-msg">${msg}</div><div class="feed-time">Vừa xong</div>`;
    item.style.animation = 'fadein .3s ease';
    feed.insertBefore(item, feed.firstChild);
    if (feed.children.length > 10) feed.lastChild.remove();
  }, 9000);
}

document.addEventListener('DOMContentLoaded', init);
