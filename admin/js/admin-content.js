/* ============================================
   AURORA HEIGHTS — Admin Content Modules
   Module CRUD: Gallery / SiteMap / Timeline / Legal / Location / Resources
   Phụ thuộc admin.js: S, ico(), toast(), saveData(), exportJSON(),
                       confirmDel(), showPanel(), closePanel(), go()
   ============================================ */

/* ============================================================
   PHÂN KHU — bộ chọn phân khu dùng chung cho Timeline / Legal /
   Location / Resources / Gallery. Mỗi trang lưu phân khu đang xem
   trong S.subKey[<page>]; '__all' = cấp dự án.
   S.dirtySub[<page>] = true khi có sửa chưa lưu (chặn đổi phân khu).
   ============================================================ */
S.subKey   ??= {};   // { timeline:'__all', legal:'pk-...', ... }
S.dirtySub ??= {};   // { timeline:true, ... }

/* Danh sách phân khu thực tế từ S.data.menu.phanKhu */
function adminSubList() {
  return ((S.data && S.data.menu && S.data.menu.phanKhu) || [])
    .map(p => ({ id: p.id, label: p.label }));
}

/* Khoá phân khu đang chọn của 1 trang (mặc định __all) */
function curSubKey(page) {
  return S.subKey[page] || '__all';
}

/* Đảm bảo S.data[section] có dạng {__all, <pk>}; tự nâng cấp dạng cũ.
   emptyVal: giá trị rỗng cho 1 slice (vd [] hoặc {}). */
function ensureSubShape(section, emptyVal) {
  let d = S.data[section];
  const subs = adminSubList();
  // dạng cũ: mảng, hoặc object không có __all
  const isNew = d && typeof d === 'object' && !Array.isArray(d) && ('__all' in d);
  if (!isNew) {
    // Nếu giá trị cũ không cùng "hình dạng" với emptyVal (vd emptyVal là [] nhưng d là object),
    // thì coi như chưa có dữ liệu — tránh để __all bị kẹt dạng sai làm vỡ .map.
    const sameShape = Array.isArray(emptyVal) ? Array.isArray(d) : (d && typeof d === 'object' && !Array.isArray(d));
    d = { __all: (d != null && sameShape) ? d : clone(emptyVal) };
  }
  // Nếu __all bị sai hình dạng từ trước, cũng chuẩn hoá lại.
  if (Array.isArray(emptyVal) ? !Array.isArray(d.__all) : (typeof d.__all !== 'object' || Array.isArray(d.__all))) {
    d.__all = clone(emptyVal);
  }
  for (const s of subs) {
    if (d[s.id] == null) d[s.id] = clone(emptyVal);
    else if (Array.isArray(emptyVal) ? !Array.isArray(d[s.id]) : (typeof d[s.id] !== 'object' || Array.isArray(d[s.id]))) {
      d[s.id] = clone(emptyVal);
    }
  }
  S.data[section] = d;
  return d;
}
function clone(v) { return JSON.parse(JSON.stringify(v)); }

/* Slice của trang hiện hành — đọc/ghi trực tiếp vào object này */
function subSlice(section, page, emptyVal) {
  const d = ensureSubShape(section, emptyVal);
  const k = curSubKey(page);
  if (d[k] == null) d[k] = clone(emptyVal);
  return d[k];
}

/* HTML thanh chọn phân khu + nút Lưu cho 1 trang.
   page: tên trang ('timeline'|'legal'|'location'|'resources'|'gallery') */
function subSelectorBar(page) {
  const subs = adminSubList();
  let cur = curSubKey(page);
  // Page 'timeline' chỉ quản lý theo phân khu — bỏ tab "Tất cả".
  const hideAll = page === 'timeline';
  if (hideAll && cur === '__all') {
    cur = subs[0]?.id || '';
    S.subKey[page] = cur;
  }
  const opts = hideAll ? subs : [{ id: '__all', label: 'Tất cả (cấp dự án)' }, ...subs];
  const dirty = !!S.dirtySub[page];
  return `
    <div class="card sub-bar" style="margin-bottom:12px">
      <div style="padding:10px 14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <span style="font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em">Phân khu</span>
        <select class="form-control" style="width:auto;min-width:220px" id="sub-select-${page}"
                onchange="onSubSelectChange('${page}', this.value)">
          ${opts.map(o=>`<option value="${o.id}" ${o.id===cur?'selected':''}>${esc(o.label)}</option>`).join('')}
        </select>
        ${dirty ? `<span class="badge badge-primary" style="font-size:11px">● Chưa lưu</span>` : ''}
        <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="saveSubdivision('${page}')">
          ${ico('save')||''} Lưu phân khu
        </button>
      </div>
    </div>`;
}

/* Đổi phân khu — nếu đang dirty thì hỏi xác nhận thoát */
function onSubSelectChange(page, value) {
  const apply = () => {
    S.subKey[page] = value;
    S.dirtySub[page] = false;
    go(page);
  };
  if (S.dirtySub[page]) {
    // trả select về giá trị cũ trước khi hỏi
    const sel = document.getElementById('sub-select-' + page);
    if (sel) sel.value = curSubKey(page);
    confirmExitDirty(() => apply());
  } else {
    apply();
  }
}

/* Modal cảnh báo: sửa chưa lưu, đổi phân khu sẽ mất thay đổi */
function confirmExitDirty(onConfirm) {
  if (typeof confirmDel === 'function') {
    confirmDel(
      'Thoát mà chưa lưu?',
      'Bạn đã chỉnh sửa nội dung phân khu này nhưng chưa bấm "Lưu phân khu". Đổi phân khu sẽ mất các thay đổi chưa lưu.',
      onConfirm
    );
  } else if (typeof uiConfirm === 'function') {
    uiConfirm('Thoát mà chưa lưu? Thay đổi sẽ bị mất.', onConfirm, { title:'Thoát mà chưa lưu', okText:'Thoát', okClass:'btn-danger' });
  } else {
    onConfirm();
  }
}

/* Đánh dấu trang dirty (gọi sau mỗi thao tác CRUD trên slice phân khu) */
function markSubDirty(page) { S.dirtySub[page] = true; }

