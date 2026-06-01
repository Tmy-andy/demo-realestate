/* ============================================
   AI PANEL — BotChat (voice + text via Gemini Live)
   Kết nối: ws://AI_BACKEND_WS → FastAPI backend → Gemini Live API
   ============================================ */

/* ─── SessionManager ────────────────────────────────────── */
var SessionManager = {
  CLIENT_ID_KEY: 'ai_client_id',
  CURRENT_KEY:   'ai_current_session',

  getClientId: function() {
    var id = localStorage.getItem(this.CLIENT_ID_KEY);
    if (!id) {
      id = 'client_' + Math.random().toString(36).slice(2) + Date.now();
      localStorage.setItem(this.CLIENT_ID_KEY, id);
    }
    return id;
  },

  getCurrentSessionId: function() {
    return localStorage.getItem(this.CURRENT_KEY) || null;
  },

  setCurrentSessionId: function(id) {
    localStorage.setItem(this.CURRENT_KEY, id);
  },

  clearCurrentSession: function() {
    localStorage.removeItem(this.CURRENT_KEY);
  },

  loadSessions: async function() {
    try {
      var clientId = this.getClientId();
      var base = (window.AI_CONFIG && window.AI_CONFIG.apiBase) || '';
      var resp = await fetch(base + '/api/sessions?client_id=' + encodeURIComponent(clientId));
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return await resp.json();
    } catch (e) {
      console.warn('[SessionManager] loadSessions failed:', e);
      return [];
    }
  },

  loadSessionMessages: async function(sessionId) {
    try {
      var base = (window.AI_CONFIG && window.AI_CONFIG.apiBase) || '';
      var resp = await fetch(base + '/api/sessions/' + encodeURIComponent(sessionId));
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      return data.messages || [];
    } catch (e) {
      console.warn('[SessionManager] loadSessionMessages failed:', e);
      return [];
    }
  }
};

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
        <button class="ai-pn-btn-history" title="Lịch sử chat" aria-label="Lịch sử">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
        <button class="ai-pn-btn-new" title="Tạo chat mới" aria-label="Chat mới">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
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
      <div class="ai-session-list" style="display:none;"></div>
    `;
    document.body.appendChild(panel);
    bindShell();
    return panel;
  }

  function bindShell() {
    panel.querySelector(".ai-pn-x").addEventListener("click", close);
    panel.querySelector(".ai-pn-btn-new").addEventListener("click", startNewChat);
    panel.querySelector(".ai-pn-btn-history").addEventListener("click", toggleSessionList);
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
    hideTypingIndicator();
    const chat = panel.querySelector(".ai-pn-chat");
    chat.insertAdjacentHTML("beforeend", bubbleHtml(role, text));
    scrollChatToEnd();
  }

  function showTypingIndicator() {
    if (!panel) return;
    hideTypingIndicator();
    const chat = panel.querySelector(".ai-pn-chat");
    chat.insertAdjacentHTML("beforeend",
      `<div class="ai-pn-bubble bot ai-typing" id="ai-typing-dot"><span></span><span></span><span></span></div>`);
    scrollChatToEnd();
  }

  function hideTypingIndicator() {
    if (!panel) return;
    const el = panel.querySelector("#ai-typing-dot");
    if (el) el.remove();
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

  /* ─── WS URL builder (fetches short-lived token if configured) ───────── */
  async function _buildWsUrl() {
    const base = (typeof window.AI_BACKEND_WS !== "undefined")
      ? window.AI_BACKEND_WS
      : (location.protocol === "https:" ? "wss:" : "ws:") + "//" + location.hostname + ":8000/ws";
    const cfg = window.AI_CONFIG;
    let url = base;
    // Append ws-token
    if (cfg && cfg.wsTokenEndpoint) {
      try {
        const resp = await fetch(cfg.wsTokenEndpoint, { method: "POST" });
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        const data = await resp.json();
        if (data && data.token) {
          const sep = url.indexOf("?") === -1 ? "?" : "&";
          url = url + sep + "token=" + encodeURIComponent(data.token);
        }
      } catch (e) {
        console.warn("[AiPanel] Failed to fetch ws-token, connecting without token:", e);
      }
    }
    // Append session_id and client_id
    const sid = SessionManager.getCurrentSessionId();
    const cid = SessionManager.getClientId();
    const sep2 = url.indexOf("?") === -1 ? "?" : "&";
    url = url + sep2 + "client_id=" + encodeURIComponent(cid);
    if (sid) {
      url = url + "&session_id=" + encodeURIComponent(sid);
    }
    return url;
  }

  /* ─── Gemini Live connection ─────────────────────────── */
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
        } else {
          hideTypingIndicator();
        }
      },

      onEvent: (evt) => {
        /* Capture session_id assigned by server */
        if (evt && evt.type === "session_info" && evt.session_id) {
          SessionManager.setCurrentSessionId(evt.session_id);
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
        showTypingIndicator();
      },

      onInterrupted: () => {
        hideTypingIndicator();
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
    showTypingIndicator();
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
        else hideTypingIndicator();
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

  /* ─── Session management ─────────────────────────────── */
  function startNewChat() {
    if (voiceActive) exitVoiceMode();
    if (geminiLive) { geminiLive.disconnect(); geminiLive = null; }
    SessionManager.clearCurrentSession();
    sessionHistory.length = 0;
    renderHistory();
    // Hide session list if open
    if (panel) {
      const sl = panel.querySelector(".ai-session-list");
      if (sl) sl.style.display = "none";
    }
  }

  function _formatDate(isoStr) {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch (e) { return ""; }
  }

  function toggleSessionList() {
    if (!panel) return;
    const sl = panel.querySelector(".ai-session-list");
    if (!sl) return;
    if (sl.style.display !== "none") {
      sl.style.display = "none";
      return;
    }
    sl.style.display = "flex";
    sl.innerHTML = `<div class="ai-session-header"><span class="ai-session-header-title">Lịch sử chat</span><button class="ai-session-close-btn" title="Đóng">✕</button></div><div class="ai-session-loading">Đang tải…</div>`;
    sl.querySelector(".ai-session-close-btn").addEventListener("click", function() {
      sl.style.display = "none";
    });
    const currentSid = SessionManager.getCurrentSessionId();
    SessionManager.loadSessions().then(function(sessions) {
      var headerHtml = `<div class="ai-session-header"><span class="ai-session-header-title">Lịch sử chat</span><button class="ai-session-close-btn" title="Đóng">✕</button></div>`;
      if (!sessions || sessions.length === 0) {
        sl.innerHTML = headerHtml + `<div class="ai-session-empty">Chưa có lịch sử chat</div>`;
        sl.querySelector(".ai-session-close-btn").addEventListener("click", function() { sl.style.display = "none"; });
        return;
      }
      sl.innerHTML = headerHtml + sessions.map(function(s) {
        const active = s.session_id === currentSid ? " ai-session-active" : "";
        return `<div class="ai-session-item${active}" data-sid="${escapeHtml(s.session_id)}">
          <div class="ai-session-title">${escapeHtml(s.title || s.session_id)}</div>
          <div class="ai-session-meta">${s.message_count || 0} tin nhắn · ${_formatDate(s.updated_at)}</div>
        </div>`;
      }).join("") + `<div class="ai-session-item ai-session-new-btn">+ Tạo chat mới</div>`;

      sl.querySelector(".ai-session-close-btn").addEventListener("click", function() { sl.style.display = "none"; });
      sl.querySelectorAll(".ai-session-item[data-sid]").forEach(function(el) {
        el.addEventListener("click", function() {
          const sid = el.getAttribute("data-sid");
          sl.style.display = "none";
          _loadSessionIntoPanel(sid);
        });
      });
      const newBtn = sl.querySelector(".ai-session-new-btn");
      if (newBtn) newBtn.addEventListener("click", function() {
        sl.style.display = "none";
        startNewChat();
      });
    }).catch(function(e) {
      console.warn("[AiPanel] session list error:", e);
      var headerHtml = `<div class="ai-session-header"><span class="ai-session-header-title">Lịch sử chat</span><button class="ai-session-close-btn" title="Đóng">✕</button></div>`;
      sl.innerHTML = headerHtml + `<div class="ai-session-empty">Không thể tải lịch sử</div>`;
      sl.querySelector(".ai-session-close-btn").addEventListener("click", function() { sl.style.display = "none"; });
    });
  }

  function _loadSessionIntoPanel(sid) {
    if (voiceActive) exitVoiceMode();
    if (geminiLive) { geminiLive.disconnect(); geminiLive = null; }
    SessionManager.setCurrentSessionId(sid);
    sessionHistory.length = 0;
    SessionManager.loadSessionMessages(sid).then(function(messages) {
      messages.forEach(function(m) {
        sessionHistory.push({ role: m.role === "assistant" ? "bot" : m.role, text: m.text });
      });
      renderHistory();
    }).catch(function(e) {
      console.warn("[AiPanel] load session messages error:", e);
    });
  }

  /* ─── Public API ─────────────────────────────────────── */
  function open() {
    buildShell();
    _initVRBridge();
    renderHistory();
    // Restore previous session messages if a session is stored
    if (sessionHistory.length === 0) {
      const sid = SessionManager.getCurrentSessionId();
      if (sid) {
        SessionManager.loadSessionMessages(sid).then(function(messages) {
          if (messages && messages.length > 0) {
            messages.forEach(function(m) {
              sessionHistory.push({ role: m.role === "assistant" ? "bot" : m.role, text: m.text });
            });
            renderHistory();
          }
        }).catch(function(e) {
          console.warn("[AiPanel] restore session failed:", e);
        });
      }
    }
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
