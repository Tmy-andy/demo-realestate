/* ============================================
   AURORA HEIGHTS — Admin Content Modules
   6 module CRUD: Gallery / SiteMap / Amenities / Timeline / Legal / Location
   Phụ thuộc admin.js: S, ico(), toast(), saveData(), exportJSON(),
                       confirmDel(), showPanel(), closePanel(), go()
   ============================================ */

// Resolve relative asset paths from admin/ context
function assetPath(p) {
  if (!p) return '';
  if (p.startsWith('data:') || p.startsWith('http') || p.startsWith('../')) return p;
  return '../' + p;
}

/* Trích FILE_ID từ link Google Drive */
function adminDriveFileId(url) {
  if (!url || !/drive\.google\.com|docs\.google\.com/.test(url)) return null;
  let m;
  if ((m = url.match(/\/file\/d\/([\w-]+)/))) return m[1];
  if ((m = url.match(/[?&]id=([\w-]+)/))) return m[1];
  return null;
}
/* Thumbnail hiển thị được cho 1 asset (xử lý link Drive) */
function thumbPath(p) {
  const did = adminDriveFileId(p);
  if (did) return 'https://drive.google.com/thumbnail?id=' + did + '&sz=w640';
  return assetPath(p);
}

// ——— Page header chung ————————————————————————
function pageHeader(crumbs, title, actions = '') {
  return `
    <div class="ph">
      <div class="ph-left">
        <div class="breadcrumb">${crumbs.map(c=>`<span>${c}</span>`).join(' / ')}</div>
        <h1>${title}</h1>
      </div>
      <div class="btn-group">
        ${actions}
        <a href="../index.html" target="_blank" class="btn btn-secondary btn-sm">${ico('globe')} Xem trang VR</a>
        <button class="btn btn-secondary btn-sm" onclick="exportJSON()">${ico('download')} Export JSON</button>
      </div>
    </div>`;
}

// Escape giá trị cho thuộc tính HTML
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
                       .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== IMAGE UPLOAD HELPERS =====
const MAX_IMG_BYTES   = 10 * 1024 * 1024;          // 10MB / ảnh
const MAX_TOTAL_BYTES = 5  * 1024 * 1024;          // 5MB tổng localStorage

function currentStorageBytes() {
  try { return (localStorage.getItem(LS_KEY) || '').length; } catch { return 0; }
}
function fmtSize(b) {
  if (b < 1024) return b + ' B';
  if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
  return (b/1024/1024).toFixed(2) + ' MB';
}

/* Tạo HTML cho 1 field ảnh: tab URL / Upload — Upload là dropzone đẹp */
function imageField(id, label, currentValue = '', opts = {}) {
  const isData  = (currentValue || '').startsWith('data:');
  const initTab = isData ? 'file' : 'url';
  const remaining = fmtSize(Math.max(0, MAX_TOTAL_BYTES - currentStorageBytes()));
  return `
    <div class="form-group img-field" data-img-id="${id}">
      <div class="img-field-head">
        <label class="form-label" style="margin:0">${label}${opts.required ? ' <span class="req">*</span>' : ''}</label>
        <span class="img-quota">${ico('harddrive',11)} Còn <b>${remaining}</b> / 5MB</span>
      </div>
      <div class="img-tabs">
        <button type="button" class="img-tab ${initTab==='url'?'active':''}" data-tab="url" onclick="imgFieldSwitch('${id}','url')">${ico('link',12)} Dán URL</button>
        <button type="button" class="img-tab ${initTab==='file'?'active':''}" data-tab="file" onclick="imgFieldSwitch('${id}','file')">${ico('upload',12)} Tải lên</button>
      </div>

      <div class="img-tab-pane" id="${id}-urlbox" style="${initTab==='url'?'':'display:none'}">
        <input class="form-control" id="${id}-url" value="${isData?'':esc(currentValue||'')}"
               placeholder="${opts.placeholder||'img/example.jpg hoặc https://...'}"
               oninput="imgFieldSyncURL('${id}', this.value)">
      </div>

      <div class="img-tab-pane" id="${id}-filebox" style="${initTab==='file'?'':'display:none'}">
        <div class="dropzone" id="${id}-dz"
             onclick="document.getElementById('${id}-file').click()"
             ondragenter="imgDzEnter(event,'${id}')"
             ondragover="imgDzEnter(event,'${id}')"
             ondragleave="imgDzLeave(event,'${id}')"
             ondrop="imgDzDrop(event,'${id}')">
          <div class="dz-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" x2="12" y1="3" y2="15"/>
            </svg>
          </div>
          <div class="dz-title">Kéo & thả ảnh vào đây</div>
          <div class="dz-sub">hoặc <span class="dz-browse">chọn file từ máy</span></div>
          <div class="dz-meta">JPG · PNG · WebP · tối đa 10MB</div>
        </div>
        <input type="file" id="${id}-file" accept="image/*" style="display:none" onchange="imgFieldUpload('${id}', this)">
        <div class="dz-fileinfo" id="${id}-info" style="display:none"></div>
      </div>

      <input type="hidden" id="${id}-val" value="${esc(currentValue||'')}">

      <div class="img-preview" id="${id}-prev" style="${currentValue?'':'display:none'}">
        <img src="${esc(currentValue||'')}" onerror="this.style.opacity=.15">
        <button type="button" class="img-prev-clear" onclick="imgFieldClear('${id}')" title="Xoá ảnh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>`;
}

function imgFieldSwitch(id, tab) {
  document.getElementById(id+'-urlbox').style.display  = tab==='url'  ? '' : 'none';
  document.getElementById(id+'-filebox').style.display = tab==='file' ? '' : 'none';
  const wrap = document.querySelector(`[data-img-id="${id}"]`);
  if (wrap) wrap.querySelectorAll('.img-tab').forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
}
function imgFieldSyncURL(id, val) {
  document.getElementById(id+'-val').value = val;
  const prev = document.getElementById(id+'-prev');
  const img  = prev.querySelector('img');
  if (val) { prev.style.display = ''; img.src = val; img.style.opacity = 1; }
  else     { prev.style.display = 'none'; }
  /* sync logo-slot preview if present */
  const si = document.getElementById(id+'-slot-img');
  if (si) { si.src = val || ''; si.style.opacity = val ? 1 : .2; }
}
function imgFieldClear(id) {
  document.getElementById(id+'-val').value = '';
  const u = document.getElementById(id+'-url');  if (u) u.value = '';
  const f = document.getElementById(id+'-file'); if (f) f.value = '';
  const info = document.getElementById(id+'-info'); if (info) info.style.display = 'none';
  document.getElementById(id+'-prev').style.display = 'none';
  /* sync logo-slot preview if present */
  const si = document.getElementById(id+'-slot-img');
  if (si) { si.src = ''; si.style.opacity = .2; }
}
function imgDzEnter(e, id) { e.preventDefault(); document.getElementById(id+'-dz').classList.add('dragover'); }
function imgDzLeave(e, id) { e.preventDefault(); document.getElementById(id+'-dz').classList.remove('dragover'); }
function imgDzDrop(e, id) {
  e.preventDefault();
  document.getElementById(id+'-dz').classList.remove('dragover');
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (file) imgFieldReadFile(id, file);
}
function imgFieldUpload(id, input) {
  const file = input.files && input.files[0];
  if (file) imgFieldReadFile(id, file);
}
function imgFieldReadFile(id, file) {
  if (!file.type.startsWith('image/')) {
    toast('File không phải ảnh', 'err'); return;
  }
  if (file.size > MAX_IMG_BYTES) {
    toast(`Ảnh ${fmtSize(file.size)} vượt 10MB. Chọn ảnh nhỏ hơn.`, 'err'); return;
  }
  const info = document.getElementById(id+'-info');
  info.style.display = '';
  info.innerHTML = `<div class="dz-info-row">
    <div class="dz-info-thumb">${ico('image',16)}</div>
    <div class="dz-info-body">
      <div class="dz-info-name">${esc(file.name)}</div>
      <div class="dz-info-progress"><div class="dz-info-bar" id="${id}-bar" style="width:0%"></div></div>
    </div>
    <div class="dz-info-size mono">${fmtSize(file.size)}</div>
  </div>`;
  const fr = new FileReader();
  fr.onprogress = ev => {
    if (!ev.lengthComputable) return;
    const pct = Math.round(ev.loaded / ev.total * 100);
    const bar = document.getElementById(id+'-bar');
    if (bar) bar.style.width = pct + '%';
  };
  fr.onload = e => {
    const dataUrl = e.target.result;
    const projected = currentStorageBytes() + dataUrl.length;
    if (projected > MAX_TOTAL_BYTES) {
      toast(`Hết quota localStorage (${fmtSize(MAX_TOTAL_BYTES)}). Xoá bớt ảnh hoặc dùng URL.`, 'err');
      imgFieldClear(id); return;
    }
    document.getElementById(id+'-val').value = dataUrl;
    const prev = document.getElementById(id+'-prev');
    prev.style.display = '';
    prev.querySelector('img').src = dataUrl;
    prev.querySelector('img').style.opacity = 1;
    const bar = document.getElementById(id+'-bar'); if (bar) bar.style.width = '100%';
    info.querySelector('.dz-info-thumb').innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:4px">`;
    /* sync logo-slot preview if present */
    const si = document.getElementById(id+'-slot-img');
    if (si) { si.src = dataUrl; si.style.opacity = 1; }
    toast(`Đã tải ${fmtSize(file.size)}`, 'ok');
  };
  fr.readAsDataURL(file);
}
function imgFieldValue(id) {
  const el = document.getElementById(id+'-val');
  return el ? el.value.trim() : '';
}

// ===== VR PREVIEW PANEL =====
function previewVR(url, title = 'Preview VR') {
  const safe = url || '../index.html';
  showPanel(title, `
    <div style="display:flex;flex-direction:column;gap:10px;height:100%">
      <div style="display:flex;gap:8px;align-items:center">
        <input class="form-control" id="vr-prev-url" value="${esc(safe)}" style="flex:1">
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('vr-prev-frame').src=document.getElementById('vr-prev-url').value">${ico('refresh')} Tải</button>
        <a class="btn btn-secondary btn-sm" href="${esc(safe)}" target="_blank">${ico('globe')} Mở tab mới</a>
      </div>
      <div style="flex:1;min-height:520px;border:1px solid var(--border);border-radius:var(--r);overflow:hidden;background:#000">
        <iframe id="vr-prev-frame" src="${esc(safe)}" style="width:100%;height:100%;min-height:520px;border:0" allow="fullscreen"></iframe>
      </div>
    </div>
  `, null);
  document.getElementById('sp-save').style.display = 'none';
  // Mở rộng slide-panel cho preview
  const sp = document.getElementById('sp');
  sp.classList.add('sp-wide');
}
// ========================================================================
// 1) GALLERY ─ thư viện ảnh
// ========================================================================
/* ---------- Gallery: state, helpers ---------- */
S.galleryFolder ??= '__all'; // '__all' | '__none' | <folder name>
S.galleryTab    ??= 'image'; // 'image' | 'video'

function galleryListAll() {
  // Normalize legacy items (no `type`) to image.
  return (S.data.gallery || []).map(g => ({ type: 'image', ...g }));
}
function galleryListByTab() {
  return galleryListAll()
    .map((g,i) => ({ g, i }))
    .filter(({g}) => S.galleryTab === 'video' ? g.type === 'video' : g.type !== 'video');
}
function galleryFolders() {
  const set = new Set();
  galleryListByTab().forEach(({g}) => { if (g.folder) set.add(g.folder); });
  return [...set].sort((a,b) => a.localeCompare(b, 'vi'));
}
function galleryFilteredIndexes() {
  const f = S.galleryFolder;
  return galleryListByTab()
    .filter(({g}) => f === '__all' ? true : f === '__none' ? !g.folder : g.folder === f);
}
function galleryFolderCount(name) {
  const all = galleryListByTab();
  if (name === '__all')  return all.length;
  if (name === '__none') return all.filter(({g}) => !g.folder).length;
  return all.filter(({g}) => g.folder === name).length;
}
function galleryPickTab(tab) {
  if (S.galleryTab === tab) return;
  S.galleryTab = tab;
  S.galleryFolder = '__all'; // reset folder filter khi đổi tab
  go('gallery');
}

/* Convert YouTube / Vimeo URL to embed URL; return null if not recognized. */
function videoEmbedUrl(url) {
  if (!url) return null;
  let m;
  if ((m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/))) {
    return `https://www.youtube.com/embed/${m[1]}`;
  }
  if ((m = url.match(/youtube\.com\/embed\/([\w-]+)/))) return url;
  if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) {
    return `https://player.vimeo.com/video/${m[1]}`;
  }
  if (url.startsWith('https://player.vimeo.com/')) return url;
  const did = adminDriveFileId(url);
  if (did) return `https://drive.google.com/file/d/${did}/preview`;
  return null;
}
function detectVideoSource(url) {
  if (!url) return '';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url))             return 'vimeo';
  if (/drive\.google\.com|docs\.google\.com/.test(url)) return 'drive';
  if (url.startsWith('blob:'))            return 'upload';
  return 'mp4';
}