/* Lưu nội dung 1 phân khu lên CSDL qua PUT /api/subdivision/:code */
async function saveSubdivision(page) {
  const code = curSubKey(page);
  // gom payload đủ 5 mục + children của phân khu đó
  const payload = buildSubdivisionPayload(code);
  try {
    const r = await fetch(API_BASE + '/api/subdivision/' + encodeURIComponent(code), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    S.dirtySub[page] = false;
    toast('Đã lưu phân khu "' + code + '"', 'ok');
    go(page);
  } catch (e) {
    // vẫn giữ ở localStorage, báo lưu tạm
    toast('Lưu tạm trên máy — chưa đồng bộ được (' + e.message + ')', 'warn');
  }
}

/* Gom dữ liệu của 1 phân khu thành payload cho endpoint */
function buildSubdivisionPayload(code) {
  const pick = (section, empty) => {
    const d = S.data[section];
    // Dạng phân tách theo phân khu: {__all:..., 'pk-xxx':...} → lấy slice tương ứng
    if (d && typeof d === 'object' && !Array.isArray(d)) {
      // ưu tiên key code/__all; nếu không có, trả empty thay vì cả object cha
      if (code in d) return d[code] != null ? d[code] : empty;
      if (Array.isArray(empty)) return empty;       // section vốn là mảng → tránh trả object
      if ('__all' in d || Object.keys(d).some(k => k.startsWith('pk-'))) return empty;
    }
    return code === '__all' ? (d != null ? d : empty) : empty;
  };
  const payload = {
    legal:     pick('legal', { documents: [], developerStats: [], testimonials: [] }),
    location:  pick('location', { lat: 0, lng: 0, mapSrc: '', nearby: [] }),
    timeline:  pick('timeline', []),
    resources: pick('resources', {}),
    gallery:   (S.data.gallery || []).filter(g =>
                 (g.subdivision || null) === (code === '__all' ? null : code)),
  };
  // children chỉ áp dụng cho phân khu thật
  if (code !== '__all') {
    const pk = ((S.data.menu && S.data.menu.phanKhu) || []).find(p => p.id === code);
    if (pk && pk.children) payload.children = pk.children;
  }
  return payload;
}

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
/* Trích ID YouTube từ nhiều dạng link: watch?v=, youtu.be/, shorts/, embed/ */
function youtubeId(url) {
  if (!url) return null;
  let m;
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/))) return m[1];
  return null;
}
/* Trích ID Vimeo (số) từ link vimeo.com/123456 hoặc player.vimeo.com/video/123456 */
function vimeoId(url) {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}
/* Thumbnail hiển thị được cho 1 asset (Drive / YouTube / Vimeo / URL thường) */
function thumbPath(p) {
  const did = adminDriveFileId(p);
  if (did) return 'https://drive.google.com/thumbnail?id=' + did + '&sz=w640';
  const yt = youtubeId(p);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  // Vimeo cần gọi oEmbed (async) — không xử lý ở thumbPath đồng bộ, để caller dùng resolveThumb()
  return assetPath(p);
}
/* Lấy thumbnail kèm async cho Vimeo (oEmbed). Trả Promise<string>. */
async function resolveThumb(p) {
  const vid = vimeoId(p);
  if (vid) {
    try {
      const r = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent('https://vimeo.com/' + vid)}`);
      const j = await r.json();
      if (j.thumbnail_url) return j.thumbnail_url.replace(/_\d+x\d+/, '_640');
    } catch {}
  }
  return thumbPath(p);
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
      </div>
    </div>`;
}

// Escape giá trị cho thuộc tính HTML
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
                       .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== IMAGE UPLOAD HELPERS =====
// 10MB / ảnh — giá trị mặc định; admin có thể đổi trong Cài Đặt → Tải lên.
let MAX_IMG_BYTES = 10 * 1024 * 1024;
// Cache giá trị MB đã fetch để form Cài Đặt render đồng bộ đúng số ngay,
// không phải chờ fetch async (tránh F5 nhảy về giá trị hardcode).
window.UPLOAD_IMAGE_MAXMB = 10;
window.UPLOAD_FILE_MAXMB  = 100;

// Promise đảm bảo limit đã được fetch trước khi check. Refresh được khi cần.
let _uploadLimitsPromise = null;
function refreshUploadLimits() {
  const base = (typeof API_BASE !== 'undefined' && API_BASE) ? API_BASE : '';
  _uploadLimitsPromise = fetch(base + '/api/settings/upload')
    .then(r => r.ok ? r.json() : null)
    .then(j => {
      if (j && j.imageMaxMb && Number(j.imageMaxMb) > 0) {
        MAX_IMG_BYTES = Number(j.imageMaxMb) * 1024 * 1024;
        window.UPLOAD_IMAGE_MAXMB = Number(j.imageMaxMb);
      }
      if (j && j.maxMb && Number(j.maxMb) > 0) {
        window.UPLOAD_FILE_MAXMB = Number(j.maxMb);
      }
      return MAX_IMG_BYTES;
    })
    .catch(() => MAX_IMG_BYTES);
  return _uploadLimitsPromise;
}
refreshUploadLimits(); // chạy 1 lần khi load

// Cho phép gọi từ saveUploadSettings để cập nhật ngay sau khi đổi
window.refreshUploadLimits = refreshUploadLimits;
const MAX_TOTAL_BYTES = 5  * 1024 * 1024;          // 5MB tổng localStorage

/* Resize ảnh client-side bằng Canvas trước khi upload — file gốc 50MB sau
   resize chỉ còn ~1MB. Bỏ qua: file không phải ảnh, SVG (vector), GIF
   (mất animation), hoặc file đã nhỏ (< MIN_RESIZE_BYTES).
   maxDim: cạnh dài nhất (px). quality: 0..1 cho JPEG/WebP. */
const RESIZE_MAX_DIM = 2000;
const RESIZE_QUALITY = 0.85;
const MIN_RESIZE_BYTES = 500 * 1024; // < 500KB thì không resize

async function resizeImageFile(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
  if (file.size < MIN_RESIZE_BYTES) return file;

  // Đọc kích thước trước để biết tỉ lệ thu nhỏ. Decode thẳng xuống kích thước
  // đích bằng resizeWidth/Height — ảnh siêu lớn (vượt giới hạn ~16384px/cạnh
  // của canvas) vẫn xử lý được vì trình duyệt không dựng bitmap full-res.
  const probe = await createImageBitmap(file).catch(() => null);
  let w, h;
  if (probe) {
    ({ width: w, height: h } = probe);
    probe.close && probe.close();
  } else {
    // Không probe được full-res (ảnh quá khổ) → đo qua <img> để lấy kích thước thật.
    const dim = await imageDimViaTag(file).catch(() => null);
    if (!dim) {
      // Trình duyệt không decode nổi kiểu ảnh này → đừng upload raw (sẽ không hiển thị).
      throw new Error('Không đọc được ảnh này. Có thể ảnh quá lớn hoặc định dạng không hỗ trợ — hãy giảm kích thước rồi thử lại.');
    }
    ({ w, h } = dim);
  }

  const scale = Math.min(1, RESIZE_MAX_DIM / Math.max(w, h));
  const newW = Math.max(1, Math.round(w * scale));
  const newH = Math.max(1, Math.round(h * scale));

  // Decode kèm thu nhỏ — tránh dựng bitmap full-res với ảnh siêu phân giải.
  const bitmap = await createImageBitmap(file, {
    resizeWidth: newW,
    resizeHeight: newH,
    resizeQuality: 'high',
  }).catch(() => null);
  if (!bitmap) {
    throw new Error('Ảnh quá lớn để xử lý trong trình duyệt — hãy giảm kích thước (khuyến nghị cạnh dài ≤ 8000px) rồi thử lại.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, newW, newH);
  bitmap.close && bitmap.close();

  // PNG có alpha → giữ PNG, không alpha → ép JPEG (nhẹ hơn rất nhiều)
  const outType = file.type === 'image/png' ? 'image/jpeg' : (file.type || 'image/jpeg');
  const blob = await new Promise(res => canvas.toBlob(res, outType, RESIZE_QUALITY));
  if (!blob) {
    throw new Error('Không nén được ảnh sau khi thu nhỏ — hãy thử lại với ảnh khác.');
  }
  if (blob.size >= file.size) return file; // resize không hiệu quả → giữ file gốc

  // Đổi extension nếu chuyển PNG → JPEG
  const newName = outType === 'image/jpeg' && /\.png$/i.test(file.name)
    ? file.name.replace(/\.png$/i, '.jpg')
    : file.name;
  return new File([blob], newName, { type: outType, lastModified: Date.now() });
}

/* Đo kích thước ảnh bằng thẻ <img> — fallback khi createImageBitmap full-res
   thất bại (ảnh vượt giới hạn bitmap). <img> chỉ cần metadata nên chịu được
   ảnh lớn hơn. Trả { w, h } hoặc ném lỗi nếu không load được. */
function imageDimViaTag(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      URL.revokeObjectURL(url);
      if (w && h) resolve({ w, h }); else reject(new Error('no dim'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load fail')); };
    img.src = url;
  });
}

/* Upload 1 file ảnh lên Cloudflare R2 qua presigned URL.
   onProgress(pct 0..100) tuỳ chọn. Trả về public URL.
   Tự động resize ảnh > 500KB xuống max 2000px trước khi upload.
   Fallback: nếu server chưa cấu hình R2 (503) -> ném lỗi để caller xử lý. */
async function uploadImageToR2(file, { folder = 'uploads', onProgress } = {}) {
  file = await resizeImageFile(file);
  const base = (typeof API_BASE !== 'undefined' && API_BASE) ? API_BASE : '';
  const presignRes = await fetch(base + '/api/upload/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || 'application/octet-stream',
      folder,
    }),
  });
  if (!presignRes.ok) {
    const msg = (await presignRes.json().catch(() => ({}))).error || presignRes.statusText;
    throw new Error('Không xin được presigned URL: ' + msg);
  }
  const { uploadUrl, publicUrl, headers } = await presignRes.json();

  // Dùng XHR để có progress (fetch không hỗ trợ upload progress)
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    Object.entries(headers || {}).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = ev => {
      if (ev.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round(ev.loaded / ev.total * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error('R2 trả ' + xhr.status));
    };
    xhr.onerror = () => reject(new Error('Lỗi mạng khi upload lên R2'));
    xhr.send(file);
  });

  return publicUrl;
}

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
        <img src="${esc(thumbPath(currentValue)||'')}" onerror="this.style.opacity=.15"
             referrerpolicy="no-referrer">
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
  if (val) {
    prev.style.display = '';
    img.src = thumbPath(val);
    img.style.opacity = 1;
    // Vimeo cần oEmbed async — cập nhật khi có
    if (vimeoId(val)) {
      resolveThumb(val).then(t => { if (img && t) img.src = t; });
    }
  } else {
    prev.style.display = 'none';
  }
  /* sync logo-slot preview if present */
  const si = document.getElementById(id+'-slot-img');
  if (si) { si.src = val ? thumbPath(val) : ''; si.style.opacity = val ? 1 : .2; }
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
async function imgFieldReadFile(id, file) {
  if (!file.type.startsWith('image/')) {
    toast('File không phải ảnh', 'err'); return;
  }
  // Đảm bảo đã đọc cấu hình limit từ server (tránh race khi mới load trang)
  if (_uploadLimitsPromise) { try { await _uploadLimitsPromise; } catch {} }
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

  // Preview ngay bằng object URL trong khi đang upload lên R2.
  const localPreview = URL.createObjectURL(file);
  const prev = document.getElementById(id+'-prev');
  prev.style.display = '';
  prev.querySelector('img').src = localPreview;
  prev.querySelector('img').style.opacity = .55;

  try {
    const publicUrl = await uploadImageToR2(file, {
      folder: 'gallery',
      onProgress: pct => {
        const bar = document.getElementById(id+'-bar');
        if (bar) bar.style.width = pct + '%';
      },
    });
    URL.revokeObjectURL(localPreview);
    document.getElementById(id+'-val').value = publicUrl;
    prev.querySelector('img').src = publicUrl;
    prev.querySelector('img').style.opacity = 1;
    const bar = document.getElementById(id+'-bar'); if (bar) bar.style.width = '100%';
    info.querySelector('.dz-info-thumb').innerHTML = `<img src="${publicUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:4px">`;
    const si = document.getElementById(id+'-slot-img');
    if (si) { si.src = publicUrl; si.style.opacity = 1; }
    toast(`Đã tải ${fmtSize(file.size)}`, 'ok');
  } catch (err) {
    URL.revokeObjectURL(localPreview);
    console.error(err);
    toast('Upload thất bại: ' + err.message, 'err');
    imgFieldClear(id);
  }
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
  const subKey = curSubKey('gallery'); // '__all' | '<pkId>'
  return galleryListAll()
    .map((g,i) => ({ g, i }))
    .filter(({g}) => S.galleryTab === 'video' ? g.type === 'video' : g.type !== 'video')
    .filter(({g}) => subKey === '__all'
      ? true
      : (g.subdivision || null) === subKey);
}
function galleryFolderStore() {
  S.data.galleryFolders ??= { image: [], video: [] };
  S.data.galleryFolders.image ??= [];
  S.data.galleryFolders.video ??= [];
  return S.data.galleryFolders;
}
function galleryStoredFolders() {
  const store = galleryFolderStore();
  return (S.galleryTab === 'video' ? store.video : store.image) || [];
}
function galleryFolders() {
  // Trả về tất cả path thư mục (gồm cả path cha suy ra từ path con).
  // Path dùng '/' để phân cấp: "Cha/Con/Cháu".
  const set = new Set();
  const addWithAncestors = (path) => {
    const parts = folderParts(path);
    for (let k = 1; k <= parts.length; k++) set.add(parts.slice(0, k).join('/'));
  };
  galleryListByTab().forEach(({g}) => { if (g.folder) addWithAncestors(g.folder); });
  galleryStoredFolders().forEach(n => { if (n) addWithAncestors(n); });
  return [...set].sort((a,b) => a.localeCompare(b, 'vi'));
}

