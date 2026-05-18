'use strict';
// ——— ICON HELPER ————————————————————————————————
const ICO = {
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
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

// ——— STATE ————————————————————————————————————
const S = {
  page: 'dashboard', data: null, leads: [],
  charts: {}, calFilter: 'all', calView: 'list', weekStart: null,
  settingsTab: 'profile',
  exportFilter: { from:'', to:'', source:'', unitType:'', budget:'' },
  exportCols: { name:true, phone:true, email:true, zalo:true, unitType:true, budget:true, purpose:true, source:true, status:true, createdAt:true, appt:false, assignee:false, notes:false },
};

// ——— LEAD STATUS ————————————————————————————————
const LEAD_STATUS = { new:'Mới', called:'Đã gọi', interested:'Đang quan tâm', closed:'Đã chốt', stopped:'Không tiếp tục' };
const LEAD_BADGE  = { new:'badge-info', called:'badge-warning', interested:'badge-primary', closed:'badge-ok', stopped:'badge-muted' };
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
const SOURCE_BADGE = {
  'VR Web':'badge-purple','Live Chat website':'badge-purple',
  'Google Ads':'badge-warning','Facebook Ads':'badge-warning','Zalo Ads':'badge-warning',
  'Facebook':'badge-primary','TikTok':'badge-primary','YouTube':'badge-primary','Instagram':'badge-primary',
  'Batdongsan.com.vn':'badge-info','Chợ Tốt Nhà':'badge-info','Mogi':'badge-info','Alonhadat':'badge-info','Nhà Tốt':'badge-info',
  'Sàn F1':'badge-purple','Cộng tác viên':'badge-purple',
  'Hotline':'badge-ok','Telesale':'badge-warning','Zalo OA':'badge-ok','Zalo cá nhân':'badge-ok','Email':'badge-info','SMS / Brandname':'badge-info',
  'Walk-in':'badge-warning','Sự kiện':'badge-purple','Banner / Tờ rơi':'badge-muted','Báo chí / PR':'badge-muted',
  'Giới thiệu':'badge-info','Khách cũ':'badge-ok','Re-marketing':'badge-warning','Khác':'badge-muted',
  'Zalo':'badge-ok','Call':'badge-warning',
};
function sourceOptions(selected='') {
  return Object.entries(SOURCE_GROUPS).map(([g,items]) =>
    `<optgroup label="${g}">${items.map(s=>`<option ${selected===s?'selected':''}>${s}</option>`).join('')}</optgroup>`
  ).join('');
}

// ——— Searchable combobox cho nguồn lead ———————
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
  let html = '', count = 0;
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
document.addEventListener('click', e => {
  if (!e.target.closest('.combo')) document.querySelectorAll('.combo.open').forEach(c => c.classList.remove('open'));
});

// ——— ACCESSORS ———————————————————————————————
const units  = () => S.data?.floorplan?.units || [];
const scenes = () => S.data?.scenes           || [];
const proj   = () => S.data?.project          || {};
const menu   = () => S.data?.menu             || {};

// ——— LOAD DATA ————————————————————————————————
async function loadData() {
  try {
    const r = await fetch('../data/project.json');
    S.data = await r.json();
  } catch {
    S.data = { project:{}, menu:{}, scenes:[], floorplan:{units:[]} };
  }
  S.leads = getMockLeads();
}

function getMockLeads() {
  return [
    { id:1,  name:'Nguyễn Văn An',    phone:'0901234567', email:'an@gmail.com',    zalo:'0901234567', unitType:'3PN',        budget:'8–12 tỷ', purpose:'Ở thực',  timing:'Trong 3 tháng', source:'VR Web',      status:'new',        createdAt:'2026-05-15T08:30', assignee:'Sales A', notes:'',                       appt: null },
    { id:2,  name:'Trần Thị Bích',    phone:'0912345678', email:'bich@gmail.com',  zalo:'',           unitType:'2PN',        budget:'5–8 tỷ',  purpose:'Đầu tư',  timing:'Trong 6 tháng', source:'Zalo',        status:'called',     createdAt:'2026-05-14T14:00', assignee:'Sales B', notes:'Đã gọi lần 1',           appt: '2026-05-20T10:00' },
    { id:3,  name:'Lê Minh Cường',    phone:'0923456789', email:'',               zalo:'0923456789', unitType:'Duplex 3PN', budget:'> 12 tỷ', purpose:'Ở thực',  timing:'Trong 1 tháng', source:'Giới thiệu',  status:'interested', createdAt:'2026-05-13T10:15', assignee:'Sales A', notes:'Khách VIP',              appt: '2026-05-17T14:30' },
    { id:4,  name:'Phạm Thu Dung',    phone:'0934567890', email:'dung@mail.vn',   zalo:'0934567890', unitType:'3PN',        budget:'8–12 tỷ', purpose:'Cho thuê', timing:'Hơn 6 tháng', source:'Call',         status:'closed',     createdAt:'2026-05-12T16:00', assignee:'Sales C', notes:'Đã chốt căn A-3BR-104-35', appt: null },
    { id:5,  name:'Hoàng Đức Em',     phone:'0945678901', email:'em@mail.com',    zalo:'',           unitType:'2PN',        budget:'< 5 tỷ',  purpose:'Đầu tư',  timing:'Hơn 6 tháng', source:'VR Web',       status:'stopped',    createdAt:'2026-05-11T09:00', assignee:'Sales B', notes:'Không phù hợp ngân sách', appt: null },
    { id:6,  name:'Vũ Thị Giang',     phone:'0956789012', email:'giang@vn.vn',   zalo:'0956789012', unitType:'3PN',        budget:'8–12 tỷ', purpose:'Ở thực',  timing:'Trong 3 tháng', source:'VR Web',       status:'new',        createdAt:'2026-05-15T10:00', assignee:'',       notes:'',                       appt: '2026-05-22T09:00' },
    { id:7,  name:'Đoàn Quốc Hùng',   phone:'0967890123', email:'hung@corp.vn',  zalo:'',           unitType:'2PN',        budget:'5–8 tỷ',  purpose:'Đầu tư',  timing:'Trong 3 tháng', source:'Giới thiệu',  status:'interested', createdAt:'2026-05-10T11:00', assignee:'Sales A', notes:'Cần xem căn mẫu',         appt: '2026-05-19T15:00' },
    { id:8,  name:'Ngô Thanh Liêm',   phone:'0978901234', email:'liem@mail.com', zalo:'0978901234', unitType:'3PN',        budget:'8–12 tỷ', purpose:'Ở thực',  timing:'Trong 1 tháng', source:'Call',         status:'called',     createdAt:'2026-05-09T13:00', assignee:'Sales C', notes:'',                       appt: null },
  ];
}

// ——— ROUTER ———————————————————————————————————
document.addEventListener('DOMContentLoaded', async () => {
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
  document.querySelectorAll('.nav-item[data-p]').forEach(el => {
    el.addEventListener('click', () => nav(el.dataset.p));
  });
  nav('dashboard');
});

function nav(page) {
  S.page = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.p === page));
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('p-' + page);
  if (el) { el.classList.add('active'); render(page, el); }
}

function render(page, el) {
  const map = {
    dashboard: renderDashboard,
    leads:     renderLeads,
    calendar:  renderCalendar,
    units:     renderUnits,
    vr:        renderVR,
    settings:  renderSettings,
  };
  if (map[page]) map[page](el);
}