/* ---------- Render ---------- */
function renderGalleryPage(el) {
  const all = galleryListAll();
  const imgCount = all.filter(g => g.type !== 'video').length;
  const vidCount = all.filter(g => g.type === 'video').length;
  const folders = galleryFolders();
  const filtered = galleryFilteredIndexes();
  const cur = S.galleryFolder;
  const tab = S.galleryTab;
  const curLabel = cur === '__all' ? 'Tất cả' : cur === '__none' ? 'Chưa phân loại' : cur;
  const tabLabel = tab === 'video' ? 'Video' : 'Ảnh';

  const addBtn = tab === 'video'
    ? `<button class="btn btn-primary btn-sm" onclick="galleryAddVideo()">${ico('video')} Thêm video</button>`
    : `<button class="btn btn-primary btn-sm" onclick="galleryAddImage()">${ico('image')} Thêm ảnh</button>`;

  const tabBtn = (key, label, iconName, count) => {
    const active = tab === key;
    return `<button onclick="galleryPickTab('${key}')"
      style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border:none;border-bottom:2px solid ${active?'var(--primary)':'transparent'};background:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:${active?'600':'500'};color:${active?'var(--primary)':'var(--muted)'};transition:all .15s">
      ${ico(iconName,14)} ${label} <span style="font-size:11px;background:${active?'var(--primary-soft)':'var(--surface2)'};color:${active?'var(--primary)':'var(--muted)'};padding:1px 8px;border-radius:10px">${count}</span>
    </button>`;
  };

  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Thư Viện',
    `<button class="btn btn-secondary btn-sm" onclick="resetData()" title="Xoá cache localStorage, đọc lại project.json">${ico('refresh')} Tải lại</button>
     <button class="btn btn-secondary btn-sm" onclick="galleryNewFolder()">${ico('plus')} Thư mục mới</button>
     ${addBtn}`)
  + `
    <!-- Tabs Ảnh / Video -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px;background:var(--surface);border-radius:8px 8px 0 0;padding:0 8px">
      ${tabBtn('image', 'Ảnh',   'image', imgCount)}
      ${tabBtn('video', 'Video', 'video', vidCount)}
    </div>

    <div style="display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:flex-start">

      <!-- Folder sidebar -->
      <div class="card" style="position:sticky;top:16px">
        <div class="card-header"><span class="card-title">${ico('folder',14)} Thư mục ${tabLabel}</span></div>
        <div style="padding:8px">
          ${folderRow('__all', 'Tất cả', 'navpanel', cur)}
          ${folderRow('__none', 'Chưa phân loại', tab === 'video' ? 'video' : 'image', cur)}
          ${folders.length ? `<div style="height:1px;background:var(--border);margin:6px 4px"></div>` : ''}
          ${folders.map(f => folderRow(f, f, 'folder', cur, true)).join('')}
        </div>
      </div>

      <!-- Media grid -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">${tabLabel} · ${esc(curLabel)} · ${filtered.length} mục</span>
          <span class="card-subtitle">${all.length} tổng · ${vidCount} video · ${imgCount} ảnh</span>
        </div>
        <div class="card-body">
          ${filtered.length === 0 ? `
            <div style="text-align:center;padding:40px;color:var(--muted)">
              ${cur === '__all'
                ? `Chưa có ${tabLabel.toLowerCase()} nào. Bấm <b>Thêm ${tab === 'video' ? 'video' : 'ảnh'}</b> để bắt đầu.`
                : `Không có mục nào trong thư mục này.`}
            </div>` : `
            <div class="gallery-grid" id="gallery-grid">
              ${filtered.map(({g, i}) => mediaCardHTML(g, i)).join('')}
            </div>`}
        </div>
      </div>
    </div>`;
}

function folderRow(value, label, iconName, current, deletable=false) {
  const active = current === value;
  const count = galleryFolderCount(value);
  return `
    <div onclick="galleryPickFolder('${value.replace(/'/g,"\\'")}')"
         style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:13px;${active?'background:var(--primary-soft);color:var(--primary);font-weight:600':'color:var(--text)'}">
      <span style="display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center">${ico(iconName,14)}</span>
      <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(label)}</span>
      <span style="font-size:11px;color:var(--muted);background:var(--surface2);padding:2px 7px;border-radius:10px">${count}</span>
      ${deletable ? `<button class="act-btn" title="Đổi tên" onclick="event.stopPropagation();galleryRenameFolder('${value.replace(/'/g,"\\'")}')" style="padding:2px;background:none;border:none;cursor:pointer;color:var(--muted)">${ico('edit',12)}</button>` : ''}
    </div>`;
}

function mediaCardHTML(g, i) {
  const isVideo = g.type === 'video';
  // Ưu tiên poster/thumb; nếu không có, đọc thumbnail từ link (gồm Drive)
  const thumb = (g.poster || g.thumb)
    ? assetPath(g.poster || g.thumb)
    : thumbPath(g.src || '');
  return `
    <div class="gal-card" draggable="true" data-i="${i}"
         ondragstart="galleryDragStart(${i})" ondragover="event.preventDefault()"
         ondrop="galleryDrop(${i})">
      <div class="gal-thumb" onclick="galleryOpenPreview(${i})" style="cursor:pointer;position:relative">
        ${thumb
          ? `<img src="${esc(thumb)}" alt="${esc(g.title||'')}" loading="lazy" onerror="this.style.opacity=.2">`
          : `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#0f172a;color:#475569">${ico('video',32)}</div>`}
        <div class="gal-idx">#${i+1}</div>
        ${isVideo ? `
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.25);pointer-events:none">
            <div style="width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;color:#fff">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div style="position:absolute;top:8px;left:8px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:.04em">VIDEO</div>
        ` : ''}
        ${g.folder ? `<div style="position:absolute;bottom:8px;left:8px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;padding:3px 8px;border-radius:10px">${ico('folder',10)} ${esc(g.folder)}</div>` : ''}
      </div>
      <div class="gal-meta">
        <div class="gal-title">${esc(g.title||'(không tiêu đề)')}</div>
        <div class="gal-src">${esc(g.src||'')}</div>
      </div>
      <div class="gal-actions">
        <button class="act-btn" title="Sửa" onclick="galleryEdit(${i})">${ico('edit')}</button>
        <button class="act-btn danger" title="Xoá" onclick="galleryDel(${i})">${ico('trash')}</button>
      </div>
    </div>`;
}

/* ---------- Folder actions ---------- */
function galleryPickFolder(name) {
  S.galleryFolder = name;
  go('gallery');
}
function galleryNewFolder() {
  const name = prompt('Tên thư mục mới:');
  if (!name) return;
  const n = name.trim();
  if (!n) return;
  if (galleryFolders().includes(n)) { toast('Thư mục đã tồn tại', 'warn'); return; }
  // Empty folder: persist by creating it via filter only — but we need at least one tag.
  // Strategy: just switch view; folder appears after first item is assigned. So warn:
  S.galleryFolder = n;
  toast(`Đã chọn thư mục "${n}". Thêm mục mới hoặc gán mục cũ vào để thư mục hiển thị.`, 'info');
  go('gallery');
}
function galleryRenameFolder(oldName) {
  const next = prompt(`Đổi tên thư mục "${oldName}" thành:`, oldName);
  if (!next) return;
  const n = next.trim();
  if (!n || n === oldName) return;
  let changed = 0;
  (S.data.gallery || []).forEach(g => { if (g.folder === oldName) { g.folder = n; changed++; } });
  if (S.galleryFolder === oldName) S.galleryFolder = n;
  saveData(`Đã đổi tên ${changed} mục sang thư mục "${n}"`);
  go('gallery');
}

/* ---------- CRUD ---------- */
function galleryAddImage() { S.galleryTab = 'image'; galleryForm({ type:'image', src:'', title:'', folder: defaultFolderForNew() }, -1); }
function galleryAddVideo() { S.galleryTab = 'video'; galleryForm({ type:'video', src:'', title:'', folder: defaultFolderForNew(), videoSource:'youtube', poster:'' }, -1); }
function galleryAdd()      { galleryAddImage(); } // back-compat
function galleryEdit(i)    { galleryForm({ type:'image', ...S.data.gallery[i] }, i); }
function defaultFolderForNew() {
  const f = S.galleryFolder;
  return (f === '__all' || f === '__none') ? '' : f;
}

function galleryForm(g, idx) {
  const isVideo = g.type === 'video';
  const folders = galleryFolders();
  const folderOptions = `
    <option value="">— Chưa phân loại —</option>
    ${folders.map(f => `<option value="${esc(f)}" ${g.folder===f?'selected':''}>${esc(f)}</option>`).join('')}
    <option value="__new__">+ Tạo thư mục mới…</option>`;

  const imageFields = `
    ${imageField('g-src', 'Ảnh', g.src, { required:true })}
  `;
  const videoFields = `
    <div class="form-group">
      <label class="form-label">Nguồn video</label>
      <select class="form-control" id="g-vsource" onchange="onVideoSourceChange()">
        <option value="youtube" ${g.videoSource==='youtube'?'selected':''}>YouTube</option>
        <option value="vimeo"   ${g.videoSource==='vimeo'?'selected':''}>Vimeo</option>
        <option value="drive"   ${g.videoSource==='drive'?'selected':''}>Google Drive</option>
        <option value="mp4"     ${g.videoSource==='mp4'?'selected':''}>URL mp4/webm trực tiếp</option>
        <option value="upload"  ${g.videoSource==='upload'?'selected':''}>Upload file (tạm thời, mất khi reload)</option>
      </select>
    </div>
    <div class="form-group" id="g-url-wrap">
      <label class="form-label">URL video *</label>
      <input class="form-control" id="g-src" value="${esc(g.src||'')}" placeholder="VD: https://www.youtube.com/watch?v=...">
      <small class="c-muted" id="g-url-hint">Dán link YouTube/Vimeo/mp4. Hệ thống sẽ tự chuyển sang embed.</small>
    </div>
    <div class="form-group" id="g-upload-wrap" style="display:none">
      <label class="form-label">Chọn file video</label>
      <input class="form-control" type="file" id="g-file" accept="video/*" onchange="onVideoFilePick(event)">
      <small class="c-muted">File chỉ tồn tại trong phiên hiện tại (chưa có lưu trữ backend).</small>
    </div>
    ${imageField('g-poster', 'Ảnh thumbnail (tuỳ chọn)', g.poster||'')}
  `;

  showPanel(idx>=0 ? (isVideo?'Sửa video':'Sửa ảnh') : (isVideo?'Thêm video':'Thêm ảnh mới'), `
    <input type="hidden" id="g-type" value="${isVideo?'video':'image'}">
    ${isVideo ? videoFields : imageFields}
    <div class="form-group"><label class="form-label">Tiêu đề</label>
      <input class="form-control" id="g-title" value="${esc(g.title||'')}" placeholder="VD: Sky Lounge tầng 42"></div>
    <div class="form-group"><label class="form-label">Thư mục</label>
      <select class="form-control" id="g-folder" onchange="onFolderSelectChange()">${folderOptions}</select>
      <input class="form-control" id="g-folder-new" placeholder="Nhập tên thư mục mới" style="display:none;margin-top:6px">
    </div>
  `, () => {
    const type = document.getElementById('g-type').value;
    let folder = document.getElementById('g-folder').value;
    if (folder === '__new__') folder = document.getElementById('g-folder-new').value.trim();

    const title = document.getElementById('g-title').value.trim();
    const o = { type, title };
    if (folder) o.folder = folder;

    if (type === 'video') {
      const src = document.getElementById('g-src').value.trim();
      if (!src) { toast('Cần URL video hoặc upload file', 'warn'); return false; }
      const vs = document.getElementById('g-vsource').value;
      o.src = src;
      o.videoSource = vs;
      const poster = imgFieldValue('g-poster');
      if (poster) o.poster = poster;
    } else {
      const src = imgFieldValue('g-src');
      if (!src) { toast('Cần ảnh', 'warn'); return false; }
      o.src = src;
    }

    if (idx>=0) S.data.gallery[idx] = o;
    else        S.data.gallery.push(o);
    saveData(idx>=0 ? 'Đã cập nhật' : (type==='video'?'Đã thêm video':'Đã thêm ảnh'));
    closePanel(); go('gallery');
  });

  // Restore initial visibility for video form
  if (isVideo) setTimeout(onVideoSourceChange, 0);
}

function onFolderSelectChange() {
  const sel = document.getElementById('g-folder');
  const inp = document.getElementById('g-folder-new');
  if (!sel || !inp) return;
  if (sel.value === '__new__') { inp.style.display = ''; inp.focus(); }
  else { inp.style.display = 'none'; inp.value = ''; }
}

function onVideoSourceChange() {
  const vs   = document.getElementById('g-vsource')?.value;
  const urlW = document.getElementById('g-url-wrap');
  const upW  = document.getElementById('g-upload-wrap');
  const hint = document.getElementById('g-url-hint');
  if (!vs || !urlW || !upW) return;
  if (vs === 'upload') {
    urlW.style.display = 'none';
    upW.style.display = '';
  } else {
    urlW.style.display = '';
    upW.style.display = 'none';
    if (hint) hint.textContent =
      vs === 'youtube' ? 'Dán link YouTube (watch?v=, youtu.be/, shorts/…). Tự chuyển sang embed.'
    : vs === 'vimeo'   ? 'Dán link Vimeo (vimeo.com/123456). Tự chuyển sang player.vimeo.com/video/...'
    : vs === 'drive'   ? 'Dán link file Google Drive (drive.google.com/file/d/…). File cần ở chế độ chia sẻ công khai. Thumbnail tự đọc.'
    :                    'Dán URL file .mp4 / .webm truy cập công khai.';
  }
}

function onVideoFilePick(ev) {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  // Stash blob URL into hidden #g-src so existing save flow picks it up
  let srcInput = document.getElementById('g-src');
  if (!srcInput) {
    srcInput = document.createElement('input');
    srcInput.type = 'hidden';
    srcInput.id = 'g-src';
    ev.target.parentElement.appendChild(srcInput);
  }
  srcInput.value = url;
  toast(`Đã chọn file ${f.name}`, 'ok');
}

function galleryDel(i) {
  const item = S.data.gallery[i];
  confirmDel(`Xoá ${item.type==='video'?'video':'ảnh'} này?`, item.title || item.src, () => {
    S.data.gallery.splice(i, 1);
    saveData('Đã xoá'); go('gallery');
  });
}

function galleryDragStart(i) { S.dragSrc = i; }
function galleryDrop(target) {
  const src = S.dragSrc;
  if (src == null || src === target) return;
  const arr = S.data.gallery;
  const [moved] = arr.splice(src, 1);
  arr.splice(target, 0, moved);
  S.dragSrc = null;
  saveData('Đã sắp xếp lại'); go('gallery');
}

/* ---------- Preview modal ---------- */
function galleryOpenPreview(i) {
  const g = S.data.gallery[i];
  if (!g) return;
  const isVideo = g.type === 'video';
  let playerHTML = '';
  if (isVideo) {
    const embed = videoEmbedUrl(g.src);
    if (embed) {
      playerHTML = `<iframe src="${esc(embed)}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0" style="width:100%;aspect-ratio:16/9;background:#000;border-radius:8px"></iframe>`;
    } else {
      playerHTML = `<video src="${esc(g.src)}" ${g.poster?`poster="${esc(g.poster)}"`:''} controls autoplay style="width:100%;max-height:78vh;background:#000;border-radius:8px"></video>`;
    }
  } else {
    const did = adminDriveFileId(g.src);
    const imgSrc = did
      ? `https://drive.google.com/thumbnail?id=${did}&sz=w1600`
      : assetPath(g.src);
    playerHTML = `<img src="${esc(imgSrc)}" alt="${esc(g.title||'')}" style="width:100%;max-height:78vh;object-fit:contain;background:#0f172a;border-radius:8px">`;
  }
  const back = document.createElement('div');
  back.id = 'media-preview';
  back.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.88);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(6px)';
  back.innerHTML = `
    <div style="max-width:1100px;width:100%">
      <div style="display:flex;align-items:center;justify-content:space-between;color:#fff;margin-bottom:10px;gap:12px">
        <div style="min-width:0">
          <div style="font-weight:700;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(g.title||'(không tiêu đề)')}</div>
          <div style="font-size:12px;color:rgba(255,255,255,.55);margin-top:2px">${g.folder?`${ico('folder',12)} ${esc(g.folder)} · `:''}${isVideo?'Video':'Ảnh'}</div>
        </div>
        <button onclick="closeMediaPreview()" style="background:rgba(255,255,255,.1);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:20px;flex-shrink:0">×</button>
      </div>
      ${playerHTML}
    </div>`;
  back.addEventListener('click', e => { if (e.target === back) closeMediaPreview(); });
  document.body.appendChild(back);
  document.addEventListener('keydown', mediaPreviewEsc);
}
function closeMediaPreview() {
  document.getElementById('media-preview')?.remove();
  document.removeEventListener('keydown', mediaPreviewEsc);
}
function mediaPreviewEsc(e) { if (e.key === 'Escape') closeMediaPreview(); }