/* ---------- Folder path utils (phân cấp bằng '/') ---------- */
function folderParts(path)  { return String(path||'').split('/').map(s => s.trim()).filter(Boolean); }
function folderDepth(path)  { return folderParts(path).length; }
function folderName(path)   { const p = folderParts(path); return p[p.length-1] || ''; }
function folderParent(path) { const p = folderParts(path); p.pop(); return p.join('/'); }
function folderJoin(parent, name) { return [parent, name].filter(Boolean).map(s => String(s).trim()).filter(Boolean).join('/'); }
/* path con/cháu của parent (không tính chính nó) */
function folderIsDescendant(path, parent) {
  if (!parent) return true;
  return path === parent ? false : path.startsWith(parent + '/');
}

/* Dựng cây từ danh sách path phẳng. Trả về mảng node {path,name,children}. */
function galleryFolderTree() {
  const all = galleryFolders();
  const roots = [];
  const byPath = new Map();
  for (const path of all) {
    const node = { path, name: folderName(path), children: [] };
    byPath.set(path, node);
    const parent = folderParent(path);
    if (parent && byPath.has(parent)) byPath.get(parent).children.push(node);
    else roots.push(node);
  }
  return roots;
}

/* Số mục (gồm cả thư mục con) trong một path. */
function galleryFolderDeepCount(path) {
  return galleryListByTab().filter(({g}) =>
    g.folder === path || folderIsDescendant(g.folder || '', path)).length;
}

/* State mở/đóng của các thư mục trên sidebar (theo path). */
S.galleryOpenFolders ??= {};
function galleryFolderIsOpen(path) {
  // Mặc định mở; nhớ trạng thái khi user đóng/mở. Tự mở nếu đang chọn nằm bên trong.
  if (S.galleryOpenFolders[path] !== undefined) return S.galleryOpenFolders[path];
  const cur = S.galleryFolder;
  if (cur && cur !== '__all' && cur !== '__none' && folderIsDescendant(cur, path)) return true;
  return false;
}
function galleryToggleFolder(path) {
  S.galleryOpenFolders[path] = !galleryFolderIsOpen(path);
  go('gallery');
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
    `<button class="btn btn-secondary btn-sm" onclick="galleryNewFolder()">${ico('plus')} Thư mục mới</button>
     ${addBtn}`)
  + subSelectorBar('gallery')
  + `
    <!-- Tabs Ảnh / Video -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px;background:var(--surface);border-radius:8px 8px 0 0;padding:0 8px">
      ${tabBtn('image', 'Ảnh',   'image', imgCount)}
      ${tabBtn('video', 'Video', 'video', vidCount)}
    </div>

    <div style="display:grid;grid-template-columns:240px 1fr;gap:16px;align-items:flex-start">

      <!-- Folder sidebar -->
      <div class="card" style="position:sticky;top:16px">
        <div class="card-header">
          <span class="card-title">${ico('folder',14)} Thư mục ${tabLabel}</span>
          <button class="act-btn" title="Thư mục gốc mới" onclick="galleryNewFolder('')" style="padding:2px;background:none;border:none;cursor:pointer;color:var(--muted)">${ico('plus',14)}</button>
        </div>
        <div style="padding:8px">
          ${folderSpecialRow('__all', 'Tất cả', 'navpanel', cur)}
          ${folderSpecialRow('__none', 'Chưa phân loại', tab === 'video' ? 'video' : 'image', cur)}
          ${galleryFolderTree().length ? `<div style="height:1px;background:var(--border);margin:6px 4px"></div>` : ''}
          ${galleryFolderTree().map(node => folderTreeRow(node, cur, 0)).join('')}
        </div>
      </div>

      <!-- Media grid -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">${tabLabel} · ${esc(curLabel)} · ${filtered.length} mục</span>
          <span class="card-subtitle">${all.length} tổng · ${vidCount} video · ${imgCount} ảnh${tab === 'image' ? ' · kéo-thả ảnh vào đây để tải lên' : ''}</span>
        </div>
        <div class="card-body${tab === 'image' ? ' gallery-dropzone' : ''}" id="gallery-body"
             ${tab === 'image' ? `
               ondragenter="galleryGridDzEnter(event)"
               ondragover="galleryGridDzEnter(event)"
               ondragleave="galleryGridDzLeave(event)"
               ondrop="galleryGridDzDrop(event)"
             ` : ''}>
          <div id="gallery-bulk-progress" style="display:none;margin-bottom:14px"></div>
          ${filtered.length === 0 ? `
            <div style="text-align:center;padding:40px;color:var(--muted)">
              ${cur === '__all'
                ? `Chưa có ${tabLabel.toLowerCase()} nào. ${tab === 'image' ? 'Kéo-thả ảnh vào đây hoặc bấm' : 'Bấm'} <b>Thêm ${tab === 'video' ? 'video' : 'ảnh'}</b> để bắt đầu.`
                : (tab === 'image' ? `Thư mục trống — kéo-thả ảnh vào đây để tải lên.` : `Không có mục nào trong thư mục này.`)}
            </div>` : `
            <div class="gallery-grid" id="gallery-grid">
              ${filtered.map(({g, i}) => mediaCardHTML(g, i)).join('')}
            </div>`}
        </div>
      </div>
    </div>`;
  // Lazy load ảnh: chỉ set src khi card vào gần viewport — giảm tải khi nhiều ảnh
  setupGalleryLazyLoad();
}