/* ------------------------------------------------------------------
   Sale profile — seeded from data/project.json (sales[]), then
   per-sale overrides live in localStorage so each browser keeps
   its own contact info private.
   ------------------------------------------------------------------ */
function currentUsername() {
  const s = JSON.parse(sessionStorage.getItem('ah_session') || 'null');
  return (s && s.username) ? s.username : '';
}
function profileKey(u) { return 'ah_sale_profile_' + (u || currentUsername()); }
function getSaleProfile() {
  const u = currentUsername();
  if (!u) return null;
  const seed = ((S.data && S.data.sales) || []).find(s => (s.username || '').toLowerCase() === u.toLowerCase()) || { username: u };
  let override = {};
  try { override = JSON.parse(localStorage.getItem(profileKey(u)) || '{}') || {}; } catch (e) {}
  return { ...seed, ...override };
}
function saveSaleProfile(patch) {
  const u = currentUsername();
  if (!u) return;
  const current = getSaleProfile() || {};
  const next = { ...current, ...patch };
  // strip seed-only fields we don't want to duplicate
  delete next.username;
  localStorage.setItem(profileKey(u), JSON.stringify(next));
}
function referralUrl() {
  const u = currentUsername();
  if (!u) return '';
  // index.html lives one level up from /admin/
  const base = location.origin + location.pathname.replace(/\/admin\/.*$/, '/index.html');
  return base + '?s=' + encodeURIComponent(u);
}