// ========================================================================
// 2) SITE MAP 2D ─ Bản đồ tương tác (Leaflet) + hotspot
// ========================================================================
let _adminMap = null;
let _adminMarkers = [];

function renderSiteMapPage(el) {
  const sm = S.data.siteMap;
  const center = sm.center || [16.2130, 108.1200];
  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Bản Đồ Vị Trí',
    `<button class="btn btn-primary btn-sm" onclick="siteMapAddManual()">${ico('plus')} Thêm điểm</button>`)
  + `
    <div class="g21">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Bản đồ & Hotspot</span>
          <span class="card-subtitle">Click trên bản đồ để thêm điểm · Kéo marker để di chuyển</span>
        </div>
        <div class="card-body">
          <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
            <div class="form-group" style="flex:1;min-width:120px;margin:0">
              <label class="form-label" style="margin-bottom:4px">Tâm bản đồ (Lat, Lng)</label>
              <div style="display:flex;gap:6px">
                <input class="form-control" id="sm-center-lat" type="number" step="0.0001" value="${center[0]}" style="flex:1" placeholder="Latitude">
                <input class="form-control" id="sm-center-lng" type="number" step="0.0001" value="${center[1]}" style="flex:1" placeholder="Longitude">
                <button class="btn btn-secondary btn-sm" onclick="siteMapUpdateCenter()" title="Cập nhật tâm">${ico('mappin')}</button>
              </div>
            </div>
          </div>
          <div id="admin-sm-map" style="width:100%;height:450px;border-radius:10px;border:1px solid var(--border);z-index:0"></div>
          <div style="display:flex;justify-content:space-between;margin-top:8px;align-items:center">
            <button class="btn btn-secondary btn-sm" onclick="saveData('Đã lưu bản đồ')">${ico('save')} Lưu thay đổi</button>
            <span class="c-muted" style="font-size:11px">Click trên bản đồ = thêm hotspot · Kéo marker = di chuyển</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Danh sách điểm (${(sm.points||[]).length})</span></div>
        <div class="card-body p0">
          ${(sm.points||[]).length===0 ? `<div style="text-align:center;padding:32px;color:var(--muted)">Chưa có điểm nào. Click trên bản đồ để thêm.</div>` :
            `<div class="sm-list">${(sm.points||[]).map((p,i)=>`
              <div class="sm-item">
                <div class="sm-item-info">
                  <div class="sm-item-title">${esc(p.label||'(chưa đặt tên)')}</div>
                  <div class="sm-item-meta mono">id:${esc(p.id||'—')} · ${p.lat},${p.lng} · pano:${esc(p.tdvPanoramaId||'—')}</div>
                </div>
                <button class="act-btn" title="Tìm trên bản đồ" onclick="siteMapFlyTo(${i})">${ico('mappin')}</button>
                <button class="act-btn" onclick="siteMapEdit(${i})">${ico('edit')}</button>
                <button class="act-btn danger" onclick="siteMapDel(${i})">${ico('trash')}</button>
              </div>`).join('')}</div>`}
        </div>
      </div>
    </div>`;
  /* Init Leaflet after DOM update */
  setTimeout(() => siteMapInitAdmin(), 50);
}

function siteMapInitAdmin() {
  const sm = S.data.siteMap;
  const center = sm.center || [16.2130, 108.1200];
  const zoom = sm.zoom || 14;
  const mapEl = document.getElementById('admin-sm-map');
  if (!mapEl || !window.L) return;
  if (_adminMap) { _adminMap.remove(); _adminMap = null; }
  _adminMarkers = [];
  _adminMap = L.map('admin-sm-map').setView(center, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', maxZoom: 19
  }).addTo(_adminMap);
  /* Add existing markers */
  (sm.points || []).forEach((p, i) => {
    if (p.lat == null || p.lng == null) return;
    const marker = L.marker([p.lat, p.lng], { draggable: true }).addTo(_adminMap);
    marker.bindTooltip(esc(p.label || p.id), { permanent: false, direction: 'top' });
    marker.on('dragend', () => {
      const ll = marker.getLatLng();
      S.data.siteMap.points[i].lat = +ll.lat.toFixed(6);
      S.data.siteMap.points[i].lng = +ll.lng.toFixed(6);
      toast(`Đã di chuyển "${p.label}" → ${ll.lat.toFixed(4)}, ${ll.lng.toFixed(4)}`, 'ok');
    });
    _adminMarkers.push(marker);
  });
  /* Click on map to add */
  _adminMap.on('click', (e) => {
    siteMapOpenForm({
      lat: +e.latlng.lat.toFixed(6),
      lng: +e.latlng.lng.toFixed(6),
      id: 'p' + Date.now().toString(36),
      label: '', tdvPanoramaId: ''
    }, -1);
  });
  /* Save zoom/center on move */
  _adminMap.on('moveend', () => {
    const c = _adminMap.getCenter();
    S.data.siteMap.center = [+c.lat.toFixed(6), +c.lng.toFixed(6)];
    S.data.siteMap.zoom = _adminMap.getZoom();
  });
}

function siteMapUpdateCenter() {
  const lat = parseFloat(document.getElementById('sm-center-lat').value);
  const lng = parseFloat(document.getElementById('sm-center-lng').value);
  if (isNaN(lat) || isNaN(lng)) { toast('Toạ độ không hợp lệ', 'warn'); return; }
  S.data.siteMap.center = [lat, lng];
  if (_adminMap) _adminMap.setView([lat, lng], _adminMap.getZoom());
  toast(`Tâm bản đồ: ${lat}, ${lng}`, 'ok');
}

function siteMapFlyTo(i) {
  const p = S.data.siteMap.points[i];
  if (_adminMap && p.lat != null) {
    _adminMap.flyTo([p.lat, p.lng], 17);
    if (_adminMarkers[i]) _adminMarkers[i].openTooltip();
  }
}

function siteMapAddManual() {
  const center = S.data.siteMap.center || [16.2130, 108.1200];
  siteMapOpenForm({
    lat: center[0], lng: center[1],
    id: 'p' + Date.now().toString(36), label: '', tdvPanoramaId: ''
  }, -1);
}

function siteMapEdit(i) { siteMapOpenForm({ ...S.data.siteMap.points[i] }, i); }
function siteMapDel(i) {
  confirmDel('Xoá điểm này?', S.data.siteMap.points[i].label||'', () => {
    S.data.siteMap.points.splice(i,1); saveData('Đã xoá điểm'); go('sitemap');
  });
}

async function siteMapOpenForm(pt, idx) {
  const panos = await fetchPanoramas();
  showPanel(idx>=0 ? 'Sửa điểm' : 'Thêm điểm', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">ID</label>
        <input class="form-control" id="pt-id" value="${esc(pt.id||'')}"></div>
      <div class="form-group"><label class="form-label">Panorama VR</label>
        <select class="form-control" id="pt-pano" style="flex:1">
          <option value="">— Không liên kết —</option>
          ${panos.map(p=>`<option value="${p.name}" ${p.name===pt.tdvPanoramaId?'selected':''}>${p.name}</option>`).join('')}
        </select></div>
    </div>
    <div class="form-group"><label class="form-label">Nhãn hiển thị *</label>
      <input class="form-control" id="pt-label" value="${esc(pt.label||'')}" placeholder="VD: Tòa The Park (I2)"></div>
    <div class="form-section" style="margin:12px 0 6px">Toạ độ</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Latitude</label>
        <input class="form-control" type="number" step="0.000001" id="pt-lat" value="${pt.lat||''}"></div>
      <div class="form-group"><label class="form-label">Longitude</label>
        <input class="form-control" type="number" step="0.000001" id="pt-lng" value="${pt.lng||''}"></div>
    </div>
    <div class="form-section" style="margin:8px 0 6px">Hoặc nhập địa chỉ</div>
    <div class="form-group">
      <div style="display:flex;gap:6px">
        <input class="form-control" id="pt-address" placeholder="VD: Làng Vân, Đà Nẵng" style="flex:1">
        <button type="button" class="btn btn-secondary btn-sm" onclick="siteMapGeocode()">${ico('mappin')} Tìm</button>
      </div>
      <div id="pt-geocode-status" style="font-size:11px;color:var(--muted);margin-top:4px"></div>
    </div>
  `, () => {
    const lat = parseFloat(document.getElementById('pt-lat').value);
    const lng = parseFloat(document.getElementById('pt-lng').value);
    if (isNaN(lat) || isNaN(lng)) { toast('Cần nhập toạ độ hợp lệ', 'warn'); return; }
    const o = {
      id: document.getElementById('pt-id').value.trim() || 'p'+Date.now().toString(36),
      label: document.getElementById('pt-label').value.trim(),
      tdvPanoramaId: document.getElementById('pt-pano').value || undefined,
      lat: +lat.toFixed(6),
      lng: +lng.toFixed(6),
    };
    if (!o.label) { toast('Cần nhập nhãn', 'warn'); return; }
    if (idx>=0) S.data.siteMap.points[idx] = o;
    else        S.data.siteMap.points.push(o);
    saveData(idx>=0?'Đã cập nhật điểm':'Đã thêm điểm');
    closePanel(); go('sitemap');
  });
}

async function siteMapGeocode() {
  const addr = document.getElementById('pt-address').value.trim();
  const status = document.getElementById('pt-geocode-status');
  if (!addr) { status.textContent = 'Nhập địa chỉ trước'; return; }
  status.textContent = 'Đang tìm…';
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`, {
      headers: { 'Accept-Language': 'vi' }
    });
    const data = await res.json();
    if (data.length === 0) { status.innerHTML = '<span style="color:var(--danger)">Không tìm thấy. Thử nhập cụ thể hơn.</span>'; return; }
    const r = data[0];
    document.getElementById('pt-lat').value = (+r.lat).toFixed(6);
    document.getElementById('pt-lng').value = (+r.lon).toFixed(6);
    status.innerHTML = `<span style="color:var(--success)">✓ ${esc(r.display_name).slice(0,80)}</span>`;
  } catch (e) {
    status.innerHTML = '<span style="color:var(--danger)">Lỗi kết nối. Thử lại sau.</span>';
  }
}

// ========================================================================
// 3) AMENITIES ─ 4 nhóm tiện ích + card amenities
// ========================================================================
const AM_GROUPS = [
  ['noiKhu',     'Nội Khu',        'leaf'],
  ['skyAmenity', 'Sky Amenity',    'sky',  'building'],
  ['dichVu',     'Dịch Vụ',        'concierge', 'users'],
  ['haTang',     'Hạ Tầng',        'parking',   'hardhat'],
];