/* Quan sát các <img data-src> và chỉ load khi sắp vào màn hình. */
let _galleryIO = null;
function setupGalleryLazyLoad() {
  // Disconnect observer cũ (re-render)
  if (_galleryIO) { _galleryIO.disconnect(); _galleryIO = null; }
  const imgs = document.querySelectorAll('#gallery-grid img[data-src]');
  if (!imgs.length) return;
  if (!('IntersectionObserver' in window)) {
    // Fallback: load hết
    imgs.forEach(img => { img.src = img.dataset.src; delete img.dataset.src; });
    return;
  }
  _galleryIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src;
        delete img.dataset.src;
        _galleryIO.unobserve(img);
      }
    }
  }, { rootMargin: '300px 0px', threshold: 0.01 });
  imgs.forEach(img => _galleryIO.observe(img));
}

/* Hàng đặc biệt: "Tất cả" / "Chưa phân loại" (không phải path thật). */
function folderSpecialRow(value, label, iconName, current) {
  const active = current === value;
  const count = galleryFolderCount(value);
  return `
    <div onclick="galleryPickFolder('${value.replace(/'/g,"\\'")}')"
         style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;font-size:13px;${active?'background:var(--primary-soft);color:var(--primary);font-weight:600':'color:var(--text)'}">
      <span style="display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center">${ico(iconName,14)}</span>
      <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(label)}</span>
      <span style="font-size:11px;color:var(--muted);background:var(--surface2);padding:2px 7px;border-radius:10px">${count}</span>
    </div>`;
}

