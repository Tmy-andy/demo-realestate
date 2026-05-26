/* ==========================================================
   VR Bridge — js/vr-bridge.js
   Cầu nối giữa trang chủ và 3DVista (giờ đã nhúng trực tiếp,
   không còn iframe). Bridge giữ nguyên API cũ để ai-panel /
   gemini-live không phải đổi.

   API:
     window.VRBridge.navigateTo(id)          — điều hướng (tdvPanoramaId hoặc sceneId)
     window.VRBridge.onSceneChange(callback)  — lắng nghe thay đổi cảnh
     window.VRBridge.setSceneMap(items)       — thiết lập map từ menu/scene items
     window.VRBridge.currentPanoId()          — lấy tdvPanoramaId hiện tại
   ========================================================== */

window.VRBridge = (function () {
  'use strict';

  var _currentPanoId    = null;
  var _panoToScene      = {};  /* tdvPanoramaId → sceneId */
  var _sceneToPano      = {};  /* sceneId → tdvPanoramaId */
  var _callbacks        = [];
  var _origGoToPanorama = null;

  /* ─── Thiết lập bản đồ scene từ menu items hoặc scenes ──
     Chấp nhận:
       1. Menu items: [{ id, tdvPanoramaId, label }, ...]
       2. Legacy scenes: [{ id, panoId }, ...]
  ─────────────────────────────────────────────────────────── */
  function setSceneMap(items) {
    if (!Array.isArray(items)) return;
    _panoToScene = {};
    _sceneToPano = {};
    items.forEach(function (s) {
      var panoId  = s.tdvPanoramaId || s.panoId;
      var sceneId = s.id;
      if (panoId && sceneId) {
        _panoToScene[panoId]  = sceneId;
        _sceneToPano[sceneId] = panoId;
      }
    });
  }

  /* ─── Gửi thông báo tới callbacks ───────────────────── */
  function _fire(panoId) {
    if (!panoId || panoId === _currentPanoId) return;
    _currentPanoId = panoId;
    var sceneId = _panoToScene[panoId] || null;
    _callbacks.forEach(function (cb) {
      try { cb({ nodeId: panoId, sceneId: sceneId }); } catch (_) { /* bỏ qua */ }
    });
  }

  /* ─── Điều hướng đến panorama theo tdvPanoramaId hoặc sceneId ── */
  function navigateTo(id) {
    if (!id) return;
    /* Nếu nhận sceneId → chuyển sang tdvPanoramaId */
    var panoId = _sceneToPano[id] || id;

    /* Dùng goToPanorama gốc của main.js để cập nhật UI đồng thời */
    var fn = _origGoToPanorama || window.goToPanorama;
    if (typeof fn === 'function') {
      fn(panoId);
      _fire(panoId);
      return;
    }

    /* Fallback: gọi thẳng host nếu main.js chưa sẵn sàng */
    if (typeof window.openPanoramaByName === 'function') {
      window.openPanoramaByName(panoId);
      _fire(panoId);
      return;
    }
    console.warn('[VRBridge] panorama host chưa sẵn sàng:', panoId);
  }

  /* ─── Đăng ký callback khi cảnh thay đổi ────────────── */
  function onSceneChange(cb) {
    if (typeof cb === 'function') _callbacks.push(cb);
  }

  function currentPanoId() { return _currentPanoId; }

  /* ─── Lắng nghe sự kiện panoramaChange từ main.js + panorama-host.js ──
     Cả hai đều dispatch CustomEvent 'panoramaChange'. Bridge gom về
     một nguồn sự kiện duy nhất cho consumer. ────────────────────────── */
  window.addEventListener('panoramaChange', function (e) {
    if (e && e.detail && e.detail.panoId) {
      _fire(e.detail.panoId);
    }
  });

  /* ─── Lưu tham chiếu gốc window.goToPanorama ──────────
     vr-bridge.js được load SAU main.js nên hàm đã tồn tại. ─ */
  if (typeof window.goToPanorama === 'function') {
    _origGoToPanorama = window.goToPanorama;
  }

  return {
    navigateTo:    navigateTo,
    onSceneChange: onSceneChange,
    setSceneMap:   setSceneMap,
    currentPanoId: currentPanoId,
  };
}());
