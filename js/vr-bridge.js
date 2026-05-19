/* ==========================================================
   VR Bridge — js/vr-bridge.js
   Cầu nối giữa trang chủ và iframe 3DVista.

   API:
     window.VRBridge.navigateTo(id)          — điều hướng (tdvPanoramaId hoặc sceneId)
     window.VRBridge.onSceneChange(callback)  — lắng nghe thay đổi cảnh
     window.VRBridge.setSceneMap(items)       — thiết lập map từ menu/scene items
     window.VRBridge.currentPanoId()          — lấy tdvPanoramaId hiện tại
   ========================================================== */

window.VRBridge = (function () {
  'use strict';

  var _currentPanoId     = null;
  var _panoToScene       = {};  /* tdvPanoramaId → sceneId */
  var _sceneToPano       = {};  /* sceneId → tdvPanoramaId */
  var _callbacks         = [];
  var _origGoToPanorama  = null; /* tham chiếu gốc của window.goToPanorama */

  /* ─── Lấy iframe 3DVista ──────────────────────────────── */
  function getFrame() {
    return document.getElementById('vr-iframe');
  }

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

    /* Fallback: gửi trực tiếp đến iframe nếu main.js chưa sẵn sàng */
    var frame = getFrame();
    if (!frame || !frame.contentWindow) {
      console.warn('[VRBridge] iframe not ready:', panoId);
      return;
    }
    try {
      frame.contentWindow.postMessage({ type: 'goToPanorama', name: panoId }, '*');
      _fire(panoId);
    } catch (e) {
      console.error('[VRBridge] postMessage error:', e);
    }
  }

  /* ─── Đăng ký callback khi cảnh thay đổi ────────────── */
  function onSceneChange(cb) {
    if (typeof cb === 'function') _callbacks.push(cb);
  }

  function currentPanoId() { return _currentPanoId; }

  /* ─── Lắng nghe sự kiện panoramaChange từ main.js ──────
     main.js dispatch 'panoramaChange' mỗi khi goToPanorama() được gọi
     (cả từ menu UI lẫn từ VRBridge.navigateTo).
  ─────────────────────────────────────────────────────── */
  window.addEventListener('panoramaChange', function (e) {
    if (e && e.detail && e.detail.panoId) {
      _fire(e.detail.panoId);
    }
  });

  /* ─── Lưu tham chiếu gốc window.goToPanorama ──────────
     Thực hiện ngay sau khi main.js gán window.goToPanorama.
     vr-bridge.js được load SAU main.js nên hàm đã tồn tại.
  ─────────────────────────────────────────────────────── */
  if (typeof window.goToPanorama === 'function') {
    _origGoToPanorama = window.goToPanorama;
  }

  /* ─── Xử lý message từ iframe 3DVista (nếu có) ─────── */
  window.addEventListener('message', function (e) {
    if (!e.data) return;
    var msg;
    try {
      msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    } catch (_) { return; }

    var panoId =
      msg.panoramaId ||
      msg.panorama   ||
      (msg.data && (msg.data.panoramaId || msg.data.label)) ||
      null;

    if (!panoId || typeof panoId !== 'string') return;

    /* Hỗ trợ cả hai format: "pano-01" và "panorama_3Fxx..." */
    if (!/^pano-\d/.test(panoId) && !panoId.startsWith('panorama_')) return;

    _fire(panoId.replace(/_0$/, ''));
  });

  return {
    navigateTo:    navigateTo,
    onSceneChange: onSceneChange,
    setSceneMap:   setSceneMap,
    currentPanoId: currentPanoId,
  };
}());