/* Hàng cây thư mục (đệ quy) — kiểu VS Code: caret thu gọn/mở rộng + thụt lề theo cấp. */
function folderTreeRow(node, current, depth) {
  const { path, name, children } = node;
  const active = current === path;
  const hasChildren = children.length > 0;
  const open = galleryFolderIsOpen(path);
  const count = galleryFolderCount(path);
  const pj = path.replace(/'/g,"\\'");
  const indent = 8 + depth * 14;
  const caret = hasChildren
    ? `<span onclick="event.stopPropagation();galleryToggleFolder('${pj}')"
            style="display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:transform .12s;${open?'transform:rotate(90deg)':''}">${ico('chevron-right',12)}</span>`
    : `<span style="display:inline-block;width:16px"></span>`;
  const row = `
    <div onclick="galleryPickFolder('${pj}')"
         style="display:flex;align-items:center;gap:6px;padding:6px 10px 6px ${indent}px;border-radius:8px;cursor:pointer;font-size:13px;${active?'background:var(--primary-soft);color:var(--primary);font-weight:600':'color:var(--text)'}">
      ${caret}
      <span style="display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center">${ico(open&&hasChildren?'folder-open':'folder',14)}</span>
      <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(path)}">${esc(name)}</span>
      <span style="font-size:11px;color:var(--muted);background:var(--surface2);padding:2px 7px;border-radius:10px">${count}</span>
      <button class="act-btn" title="Thư mục con mới" onclick="event.stopPropagation();galleryNewFolder('${pj}')" style="padding:2px;background:none;border:none;cursor:pointer;color:var(--muted)">${ico('plus',12)}</button>
      <button class="act-btn" title="Đổi tên" onclick="event.stopPropagation();galleryRenameFolder('${pj}')" style="padding:2px;background:none;border:none;cursor:pointer;color:var(--muted)">${ico('edit',12)}</button>
      <button class="act-btn" title="Xoá thư mục" onclick="event.stopPropagation();galleryDeleteFolder('${pj}')" style="padding:2px;background:none;border:none;cursor:pointer;color:var(--muted)">${ico('trash',12)}</button>
    </div>`;
  const childrenHtml = (hasChildren && open)
    ? children.map(c => folderTreeRow(c, current, depth + 1)).join('')
    : '';
  return row + childrenHtml;
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
          ? `<img data-src="${esc(thumb)}" alt="${esc(g.title||'')}"
                  loading="lazy" decoding="async"
                  style="opacity:0;transition:opacity .2s;background:var(--surface2)"
                  onload="this.style.opacity=1"
                  onerror="this.style.opacity=.2">`
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
function galleryNewFolder(parent = '') {
  // parent: '' = thư mục gốc; nếu undefined (gọi từ nút header cũ) → dùng thư mục đang chọn.
  if (parent === undefined) parent = defaultFolderForNew();
  const parentLabel = parent ? `Bên trong: <b>${esc(parent)}</b>` : 'Thư mục gốc (không có thư mục cha)';
  showPanel(parent ? 'Thư mục con mới' : 'Thư mục mới', `
    <div class="form-group">
      <label class="form-label">Tên thư mục *</label>
      <input class="form-control" id="gf-name" placeholder="VD: Mặt tiền, Nội thất…" autofocus>
      <small class="c-muted">${parentLabel}. Dùng dấu <code>/</code> để tạo nhiều cấp cùng lúc.</small>
    </div>
  `, () => {
    const raw = (document.getElementById('gf-name').value || '').trim();
    if (!raw) { toast('Nhập tên thư mục', 'warn'); return; }
    const path = folderJoin(parent, raw);
    if (!path) { toast('Tên thư mục không hợp lệ', 'warn'); return; }
    if (galleryFolders().includes(path)) { toast('Thư mục đã tồn tại', 'warn'); return; }
    const list = galleryStoredFolders();
    list.push(path);
    S.galleryFolder = path;
    if (parent) S.galleryOpenFolders[parent] = true; // mở cha để thấy con mới
    saveData(`Đã tạo thư mục "${path}"`);
    closePanel();
    go('gallery');
  });
}
function galleryRenameFolder(oldPath) {
  // Chỉ đổi phần tên cuối; path cha giữ nguyên. Áp dụng đệ quy cho cả con/cháu.
  uiPrompt(`Đổi tên thư mục "${folderName(oldPath)}" thành:`, folderName(oldPath), (next) => {
    if (!next) return false;
    const newName = next.trim();
    if (!newName || newName === folderName(oldPath)) return true;
    if (newName.includes('/')) { toast('Tên thư mục không được chứa dấu /', 'warn'); return false; }
    const newPath = folderJoin(folderParent(oldPath), newName);
    if (galleryFolders().includes(newPath)) { toast('Tên thư mục đã tồn tại', 'warn'); return false; }
    // Hàm ánh xạ path cũ → mới (cho chính nó và mọi con)
    const remap = (p) => {
      if (p === oldPath) return newPath;
      if (folderIsDescendant(p, oldPath)) return newPath + p.slice(oldPath.length);
      return p;
    };
    let changed = 0;
    (S.data.gallery || []).forEach(g => {
      if (!g.folder) return;
      const m = remap(g.folder);
      if (m !== g.folder) { g.folder = m; changed++; }
    });
    // Cập nhật stored folders (cả ảnh & video)
    const store = galleryFolderStore();
    ['image','video'].forEach(k => { store[k] = (store[k]||[]).map(remap); });
    // Cập nhật state mở/đóng + filter đang chọn
    const openNext = {};
    Object.keys(S.galleryOpenFolders).forEach(k => { openNext[remap(k)] = S.galleryOpenFolders[k]; });
    S.galleryOpenFolders = openNext;
    if (S.galleryFolder && S.galleryFolder !== '__all' && S.galleryFolder !== '__none') {
      S.galleryFolder = remap(S.galleryFolder);
    }
    saveData(`Đã đổi tên thư mục thành "${newName}"${changed?` (${changed} mục)`:''}`);
    go('gallery');
  }, { title:'Đổi tên thư mục', okText:'Lưu' });
}
function galleryDeleteFolder(path) {
  const isInside = (p) => p === path || folderIsDescendant(p || '', path);
  const itemCount = (S.data.gallery || []).filter(g => isInside(g.folder)).length;
  const subCount  = galleryFolders().filter(p => folderIsDescendant(p, path)).length;
  const parts = [];
  if (subCount)  parts.push(`${subCount} thư mục con`);
  if (itemCount) parts.push(`${itemCount} mục`);
  const msg = (itemCount || subCount)
    ? `Thư mục "${path}" đang chứa ${parts.join(' và ')}. Xoá sẽ chuyển toàn bộ mục về "Chưa phân loại" và xoá các thư mục con. Tiếp tục?`
    : `Xoá thư mục rỗng "${path}"?`;
  uiConfirm(msg, () => {
    (S.data.gallery || []).forEach(g => { if (isInside(g.folder)) delete g.folder; });
    const store = galleryFolderStore();
    ['image','video'].forEach(k => { store[k] = (store[k]||[]).filter(p => !isInside(p)); });
    Object.keys(S.galleryOpenFolders).forEach(k => { if (isInside(k)) delete S.galleryOpenFolders[k]; });
    if (S.galleryFolder && isInside(S.galleryFolder)) S.galleryFolder = '__all';
    saveData(`Đã xoá thư mục "${path}"`);
    go('gallery');
  }, { title:'Xoá thư mục', okText:'Xoá', okClass:'btn-danger' });
}

/* ---------- CRUD ---------- */
function galleryAddImage() {
  S.galleryTab = 'image';
  // Tạo input ẩn cho phép chọn nhiều ảnh cùng lúc → upload thẳng, không mở form từng ảnh.
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'image/*';
  inp.multiple = true;
  inp.style.display = 'none';
  inp.onchange = () => {
    const files = Array.from(inp.files || []);
    inp.remove();
    if (files.length === 0) return;
    if (files.length === 1) {
      // 1 ảnh → mở form đầy đủ như trước (để user nhập title/folder)
      galleryForm({ type:'image', src:'', title:'', folder: defaultFolderForNew() }, -1);
      // Đẩy file vào field upload sau khi panel render
      setTimeout(() => imgFieldReadFile('g-src', files[0]), 100);
    } else {
      galleryBulkUploadImages(files);
    }
  };
  document.body.appendChild(inp);
  inp.click();
}
function galleryAddVideo() { S.galleryTab = 'video'; galleryForm({ type:'video', src:'', title:'', folder: defaultFolderForNew(), videoSource:'youtube', poster:'' }, -1); }
function galleryAdd()      { galleryAddImage(); } // back-compat
function galleryEdit(i)    { galleryForm({ type:'image', ...S.data.gallery[i] }, i); }

/* Upload hàng loạt ảnh — dùng cho cả nút "Thêm ảnh" (multi) và kéo-thả vào lưới */
async function galleryBulkUploadImages(files) {
  const list = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (list.length === 0) { toast('Không có ảnh hợp lệ', 'warn'); return; }
  if (_uploadLimitsPromise) { try { await _uploadLimitsPromise; } catch {} }
  const oversized = list.filter(f => f.size > MAX_IMG_BYTES);
  if (oversized.length) {
    toast(`${oversized.length} ảnh vượt 10MB sẽ bị bỏ qua`, 'warn');
  }
  const queue = list.filter(f => f.size <= MAX_IMG_BYTES);
  if (queue.length === 0) return;

  // Xác định thư mục đích: nếu đang ở thư mục cụ thể → gán luôn folder
  const cur = S.galleryFolder;
  const targetFolder = (cur && cur !== '__all' && cur !== '__none') ? cur : '';
  const sk = curSubKey('gallery');
  const subdivision = sk === '__all' ? null : sk;

  const box = document.getElementById('gallery-bulk-progress');
  if (box) {
    box.style.display = '';
    box.innerHTML = `
      <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--surface)">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px">
          <span><b id="glb-done">0</b>/${queue.length} ảnh — đang tải lên${targetFolder ? ` vào "${esc(targetFolder)}"` : ''}…</span>
          <span id="glb-pct">0%</span>
        </div>
        <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
          <div id="glb-bar" style="height:100%;width:0%;background:var(--primary);transition:width .2s"></div>
        </div>
      </div>`;
  }

  let done = 0, ok = 0, fail = 0;
  for (const file of queue) {
    try {
      const publicUrl = await uploadImageToR2(file, { folder: 'gallery' });
      const item = {
        type: 'image',
        src: publicUrl,
        title: file.name.replace(/\.[^.]+$/, ''),
        subdivision,
      };
      if (targetFolder) item.folder = targetFolder;
      S.data.gallery.push(item);
      ok++;
    } catch (err) {
      console.error('Upload thất bại:', file.name, err);
      fail++;
    }
    done++;
    const pct = Math.round(done / queue.length * 100);
    const bar = document.getElementById('glb-bar');
    const pctEl = document.getElementById('glb-pct');
    const doneEl = document.getElementById('glb-done');
    if (bar) bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (doneEl) doneEl.textContent = done;
  }

  markSubDirty('gallery');
  saveData(fail ? `Đã thêm ${ok} ảnh · ${fail} lỗi` : `Đã thêm ${ok} ảnh`);
  go('gallery');
}

/* Dropzone cho lưới ảnh — kéo-thả nhiều file vào để upload */
function galleryGridDzEnter(e) {
  if (!e.dataTransfer?.types?.includes('Files')) return;
  e.preventDefault(); e.stopPropagation();
  document.getElementById('gallery-body')?.classList.add('dragover');
}
function galleryGridDzLeave(e) {
  e.preventDefault(); e.stopPropagation();
  // chỉ remove khi rời khỏi vùng body, không phải con
  if (e.target?.id === 'gallery-body') {
    document.getElementById('gallery-body')?.classList.remove('dragover');
  }
}
function galleryGridDzDrop(e) {
  e.preventDefault(); e.stopPropagation();
  document.getElementById('gallery-body')?.classList.remove('dragover');
  const files = Array.from(e.dataTransfer?.files || []);
  if (files.length) galleryBulkUploadImages(files);
}
function defaultFolderForNew() {
  const f = S.galleryFolder;
  return (f === '__all' || f === '__none') ? '' : f;
}

function galleryForm(g, idx) {
  const isVideo = g.type === 'video';
  const folders = galleryFolders();
  const folderOptions = `
    <option value="">— Chưa phân loại —</option>
    ${folders.map(f => {
      const indent = '    '.repeat(Math.max(0, folderDepth(f) - 1));
      return `<option value="${esc(f)}" ${g.folder===f?'selected':''}>${indent}${esc(folderName(f))}</option>`;
    }).join('')}
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
      let poster = imgFieldValue('g-poster');
      // Nếu user không nhập poster, tự sinh từ link nguồn (YouTube/Drive)
      if (!poster) {
        if (youtubeId(src)) poster = `https://i.ytimg.com/vi/${youtubeId(src)}/hqdefault.jpg`;
        else if (adminDriveFileId(src)) poster = `https://drive.google.com/thumbnail?id=${adminDriveFileId(src)}&sz=w640`;
      }
      if (poster) o.poster = poster;
    } else {
      const src = imgFieldValue('g-src');
      if (!src) { toast('Cần ảnh', 'warn'); return false; }
      o.src = src;
    }

    // Gán phân khu: giữ subdivision cũ khi sửa; khi thêm mới gán theo
    // phân khu đang chọn ('__all' -> null = cấp dự án).
    if (idx >= 0) {
      o.subdivision = S.data.gallery[idx] ? S.data.gallery[idx].subdivision || null : null;
      S.data.gallery[idx] = o;
    } else {
      const sk = curSubKey('gallery');
      o.subdivision = sk === '__all' ? null : sk;
      S.data.gallery.push(o);
    }
    markSubDirty('gallery');
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
// 4) TIMELINE ─ Tiến độ xây dựng
// ========================================================================
const TL_STATUS = { done:'Hoàn thành', active:'Đang thực hiện', upcoming:'Sắp tới' };

/* timeline slice của phân khu đang chọn */
function tlSlice() { return subSlice('timeline', 'timeline', []); }

function renderTimelinePage(el) {
  let tl = tlSlice();
  // Phòng thủ: nếu slice vì lý do nào đó không phải mảng (data cũ/lỗi từ server),
  // chuẩn hoá lại thành mảng rỗng để không vỡ render.
  if (!Array.isArray(tl)) {
    const d = ensureSubShape('timeline', []);
    const k = curSubKey('timeline');
    d[k] = [];
    tl = d[k];
  }
  const lastPulse = +localStorage.getItem('ah_timeline_pulse') || 0;
  const pulseLabel = lastPulse
    ? new Date(lastPulse).toLocaleString('vi-VN')
    : 'chưa phát sóng';
  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Tiến Độ Xây Dựng',
    `<button class="btn btn-secondary btn-sm" onclick="tlBroadcast()" title="Đẩy bản cập nhật ra trang VR ngay lập tức">${ico('refresh')} Phát sóng cập nhật</button>
     <button class="btn btn-primary btn-sm" onclick="tlAdd()">${ico('plus')} Thêm mốc</button>`)
  + subSelectorBar('timeline')
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
    // Phát sóng dùng dữ liệu cấp dự án (__all) — trang VR tab "Tất cả"
    const allTl = ensureSubShape('timeline', []).__all || [];
    localStorage.setItem('ah_timeline_data', JSON.stringify(allTl));
    localStorage.setItem('ah_timeline_pulse', String(Date.now()));
    toast('Đã phát sóng cập nhật tiến độ tới trang VR', 'ok');
    go('timeline');
  } catch (e) {
    toast('Không thể phát sóng: ' + e.message, 'err');
  }
}
function tlEdit(i) { tlForm({ ...tlSlice()[i] }, i); }
function tlDel(i) {
  const tl = tlSlice();
  confirmDel('Xoá mốc này?', tl[i].phase, () => {
    tl.splice(i,1); markSubDirty('timeline'); saveData('Đã xoá'); go('timeline');
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
    const tl = tlSlice();
    if (idx>=0) tl[idx] = obj;
    else        tl.push(obj);
    markSubDirty('timeline'); saveData('Đã lưu'); closePanel(); go('timeline');
  });
}
function tlDragStart(i) { S.dragSrc = i; }
function tlDrop(target) {
  const src = S.dragSrc;
  if (src == null || src === target) return;
  const tl = tlSlice();
  const [m] = tl.splice(src,1);
  tl.splice(target,0,m);
  S.dragSrc = null;
  markSubDirty('timeline'); saveData('Đã sắp xếp lại'); go('timeline');
}