// ——— DASHBOARD ————————————————————————————————
function renderDashboard(el) {
  const total    = S.leads.length;
  const newL     = S.leads.filter(l => l.status === 'new').length;
  const hotL     = S.leads.filter(l => l.status === 'interested').length;
  const closedL  = S.leads.filter(l => l.status === 'closed').length;
  const todayStr = new Date().toISOString().slice(0,10);
  const appts    = S.leads.filter(l => l.appt && l.appt.startsWith(todayStr));
  const upcomingAppts = S.leads.filter(l => l.appt && l.appt > new Date().toISOString()).sort((a,b) => a.appt.localeCompare(b.appt)).slice(0,5);
  const closedPct = total ? Math.round(closedL/total*100) : 0;

  el.innerHTML = `
    <div class="ph">
      <div class="ph-left">
        <div class="breadcrumb"><span>Sales</span> / Dashboard</div>
        <h1>Dashboard Sales</h1>
      </div>
      <div class="ph-right" style="font-size:13px;color:var(--muted)">${new Date().toLocaleDateString('vi-VN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
    </div>

    ${renderReferralCard()}

    <div class="stat-row" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
      ${statCard(ico('leads',22), 'Tổng Leads', total, '', 'primary')}
      ${statCard(ico('bell',22), 'Mới hôm nay', newL, 'chờ xử lý', 'info')}
      ${statCard(ico('trending',22), 'Đang quan tâm', hotL, 'cần follow-up', 'warn')}
      ${statCard(ico('check',22), 'Đã chốt', closedL, `tỷ lệ ${closedPct}%`, 'ok')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">${ico('calendar',14)} Lịch hẹn hôm nay</div>
          <span class="badge ${appts.length ? 'badge-primary' : 'badge-muted'}">${appts.length} cuộc</span>
        </div>
        ${appts.length === 0
          ? `<div style="text-align:center;padding:32px;color:var(--muted);font-size:13px">Không có lịch hẹn hôm nay</div>`
          : `<div style="display:flex;flex-direction:column;gap:8px">
              ${appts.map(l => `
                <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg);border-radius:var(--r)">
                  <div class="avatar" style="width:36px;height:36px;font-size:13px;flex-shrink:0">${l.name.charAt(0)}</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:600;font-size:13px">${l.name}</div>
                    <div style="font-size:12px;color:var(--muted)">${l.phone} · ${l.unitType}</div>
                  </div>
                  <div class="mono" style="font-size:12px;color:var(--primary);font-weight:600">${l.appt ? l.appt.slice(11,16) : ''}</div>
                </div>
              `).join('')}
            </div>`
        }
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">${ico('calendar',14)} Lịch hẹn sắp tới</div>
        </div>
        ${upcomingAppts.length === 0
          ? `<div style="text-align:center;padding:32px;color:var(--muted);font-size:13px">Không có lịch hẹn</div>`
          : `<div style="display:flex;flex-direction:column;gap:6px">
              ${upcomingAppts.map(l => {
                const d = new Date(l.appt);
                return `
                  <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg);border-radius:var(--r)">
                    <div style="min-width:52px;text-align:center;background:#fff;border:1px solid var(--border);border-radius:8px;padding:4px;flex-shrink:0">
                      <div style="font-size:10px;color:var(--muted)">${d.toLocaleDateString('vi-VN',{month:'short'})}</div>
                      <div style="font-size:18px;font-weight:700;color:var(--primary);line-height:1">${d.getDate()}</div>
                    </div>
                    <div style="flex:1;min-width:0">
                      <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.name}</div>
                      <div style="font-size:11px;color:var(--muted)">${l.unitType} · ${d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</div>
                    </div>
                    <span class="badge ${LEAD_BADGE[l.status]}">${LEAD_STATUS[l.status]}</span>
                  </div>
                `;
              }).join('')}
            </div>`
        }
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <div class="card-title">${ico('overview',14)} Phân bổ leads theo trạng thái</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;padding:14px 18px">
        ${Object.entries(LEAD_STATUS).map(([k, label]) => {
          const cnt = S.leads.filter(l => l.status === k).length;
          const pct = total ? Math.round(cnt/total*100) : 0;
          return `
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:120px;font-size:13px;color:var(--text)">${label}</div>
              <div style="flex:1;background:var(--bg);border-radius:4px;height:8px;overflow:hidden">
                <div style="height:100%;border-radius:4px;background:var(--primary);width:${pct}%;transition:width .4s"></div>
              </div>
              <div style="width:60px;text-align:right;font-size:12px;color:var(--muted)">${cnt} (${pct}%)</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function statCard(icon, label, val, sub, type) {
  const colors = { primary:'#3b82f6', info:'#06b6d4', warn:'#f59e0b', ok:'#10b981' };
  const c = colors[type] || colors.primary;
  return `
    <div class="card" style="padding:20px 24px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between">
        <div>
          <div style="font-size:12px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">${label}</div>
          <div style="font-size:32px;font-weight:700;color:var(--text)">${val}</div>
          ${sub ? `<div style="font-size:11px;color:var(--muted);margin-top:4px">${sub}</div>` : ''}
        </div>
        <div style="font-size:24px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:${c}18;border-radius:12px">${icon}</div>
      </div>
    </div>
  `;
}

// ——— REFERRAL LINK CARD ————————————————————————
function renderReferralCard() {
  const url = referralUrl();
  const prof = getSaleProfile();
  if (!url || !prof) return '';
  const missing = !prof.phone && !prof.zalo;
  return `
    <div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(59,130,246,.06));border-color:rgba(16,185,129,.25)">
      <div style="padding:16px 18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="flex:0 0 44px;width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;color:#fff">
          ${ico('link',20)}
        </div>
        <div style="flex:1;min-width:240px">
          <div style="font-size:11px;font-weight:700;color:#10b981;text-transform:uppercase;letter-spacing:.08em">Link giới thiệu của bạn</div>
          <div class="mono" id="ref-url" style="font-size:13px;color:var(--text);margin-top:4px;word-break:break-all">${esc(url)}</div>
          ${missing
            ? `<div style="font-size:12px;color:#f59e0b;margin-top:6px">${ico('warning',12)} Chưa có SĐT/Zalo trong cài đặt — khách vào link sẽ không thấy nút liên hệ. <a href="#" onclick="nav('settings');return false" style="color:var(--primary);font-weight:600">Cập nhật ngay</a></div>`
            : `<div style="font-size:12px;color:var(--muted);margin-top:4px">Khách truy cập link này sẽ thấy thông tin liên hệ của <b>${esc(prof.name||currentUsername())}</b>.</div>`}
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button class="btn btn-secondary btn-sm" onclick="copyReferral()">${ico('link',13)} Sao chép</button>
          <a class="btn btn-primary btn-sm" href="${esc(url)}" target="_blank" rel="noopener">${ico('globe',13)} Mở thử</a>
        </div>
      </div>
    </div>`;
}
function copyReferral() {
  const url = referralUrl();
  if (!url) return;
  (navigator.clipboard?.writeText(url) || Promise.reject()).then(
    () => toast('Đã sao chép link vào clipboard', 'ok'),
    () => {
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Đã sao chép', 'ok'); } catch { toast('Không thể sao chép', 'err'); }
      ta.remove();
    }
  );
}

// ——— SETTINGS (sale profile) ——————————————————
const SETTINGS_TABS = [
  ['profile',  'Hồ sơ',           'users'],
  ['contact',  'Liên hệ',         'phone'],
  ['social',   'Mạng xã hội',     'link'],
  ['referral', 'Link giới thiệu', 'globe'],
  ['export',   'Export khách hàng','download'],
];
const SOCIAL_PLATFORMS = [
  ['zalo',      'Zalo',      'Số Zalo (không khoảng trắng)', '0901234567'],
  ['facebook',  'Facebook',  'URL trang/profile Facebook',   'https://facebook.com/your.page'],
  ['tiktok',    'TikTok',    'URL kênh TikTok',              'https://tiktok.com/@yourname'],
  ['instagram', 'Instagram', 'URL hồ sơ Instagram',          'https://instagram.com/yourname'],
  ['youtube',   'YouTube',   'URL kênh YouTube',             'https://youtube.com/@yourchannel'],
  ['linkedin',  'LinkedIn',  'URL hồ sơ LinkedIn',           'https://linkedin.com/in/yourname'],
  ['telegram',  'Telegram',  'Username hoặc t.me link',      '@yourname hoặc https://t.me/yourname'],
];

function renderSettings(el) {
  const p = getSaleProfile() || {};
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left">
        <div class="breadcrumb"><span>Sales</span> / Cài Đặt</div>
        <h1>Cài Đặt Cá Nhân</h1>
      </div>
    </div>

    <div class="vtab-layout">
      <div class="vtabs">
        ${SETTINGS_TABS.map(([id,label,icn])=>`
          <div class="vtab ${S.settingsTab===id?'active':''}" onclick="S.settingsTab='${id}';render('settings',document.getElementById('p-settings'))">${ico(icn,14)} ${label}</div>`).join('')}
      </div>
      <div class="vtab-content">${settingsTabHTML(p)}</div>
    </div>
  `;
}

function settingsTabHTML(p) {
  const t = S.settingsTab;
  const u = currentUsername();

  if (t === 'profile') return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('users',16)} Hồ sơ cá nhân</span>
        <span class="card-subtitle">Tên & chức danh hiển thị cho khách</span>
      </div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Tên đăng nhập</label>
            <input class="form-control" value="${esc(u)}" disabled style="opacity:.6"></div>
          <div class="form-group"><label class="form-label">Họ tên hiển thị *</label>
            <input class="form-control" id="sp-name" value="${esc(p.name||'')}" placeholder="VD: Nguyễn Minh Anh"></div>
        </div>
        <div class="form-group"><label class="form-label">Chức danh</label>
          <input class="form-control" id="sp-title" value="${esc(p.title||'')}" placeholder="VD: Chuyên viên tư vấn cao cấp"></div>
        <div class="form-group"><label class="form-label">Avatar URL <small class="c-muted">(tuỳ chọn)</small></label>
          <input class="form-control" id="sp-avatar" value="${esc(p.avatar||'')}" placeholder="https://..."></div>
        ${saveBarHTML(['sp-name','sp-title','sp-avatar'])}
      </div>
    </div>`;

  if (t === 'contact') return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('phone',16)} Thông tin liên hệ</span>
        <span class="card-subtitle">Nút Hotline & Email hiển thị trên trang VR khi khách vào link của bạn</span>
      </div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Số điện thoại *</label>
            <input class="form-control" id="sp-phone" value="${esc(p.phone||'')}" placeholder="0901 234 567"></div>
          <div class="form-group"><label class="form-label">Email</label>
            <input class="form-control" id="sp-email" type="email" value="${esc(p.email||'')}" placeholder="ten@example.com"></div>
        </div>
        ${saveBarHTML(['sp-phone','sp-email'])}
      </div>
    </div>`;

  if (t === 'social') return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('link',16)} Mạng xã hội</span>
        <span class="card-subtitle">Các kênh khách có thể liên hệ ngoài hotline</span>
      </div>
      <div class="card-body">
        ${SOCIAL_PLATFORMS.map(([key,label,hint,ph])=>`
          <div class="form-group">
            <label class="form-label">${label} <small class="c-muted">${hint}</small></label>
            <input class="form-control" id="sp-soc-${key}" value="${esc(p[key]||'')}" placeholder="${ph}">
          </div>`).join('')}
        ${saveBarHTML(SOCIAL_PLATFORMS.map(p=>'sp-soc-'+p[0]))}
      </div>
    </div>`;

  if (t === 'referral') return `
    ${renderReferralCard()}
    <div class="card";margin-top:12px">
      <div class="card-header"><span class="card-title">${ico('info',16)} Cách dùng</span></div>
      <div class="card-body" style="font-size:13px;color:var(--muted);line-height:1.7">
        <div>1. Sao chép link trên và gửi cho khách qua Zalo / SMS / Email.</div>
        <div>2. Khi khách mở link, trang VR sẽ <b>tự động hiển thị thông tin liên hệ của bạn</b> (hotline, Zalo, MXH) thay vì thông tin chung của dự án.</div>
        <div>3. Mọi lead phát sinh từ link này sẽ được gắn nguồn về cho bạn.</div>
        <div style="margin-top:8px;padding:10px 12px;background:rgba(245,158,11,.1);border-radius:6px;color:#b45309">${ico('warning',13)} Nếu chưa điền SĐT hoặc Zalo, các nút liên hệ sẽ không hiện cho khách.</div>
      </div>
    </div>`;

  if (t === 'export') return renderExportLeadsTab();

  return '';
}

function saveBarHTML() {
  return `
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;padding-top:12px;border-top:1px solid var(--border)">
      <button class="btn btn-secondary" onclick="resetSaleProfile()">${ico('refresh',14)} Khôi phục mặc định</button>
      <button class="btn btn-primary" onclick="saveSaleProfileFromForm()">${ico('save',14)} Lưu thay đổi</button>
    </div>`;
}

