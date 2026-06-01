/* ============================================
   AI PANEL — BotChat (voice + text via Gemini Live)
   Kết nối: ws://AI_BACKEND_WS → FastAPI backend → Gemini Live API
   ============================================ */
window.AiPanel = (() => {
  let panel          = null;
  let geminiLive     = null;
  let voiceActive    = false;
  let _bridgeReady   = false;

  const sessionHistory = [];

  const DEFAULTS = {
    title:       "Trợ lý Vinhomes Hai Van Bay",
    active:      "Đang hoạt động",
    listening:   "Đang lắng nghe…",
    thinking:    "Đang suy nghĩ…",
    speaking:    "Đang trả lời…",
    placeholder: "Nhập câu hỏi…",
    close:       "Đóng",
    noSR:        "Trình duyệt không hỗ trợ âm thanh. Vui lòng dùng Chrome hoặc Edge.",
    micDenied:   "Bạn cần cho phép truy cập micro để dùng trợ lý giọng nói.",
    connecting:  "Đang kết nối…",
    disconnected:"Mất kết nối. Nhấn micro để thử lại.",
  };

  const DEMO = [
    { role: "bot",  text: "Xin chào! Tôi là trợ lý AI của Vinhomes Hai Van Bay. Bạn cần tìm hiểu về dự án nào?" },
  ];

  // Map short alias (dùng trong code) → key đầy đủ trong DB i18n.
  const I18N_ALIAS = {
    placeholder: 'inputPh',
    noSR:        'errBrowser',
    micDenied:   'errMic',
  };
  function t(key) {
    const short = key.replace(/^ai\./, '');
    const dbKey = 'ui.ai.' + (I18N_ALIAS[short] || short);
    if (window.I18n && typeof window.I18n.t === "function") {
      const v = window.I18n.t(dbKey);
      if (v && v !== dbKey) return v;
    }
    return DEFAULTS[short] || key;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function aiAlert(message, { title, okText } = {}) {
    title  = title  || t('ui.ai.alertTitle');
    okText = okText || t('ui.ai.alertOk');
    return new Promise(resolve => {
      const back = document.createElement("div");
      back.className = "ai-modal-back";
      back.innerHTML = `
        <div class="ai-modal">
          <div class="ai-modal-title">${escapeHtml(title)}</div>
          <div class="ai-modal-body">${escapeHtml(message)}</div>
          <div class="ai-modal-footer">
            <button class="ai-modal-ok">${escapeHtml(okText)}</button>
          </div>
        </div>`;
      Object.assign(back.style, {
        position: "fixed", inset: "0", background: "rgba(0,0,0,.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: "100000", padding: "20px"
      });
      const modal = back.querySelector(".ai-modal");
      Object.assign(modal.style, {
        background: "#fff", borderRadius: "12px", maxWidth: "420px", width: "100%",
        padding: "20px 22px", boxShadow: "0 20px 60px rgba(0,0,0,.3)", color: "#0f172a",
        fontFamily: "inherit"
      });
      Object.assign(back.querySelector(".ai-modal-title").style, {
        fontSize: "16px", fontWeight: "700", marginBottom: "10px"
      });
      Object.assign(back.querySelector(".ai-modal-body").style, {
        fontSize: "14px", color: "#475569", marginBottom: "18px", lineHeight: "1.5"
      });
      Object.assign(back.querySelector(".ai-modal-footer").style, {
        display: "flex", justifyContent: "flex-end"
      });
      const okBtn = back.querySelector(".ai-modal-ok");
      Object.assign(okBtn.style, {
        padding: "8px 18px", borderRadius: "8px", border: "none",
        background: "#2563eb", color: "#fff", fontWeight: "600", cursor: "pointer",
        fontSize: "14px"
      });
      const close = () => { back.remove(); resolve(true); };
      okBtn.onclick = close;
      back.addEventListener("click", e => { if (e.target === back) close(); });
      document.body.appendChild(back);
      okBtn.focus();
    });
  }

  function bubbleHtml(role, text) {
    return `<div class="ai-pn-bubble ${role}">${escapeHtml(text)}</div>`;
  }

  /* ─── Build HTML shell ──────────────────────────────── */
  function buildShell() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.id = "ai-panel";
    panel.innerHTML = `
      <div class="ai-pn-head">
        <div class="ai-pn-orb"><img src="img/1.png" alt="AI"/></div>
        <div class="ai-pn-h">
          <div class="ai-pn-title">${escapeHtml(t("ai.title"))}</div>
          <div class="ai-pn-sub">
            <span class="ai-pn-status-dot"></span>
            <span class="ai-pn-status-text">${escapeHtml(t("ai.active"))}</span>
          </div>
        </div>
        <button class="ai-pn-x" aria-label="${escapeHtml(t("ai.close"))}">✕</button>
      </div>
      <div class="ai-pn-body">
        <div class="ai-pn-chat"></div>
      </div>
      <div class="ai-pn-composer">
        <input type="text" class="ai-pn-input" placeholder="${escapeHtml(t("ai.placeholder"))}"/>
        <button class="ai-pn-mic" title="Voice">
          <i data-lucide="mic" width="16" height="16"></i>
        </button>
        <button class="ai-pn-send" disabled title="Send">
          <i data-lucide="send" width="14" height="14"></i>
        </button>
        <div class="ai-pn-waveform" aria-hidden="true">
          ${"<span></span>".repeat(24)}
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    bindShell();
    return panel;
  }

  function bindShell() {
    panel.querySelector(".ai-pn-x").addEventListener("click", close);
    const input = panel.querySelector(".ai-pn-input");
    const send  = panel.querySelector(".ai-pn-send");
    const mic   = panel.querySelector(".ai-pn-mic");

    input.addEventListener("input", () => {
      send.disabled = !input.value.trim();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        sendTextQuestion(input.value.trim());
        input.value = "";
        send.disabled = true;
      }
    });
    send.addEventListener("click", () => {
      const v = input.value.trim();
      if (!v) return;
      sendTextQuestion(v);
      input.value = "";
      send.disabled = true;
    });
    mic.addEventListener("click", () => {
      if (voiceActive) exitVoiceMode();
      else enterVoiceMode();
    });
  }

  /* ─── Chat rendering ────────────────────────────────── */
  function renderHistory() {
    if (!panel) return;
    const chat = panel.querySelector(".ai-pn-chat");
    chat.innerHTML = DEMO.map(d => bubbleHtml(d.role, d.text)).join("")
                   + sessionHistory.map(d => bubbleHtml(d.role, d.text)).join("");
    scrollChatToEnd();
  }

  function scrollChatToEnd() {
    if (!panel) return;
    const body = panel.querySelector(".ai-pn-body");
    if (body) body.scrollTop = body.scrollHeight;
  }

  function appendBubble(role, text) {
    if (!text || !text.trim()) return;
    sessionHistory.push({ role, text });
    if (!panel) return;
    const chat = panel.querySelector(".ai-pn-chat");
    chat.insertAdjacentHTML("beforeend", bubbleHtml(role, text));
    scrollChatToEnd();
  }

  /* ─── Status bar ────────────────────────────────────── */
  function setVoiceState(state) {
    if (!panel) return;
    panel.classList.remove("listening", "thinking", "speaking");
    if (state) panel.classList.add(state);
    const sub = panel.querySelector(".ai-pn-status-text");
    if (sub) sub.textContent = t("ai." + (state || "active"));
  }

  function setStatusText(text) {
    if (!panel) return;
    const sub = panel.querySelector(".ai-pn-status-text");
    if (sub) sub.textContent = text;
  }

  /* ─── VRBridge setup ────────────────────────────────── */
  function _initVRBridge() {
    if (_bridgeReady || !window.VRBridge) return;
    _bridgeReady = true;

    /* Build pano→scene map from menu items */
    const buildMap = (data) => {
      if (!data || !data.menu) return;
      const allItems = [];
      Object.values(data.menu).forEach(group => {
        if (Array.isArray(group)) allItems.push(...group);
      });
      if (allItems.length) window.VRBridge.setSceneMap(allItems);
    };

    if (window.DATA) {
      buildMap(window.DATA);
    } else {
      window.DataSource.fetchProjectData()
        .then(buildMap)
        .catch(() => { /* silent — scene map not critical */ });
    }

    /* Notify backend when panorama changes */
    window.VRBridge.onSceneChange(({ nodeId, sceneId }) => {
      if (geminiLive) geminiLive.sendNodeChanged(nodeId, sceneId);
    });
  }

  /* ─── Gemini Live connection ─────────────────────────── */
  /* ─── WS URL builder (fetches short-lived token if configured) ───────── */
  async function _buildWsUrl() {
    const base = (typeof window.AI_BACKEND_WS !== "undefined")
      ? window.AI_BACKEND_WS
      : (location.protocol === "https:" ? "wss:" : "ws:") + "//" + location.hostname + ":8000/ws";
    const cfg = window.AI_CONFIG;
    if (!cfg || !cfg.wsTokenEndpoint) return base;
    try {
      const resp = await fetch(cfg.wsTokenEndpoint, { method: "POST" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      if (data && data.token) {
        const sep = base.indexOf("?") === -1 ? "?" : "&";
        return base + sep + "token=" + encodeURIComponent(data.token);
      }
    } catch (e) {
      console.warn("[AiPanel] Failed to fetch ws-token, connecting without token:", e);
    }
    return base;
  }

  async function _ensureGeminiLive() {
    if (geminiLive && geminiLive.isConnected()) return geminiLive;

    const wsUrl = await _buildWsUrl();

    geminiLive = new GeminiLive({
      wsUrl,

      onOpen: () => {
        setVoiceState("listening");
        /* Start streaming mic immediately */
        geminiLive.startRecording();
        /* Tell backend current scene if known */
        const panoId = window.VRBridge ? window.VRBridge.currentPanoId() : null;
        if (panoId) geminiLive.sendNodeChanged(panoId, null);
      },

      onMessage: (role, text /*, audioUrl */) => {
        if (text && text.trim()) {
          appendBubble(role === "gemini" ? "bot" : "user", text);
        }
      },

      onTranscript: (role, chunk) => {
        if (role === "gemini") setVoiceState("speaking");
      },

      onNavigate: (nodeId) => {
        if (window.VRBridge) window.VRBridge.navigateTo(nodeId);
      },

      onRecordingStart: () => {
        setVoiceState("listening");
        startWaveform();
      },

      onRecordingStop: () => {
        setVoiceState("thinking");
        stopWaveform();
      },

      onInterrupted: () => {
        setVoiceState("listening");
      },

      onClose: () => {
        voiceActive = false;
        setVoiceState(null);
        stopWaveform();
        document.body.classList.remove("ai-voice-active");
        if (panel) panel.classList.remove("listening", "thinking", "speaking");
      },

      onError: (e) => {
        console.error("[AiPanel] Gemini Live error:", e);
        setStatusText(t("ai.disconnected"));
      },
    });

    geminiLive.connect();
    return geminiLive;
  }

  /* ─── Voice mode (Gemini Live streaming) ────────────── */
  async function enterVoiceMode() {
    if (!window.GeminiLive) {
      aiAlert(t("ai.noSR"));
      return;
    }
    voiceActive = true;
    document.body.classList.add("ai-voice-active");
    setStatusText(t("ai.connecting"));

    try {
      const gl = await _ensureGeminiLive();
      /* initAudio must be called in user gesture */
      await gl.initAudio();
    } catch (e) {
      if (e && e.name === "NotAllowedError") {
        aiAlert(t("ai.micDenied"));
        voiceActive = false;
        document.body.classList.remove("ai-voice-active");
      }
    }
  }

  function exitVoiceMode() {
    voiceActive = false;
    document.body.classList.remove("ai-voice-active");
    setVoiceState(null);
    stopWaveform();
    if (geminiLive) {
      geminiLive.disconnect();
      geminiLive = null;
    }
  }

  /* ─── Text input ─────────────────────────────────────── */
  async function sendTextQuestion(text) {
    appendBubble("user", text);
    if (!window.GeminiLive) return;
    if (geminiLive && geminiLive.isConnected()) {
      geminiLive.sendText(text);
      return;
    }
    /* Auto-connect for text-only mode */
    const wsUrl = await _buildWsUrl();
    geminiLive = new GeminiLive({
      wsUrl,
      onOpen: () => {
        geminiLive.sendText(text);
        const panoId = window.VRBridge ? window.VRBridge.currentPanoId() : null;
        if (panoId) geminiLive.sendNodeChanged(panoId, null);
      },
      onMessage: (role, t2) => {
        if (t2 && t2.trim()) appendBubble(role === "gemini" ? "bot" : "user", t2);
      },
      onNavigate: (nodeId) => {
        if (window.VRBridge) window.VRBridge.navigateTo(nodeId);
      },
      onError: (e) => console.error("[AiPanel]", e),
    });
    geminiLive.connect();
    /* initAudio() in user-gesture context so AudioContext is ready for bot audio */
    geminiLive.initAudio().catch(() => {});
  }

  /* ─── Waveform (CSS animation — no second getUserMedia) ────
     GeminiLive already holds the mic stream; opening a second
     getUserMedia causes browser warnings and may fail silently.
     CSS-driven animation provides adequate visual feedback.
  ─────────────────────────────────────────────────────────── */
  let _waveRAF = null;

  function startWaveform() {
    if (!panel || _waveRAF) return;
    const bars = panel.querySelectorAll(".ai-pn-waveform span");
    let t = 0;
    const tick = () => {
      t += 0.15;
      const mid = bars.length / 2;
      bars.forEach((bar, i) => {
        const dist  = Math.abs(i - mid) / mid;
        const phase = Math.sin(t + i * 0.4);
        const scale = 0.15 + (1 - dist) * 0.7 * Math.max(0, phase);
        bar.style.transform = `scaleY(${scale})`;
        bar.style.opacity   = String(0.3 + (1 - dist) * 0.6 * Math.max(0, phase));
        bar.style.animation = "none";
      });
      _waveRAF = requestAnimationFrame(tick);
    };
    tick();
  }

  function _drawWave() { /* no-op, kept for compat */ }

  function stopWaveform() {
    if (_waveRAF) cancelAnimationFrame(_waveRAF);
    _waveRAF = null;
    if (panel) {
      panel.querySelectorAll(".ai-pn-waveform span").forEach(bar => {
        bar.style.transform = "";
        bar.style.opacity   = "";
        bar.style.animation = "";
      });
    }
  }

  /* ─── Public API ─────────────────────────────────────── */
  function open() {
    buildShell();
    _initVRBridge();
    renderHistory();
    requestAnimationFrame(() => {
      panel.classList.add("open");
      document.body.classList.add("ai-panel-open");
    });
  }

  function close() {
    if (voiceActive) exitVoiceMode();
    if (panel) panel.classList.remove("open");
    document.body.classList.remove("ai-panel-open");
  }

  function toggle() {
    if (panel && panel.classList.contains("open")) close();
    else open();
  }

  window.addEventListener("langchange", () => {
    const wasOpen = panel && panel.classList.contains("open");
    if (panel) { panel.remove(); panel = null; }
    if (wasOpen) open();
  });

  return { open, close, toggle };
})();