function renderAmenitiesPage(el) {
  const det = S.data.amenitiesDetail;
  const cardAm = S.data.project.amenities || [];
  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Tiện Ích Dự Án') + `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">${ico('home',16)} Tiện ích trên Project Card (${cardAm.length})</span>
        <button class="btn btn-primary btn-sm" onclick="amCardAdd()">${ico('plus')} Thêm</button>
      </div>
      <div class="card-body">
        <div class="form-hint" style="margin-bottom:10px">Icon list ngắn hiển thị ở project card trên trang VR (project.amenities[])</div>
        <div class="am-chips">
          ${cardAm.map((a,i)=>`
            <div class="am-chip">
              <span class="am-chip-icon">${ico('leaf',14)}</span>
              <span><b>${esc(a.label||'')}</b><br><span class="c-muted" style="font-size:10px">icon: ${esc(a.icon||'')}</span></span>
              <button class="act-btn" onclick="amCardEdit(${i})">${ico('edit')}</button>
              <button class="act-btn danger" onclick="amCardDel(${i})">${ico('trash')}</button>
            </div>`).join('')}
          ${cardAm.length===0 ? `<div class="c-muted" style="font-size:12px">Chưa có. Bấm Thêm.</div>`:''}
        </div>
      </div>
    </div>
    ${AM_GROUPS.map(([k,title,_ic,navIco])=>{
      const arr = det[k] || [];
      return `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <span class="card-title">${ico(navIco||'leaf',16)} ${title} (${arr.length})</span>
          <button class="btn btn-primary btn-sm" onclick="amDetailAdd('${k}')">${ico('plus')} Thêm</button>
        </div>
        <div class="card-body p0">
          ${arr.length===0 ? `<div style="padding:24px;text-align:center;color:var(--muted)">Chưa có mục nào.</div>` : `
            <div class="am-list">
              ${arr.map((a,i)=>`
                <div class="am-item">
                  <div class="am-item-icon mono">${esc(a.icon||'?')}</div>
                  <div class="am-item-body">
                    <div class="am-item-name">${esc(a.name||'')}</div>
                    <div class="am-item-desc">${esc(a.desc||'')}</div>
                  </div>
                  <div class="am-item-actions">
                    <button class="act-btn" onclick="amDetailEdit('${k}',${i})">${ico('edit')}</button>
                    <button class="act-btn danger" onclick="amDetailDel('${k}',${i})">${ico('trash')}</button>
                  </div>
                </div>`).join('')}
            </div>`}
        </div>
      </div>`;
    }).join('')}`;
}

function amCardAdd() { amCardForm({ icon:'', label:'' }, -1); }
function amCardEdit(i) { amCardForm({ ...S.data.project.amenities[i] }, i); }
function amCardDel(i)  {
  confirmDel('Xoá tiện ích này?', S.data.project.amenities[i].label, () => {
    S.data.project.amenities.splice(i,1); saveData('Đã xoá'); go('amenities');
  });
}
function amCardForm(o, idx) {
  showPanel(idx>=0?'Sửa tiện ích':'Thêm tiện ích', `
    <div class="form-group"><label class="form-label">Icon key *</label>
      <input class="form-control" id="ac-icon" value="${esc(o.icon||'')}" placeholder="pool, gym, spa, school, mall, park, sky, kid…"></div>
    <div class="form-group"><label class="form-label">Nhãn *</label>
      <input class="form-control" id="ac-label" value="${esc(o.label||'')}" placeholder="VD: Bể bơi vô cực"></div>
    ${imageField('ac-iconImg', 'Ảnh icon tuỳ chỉnh (tuỳ chọn)', o.iconImg||'')}
  `, () => {
    const obj = {
      icon: document.getElementById('ac-icon').value.trim(),
      label: document.getElementById('ac-label').value.trim(),
    };
    const img = imgFieldValue('ac-iconImg'); if (img) obj.iconImg = img;
    if (!obj.label) { toast('Cần nhập nhãn', 'warn'); return; }
    if (idx>=0) S.data.project.amenities[idx] = obj;
    else        S.data.project.amenities.push(obj);
    saveData('Đã lưu'); closePanel(); go('amenities');
  });
}

function amDetailAdd(grp) { amDetailForm(grp, { icon:'', name:'', desc:'' }, -1); }
function amDetailEdit(grp, i) { amDetailForm(grp, { ...S.data.amenitiesDetail[grp][i] }, i); }
function amDetailDel(grp, i) {
  confirmDel('Xoá mục này?', S.data.amenitiesDetail[grp][i].name, () => {
    S.data.amenitiesDetail[grp].splice(i,1); saveData('Đã xoá'); go('amenities');
  });
}
function amDetailForm(grp, o, idx) {
  showPanel(idx>=0?'Sửa tiện ích':'Thêm tiện ích', `
    <div class="form-group"><label class="form-label">Icon key</label>
      <input class="form-control" id="ad-icon" value="${esc(o.icon||'')}" placeholder="pool, gym, spa, …"></div>
    <div class="form-group"><label class="form-label">Tên *</label>
      <input class="form-control" id="ad-name" value="${esc(o.name||'')}" placeholder="VD: Bể bơi vô cực 50m"></div>
    <div class="form-group"><label class="form-label">Mô tả</label>
      <textarea class="form-control" id="ad-desc" rows="3">${esc(o.desc||'')}</textarea></div>
    ${imageField('ad-img', 'Ảnh minh hoạ (tuỳ chọn)', o.img||'')}
  `, () => {
    const obj = {
      icon: document.getElementById('ad-icon').value.trim(),
      name: document.getElementById('ad-name').value.trim(),
      desc: document.getElementById('ad-desc').value.trim(),
    };
    const img = imgFieldValue('ad-img'); if (img) obj.img = img;
    if (!obj.name) { toast('Cần nhập tên', 'warn'); return; }
    if (idx>=0) S.data.amenitiesDetail[grp][idx] = obj;
    else        S.data.amenitiesDetail[grp].push(obj);
    saveData('Đã lưu'); closePanel(); go('amenities');
  });
}

// ========================================================================
// 4) TIMELINE ─ Tiến độ xây dựng
// ========================================================================
const TL_STATUS = { done:'Hoàn thành', active:'Đang thực hiện', upcoming:'Sắp tới' };

function renderTimelinePage(el) {
  const tl = S.data.timeline || [];
  const lastPulse = +localStorage.getItem('ah_timeline_pulse') || 0;
  const pulseLabel = lastPulse
    ? new Date(lastPulse).toLocaleString('vi-VN')
    : 'chưa phát sóng';
  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Tiến Độ Xây Dựng',
    `<button class="btn btn-secondary btn-sm" onclick="tlBroadcast()" title="Đẩy bản cập nhật ra trang VR ngay lập tức">${ico('refresh')} Phát sóng cập nhật</button>
     <button class="btn btn-primary btn-sm" onclick="tlAdd()">${ico('plus')} Thêm mốc</button>`)
  + `
    <div class="card" style="margin-bottom:12px;background:rgba(59,130,246,.06);border-color:rgba(59,130,246,.25)">
      <div style="padding:10px 14px;display:flex;align-items:center;gap:10px;font-size:13px">
        <span style="display:inline-flex;align-items:center;gap:6px;color:#60a5fa;font-weight:600">${ico('refresh',14)} Real-time</span>
        <span class="c-muted">Lần phát sóng gần nhất: <b style="color:var(--text)">${pulseLabel}</b></span>
        <span class="c-muted" style="margin-left:auto">Trang VR sẽ hiển thị badge "LIVE" và tự cập nhật cho khách đang xem.</span>
      </div>
    </div>` + `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${tl.length} mốc tiến độ</span>
        <span class="card-subtitle">Kéo thả để sắp xếp · status: done / active / upcoming</span>
      </div>
      <div class="card-body p0">
        ${tl.length===0 ? `<div style="padding:32px;text-align:center;color:var(--muted)">Chưa có mốc nào.</div>` : `
          <div class="tl-list" id="tl-list">
            ${tl.map((m,i)=>`
              <div class="tl-row" draggable="true" data-i="${i}"
                   ondragstart="tlDragStart(${i})" ondragover="event.preventDefault()" ondrop="tlDrop(${i})">
                <div class="tl-dot tl-${m.status||'upcoming'}"></div>
                <div class="tl-body">
                  <div class="tl-row-head">
                    <div class="tl-phase">${esc(m.phase||m.title||m.label||'')}</div>
                    <span class="badge ${m.status==='done'?'badge-ok':m.status==='active'?'badge-primary':'badge-muted'}">${TL_STATUS[m.status]||'—'}</span>
                  </div>
                  <div class="tl-date c-muted mono">${esc(m.date||'')}</div>
                  <div class="tl-desc">${esc(m.desc||'')}</div>
                </div>
                <div class="tl-actions">
                  <button class="act-btn" onclick="tlEdit(${i})">${ico('edit')}</button>
                  <button class="act-btn danger" onclick="tlDel(${i})">${ico('trash')}</button>
                </div>
              </div>`).join('')}
          </div>`}
      </div>
    </div>`;
}

function tlAdd() { tlForm({ phase:'', date:'', status:'upcoming', desc:'' }, -1); }
function tlBroadcast() {
  try {
    localStorage.setItem('ah_timeline_data', JSON.stringify(S.data.timeline || []));
    localStorage.setItem('ah_timeline_pulse', String(Date.now()));
    toast('Đã phát sóng cập nhật tiến độ tới trang VR', 'ok');
    go('timeline');
  } catch (e) {
    toast('Không thể phát sóng: ' + e.message, 'err');
  }
}
function tlEdit(i) { tlForm({ ...S.data.timeline[i] }, i); }
function tlDel(i) {
  confirmDel('Xoá mốc này?', S.data.timeline[i].phase, () => {
    S.data.timeline.splice(i,1); saveData('Đã xoá'); go('timeline');
  });
}
function tlForm(o, idx) {
  showPanel(idx>=0?'Sửa mốc tiến độ':'Thêm mốc tiến độ', `
    <div class="form-group"><label class="form-label">Tên giai đoạn *</label>
      <input class="form-control" id="tl-phase" value="${esc(o.phase||o.title||'')}" placeholder="VD: Cất nóc tháp A"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Thời gian</label>
        <input class="form-control" id="tl-date" value="${esc(o.date||'')}" placeholder="VD: Q2 / 2026"></div>
      <div class="form-group"><label class="form-label">Trạng thái</label>
        <select class="form-control" id="tl-status">
          ${Object.entries(TL_STATUS).map(([k,v])=>`<option value="${k}" ${o.status===k?'selected':''}>${v}</option>`).join('')}
        </select></div>
    </div>
    <div class="form-group"><label class="form-label">Mô tả chi tiết</label>
      <textarea class="form-control" id="tl-desc" rows="4">${esc(o.desc||'')}</textarea></div>
    ${imageField('tl-img', 'Ảnh tiến độ (tuỳ chọn)', o.img||'', { placeholder:'img/progress-q2-2026.jpg' })}
  `, () => {
    const obj = {
      phase: document.getElementById('tl-phase').value.trim(),
      date:  document.getElementById('tl-date').value.trim(),
      status:document.getElementById('tl-status').value,
      desc:  document.getElementById('tl-desc').value.trim(),
    };
    const img = imgFieldValue('tl-img');
    if (img) obj.img = img;
    if (!obj.phase) { toast('Cần nhập tên giai đoạn', 'warn'); return; }
    if (idx>=0) S.data.timeline[idx] = obj;
    else        S.data.timeline.push(obj);
    saveData('Đã lưu'); closePanel(); go('timeline');
  });
}
function tlDragStart(i) { S.dragSrc = i; }
function tlDrop(target) {
  const src = S.dragSrc;
  if (src == null || src === target) return;
  const [m] = S.data.timeline.splice(src,1);
  S.data.timeline.splice(target,0,m);
  S.dragSrc = null;
  saveData('Đã sắp xếp lại'); go('timeline');
}

// ========================================================================
// 5) LEGAL ─ Pháp lý: documents / banks / developerStats / testimonials
// ========================================================================
function renderLegalPage(el) {
  const lg = S.data.legal;
  el.innerHTML = pageHeader(['Dashboard','Hệ Thống'], 'Pháp Lý & Trust') + `
    ${legalSection('documents','Hồ Sơ Pháp Lý', lg.documents, [
      ['name','Tên giấy tờ',1],['detail','Chi tiết',2],['done','Đã có',0]
    ])}
    ${legalSection('banks','Ngân Hàng Bảo Lãnh / Cho Vay', lg.banks, [
      ['name','Ngân hàng',1],['rate','Lãi suất',1],['maxTerm','Kỳ hạn tối đa',1]
    ])}
    ${legalSection('developerStats','Thống Kê Chủ Đầu Tư (4 ô)', lg.developerStats, [
      ['value','Giá trị',1],['unit','Đơn vị',1],['label','Nhãn',2]
    ])}
    ${legalSection('testimonials','Testimonial Khách Hàng', lg.testimonials, [
      ['initials','Tên viết tắt',1],['role','Nghề',1],['unit','Căn',1],['text','Nội dung',3]
    ])}
  `;
}

function legalSection(key, title, arr, fields) {
  return `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">${title} (${arr.length})</span>
        <button class="btn btn-primary btn-sm" onclick="legalAdd('${key}')">${ico('plus')} Thêm</button>
      </div>
      <div class="card-body p0">
        ${arr.length===0 ? `<div style="padding:24px;text-align:center;color:var(--muted)">Chưa có mục nào.</div>` : `
          <div class="table-wrap"><table class="tbl">
            <thead><tr>${fields.map(f=>`<th>${f[1]}</th>`).join('')}<th style="width:80px"></th></tr></thead>
            <tbody>
              ${arr.map((it,i)=>`<tr>
                ${fields.map(([f])=>`<td>${f==='done'?`<span class="badge ${it[f]?'badge-ok':'badge-muted'}">${it[f]?'Đã có':'Chưa'}</span>`:esc(it[f]||'—')}</td>`).join('')}
                <td><div class="row-actions">
                  <button class="act-btn" onclick="legalEdit('${key}',${i})">${ico('edit')}</button>
                  <button class="act-btn danger" onclick="legalDel('${key}',${i})">${ico('trash')}</button>
                </div></td>
              </tr>`).join('')}
            </tbody>
          </table></div>`}
      </div>
    </div>`;
}

const LEGAL_FIELDS = {
  documents:      [['name','Tên giấy tờ'],['detail','Chi tiết'],['done','Đã có (true/false)','check'],['file','Tệp giấy tờ (ảnh/PDF scan)','image']],
  banks:          [['name','Ngân hàng'],['rate','Lãi suất'],['maxTerm','Kỳ hạn tối đa'],['logo','Logo ngân hàng','image']],
  developerStats: [['value','Giá trị'],['unit','Đơn vị'],['label','Nhãn']],
  testimonials:   [['initials','Tên viết tắt'],['role','Nghề'],['unit','Căn'],['text','Nội dung','textarea'],['avatar','Ảnh đại diện','image']],
};

function legalAdd(key) { legalForm(key, {}, -1); }
function legalEdit(key, i) { legalForm(key, { ...S.data.legal[key][i] }, i); }
function legalDel(key, i) {
  confirmDel('Xoá mục này?', S.data.legal[key][i].name || S.data.legal[key][i].label || '', () => {
    S.data.legal[key].splice(i,1); saveData('Đã xoá'); go('legal');
  });
}
function legalForm(key, o, idx) {
  const fields = LEGAL_FIELDS[key];
  const title = idx>=0?'Sửa mục':'Thêm mục';
  showPanel(title, `
    ${fields.map(([f,label,type])=>{
      if (type==='check') return `<div class="form-group" style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="lg-${f}" ${o[f]?'checked':''}><label for="lg-${f}" class="form-label" style="margin:0">${label}</label></div>`;
      if (type==='textarea') return `<div class="form-group"><label class="form-label">${label}</label><textarea class="form-control" id="lg-${f}" rows="4">${esc(o[f]||'')}</textarea></div>`;
      if (type==='image') return imageField('lg-'+f, label, o[f]||'');
      return `<div class="form-group"><label class="form-label">${label}</label><input class="form-control" id="lg-${f}" value="${esc(o[f]||'')}"></div>`;
    }).join('')}
  `, () => {
    const obj = {};
    fields.forEach(([f,_l,type])=>{
      if (type==='image') {
        const v = imgFieldValue('lg-'+f); if (v) obj[f] = v;
      } else {
        const elx = document.getElementById('lg-'+f);
        obj[f] = type==='check' ? elx.checked : elx.value.trim();
      }
    });
    if (idx>=0) S.data.legal[key][idx] = obj;
    else        S.data.legal[key].push(obj);
    saveData('Đã lưu'); closePanel(); go('legal');
  });
}

// ========================================================================
// 6) LOCATION ─ Vị trí & POI lân cận
// ========================================================================
const POI_CATS = {
  school: 'Trường học', hospital: 'Bệnh viện', metro: 'Metro / Giao thông',
  mall: 'TTTM / Mua sắm', airport: 'Sân bay', park: 'Công viên', office: 'Văn phòng'
};

function renderLocationPage(el) {
  const lc = S.data.location;
  el.innerHTML = pageHeader(['Dashboard','Hệ Thống'], 'Vị Trí & Tiện Ích Lân Cận') + `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><span class="card-title">${ico('mappin',16)} Toạ độ & Bản đồ</span></div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Vĩ độ (lat)</label>
            <input class="form-control" type="number" step="0.000001" id="lc-lat" value="${lc.lat||0}"></div>
          <div class="form-group"><label class="form-label">Kinh độ (lng)</label>
            <input class="form-control" type="number" step="0.000001" id="lc-lng" value="${lc.lng||0}"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Google Maps embed URL</label>
          <input class="form-control" id="lc-map" value="${esc(lc.mapSrc||'')}" placeholder="https://www.google.com/maps/embed?pb=…">
          <div class="form-hint">Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ → copy phần <code>src</code></div>
        </div>
        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-primary btn-sm" onclick="locSaveCoords()">${ico('save')} Lưu</button>
        </div>
        ${lc.mapSrc ? `<div style="margin-top:14px;border:1px solid var(--border);border-radius:var(--r);overflow:hidden">
          <iframe src="${esc(lc.mapSrc)}" width="100%" height="280" style="border:0" loading="lazy"></iframe>
        </div>` : ''}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Tiện Ích Lân Cận (${(lc.nearby||[]).length})</span>
        <button class="btn btn-primary btn-sm" onclick="poiAdd()">${ico('plus')} Thêm POI</button>
      </div>
      <div class="card-body p0">
        ${(lc.nearby||[]).length===0 ? `<div style="padding:24px;text-align:center;color:var(--muted)">Chưa có POI nào.</div>` : `
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>Loại</th><th>Tên</th><th>Khoảng cách</th><th>Thời gian</th><th style="width:80px"></th></tr></thead>
          <tbody>
            ${lc.nearby.map((p,i)=>`<tr>
              <td><span class="badge badge-primary">${POI_CATS[p.cat]||p.cat||'—'}</span></td>
              <td><b>${esc(p.name||'')}</b></td>
              <td class="mono">${esc(p.dist||'')}</td>
              <td class="mono c-muted">${esc(p.time||'')}</td>
              <td><div class="row-actions">
                <button class="act-btn" onclick="poiEdit(${i})">${ico('edit')}</button>
                <button class="act-btn danger" onclick="poiDel(${i})">${ico('trash')}</button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table></div>`}
      </div>
    </div>`;
}

function locSaveCoords() {
  S.data.location.lat    = parseFloat(document.getElementById('lc-lat').value) || 0;
  S.data.location.lng    = parseFloat(document.getElementById('lc-lng').value) || 0;
  S.data.location.mapSrc = document.getElementById('lc-map').value.trim();
  saveData('Đã lưu vị trí'); go('location');
}

function poiAdd() { poiForm({ cat:'school', name:'', dist:'', time:'' }, -1); }
function poiEdit(i) { poiForm({ ...S.data.location.nearby[i] }, i); }
function poiDel(i) {
  confirmDel('Xoá POI này?', S.data.location.nearby[i].name, () => {
    S.data.location.nearby.splice(i,1); saveData('Đã xoá'); go('location');
  });
}
function poiForm(o, idx) {
  showPanel(idx>=0?'Sửa POI':'Thêm POI', `
    <div class="form-group"><label class="form-label">Loại *</label>
      <select class="form-control" id="poi-cat">
        ${Object.entries(POI_CATS).map(([k,v])=>`<option value="${k}" ${o.cat===k?'selected':''}>${v}</option>`).join('')}
      </select></div>
    <div class="form-group"><label class="form-label">Tên địa điểm *</label>
      <input class="form-control" id="poi-name" value="${esc(o.name||'')}" placeholder="VD: Trường THCS Nguyễn Quý Đức"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Khoảng cách</label>
        <input class="form-control" id="poi-dist" value="${esc(o.dist||'')}" placeholder="VD: 0.4 km"></div>
      <div class="form-group"><label class="form-label">Thời gian di chuyển</label>
        <input class="form-control" id="poi-time" value="${esc(o.time||'')}" placeholder="VD: 5 phút"></div>
    </div>
  `, () => {
    const obj = {
      cat:  document.getElementById('poi-cat').value,
      name: document.getElementById('poi-name').value.trim(),
      dist: document.getElementById('poi-dist').value.trim(),
      time: document.getElementById('poi-time').value.trim(),
    };
    if (!obj.name) { toast('Cần nhập tên', 'warn'); return; }
    if (idx>=0) S.data.location.nearby[idx] = obj;
    else        S.data.location.nearby.push(obj);
    saveData('Đã lưu'); closePanel(); go('location');
  });
}

// ========================================================================
// 7) RESOURCES ─ Tài liệu bán hàng (Brochure, Sales kit, Brand kit, ...)
// ========================================================================
const RESOURCE_FIELDS = [
  { key: 'brochure',     label: 'Brochure dự án',            defaultType: 'pdf' },
  { key: 'salesKit',     label: 'Bộ bí kíp tư vấn (nội bộ)', defaultType: 'pdf' },
  { key: 'brandKit',     label: 'Bộ nhận diện thương hiệu',  defaultType: 'folder' },
  { key: 'priceList',    label: 'Bảng giá & chính sách',     defaultType: 'pdf' },
  { key: 'floorPlanPdf', label: 'TMB mã căn & diện tích',    defaultType: 'pdf' },
];

const RESOURCE_TYPES = [
  ['pdf',    'PDF'],
  ['folder', 'Thư mục (Drive)'],
  ['link',   'Liên kết khác'],
  ['image',  'Ảnh'],
  ['doc',    'Tài liệu Word/Doc'],
  ['xls',    'Bảng tính Excel'],
];

function renderResourcesPage(el) {
  const res = S.data.resources || (S.data.resources = {});
  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Tài Liệu') + `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">${ico('image',16)} Bộ tài liệu chính thức</span>
        <span class="card-subtitle">${RESOURCE_FIELDS.filter(f => res[f.key]?.url).length}/${RESOURCE_FIELDS.length} đã có link</span>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">
          ${RESOURCE_FIELDS.map(f => resourceCard(f, res[f.key] || {})).join('')}
        </div>
      </div>
    </div>
  `;
}

function resourceCard(field, item) {
  const has = !!item.url;
  const title = item.title || field.label;
  const type = item.type || field.defaultType;
  return `
    <div style="border:1px solid var(--border);border-radius:10px;padding:14px;background:var(--surface)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:36px;height:36px;border-radius:8px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${ico('image',18)}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(title)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">
            ${has ? `<span class="badge badge-ok">${esc(type.toUpperCase())}</span> đã cập nhật` : `<span class="badge badge-muted">Chưa có</span>`}
          </div>
        </div>
      </div>
      ${has ? `
        <div style="font-size:11px;color:var(--muted);padding:6px 8px;background:var(--surface2);border-radius:6px;margin-bottom:10px;word-break:break-all;font-family:monospace">${esc(item.url)}</div>
      ` : ''}
      <div style="display:flex;gap:6px">
        ${has ? `<a href="${esc(item.url)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="flex:1;text-align:center;text-decoration:none">${ico('globe',12)} Mở</a>` : ''}
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="resourceEdit('${field.key}')">${ico('edit',12)} ${has ? 'Sửa' : 'Thêm'}</button>
        ${has ? `<button class="act-btn danger" title="Xoá liên kết" onclick="resourceClear('${field.key}')">${ico('trash')}</button>` : ''}
      </div>
    </div>`;
}

function resourceEdit(key) {
  const field = RESOURCE_FIELDS.find(f => f.key === key);
  if (!field) return;
  const item = (S.data.resources && S.data.resources[key]) || {};
  showPanel(`${item.url ? 'Sửa' : 'Thêm'} — ${field.label}`, `
    <div class="form-group">
      <label class="form-label">Tiêu đề hiển thị</label>
      <input class="form-control" id="res-title" value="${esc(item.title || field.label)}" placeholder="${esc(field.label)}">
    </div>
    <div class="form-group">
      <label class="form-label">URL / Link Drive *</label>
      <input class="form-control" id="res-url" value="${esc(item.url || '')}" placeholder="https://drive.google.com/...">
      <small class="c-muted">Dán link Google Drive, OneDrive hoặc URL trực tiếp.</small>
    </div>
    <div class="form-group">
      <label class="form-label">Loại</label>
      <select class="form-control" id="res-type">
        ${RESOURCE_TYPES.map(([v,l]) => `<option value="${v}" ${(item.type || field.defaultType) === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>
  `, () => {
    const url = document.getElementById('res-url').value.trim();
    if (!url) { toast('Cần nhập URL', 'warn'); return false; }
    if (!S.data.resources) S.data.resources = {};
    S.data.resources[key] = {
      title: document.getElementById('res-title').value.trim() || field.label,
      url,
      type: document.getElementById('res-type').value,
    };
    saveData('Đã lưu tài liệu'); closePanel(); go('resources');
  });
}

function resourceClear(key) {
  const field = RESOURCE_FIELDS.find(f => f.key === key);
  confirmDel('Xoá liên kết tài liệu?', field?.label || '', () => {
    if (S.data.resources) delete S.data.resources[key];
    saveData('Đã xoá liên kết'); go('resources');
  });
}



/* ============================================================
   ADMIN — MASTERPLAN (#4 / #6)
   Tải ảnh quy hoạch + thêm/dời marker trực quan trên ảnh.
   ============================================================ */
function renderMasterplanPage(el) {
  const mp = S.data.masterplan || (S.data.masterplan = {
    image: "", intro: "", categories: [], markers: [], filterSchema: {}
  });
  const markers = mp.markers || [];
  const imgSrc = mpResolveImg(mp.image);

  el.innerHTML = pageHeader(["Dashboard", "Nội Dung VR"], "Masterplan") + `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">${ico("image", 16)} Ảnh quy hoạch</span>
        <span class="card-subtitle">Click trên ảnh để thêm marker · Kéo marker để di chuyển</span>
      </div>
      <div class="card-body">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('mp-upload').click()">
            ${ico("upload", 12)} Tải ảnh lên
          </button>
          <input type="file" id="mp-upload" accept="image/*" style="display:none" onchange="mpUploadImage(this)">
          <button class="btn btn-secondary btn-sm" onclick="mpSetImageUrl()">${ico("globe", 12)} Nhập link ảnh</button>
          <button class="btn btn-secondary btn-sm" onclick="mpMarkerEdit(-1)">${ico("plus", 12)} Thêm marker thủ công</button>
        </div>

        ${imgSrc ? `
        <div class="mp-edit-stage" id="mp-edit-stage">
          <img src="${imgSrc}" id="mp-edit-img" alt="Masterplan" draggable="false">
          <div class="mp-edit-markers" id="mp-edit-markers">
            ${markers.map((m, i) => `
              <div class="mp-edit-marker" data-idx="${i}"
                   style="left:${m.x}%;top:${m.y}%">
                <span class="mp-edit-dot mp-edit-dot-${esc(m.cat || "phankhu")}"></span>
                <span class="mp-edit-tag">${esc(m.label || "—")}</span>
              </div>`).join("")}
          </div>
        </div>
        <p class="c-muted" style="font-size:12px;margin-top:8px">
          ${markers.length} marker · Click vào marker để sửa, kéo để di chuyển.
        </p>
        ` : `
        <div style="padding:48px;text-align:center;border:1px dashed var(--border);border-radius:10px;color:var(--muted)">
          Chưa có ảnh quy hoạch. Nhấn "Tải ảnh lên" hoặc "Nhập link ảnh".
        </div>`}
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">${ico("book", 16)} Mô tả giới thiệu</span>
      </div>
      <div class="card-body">
        <textarea class="form-control" id="mp-intro" rows="3" placeholder="Tổng quan quy hoạch...">${esc(mp.intro || "")}</textarea>
        <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="saveMasterplanIntro()">${ico("save", 12)} Lưu mô tả</button>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">${ico("navpanel", 16)} Danh sách marker (${markers.length})</span>
      </div>
      <div class="card-body">
        ${markers.length ? markers.map((m, i) => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:13px;color:var(--text)">${esc(m.label || "—")}</div>
              <div style="font-size:11px;color:var(--muted);font-family:monospace">cat:${esc(m.cat || "—")} · x:${m.x} y:${m.y}${m.menuItemId ? " · → " + esc(m.menuItemId) : ""}</div>
            </div>
            <button class="act-btn" onclick="mpMarkerEdit(${i})">${ico("edit")}</button>
            <button class="act-btn danger" onclick="mpMarkerDelete(${i})">${ico("trash")}</button>
          </div>`).join("") : `<div class="c-muted" style="font-size:13px">Chưa có marker.</div>`}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico("settings", 16)} Cấu hình bộ lọc</span>
        <button class="btn btn-secondary btn-sm" onclick="mpAddFilterGroup()">${ico("plus",12)} Thêm nhóm lọc</button>
      </div>
      <div class="card-body">
        <p class="c-muted" style="font-size:13px;margin-bottom:12px">
          Các nhóm lọc hiển thị ở bộ lọc Masterplan trên trang VR.
        </p>
        <div id="mp-schema-body">${mpFilterSchemaHTML(mp.filterSchema || {})}</div>
        <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="saveMasterplanSchema()">${ico("save", 12)} Lưu bộ lọc</button>
      </div>
    </div>
  `;

  if (imgSrc) setTimeout(mpInitEditStage, 30);
}

/* Tên hiển thị của các nhóm lọc chuẩn */
const MP_GROUP_LABELS = {
  phanKhu: "Phân khu", loaiHienThi: "Loại hiển thị",
  batDongSan: "Bất động sản", trangThai: "Trạng thái",
};

function mpFilterSchemaHTML(schema) {
  const keys = Object.keys(schema || {});
  if (!keys.length) {
    return `<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px">Chưa có nhóm lọc nào.</div>`;
  }
  return keys.map(key => {
    const opts = schema[key] || [];
    return `
      <div class="mp-fg-card" data-fg="${esc(key)}" style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <input class="form-control" data-fg-name="${esc(key)}" value="${esc(MP_GROUP_LABELS[key]||key)}"
                 style="flex:1;font-weight:600" placeholder="Tên nhóm lọc">
          <span class="c-muted mono" style="font-size:11px">${esc(key)}</span>
          <button class="act-btn" title="Thêm mục" onclick="mpAddFilterOption('${esc(key)}')">${ico('plus',12)}</button>
          <button class="act-btn danger" title="Xoá nhóm" onclick="mpRemoveFilterGroup('${esc(key)}')">${ico('trash',12)}</button>
        </div>
        <div data-fg-opts="${esc(key)}">
          ${opts.map((o,i)=>mpFilterOptionRow(key,o,i)).join('') ||
            `<div class="c-muted" style="font-size:12px;padding:4px">Chưa có mục — nhấn + để thêm.</div>`}
        </div>
      </div>`;
  }).join('');
}
function mpFilterOptionRow(key, o, i) {
  return `
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px" data-fg-row="${i}">
      <input class="form-control" data-opt-id="${esc(key)}|${i}" value="${esc(o.id||'')}"
             placeholder="mã" style="flex:0 0 130px;font-family:monospace;font-size:12px">
      <input class="form-control" data-opt-label="${esc(key)}|${i}" value="${esc(o.label||'')}"
             placeholder="Tên hiển thị" style="flex:1">
      <input type="color" data-opt-color="${esc(key)}|${i}" value="${esc(o.color||'#f4c97d')}"
             title="Màu (tuỳ chọn)" style="width:38px;height:34px;padding:2px;border:1px solid var(--border);border-radius:6px;cursor:pointer">
      <button class="act-btn danger" onclick="mpRemoveFilterOption('${esc(key)}',${i})">${ico('trash',12)}</button>
    </div>`;
}
/* Đọc toàn bộ schema từ DOM */
function mpReadSchemaFromDom() {
  const body = document.getElementById('mp-schema-body');
  const schema = {};
  if (!body) return schema;
  body.querySelectorAll('.mp-fg-card').forEach(card => {
    const key = card.dataset.fg;
    const optsWrap = card.querySelector(`[data-fg-opts="${key}"]`);
    const opts = [];
    optsWrap && optsWrap.querySelectorAll('[data-fg-row]').forEach(row => {
      const idEl = row.querySelector('[data-opt-id]');
      const labelEl = row.querySelector('[data-opt-label]');
      const colorEl = row.querySelector('[data-opt-color]');
      const id = (idEl?.value || '').trim();
      if (!id) return;
      const o = { id, label: (labelEl?.value || '').trim() };
      if (colorEl && colorEl.value) o.color = colorEl.value;
      opts.push(o);
    });
    schema[key] = opts;
  });
  return schema;
}
function mpAddFilterGroup() {
  const schema = mpReadSchemaFromDom();
  const key = 'nhom' + (Object.keys(schema).length + 1);
  schema[key] = [];
  S.data.masterplan.filterSchema = schema;
  document.getElementById('mp-schema-body').innerHTML = mpFilterSchemaHTML(schema);
}
function mpRemoveFilterGroup(key) {
  const schema = mpReadSchemaFromDom();
  delete schema[key];
  S.data.masterplan.filterSchema = schema;
  document.getElementById('mp-schema-body').innerHTML = mpFilterSchemaHTML(schema);
}
function mpAddFilterOption(key) {
  const schema = mpReadSchemaFromDom();
  schema[key] = schema[key] || [];
  schema[key].push({ id: '', label: '', color: '#f4c97d' });
  S.data.masterplan.filterSchema = schema;
  document.getElementById('mp-schema-body').innerHTML = mpFilterSchemaHTML(schema);
}
function mpRemoveFilterOption(key, i) {
  const schema = mpReadSchemaFromDom();
  if (schema[key]) schema[key].splice(i, 1);
  S.data.masterplan.filterSchema = schema;
  document.getElementById('mp-schema-body').innerHTML = mpFilterSchemaHTML(schema);
}