function saveSaleProfileFromForm() {
  const patch = {};
  // Profile tab
  ['name','title','avatar','phone','email'].forEach(k => {
    const el = document.getElementById('sp-'+k);
    if (el) patch[k] = el.value.trim();
  });
  // Social tab
  SOCIAL_PLATFORMS.forEach(([key]) => {
    const el = document.getElementById('sp-soc-'+key);
    if (el) patch[key] = el.value.trim();
  });
  saveSaleProfile(patch);
  toast('Đã lưu thông tin cá nhân', 'ok');
  // refresh topbar name in case it changed
  const _sess = JSON.parse(sessionStorage.getItem('ah_session') || 'null');
  if (_sess && patch.name) {
    _sess.name = patch.name;
    if (patch.title) _sess.title = patch.title;
    sessionStorage.setItem('ah_session', JSON.stringify(_sess));
    const nm = document.getElementById('tb-name'); if (nm) nm.textContent = patch.name;
    const rl = document.getElementById('tb-role'); if (rl && patch.title) rl.textContent = patch.title;
    const av = document.getElementById('tb-avatar'); if (av) av.textContent = patch.name.slice(0,2).toUpperCase();
  }
  render('settings', document.getElementById('p-settings'));
}

function resetSaleProfile() {
  if (!confirm('Khôi phục về thông tin mặc định? Các thay đổi cá nhân sẽ bị mất.')) return;
  localStorage.removeItem(profileKey());
  toast('Đã khôi phục mặc định', 'ok');
  render('settings', document.getElementById('p-settings'));
}

// ——— EXPORT KHACH HANG ————————————————————————
const EXPORT_COLUMNS = [
  ['name',      'Họ tên'],
  ['phone',     'Số điện thoại'],
  ['email',     'Email'],
  ['zalo',      'Zalo'],
  ['unitType',  'Loại căn quan tâm'],
  ['budget',    'Ngân sách'],
  ['purpose',   'Mục đích'],
  ['source',    'Nguồn'],
  ['status',    'Trạng thái'],
  ['createdAt', 'Ngày tạo'],
  ['appt',      'Lịch hẹn'],
  ['assignee',  'Người phụ trách'],
  ['notes',     'Ghi chú'],
];
const UNIT_TYPES = ['1PN','2PN','3PN','Duplex 2PN','Duplex 3PN','Penthouse','Studio'];
const BUDGETS    = ['< 5 tỷ','5–8 tỷ','8–12 tỷ','> 12 tỷ'];

function filteredLeadsForExport() {
  const f = S.exportFilter;
  return S.leads.filter(l => {
    if (f.from && l.createdAt && l.createdAt.slice(0,10) < f.from) return false;
    if (f.to   && l.createdAt && l.createdAt.slice(0,10) > f.to)   return false;
    if (f.source   && l.source   !== f.source)   return false;
    if (f.unitType && l.unitType !== f.unitType) return false;
    if (f.budget   && l.budget   !== f.budget)   return false;
    return true;
  });
}

function renderExportLeadsTab() {
  const f = S.exportFilter;
  const matched = filteredLeadsForExport();
  const selectedCols = EXPORT_COLUMNS.filter(([k]) => S.exportCols[k]).length;

  // Build source options grouped
  const sourceOpts = Object.entries(SOURCE_GROUPS).map(([g, arr]) =>
    `<optgroup label="${esc(g)}">${arr.map(s => `<option value="${esc(s)}" ${f.source===s?'selected':''}>${esc(s)}</option>`).join('')}</optgroup>`
  ).join('');

  return `
    <div class="card" style="margin-bottom:12px">
      <div class="card-header">
        <span class="card-title">${ico('download',16)} Export danh sách khách hàng</span>
        <span class="card-subtitle">Lọc & chọn cột rồi tải xuống file CSV (mở bằng Excel)</span>
      </div>
      <div class="card-body">
        <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:8px">Bộ lọc</div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Từ ngày</label>
            <input class="form-control" type="date" id="ex-from" value="${esc(f.from)}" onchange="S.exportFilter.from=this.value;refreshExportPreview()"></div>
          <div class="form-group"><label class="form-label">Đến ngày</label>
            <input class="form-control" type="date" id="ex-to" value="${esc(f.to)}" onchange="S.exportFilter.to=this.value;refreshExportPreview()"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nguồn</label>
            <select class="form-control" onchange="S.exportFilter.source=this.value;refreshExportPreview()">
              <option value="">— Tất cả nguồn —</option>
              ${sourceOpts}
            </select></div>
          <div class="form-group"><label class="form-label">Loại căn</label>
            <select class="form-control" onchange="S.exportFilter.unitType=this.value;refreshExportPreview()">
              <option value="">— Tất cả loại —</option>
              ${UNIT_TYPES.map(t=>`<option value="${esc(t)}" ${f.unitType===t?'selected':''}>${esc(t)}</option>`).join('')}
            </select></div>
          <div class="form-group"><label class="form-label">Ngân sách</label>
            <select class="form-control" onchange="S.exportFilter.budget=this.value;refreshExportPreview()">
              <option value="">— Tất cả mức —</option>
              ${BUDGETS.map(b=>`<option value="${esc(b)}" ${f.budget===b?'selected':''}>${esc(b)}</option>`).join('')}
            </select></div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:4px">
          <button class="btn btn-secondary btn-sm" onclick="resetExportFilter()">${ico('refresh',13)} Xoá bộ lọc</button>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:12px">
      <div class="card-header">
        <span class="card-title">${ico('navpanel',16)} Chọn cột xuất</span>
        <span class="card-subtitle">${selectedCols} / ${EXPORT_COLUMNS.length} cột được chọn</span>
      </div>
      <div class="card-body">
        <div style="display:flex;gap:8px;margin-bottom:10px">
          <button class="btn btn-secondary btn-sm" onclick="setAllExportCols(true)">${ico('check',13)} Chọn tất cả</button>
          <button class="btn btn-secondary btn-sm" onclick="setAllExportCols(false)">${ico('x',13)} Bỏ chọn tất cả</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px 14px">
          ${EXPORT_COLUMNS.map(([k,label])=>`
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;padding:6px 0">
              <input type="checkbox" ${S.exportCols[k]?'checked':''} onchange="S.exportCols['${k}']=this.checked;refreshExportPreview()" style="width:16px;height:16px;accent-color:var(--primary)">
              ${esc(label)}
            </label>`).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('eye',16)} Xem trước</span>
        <span class="badge ${matched.length?'badge-primary':'badge-muted'}" id="ex-count">${matched.length} khách</span>
      </div>
      <div class="card-body">
        <div id="ex-preview">${exportPreviewHTML(matched)}</div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <span class="c-muted" style="font-size:12px;align-self:center;margin-right:auto">File sẽ được tải về dạng <b>.csv</b> (UTF-8, mở bằng Excel).</span>
          <button class="btn btn-primary" onclick="doExportLeadsCSV()" ${matched.length?'':'disabled'}>${ico('download',14)} Tải xuống CSV (${matched.length})</button>
        </div>
      </div>
    </div>
  `;
}

