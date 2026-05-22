# Help Tour (Nút "?") — Tài liệu kỹ thuật & UI/UX (port-ready spec)

> Mục đích: tài liệu mô tả **đầy đủ** module **Help Tour** (spotlight onboarding) đang dùng trong dự án **Vinhomes Hai Van Bay 360° VR** — nút `?` trong cụm điều khiển kích hoạt một tour highlight từng phần UI, tooltip có mũi tên trỏ về spotlight, click bất kỳ đâu để sang bước tiếp theo. Đủ chi tiết để **port sang dự án khác**.

- **Logic JS:** [js/main.js:1279-1479](../../js/main.js#L1279-L1479) (block `HELP TOUR` — `HELP_ITEMS / startTour / endTour / showTourStep / bindTour`)
- **HTML overlay:** [index.html:566-576](../../index.html#L566-L576)
- **Nút trigger desktop `#help-btn`:** [index.html:467](../../index.html#L467) — nằm trong `#tb-ctrlgroup`
- **Nút trigger mobile `#mob-help`:** [index.html:1154](../../index.html#L1154) — trong mobile drawer, delegate click sang `#help-btn`
- **CSS:** [css/style.css:371-378](../../css/style.css#L371-L378) (`.ctrl-btn-help`) và [css/style.css:2343-2448](../../css/style.css#L2343-L2448) (overlay + spot + tip + arrow)
- **i18n:** key `tour.*` trong [js/i18n.js](../../js/i18n.js) — đã dịch đủ **5 ngôn ngữ** (vi / en / zh / ko / ja); `ui.step`, `ui.continueHint`, `ui.skip`, `ui.help` cho overlay & tooltip

---

## 1. Tổng quan chức năng

Help Tour là một **interactive onboarding spotlight**:

| Đặc điểm | Mô tả |
|---|---|
| Trigger | Click nút `?` (`#help-btn` desktop, `#mob-help` mobile) |
| Backdrop | Toàn màn hình tối `rgba(0,0,0,.72)`, "khoét" 1 lỗ sáng quanh element đang highlight |
| Spotlight | Box-shadow `0 0 0 9999px` để tạo cảm giác đục lỗ qua nền tối |
| Tooltip | Card trắng ~280px, có **mũi tên CSS** tự xoay 4 hướng để trỏ về spotlight |
| Navigation | Click **bất kỳ đâu trên overlay** → bước tiếp; nút `×` (`#tour-skip`) → thoát; `Esc` → thoát |
| Auto-skip | Element không tồn tại / ẩn (size 0) → tự nhảy bước tiếp |
| Single-list | **Một danh sách bước duy nhất** `HELP_ITEMS` (16 bước) — không tách 2D/3D |
| Responsive | Mỗi bước có thể có `mobileTarget` riêng; tour tự mở mobile drawer / nav-panel / project-card trước khi đo target |
| Resize-aware | Lắng nghe `resize` → re-render spot/tip ở vị trí mới |
| i18n live | Label/step resolve qua `_t()` mỗi lần show step → đổi ngôn ngữ giữa tour cũng cập nhật ngay |
| Smart placement | Tooltip tự chọn cạnh **bottom → top → right → left** dựa trên không gian còn trống của viewport |
| Step counter | Hiển thị "Bước i / n" trong tooltip |

---

## 2. Phụ thuộc

### Bắt buộc
- Vanilla JS, không cần framework.
- DOM phải tồn tại: `#tour-overlay`, `#tour-spot`, `#tour-tip` (với con `.tt-arrow`, `.tt-step`, `.tt-label`, `.tt-hint`, `#tour-skip`), và nút trigger `#help-btn`.
- Hàm dịch `_t(key, vars)` — wrapper i18n của dự án.

### Tùy chọn
- Nút trigger mobile `#mob-help` — delegate sang `#help-btn` (xem [index.html:1195](../../index.html#L1195)).
- Các panel có class state: `#mobile-drawer.open`, `#nav-panel.collapsed`, `#project-card.collapsed`, `#ui.hidden` — chỉ cần khi UI dự án có panel đóng/mở. Nếu không, bỏ phần xử lý `openDrawer / openNav / openPC`.

---

## 3. Cấu trúc DOM

### 3.1 Nút trigger
```html
<!-- Desktop — trong #tb-ctrlgroup -->
<button class="ctrl-btn ctrl-btn-help" id="help-btn"
        data-i18n-title="ui.help" title="Hướng dẫn sử dụng">?</button>

<!-- Mobile — trong mobile drawer -->
<button class="ctrl-btn ctrl-btn-help" id="mob-help" title="Help">?</button>
```
Nút `#mob-help` đóng drawer rồi trigger lại `#help-btn` click:
```js
$d('mob-help').addEventListener('click', function () {
  closeDrawer();
  var h = $d('help-btn'); if (h) h.click();
});
```

### 3.2 Overlay
```html
<div id="tour-overlay">
  <div id="tour-spot"></div>
  <div id="tour-tip">
    <div class="tt-arrow"></div>
    <div class="tt-step"></div>     <!-- "Bước 1 / 16" -->
    <div class="tt-label"></div>    <!-- nội dung bước -->
    <div class="tt-hint" data-i18n="ui.continueHint">
      Click bất kỳ đâu để tiếp tục →
    </div>
    <button id="tour-skip" data-i18n-title="ui.skip" title="Bỏ qua">×</button>
  </div>
</div>
```

Một overlay duy nhất gắn vào `<body>` — không tạo từng spotlight riêng cho từng bước.

---

## 4. Cấu trúc data — HELP_ITEMS

Mỗi step là 1 object:

```js
{
  target:       '#nav-panel' | () => Element,  // CSS selector HOẶC function trả về element (target desktop)
  mobileTarget: '#mob-help',                   // (tùy chọn) selector dùng riêng khi ở mobile (≤768px)
  round:        true | false,                  // spotlight bo tròn (50%) thay vì radius 14px
  openDrawer:   true,                          // (mobile) mở #mobile-drawer trước khi đo target
  openNav:      true,                          // (mobile) bung #nav-panel (bỏ .collapsed) trước khi đo
  openPC:       true,                          // (mobile) bung #project-card (bỏ .collapsed) trước khi đo
  labelKey:     'tour.nav'                     // i18n key cho text trong tooltip
                | () => 'tour.xxx',            // function nếu cần resolve động
  label:        'Raw text…'                    // (chỉ dùng khi không có labelKey)
}
```

### 4.1 Danh sách bước hiện tại (`HELP_ITEMS` — 16 bước)

Thứ tự đi theo luồng UI từ top-bar → cụm điều khiển → nav-panel → project-card → bot:

| # | target (desktop) | mobileTarget | flag | labelKey |
|---|---|---|---|---|
| 1 | `.brand` | — | — | `tour.brand` |
| 2 | `#btn-gallery` | `#mob-gallery-btn` | `openDrawer` | `tour.gallery` |
| 3 | `#open-modal` | `#mob-book-btn` | `openDrawer` | `tour.book` |
| 4 | `#tb-ctrlgroup` | — | — | `tour.ctrlgroup` |
| 5 | `#ctrl-rotate` | `#mob-rotate` | `openDrawer` | `tour.rotate` |
| 6 | `#ctrl-zoom-in` | `#mob-zoom-in` | `openDrawer` | `tour.zoomIn` |
| 7 | `#ctrl-zoom-out` | `#mob-zoom-out` | `openDrawer` | `tour.zoomOut` |
| 8 | `#ctrl-fullscreen` | `#mob-fs` | `openDrawer` | `tour.fullscreen` |
| 9 | `#ctrl-lang-wrap` | `#mob-lang` | `openDrawer` | `tour.lang` |
| 10 | `#help-btn` | `#mob-help` | `openDrawer` | `tour.help` |
| 11 | `#nav-panel` | — | `openNav` | `tour.nav` |
| 12 | `#np-search-wrap` | — | `openNav` | `tour.search` |
| 13 | `#np-list` | — | `openNav` | `tour.list` |
| 14 | `#project-card` | — | `openPC` | `tour.project` |
| 15 | `#bb-chat-btn` | — | `round` | `tour.bot` |
| 16 | `#ui-restore` | — | — | `tour.restore` |

> i18n cũng có sẵn `tour.sitemap` và `tour.hotspot` (dịch đủ 5 ngôn ngữ) — chưa gắn vào step nào, để dành nếu muốn highlight thêm sơ đồ 2D hoặc hotspot trong panorama.

---

## 5. State & API

```js
let tourIdx    = -1;            // chỉ số bước hiện tại
let tourActive = false;
let tourItems  = HELP_ITEMS;    // mảng đang chạy

function startTour(items = HELP_ITEMS, fromIndex = 0) { … }
function endTour() { … }
function showTourStep() { … }   // render spot + tip cho tourItems[tourIdx]
function bindTour() { … }       // gắn 4 event listener (gọi 1 lần lúc init)
```

`startTour()` còn:
- Bỏ class `.hidden` của `#ui` (đảm bảo giao diện hiện).
- Trên **desktop**: bung sẵn `#nav-panel` (bỏ `.collapsed` + `body.nav-panel-collapsed`). Trên **mobile**: để các bước tự mở panel lazy.

`endTour()` đóng overlay và đóng `#mobile-drawer` nếu nó được mở trong lúc tour.

`bindTour()` (xem [js/main.js:1455-1479](../../js/main.js#L1455-L1479)):
```js
$('help-btn').addEventListener('click', e => { e.stopPropagation(); startTour(HELP_ITEMS); });
$('tour-overlay').addEventListener('click', e => {
  if (e.target.closest('#tour-skip')) return;   // nhường cho handler riêng
  tourIdx++; showTourStep();
});
$('tour-skip').addEventListener('click', e => { e.stopPropagation(); endTour(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && tourActive) endTour(); });
window.addEventListener('resize', () => { if (tourActive) showTourStep(); });
```
`bindTour()` được gọi trong luồng init chính.

---

## 6. Thuật toán `showTourStep()`

```
1. Nếu !tourActive → return.
2. Nếu tourIdx >= tourItems.length → endTour(); return.

3. isMob = matchMedia('(max-width: 768px)').matches

4. (Chỉ mobile) Quản lý panel TRƯỚC khi đo target:
   - Nếu bước KHÔNG cần drawer mà drawer đang mở → đóng drawer.
   - openNav  → nếu #nav-panel còn .collapsed: bỏ collapsed; setTimeout(showTourStep, 380); return.
   - openPC   → nếu #project-card còn .collapsed: bỏ collapsed; setTimeout(showTourStep, 500); return.
   - openDrawer → nếu #mobile-drawer chưa .open: thêm .open; setTimeout(showTourStep, 420); return.
   (delay = chờ animation panel xong rồi mới đo lại)

5. Resolve target:
   - isMob && item.mobileTarget → querySelector(mobileTarget)
   - else typeof target === 'function' → target()
   - else typeof target === 'string'   → querySelector(target)
   - không có target → tourIdx++; recurse.

6. rect = target.getBoundingClientRect()
   Nếu width=0 hoặc height=0 (element ẩn) → tourIdx++; recurse.

7. Tính ô spotlight (pad 6px): sx/sy/sw/sh → đặt #tour-spot.
   Toggle class .round theo item.round.

8. Resolve label: item.labelKey (string/function) → _t(...); hoặc item.label.
   tt-step = _t('ui.step', { n: tourIdx+1, total: tourItems.length })

9. Chọn cạnh đặt tooltip theo không gian trống viewport (ưu tiên bottom > top > right > left).

10. Tính (tx, ty) theo side; clamp trong viewport (margin 10px).

11. Áp class mũi tên (.arrow-up/-down/-left/-right) tương ứng cạnh.
    Set --arrow-x / --arrow-y để mũi tên trỏ đúng tâm spot (clamp tránh tràn).

12. Set tip.style.left/top.
```

Mọi giá trị left/top/width/height đều transition CSS (.35s cubic-bezier) → chuyển bước mượt mà.

---

## 7. CSS chi tiết

### 7.1 Overlay (full-screen)
```css
#tour-overlay {
  position: fixed; inset: 0;
  z-index: 4500;
  opacity: 0; pointer-events: none;
  transition: opacity .25s ease;
  cursor: pointer;        /* gợi ý: click bất kỳ đâu */
}
#tour-overlay.open { opacity: 1; pointer-events: auto; }
```

### 7.2 Spotlight (đục lỗ qua nền tối)
```css
#tour-spot {
  position: absolute;
  left: 0; top: 0; width: 0; height: 0;
  border-radius: 14px;
  box-shadow:
    0 0 0 9999px rgba(0,0,0,.72),     /* nền tối lan ra tận viewport */
    0 0 0 3px var(--icon-blue),        /* viền xanh quanh spotlight */
    0 0 24px rgba(43,182,230,.6);      /* glow */
  transition:
    left .35s cubic-bezier(.4,0,.2,1), top .35s cubic-bezier(.4,0,.2,1),
    width .35s cubic-bezier(.4,0,.2,1), height .35s cubic-bezier(.4,0,.2,1),
    border-radius .25s ease;
  pointer-events: none;
}
#tour-spot.round { border-radius: 50%; }
```
**Kỹ thuật cốt lõi**: `box-shadow: 0 0 0 9999px rgba(0,0,0,.72)` — phần "lỗ" chính là kích thước thực của `#tour-spot`, bóng đổ phình ra tận biên viewport, tạo overlay tối có khoét cửa sổ sáng. Không cần SVG mask, không cần canvas.

### 7.3 Tooltip + mũi tên CSS
```css
#tour-tip {
  position: absolute;
  background: #fff; border-radius: 12px;
  padding: 14px 18px 12px; width: 280px;
  box-shadow: 0 10px 32px rgba(0,0,0,.35);
  pointer-events: auto;
  transition: left .35s cubic-bezier(.4,0,.2,1), top .35s cubic-bezier(.4,0,.2,1);
}
/* Mobile: thu hẹp tip cho khớp viewport */
@media (max-width: 768px) {
  #tour-tip { width: calc(100vw - 32px); max-width: 320px; }
}

/* Mũi tên: 1 div vuông 14×14 xoay 45° giả làm tam giác */
.tt-arrow { position:absolute; width:14px; height:14px; background:#fff; transform: rotate(45deg); }
#tour-tip.arrow-up    .tt-arrow { top:-6px;    left: var(--arrow-x, 24px); box-shadow:-2px -2px 4px rgba(0,0,0,.04); }
#tour-tip.arrow-down  .tt-arrow { bottom:-6px; left: var(--arrow-x, 24px); box-shadow: 2px  2px 4px rgba(0,0,0,.04); }
#tour-tip.arrow-left  .tt-arrow { left:-6px;   top:  var(--arrow-y, 20px); box-shadow:-2px  2px 4px rgba(0,0,0,.04); }
#tour-tip.arrow-right .tt-arrow { right:-6px;  top:  var(--arrow-y, 20px); box-shadow: 2px -2px 4px rgba(0,0,0,.04); }

/* An toàn: khi overlay đóng nhưng còn trong DOM, ép inert */
#tour-overlay:not(.open) #tour-tip,
#tour-overlay:not(.open) #tour-spot { pointer-events: none !important; visibility: hidden; }
```

### 7.4 Nút trigger `.ctrl-btn-help`
```css
.tb-ctrlgroup .ctrl-btn-help {
  background: #fff;
  color: var(--icon-blue);
  font-weight: 700;
}
.tb-ctrlgroup .ctrl-btn-help:hover { background: #e8f7fd; }
```
Nút dùng chung base `.ctrl-btn` của cụm điều khiển nhưng **đảo màu** (nền trắng + chữ xanh) để nổi bật.

---

## 8. i18n keys cần có

Tất cả nằm trong [js/i18n.js](../../js/i18n.js), **dịch đủ 5 ngôn ngữ** (vi / en / zh / ko / ja):

```jsonc
// Overlay & tooltip chung
"ui.help":          "Hướng dẫn sử dụng",
"ui.step":          "Bước {n} / {total}",      // có placeholder
"ui.continueHint":  "Click bất kỳ đâu để tiếp tục →",
"ui.skip":          "Bỏ qua",

// Nhãn từng bước
"tour.brand":      "Logo dự án — quay về tổng quan.",
"tour.gallery":    "Thư viện ảnh dự án.",
"tour.book":       "Đặt lịch tham quan và xem bảng giá chi tiết.",
"tour.ctrlgroup":  "Cụm điều khiển — tự xoay, zoom, toàn màn hình, ngôn ngữ, mở lại hướng dẫn.",
"tour.rotate":     "Bật/tắt tự xoay panorama 360°.",
"tour.zoomIn":     "Phóng to góc nhìn.",
"tour.zoomOut":    "Thu nhỏ góc nhìn.",
"tour.fullscreen": "Bật chế độ toàn màn hình.",
"tour.lang":       "Đa ngôn ngữ — chọn ngôn ngữ hiển thị.",
"tour.help":       "Mở lại hướng dẫn này bất cứ lúc nào.",
"tour.nav":        "Bảng điều hướng trái — thông tin scene và danh sách nhóm.",
"tour.search":     "Tìm kiếm nhanh trong toàn bộ danh sách.",
"tour.list":       "Các nhóm: Tổng quan, Tiện ích, Mặt bằng, Căn hộ…",
"tour.project":    "Thông tin dự án: giá, trạng thái, chỉ số chính.",
"tour.bot":        "Trợ lý AI — chat text hoặc giọng nói.",
"tour.restore":    "Khi giao diện bị ẩn, bấm nút này để hiện lại.",

// Dự phòng (chưa gắn vào step nào)
"tour.sitemap":    "Bản đồ thiết kế 2D — điểm chạm dẫn vào không gian 360°.",
"tour.hotspot":    "Hotspot trong khung 360° — click để điều hướng hoặc xem mô tả."
```

---

## 9. Hướng dẫn port nhanh sang dự án mới

1. **Copy HTML overlay** [index.html:566-576](../../index.html#L566-L576) vào `<body>`.
2. **Copy CSS** block mục 7 (hoặc trích từ [css/style.css:2343-2448](../../css/style.css#L2343-L2448)) + style nút trigger.
3. **Copy JS**: block `HELP TOUR` [js/main.js:1279-1479](../../js/main.js#L1279-L1479) — `HELP_ITEMS`, 3 hàm `startTour/endTour/showTourStep`, và `bindTour()`.
4. **Sửa lại `HELP_ITEMS`** cho khớp UI dự án mới (đổi `target` / `mobileTarget` / `labelKey`).
5. **Thêm nút trigger** `<button id="help-btn">?</button>` ở góc UI; `bindTour()` lo phần đăng ký sự kiện — chỉ cần gọi `bindTour()` một lần lúc init.
6. **i18n**: bê namespace `tour.*` + 4 key `ui.*`, hoặc thay `labelKey` bằng `label` raw string và bỏ `_t()` trong `showTourStep`.
7. **Bỏ phần panel mobile** (`openDrawer / openNav / openPC` + các `setTimeout`) nếu dự án không có panel đóng/mở.
8. **Tùy biến brand**: đổi `--icon-blue` để đổi màu ring spotlight + step label.

---

## 10. Checklist kiểm tra sau khi cập nhật / port

- [ ] Click `?` (desktop & mobile) → màn hình mờ đen, ring xanh sáng quanh bước đầu (`.brand`).
- [ ] Tooltip hiện "Bước 1 / 16" + nhãn + dòng hint xám in nghiêng.
- [ ] Click vùng tối → next step, ring trượt mượt 350ms.
- [ ] Mũi tên tooltip luôn chỉ về spotlight, đúng cạnh.
- [ ] Element không tồn tại / ẩn → tour tự skip, không kẹt.
- [ ] **Mobile**: các bước `openDrawer` tự mở mobile drawer; `openNav` / `openPC` tự bung panel trước khi spotlight.
- [ ] Resize trình duyệt khi tour đang chạy → spotlight + tip re-position.
- [ ] Nhấn `Esc` → tour đóng ngay.
- [ ] Click `×` → tour đóng, không trigger nhầm "next step".
- [ ] Bước cuối (`#ui-restore`) → click lần nữa → tour kết thúc, overlay fade out, drawer đóng.
- [ ] Đổi ngôn ngữ giữa tour (5 ngôn ngữ) → label step hiện tại đổi liền.

---

## 11. Hạn chế đã biết

- Không support **2 tour song song** (state global). Cần nhiều flow → wrap thành class/factory.
- Không có **animation in-out** ở từng bubble — chỉ overlay fade và spot transition.
- Click vào nội dung TRONG tooltip cũng next step. Muốn tooltip có link/btn riêng → kiểm tra `e.target.closest('a, button')` trước khi tăng `tourIdx`.
- **Không có nút Back / Prev** — luồng tuyến tính một chiều. Thêm dễ: nút `‹` + `tourIdx = Math.max(0, tourIdx - 1); showTourStep();`.
- Không lưu cờ "đã xem tour rồi" — muốn auto-show ở first visit thì wrap bằng `localStorage.getItem('tour-seen')`.
- Spot dùng box-shadow `9999px` — đủ cho mọi viewport thực tế.

---

*File này tự đủ. Mang nó cùng overlay HTML, block `HELP TOUR` trong `js/main.js` và block CSS spotlight sang dự án mới — help tour chạy được trong < 15 phút.*