/* Đường dẫn ảnh: data URL giữ nguyên, đường dẫn tương đối thêm "../" */
function mpResolveImg(src) {
  if (!src) return "";
  if (/^(data:|https?:|\/\/)/.test(src)) return src;
  return "../" + src;
}

/* Tải ảnh lên — đọc thành data URL lưu vào masterplan.image */
function mpUploadImage(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    S.data.masterplan.image = reader.result; // data URL
    saveData("Đã tải ảnh quy hoạch");
    go("masterplan");
  };
  reader.readAsDataURL(file);
}

function mpSetImageUrl() {
  const cur = S.data.masterplan.image || "";
  showPanel("Nhập link ảnh quy hoạch", `
    <div class="form-group">
      <label class="form-label">URL ảnh *</label>
      <input class="form-control" id="mp-img-url" value="${esc(/^data:/.test(cur) ? "" : cur)}"
             placeholder="https://... hoặc img/masterplan/...png">
      <small class="c-muted">Dán link ảnh trực tiếp hoặc đường dẫn trong thư mục dự án.</small>
    </div>
  `, () => {
    const url = document.getElementById("mp-img-url").value.trim();
    if (!url) { toast("Nhập URL ảnh", "warn"); return false; }
    S.data.masterplan.image = url;
    saveData("Đã cập nhật ảnh quy hoạch");
    closePanel();
    go("masterplan");
  });
}

