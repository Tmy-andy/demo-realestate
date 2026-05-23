/* ============================================
   AURORA HEIGHTS — I18N
   --------------------------------------------
   Ngôn ngữ + bản dịch nạp từ backend:
     GET {API_BASE}/api/i18n   ->  { langs, dict, dynamic }
   (bảng languages / translation_keys / project_translations trong CSDL).

   Nguồn nạp DB: data/i18n-source.json  ->  npm run seed:i18n

   FALLBACK khi backend tắt: chỉ nhúng sẵn bản TIẾNG VIỆT (DICT_VI) — site
   vẫn hiển thị đầy đủ tiếng Việt. Các ngôn ngữ khác cần backend.
   Khi cập nhật chuỗi tiếng Việt: sửa data/i18n-source.json rồi đồng bộ
   khối DICT_VI dưới đây (giữ cho fallback khớp CSDL).
   ============================================ */
window.I18n = (() => {
  // Cờ emoji theo mã ngôn ngữ — dữ liệu trình bày thuần, CSDL không lưu.
  const FLAGS = { vi: "🇻🇳", en: "🇬🇧", zh: "🇨🇳", ko: "🇰🇷", ja: "🇯🇵" };

  // --- FALLBACK tiếng Việt (dùng khi /api/i18n không phản hồi) ----------
  const DICT_VI = {
    "ui.loaderSub": "Đang khởi tạo không gian 360°",
    "ui.sitemap": "Bản đồ 2D",
    "ui.sitemapTitle": "Bản đồ 2D",
    "ui.gallery": "Thư viện",
    "ui.galleryTitle": "Thư viện ảnh",
    "ui.book": "Đặt lịch",
    "ui.priceFrom": "Giá từ",
    "ui.viewPricePromo": "Xem bảng giá & ưu đãi",
    "ui.downloadBrochure": "Tải brochure PDF",
    "ui.dragTip": "Kéo để xoay · Cuộn để zoom",
    "ui.search": "Tìm kiếm…",
    "ui.collapse": "Thu gọn",
    "ui.expand": "Mở rộng thông tin dự án",
    "ui.expandNav": "Mở bảng điều hướng",
    "ui.showUI": "Hiện giao diện",
    "ui.aiChat": "Chat với trợ lý AI",
    "ui.skip": "Bỏ qua",
    "ui.continueHint": "Click bất kỳ đâu để tiếp tục →",
    "ui.step": "Bước {n} / {total}",
    "ui.viewIn360": "Xem 360°",
    "ui.nearbyAmenity": "Tiện ích lân cận",
    "ui.noResults": "Không tìm thấy mục phù hợp",
    "ui.units": "căn",
    "ui.rotate": "Tự xoay",
    "ui.zoomIn": "Phóng to",
    "ui.zoomOut": "Thu nhỏ",
    "ui.fullscreen": "Toàn màn hình",
    "ui.help": "Hướng dẫn sử dụng",
    "ui.language": "Ngôn ngữ",
    "modal.eyebrow": "BẢNG GIÁ & CĂN HỘ CÒN TRỐNG",
    "modal.title": "Tháp A — Mở bán giai đoạn 2",
    "modal.desc": "Quỹ căn hiện hữu cập nhật theo thời gian thực. Ưu đãi giai đoạn 2: chiết khấu 8% cho thanh toán sớm, cam kết thuê lại 7%/năm trong 24 tháng đầu tiên.",
    "modal.col.code": "Mã căn",
    "modal.col.type": "Loại",
    "modal.col.area": "Diện tích",
    "modal.col.price": "Giá từ",
    "modal.col.avail": "Còn lại",
    "modal.contactTitle": "Để chúng tôi liên hệ lại",
    "modal.name": "Họ & tên",
    "modal.namePh": "Nguyễn Văn A",
    "modal.phone": "Số điện thoại",
    "modal.phonePh": "09xx xxx xxx",
    "modal.interest": "Loại căn quan tâm",
    "modal.opt.2br": "2 phòng ngủ",
    "modal.opt.2br1": "2 phòng ngủ +1",
    "modal.opt.3br": "3 phòng ngủ",
    "modal.opt.duplex": "Duplex / Penthouse",
    "modal.note": "Ghi chú",
    "modal.notePh": "Tôi muốn được tư vấn vào cuối tuần…",
    "modal.submit": "Gửi yêu cầu tư vấn",
    "modal.timeline": "Tiến độ dự án",
    "sitemap.eyebrow": "Mặt bằng tổng thể",
    "sitemap.title": "Bản đồ thiết kế 2D",
    "sitemap.desc": "Bấm vào các điểm trên bản đồ để vào không gian 360° tương ứng",
    "gallery.eyebrow": "Thư viện hình ảnh",
    "gallery.title": "Khám phá Vinhomes Hai Van Bay",
    "ai.title": "Trợ lý Vinhomes Hai Van Bay",
    "ai.active": "Đang hoạt động",
    "ai.listening": "Đang lắng nghe…",
    "ai.thinking": "Đang suy nghĩ…",
    "ai.speaking": "Đang trả lời…",
    "ai.placeholder": "Nhập câu hỏi…",
    "ai.close": "Đóng",
    "ai.noSR": "Trình duyệt chưa hỗ trợ nhận dạng giọng nói. Vui lòng dùng Chrome hoặc Edge.",
    "ai.micDenied": "Bạn cần cho phép truy cập micro để dùng tính năng trò chuyện bằng giọng nói.",
    "ai.networkErr": "Không thể kết nối dịch vụ nhận dạng giọng nói. Vui lòng thử lại sau.",
    "ai.replyStub": "Cảm ơn câu hỏi của bạn: \"{q}\". Đây là phản hồi mẫu — tích hợp LLM thật sẽ thay thế hàm generateReply().",
    "tour.brand": "Logo dự án — quay về tổng quan.",
    "tour.sitemap": "Bản đồ thiết kế 2D — các điểm chạm dẫn vào không gian 360°.",
    "tour.masterplan": "Quy hoạch tổng thể — xem mặt bằng phân khu toàn dự án.",
    "tour.properties": "Bất động sản — danh sách sản phẩm, căn hộ đang mở bán.",
    "tour.amenities": "Tiện ích dự án — khám phá tiện ích nội/ngoại khu.",
    "tour.legal": "Pháp lý & Uy tín — hồ sơ pháp lý, ngân hàng bảo lãnh, đánh giá cư dân.",
    "tour.location": "Vị trí dự án — bản đồ và các tiện ích xung quanh.",
    "tour.timeline": "Tiến độ dự án — xem các mốc thi công và bàn giao.",
    "tour.gallery": "Thư viện ảnh dự án.",
    "tour.resources": "Tài liệu dự án — brochure, bảng giá, mặt bằng để tải về.",
    "tour.book": "Đặt lịch tham quan và xem bảng giá chi tiết.",
    "tour.ctrlgroup": "Cụm điều khiển — tự xoay, zoom, toàn màn hình, chọn ngôn ngữ và mở lại hướng dẫn.",
    "tour.rotate": "Bật/tắt tự xoay panorama 360°.",
    "tour.zoomIn": "Phóng to góc nhìn.",
    "tour.zoomOut": "Thu nhỏ góc nhìn.",
    "tour.fullscreen": "Bật chế độ toàn màn hình.",
    "tour.lang": "Đa ngôn ngữ — chọn ngôn ngữ hiển thị (Việt, Anh, Trung, Hàn, Nhật).",
    "tour.help": "Mở lại hướng dẫn này bất cứ lúc nào.",
    "tour.nav": "Bảng điều hướng trái — chứa thông tin scene và danh sách các nhóm.",
    "tour.search": "Tìm kiếm nhanh trong toàn bộ danh sách.",
    "tour.list": "Các nhóm: Tổng quan, Tiện ích nội/ngoại khu, Mặt bằng, Căn hộ. Click vào tiêu đề để mở/đóng nhóm, click vào mục con để chuyển không gian 360°.",
    "tour.collapse": "Thu gọn bảng điều hướng để xem panorama rộng hơn.",
    "tour.project": "Thông tin dự án: giá, trạng thái, các chỉ số chính.",
    "tour.pcCollapse": "Thu gọn bảng thông tin dự án bên phải.",
    "tour.infoFab": "Mở lại bảng thông tin dự án khi đã thu gọn.",
    "tour.bot": "Trợ lý AI — chat text hoặc trò chuyện bằng giọng nói.",
    "tour.restore": "Khi giao diện bị ẩn (do kéo xoay 360°), bấm nút này để hiện lại.",
    "tour.hotspot": "Hotspot trong khung 360° — click để vào không gian khác hoặc xem mô tả.",
    "ui.vrExperience": "VR360 EXPERIENCE",
    "ui.expired": "Hết ưu đãi",
    "ui.noFilterResults": "Không tìm thấy căn phù hợp với bộ lọc",
    "modal.opt.studio": "Studio",
    "modal.selectType": "— Chọn loại căn —",
    "modal.removeUnit": "Xoá",
    "modal.errRequired": "Vui lòng điền Họ tên và Số điện thoại.",
    "modal.errPhone": "Số điện thoại chưa đúng định dạng (VD: 0901 234 567).",
    "modal.sending": "Đang gửi…",
    "modal.fieldEmail": "Email",
    "modal.fieldEmailOpt": "(tuỳ chọn)",
    "modal.fieldZalo": "Zalo",
    "modal.fieldZaloNote": "(nếu khác SĐT)",
    "modal.fieldCodeInterest": "Mã căn quan tâm",
    "modal.fieldBudget": "Ngân sách dự kiến",
    "modal.budget.under5": "Dưới 5 tỷ",
    "modal.budget.5to8": "5 – 8 tỷ",
    "modal.budget.8to12": "8 – 12 tỷ",
    "modal.budget.over12": "Trên 12 tỷ",
    "modal.fieldPurpose": "Mục đích mua",
    "modal.purpose.live": "Ở thực",
    "modal.purpose.invest": "Đầu tư",
    "modal.purpose.both": "Cả hai",
    "modal.fieldTime": "Thời gian muốn xem",
    "modal.time.weekend": "Cuối tuần",
    "modal.time.nextweek": "Tuần tới",
    "modal.time.flexible": "Linh hoạt",
    "modal.consentZalo": "Đồng ý nhận thông tin qua <strong>Zalo</strong>",
    "modal.consentSms": "Đồng ý nhận thông tin qua <strong>SMS</strong>",
    "modal.successTitle": "Đã gửi thành công!",
    "modal.successSub": "Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.",
    "modal.successZalo": "Chat Zalo ngay",
    "modal.successReset": "Gửi yêu cầu khác",
    "stepper.title": "Đặt lịch tham quan",
    "stepper.step1": "Chọn căn",
    "stepper.step2": "Thông tin",
    "stepper.step3": "Xác nhận",
    "stepper.sectionTitle": "Căn hộ quan tâm",
    "stepper.skipUnit": "Chưa chọn căn cụ thể →",
    "stepper.filterAll": "Tất cả",
    "stepper.direction": "Hướng",
    "stepper.floor": "Tầng",
    "stepper.next": "Tiếp theo",
    "stepper.submit": "Gửi yêu cầu",
    "stepper.back": "Quay lại",
    "stepper.confirmTitle": "Kiểm tra lại thông tin",
    "stepper.confirmAction": "Nhấn <strong style=\"color:var(--accent)\">Gửi yêu cầu</strong> để hoàn tất.<br/>Chúng tôi sẽ liên hệ trong <strong style=\"color:var(--fg)\">30 phút</strong>.",
    "stepper.successTitle": "Đã gửi thành công!",
    "stepper.successSub": "Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.",
    "stepper.successZalo": "Chat Zalo ngay",
    "stepper.successReset": "Gửi yêu cầu khác",
    "stepper.confirm.unitSelected": "Căn đã chọn",
    "stepper.confirm.contactInfo": "Thông tin liên hệ",
    "stepper.confirm.request": "Yêu cầu",
    "stepper.confirm.name": "Họ tên",
    "stepper.confirm.phone": "Điện thoại",
    "stepper.confirm.budget": "Ngân sách",
    "stepper.confirm.purpose": "Mục đích",
    "stepper.confirm.time": "Thời gian xem",
    "stepper.confirm.note": "Ghi chú",
    "stepper.confirm.contacts": "Nhận tin",
    "ui.masterplan": "Masterplan",
    "ui.properties": "Bất động sản",
    "ui.amenities": "Tiện ích",
    "ui.subdivision": "Phân khu",
    "ui.subdivisions": "Phân khu",
    "ui.allTab": "Tất cả",
    "ui.filtering": "Đang lọc",
    "ui.filteringBy": "Đang lọc theo",
    "ui.overviewMode": "Tổng quan — hiển thị đầy đủ",
    "ui.projectContent": "Nội dung dự án",
    "ui.noContent": "Chưa có nội dung",
    "ui.legal": "Pháp lý",
    "ui.location": "Vị trí",
    "ui.timeline": "Tiến độ",
    "ui.resources": "Tài liệu",
    "ui.menu": "Menu",
    "ui.projectInfo": "Thông tin dự án",
    "ui.openProjectInfo": "Mở thông tin dự án",
    "ui.masterplanTitle": "Quy hoạch tổng thể",
    "ui.propertiesTitle": "Bất động sản",
    "ui.amenitiesTitle": "Tiện ích dự án",
    "ui.legalTitle": "Pháp lý & Uy tín",
    "ui.locationTitle": "Vị trí dự án",
    "ui.timelineTitle": "Tiến độ dự án",
    "ui.resourcesTitle": "Tài liệu dự án",
    "ui.close": "Đóng",
    "amen.eyebrow": "Tiện ích Vinhomes Hai Van Bay",
    "amen.title": "Hệ thống tiện ích đẳng cấp",
    "amen.tab.noiKhu": "Nội khu",
    "amen.tab.skyAmenity": "Cao tầng",
    "amen.tab.dichVu": "Dịch vụ",
    "amen.tab.haTang": "Hạ tầng",
    "legal.eyebrow": "Pháp lý & Uy tín",
    "legal.title": "Minh bạch — Bảo đảm — Tin cậy",
    "legal.docs": "Hồ sơ pháp lý",
    "legal.reviews": "Cư dân nói gì",
    "location.eyebrow": "Vị trí dự án",
    "location.title": "Kết nối hoàn hảo",
    "location.cat.all": "Tất cả",
    "location.cat.school": "🏫 Trường học",
    "location.cat.hospital": "🏥 Bệnh viện",
    "location.cat.metro": "🚇 Metro",
    "location.cat.mall": "🛍 TTTM",
    "location.cat.airport": "✈ Sân bay",
    "timeline.eyebrow": "Tiến độ xây dựng",
    "timeline.title": "Cập nhật thực địa",
    "resources.eyebrow": "Tài liệu",
    "resources.title": "Brochure, Bảng giá, Bộ nhận diện",
    "props.eyebrow": "Sản phẩm dự án",
    "props.title": "Bất động sản đang mở bán",
    "props.searchPh": "Tìm theo mã căn, tên sản phẩm…",
    "props.filter": "Lọc",
    "props.filterTitle": "Bộ lọc",
    "props.filterClose": "Đóng bộ lọc",
    "props.filterReset": "Xóa bộ lọc",
    "pd.back": "‹ Danh sách",
    "fpv.title": "Mặt bằng",
    "fpv.zoomIn": "Phóng to",
    "fpv.zoomOut": "Thu nhỏ",
    "fpv.zoomReset": "Đặt lại",
    "fpv.hint": "Cuộn để phóng to · Kéo để di chuyển",
    "mpf.title": "Bộ lọc Masterplan",
    "mpf.reset": "Đặt lại",
    "mpf.apply": "Áp dụng",
    "mp.close": "Đóng",
    "modal.filter.unitType": "Loại căn",
    "modal.filter.floorGroup": "Nhóm tầng",
    "modal.filter.status": "Trạng thái",
    "modal.filter.reset": "Xóa lọc",
    "modal.floor.all": "Tất cả",
    "modal.floor.low": "Thấp (1–15)",
    "modal.floor.mid": "Trung (16–30)",
    "modal.floor.high": "Cao (31+)",
    "modal.status.all": "Tất cả",
    "modal.status.available": "Còn trống",
    "modal.status.holding": "Đang giữ",
    "modal.status.sold": "Đã bán",
    "modal.col.floor": "Tầng",
    "modal.col.area2": "DT (m²)",
    "modal.col.dir": "Hướng",
    "modal.col.ppm": "Giá/m²",
    "modal.col.st": "TT",
    "modal.col.price2": "Giá",
  };

  // DICT khởi tạo với fallback tiếng Việt; loadFromDB() bổ sung en/zh/ko/ja
  // và ghi đè vi bằng dữ liệu CSDL nếu có.
  const DICT = { vi: Object.assign({}, DICT_VI) };
  // DYNAMIC: key = chuỗi tiếng Việt gốc. Khi current="vi", tr() trả nguyên
  // chuỗi gốc nên fallback tiếng Việt KHÔNG cần dữ liệu — để rỗng.
  const DYNAMIC = {};    // { "<chuỗi vi>": { en:"...", zh:"..." } }
  // langList tối thiểu: chỉ tiếng Việt; loadFromDB() thay bằng danh sách CSDL.
  let langList = [{ code: "vi", label: "Tiếng Việt", flag: FLAGS.vi }];

  let current = localStorage.getItem("aurora_lang") || "vi";
  const subs = [];

  // --- Nạp ngôn ngữ + chuỗi dịch từ backend (PostgreSQL) ----------------
  async function loadFromDB() {
    try {
      const base =
        (window.APP_CONFIG && window.APP_CONFIG.API_BASE) ||
        ((window.DataSource && window.DataSource.API_URL || "")
          .replace(/\/api\/project$/, ""));
      const res = await fetch(base + "/api/i18n", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      if (Array.isArray(data.langs) && data.langs.length) {
        langList = data.langs.map(l => ({
          code: l.code,
          label: l.name,
          flag: FLAGS[l.code] || "",
        }));
      }
      if (data.dict && typeof data.dict === "object") {
        for (const code of Object.keys(data.dict)) {
          DICT[code] = Object.assign(DICT[code] || {}, data.dict[code]);
        }
      }
      if (data.dynamic && typeof data.dynamic === "object") {
        for (const k of Object.keys(data.dynamic)) {
          DYNAMIC[k] = Object.assign(DYNAMIC[k] || {}, data.dynamic[k]);
        }
      }
      console.info("[i18n] Ngôn ngữ + chuỗi dịch nạp từ API PostgreSQL");
    } catch (e) {
      console.error("[i18n] Không nạp được /api/i18n (" + e.message + ") — cần bật backend");
    }

    // Ngôn ngữ đang chọn không có dữ liệu (backend tắt + đã lưu en/zh/ko/ja)
    // -> lùi về tiếng Việt: fallback DICT_VI luôn hiển thị đầy đủ.
    if (!DICT[current]) {
      current = "vi";
      document.documentElement.setAttribute("lang", current);
    }
    applyStatic();
    subs.forEach(fn => { try { fn(current); } catch (e) {} });
    try { window.dispatchEvent(new CustomEvent("langchange", { detail: { code: current } })); } catch (e) {}
  }

  function t(key, vars) {
    const dict = DICT[current] || DICT.vi || {};
    let str = dict[key] ?? (DICT.vi && DICT.vi[key]) ?? key;
    if (vars) Object.keys(vars).forEach(k => { str = str.replace("{" + k + "}", vars[k]); });
    return str;
  }

  // Dịch chuỗi tiếng Việt động sang ngôn ngữ hiện tại; không có -> trả nguyên gốc.
  function tr(viString) {
    if (current === "vi" || !viString) return viString;
    const entry = DYNAMIC[viString];
    if (entry && entry[current]) return entry[current];
    return viString;
  }

  function get() { return current; }
  function langs() { return langList.slice(); }

  function set(code) {
    if (code !== current && !langList.some(l => l.code === code)) return;
    current = code;
    try { localStorage.setItem("aurora_lang", code); } catch (e) {}
    document.documentElement.setAttribute("lang", code);
    applyStatic();
    subs.forEach(fn => { try { fn(code); } catch (e) {} });
    try { window.dispatchEvent(new CustomEvent("langchange", { detail: { code } })); } catch (e) {}
  }

  function onChange(fn) { subs.push(fn); }

  function applyStatic() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      el.innerHTML = t(key);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      el.setAttribute("title", t(key));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.setAttribute("placeholder", t(key));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const key = el.getAttribute("data-i18n-aria");
      el.setAttribute("aria-label", t(key));
    });
  }

  document.documentElement.setAttribute("lang", current);

  // ready: promise hoàn tất khi đã nạp xong chuỗi dịch từ CSDL.
  // Module khác NÊN `await I18n.ready` trước khi render nội dung dịch.
  let ready;
  if (document.readyState === "loading") {
    ready = new Promise(resolve => {
      document.addEventListener("DOMContentLoaded", () => loadFromDB().then(resolve));
    });
  } else {
    ready = loadFromDB();
  }

  return { t, tr, get, set, langs, onChange, applyStatic, get ready() { return ready; } };
})();
