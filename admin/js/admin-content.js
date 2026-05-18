/* ============================================
   AURORA HEIGHTS — Admin Content Modules
   6 module CRUD: Gallery / SiteMap / Amenities / Timeline / Legal / Location
   Phụ thuộc admin.js: S, ico(), toast(), saveData(), exportJSON(),
                       confirmDel(), showPanel(), closePanel(), go()
   ============================================ */

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
}
function imgFieldClear(id) {
  document.getElementById(id+'-val').value = '';
  const u = document.getElementById(id+'-url');  if (u) u.value = '';
  const f = document.getElementById(id+'-file'); if (f) f.value = '';
  const info = document.getElementById(id+'-info'); if (info) info.style.display = 'none';
  document.getElementById(id+'-prev').style.display = 'none';
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

function galleryListAll() {
  // Normalize legacy items (no `type`) to image.
  return (S.data.gallery || []).map(g => ({ type: 'image', ...g }));
}
function galleryFolders() {
  const set = new Set();
  galleryListAll().forEach(g => { if (g.folder) set.add(g.folder); });
  return [...set].sort((a,b) => a.localeCompare(b, 'vi'));
}
function galleryFilteredIndexes() {
  const f = S.galleryFolder;
  return galleryListAll()
    .map((g,i) => ({ g, i }))
    .filter(({g}) => f === '__all' ? true : f === '__none' ? !g.folder : g.folder === f);
}
function galleryFolderCount(name) {
  const all = galleryListAll();
  if (name === '__all')  return all.length;
  if (name === '__none') return all.filter(g => !g.folder).length;
  return all.filter(g => g.folder === name).length;
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
  return null;
}
function detectVideoSource(url) {
  if (!url) return '';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url))             return 'vimeo';
  if (url.startsWith('blob:'))            return 'upload';
  return 'mp4';
}

