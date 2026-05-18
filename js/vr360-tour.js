/* ============================================
   VR360 TOUR LOADER
   Nhúng tour 3DVista từ thư mục data/ vào #vr-stage,
   vô hiệu hoá panorama placeholder (VR360.*) và ẩn
   hotspot-layer + nhóm nút zoom/rotate của landing.

   Quy ước: tour 3DVista được xuất ra thư mục data/
   với entry point là data/index.htm. Khi đổi dự án,
   chỉ cần copy đè toàn bộ data/ — file này không
   cần sửa.
   ============================================ */
(function () {
  const TOUR_ENTRY = "data/index.htm";

  function disablePlaceholderVR() {
    if (typeof window.VR360 !== "object" || !window.VR360) return;
    const noop = () => {};
    const noopPos = () => ({ x: 0, y: 0, visible: false });
    window.VR360.init = noop;
    window.VR360.loadScene = noop;
    window.VR360.setAutoRotate = noop;
    window.VR360.zoomBy = noop;
    window.VR360.lookAt = noop;
    window.VR360.getYaw = () => 0;
    window.VR360.projectHotspot = noopPos;
    window.VR360.generateThumb = () => document.createElement("canvas");
  }

  function mountTour() {
    const stage = document.getElementById("vr-stage");
    if (!stage) return;

    // Dọn canvas Three.js (nếu main.js đã kịp init trước)
    stage.innerHTML = "";
    stage.style.overflow = "hidden";

    const iframe = document.createElement("iframe");
    iframe.id = "vr-tour-frame";
    iframe.src = TOUR_ENTRY;
    iframe.title = "VR360 Tour";
    iframe.allow = "xr-spatial-tracking; gyroscope; accelerometer; fullscreen; autoplay";
    iframe.allowFullscreen = true;
    iframe.setAttribute("frameborder", "0");
    Object.assign(iframe.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      border: "0",
      display: "block",
      background: "#000"
    });
    stage.appendChild(iframe);
  }

  function hideLegacyVRControls() {
    const hotspots = document.getElementById("hotspot-layer");
    if (hotspots) hotspots.style.display = "none";

    const ctrlGroup = document.getElementById("tb-ctrlgroup");
    if (ctrlGroup) ctrlGroup.style.display = "none";

    const popup = document.getElementById("hotspot-popup");
    if (popup) popup.style.display = "none";
  }

  function start() {
    disablePlaceholderVR();
    mountTour();
    hideLegacyVRControls();
  }

  // Chạy sau main.js để chắc chắn VR360 đã được khai báo và
  // boot() đã có cơ hội gắn các handler. Dùng cả DOMContentLoaded
  // + load để an toàn với thứ tự script.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
