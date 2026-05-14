# Aurora Heights VR360 — Project Specification

**Version:** 1.0  
**Date:** 2026-05-14  
**Status:** Production  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [File Structure](#3-file-structure)
4. [Data Model](#4-data-model)
5. [Page Layout & Zones](#5-page-layout--zones)
6. [Feature Catalog](#6-feature-catalog)
7. [User Flows](#7-user-flows)
8. [Component Specifications](#8-component-specifications)
9. [Responsive Behavior](#9-responsive-behavior)
10. [Internationalization](#10-internationalization)
11. [Design System](#11-design-system)
12. [Module Architecture](#12-module-architecture)
13. [Known Limitations](#13-known-limitations)

---

## 1. Project Overview

**Product Name:** Aurora Heights VR360 Experience  
**Type:** Real Estate Immersive Landing Page  
**Target:** High-end residential buyers / investors  
**Market:** Vietnam (primary), International (EN, ZH, KO, JA)

### 1.1 Business Goals

| Goal | Implementation |
|------|---------------|
| Generate qualified leads | Booking modal + contact form |
| Showcase property visually | VR360 panorama viewer |
| Build buyer trust | Legal panel + testimonials |
| Drive urgency | Countdown timer + urgency toasts |
| Support international buyers | 5-language i18n |
| Assist buyers 24/7 | AI chatbot (voice + text) |

### 1.2 Project Data

| Field | Value |
|-------|-------|
| Project Name | Aurora Heights |
| Location | Khu Tây Hồ Tây, Hà Nội |
| Developer | Aurora Land Holdings |
| Status | Đang mở bán giai đoạn 2 |
| Handover | Quý IV / 2027 |
| Starting Price | Từ 4.9 tỷ |
| Total Units | 1,840 |
| Towers | 6 |
| Floors | 42 |
| Available Units | 49 (limited inventory) |
| Hotline | 0901 234 567 |

---

## 2. Tech Stack & Dependencies

### 2.1 Core Technologies

| Layer | Technology | Version |
|-------|-----------|---------|
| Markup | HTML5 | — |
| Styling | CSS3 (custom vars, grid, flex) | — |
| Scripting | Vanilla JavaScript (ES2020+) | — |
| 3D Engine | Three.js | r128 (CDN) |
| Fonts | Google Fonts | — |
| Data | JSON | — |

### 2.2 Browser APIs Used

| API | Usage | Fallback |
|-----|-------|---------|
| Web Speech API — SpeechRecognition | Voice input in AI chat | Text-only mode |
| Web Speech API — SpeechSynthesis | TTS output in AI chat | Silent mode |
| Web Audio API — AudioContext | Waveform visualizer | Hidden visualizer |
| Fullscreen API | VR fullscreen | Button hidden |
| Intersection Observer | Lazy-load Google Maps | Immediate load |
| CSS Custom Properties | Theme / design tokens | Hardcoded fallbacks |

### 2.3 External Services

| Service | Purpose | Load Strategy |
|---------|---------|--------------|
| Google Fonts | Typography | `<link>` in `<head>` |
| cdnjs (Three.js) | 3D renderer | `<script>` in `<head>` |
| Google Maps Embed | Location panel | Lazy (on panel open) |
| Zalo Messaging | Contact shortcut | Static link |

### 2.4 No Backend

All data is static JSON. Forms currently log to console (stub for CRM integration).

---

## 3. File Structure

```
BDS/
├── index.html                    # Single-page app entry point (1,250 lines)
│
├── data/
│   └── project.json             # All content & configuration (826 lines)
│
├── js/
│   ├── i18n.js                  # Internationalization system
│   ├── vr360.js                 # Three.js panorama viewer module
│   ├── ai-panel.js              # AI chatbot (voice + text)
│   ├── main.js                  # Core UI logic and orchestration (1,602 lines)
│   ├── mobile-patch.js          # Mobile-specific UI behaviors
│   └── mobile-stepper.js        # Mobile floorplan carousel
│
├── css/
│   ├── style.css                # Complete design system (2,500+ lines)
│   ├── mobile-stepper.css       # Stepper component styles
│   └── mobile-overrides.css     # Mobile-specific overrides
│
├── img/
│   ├── 1.png                    # AI avatar (primary)
│   ├── 2.png                    # AI avatar (alternate)
│   └── thietke-matbangduan.jpg  # Site map background image
│
└── docs/
    ├── PROJECT_SPEC.md          # This file
    ├── PROJECT_SPEC.html        # HTML documentation version
    ├── DASHBOARD_SPEC.md        # Admin dashboard specification
    ├── BOTCHAT_SPEC.md          # AI panel specification
    ├── HELPTOUR_SPEC.md         # Help tour specification
    └── VRINFO_MOBILE_SPEC.md    # Mobile behavior specification
```

### 3.1 Script Load Order (Critical)

```html
<!-- Must load in this exact order -->
<script src="js/i18n.js"></script>      <!-- Exposes window.I18n -->
<script src="js/vr360.js"></script>     <!-- Exposes window.VR360 -->
<script src="js/ai-panel.js"></script>  <!-- Exposes window.AiPanel -->
<script src="js/main.js"></script>      <!-- Depends on all above -->
<script src="js/mobile-stepper.js"></script>
<script src="js/mobile-patch.js"></script>
```

---

## 4. Data Model

All content lives in `data/project.json`. This is the single source of truth.

### 4.1 Root Structure

```json
{
  "meta": { ... },           // Project metadata
  "stats": [ ... ],          // Key statistics array
  "amenities": [ ... ],      // Quick amenity icons
  "menuGroups": { ... },     // Navigation menu groups
  "scenes": [ ... ],         // VR360 panorama scenes
  "floorplanUnits": [ ... ], // Unit inventory
  "siteMapPoints": [ ... ],  // Clickable map points
  "gallery": [ ... ],        // Photo gallery
  "legal": { ... },          // Legal & trust information
  "location": { ... },       // Map & nearby POIs
  "amenitiesDetail": { ... },// Tabbed amenity detail
  "timeline": [ ... ]        // Construction timeline
}
```

### 4.2 `meta` Object

| Field | Type | Example |
|-------|------|---------|
| `name` | string | "Aurora Heights" |
| `location` | string | "Khu Tây Hồ Tây, Hà Nội" |
| `developer` | string | "Aurora Land Holdings" |
| `status` | string | "Đang mở bán giai đoạn 2" |
| `handover` | string | "Quý IV / 2027" |
| `priceFrom` | string | "Từ 4.9 tỷ" |
| `totalUnits` | number | 1840 |
| `totalTowers` | number | 6 |
| `floors` | number | 42 |
| `hotline` | string | "0901 234 567" |
| `zalo` | string | "0901234567" |
| `unitsLeft` | number | 49 |
| `promoDeadline` | ISO string | "2025-07-31T23:59:59" |

### 4.3 `scenes` Array (VR360 Scenes)

Each scene object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique scene identifier |
| `title` | string | Display name |
| `subtitle` | string | Short description |
| `type` | string | "interior" \| "exterior" |
| `palette` | string[4] | 4 hex colors for procedural sky |
| `horizonY` | number | 0–1, where horizon sits in panorama |
| `hotspots` | Hotspot[] | Array of interactive points |

**Hotspot object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `x` | number | Equirectangular X (0–1) |
| `y` | number | Equirectangular Y (0–1) |
| `type` | "info" \| "nav" | Info popup or scene jump |
| `label` | string | Display text on pin |
| `desc` | string | (info type) Tooltip description |
| `target` | string | (nav type) Target scene ID |

**6 Available Scenes:**

| ID | Title | Type | Hotspots |
|----|-------|------|---------|
| `sky-lounge` | Sky Lounge Tầng 42 | interior | 3 |
| `penthouse` | Penthouse Mẫu 3PN | interior | 3 |
| `master-bedroom` | Master Suite | interior | 3 |
| `pool-deck` | Bể Bơi Vô Cực | exterior | 3 |
| `park` | Công Viên Trung Tâm | exterior | 3 |
| `aerial` | Toàn Cảnh Dự Án | exterior | 3 |

### 4.4 `floorplanUnits` Array

| Field | Type | Values |
|-------|------|--------|
| `code` | string | e.g. "A-2BR-72-08" |
| `type` | string | "2PN" \| "3PN" \| "3PN+" \| "Penthouse" |
| `floor` | number | 8–42 |
| `area` | number | m² (72–280) |
| `direction` | string | e.g. "Đông Nam" |
| `priceVal` | number | Billion VND |
| `price` | string | Formatted e.g. "5.4 tỷ" |
| `pricePerM2` | string | e.g. "75 tr/m²" |
| `available` | number | Units available |
| `total` | number | Total units of this type |
| `status` | string | "available" \| "holding" \| "sold" |

**9 Unit Types:**

| Code | Type | Floor | Area | Price |
|------|------|-------|------|-------|
| A-2BR-72-08 | 2PN | 8 | 72m² | 5.4 tỷ |
| A-2BR-85-15 | 2PN | 15 | 85m² | 6.4 tỷ |
| B-3BR-105-20 | 3PN | 20 | 105m² | 8.9 tỷ |
| B-3BR-118-25 | 3PN | 25 | 118m² | 10.4 tỷ |
| C-3BRP-128-30 | 3PN+ | 30 | 128m² | 12.5 tỷ |
| C-3BRP-135-35 | 3PN+ | 35 | 135m² | 13.6 tỷ |
| D-PH-180-40 | Penthouse | 40 | 180m² | — (sold) |
| D-PH-220-41 | Penthouse | 41 | 220m² | — (sold) |
| D-PH-280-42 | Penthouse | 42 | 280m² | 14.2 tỷ |

### 4.5 `menuGroups` Object

6 navigation groups, each with an array of menu items:

| Group Key | Label | Item Count |
|-----------|-------|-----------|
| `tongQuan` | Tổng Quan | 6 |
| `tienIchNoiKhu` | Tiện Ích Nội Khu | 6 |
| `tienIchNgoaiKhu` | Tiện Ích Ngoại Khu | 10 |
| `matBangTang` | Mặt Bằng Tầng | 5 |
| `view360Can` | View 360° Căn Hộ | 11 |

Each menu item: `{ id, label, sceneId?, icon? }`

### 4.6 `legal` Object

```
legal.developer     — { years, unitsHandedOver, projects, residents }
legal.documents     — array of { label, verified: bool }
legal.banks         — array of { name, rate, term }
legal.testimonials  — array of { name, unit, quote, avatar }
```

### 4.7 `location` Object

```
location.lat           — number
location.lng           — number  
location.mapsEmbedUrl  — string (Google Maps embed)
location.pois          — array of { name, category, dist, time, icon }
```

POI categories: `school`, `hospital`, `metro`, `mall`, `airport`

### 4.8 `amenitiesDetail` Object

4 tabs, each with array of amenities:

| Tab Key | Label | Items |
|---------|-------|-------|
| `noiKhu` | Tiện Ích Nội Khu | 6 |
| `skyAmenity` | Tiện Ích Cao Tầng | 3 |
| `dichVu` | Dịch Vụ | 3 |
| `haTang` | Hạ Tầng | 3 |

Each amenity: `{ icon, label, desc }`

### 4.9 `timeline` Array

8 construction phases:

| Field | Type |
|-------|------|
| `phase` | string (e.g. "Q1/2024") |
| `label` | string |
| `status` | "done" \| "active" \| "upcoming" |
| `desc` | string |

---

## 5. Page Layout & Zones

```
┌─────────────────────────────────────────────────────┐
│  #loader                                            │
│  (Loading screen — hidden after boot)               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  #vr-stage  (Full-screen Three.js canvas)           │
│  + #hotspot-layer (Absolute positioned hotspots)    │
└─────────────────────────────────────────────────────┘

┌──── #ui (Overlay on top of VR stage) ───────────────┐
│                                                     │
│  ┌─ Top Bar (#top-bar) ──────────────────────────┐  │
│  │  [Brand Logo] [Nav Buttons...] [Lang] [Help]  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Left Panel (#nav-panel) ─┐  ┌─ Right Card ──┐  │
│  │  [Search bar]             │  │  [Stats]      │  │
│  │  [Accordion Groups]       │  │  [Price]      │  │
│  │  [Scene menu items]       │  │  [Amenities]  │  │
│  └───────────────────────────┘  │  [Actions]    │  │
│                                  └───────────────┘  │
│                                                     │
│  [Floating: AI Chat Button]                         │
│  [Floating: UI Restore Button]                      │
│  [Floating: Urgency Toasts]                         │
│                                                     │
│  ┌─ Overlays (z-index stacked) ─────────────────┐  │
│  │  #sitemap-overlay   │  #gallery-overlay       │  │
│  │  #amenities-overlay │  #legal-overlay          │  │
│  │  #location-overlay  │  #loan-overlay           │  │
│  │  #timeline-overlay  │  #floorplan-overlay      │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ #booking-modal ───────────────────────────────┐  │
│  │  [Unit table] + [Contact form]                 │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ #tour-overlay (Onboarding spotlight) ─────────┐  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ #ai-panel (Right sidebar chatbot) ────────────┐  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 5.1 Z-Index Stack

| Layer | z-index | Element |
|-------|---------|---------|
| Canvas | 0 | `#vr-stage canvas` |
| Hotspots | 10 | `#hotspot-layer` |
| Panels | 100 | `#nav-panel`, `#project-card` |
| Top Bar | 110 | `#top-bar` |
| Overlays | 200 | All `*-overlay` elements |
| Modal | 300 | `#booking-modal` |
| AI Panel | 350 | `#ai-panel` |
| Tour | 400 | `#tour-overlay` |
| Toasts | 500 | `.urgency-toast` |
| Loader | 9999 | `#loader` |

---

## 6. Feature Catalog

### 6.1 VR360 Panorama Viewer

**Module:** `js/vr360.js` → `window.VR360`

| Feature | Detail |
|---------|--------|
| Renderer | Three.js WebGL, inverted sphere geometry |
| Panorama | Procedurally generated (canvas 2048×1024) |
| Navigation | Mouse drag (lon/lat rotation) |
| Zoom | Scroll wheel (FOV range: 40°–95°) |
| Auto-rotate | Toggle, pauses on user interaction |
| Fullscreen | Native Fullscreen API |
| Scene count | 6 scenes |
| Transition | Scene swap with brief fade |

**VR360 Public API:**

```js
VR360.init(container, opts)     // Initialize renderer
VR360.loadScene(sceneData)      // Load scene by data object
VR360.setAutoRotate(bool)       // Toggle rotation
VR360.zoomBy(delta)             // Adjust FOV
VR360.projectHotspot(x, y)     // Equirect → screen coords
VR360.getYaw()                  // Current yaw angle
VR360.lookAt(x, y)              // Snap camera
VR360.destroy()                 // Cleanup
```

---

### 6.2 Hotspot System

Interactive points overlaid on the VR canvas.

| Type | Behavior |
|------|---------|
| `info` | Click → show popup with label + description |
| `nav` | Click → transition to target scene |

**Hotspot lifecycle:**
1. `buildHotspots(hotspots)` — create DOM elements
2. `updateHotspotPositions()` — called every animation frame via `VR360.projectHotspot()`
3. Hotspot hidden when behind camera (negative z-projection)
4. Pulse animation on all hotspots (CSS keyframe)

---

### 6.3 Navigation Panel (Left)

**Element:** `#nav-panel`

| Sub-feature | Detail |
|-------------|--------|
| Search | Real-time filter across all menu items |
| Accordion | 5 groups, one open at a time |
| Scene link | Click item → `switchScene(id)` |
| Active state | Highlights current scene |
| Collapse | Toggle hide/show entire panel |

---

### 6.4 Project Card (Right)

**Element:** `#project-card`

| Section | Content |
|---------|---------|
| Stats | 4 key numbers (units, towers, floors, handover) |
| Price badge | Starting price + promo deadline |
| Countdown | Live DD:HH:MM:SS timer to `promoDeadline` |
| Amenity icons | 8 quick-access icons |
| CTA buttons | "Đặt Lịch Xem" + "Xem Bảng Giá" |
| Social buttons | Call hotline + Zalo |

---

### 6.5 Overlay System

All overlays share:
- Full-screen coverage
- Close button (×)
- Backdrop click to close
- Keyboard Escape to close
- Smooth fade-in animation

| Overlay ID | Feature Name | Trigger |
|-----------|-------------|---------|
| `#sitemap-overlay` | 2D Site Map | Top bar button |
| `#gallery-overlay` | Photo Gallery | Top bar button |
| `#amenities-overlay` | Amenities Detail | Top bar button |
| `#legal-overlay` | Legal & Trust | Top bar button |
| `#location-overlay` | Location Map | Top bar button |
| `#loan-overlay` | Loan Calculator | Project card / top bar |
| `#timeline-overlay` | Construction Timeline | Top bar button |
| `#floorplan-overlay` | Floorplan & Pricing | "Xem Bảng Giá" button |

---

### 6.6 Site Map (2D Floor Plan)

**Element:** `#sitemap-overlay`

| Feature | Detail |
|---------|--------|
| Background | `img/thietke-matbangduan.jpg` |
| Points | 7 clickable points on map image |
| Point action | Click → close sitemap, switch to corresponding VR scene |
| Animation | Points pulse to draw attention |

---

### 6.7 Photo Gallery & Lightbox

**Element:** `#gallery-overlay`

| Feature | Detail |
|---------|--------|
| Layout | Responsive CSS grid |
| Items | 6 project images |
| Lightbox | Full-screen image viewer |
| Navigation | Prev/Next arrows |
| Keyboard | ← → arrows, Escape to close |
| Close | Button or Escape |

---

### 6.8 Amenities Detail Panel

**Element:** `#amenities-overlay`

| Feature | Detail |
|---------|--------|
| Tabs | 4 tabs (Nội Khu, Cao Tầng, Dịch Vụ, Hạ Tầng) |
| Items per tab | 3–6 amenities |
| Each item | Icon + label + description |
| Tab switching | Click tab → filter displayed amenities |

---

### 6.9 Legal & Trust Panel

**Element:** `#legal-overlay`

| Section | Content |
|---------|---------|
| Developer stats | Years, units handed over, projects, residents |
| Document checklist | 5+ legal docs with verified badges |
| Partner banks | Bank name + interest rate + term |
| Testimonials | 3 resident quotes with avatar + unit info |

---

### 6.10 Location Panel

**Element:** `#location-overlay`

| Feature | Detail |
|---------|--------|
| Map | Google Maps iframe (lazy-loaded) |
| Category filter | All, School, Hospital, Metro, Mall, Airport |
| POI list | 9 nearby points with distance + travel time |
| Coordinates | 21.0631, 105.8194 (Tây Hồ Tây, Hà Nội) |

---

### 6.11 Loan Calculator

**Element:** `#loan-overlay`

| Input | Type | Range |
|-------|------|-------|
| Property price | Slider | 4.9–14.2 tỷ |
| Equity % | Slider | 10–70% |
| Loan term | Select | 10, 15, 20, 25, 30 years |
| Bank | Select | Vietcombank, BIDV, Techcombank, VPBank |

| Output | Description |
|--------|-------------|
| Loan amount | Computed from price × (1 − equity%) |
| Monthly payment | Annuity formula |
| Total interest | Over full term |
| Amortization chart | 10-bar mini bar chart (year-by-year) |

**Formula:**
```
M = P × [r(1+r)^n] / [(1+r)^n − 1]
where: P = principal, r = monthly rate, n = total months
```

---

### 6.12 Construction Timeline

**Element:** `#timeline-overlay`

| Feature | Detail |
|---------|--------|
| Total phases | 8 |
| Status types | done (✓), active (▶), upcoming (○) |
| Progress bar | Visual % completion based on done phases |
| Cards | Phase label + date + description |

---

### 6.13 Floorplan & Pricing Table

**Element:** `#floorplan-overlay`

| Feature | Detail |
|---------|--------|
| Table rows | 9 unit types |
| Columns | Unit code, type, floor, area, direction, price/m², price, available, status, action |
| Filter: type | 2PN, 3PN, 3PN+, Penthouse |
| Filter: floor | All, Low (8–15), Mid (16–30), High (31–42) |
| Filter: status | All, Available, Holding, Sold |
| Sort | Click column header (code, floor, area, price) |
| Row action | "Đặt Cọc" button → open booking modal pre-filled |
| Status badge | Color-coded (green=available, yellow=holding, red=sold) |

---

### 6.14 Booking Modal

**Element:** `#booking-modal`

**Form Fields:**

| Field | Type | Required |
|-------|------|----------|
| Họ và tên | text | Yes |
| Số điện thoại | tel | Yes |
| Email | email | No |
| Zalo | text | No |
| Căn hộ quan tâm | select | No |
| Ngân sách | select | No |
| Mục đích | select | No |
| Thời điểm mua | select | No |
| Đồng ý Zalo | checkbox | No |
| Đồng ý SMS | checkbox | No |
| Đồng ý ĐKBH | checkbox | No |

**Validation:**
- Name: required, non-empty
- Phone: required, format check (Vietnam mobile)
- Email: format check if provided

**States:**
1. Empty form (default)
2. Validation errors (inline messages)
3. Submitting (button spinner)
4. Success (confirmation screen with callback CTA)

---

### 6.15 AI Chatbot

**Module:** `js/ai-panel.js` → `window.AiPanel`  
**See also:** `docs/BOTCHAT_SPEC.md`

| Mode | Description |
|------|-------------|
| Text mode | Type message → submit → bot replies |
| Voice mode | Click mic → speak → STT → bot reply → TTS |
| Capsule mode | Panel morphs to horizontal pill during voice |

**State machine:** `idle → listening → thinking → speaking → idle`

**Voice pipeline:**
1. User clicks mic button
2. Request microphone permission
3. Start AudioContext + analyser (waveform visualization)
4. SpeechRecognition begins
5. On result (≥2 chars): stop listening, enter thinking state
6. Generate bot response (stub)
7. SpeechSynthesis speaks reply
8. Return to listening state (loop)

**Public API:**
```js
AiPanel.open()    // Show panel
AiPanel.close()   // Hide panel
AiPanel.toggle()  // Toggle
```

---

### 6.16 Help Tour (Onboarding)

**Module:** `main.js` → `startTour()`  
**See also:** `docs/HELPTOUR_SPEC.md`

| Feature | Detail |
|---------|--------|
| Trigger | `?` button in top bar |
| Steps | 17 guided steps |
| Spotlight | CSS box-shadow cutout on target element |
| Tooltip | Positioned smart (top/bottom/left/right) |
| Navigation | Prev / Next / Skip |
| Keyboard | Escape to skip |

**17 Tour Steps:**

1. Brand logo
2. Site map button
3. Gallery button
4. Amenities button
5. Legal button
6. Location button
7. Loan calculator
8. Timeline
9. Language switcher
10. Nav panel
11. Search bar
12. Scene items
13. Project card
14. Countdown timer
15. CTA buttons
16. AI chat button
17. Hotspots

---

### 6.17 Urgency Toast Notifications

| Feature | Detail |
|---------|--------|
| Trigger | 30 seconds after page load |
| Frequency | Random interval (every 30–90s) |
| Duration | 6 seconds visible, then auto-dismiss |
| Messages | "X người đang xem", "Vừa đặt cọc căn Y", "Chỉ còn Z căn" |
| Position | Bottom-right floating |
| Animation | Slide-in from right |

---

### 6.18 Language Switcher

| Feature | Detail |
|---------|--------|
| Languages | VI 🇻🇳, EN 🇬🇧, ZH 🇨🇳, KO 🇰🇷, JA 🇯🇵 |
| Persistence | sessionStorage |
| Scope | All UI text, form labels, tour steps, AI messages |
| Trigger | Globe icon in top bar |
| Implementation | `js/i18n.js` → `window.I18n` |

---

## 7. User Flows

### 7.1 Primary Flow: Browse & Book

```
[Page Load]
    ↓
[Loading Screen] — fetch project.json + initialize Three.js
    ↓ (2–3 seconds)
[VR Experience] — default scene: sky-lounge
    ↓
[User explores] — drag to look around, click hotspots
    ↓
[User clicks nav item or hotspot] → switchScene()
    ↓
[User clicks "Xem Bảng Giá"] → open floorplan overlay
    ↓
[User filters & selects unit] → "Đặt Cọc" button
    ↓
[Booking modal opens] — unit pre-filled
    ↓
[User fills form] — validation on submit
    ↓
[Success screen] — callback offer
```

### 7.2 Secondary Flow: Loan Calculation

```
[User opens Loan Calculator]
    ↓
[Adjusts property price slider]
    ↓
[Sets equity % and loan term]
    ↓
[Selects bank]
    ↓
[Live calculation updates] — monthly payment, total interest
    ↓
[Views amortization chart]
    ↓
[Clicks "Tư Vấn Vay Vốn"] → open booking modal
```

### 7.3 New Visitor Flow (Onboarding)

```
[Page Load → Show tour prompt after 3 seconds]
    ↓
[User clicks "?" → startTour()]
    ↓
[Step 1 of 17: Brand] → [Next] → [Step 2: Site map] → ...
    ↓
[Step 17: Hotspots]
    ↓
[Tour ends] → [Explore freely]
```

### 7.4 Voice AI Flow

```
[User clicks AI chat button] → AiPanel.open()
    ↓
[Chat panel slides in from right]
    ↓
[Demo messages appear] (5 pre-set bubbles)
    ↓
[User clicks mic button] → voice mode
    ↓
[Panel morphs to capsule]
    ↓
[Waveform appears] — browser mic permission requested
    ↓
[User speaks]
    ↓
[STT transcribes] → display as user bubble
    ↓
[Bot responds] — display as bot bubble + TTS speaks
    ↓
[Auto re-listen] — loop until user clicks mic again
    ↓
[User exits voice mode] → return to text mode
```

### 7.5 Language Switch Flow

```
[User clicks globe icon]
    ↓
[Language dropdown appears]
    ↓
[User selects language (e.g., EN)]
    ↓
[I18n.set('en')] → onChange callbacks fire
    ↓
[All data-i18n elements updated]
    ↓
[Dynamic content re-rendered]
    ↓
[Preference saved to sessionStorage]
```

---

## 8. Component Specifications

### 8.1 Loading Screen

**ID:** `#loader`  
**Behavior:** Covers full viewport, shows brand animation, hidden when `boot()` completes.

```
States: visible → (fade out) → display:none
Trigger to hide: VR360 initialized + project.json loaded
```

### 8.2 Top Bar

**ID:** `#top-bar`  
**Fixed position, z-index 110**

| Button | Icon | Action |
|--------|------|--------|
| Brand/Logo | Text logo | — |
| Site Map | map icon | Open sitemap overlay |
| Gallery | photo icon | Open gallery overlay |
| Amenities | star icon | Open amenities overlay |
| Legal | shield icon | Open legal overlay |
| Location | pin icon | Open location overlay |
| Loan | calculator icon | Open loan overlay |
| Timeline | timeline icon | Open timeline overlay |
| Floorplan | grid icon | Open floorplan overlay |
| Language | globe icon | Open language menu |
| Help | ? icon | Start help tour |

### 8.3 Hotspot DOM

```html
<div class="hotspot" data-id="..." data-type="info|nav">
  <div class="hotspot-pin"></div>
  <div class="hotspot-label">Label text</div>
  <div class="hotspot-popup">  <!-- info type only -->
    <strong>Label</strong>
    <p>Description</p>
  </div>
</div>
```

### 8.4 Unit Status Badges

| Status | Color | Label |
|--------|-------|-------|
| available | `--ok` (green) | Còn hàng |
| holding | amber | Đang giữ chỗ |
| sold | `--danger` (red) | Đã bán |

---

## 9. Responsive Behavior

### 9.1 Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Desktop | ≥ 769px | Full sidebar layout |
| Mobile/Tablet | ≤ 768px | Drawer + burger menu |
| Landscape Mobile | height ≤ 500px | Compact mode |

### 9.2 Mobile-Specific Components

| Component | Behavior |
|-----------|---------|
| Burger menu | Opens full-height drawer |
| Drawer | Contains all nav buttons + language switcher |
| Nav panel | Hidden by default, accessible via drawer |
| Project card | Collapsed pill at bottom, expand on tap |
| Info FAB | Floating button for project card on mobile |
| Floorplan | Horizontal stepper carousel (`mobile-stepper.js`) |

### 9.3 Touch Gestures

| Gesture | Action |
|---------|--------|
| Single finger drag | Rotate VR scene |
| Pinch | Zoom (FOV) |
| Tap hotspot | Show popup / navigate scene |
| Swipe drawer | Close drawer |
| Tap backdrop | Close overlay / modal |

---

## 10. Internationalization

**Module:** `js/i18n.js` → `window.I18n`

### 10.1 Supported Languages

| Code | Language | Flag |
|------|----------|------|
| `vi` | Vietnamese | 🇻🇳 |
| `en` | English | 🇬🇧 |
| `zh` | Chinese | 🇨🇳 |
| `ko` | Korean | 🇰🇷 |
| `ja` | Japanese | 🇯🇵 |

### 10.2 Translation Namespaces

| Namespace | Key Count | Description |
|-----------|-----------|-------------|
| `ui.*` | 50+ | General UI labels |
| `modal.*` | 20+ | Booking form labels |
| `sitemap.*` | 5 | Sitemap overlay |
| `gallery.*` | 5 | Gallery overlay |
| `amenities.*` | 10 | Amenity panel |
| `legal.*` | 10 | Legal panel |
| `location.*` | 10 | Location panel |
| `loan.*` | 15 | Loan calculator |
| `timeline.*` | 5 | Timeline panel |
| `ai.*` | 15 | AI chatbot messages |
| `tour.*` | 35+ | Help tour steps (title + body per step) |

### 10.3 I18n API

```js
I18n.t('key', { var: value })  // Get translated string
I18n.get()                      // Get current language code
I18n.set('en')                  // Switch language
I18n.langs()                    // List available language codes
I18n.onChange(callback)         // Register change listener
I18n.applyStatic()              // Apply data-i18n to DOM elements
```

### 10.4 HTML Usage Pattern

```html
<span data-i18n="ui.bookNow">Đặt Lịch Xem</span>
```

`I18n.applyStatic()` replaces `textContent` of all elements with `data-i18n` attribute.

---

## 11. Design System

### 11.1 CSS Custom Properties (Design Tokens)

```css
:root {
  /* Colors */
  --bg:         #0a0d12;                    /* Page background */
  --fg:         #f5f1e8;                    /* Primary text */
  --accent:     #e8c089;                    /* Gold accent */
  --ok:         #7ad79a;                    /* Success / available */
  --danger:     #ff6b6b;                    /* Error / sold */
  --panel:      rgba(12, 16, 22, 0.62);    /* Panel background */
  --hairline:   rgba(245, 241, 232, 0.14); /* Subtle borders */

  /* Typography */
  --font-display: 'Cormorant Garamond', serif;
  --font-sans:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Spacing */
  --gap:  1rem;
  --gap2: 2rem;

  /* Border Radius */
  --r:  8px;
  --r2: 16px;

  /* Transition */
  --t:  0.25s ease;
}
```

### 11.2 Typography Scale

| Role | Font | Weight | Size |
|------|------|--------|------|
| Hero / Brand | Cormorant Garamond | 600 | 2.4rem |
| Heading 1 | Cormorant Garamond | 600 | 1.8rem |
| Heading 2 | Cormorant Garamond | 500 | 1.4rem |
| Body | Inter | 400 | 0.875rem |
| Label | Inter | 500 | 0.75rem |
| Price | Cormorant Garamond | 700 | 2rem |
| Code / Data | JetBrains Mono | 400 | 0.8rem |

### 11.3 Color Usage

| Context | Token | Value |
|---------|-------|-------|
| Background | `--bg` | `#0a0d12` |
| Text | `--fg` | `#f5f1e8` |
| Buttons, highlights | `--accent` | `#e8c089` |
| Available units | `--ok` | `#7ad79a` |
| Sold / Error | `--danger` | `#ff6b6b` |
| Panel glass | `--panel` | `rgba(12,16,22,0.62)` |
| Dividers | `--hairline` | `rgba(245,241,232,0.14)` |

### 11.4 Key Animations

| Animation | Usage |
|-----------|-------|
| `fadeIn` | Overlay appearance |
| `slideUp` | Toast notifications |
| `pulse` | Hotspot pins |
| `waveBar` | AI waveform bars |
| `spin` | Loading indicator |
| `glow` | Accent button hover |

---

## 12. Module Architecture

### 12.1 Module Dependency Graph

```
window.I18n         ← i18n.js
window.VR360        ← vr360.js
window.AiPanel      ← ai-panel.js (depends on I18n)
main.js             ← depends on: I18n, VR360, AiPanel
                       loads: data/project.json
mobile-stepper.js   ← independent
mobile-patch.js     ← depends on DOM built by main.js
```

### 12.2 main.js Function Map

| Function | Purpose |
|----------|---------|
| `boot()` | Application initialization entry point |
| `switchScene(id)` | Load VR scene + update hotspots |
| `buildNavPanel()` | Render left navigation accordion |
| `renderNavList()` | Filter/search menu items |
| `buildHotspots(arr)` | Create hotspot DOM elements |
| `updateHotspotPositions()` | rAF loop: project hotspots to screen |
| `buildProjectCard()` | Render right info card |
| `buildAmenities()` | Render amenity icon grid |
| `buildSiteMap()` | Render 2D map overlay |
| `buildGallery()` | Render photo gallery |
| `buildAmenitiesDetail()` | Render tabbed amenity panel |
| `buildLegalPanel()` | Render legal/trust panel |
| `buildLocationPanel()` | Render location + map |
| `buildFloorplanPanel()` | Render unit pricing table |
| `renderFpTable()` | Dynamic table with filters/sort |
| `openModalWithUnit(code, type)` | Pre-fill booking modal |
| `openModal()` / `closeModal()` | Modal visibility |
| `initLoanCalc()` | Loan calculator IIFE |
| `drawLoanChart()` | Mini amortization bar chart |
| `initContactForm()` | Form validation + submission |
| `startTour(items, idx)` | Begin help tour |
| `showTourStep()` | Render spotlight + tooltip |
| `startCountdown(deadline)` | Promo timer |
| `bindSmartHide()` | Auto-hide UI on VR drag |

### 12.3 Event Flow

```
DOMContentLoaded
  └── boot()
        ├── fetch('data/project.json')
        ├── I18n.set(defaultLang)
        ├── VR360.init(container)
        ├── VR360.loadScene(scenes[0])
        ├── buildNavPanel()
        ├── buildProjectCard()
        ├── buildSiteMap()
        ├── buildGallery()
        ├── buildAmenitiesDetail()
        ├── buildLegalPanel()
        ├── buildLocationPanel()
        ├── buildFloorplanPanel()
        ├── initLoanCalc()
        ├── initContactForm()
        ├── startCountdown(meta.promoDeadline)
        ├── bindSmartHide()
        ├── AiPanel.init()
        └── startUrgencyToasts()  [delayed 30s]
```

---

## 13. Known Limitations

| Issue | Impact | Mitigation |
|-------|--------|-----------|
| No backend | Forms not saved | Stub for CRM integration |
| Procedural panoramas | Not real project photos | Replace with actual 360° images |
| AI stub response | Not a real AI | Integrate OpenAI/Claude API |
| Voice: Firefox/Safari | STT not supported | Graceful fallback to text mode |
| No routing | No deep links to scenes | Add URL hash routing |
| No analytics | No visitor tracking | Add GA4 or similar |
| Session only | Language preference lost on close | Switch to localStorage |
| Single JSON | All data in one file | Split by section for performance |
| No CDN | Images served directly | Add CDN for production |
| No SSR | Poor initial SEO | Add meta tags + OG data |
