/* ============================================
   VR360 PANORAMA VIEWER
   Uses Three.js with procedurally generated
   equirectangular canvas textures (no external assets).
   ============================================ */

const VR360 = (() => {
  let scene, camera, renderer, sphere;
  let lon = 0, lat = 0;
  let targetLon = 0, targetLat = 0;
  let isUserInteracting = false;
  let onPointerDownLon = 0, onPointerDownLat = 0;
  let onPointerDownX = 0, onPointerDownY = 0;
  let autoRotate = false;
  let fov = 75;
  let targetFov = 75;
  let currentSceneData = null;
  let onYawChange = null;

  function init(container, opts = {}) {
    onYawChange = opts.onYawChange || null;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1100);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: null });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    bindEvents(container);
    window.addEventListener("resize", () => onResize(container));
    animate();
  }

  function bindEvents(container) {
    container.addEventListener("pointerdown", (e) => {
      isUserInteracting = true;
      onPointerDownX = e.clientX;
      onPointerDownY = e.clientY;
      onPointerDownLon = targetLon;
      onPointerDownLat = targetLat;
    });
    window.addEventListener("pointermove", (e) => {
      if (!isUserInteracting) return;
      targetLon = (onPointerDownX - e.clientX) * 0.18 + onPointerDownLon;
      targetLat = (e.clientY - onPointerDownY) * 0.18 + onPointerDownLat;
    });
    window.addEventListener("pointerup", () => { isUserInteracting = false; });
    container.addEventListener("wheel", (e) => {
      e.preventDefault();
      targetFov += e.deltaY * 0.05;
      targetFov = Math.max(40, Math.min(95, targetFov));
    }, { passive: false });
  }

  function onResize(container) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate && !isUserInteracting) targetLon += 0.04;
    lon += (targetLon - lon) * 0.08;
    lat += (targetLat - lat) * 0.08;
    fov += (targetFov - fov) * 0.08;
    lat = Math.max(-70, Math.min(70, lat));
    camera.fov = fov;
    camera.updateProjectionMatrix();

    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);
    const target = new THREE.Vector3(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta)
    );
    camera.lookAt(target);
    renderer.render(scene, camera);

    if (onYawChange) onYawChange(lon);
  }

  function loadScene(sceneData) {
    currentSceneData = sceneData;
    const tex = generatePanoramaTexture(sceneData);
    sphere.material.map = tex;
    sphere.material.needsUpdate = true;
  }

  function setAutoRotate(v) { autoRotate = v; }
  function zoomBy(delta) { targetFov = Math.max(40, Math.min(95, targetFov + delta)); }

  function projectHotspot(hsX, hsY) {
    // Convert 0..1 hotspot coords (interpreted on the EQUIRECT panorama)
    // to screen coords based on current camera.
    // hsX: 0..1 -> longitude 0..360
    // hsY: 0..1 -> latitude 90..-90
    const hsLon = hsX * 360;
    const hsLat = 90 - hsY * 180;
    const phi = THREE.MathUtils.degToRad(90 - hsLat);
    const theta = THREE.MathUtils.degToRad(hsLon);
    const pos = new THREE.Vector3(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta)
    );
    const projected = pos.clone().project(camera);
    // Behind camera => projected.z > 1
    const onScreen = projected.z < 1;
    return {
      x: (projected.x + 1) / 2 * renderer.domElement.clientWidth,
      y: (-projected.y + 1) / 2 * renderer.domElement.clientHeight,
      visible: onScreen
    };
  }

  function getYaw() { return lon; }
  function lookAt(hsX, hsY) {
    targetLon = hsX * 360;
    targetLat = 90 - hsY * 180;
  }

  // ================== Procedural panorama generator ==================
  function generatePanoramaTexture(data) {
    const W = 2048, H = 1024;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");

    const [c1, c2, c3, c4] = data.palette;
    const horizonY = (data.horizonY || 0.5) * H;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, c1);
    skyGrad.addColorStop(0.7, c2);
    skyGrad.addColorStop(1, c3);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, horizonY);

    // Ground gradient
    const groundGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    groundGrad.addColorStop(0, c3);
    groundGrad.addColorStop(0.5, c2);
    groundGrad.addColorStop(1, c1);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // Scene-specific decoration
    drawSceneDecor(ctx, W, H, horizonY, data);

    // Soft horizon glow
    const glow = ctx.createLinearGradient(0, horizonY - 80, 0, horizonY + 80);
    glow.addColorStop(0, "rgba(255,255,255,0)");
    glow.addColorStop(0.5, hexToRgba(c4, 0.35));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, horizonY - 80, W, 160);

    // Grain / noise
    addGrain(ctx, W, H);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }

  function drawSceneDecor(ctx, W, H, horizonY, data) {
    const id = data.id;
    const [c1, c2, c3, c4] = data.palette;

    if (id === "sky-lounge" || id === "aerial") {
      // City skyline silhouette
      const layers = [
        { y: horizonY - 6, h: 100, color: hexToRgba(c2, 0.55), count: 50, maxH: 80 },
        { y: horizonY - 4, h: 140, color: hexToRgba(c1, 0.7), count: 38, maxH: 120 },
        { y: horizonY - 2, h: 200, color: hexToRgba(c1, 0.95), count: 28, maxH: 180 }
      ];
      layers.forEach(L => drawSkyline(ctx, W, L));
      // Window lights
      ctx.fillStyle = hexToRgba(c4, 0.85);
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * W;
        const y = horizonY + Math.random() * 180 - 180;
        if (y > horizonY) continue;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      // Sun / moon
      const sunX = W * 0.72, sunY = horizonY - 80;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180);
      sunGrad.addColorStop(0, hexToRgba(c4, 0.9));
      sunGrad.addColorStop(0.3, hexToRgba(c3, 0.4));
      sunGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sunGrad;
      ctx.fillRect(sunX - 200, sunY - 200, 400, 400);
      ctx.fillStyle = hexToRgba(c4, 1);
      ctx.beginPath();
      ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === "penthouse" || id === "master-bedroom") {
      // Interior: floor + walls
      ctx.fillStyle = hexToRgba(c2, 0.4);
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // Wall accents (vertical bands)
      const bands = 10;
      for (let i = 0; i < bands; i++) {
        const x = (i / bands) * W;
        ctx.fillStyle = hexToRgba(c1, 0.18 + Math.random() * 0.1);
        ctx.fillRect(x, 0, 2, horizonY);
      }
      // Window frame strips (bright)
      for (let i = 0; i < 4; i++) {
        const x = (i / 4) * W + W * 0.06;
        ctx.fillStyle = hexToRgba(c4, 0.4);
        ctx.fillRect(x, horizonY * 0.25, W * 0.13, horizonY * 0.55);
        // Outside view
        const g = ctx.createLinearGradient(x, horizonY * 0.25, x, horizonY * 0.8);
        g.addColorStop(0, hexToRgba(c1, 0.5));
        g.addColorStop(0.7, hexToRgba(c3, 0.4));
        g.addColorStop(1, hexToRgba(c4, 0.3));
        ctx.fillStyle = g;
        ctx.fillRect(x + 4, horizonY * 0.25 + 4, W * 0.13 - 8, horizonY * 0.55 - 8);
      }
      // Floor reflection
      const floor = ctx.createLinearGradient(0, horizonY, 0, H);
      floor.addColorStop(0, hexToRgba(c4, 0.2));
      floor.addColorStop(0.4, hexToRgba(c2, 0.5));
      floor.addColorStop(1, hexToRgba(c1, 0.8));
      ctx.fillStyle = floor;
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // Furniture silhouettes
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * W;
        const w = 80 + Math.random() * 200;
        const h = 30 + Math.random() * 60;
        ctx.fillStyle = hexToRgba(c1, 0.55);
        ctx.fillRect(x, horizonY + 40 + Math.random() * 60, w, h);
      }
    } else if (id === "pool-deck") {
      // Water
      const water = ctx.createLinearGradient(0, horizonY, 0, H);
      water.addColorStop(0, hexToRgba(c3, 0.7));
      water.addColorStop(0.4, hexToRgba(c2, 0.85));
      water.addColorStop(1, hexToRgba(c1, 1));
      ctx.fillStyle = water;
      ctx.fillRect(0, horizonY, W, H - horizonY);
      // Ripples
      ctx.strokeStyle = hexToRgba(c4, 0.18);
      ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.moveTo(0, horizonY + 20 + i * 12);
        for (let x = 0; x < W; x += 16) {
          ctx.lineTo(x, horizonY + 20 + i * 12 + Math.sin(x * 0.02 + i) * 3);
        }
        ctx.stroke();
      }
      // Distant resort silhouette
      drawSkyline(ctx, W, { y: horizonY - 2, h: 80, color: hexToRgba(c1, 0.6), count: 22, maxH: 50 });
      // Sun
      const sunX = W * 0.3, sunY = horizonY - 50;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 120);
      sunGrad.addColorStop(0, hexToRgba(c4, 0.9));
      sunGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sunGrad;
      ctx.fillRect(sunX - 200, sunY - 200, 400, 400);
    } else if (id === "park") {
      // Tree silhouettes
      const trees = 50;
      for (let i = 0; i < trees; i++) {
        const x = Math.random() * W;
        const baseY = horizonY + Math.random() * 60 - 10;
        const treeH = 60 + Math.random() * 120;
        const treeW = 20 + Math.random() * 35;
        ctx.fillStyle = hexToRgba(c1, 0.7 + Math.random() * 0.2);
        // canopy
        ctx.beginPath();
        ctx.ellipse(x, baseY - treeH * 0.6, treeW, treeH * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        // trunk
        ctx.fillRect(x - 2, baseY - treeH * 0.2, 4, treeH * 0.2);
      }
      // Path
      ctx.strokeStyle = hexToRgba(c4, 0.45);
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.9);
      ctx.bezierCurveTo(W * 0.3, H * 0.7, W * 0.7, H * 0.85, W, H * 0.75);
      ctx.stroke();
    }
  }

  function drawSkyline(ctx, W, layer) {
    ctx.fillStyle = layer.color;
    const step = W / layer.count;
    for (let i = 0; i < layer.count; i++) {
      const x = i * step + (Math.random() - 0.5) * step * 0.4;
      const h = 20 + Math.random() * layer.maxH;
      const w = step * (0.6 + Math.random() * 0.6);
      ctx.fillRect(x, layer.y - h, w, h);
      // little spires occasionally
      if (Math.random() > 0.8) {
        ctx.fillRect(x + w * 0.4, layer.y - h - 16, 3, 16);
      }
    }
  }

  function addGrain(ctx, W, H) {
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
  }

  function hexToRgba(hex, a) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // Mini thumbnail (small canvas of same panorama)
  function generateThumb(sceneData, w = 130, h = 76) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    const [c1, c2, c3] = sceneData.palette;
    const hy = (sceneData.horizonY || 0.5) * h;
    const sky = ctx.createLinearGradient(0, 0, 0, hy);
    sky.addColorStop(0, c1); sky.addColorStop(1, c3);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, hy);
    const ground = ctx.createLinearGradient(0, hy, 0, h);
    ground.addColorStop(0, c3); ground.addColorStop(1, c1);
    ctx.fillStyle = ground;
    ctx.fillRect(0, hy, w, h - hy);
    // skyline silhouette
    ctx.fillStyle = hexToRgba(c1, 0.7);
    for (let i = 0; i < 12; i++) {
      const x = (i / 12) * w;
      const bh = 4 + Math.random() * (h * 0.3);
      ctx.fillRect(x, hy - bh, w / 12 + 1, bh);
    }
    return c;
  }

  return {
    init, loadScene, setAutoRotate, zoomBy,
    projectHotspot, getYaw, lookAt, generateThumb
  };
})();
