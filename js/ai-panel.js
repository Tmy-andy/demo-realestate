/* ============================================
   AI PANEL — BotChat (voice + text)
   Spec: BOTCHAT_SPEC.md
   ============================================ */
window.AiPanel = (() => {
  let panel = null;
  let recognition = null;
  let voiceActive = false;
  let listening = false;
  let speaking = false;
  let lastTranscript = "";
  let audioCtx = null;
  let analyser = null;
  let micStream = null;
  let micSource = null;
  let waveformRAF = null;

  const sessionHistory = [];

  const DEFAULTS = {
    title: "Trợ lý Aurora Heights",
    active: "Đang hoạt động",
    listening: "Đang lắng nghe…",
    thinking: "Đang suy nghĩ…",
    speaking: "Đang trả lời…",
    placeholder: "Nhập câu hỏi…",
    close: "Đóng",
    noSR: "Trình duyệt chưa hỗ trợ nhận dạng giọng nói. Vui lòng dùng Chrome hoặc Edge.",
    micDenied: "Bạn cần cho phép truy cập micro để dùng tính năng trò chuyện bằng giọng nói.",
    networkErr: "Không thể kết nối dịch vụ nhận dạng giọng nói. Vui lòng thử lại sau.",
    replyStub: 'Cảm ơn câu hỏi của bạn: "{q}". Đây là phản hồi mẫu — tích hợp LLM thật sẽ thay thế hàm generateReply().',
  };

  const DEMO = [
    { role: "bot",  text: "Xin chào! Tôi là trợ lý AI của Aurora Heights. Bạn cần tìm hiểu về dự án nào?" },
    { role: "user", text: "Cho tôi xem các căn 2 phòng ngủ còn trống." },
    { role: "bot",  text: "Hiện có 23 căn 2PN diện tích 72m² giá từ 5.4 tỷ và 14 căn 2PN+1 86m² giá từ 6.8 tỷ. Bạn muốn xem mặt bằng chi tiết không?" },
    { role: "user", text: "Tiện ích nội khu có gì nổi bật?" },
    { role: "bot",  text: "Aurora Heights có bể bơi vô cực 50m, gym 1200m², spa & onsen, công viên 12.4ha và Sky Lounge tầng 42 với panorama hồ Tây." },
  ];

  function t(key, vars) {
    if (window.I18n && typeof window.I18n.t === "function") {
      return window.I18n.t(key, vars);
    }
    const flat = key.replace(/^ai\./, "");
    let str = DEFAULTS[flat] || key;
    if (vars) Object.keys(vars).forEach(k => { str = str.replace("{" + k + "}", vars[k]); });
    return str;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function bubbleHtml(role, text) {
    return `<div class="ai-pn-bubble ${role}">${escapeHtml(text)}</div>`;
  }

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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>
        </button>
        <button class="ai-pn-send" disabled title="Send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
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

  function renderHistory() {
    if (!panel) return;
    const chat = panel.querySelector(".ai-pn-chat");
    const html = DEMO.map(d => bubbleHtml(d.role, d.text)).join("")
               + sessionHistory.map(d => bubbleHtml(d.role, d.text)).join("");
    chat.innerHTML = html;
    scrollChatToEnd();
  }

  function scrollChatToEnd() {
    if (!panel) return;
    const body = panel.querySelector(".ai-pn-body");
    if (body) body.scrollTop = body.scrollHeight;
  }

  function appendBubble(role, text) {
    sessionHistory.push({ role, text });
    if (!panel) return;
    const chat = panel.querySelector(".ai-pn-chat");
    chat.insertAdjacentHTML("beforeend", bubbleHtml(role, text));
    scrollChatToEnd();
  }

  function generateReply(q) {
    return t("ai.replyStub", { q });
  }

  function sendTextQuestion(text) {
    appendBubble("user", text);
    setTimeout(() => appendBubble("bot", generateReply(text)), 450);
  }

  /* ─── Voice ─── */
  function getRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    const lang = (document.documentElement.lang || "vi").toLowerCase().startsWith("en") ? "en-US" : "vi-VN";
    r.lang = lang;
    return r;
  }

  function setVoiceState(state) {
    if (!panel) return;
    panel.classList.remove("listening", "thinking", "speaking");
    if (state) panel.classList.add(state);
    const sub = panel.querySelector(".ai-pn-status-text");
    if (sub) sub.textContent = t("ai." + (state || "active"));
  }

  function enterVoiceMode() {
    const r = getRecognition();
    if (!r) { alert(t("ai.noSR")); return; }
    recognition = r;
    voiceActive = true;
    document.body.classList.add("ai-voice-active");
    startListening();
  }

  function startListening() {
    if (!voiceActive || !recognition) return;
    listening = true;
    lastTranscript = "";
    setVoiceState("listening");
    startWaveform();

    recognition.onresult = (e) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) {
        txt += e.results[i][0].transcript;
      }
      lastTranscript = txt.trim();
    };
    recognition.onend = () => {
      listening = false;
      if (!voiceActive) return;
      if (lastTranscript && lastTranscript.length >= 2) {
        handleVoicePrompt(lastTranscript);
      } else {
        setTimeout(() => startListening(), 400);
      }
    };
    recognition.onerror = (e) => {
      listening = false;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        alert(t("ai.micDenied"));
        exitVoiceMode();
      } else if (e.error === "network") {
        alert(t("ai.networkErr"));
        exitVoiceMode();
      } else if (voiceActive) {
        setTimeout(() => startListening(), 600);
      }
    };

    try { recognition.start(); } catch (_) {}
  }

  function handleVoicePrompt(text) {
    setVoiceState("thinking");
    appendBubble("user", text);
    setTimeout(() => {
      const reply = generateReply(text);
      appendBubble("bot", reply);
      speak(reply);
    }, 450);
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      if (voiceActive) startListening();
      return;
    }
    speaking = true;
    setVoiceState("speaking");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = recognition ? recognition.lang : "vi-VN";
    u.onend = () => { speaking = false; if (voiceActive) startListening(); };
    u.onerror = () => { speaking = false; if (voiceActive) startListening(); };
    try { window.speechSynthesis.speak(u); } catch (_) { speaking = false; }
  }

  function exitVoiceMode() {
    voiceActive = false;
    listening = false;
    speaking = false;
    document.body.classList.remove("ai-voice-active");
    setVoiceState(null);
    if (panel) {
      const sub = panel.querySelector(".ai-pn-status-text");
      if (sub) sub.textContent = t("ai.active");
    }
    try { recognition && recognition.abort(); } catch (_) {}
    recognition = null;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (_) {}
    teardownAudio();
  }

  /* ─── Waveform (realtime mic volume) ─── */
  async function startWaveform() {
    if (!panel) return;
    if (analyser) { drawWaveform(); return; }
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      micSource = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.6;
      micSource.connect(analyser);
      drawWaveform();
    } catch (_) {
      /* silent — bars will still pulse via CSS animation */
    }
  }

  function drawWaveform() {
    if (!panel || !analyser) return;
    const bars = panel.querySelectorAll(".ai-pn-waveform span");
    const data = new Uint8Array(analyser.frequencyBinCount);
    const mid = bars.length / 2;
    const tick = () => {
      if (!analyser) return;
      analyser.getByteFrequencyData(data);
      bars.forEach((bar, i) => {
        const binIdx = Math.floor(Math.abs(i - mid) * data.length / mid);
        const v = data[Math.min(binIdx, data.length - 1)] || 0;
        const scale = 0.15 + (v / 255) * 1.4;
        bar.style.transform = `scaleY(${scale})`;
        bar.style.opacity = 0.4 + (v / 255) * 0.6;
        bar.style.animation = "none";
      });
      waveformRAF = requestAnimationFrame(tick);
    };
    tick();
  }

  function teardownAudio() {
    if (waveformRAF) cancelAnimationFrame(waveformRAF);
    waveformRAF = null;
    try { micSource && micSource.disconnect(); } catch (_) {}
    try { analyser && analyser.disconnect(); } catch (_) {}
    if (micStream) {
      micStream.getTracks().forEach(tr => { try { tr.stop(); } catch (_) {} });
    }
    if (audioCtx && audioCtx.state !== "closed") {
      try { audioCtx.close(); } catch (_) {}
    }
    micSource = null; analyser = null; micStream = null; audioCtx = null;
    if (panel) {
      const bars = panel.querySelectorAll(".ai-pn-waveform span");
      bars.forEach((bar) => {
        bar.style.transform = "";
        bar.style.opacity = "";
        bar.style.animation = "";
      });
    }
  }

  /* ─── Public API ─── */
  function open() {
    buildShell();
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
    if (panel) {
      if (voiceActive) exitVoiceMode();
      panel.remove();
      panel = null;
    }
    if (wasOpen) open();
  });

  return { open, close, toggle };
})();
