/* ==========================================================
   Panorama Host — js/panorama-host.js
   Nhúng trực tiếp 3DVista (TDV.Tour) vào trang chủ, KHÔNG iframe.
   Học theo CODE-SAMPLE-3DV/js/panorama.js nhưng đặt mọi đường
   dẫn tài nguyên 3DVista dưới prefix 'data/' để không xung đột
   với resource trang chủ.

   API expose ra window:
     openPanoramaByName(name)   — đổi panorama theo tdvPanoramaId
     getCurrentPanoramaName()    — id panorama hiện tại
     pauseTour() / resumeTour()
   Phát CustomEvent 'panoramaChange' mỗi khi đổi cảnh thật sự.
   ========================================================== */
(function () {
  'use strict';

  var DATA_DIR = 'data/';
  var VERSION  = '1779765962850';
  var devicesUrl = {
    mobile:  DATA_DIR + 'script_mobile.js',
    general: DATA_DIR + 'script_general.js'
  };

  var tour = null;
  var _currentName = null;

  window.openPanoramaByName    = openPanoramaByName;
  window.getCurrentPanoramaName = function () { return _currentName; };
  window.pauseTour  = function () { tour && tour.pause();  };
  window.resumeTour = function () { tour && tour.resume(); };
  window.__panoramaHostReady = false;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    if (typeof TDV === 'undefined' || !TDV.PlayerAPI) {
      console.warn('[panorama-host] TDV chưa sẵn sàng, thử lại sau 80ms');
      setTimeout(boot, 80);
      return;
    }

    /* Preload script device-specific để giảm thời gian khởi tạo */
    var deviceType = pickDeviceList();
    var url;
    for (var i = 0; i < deviceType.length; ++i) {
      if (deviceType[i] in devicesUrl) { url = devicesUrl[deviceType[i]]; break; }
    }
    if (typeof url === 'object') {
      var orient = TDV.PlayerAPI.getOrientation();
      if (orient in url) url = url[orient];
    }
    if (url) {
      var link = document.createElement('link');
      link.rel = 'preload';
      link.as  = 'script';
      link.href = url + '?v=' + VERSION;
      document.head.appendChild(link);
    }

    loadTour();
  }

  function pickDeviceList() {
    var list = ['general'];
    var d = TDV.PlayerAPI.device;
    if (d === TDV.PlayerAPI.DEVICE_IPAD) list.unshift('ipad');
    else if (d === TDV.PlayerAPI.DEVICE_OCULUS_QUEST_2) list.unshift('quest2');
    else if (d === TDV.PlayerAPI.DEVICE_OCULUS_QUEST_3) list.unshift('quest3');
    else if (d === TDV.PlayerAPI.DEVICE_PICO_4 ||
             d === TDV.PlayerAPI.DEVICE_PICO_G3 ||
             d === TDV.PlayerAPI.DEVICE_PICO_NEO2 ||
             d === TDV.PlayerAPI.DEVICE_PICO_NEO3) list.unshift('pico');
    else if (d === TDV.PlayerAPI.DEVICE_PICO_4_ULTRA) list.unshift('pico_ultra');
    else if (d === TDV.PlayerAPI.DEVICE_VIVE_FOCUS || d === TDV.PlayerAPI.DEVICE_PICO_G2) list.unshift('htc');
    else if (TDV.PlayerAPI.mobile) list.unshift('mobile');
    return list;
  }

  function loadTour() {
    if (tour) return;
    var viewer = document.getElementById('viewer');
    if (!viewer) {
      console.error('[panorama-host] thiếu #viewer trong DOM');
      return;
    }

    var settings = new TDV.PlayerSettings();
    settings.set(TDV.PlayerSettings.CONTAINER, viewer);
    settings.set(TDV.PlayerSettings.WEBVR_POLYFILL_URL, DATA_DIR + 'lib/WebVRPolyfill.js?v=' + VERSION);
    settings.set(TDV.PlayerSettings.HLS_URL,           DATA_DIR + 'lib/Hls.js?v=' + VERSION);
    settings.set(TDV.PlayerSettings.QUERY_STRING_PARAMETERS, 'v=' + VERSION);
    /* SCRIPT_URL: tdvplayer dùng đường dẫn này làm base resolve mọi
       tài nguyên (media/, locale/, skin/, ...) bên trong tour data. */
    settings.set(TDV.PlayerSettings.SCRIPT_URL, DATA_DIR + 'script_general.js');

    tour = new TDV.Tour(settings, devicesUrl);
    tour.bind(TDV.Tour.EVENT_TOUR_INITIALIZED, onInit);
    tour.bind(TDV.Tour.EVENT_TOUR_LOADED, onLoaded);
    tour.load();
  }

  function onInit() {
    window.__panoramaHostReady = true;
    window.dispatchEvent(new CustomEvent('tourInitialized'));
  }

  function onLoaded() {
    var playList = getMainPlayList();
    if (playList && playList.bind) {
      playList.bind('change', onPlayListChange);
      onPlayListChange();
    }
    window.dispatchEvent(new CustomEvent('tourLoaded'));
  }

  function onPlayListChange() {
    var name = currentNameFromPlayList();
    if (!name || name === _currentName) return;
    _currentName = name;
    // Chuyển pano-1 → pano-01 (3DVista v2026 bỏ leading zero, app dùng pano-01)
    var appName = name.replace(/^(pano-)(\d)$/, '$10$2');
    window.dispatchEvent(new CustomEvent('panoramaChange', {
      detail: { panoId: appName }
    }));
  }

  function currentNameFromPlayList() {
    var pl = getMainPlayList();
    if (!pl || !pl.get) return null;
    var items = pl.get('items') || [];
    var idx = pl.get('selectedIndex');
    if (typeof idx !== 'number' || idx < 0 || !items[idx]) return null;
    var media = items[idx].get && items[idx].get('media');
    if (!media) return null;
    var data = media.get && media.get('data');
    var name = (data && (data.label || data.name)) || (media.get && media.get('id')) || null;
    return name;
  }

  function getMainPlayList() {
    if (!tour || !tour.player || !tour.player.getById) return null;
    var rp = tour.player.getById('rootPlayer');
    if (!rp) return null;
    var mainList = rp.get && rp.get('mainPlayList');
    if (mainList) return mainList;
    var all = tour.player.getByClassName && tour.player.getByClassName('PlayList');
    return (all && all[0]) || null;
  }

  function openPanoramaByName(name) {
    if (!name) return false;
    // Normalize pano-01 → pano-1 (3DVista v2026 dùng label không có leading zero)
    name = name.replace(/^(pano-)0(\d)$/, '$1$2');
    if (!tour) { console.warn('[panorama-host] tour chưa sẵn sàng:', name); return false; }
    try {
      tour.setMediaByName(name);
      return true;
    } catch (e) {
      console.error('[panorama-host] setMediaByName lỗi:', e);
      return false;
    }
  }
})();