function exportPreviewHTML(rows) {
  if (!rows.length) return `<div style="text-align:center;padding:24px;color:var(--muted);font-size:13px">Không có khách hàng nào khớp bộ lọc.</div>`;
  const cols = EXPORT_COLUMNS.filter(([k]) => S.exportCols[k]);
  if (!cols.length) return `<div style="text-align:center;padding:24px;color:var(--muted);font-size:13px">Hãy chọn ít nhất 1 cột để xuất.</div>`;
  const preview = rows.slice(0, 5);
  return `
    <div style="overflow:auto;border:1px solid var(--border);border-radius:8px">
      <table class="tbl" style="margin:0;font-size:12px">
        <thead><tr>${cols.map(([,l])=>`<th>${esc(l)}</th>`).join('')}</tr></thead>
        <tbody>${preview.map(r=>`<tr>${cols.map(([k])=>`<td>${esc(formatCell(r,k))}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
    ${rows.length>5?`<div style="font-size:11px;color:var(--muted);margin-top:8px;text-align:center">… và ${rows.length-5} dòng nữa trong file CSV</div>`:''}`;
}

function formatCell(row, key) {
  const v = row[key];
  if (v == null || v === '') return '';
  if (key === 'status')    return LEAD_STATUS[v] || v;
  if (key === 'createdAt') return new Date(v).toLocaleString('vi-VN');
  if (key === 'appt')      return v ? new Date(v).toLocaleString('vi-VN') : '';
  return String(v);
}

function refreshExportPreview() {
  const rows = filteredLeadsForExport();
  const prev = document.getElementById('ex-preview');
  const cnt  = document.getElementById('ex-count');
  if (prev) prev.innerHTML = exportPreviewHTML(rows);
  if (cnt)  { cnt.textContent = rows.length + ' khách'; cnt.className = 'badge ' + (rows.length?'badge-primary':'badge-muted'); }
  // refresh download button count + disabled state without re-rendering the whole tab
  const btn = document.querySelector('#p-settings .btn.btn-primary[onclick="doExportLeadsCSV()"]');
  if (btn) {
    btn.innerHTML = `${ico('download',14)} Tải xuống CSV (${rows.length})`;
    btn.disabled = !rows.length;
  }
}

function setAllExportCols(val) {
  EXPORT_COLUMNS.forEach(([k]) => S.exportCols[k] = !!val);
  render('settings', document.getElementById('p-settings'));
}

function resetExportFilter() {
  S.exportFilter = { from:'', to:'', source:'', unitType:'', budget:'' };
  render('settings', document.getElementById('p-settings'));
}

function doExportLeadsCSV() {
  const rows = filteredLeadsForExport();
  const cols = EXPORT_COLUMNS.filter(([k]) => S.exportCols[k]);
  if (!rows.length) { toast('Không có khách nào để export', 'warn'); return; }
  if (!cols.length) { toast('Hãy chọn ít nhất 1 cột', 'warn'); return; }

  const csvEsc = v => {
    const s = (v == null ? '' : String(v));
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  };
  const header = cols.map(c => csvEsc(c[1])).join(',');
  const body   = rows.map(r => cols.map(([k]) => csvEsc(formatCell(r,k))).join(',')).join('\r\n');
  const csv    = '﻿' + header + '\r\n' + body; // BOM for Excel to detect UTF-8

  const u    = currentUsername() || 'sale';
  const date = new Date().toISOString().slice(0,10);
  const fn   = `khach-hang_${u}_${date}.csv`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = fn;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(`Đã tải xuống ${rows.length} khách hàng (${fn})`, 'ok');
}

// ——— LEADS ————————————————————————————————————
let lf = { search:'', status:'', source:'' };

function filteredLeads() {
  return S.leads.filter(l => {
    const q = lf.search.toLowerCase();
    const matchQ = !q || l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.email||'').toLowerCase().includes(q);
    const matchS = !lf.status || l.status === lf.status;
    const matchSrc = !lf.source || l.source === lf.source;
    return matchQ && matchS && matchSrc;
  });
}

function renderLeads(el) {
  const ls = filteredLeads();
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Sales</span> / Leads</div><h1>Leads & Booking</h1></div>
      <div class="ph-right">
        <button class="btn btn-primary btn-sm" onclick="openAddLeadPanel()">${ico('plus')} Thêm lead</button>
        <button class="btn btn-secondary btn-sm" onclick="toast('Đang xuất Excel…','info')">${ico('download')} Excel</button>
      </div>
    </div>
    <div class="card">
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
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr>
            <th style="width:32px">#</th>
            <th>Họ tên</th><th>SĐT</th><th>Loại căn</th><th>Ngân sách</th>
            <th>Nguồn</th><th>Trạng thái</th><th>Lịch hẹn</th><th>Thao tác</th>
          </tr></thead>
          <tbody id="leads-tbody">${ls.map(leadRow).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function leadRow(l, i) {
  const apptDisplay = l.appt ? `<span class="mono" style="font-size:11px;color:var(--primary)">${new Date(l.appt).toLocaleDateString('vi-VN')} ${new Date(l.appt).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</span>` : '<span style="color:var(--muted)">—</span>';
  return `<tr>
    <td class="c-muted">${i+1}</td>
    <td class="fw6">${l.name}</td>
    <td><a href="tel:${l.phone}" class="c-primary mono">${l.phone}</a></td>
    <td>${l.unitType||'—'}</td>
    <td>${l.budget||'—'}</td>
    <td><span class="badge ${SOURCE_BADGE[l.source]||'badge-muted'}">${l.source}</span></td>
    <td><span class="badge ${LEAD_BADGE[l.status]||'badge-muted'}">${LEAD_STATUS[l.status]||l.status}</span></td>
    <td>${apptDisplay}</td>
    <td><div class="row-actions">
      <a href="tel:${l.phone}" class="act-btn" title="Gọi điện">${ico('phone')}</a>
      ${l.zalo
        ? `<a href="https://zalo.me/${l.zalo}" target="_blank" class="act-btn act-btn-zalo" title="Mở Zalo"><img src="../img/Icon_of_Zalo.svg" alt="Zalo" width="14" height="14"></a>`
        : `<span class="act-btn act-btn-zalo disabled" title="Chưa có Zalo" aria-disabled="true"><img src="../img/Icon_of_Zalo.svg" alt="Zalo" width="14" height="14"></span>`}
      <button class="act-btn" onclick="openEditLeadPanel(${l.id})" title="Sửa">${ico('edit')}</button>
      <button class="act-btn" onclick="quickStatus(${l.id})" title="Cập nhật trạng thái">${ico('refresh')}</button>
      <button class="act-btn" onclick="openApptPanel(${l.id})" title="Đặt lịch hẹn">${ico('calendar')}</button>
    </div></td>
  </tr>`;
}

function reloadLeadsTbody() {
  const ls = filteredLeads();
  const tbody = document.getElementById('leads-tbody');
  if (tbody) tbody.innerHTML = ls.map(leadRow).join('');
  const cnt = document.getElementById('l-count');
  if (cnt) cnt.textContent = ls.length + ' leads';
}

function openAddLeadPanel() {
  showPanel('Thêm Lead Mới', `
    <div class="form-group">
      <label class="form-label">Họ và tên <span class="req">*</span></label>
      <input class="form-control" id="nl-name" placeholder="Nguyễn Văn A">
    </div>
    <div class="form-group">
      <label class="form-label">Số điện thoại <span class="req">*</span></label>
      <input class="form-control mono" id="nl-phone" placeholder="09xx xxx xxx">
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-control" id="nl-email" type="email" placeholder="example@mail.com">
    </div>
    <div class="form-group">
      <label class="form-label">Loại căn quan tâm</label>
      <select class="form-control form-select" id="nl-type">
        <option value="">— Chưa xác định —</option>
        <option>1PN</option><option>2PN</option><option>3PN</option><option>Duplex 3PN</option><option>Penthouse</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Ngân sách</label>
      <select class="form-control form-select" id="nl-budget">
        <option value="">— Chưa xác định —</option>
        <option>< 5 tỷ</option><option>5–8 tỷ</option><option>8–12 tỷ</option><option>> 12 tỷ</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Mục đích</label>
      <select class="form-control form-select" id="nl-purpose">
        <option value="">— Chưa xác định —</option>
        <option>Ở thực</option><option>Đầu tư</option><option>Cho thuê</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Nguồn lead</label>
      ${sourceCombo('nl-source', 'Walk-in', 'Gõ để tìm nguồn (vd: tiktok, batdongsan…)…')}
      <small class="c-muted" style="font-size:11px">Chọn đúng nguồn để tracking ROI từng kênh.</small>
    </div>
    <div class="form-group">
      <label class="form-label">Ghi chú</label>
      <textarea class="form-control" id="nl-notes" rows="3" placeholder="Ghi chú thêm…"></textarea>
    </div>
  `, () => {
    const name  = document.getElementById('nl-name').value.trim();
    const phone = document.getElementById('nl-phone').value.trim();
    if (!name)  { toast('Nhập họ tên', 'warn'); return; }
    if (!phone) { toast('Nhập số điện thoại', 'warn'); return; }
    S.leads.unshift({
      id: Date.now(), name, phone,
      email:   document.getElementById('nl-email').value.trim(),
      unitType: document.getElementById('nl-type').value,
      budget:   document.getElementById('nl-budget').value,
      purpose:  document.getElementById('nl-purpose').value,
      source:   document.getElementById('nl-source').value,
      notes:    document.getElementById('nl-notes').value.trim(),
      status: 'new', createdAt: new Date().toISOString(), assignee: '', appt: null,
    });
    closePanel();
    render('leads', document.getElementById('p-leads'));
    toast('Đã thêm lead mới', 'ok');
  });
}

function openEditLeadPanel(id) {
  const lead = S.leads.find(l => l.id === id); if (!lead) return;
  showPanel('Chỉnh Sửa Lead', `
    <div class="form-group">
      <label class="form-label">Họ và tên <span class="req">*</span></label>
      <input class="form-control" id="el-name" value="${lead.name}">
    </div>
    <div class="form-group">
      <label class="form-label">Số điện thoại</label>
      <input class="form-control mono" id="el-phone" value="${lead.phone}">
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-control" id="el-email" value="${lead.email||''}">
    </div>
    <div class="form-group">
      <label class="form-label">Loại căn quan tâm</label>
      <select class="form-control form-select" id="el-type">
        <option value="">— Chưa xác định —</option>
        ${['1PN','2PN','3PN','Duplex 3PN','Penthouse'].map(t=>`<option ${lead.unitType===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Trạng thái</label>
      <select class="form-control form-select" id="el-status">
        ${Object.entries(LEAD_STATUS).map(([k,v])=>`<option value="${k}" ${lead.status===k?'selected':''}>${v}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Ghi chú</label>
      <textarea class="form-control" id="el-notes" rows="3">${lead.notes||''}</textarea>
    </div>
  `, () => {
    const idx = S.leads.findIndex(l => l.id === id);
    if (idx < 0) return;
    S.leads[idx] = { ...lead,
      name:     document.getElementById('el-name').value.trim() || lead.name,
      phone:    document.getElementById('el-phone').value.trim() || lead.phone,
      email:    document.getElementById('el-email').value.trim(),
      unitType: document.getElementById('el-type').value,
      status:   document.getElementById('el-status').value,
      notes:    document.getElementById('el-notes').value.trim(),
    };
    closePanel();
    render('leads', document.getElementById('p-leads'));
    toast('Đã cập nhật lead', 'ok');
  });
}

const STATUS_CYCLE = ['new','called','interested','closed','stopped'];
function quickStatus(id) {
  const lead = S.leads.find(l => l.id === id); if (!lead) return;
  const idx = STATUS_CYCLE.indexOf(lead.status);
  lead.status = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
  reloadLeadsTbody();
  toast(`Cập nhật: ${LEAD_STATUS[lead.status]}`, 'ok');
}

function openApptPanel(id) {
  const lead = S.leads.find(l => l.id === id); if (!lead) return;
  const current = lead.appt ? lead.appt.slice(0,16) : '';
  showPanel(`Đặt Lịch Hẹn — ${lead.name}`, `
    <div style="padding:12px;background:var(--bg);border-radius:var(--r);margin-bottom:16px">
      <div style="font-size:12px;color:var(--muted)">Khách hàng</div>
      <div style="font-weight:600">${lead.name}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">${lead.phone} · ${lead.unitType||'Chưa chọn căn'}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Ngày & Giờ hẹn</label>
      <input class="form-control" id="ap-dt" type="datetime-local" value="${current}">
    </div>
    <div class="form-group">
      <label class="form-label">Trạng thái</label>
      <select class="form-control" id="ap-status">
        ${Object.entries(LEAD_STATUS).map(([k,v]) => `<option value="${k}" ${lead.status===k?'selected':''}>${v}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Ghi chú lịch hẹn</label>
      <textarea class="form-control" id="ap-note" rows="3" placeholder="Địa điểm, nội dung buổi gặp…">${lead.notes||''}</textarea>
    </div>
    ${current ? `<button class="btn btn-secondary btn-sm" onclick="clearAppt(${id})" style="margin-bottom:8px">${ico('trash')} Xoá lịch hẹn</button>` : ''}
  `, () => {
    const dt     = document.getElementById('ap-dt').value;
    const note   = document.getElementById('ap-note').value.trim();
    const status = document.getElementById('ap-status').value;
    if (!dt) { toast('Chọn ngày giờ hẹn', 'warn'); return; }
    const idx = S.leads.findIndex(l => l.id === id);
    const statusChanged = status !== lead.status;
    S.leads[idx] = { ...lead, appt: dt, notes: note || lead.notes, status };
    if (!statusChanged && (lead.status === 'new' || lead.status === 'called')) {
      S.leads[idx].status = 'called';
    }
    closePanel();
    const curPage = S.page || 'leads';
    if (curPage === 'calendar') {
      const c = document.getElementById('cal-card'); if (c) c.innerHTML = renderCalContent();
    } else {
      render('leads', document.getElementById('p-leads'));
    }
    toast(statusChanged ? `Đã cập nhật: ${LEAD_STATUS[status]}` : 'Đã đặt lịch hẹn', 'ok');
  });
}

function clearAppt(id) {
  const idx = S.leads.findIndex(l => l.id === id);
  if (idx < 0) return;
  S.leads[idx].appt = null;
  closePanel();
  if ((S.page || 'leads') === 'calendar') {
    const c = document.getElementById('cal-card'); if (c) c.innerHTML = renderCalContent();
  } else {
    render('leads', document.getElementById('p-leads'));
  }
  toast('Đã xoá lịch hẹn', 'ok');
}

// ——— CALENDAR ————————————————————————————————
function renderCalendar(el) {
  if (!S.calView) S.calView = 'list';
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Sales</span> / Lịch Hẹn</div><h1>Lịch Hẹn</h1></div>
      <div class="ph-right">
        <div class="view-toggle" id="cal-toggle" style="margin-right:8px">
          <button class="${S.calView==='list'?'active':''}" onclick="setCalView('list')">${ico('leads',12)} Danh sách</button>
          <button class="${S.calView==='week'?'active':''}" onclick="setCalView('week')">${ico('calendar',12)} Lịch tuần</button>
        </div>
        <button class="btn btn-primary btn-sm" onclick="nav('leads')">+ Đặt lịch mới</button>
      </div>
    </div>
    <div class="card" id="cal-card">${renderCalContent()}</div>
  `;
}

function setCalView(v) {
  S.calView = v;
  const c = document.getElementById('cal-card'); if (c) c.innerHTML = renderCalContent();
  document.querySelectorAll('#cal-toggle button').forEach((b,i) => b.classList.toggle('active', (i===0&&v==='list')||(i===1&&v==='week')));
}

function renderCalContent() {
  return S.calView === 'week' ? renderCalWeek() : renderCalList();
}

function renderCalList() {
  const all    = S.leads.filter(l => l.appt);
  const today  = new Date().toISOString().slice(0,10);
  const week   = (() => { const d = new Date(); d.setDate(d.getDate()+7); return d.toISOString().slice(0,10); })();
  const filter = S.calFilter || 'all';
  let list = all;
  if (filter === 'today') list = all.filter(l => l.appt.startsWith(today));
  if (filter === 'week')  list = all.filter(l => l.appt.slice(0,10) >= today && l.appt.slice(0,10) <= week);
  list = [...list].sort((a,b) => a.appt.localeCompare(b.appt));

  return `
    <div class="filter-bar">
      <button class="btn ${filter==='all'?'btn-primary':'btn-secondary'} btn-sm" onclick="S.calFilter='all';setCalView('list')">Tất cả</button>
      <button class="btn ${filter==='today'?'btn-primary':'btn-secondary'} btn-sm" onclick="S.calFilter='today';setCalView('list')">Hôm nay</button>
      <button class="btn ${filter==='week'?'btn-primary':'btn-secondary'} btn-sm" onclick="S.calFilter='week';setCalView('list')">7 ngày tới</button>
      <div class="filter-spacer"></div>
      <span class="c-muted" style="font-size:12px">${list.length} lịch hẹn</span>
    </div>
    ${list.length === 0
      ? `<div style="text-align:center;padding:64px;color:var(--muted)">
          <div style="font-size:40px;margin-bottom:12px;display:flex;justify-content:center">${ico('calendar',40)}</div>
          <div style="font-size:15px;font-weight:600">Không có lịch hẹn</div>
          <div style="font-size:13px;margin-top:4px">Thêm lịch hẹn từ trang Leads</div>
        </div>`
      : `<div style="display:flex;flex-direction:column;gap:10px;padding:12px">
          ${list.map(l => {
            const d = new Date(l.appt);
            const isToday = l.appt.startsWith(today);
            return `
              <div style="display:flex;align-items:center;gap:16px;padding:14px 16px;background:var(--bg);border-radius:var(--r);border-left:3px solid ${isToday ? 'var(--primary)' : 'var(--border)'}">
                <div style="min-width:60px;text-align:center;background:#fff;border:1px solid var(--border);border-radius:10px;padding:6px;flex-shrink:0">
                  <div style="font-size:10px;color:var(--muted);text-transform:uppercase">${d.toLocaleDateString('vi-VN',{month:'short'})}</div>
                  <div style="font-size:22px;font-weight:700;color:var(--primary);line-height:1">${d.getDate()}</div>
                  <div style="font-size:10px;color:var(--muted)">${d.toLocaleDateString('vi-VN',{weekday:'short'})}</div>
                </div>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:600;font-size:14px">${l.name}</div>
                  <div style="font-size:12px;color:var(--muted);margin-top:2px">${l.phone} · ${l.unitType||'Chưa chọn căn'} · ${l.budget||''}</div>
                  ${l.notes ? `<div style="font-size:12px;color:var(--text);margin-top:4px;font-style:italic">"${l.notes}"</div>` : ''}
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div class="mono" style="font-size:18px;font-weight:700;color:var(--primary)">${d.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</div>
                  <span class="badge ${LEAD_BADGE[l.status]}" style="margin-top:4px">${LEAD_STATUS[l.status]}</span>
                </div>
                <button class="act-btn" onclick="openApptPanel(${l.id})" title="Chỉnh sửa">${ico('edit')}</button>
              </div>
            `;
          }).join('')}
        </div>`
    }
  `;
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
  setCalView('week');
}
function gotoToday() { S.weekStart = startOfWeek(new Date()); setCalView('week'); }

function renderCalWeek() {
  if (!S.weekStart) S.weekStart = startOfWeek(new Date());
  const ws = S.weekStart;
  const today = new Date(); today.setHours(0,0,0,0);
  const days = Array.from({length:7}, (_,i) => { const d = new Date(ws); d.setDate(d.getDate()+i); return d; });
  const dows = ['T2','T3','T4','T5','T6','T7','CN'];
  const hours = []; for (let h=8; h<=19; h++) hours.push(h);

  // Group leads có appt theo "YYYY-MM-DD|H"
  const byCell = {};
  S.leads.forEach(l => {
    if (!l.appt) return;
    const ds = l.appt.slice(0,10);
    const h  = parseInt(l.appt.slice(11,13));
    const key = `${ds}|${h}`;
    (byCell[key] = byCell[key] || []).push(l);
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
      return `<div class="cal-cell">${list.map(l => {
        const tm = l.appt.slice(11,16);
        const sCls = l.status === 'closed' ? 's-done' : (l.status === 'stopped' ? 's-cancelled' : (l.status === 'interested' ? 's-confirmed' : 's-pending'));
        return `<div class="cal-event ${sCls}" onclick="openApptPanel(${l.id})" title="${l.name} · ${tm} · ${l.unitType||''}">
          <div class="ev-time">${tm}</div>
          <div class="ev-name">${l.name}</div>
          <div class="ev-meta">${l.unitType||''}${l.assignee?' · '+l.assignee:''}</div>
        </div>`;
      }).join('')}</div>`;
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
        <span style="display:inline-block;width:10px;height:10px;background:rgba(245,158,11,.4);border-left:2px solid #f59e0b;margin-right:4px;vertical-align:middle"></span>Mới
        <span style="display:inline-block;width:10px;height:10px;background:rgba(59,130,246,.4);border-left:2px solid #3b82f6;margin:0 4px 0 10px;vertical-align:middle"></span>Quan tâm
        <span style="display:inline-block;width:10px;height:10px;background:rgba(16,185,129,.4);border-left:2px solid #10b981;margin:0 4px 0 10px;vertical-align:middle"></span>Đã chốt
      </div>
    </div>
    <div class="cal-week">${head}${rows}</div>
  `;
}

function onSourceFilter(v) {
  lf.source = v || '';
  reloadLeadsTbody();
}

// ——— UNITS (Read-only) ————————————————————————
const UNIT_STATUS_BADGE = { available:'badge-ok', booked:'badge-warning', sold:'badge-info' };
const UNIT_STATUS_LABEL = { available:'Còn hàng', booked:'Đã đặt cọc', sold:'Đã bán' };

let uf = { search:'', type:'', status:'' };

function renderUnits(el) {
  const us = filteredUnits();
  const avail = units().filter(u => u.status === 'available').length;
  const booked = units().filter(u => u.status === 'booked').length;
  const sold = units().filter(u => u.status === 'sold').length;

  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Sales</span> / Căn Hộ</div><h1>Tình Trạng Căn Hộ</h1></div>
      <div class="ph-right" style="gap:8px;display:flex;align-items:center">
        <span class="badge badge-ok">${avail} Còn hàng</span>
        <span class="badge badge-warning">${booked} Đặt cọc</span>
        <span class="badge badge-info">${sold} Đã bán</span>
      </div>
    </div>
    <div class="card">
      <div class="filter-bar">
        <input class="fi" style="min-width:180px" placeholder="Mã căn, tầng…" value="${uf.search}" oninput="uf.search=this.value;reloadUnitsTbody()">
        <select class="fi fi-select" onchange="uf.type=this.value;reloadUnitsTbody()">
          <option value="">Tất cả loại</option>
          ${[...new Set(units().map(u=>u.type))].map(t=>`<option ${uf.type===t?'selected':''}>${t}</option>`).join('')}
        </select>
        <select class="fi fi-select" onchange="uf.status=this.value;reloadUnitsTbody()">
          <option value="">Tất cả tình trạng</option>
          ${Object.entries(UNIT_STATUS_LABEL).map(([k,v])=>`<option value="${k}" ${uf.status===k?'selected':''}>${v}</option>`).join('')}
        </select>
        <div class="filter-spacer"></div>
        <span class="c-muted" style="font-size:12px" id="u-count">${us.length} căn</span>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr><th>Mã căn</th><th>Loại</th><th>Tầng</th><th>DT (m²)</th><th>Hướng</th><th>Giá</th><th>Tình trạng</th></tr></thead>
          <tbody id="units-tbody">${us.map(unitRow).join('')}</tbody>
        </table>
      </div>
    </div>
    <div class="card" style="margin-top:16px;padding:12px 16px;background:rgba(59,130,246,.05);border:1px solid rgba(59,130,246,.15)">
      <div style="font-size:12px;color:var(--primary);font-weight:600;display:flex;align-items:center;gap:4px">${ico('info',12)} Chú ý</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">Sales chỉ xem thông tin căn hộ. Để cập nhật giá hoặc tình trạng, liên hệ quản trị viên (Chủ Đầu Tư).</div>
    </div>
  `;
}

function filteredUnits() {
  return units().filter(u => {
    const q = uf.search.toLowerCase();
    const matchQ = !q || u.code.toLowerCase().includes(q) || String(u.floor).includes(q);
    const matchT = !uf.type || u.type === uf.type;
    const matchS = !uf.status || u.status === uf.status;
    return matchQ && matchT && matchS;
  });
}

function unitRow(u) {
  return `<tr>
    <td class="fw6 mono">${u.code}</td>
    <td>${u.type}</td>
    <td>${u.floor}</td>
    <td>${u.area}</td>
    <td>${u.direction}</td>
    <td class="fw6">${u.price}</td>
    <td><span class="badge ${UNIT_STATUS_BADGE[u.status]||'badge-muted'}">${UNIT_STATUS_LABEL[u.status]||u.status}</span></td>
  </tr>`;
}

function reloadUnitsTbody() {
  const us = filteredUnits();
  const tbody = document.getElementById('units-tbody');
  if (tbody) tbody.innerHTML = us.map(unitRow).join('');
  const cnt = document.getElementById('u-count');
  if (cnt) cnt.textContent = us.length + ' căn';
}

// ——— VR TOUR ————————————————————————————————
const GROUP_META = {
  tongQuan:        { label: 'Tổng Quan',          icon: 'building' },
  tienIchNoiKhu:   { label: 'Tiện Ích Nội Khu',   icon: 'leaf' },
  tienIchNgoaiKhu: { label: 'Tiện Ích Ngoại Khu', icon: 'mappin' },
  matBangTang:     { label: 'Mặt Bằng / Tòa',     icon: 'hardhat' },
  view360Can:      { label: 'View 360° Căn Hộ',   icon: 'armchair' },
};

function vrLink(sceneId) {
  if (!sceneId) return '../index.html';
  return `../index.html?scene=${sceneId}`;
}

function renderVR(el) {
  const m = menu();
  const groups = Object.entries(GROUP_META).filter(([k]) => m[k] && m[k].length > 0);
  el.innerHTML = `
    <div class="ph">
      <div class="ph-left"><div class="breadcrumb"><span>Sales</span> / Tour VR360</div><h1>Tour VR360</h1></div>
      <div class="ph-right">
        <a href="../index.html" target="_blank" class="btn btn-primary btn-sm">${ico('video')} Mở VR Tour</a>
      </div>
    </div>
    <div class="ph-sub" style="font-size:13px;color:var(--muted);margin-bottom:16px">Dùng các link bên dưới để gửi cho khách hàng hoặc mở trực tiếp trong buổi tư vấn.</div>
    ${groups.length === 0
      ? `<div class="card" style="text-align:center;padding:64px;color:var(--muted)"><div style="font-size:40px;display:flex;justify-content:center">${ico('video',40)}</div><div style="margin-top:12px">Chưa có dữ liệu VR tour</div></div>`
      : groups.map(([key, meta]) => {
          const items = m[key] || [];
          return `
            <div class="card" style="margin-bottom:16px">
              <div class="card-header" style="padding-bottom:12px">
                <div class="card-title">${ico(meta.icon, 14)} ${meta.label}</div>
                <span class="badge badge-muted">${items.length} điểm</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px">
                ${items.map(item => {
                  const sc = scenes().find(s => s.id === item.sceneId);
                  const link = item.customLink || (item.sceneId ? vrLink(item.sceneId) : null);
                  return `
                    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg);border-radius:var(--r)">
                      <div style="width:36px;text-align:center;display:flex;align-items:center;justify-content:center">${sc ? ico('video',20) : ico('mappin',20)}</div>
                      <div style="flex:1;min-width:0">
                        <div style="font-weight:600;font-size:13px">${item.label}</div>
                        ${link ? `<div class="mono" style="font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${link}</div>` : `<div style="font-size:11px;color:var(--warn);display:flex;align-items:center;gap:4px">${ico('warning',11)} Chưa có link</div>`}
                      </div>
                      ${link
                        ? `<a href="${link}" target="_blank" class="btn btn-secondary btn-sm" style="flex-shrink:0">${ico('video')} Mở</a>`
                        : `<span class="badge badge-warning" style="flex-shrink:0">Chưa có link</span>`
                      }
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')
    }
  `;
}

// ——— UI HELPERS ———————————————————————————————
function showPanel(title, bodyHTML, onSave) {
  document.getElementById('sp-title').textContent = title;
  document.getElementById('sp-body').innerHTML = bodyHTML;
  const btn = document.getElementById('sp-save');
  btn.onclick = onSave || null;
  document.getElementById('sp').classList.add('open');
  document.getElementById('sp-backdrop').classList.add('show');
}
function closePanel() {
  document.getElementById('sp').classList.remove('open');
  document.getElementById('sp-backdrop').classList.remove('show');
}
document.getElementById('sp-backdrop')?.addEventListener('click', closePanel);

function confirmDel(title, sub, cb) {
  document.getElementById('cm-title').textContent = title;
  document.getElementById('cm-sub').textContent = sub || '';
  document.getElementById('cm-ok').onclick = () => { closeConfirm(); cb(); };
  document.getElementById('cm-back').classList.add('show');
}
function closeConfirm() { document.getElementById('cm-back').classList.remove('show'); }
document.getElementById('cm-back')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeConfirm(); });

function toast(msg, type = 'ok') {
  const wrap = document.getElementById('toast-wrap');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}