// ========================================================================
// 5) LEGAL ─ Pháp lý: documents / developerStats / testimonials
// ========================================================================
/* legal slice của phân khu đang chọn */
function legalSlice() {
  return subSlice('legal', 'legal', { documents: [], developerStats: [], testimonials: [] });
}

function renderLegalPage(el) {
  const lg = legalSlice();
  lg.documents ??= []; lg.developerStats ??= []; lg.testimonials ??= [];
  el.innerHTML = pageHeader(['Dashboard','Hệ Thống'], 'Pháp Lý & Trust')
  + subSelectorBar('legal') + `
    ${legalSection('documents','Hồ Sơ Pháp Lý', lg.documents, [
      ['name','Tên giấy tờ',1],['detail','Chi tiết',2],['done','Đã có',0]
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
  developerStats: [['value','Giá trị'],['unit','Đơn vị'],['label','Nhãn']],
  testimonials:   [['initials','Tên viết tắt'],['role','Nghề'],['unit','Căn'],['text','Nội dung','textarea'],['avatar','Ảnh đại diện','image']],
};

function legalAdd(key) { legalForm(key, {}, -1); }
function legalEdit(key, i) { legalForm(key, { ...legalSlice()[key][i] }, i); }
function legalDel(key, i) {
  const lg = legalSlice();
  confirmDel('Xoá mục này?', lg[key][i].name || lg[key][i].label || '', () => {
    lg[key].splice(i,1); markSubDirty('legal'); saveData('Đã xoá'); go('legal');
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
    const lg = legalSlice();
    lg[key] ??= [];
    if (idx>=0) lg[key][idx] = obj;
    else        lg[key].push(obj);
    markSubDirty('legal'); saveData('Đã lưu'); closePanel(); go('legal');
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
  const lc = locationSlice();
  lc.nearby ??= [];
  el.innerHTML = pageHeader(['Dashboard','Hệ Thống'], 'Vị Trí & Tiện Ích Lân Cận')
  + subSelectorBar('location') + `
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

/* location slice của phân khu đang chọn */
function locationSlice() {
  return subSlice('location', 'location', { lat: 0, lng: 0, mapSrc: '', nearby: [] });
}

function locSaveCoords() {
  const lc = locationSlice();
  lc.lat    = parseFloat(document.getElementById('lc-lat').value) || 0;
  lc.lng    = parseFloat(document.getElementById('lc-lng').value) || 0;
  lc.mapSrc = document.getElementById('lc-map').value.trim();
  markSubDirty('location'); saveData('Đã lưu vị trí'); go('location');
}

function poiAdd() { poiForm({ cat:'school', name:'', dist:'', time:'' }, -1); }
function poiEdit(i) { poiForm({ ...locationSlice().nearby[i] }, i); }
function poiDel(i) {
  const lc = locationSlice();
  confirmDel('Xoá POI này?', lc.nearby[i].name, () => {
    lc.nearby.splice(i,1); markSubDirty('location'); saveData('Đã xoá'); go('location');
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
    const lc = locationSlice();
    lc.nearby ??= [];
    if (idx>=0) lc.nearby[idx] = obj;
    else        lc.nearby.push(obj);
    markSubDirty('location'); saveData('Đã lưu'); closePanel(); go('location');
  });
}

// ========================================================================
// 7) RESOURCES ─ Tài liệu bán hàng (Brochure, Sales kit, Brand kit, ...)
// ========================================================================
// Gợi ý tài liệu thường gặp — chỉ hiển thị khi list rỗng để user tạo nhanh.
const RESOURCE_PRESETS = [
  { label: 'Brochure dự án',            type: 'pdf' },
  { label: 'Bộ bí kíp tư vấn (nội bộ)', type: 'pdf' },
  { label: 'Bộ nhận diện thương hiệu',  type: 'folder' },
  { label: 'Bảng giá & chính sách',     type: 'pdf' },
  { label: 'TMB mã căn & diện tích',    type: 'pdf' },
];

const RESOURCE_TYPES = [
  ['pdf',    'PDF'],
  ['folder', 'Thư mục (Drive)'],
  ['link',   'Liên kết khác'],
  ['image',  'Ảnh'],
  ['doc',    'Tài liệu Word/Doc'],
  ['xls',    'Bảng tính Excel'],
];

/* resources slice của phân khu đang chọn */
function resourcesSlice() {
  return subSlice('resources', 'resources', {});
}

function renderResourcesPage(el) {
  const res = resourcesSlice();
  const keys = Object.keys(res);
  const withUrl = keys.filter(k => res[k]?.url).length;
  el.innerHTML = pageHeader(['Dashboard','Nội Dung VR'], 'Tài Liệu')
  + subSelectorBar('resources') + `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <span class="card-title">${ico('image',16)} Bộ tài liệu chính thức</span>
        <span class="card-subtitle">${keys.length === 0 ? 'Chưa có tài liệu nào' : `${withUrl}/${keys.length} đã có link`}</span>
        <div style="margin-left:auto;display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" onclick="resourceAdd()">${ico('plus',12)} Thêm tài liệu</button>
        </div>
      </div>
      <div class="card-body">
        ${keys.length === 0 ? resourceEmptyState() : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px">
            ${keys.map(k => resourceCard(k, res[k] || {})).join('')}
          </div>`}
      </div>
    </div>
  `;
}

function resourceEmptyState() {
  return `
    <div style="text-align:center;padding:32px 16px;color:var(--muted)">
      <div style="font-size:13px;margin-bottom:14px">Chưa có tài liệu nào — bấm <b>Thêm tài liệu</b> hoặc chọn nhanh từ gợi ý dưới đây:</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
        ${RESOURCE_PRESETS.map(p => `
          <button class="btn btn-secondary btn-sm" onclick="resourceAdd('${esc(p.label)}','${p.type}')">
            ${ico('plus',12)} ${esc(p.label)}
          </button>`).join('')}
      </div>
    </div>`;
}

function resourceCard(key, item) {
  const has = !!item.url;
  const title = item.title || 'Tài liệu chưa đặt tên';
  const type = item.type || 'pdf';
  return `
    <div style="border:1px solid var(--border);border-radius:10px;padding:14px;background:var(--surface)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:36px;height:36px;border-radius:8px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${ico('image',18)}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(title)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">
            ${has ? `<span class="badge badge-ok">${esc(type.toUpperCase())}</span> đã cập nhật` : `<span class="badge badge-muted">Chưa có link</span>`}
          </div>
        </div>
      </div>
      ${has ? `
        <div style="font-size:11px;color:var(--muted);padding:6px 8px;background:var(--surface2);border-radius:6px;margin-bottom:10px;word-break:break-all;font-family:monospace">${esc(item.url)}</div>
      ` : ''}
      <div style="display:flex;gap:6px">
        ${has ? `<a href="${esc(item.url)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="flex:1;text-align:center;text-decoration:none">${ico('globe',12)} Mở</a>` : ''}
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="resourceEdit('${esc(key)}')">${ico('edit',12)} ${has ? 'Sửa' : 'Thêm link'}</button>
        <button class="act-btn danger" title="Xoá tài liệu" onclick="resourceClear('${esc(key)}')">${ico('trash')}</button>
      </div>
    </div>`;
}

function _resourceMakeKey(label) {
  const slug = (label || 'tai-lieu').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32) || 'tai-lieu';
  const res = resourcesSlice();
  let key = slug, i = 2;
  while (res[key]) key = `${slug}-${i++}`;
  return key;
}

function resourceAdd(presetLabel, presetType) {
  // Mở panel với entry tạm — chỉ ghi vào slice khi user Lưu.
  _resourceOpenPanel(null, {
    title: presetLabel || '',
    url: '',
    type: presetType || 'pdf',
  });
}

function resourceEdit(key) {
  const res = resourcesSlice();
  const item = res[key];
  if (!item) return;
  _resourceOpenPanel(key, item);
}

function _resourceOpenPanel(key, item) {
  const isNew = !key;
  showPanel(`${isNew ? 'Thêm' : 'Sửa'} tài liệu`, `
    <div class="form-group">
      <label class="form-label">Tiêu đề hiển thị *</label>
      <input class="form-control" id="res-title" value="${esc(item.title || '')}" placeholder="VD: Brochure dự án">
    </div>
    <div class="form-group">
      <label class="form-label">URL / Link Drive *</label>
      <input class="form-control" id="res-url" value="${esc(item.url || '')}" placeholder="https://drive.google.com/...">
      <small class="c-muted">Dán link Google Drive, OneDrive hoặc URL trực tiếp.</small>
    </div>
    <div class="form-group">
      <label class="form-label">Hoặc tải file từ máy</label>
      <div class="dropzone" id="res-dz"
           onclick="document.getElementById('res-file').click()"
           ondragenter="resDzEnter(event)"
           ondragover="resDzEnter(event)"
           ondragleave="resDzLeave(event)"
           ondrop="resDzDrop(event)">
        <div class="dz-icon">${ico('upload',24)}</div>
        <div class="dz-title">Kéo & thả file vào đây</div>
        <div class="dz-sub">hoặc <span class="dz-browse">chọn từ máy</span></div>
        <div class="dz-meta" id="res-dz-meta">Mọi định dạng · file lưu trên server</div>
        <input type="file" id="res-file" style="display:none" onchange="resourceUploadFile(this.files && this.files[0])">
      </div>
      <div id="res-upload-progress" style="display:none;margin-top:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:4px">
          <span id="res-progress-label">Đang tải lên…</span>
          <span id="res-progress-pct">0%</span>
        </div>
        <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
          <div id="res-progress-bar" style="height:100%;width:0%;background:var(--primary);transition:width .15s"></div>
        </div>
      </div>
      <div id="res-upload-info" style="display:none;margin-top:10px" class="dz-fileinfo"></div>
    </div>
    <div class="form-group">
      <label class="form-label">Loại</label>
      <select class="form-control" id="res-type">
        ${RESOURCE_TYPES.map(([v,l]) => `<option value="${v}" ${(item.type || 'pdf') === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>
  `, () => {
    const url = document.getElementById('res-url').value.trim();
    const title = document.getElementById('res-title').value.trim();
    if (!title) { toast('Cần nhập tiêu đề', 'warn'); return false; }
    if (!url) { toast('Cần nhập URL hoặc upload file', 'warn'); return false; }
    const r = resourcesSlice();
    const finalKey = key || _resourceMakeKey(title);
    r[finalKey] = {
      title,
      url,
      type: document.getElementById('res-type').value,
    };
    markSubDirty('resources'); saveData('Đã lưu tài liệu'); closePanel(); go('resources');
  });
}

function resDzEnter(e) {
  e.preventDefault(); e.stopPropagation();
  document.getElementById('res-dz')?.classList.add('dragover');
}
function resDzLeave(e) {
  e.preventDefault(); e.stopPropagation();
  document.getElementById('res-dz')?.classList.remove('dragover');
}
function resDzDrop(e) {
  e.preventDefault(); e.stopPropagation();
  document.getElementById('res-dz')?.classList.remove('dragover');
  const file = e.dataTransfer?.files?.[0];
  if (file) resourceUploadFile(file);
}

function fmtBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1024 * 1024 * 1024) return (b / 1024 / 1024).toFixed(2) + ' MB';
  return (b / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

async function resourceUploadFile(file) {
  if (!file) return;
  const urlEl = document.getElementById('res-url');
  const typeEl = document.getElementById('res-type');
  const titleEl = document.getElementById('res-title');
  const progressBox = document.getElementById('res-upload-progress');
  const progressBar = document.getElementById('res-progress-bar');
  const progressPct = document.getElementById('res-progress-pct');
  const progressLabel = document.getElementById('res-progress-label');
  const infoBox = document.getElementById('res-upload-info');
  const base = (typeof API_BASE !== 'undefined' && API_BASE) ? API_BASE : '';

  progressBox.style.display = 'block';
  infoBox.style.display = 'none';
  progressBar.style.width = '0%';
  progressBar.style.background = 'var(--primary)';
  progressPct.textContent = '0%';
  progressLabel.textContent = `Đang tải ${file.name}`;

  try {
    // Xin presigned URL cho R2 — upload thẳng lên Cloudflare, không qua server.
    const presignRes = await fetch(base + '/api/upload/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        folder: 'resources',
      }),
    });
    if (!presignRes.ok) {
      const msg = (await presignRes.json().catch(() => ({}))).error || presignRes.statusText;
      throw new Error('Không xin được presigned URL: ' + msg);
    }
    const { uploadUrl, publicUrl, headers } = await presignRes.json();

    // PUT trực tiếp lên R2 (dùng XHR để có progress)
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);
      Object.entries(headers || {}).forEach(([k, v]) => xhr.setRequestHeader(k, v));
      xhr.upload.onprogress = ev => {
        if (ev.lengthComputable) {
          const pct = Math.round(ev.loaded / ev.total * 100);
          progressBar.style.width = pct + '%';
          progressPct.textContent = pct + '%';
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error('R2 trả ' + xhr.status));
      };
      xhr.onerror = () => reject(new Error('Lỗi mạng khi upload lên R2'));
      xhr.send(file);
    });

    const fullUrl = publicUrl;
    urlEl.value = fullUrl;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const typeMap = { pdf:'pdf', doc:'doc', docx:'doc', xls:'xls', xlsx:'xls',
                      png:'image', jpg:'image', jpeg:'image', gif:'image', webp:'image' };
    if (typeMap[ext]) typeEl.value = typeMap[ext];
    if (titleEl && !titleEl.value.trim()) {
      titleEl.value = file.name.replace(/\.[^.]+$/, '');
    }

    progressBox.style.display = 'none';
    infoBox.style.display = 'block';
    infoBox.innerHTML = `
      <div class="dz-info-row">
        <div style="width:36px;height:36px;border-radius:8px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${ico('check',18)}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(file.name)}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">
            <span class="badge badge-ok">${esc((ext || 'FILE').toUpperCase())}</span>
            ${fmtBytes(file.size)} · đã lưu trên server
          </div>
        </div>
        <button type="button" class="act-btn" title="Tải file khác" onclick="document.getElementById('res-file').click()">
          ${ico('refresh-cw',14)}
        </button>
      </div>`;
  } catch (err) {
    progressBar.style.background = 'var(--danger, #ef4444)';
    progressPct.textContent = 'Lỗi';
    progressLabel.textContent = err.message;
    toast('Upload thất bại: ' + err.message, 'err');
  }
}