/* ---------- Render ---------- */
function renderGalleryPage(el) {
  const all = galleryListAll();
  const folders = galleryFolders();
  const filtered = galleryFilteredIndexes();
  const cur = S.galleryFolder;
  const curLabel = cur === '__all' ? 'Tất cả' : cur === '__none' ? 'Chưa phân loại' : cur;

  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Thư Viện',
    `<button class="btn btn-secondary btn-sm" onclick="galleryNewFolder()">${ico('plus')} Thư mục mới</button>
     <button class="btn btn-secondary btn-sm" onclick="galleryAddVideo()">${ico('video')} Thêm video</button>
     <button class="btn btn-primary btn-sm" onclick="galleryAddImage()">${ico('image')} Thêm ảnh</button>`)
  + `
    <div style="display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:flex-start">

      <!-- Folder sidebar -->
      <div class="card" style="position:sticky;top:16px">
        <div class="card-header"><span class="card-title">${ico('folder',14)} Thư mục</span></div>
        <div style="padding:8px">
          ${folderRow('__all', 'Tất cả', 'navpanel', cur)}
          ${folderRow('__none', 'Chưa phân loại', 'image', cur)}
          ${folders.length ? `<div style="height:1px;background:var(--border);margin:6px 4px"></div>` : ''}
          ${folders.map(f => folderRow(f, f, 'folder', cur, true)).join('')}
        </div>
      </div>

      <!-- Media grid -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">${esc(curLabel)} · ${filtered.length} mục</span>
          <span class="card-subtitle">${all.length} tổng · ${all.filter(g=>g.type==='video').length} video · ${all.filter(g=>g.type!=='video').length} ảnh</span>
        </div>
        <div class="card-body">
          ${filtered.length === 0 ? `
            <div style="text-align:center;padding:40px;color:var(--muted)">
              ${cur === '__all'
                ? `Chưa có mục nào. Bấm <b>Thêm ảnh</b> hoặc <b>Thêm video</b> để bắt đầu.`
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
  const thumb = g.poster || g.src || '';
  return `
    <div class="gal-card" draggable="true" data-i="${i}"
         ondragstart="galleryDragStart(${i})" ondragover="event.preventDefault()"
         ondrop="galleryDrop(${i})">
      <div class="gal-thumb" onclick="galleryOpenPreview(${i})" style="cursor:pointer;position:relative">
        ${thumb
          ? `<img src="${esc(thumb)}" alt="${esc(g.title||'')}" onerror="this.style.opacity=.2">`
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
function galleryAddImage() { galleryForm({ type:'image', src:'', title:'', folder: defaultFolderForNew() }, -1); }
function galleryAddVideo() { galleryForm({ type:'video', src:'', title:'', folder: defaultFolderForNew(), videoSource:'youtube', poster:'' }, -1); }
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
    playerHTML = `<img src="${esc(g.src)}" alt="${esc(g.title||'')}" style="width:100%;max-height:78vh;object-fit:contain;background:#0f172a;border-radius:8px">`;
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
// 2) SITE MAP 2D ─ ảnh nền + các điểm tương tác
// ========================================================================
function renderSiteMapPage(el) {
  const sm = S.data.siteMap;
  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Bản Đồ 2D — Mặt Bằng',
    `<button class="btn btn-primary btn-sm" onclick="siteMapAddManual()">${ico('plus')} Thêm điểm</button>`)
  + `
    <div class="g21">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Preview & thả điểm</span>
          <span class="card-subtitle">Click trên ảnh để thêm điểm · Kéo điểm để di chuyển</span>
        </div>
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px">
            <div style="font-size:12px;color:var(--muted);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              <b>Ảnh nền:</b> ${esc(sm.image ? (sm.image.startsWith('data:')?'(đã tải lên)':sm.image) : 'chưa đặt')}
            </div>
            <button class="btn btn-secondary btn-sm" onclick="siteMapChangeBg()">${ico('upload')} Đổi ảnh nền</button>
          </div>
          <div class="sm-canvas" id="sm-canvas" onclick="siteMapCanvasClick(event)">
            <img id="sm-bg" src="${esc(sm.image||'')}" onerror="this.style.opacity=.1">
            ${(sm.points||[]).map((p,i)=>`
              <div class="sm-pt" style="left:${p.x}%;top:${p.y}%" data-i="${i}"
                   onmousedown="siteMapDragBegin(event,${i})"
                   title="${esc(p.label||'')}">
                <span class="sm-pt-dot"></span>
                <span class="sm-pt-label">${esc(p.label||'')}</span>
              </div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:8px">
            <button class="btn btn-secondary btn-sm" onclick="saveData('Đã lưu')">${ico('save')} Lưu thay đổi</button>
            <span class="c-muted" style="font-size:11px">Toạ độ tính theo % chiều rộng/cao ảnh</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Danh sách điểm (${(sm.points||[]).length})</span></div>
        <div class="card-body p0">
          ${(sm.points||[]).length===0 ? `<div style="text-align:center;padding:32px;color:var(--muted)">Chưa có điểm nào. Click trên ảnh để thêm.</div>` :
            `<div class="sm-list">${(sm.points||[]).map((p,i)=>`
              <div class="sm-item">
                <div class="sm-item-info">
                  <div class="sm-item-title">${esc(p.label||'(chưa đặt tên)')}</div>
                  <div class="sm-item-meta mono">id:${esc(p.id||'—')} · X:${p.x}% Y:${p.y}% · scene:${esc(p.sceneId||'—')}</div>
                </div>
                <button class="act-btn" onclick="siteMapEdit(${i})">${ico('edit')}</button>
                <button class="act-btn danger" onclick="siteMapDel(${i})">${ico('trash')}</button>
              </div>`).join('')}</div>`}
        </div>
      </div>
    </div>`;
}

function siteMapChangeBg() {
  showPanel('Ảnh nền bản đồ 2D',
    imageField('sm-img', 'Ảnh nền', S.data.siteMap.image, { placeholder:'img/thietke-matbangduan.jpg' }),
    () => {
      S.data.siteMap.image = imgFieldValue('sm-img');
      saveData('Đã đổi ảnh nền'); closePanel(); go('sitemap');
    });
}

function siteMapCanvasClick(e) {
  if (S.smDragging) { S.smDragging = false; return; }
  if (e.target.closest('.sm-pt')) return; // click vào điểm có sẵn
  const canvas = document.getElementById('sm-canvas');
  const r = canvas.getBoundingClientRect();
  const x = +(((e.clientX - r.left) / r.width) * 100).toFixed(1);
  const y = +(((e.clientY - r.top) / r.height) * 100).toFixed(1);
  siteMapOpenForm({ x, y, id: 'p' + Date.now().toString(36), label: '', sceneId: '' }, -1);
}

function siteMapAddManual() {
  siteMapOpenForm({ x: 50, y: 50, id: 'p' + Date.now().toString(36), label: '', sceneId: '' }, -1);
}

function siteMapEdit(i) { siteMapOpenForm({ ...S.data.siteMap.points[i] }, i); }
function siteMapDel(i) {
  confirmDel('Xoá điểm này?', S.data.siteMap.points[i].label||'', () => {
    S.data.siteMap.points.splice(i,1); saveData('Đã xoá điểm'); go('sitemap');
  });
}

function siteMapOpenForm(pt, idx) {
  const scenes = (S.data.scenes||[]).map(s => s.id);
  showPanel(idx>=0 ? 'Sửa điểm' : 'Thêm điểm', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">ID</label>
        <input class="form-control" id="pt-id" value="${esc(pt.id||'')}"></div>
      <div class="form-group"><label class="form-label">Scene đích</label>
        <div style="display:flex;gap:6px">
          <select class="form-control" id="pt-scene" style="flex:1">
            <option value="">— Không liên kết —</option>
            ${scenes.map(s=>`<option value="${s}" ${s===pt.sceneId?'selected':''}>${s}</option>`).join('')}
          </select>
          <button type="button" class="btn btn-secondary btn-sm" onclick="previewVR('../index.html?scene='+document.getElementById('pt-scene').value,'Preview Scene')">${ico('eye')}</button>
        </div></div>
    </div>
    <div class="form-group"><label class="form-label">Nhãn hiển thị *</label>
      <input class="form-control" id="pt-label" value="${esc(pt.label||'')}" placeholder="VD: Tòa The Park (I2)"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">X (%)</label>
        <input class="form-control" type="number" step="0.1" id="pt-x" value="${pt.x}"></div>
      <div class="form-group"><label class="form-label">Y (%)</label>
        <input class="form-control" type="number" step="0.1" id="pt-y" value="${pt.y}"></div>
    </div>
  `, () => {
    const o = {
      id: document.getElementById('pt-id').value.trim() || 'p'+Date.now().toString(36),
      label: document.getElementById('pt-label').value.trim(),
      sceneId: document.getElementById('pt-scene').value || undefined,
      x: +parseFloat(document.getElementById('pt-x').value).toFixed(1),
      y: +parseFloat(document.getElementById('pt-y').value).toFixed(1),
    };
    if (!o.label) { toast('Cần nhập nhãn', 'warn'); return; }
    if (idx>=0) S.data.siteMap.points[idx] = o;
    else        S.data.siteMap.points.push(o);
    saveData(idx>=0?'Đã cập nhật điểm':'Đã thêm điểm');
    closePanel(); go('sitemap');
  });
}

function siteMapDragBegin(ev, i) {
  ev.stopPropagation();
  const canvas = document.getElementById('sm-canvas');
  const r = canvas.getBoundingClientRect();
  const move = me => {
    S.smDragging = true;
    const x = Math.max(0, Math.min(100, ((me.clientX - r.left)/r.width)*100));
    const y = Math.max(0, Math.min(100, ((me.clientY - r.top)/r.height)*100));
    S.data.siteMap.points[i].x = +x.toFixed(1);
    S.data.siteMap.points[i].y = +y.toFixed(1);
    const dot = canvas.querySelector(`.sm-pt[data-i="${i}"]`);
    if (dot) { dot.style.left = x+'%'; dot.style.top = y+'%'; }
  };
  const up = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    if (S.smDragging) { saveData('Đã di chuyển điểm'); go('sitemap'); }
  };
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
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