/* Khởi tạo vùng ảnh tương tác: click thêm marker, kéo marker */
function mpInitEditStage() {
  const stage = document.getElementById("mp-edit-stage");
  if (!stage) return;
  const markers = S.data.masterplan.markers || [];

  /* Click trên ảnh (không trúng marker) → thêm marker mới tại vị trí đó */
  stage.addEventListener("click", (e) => {
    if (e.target.closest(".mp-edit-marker")) return;
    const r = stage.getBoundingClientRect();
    const x = +(((e.clientX - r.left) / r.width) * 100).toFixed(2);
    const y = +(((e.clientY - r.top) / r.height) * 100).toFixed(2);
    mpMarkerEdit(-1, { x, y });
  });

  /* Mỗi marker: click để sửa, kéo để di chuyển */
  stage.querySelectorAll(".mp-edit-marker").forEach((el) => {
    const idx = +el.dataset.idx;
    let dragging = false, moved = false;

    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      dragging = true; moved = false;
    });
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      moved = true;
      const r = stage.getBoundingClientRect();
      let x = ((e.clientX - r.left) / r.width) * 100;
      let y = ((e.clientY - r.top) / r.height) * 100;
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));
      el.style.left = x + "%";
      el.style.top = y + "%";
      el.dataset.x = x.toFixed(2);
      el.dataset.y = y.toFixed(2);
    });
    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      if (moved && markers[idx]) {
        markers[idx].x = +(el.dataset.x || markers[idx].x);
        markers[idx].y = +(el.dataset.y || markers[idx].y);
        saveData("Đã di chuyển marker");
      }
    });
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!moved) mpMarkerEdit(idx);
    });
  });
}

function saveMasterplanIntro() {
  S.data.masterplan.intro = document.getElementById("mp-intro").value.trim();
  saveData("Đã lưu mô tả Masterplan");
}

function saveMasterplanSchema() {
  S.data.masterplan.filterSchema = mpReadSchemaFromDom();
  saveData("Đã lưu cấu hình bộ lọc");
  go("masterplan");
}

/* Thêm / sửa marker. preset = { x, y } khi tạo từ click trên ảnh */
function mpMarkerEdit(idx, preset) {
  const mp = S.data.masterplan;
  const markers = mp.markers || (mp.markers = []);
  const m = idx >= 0 ? markers[idx] : {
    id: "m-" + Date.now().toString(36),
    label: "", cat: "phankhu",
    x: preset ? preset.x : 50,
    y: preset ? preset.y : 50,
    desc: "", menuItemId: ""
  };
  const cats = mp.categories || [];
  const catList = cats.length ? cats : [
    { id: "phankhu", label: "Phân khu" },
    { id: "hatang", label: "Hạ tầng" },
    { id: "tienich", label: "Tiện ích" },
    { id: "phuchop", label: "Khu phức hợp" }
  ];
  const catOpts = catList
    .map((c) => `<option value="${esc(c.id)}" ${c.id === m.cat ? "selected" : ""}>${esc(c.label)}</option>`)
    .join("");
  const pkItems = (S.data.menu && S.data.menu.phanKhu) || [];
  const pkOpts = '<option value="">— Không liên kết —</option>' +
    pkItems.map((it) => `<option value="${esc(it.id)}" ${it.id === m.menuItemId ? "selected" : ""}>${esc(it.label)}</option>`).join("");

  showPanel((idx >= 0 ? "Sửa" : "Thêm") + " marker", `
    <div class="form-group">
      <label class="form-label">Tên marker *</label>
      <input class="form-control" id="mk-label" value="${esc(m.label || "")}">
    </div>
    <div class="form-group">
      <label class="form-label">Mô tả ngắn</label>
      <input class="form-control" id="mk-desc" value="${esc(m.desc || "")}">
    </div>
    <div class="form-group">
      <label class="form-label">Danh mục</label>
      <select class="form-control" id="mk-cat">${catOpts}</select>
    </div>
    <div style="display:flex;gap:10px">
      <div class="form-group" style="flex:1">
        <label class="form-label">Vị trí X (%)</label>
        <input class="form-control" id="mk-x" type="number" min="0" max="100" step="0.1" value="${m.x}">
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">Vị trí Y (%)</label>
        <input class="form-control" id="mk-y" type="number" min="0" max="100" step="0.1" value="${m.y}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Liên kết tới phân khu (VR Tour)</label>
      <select class="form-control" id="mk-item">${pkOpts}</select>
    </div>
  `, () => {
    const label = document.getElementById("mk-label").value.trim();
    if (!label) { toast("Nhập tên marker", "warn"); return false; }
    const data = {
      id: m.id,
      label,
      desc: document.getElementById("mk-desc").value.trim(),
      cat: document.getElementById("mk-cat").value,
      x: parseFloat(document.getElementById("mk-x").value) || 0,
      y: parseFloat(document.getElementById("mk-y").value) || 0,
      menuItemId: document.getElementById("mk-item").value || undefined,
    };
    if (idx >= 0) markers[idx] = data;
    else markers.push(data);
    saveData("Đã lưu marker");
    closePanel();
    go("masterplan");
  });
}