function resourceClear(key) {
  const item = resourcesSlice()[key];
  if (!item) return;
  confirmDel('Xoá tài liệu?', item.title || key, () => {
    delete resourcesSlice()[key];
    markSubDirty('resources'); saveData('Đã xoá tài liệu'); go('resources');
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

/* Tải ảnh quy hoạch lên R2, lưu public URL vào masterplan.image */
async function mpUploadImage(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { toast('File không phải ảnh', 'err'); return; }
  try {
    const url = await uploadImageToR2(file, { folder: 'masterplan' });
    S.data.masterplan.image = url;
    saveData("Đã tải ảnh quy hoạch");
    go("masterplan");
  } catch (err) {
    console.error(err);
    toast('Upload thất bại: ' + err.message, 'err');
  }
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

/* ── Inline translation popover ─────────────────────────────────────
   Gọi từ HTML: openTransPopover('property', '<id>', 'name', anchorEl)
   Lưu qua PUT /api/translations/:entity/:id. */
window.openTransPopover = function(entity, entityId, field, anchorEl) {
  // Tránh mở nhiều popover cùng lúc
  document.querySelectorAll('.trans-pop').forEach(el => el.remove());
  if (!entityId) { toast('Lưu sản phẩm trước khi nhập bản dịch', 'warn'); return; }

  const pop = document.createElement('div');
  pop.className = 'trans-pop';
  // Field nhiều dòng — gợi ý cú pháp cho user.
  const MULTI_HINT = {
    highlights: 'Mỗi dòng một ý (khớp số dòng với phần gốc).',
    progress:   'Mỗi dòng: phase | date | done(0/1). VD: Bàn giao | Q4/2026 | 0',
  };
  const isMulti = !!MULTI_HINT[field];
  const rows = isMulti ? 6 : 3;
  const hint = MULTI_HINT[field] || '';

  pop.innerHTML = `
    <div class="tp-head">
      <span class="tp-title">${ico('globe',12)} Bản dịch — <b>${esc(field)}</b></span>
      <button class="tp-x" type="button">&times;</button>
    </div>
    <div class="tp-body">
      <div class="tp-lang">English (en)</div>
      <textarea class="tp-input" rows="${rows}" placeholder="Bản dịch tiếng Anh..."></textarea>
      ${hint ? `<div class="tp-hint">${esc(hint)}</div>` : ''}
      <div class="tp-actions">
        <button class="btn btn-secondary btn-sm tp-cancel" type="button">Huỷ</button>
        <button class="btn btn-primary btn-sm tp-save" type="button">Lưu</button>
      </div>
      <div class="tp-status"></div>
    </div>`;
  Object.assign(pop.style, {
    position: 'absolute', zIndex: 9999, width: '320px',
    background: 'var(--surface, #1a1f2e)',
    border: '1px solid var(--border, #2a3245)',
    borderRadius: '8px', padding: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,.5)', color: 'var(--text, #e5e7eb)'
  });
  document.body.appendChild(pop);
  const r = anchorEl.getBoundingClientRect();
  pop.style.left = Math.min(window.innerWidth - 340, r.left + window.scrollX) + 'px';
  pop.style.top  = (r.bottom + window.scrollY + 6) + 'px';

  const ta = pop.querySelector('.tp-input');
  const status = pop.querySelector('.tp-status');

  // Nạp bản dịch hiện có
  fetch(`/api/translations/${entity}/${entityId}`)
    .then(r => r.ok ? r.json() : {})
    .then(data => { ta.value = (data && data[field] && data[field].en) || ''; })
    .catch(() => {});

  const close = () => pop.remove();
  pop.querySelector('.tp-x').onclick = close;
  pop.querySelector('.tp-cancel').onclick = close;
  pop.querySelector('.tp-save').onclick = async () => {
    status.textContent = 'Đang lưu...';
    try {
      const r = await fetch(`/api/translations/${entity}/${entityId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, lang: 'en', text: ta.value })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      toast('Đã lưu bản dịch EN', 'ok');
      close();
    } catch (e) {
      status.textContent = 'Lỗi: ' + e.message;
    }
  };

  setTimeout(() => {
    const off = (e) => { if (!pop.contains(e.target)) { close(); document.removeEventListener('mousedown', off, true); } };
    document.addEventListener('mousedown', off, true);
  }, 10);
};

/* Tạo HTML icon translate gắn cạnh input. propId rỗng = chưa save → disabled. */
function transBtn(entity, entityId, field) {
  const disabled = !entityId;
  const title = disabled ? 'Lưu sản phẩm trước khi nhập bản dịch' : 'Nhập bản dịch ngôn ngữ khác';
  return `<button type="button" class="trans-btn" title="${title}"
    ${disabled ? 'disabled' : ''}
    onclick="openTransPopover('${entity}','${entityId||''}','${field}',this)">${ico('globe',13)}</button>`;
}

function renderPropertyDetailPage(el) {
  const list = S.data.properties || (S.data.properties = []);
  const isNew = propDetailIdx < 0;
  const p = isNew ? propBlank() : (list[propDetailIdx] || propBlank());
  const sales = S.data.sales || [];
  // entity_id = property code; nút dịch chỉ enable khi đã có code.
  const transCode = p.code || '';

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
  <div class="pd-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:flex-start">

    <!-- ── Thông tin cơ bản ── -->
    <div class="card">
      <div class="card-header"><span class="card-title">${ico('home',16)} Thông tin cơ bản</span></div>
      <div class="card-body">
        <div style="display:flex;gap:10px">
          <div class="form-group" style="flex:1"><label class="form-label">Mã căn *</label>
            <input class="form-control" id="pd-code" value="${esc(p.code||'')}" placeholder="VM-SH-06.03"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Tên sản phẩm * ${transBtn('property', transCode, 'name')}</label>
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
        <div class="form-group"><label class="form-label">Mô tả ${transBtn('property', transCode, 'desc')}</label>
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
          <div class="form-group" style="flex:1"><label class="form-label">Pháp lý ${transBtn('property', transCode, 'legal')}</label>
            <input class="form-control" id="pd-legal" value="${esc(p.legal||'')}"></div>
          <div class="form-group" style="flex:1"><label class="form-label">Dự kiến bàn giao ${transBtn('property', transCode, 'handover')}</label>
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
          <input type="file" id="pd-img-file" accept="image/*,video/*" multiple style="display:none" onchange="propUploadMedia(this,'images')">
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
          <input type="file" id="pd-floor-file" accept="image/*,video/*" multiple style="display:none" onchange="propUploadMedia(this,'thumbsFloor')">
        </div>
      </div>
      <div class="card-body"><div id="pd-thumbsFloor-grid">${propMediaGridHTML(p.thumbsFloor, 'thumbsFloor')}</div></div>
    </div>

    <!-- ── Điểm nổi bật ── -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">${ico('check',16)} Điểm nổi bật</span>
        ${transBtn('property', transCode, 'highlights')}
      </div>
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
        <span class="card-title">${ico('calendar',16)} Tiến độ ${transBtn('property', transCode, 'progress')}</span>
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

/* ── Media grid (ảnh / video / mặt bằng) ── */
function isVideoSrc(src) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(src || '') || /^data:video\//i.test(src || '');
}
function propMediaGridHTML(arr, field) {
  arr = arr || [];
  if (!arr.length) {
    return `<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px">Chưa có ảnh / video.</div>`;
  }
  return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px">
    ${arr.map((src, i) => {
      const url = esc(propImg(src));
      const media = isVideoSrc(src)
        ? `<video src="${url}" muted playsinline style="width:100%;height:100%;object-fit:cover" onerror="this.style.opacity=.2"></video>`
        : `<img src="${url}" style="width:100%;height:100%;object-fit:cover" alt="" onerror="this.style.opacity=.2">`;
      return `
      <div style="position:relative;border:1px solid var(--border);border-radius:8px;overflow:hidden;aspect-ratio:4/3;background:#0b1220">
        ${media}
        <button class="act-btn danger" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.6)"
                onclick="propRemoveMedia('${field}',${i})">${ico('trash',12)}</button>
      </div>`;
    }).join('')}
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
async function propUploadMedia(input, field) {
  const files = Array.from(input.files || []);
  if (!files.length) return;
  const p = propCurrent();
  p[field] = p[field] || [];
  toast(`Đang tải ${files.length} tệp...`, 'info');
  let ok = 0, fail = 0;
  for (const f of files) {
    const type = f.type || '';
    if (!type.startsWith('image/') && !type.startsWith('video/')) { fail++; continue; }
    try {
      const url = await uploadImageToR2(f, { folder: 'property/' + field });
      p[field].push(url);
      ok++;
      propRefreshMedia(field);
    } catch (err) { console.error(err); fail++; }
  }
  input.value = '';
  toast(`Đã tải ${ok}/${files.length}${fail ? ` (lỗi ${fail})` : ''}`, fail ? 'warn' : 'ok');
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