function mpMarkerDelete(idx) {
  confirmDel("Xoá marker này?", "", () => {
    S.data.masterplan.markers.splice(idx, 1);
    saveData("Đã xoá marker");
    go("masterplan");
  });
}



/* ============================================================
   ADMIN — BẤT ĐỘNG SẢN (#4)
   Panel danh sách + trang chi tiết (chỉnh sửa đầy đủ).
   Nguồn dữ liệu duy nhất: S.data.properties
   ============================================================ */
const PROP_STATUS = [
  { id: "available", label: "Đang mở bán" },
  { id: "holding",   label: "Đang giữ chỗ" },
  { id: "sold",      label: "Đã bán" },
];
const PROP_TYPES = [
  { id: "can-ho",    label: "Căn hộ" },
  { id: "shophouse", label: "Shophouse" },
  { id: "biet-thu",  label: "Biệt thự" },
  { id: "nha-pho",   label: "Nhà phố" },
  { id: "dat-nen",   label: "Đất nền" },
];

/* index sản phẩm đang mở ở trang chi tiết */
let propDetailIdx = -1;

/* Đường dẫn ảnh: data/http giữ nguyên, tương đối thêm ../ */
function propImg(src) {
  if (!src) return "";
  if (/^(data:|https?:|\/\/)/.test(src)) return src;
  return "../" + src;
}
function propStatusBadge(s) {
  const map = {
    available: ["badge-ok", "Đang mở bán"],
    holding: ["badge-warning", "Đang giữ chỗ"],
    sold: ["badge-muted", "Đã bán"],
  };
  const [cls, txt] = map[s] || ["badge-muted", s || "—"];
  return `<span class="badge ${cls}">${txt}</span>`;
}

/* ============================================================
   PANEL DANH SÁCH
   ============================================================ */
let propFilter = { search: "", type: "", status: "" };

function renderPropertiesPage(el) {
  const list = S.data.properties || (S.data.properties = []);
  const filtered = propFilteredList();
  el.innerHTML = pageHeader(["Dashboard", "Quản Lý"], "Bất Động Sản",
    `<button class="btn btn-primary btn-sm" onclick="propOpenDetail(-1)">${ico("plus")} Thêm sản phẩm</button>`)
  + `
    <div class="card">
      <div class="filter-bar">
        <input class="fi" style="min-width:220px" placeholder="Tìm mã căn, tên sản phẩm…"
               value="${esc(propFilter.search)}" oninput="propFilter.search=this.value;propReloadGrid()">
        <select class="fi fi-select" onchange="propFilter.type=this.value;propReloadGrid()">
          <option value="">Tất cả loại hình</option>
          ${PROP_TYPES.map(t => `<option value="${t.id}" ${propFilter.type===t.id?'selected':''}>${t.label}</option>`).join('')}
        </select>
        <select class="fi fi-select" onchange="propFilter.status=this.value;propReloadGrid()">
          <option value="">Tất cả trạng thái</option>
          ${PROP_STATUS.map(s => `<option value="${s.id}" ${propFilter.status===s.id?'selected':''}>${s.label}</option>`).join('')}
        </select>
        <div class="filter-spacer"></div>
        <span class="c-muted" style="font-size:12px" id="prop-count">${filtered.length} sản phẩm</span>
      </div>
      <div class="card-body">
        <div id="prop-grid">${propGridHTML(filtered)}</div>
      </div>
    </div>
  `;
}

function propFilteredList() {
  return (S.data.properties || []).filter(p => {
    const q = propFilter.search.toLowerCase();
    if (q && !((p.code||'') + ' ' + (p.name||'')).toLowerCase().includes(q)) return false;
    if (propFilter.type && p.type !== propFilter.type) return false;
    if (propFilter.status && p.status !== propFilter.status) return false;
    return true;
  });
}
function propGridHTML(list) {
  if (!list.length) {
    return `<div style="padding:40px;text-align:center;color:var(--muted)">Không có sản phẩm phù hợp.</div>`;
  }
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">
    ${list.map(p => propCard(p)).join("")}
  </div>`;
}
function propReloadGrid() {
  const g = document.getElementById("prop-grid");
  const c = document.getElementById("prop-count");
  const filtered = propFilteredList();
  if (g) g.innerHTML = propGridHTML(filtered);
  if (c) c.textContent = filtered.length + " sản phẩm";
}

function propCard(p) {
  const realIdx = (S.data.properties || []).indexOf(p);
  const img = (p.images && p.images[0]) || "";
  const imgSrc = propImg(img);
  return `
    <div style="border:1px solid var(--border);border-radius:10px;overflow:hidden;background:var(--surface);cursor:pointer"
         onclick="propOpenDetail(${realIdx})">
      <div style="aspect-ratio:16/10;background:#0b1220;position:relative">
        ${imgSrc ? `<img src="${esc(imgSrc)}" style="width:100%;height:100%;object-fit:cover" alt="" onerror="this.style.opacity=.2">` : ''}
        <div style="position:absolute;top:8px;left:8px">${propStatusBadge(p.status)}</div>
      </div>
      <div style="padding:12px">
        <div style="font-size:11px;color:var(--muted);font-family:monospace">${esc(p.code || p.id || "—")}</div>
        <div style="font-weight:700;font-size:14px;color:var(--text);margin:2px 0 4px">${esc(p.name || "—")}</div>
        <div style="font-size:13px;color:var(--primary);font-weight:600">${esc(propMoney(p.price))}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px">
          ${esc(p.phanKhuLabel || "—")} · ${esc(p.typeLabel || "—")} · ${p.area || "—"}m²
        </div>
        <div style="display:flex;gap:6px;margin-top:10px" onclick="event.stopPropagation()">
          <button class="btn btn-secondary btn-sm" style="flex:1" onclick="propOpenDetail(${realIdx})">${ico("edit", 12)} Xem & sửa</button>
          <button class="act-btn danger" onclick="propDelete(${realIdx})">${ico("trash")}</button>
        </div>
      </div>
    </div>`;
}
function propMoney(v) {
  if (v == null || v === "") return "—";
  const s = String(v);
  if (/tỷ|triệu/i.test(s)) return s;
  const n = parseInt(s.replace(/\D/g, ""), 10);
  if (!n) return s;
  return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
}

function propDelete(idx) {
  const list = S.data.properties || [];
  const p = list[idx];
  confirmDel("Xoá sản phẩm này?", p ? p.name : "", () => {
    list.splice(idx, 1);
    saveData("Đã xoá sản phẩm");
    go("properties");
  });
}

/* ============================================================
   TRANG CHI TIẾT — chỉnh sửa đầy đủ
   ============================================================ */
function propOpenDetail(idx) {
  propDetailIdx = idx;
  window.__propDraft = null; // reset bản nháp cho sản phẩm mới
  go("property-detail");
}

function propBlank() {
  return {
    id: "", code: "", name: "", phanKhu: "", phanKhuLabel: "",
    type: "can-ho", typeLabel: "Căn hộ", price: "", pricePerM2: "",
    priceVal: 0, area: 0, bedrooms: 0, bathrooms: 0,
    floor: undefined, available: undefined, total: undefined,
    direction: "", status: "available", statusLabel: "Đang mở bán",
    legal: "", handover: "", desc: "",
    saleUsername: "",
    highlights: [], images: [], thumbsFloor: [],
    policies: [], docs: [], progress: [],
  };
}

function renderPropertyDetailPage(el) {
  const list = S.data.properties || (S.data.properties = []);
  const isNew = propDetailIdx < 0;
  const p = isNew ? propBlank() : (list[propDetailIdx] || propBlank());
  const sales = S.data.sales || [];

  const pkItems = (S.data.menu && S.data.menu.phanKhu) || [];
  const pkOpts = '<option value="">— Chọn phân khu —</option>' +
    pkItems.map(it => `<option value="${esc(it.id)}" ${it.id===p.phanKhu?'selected':''}>${esc(it.label)}</option>`).join('');
  const typeOpts = PROP_TYPES.map(t => `<option value="${t.id}" ${t.id===p.type?'selected':''}>${t.label}</option>`).join('');
  const statusOpts = PROP_STATUS.map(s => `<option value="${s.id}" ${s.id===p.status?'selected':''}>${s.label}</option>`).join('');
  const saleOpts = '<option value="">— Chưa gán nhân viên —</option>' +
    sales.map(s => `<option value="${esc(s.username)}" ${s.username===p.saleUsername?'selected':''}>${esc(s.name)} (${esc(s.username)})</option>`).join('');

  el.innerHTML = pageHeader(["Dashboard", "Bất Động Sản"], isNew ? "Thêm sản phẩm" : (p.name || "Chi tiết sản phẩm"),
    `<button class="btn btn-secondary btn-sm" onclick="go('properties')">${ico('x',12)} Quay lại</button>
     <button class="btn btn-primary btn-sm" onclick="propSaveDetail()">${ico('save',12)} Lưu sản phẩm</button>`)
  + `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:flex-start">

    <!-- ── Thông tin cơ bản ── -->
    <div class="card">
      <div class="card-header"><span class="card-title">${ico('home',16)} Thông tin cơ bản</span></div>
      <div class="card-body">
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1"><label class="form-label">Mã căn *</label>
            <input class="form-control" id="pd-code" value="${esc(p.code||'')}" placeholder="VM-SH-06.03"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Tên sản phẩm *</label>
            <input class="form-control" id="pd-name" value="${esc(p.name||'')}"></div>
        </div>
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1"><label class="form-label">Phân khu</label>
            <select class="form-control" id="pd-pk">${pkOpts}</select></div>
          <div class="form-group" style="flex:1"><label class="form-label">Loại hình</label>
            <select class="form-control" id="pd-type">${typeOpts}</select></div>
        </div>
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1"><label class="form-label">Diện tích (m²)</label>
            <input class="form-control" type="number" id="pd-area" value="${p.area||0}"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Phòng ngủ</label>
            <input class="form-control" type="number" id="pd-bed" value="${p.bedrooms||0}"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Phòng tắm</label>
            <input class="form-control" type="number" id="pd-bath" value="${p.bathrooms||0}"></div>
        </div>
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1"><label class="form-label">Tầng</label>
            <input class="form-control" type="number" id="pd-floor" value="${p.floor!=null?p.floor:''}" placeholder="—"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Số lượng còn</label>
            <input class="form-control" type="number" id="pd-avail" value="${p.available!=null?p.available:''}" placeholder="—"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Số lượng tổng</label>
            <input class="form-control" type="number" id="pd-total" value="${p.total!=null?p.total:''}" placeholder="—"></div>
        </div>
        <div class="form-group"><label class="form-label">Hướng</label>
          <input class="form-control" id="pd-dir" value="${esc(p.direction||'')}"></div>
        <div class="form-group"><label class="form-label">Mô tả</label>
          <textarea class="form-control" id="pd-desc" rows="3">${esc(p.desc||'')}</textarea></div>
      </div>
    </div>

    <!-- ── Giá & pháp lý ── -->
    <div class="card">
      <div class="card-header"><span class="card-title">${ico('leads',16)} Giá & pháp lý</span></div>
      <div class="card-body">
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1"><label class="form-label">Giá (số, vd 5400000000)</label>
            <input class="form-control" id="pd-price" value="${esc(p.price||'')}"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Giá/m²</label>
            <input class="form-control" id="pd-ppm" value="${esc(p.pricePerM2||'')}"></div>
        </div>
        <div class="form-group"><label class="form-label">Trạng thái</label>
          <select class="form-control" id="pd-status">${statusOpts}</select></div>
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1"><label class="form-label">Pháp lý</label>
            <input class="form-control" id="pd-legal" value="${esc(p.legal||'')}"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Dự kiến bàn giao</label>
            <input class="form-control" id="pd-handover" value="${esc(p.handover||'')}"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Nhân viên Sales phụ trách</label>
          <select class="form-control" id="pd-sale">${saleOpts}</select>
          <div class="form-hint">Hotline / Zalo / email tư vấn lấy từ thông tin nhân viên này.</div>
        </div>
        <div id="pd-sale-info">${propSaleInfoHTML(p.saleUsername)}</div>
      </div>
    </div>

    <!-- ── Hình ảnh ── -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('image',16)} Hình ảnh sản phẩm</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('pd-img-file').click()">${ico('upload',12)} Tải lên</button>
          <button class="btn btn-secondary btn-sm" onclick="propAddMedia('images')">${ico('globe',12)} Dán link</button>
          <input type="file" id="pd-img-file" accept="image/*" multiple style="display:none" onchange="propUploadMedia(this,'images')">
        </div>
      </div>
      <div class="card-body"><div id="pd-images-grid">${propMediaGridHTML(p.images, 'images')}</div></div>
    </div>

    <!-- ── Ảnh mặt bằng ── -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('hardhat',16)} Ảnh mặt bằng</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('pd-floor-file').click()">${ico('upload',12)} Tải lên</button>
          <button class="btn btn-secondary btn-sm" onclick="propAddMedia('thumbsFloor')">${ico('globe',12)} Dán link</button>
          <input type="file" id="pd-floor-file" accept="image/*" multiple style="display:none" onchange="propUploadMedia(this,'thumbsFloor')">
        </div>
      </div>
      <div class="card-body"><div id="pd-thumbsFloor-grid">${propMediaGridHTML(p.thumbsFloor, 'thumbsFloor')}</div></div>
    </div>

    <!-- ── Điểm nổi bật ── -->
    <div class="card">
      <div class="card-header"><span class="card-title">${ico('check',16)} Điểm nổi bật</span></div>
      <div class="card-body">
        <div class="form-hint" style="margin-bottom:6px">Mỗi dòng một ý.</div>
        <textarea class="form-control" id="pd-highlights" rows="5" placeholder="View trực diện vịnh biển&#10;Bàn giao nội thất cơ bản">${esc((p.highlights||[]).join('\n'))}</textarea>
      </div>
    </div>

    <!-- ── Chính sách ── -->
    <div class="card">
      <div class="card-header"><span class="card-title">${ico('book',16)} Chính sách bán hàng</span></div>
      <div class="card-body">
        <div class="form-hint" style="margin-bottom:6px">Mỗi dòng một chính sách.</div>
        <textarea class="form-control" id="pd-policies" rows="5" placeholder="Chiết khấu 8% thanh toán sớm&#10;Hỗ trợ lãi suất 0% trong 18 tháng">${esc((p.policies||[]).join('\n'))}</textarea>
      </div>
    </div>

    <!-- ── Tài liệu ── -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('book',16)} Tài liệu</span>
        <button class="btn btn-secondary btn-sm" onclick="propAddDoc()">${ico('plus',12)} Thêm tài liệu</button>
      </div>
      <div class="card-body"><div id="pd-docs-list">${propDocsHTML(p.docs)}</div></div>
    </div>

    <!-- ── Tiến độ ── -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('calendar',16)} Tiến độ</span>
        <button class="btn btn-secondary btn-sm" onclick="propAddProgress()">${ico('plus',12)} Thêm mốc</button>
      </div>
      <div class="card-body"><div id="pd-progress-list">${propProgressHTML(p.progress)}</div></div>
    </div>

  </div>
  <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
    <button class="btn btn-secondary" onclick="go('properties')">Huỷ</button>
    <button class="btn btn-primary" onclick="propSaveDetail()">${ico('save')} Lưu sản phẩm</button>
  </div>`;

  // Bind: đổi sale → cập nhật thông tin sale
  const saleSel = document.getElementById('pd-sale');
  if (saleSel) saleSel.addEventListener('change', () => {
    document.getElementById('pd-sale-info').innerHTML = propSaleInfoHTML(saleSel.value);
  });
}

/* Hiển thị thông tin sale đầy đủ */
function propSaleInfoHTML(username) {
  const sale = (S.data.sales || []).find(s => s.username === username);
  if (!sale) return '';
  return `
    <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--surface2);margin-top:4px">
      <div style="font-weight:700;font-size:13px;color:var(--text)">${esc(sale.name||'')}</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">${esc(sale.title||'')}</div>
      <div style="display:grid;gap:4px;font-size:12px">
        ${sale.phone ? `<div>${ico('leads',12)} Hotline: <b>${esc(sale.phone)}</b></div>` : ''}
        ${sale.zalo ? `<div>${ico('globe',12)} Zalo: <b>${esc(sale.zalo)}</b></div>` : ''}
        ${sale.email ? `<div>${ico('book',12)} Email: <b>${esc(sale.email)}</b></div>` : ''}
        ${sale.facebook ? `<div>${ico('globe',12)} Facebook: <b>${esc(sale.facebook)}</b></div>` : ''}
      </div>
    </div>`;
}

/* ── Media grid (ảnh / mặt bằng) ── */
function propMediaGridHTML(arr, field) {
  arr = arr || [];
  if (!arr.length) {
    return `<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px">Chưa có ảnh.</div>`;
  }
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px">
    ${arr.map((src, i) => `
      <div style="position:relative;border:1px solid var(--border);border-radius:8px;overflow:hidden;aspect-ratio:4/3;background:#0b1220">
        <img src="${esc(propImg(src))}" style="width:100%;height:100%;object-fit:cover" alt="" onerror="this.style.opacity=.2">
        <button class="act-btn danger" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.6)"
                onclick="propRemoveMedia('${field}',${i})">${ico('trash',12)}</button>
      </div>`).join('')}
  </div>`;
}
/* Lấy bản nháp sản phẩm đang chỉnh (từ form) — chỉ dùng cho thao tác media động */
function propCurrent() {
  const list = S.data.properties || [];
  if (propDetailIdx >= 0 && list[propDetailIdx]) return list[propDetailIdx];
  // sản phẩm mới: dùng object tạm gắn vào window
  if (!window.__propDraft) window.__propDraft = propBlank();
  return window.__propDraft;
}
function propRefreshMedia(field) {
  const host = document.getElementById('pd-' + field + '-grid');
  if (host) host.innerHTML = propMediaGridHTML(propCurrent()[field], field);
}
function propUploadMedia(input, field) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  const p = propCurrent();
  p[field] = p[field] || [];
  let pending = files.length;
  files.forEach(f => {
    const r = new FileReader();
    r.onload = () => {
      p[field].push(r.result);
      if (--pending === 0) propRefreshMedia(field);
    };
    r.readAsDataURL(f);
  });
}
function propAddMedia(field) {
  showPanel("Dán link ảnh", `
    <div class="form-group">
      <label class="form-label">URL ảnh *</label>
      <input class="form-control" id="pm-url" placeholder="https://... hoặc img/...">
    </div>`, () => {
    const url = document.getElementById('pm-url').value.trim();
    if (!url) { toast('Nhập URL', 'warn'); return false; }
    const p = propCurrent();
    p[field] = p[field] || [];
    p[field].push(url);
    propRefreshMedia(field);
    closePanel();
  });
}
function propRemoveMedia(field, i) {
  const p = propCurrent();
  if (p[field]) { p[field].splice(i, 1); propRefreshMedia(field); }
}

/* ── Tài liệu (form) ── */
function propDocsHTML(docs) {
  docs = docs || [];
  if (!docs.length) {
    return `<div style="padding:16px;text-align:center;color:var(--muted);font-size:13px">Chưa có tài liệu.</div>`;
  }
  return docs.map((d, i) => `
    <div style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px">
      <div class="form-group" style="flex:2;margin:0">
        <label class="form-label">Tên tài liệu</label>
        <input class="form-control" data-doc-name="${i}" value="${esc(d.name||'')}">
      </div>
      <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">Loại</label>
        <input class="form-control" data-doc-type="${i}" value="${esc(d.type||'PDF')}">
      </div>
      <div class="form-group" style="flex:2;margin:0">
        <label class="form-label">Link (tuỳ chọn)</label>
        <input class="form-control" data-doc-url="${i}" value="${esc(d.url||'')}">
      </div>
      <button class="act-btn danger" onclick="propRemoveDoc(${i})">${ico('trash')}</button>
    </div>`).join('');
}
function propAddDoc() {
  propSyncDocsFromDom();
  const p = propCurrent();
  p.docs = p.docs || [];
  p.docs.push({ name: '', type: 'PDF', url: '' });
  document.getElementById('pd-docs-list').innerHTML = propDocsHTML(p.docs);
}
function propRemoveDoc(i) {
  propSyncDocsFromDom();
  const p = propCurrent();
  if (p.docs) { p.docs.splice(i, 1); document.getElementById('pd-docs-list').innerHTML = propDocsHTML(p.docs); }
}
function propSyncDocsFromDom() {
  const p = propCurrent();
  const host = document.getElementById('pd-docs-list');
  if (!host) return;
  const docs = [];
  host.querySelectorAll('[data-doc-name]').forEach(inp => {
    const i = inp.dataset.docName;
    docs.push({
      name: inp.value.trim(),
      type: (host.querySelector(`[data-doc-type="${i}"]`)?.value || 'PDF').trim(),
      url: (host.querySelector(`[data-doc-url="${i}"]`)?.value || '').trim(),
    });
  });
  p.docs = docs;
}

/* ── Tiến độ (form) ── */
function propProgressHTML(prog) {
  prog = prog || [];
  if (!prog.length) {
    return `<div style="padding:16px;text-align:center;color:var(--muted);font-size:13px">Chưa có mốc tiến độ.</div>`;
  }
  return prog.map((t, i) => `
    <div style="display:flex;gap:8px;align-items:flex-end;margin-bottom:8px">
      <div class="form-group" style="flex:2;margin:0">
        <label class="form-label">Giai đoạn</label>
        <input class="form-control" data-prog-phase="${i}" value="${esc(t.phase||'')}">
      </div>
      <div class="form-group" style="flex:1;margin:0">
        <label class="form-label">Thời gian</label>
        <input class="form-control" data-prog-date="${i}" value="${esc(t.date||'')}">
      </div>
      <label class="form-group" style="flex:0 0 auto;margin:0;display:flex;align-items:center;gap:6px;padding-bottom:8px">
        <input type="checkbox" data-prog-done="${i}" ${t.done?'checked':''}> Hoàn thành
      </label>
      <button class="act-btn danger" onclick="propRemoveProgress(${i})">${ico('trash')}</button>
    </div>`).join('');
}
function propAddProgress() {
  propSyncProgressFromDom();
  const p = propCurrent();
  p.progress = p.progress || [];
  p.progress.push({ phase: '', date: '', done: false });
  document.getElementById('pd-progress-list').innerHTML = propProgressHTML(p.progress);
}
function propRemoveProgress(i) {
  propSyncProgressFromDom();
  const p = propCurrent();
  if (p.progress) { p.progress.splice(i, 1); document.getElementById('pd-progress-list').innerHTML = propProgressHTML(p.progress); }
}
function propSyncProgressFromDom() {
  const p = propCurrent();
  const host = document.getElementById('pd-progress-list');
  if (!host) return;
  const prog = [];
  host.querySelectorAll('[data-prog-phase]').forEach(inp => {
    const i = inp.dataset.progPhase;
    prog.push({
      phase: inp.value.trim(),
      date: (host.querySelector(`[data-prog-date="${i}"]`)?.value || '').trim(),
      done: !!host.querySelector(`[data-prog-done="${i}"]`)?.checked,
    });
  });
  p.progress = prog;
}

/* ── Lưu sản phẩm ── */
function propSaveDetail() {
  const list = S.data.properties || (S.data.properties = []);
  const isNew = propDetailIdx < 0;
  const cur = isNew ? (window.__propDraft || propBlank()) : list[propDetailIdx];

  const gv = (id) => (document.getElementById(id)?.value || '').trim();
  const gn = (id) => { const v = gv(id); return v === '' ? undefined : (parseFloat(v) || 0); };
  const code = gv('pd-code'), name = gv('pd-name');
  if (!code || !name) { toast('Nhập mã căn và tên sản phẩm', 'warn'); return; }

  propSyncDocsFromDom();
  propSyncProgressFromDom();

  const pkSel = document.getElementById('pd-pk');
  const typeSel = document.getElementById('pd-type');
  const statusSel = document.getElementById('pd-status');
  const priceStr = gv('pd-price');
  const priceNum = parseInt(priceStr.replace(/\D/g, ''), 10) || 0;
  const lines = (id) => gv(id).split('\n').map(s => s.trim()).filter(Boolean);

  const data = {
    id: cur.id || code.replace(/[^\w]/g, '-'),
    code, name,
    phanKhu: pkSel.value,
    phanKhuLabel: pkSel.value ? pkSel.options[pkSel.selectedIndex].text : '',
    type: typeSel.value,
    typeLabel: typeSel.options[typeSel.selectedIndex].text,
    price: priceStr,
    priceVal: priceNum ? +(priceNum / 1e9).toFixed(2) : (cur.priceVal || 0),
    pricePerM2: gv('pd-ppm'),
    area: gn('pd-area') || 0,
    bedrooms: gn('pd-bed') || 0,
    bathrooms: gn('pd-bath') || 0,
    floor: gn('pd-floor'),
    available: gn('pd-avail'),
    total: gn('pd-total'),
    direction: gv('pd-dir'),
    status: statusSel.value,
    statusLabel: statusSel.options[statusSel.selectedIndex].text,
    legal: gv('pd-legal'),
    handover: gv('pd-handover'),
    desc: gv('pd-desc'),
    saleUsername: document.getElementById('pd-sale').value || '',
    images: (cur.images || []).slice(),
    thumbsFloor: (cur.thumbsFloor || []).slice(),
    highlights: lines('pd-highlights'),
    policies: lines('pd-policies'),
    docs: (cur.docs || []).filter(d => d.name),
    progress: (cur.progress || []).filter(t => t.phase),
  };

  if (isNew) { list.push(data); propDetailIdx = list.length - 1; }
  else { list[propDetailIdx] = data; }
  window.__propDraft = null;
  saveData(isNew ? 'Đã thêm sản phẩm' : 'Đã cập nhật sản phẩm');
  go('properties');
}

/* Alias tương thích: propEdit cũ → mở trang chi tiết */
function propEdit(idx){ propOpenDetail(idx); }
