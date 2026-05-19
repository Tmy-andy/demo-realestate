/* ==========================================================
   GEMINI LIVE — js/gemini-live.js
   WebSocket client kết nối đến server.js /gemini endpoint.
   Server proxy 2 chiều: browser ↔ server ↔ Gemini Live API.

   Xử lý:
     - Audio input: getUserMedia → AudioContext → ScriptProcessor
       → PCM16 → base64 → gửi lên server
     - Audio output: nhận base64 PCM từ server → decode → phát
     - Transcript: nhận inputTranscription / outputTranscription
     - VR navigate: nhận { type: "vr_navigate", nodeId: "..." }

   ES5 syntax — tương thích Pano2VR runtime cũ.
   ========================================================== */

/* global GeminiLive */

function GeminiLive(config) {
  this.wsUrl      = config.wsUrl;
  this.onOpen     = config.onOpen     || null;
  this.onTranscript = config.onTranscript || null;
  this.onNavigate = config.onNavigate || null;
  this.onClose    = config.onClose    || null;
  this.onError    = config.onError    || null;
  this.onRecordingStart = config.onRecordingStart || null;
  this.onRecordingStop  = config.onRecordingStop  || null;
  this.onInterrupted    = config.onInterrupted    || null;

  this.ws              = null;
  this.audioCtx        = null;
  this.mediaStream     = null;
  this.scriptProcessor = null;
  this.isRecording     = false;
  this.nextStartTime   = 0;
  this.scheduledSrcs   = [];
  this._micPromise     = null; /* set by initAudio() */

  /* Chat history accumulation */
  this.onMessage          = config.onMessage || null;
  this._pendingAudioB64   = [];
  this._pendingAudioBlobs = []; /* raw PCM Blobs from binary frames (for WAV replay) */
  this._pendingOutputText = '';
  this._pendingUserText   = ''; /* accumulate user speech across partial transcripts */
}

/* ── Connection ──────────────────────────────────────────── */

GeminiLive.prototype.connect = function () {
  var self = this;
  this.ws = new WebSocket(this.wsUrl);

  this.ws.onopen = function () {
    if (self.onOpen) self.onOpen();
  };

  this.ws.onmessage = function (evt) {
    /* Binary frame = raw PCM16 audio từ Gemini (24 kHz) */
    if (evt.data instanceof Blob) {
      /* Lưu Blob để ghép WAV replay sau khi turn_complete */
      self._pendingAudioBlobs.push(evt.data);
      /* Phát real-time qua Web Audio API */
      evt.data.arrayBuffer().then(function (buf) {
        self._playPcm16Buffer(buf);
      });
      return;
    }
    /* Text frame = JSON event */
    try {
      var msg = JSON.parse(evt.data);
      self._handleMessage(msg);
    } catch (e) {
      console.error('[GeminiLive] JSON parse error:', e);
    }
  };

  this.ws.onclose = function (evt) {
    self._stopMic();  /* also fires onRecordingStop if was recording */
    if (self.onClose) self.onClose(evt);
  };

  this.ws.onerror = function (evt) {
    if (self.onError) self.onError(evt);
  };
};

GeminiLive.prototype.isConnected = function () {
  return !!(this.ws && this.ws.readyState === WebSocket.OPEN);
};

GeminiLive.prototype.disconnect = function () {
  this._sendAudioEnd();
  this._stopMic();
  this._stopPlayback();
  if (this.ws) {
    this.ws.close();
    this.ws = null;
  }
};

/* ── Message handler ─────────────────────────────────────── */

GeminiLive.prototype._handleMessage = function (msg) {
  var self = this;

  /* Server-injected VR navigation command */
  if (msg.type === 'vr_navigate') {
    if (msg.nodeId && self.onNavigate) self.onNavigate(msg.nodeId);
    return;
  }

  /* Server-injected error */
  if (msg.type === 'error') {
    console.error('[GeminiLive] Server error:', msg.message || msg.error);
    if (self.onError) self.onError(new Error(msg.message || msg.error || 'Unknown error'));
    return;
  }

  /* === Format mới từ backend gemini_live.py === */

  /* Input transcription (user nói) — tích lũy đến khi AI phản hồi */
  if (msg.type === 'user') {
    if (self.onTranscript) self.onTranscript('user', msg.text);
    self._pendingUserText += msg.text; /* accumulate, don't emit yet */
    return;
  }

  /* Output transcription (Gemini nói) — tích lũy theo chunk */
  if (msg.type === 'gemini') {
    /* Flush accumulated user text first (user finished speaking) */
    if (self._pendingUserText) {
      if (self.onMessage) self.onMessage('user', self._pendingUserText, null);
      self._pendingUserText = '';
    }
    /* Safety filter: strip any leaked <function_call> syntax */
    var cleanText = (msg.text || '').replace(/<function_call>.*?<\/function_call>/gis, '')
                                    .replace(/<function_call>[\w._-]+\{[^}]*\}/gi, '')
                                    .replace(/<function_call>/gi, '');
    if (!cleanText.trim()) return;
    self._pendingOutputText += cleanText;
    if (self.onTranscript) self.onTranscript('gemini', cleanText);
    return;
  }

  /* Turn complete — emit tin nhắn đầy đủ lên chat panel */
  if (msg.type === 'turn_complete') {
    /* Flush any remaining user text (edge case: user spoke but AI silent) */
    if (self._pendingUserText) {
      if (self.onMessage) self.onMessage('user', self._pendingUserText, null);
      self._pendingUserText = '';
    }
    if (self.onMessage) {
      /* Xây WAV URL từ các binary Blob đã tích lũy (đồng bộ, không cần await) */
      var audioUrl = self._buildWavFromBlobs(self._pendingAudioBlobs);
      if (self._pendingOutputText || audioUrl) {
        self.onMessage('gemini', self._pendingOutputText, audioUrl);
      }
    }
    self._pendingAudioB64   = [];
    self._pendingAudioBlobs = [];
    self._pendingOutputText = '';
    return;
  }

  /* Interrupted — dừng phát audio */
  if (msg.type === 'interrupted') {
    self._stopPlayback();
    self._pendingUserText   = '';
    self._pendingAudioB64   = [];
    self._pendingAudioBlobs = [];
    self._pendingOutputText = '';
    if (self.onInterrupted) self.onInterrupted();
    return;
  }

  /* === Format cũ: serverContent (fallback) === */
  if (msg.serverContent) {
    var sc = msg.serverContent;

    /* Audio parts — base64 PCM at 24 kHz */
    if (sc.modelTurn && Array.isArray(sc.modelTurn.parts)) {
      for (var i = 0; i < sc.modelTurn.parts.length; i++) {
        var part = sc.modelTurn.parts[i];
        if (part.inlineData && part.inlineData.data) {
          self._playBase64Audio(part.inlineData.data);
          self._pendingAudioB64.push(part.inlineData.data); /* collect for chat panel */
        }
      }
    }

    /* Input (user speech) transcript — accumulate */
    if (sc.inputTranscription && sc.inputTranscription.text) {
      if (self.onTranscript) self.onTranscript('user', sc.inputTranscription.text);
      self._pendingUserText += sc.inputTranscription.text;
    }

    /* Output (model speech) transcript — accumulate for chat panel */
    if (sc.outputTranscription && sc.outputTranscription.text) {
      self._pendingOutputText += sc.outputTranscription.text;
      if (self.onTranscript) self.onTranscript('gemini', sc.outputTranscription.text);
    }

    /* Turn complete — emit full message with audio blob to chat panel */
    if (sc.turnComplete) {
      if (self._pendingUserText) {
        if (self.onMessage) self.onMessage('user', self._pendingUserText, null);
        self._pendingUserText = '';
      }
      if (self.onMessage && (self._pendingOutputText || self._pendingAudioB64.length)) {
        var audioUrl = self._buildWavUrl(self._pendingAudioB64);
        self.onMessage('gemini', self._pendingOutputText, audioUrl);
      }
      self._pendingAudioB64 = [];
      self._pendingOutputText = '';
    }

    /* Barge-in / interrupted — stop queued playback + clear accumulators */
    if (sc.interrupted) {
      self._stopPlayback();
      self._pendingUserText = '';
      self._pendingAudioB64 = [];
      self._pendingOutputText = '';
    }
  }

  /* setupComplete — ignore */
};

/* ── Audio input ─────────────────────────────────────────── */

/**
 * initAudio() — gọi trong gesture (click handler).
 * Khởi tạo AudioContext và bắt đầu getUserMedia ngay trong gesture.
 * Kết quả được lưu trong _micPromise để startRecording() dùng sau.
 */
GeminiLive.prototype.initAudio = function () {
  var self = this;
  if (!this.audioCtx) {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (this.audioCtx.state === 'suspended') {
    this.audioCtx.resume();
  }
  /* Trigger getUserMedia in gesture → browser stores activation */
  this._micPromise = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  return this._micPromise;
};

/**
 * startRecording() — gọi trong onOpen.
 * Dùng _micPromise đã khởi tạo từ initAudio() (đang chờ hoặc đã resolved).
 */
GeminiLive.prototype.startRecording = function () {
  var self = this;
  /* Resume AudioContext if it was suspended (happens after pauseMic) */
  if (this.audioCtx && this.audioCtx.state === 'suspended') {
    this.audioCtx.resume();
  }
  var promise = this._micPromise
    || navigator.mediaDevices.getUserMedia({ audio: true, video: false });

  promise.then(function (stream) {
    self._startMic(stream);
  }).catch(function (e) {
    console.error('[GeminiLive] getUserMedia failed:', e);
    if (self.onError) self.onError(e);
  });
};

GeminiLive.prototype._startMic = function (stream) {
  var self = this;
  this.mediaStream = stream;

  var source     = this.audioCtx.createMediaStreamSource(stream);
  var bufferSize = 4096;
  /* ScriptProcessor as specified; deprecated but universally supported */
  this.scriptProcessor = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);

  this.scriptProcessor.onaudioprocess = function (evt) {
    if (!self.isRecording) return;
    if (!self.ws || self.ws.readyState !== WebSocket.OPEN) return;

    var inputData  = evt.inputBuffer.getChannelData(0);
    var downsampled = self._downsample(inputData, self.audioCtx.sampleRate, 16000);
    var pcm16      = self._toPcm16(downsampled);
    var b64        = self._toBase64(pcm16);

    self.ws.send(JSON.stringify({
      realtimeInput: {
        audio: { mimeType: 'audio/pcm;rate=16000', data: b64 }
      }
    }));
  };

  source.connect(this.scriptProcessor);
  /* Mute local output to prevent echo */
  var mute = this.audioCtx.createGain();
  mute.gain.value = 0;
  this.scriptProcessor.connect(mute);
  mute.connect(this.audioCtx.destination);

  this.isRecording = true;
  if (self.onRecordingStart) self.onRecordingStart();
  console.log('[GeminiLive] Microphone recording started');
};

GeminiLive.prototype._stopMic = function () {
  var wasRecording = this.isRecording;
  this.isRecording = false;
  if (wasRecording && this.onRecordingStop) this.onRecordingStop();
  if (this.scriptProcessor) {
    this.scriptProcessor.disconnect();
    this.scriptProcessor = null;
  }
  if (this.mediaStream) {
    this.mediaStream.getTracks().forEach(function (t) { t.stop(); });
    this.mediaStream = null;
  }
  /* Clear stale promise so resumeMic() gets a fresh getUserMedia stream */
  this._micPromise = null;
};

GeminiLive.prototype._sendAudioEnd = function () {
  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    try {
      this.ws.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } }));
    } catch (e) { /* ignore */ }
  }
};

/**
 * sendText(text) — gửi văn bản đến Gemini qua WebSocket.
 * Trả về true nếu gửi thành công, false nếu chưa kết nối.
 */
GeminiLive.prototype.sendText = function (text) {
  if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
  this.ws.send(JSON.stringify({
    clientContent: {
      turns: [{ role: 'user', parts: [{ text: text }] }],
      turnComplete: true
    }
  }));
  return true;
};

/**
 * pauseMic() — dừng thu âm nhưng giữ kết nối WebSocket.
 * resumeMic() — bắt lại thu âm sau khi pauseMic().
 */
/**
 * sendNodeChanged(nodeId, sceneId) — báo cho backend biết node VR hiện tại.
 * Gọi mỗi khi panorama chuyển cảnh để backend cập nhật _current_node.
 */
GeminiLive.prototype.sendNodeChanged = function (nodeId, sceneId) {
  if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
  try {
    this.ws.send(JSON.stringify({ type: 'node_changed', nodeId: nodeId || null, sceneId: sceneId || null }));
  } catch (e) { /* ignore */ }
  return true;
};

/**
 * pauseMic() — tạm dừng gửi audio nhưng GIỮ stream & ScriptProcessor sống.
 * Tránh phải gọi getUserMedia() lại khi resume → không có độ trễ.
 */
GeminiLive.prototype.pauseMic = function () {
  if (!this.isRecording) return;
  this.isRecording = false;
  if (this.onRecordingStop) this.onRecordingStop();
  /* Keep mediaStream + scriptProcessor alive for instant resume */
};

/**
 * resumeMic() — bật lại gửi audio tức thì (stream đã sẵn sàng).
 * Chỉ gọi startRecording() nếu stream thực sự đã bị dừng hẳn.
 */
GeminiLive.prototype.resumeMic = function () {
  if (this.isRecording) return;
  if (this.scriptProcessor && this.mediaStream) {
    /* Stream vẫn sống — chỉ cần bật flag */
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isRecording = true;
    if (this.onRecordingStart) this.onRecordingStart();
  } else {
    /* Stream bị dừng hẳn — cần khởi tạo lại */
    this.startRecording();
  }
};

/* ── Audio output ────────────────────────────────────────── */

GeminiLive.prototype._playBase64Audio = function (b64) {
  if (!this.audioCtx) return;
  var buf = this._b64ToArrayBuffer(b64);
  this._playPcm16Buffer(buf);
};

GeminiLive.prototype._playPcm16Buffer = function (arrayBuffer) {
  var self = this;
  if (!this.audioCtx) {
    /* AudioContext not yet created — create it lazily (may require gesture) */
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return; }
  }

  var _schedule = function () {
    var pcm  = new Int16Array(arrayBuffer);
    var f32  = new Float32Array(pcm.length);
    for (var i = 0; i < pcm.length; i++) f32[i] = pcm[i] / 32768.0;

    var buffer = self.audioCtx.createBuffer(1, f32.length, 24000);
    buffer.getChannelData(0).set(f32);

    var source = self.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(self.audioCtx.destination);

    var now = self.audioCtx.currentTime;
    self.nextStartTime = Math.max(now, self.nextStartTime);
    source.start(self.nextStartTime);
    self.nextStartTime += buffer.duration;

    self.scheduledSrcs.push(source);
    source.onended = function () {
      var idx = self.scheduledSrcs.indexOf(source);
      if (idx > -1) self.scheduledSrcs.splice(idx, 1);
    };
  };

  /* Await resume() to avoid scheduling audio before context is running */
  if (this.audioCtx.state === 'suspended') {
    this.audioCtx.resume().then(_schedule).catch(function () {});
  } else {
    _schedule();
  }
};

GeminiLive.prototype._stopPlayback = function () {
  this.scheduledSrcs.forEach(function (s) {
    try { s.stop(); } catch (e) { /* ignore */ }
  });
  this.scheduledSrcs = [];
  if (this.audioCtx) this.nextStartTime = this.audioCtx.currentTime;
};

/* ── Utils ───────────────────────────────────────────────── */

GeminiLive.prototype._downsample = function (buf, fromRate, toRate) {
  if (fromRate === toRate) return buf;
  var ratio  = fromRate / toRate;
  var outLen = Math.round(buf.length / ratio);
  var out    = new Float32Array(outLen);
  var i = 0, j = 0;
  while (i < out.length) {
    var next = Math.round((i + 1) * ratio);
    var sum = 0, count = 0;
    for (var k = j; k < next && k < buf.length; k++) { sum += buf[k]; count++; }
    out[i] = count ? sum / count : 0;
    i++; j = next;
  }
  return out;
};

GeminiLive.prototype._toPcm16 = function (f32buf) {
  var len = f32buf.length;
  var out = new Int16Array(len);
  while (len--) out[len] = Math.min(1, Math.max(-1, f32buf[len])) * 0x7fff;
  return out.buffer;
};

GeminiLive.prototype._b64ToArrayBuffer = function (b64) {
  var bin = atob(b64);
  var buf = new ArrayBuffer(bin.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
};

GeminiLive.prototype._toBase64 = function (arrayBuf) {
  var bytes = new Uint8Array(arrayBuf);
  var bin   = '';
  for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
};

/* ── WAV builder ─────────────────────────────────────────── */

/**
 * _buildWavUrl(b64Chunks) → ObjectURL string | null
 * Combines an array of base64 PCM16 chunks into a WAV Blob
 * suitable for <audio src="...">.  PCM: mono, 24 kHz, 16-bit.
 */
GeminiLive.prototype._buildWavUrl = function (b64Chunks) {
  if (!b64Chunks || !b64Chunks.length) return null;
  try {
    var buffers = b64Chunks.map(function (b64) {
      return this._b64ToArrayBuffer(b64);
    }, this);
    var totalLen = 0;
    buffers.forEach(function (b) { totalLen += b.byteLength; });
    var pcm = new Uint8Array(totalLen);
    var off = 0;
    buffers.forEach(function (b) { pcm.set(new Uint8Array(b), off); off += b.byteLength; });

    /* WAV header: PCM16, mono, 24 kHz */
    var sr = 24000, ch = 1, bps = 16, dl = pcm.byteLength;
    var wav = new ArrayBuffer(44 + dl);
    var v   = new DataView(wav);
    var ws  = function (o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    ws(0,  'RIFF'); v.setUint32(4,  36 + dl, true);
    ws(8,  'WAVE'); ws(12, 'fmt ');
    v.setUint32(16, 16, true);  v.setUint16(20, 1, true);    /* PCM */
    v.setUint16(22, ch, true);  v.setUint32(24, sr, true);
    v.setUint32(28, sr * ch * bps / 8, true);
    v.setUint16(32, ch * bps / 8, true);
    v.setUint16(34, bps, true);
    ws(36, 'data'); v.setUint32(40, dl, true);
    new Uint8Array(wav, 44).set(pcm);

    return URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
  } catch (e) {
    console.warn('[GeminiLive] _buildWavUrl error:', e);
    return null;
  }
};

/**
 * _buildWavFromBlobs(blobs) → ObjectURL string | null
 * Nhận mảng Blob chứa raw PCM16 bytes (từ binary WS frames),
 * ghép WAV header + data → ObjectURL cho <audio> replay.
 * Hoàn toàn đồng bộ vì Blob.size có sẵn mà không cần await.
 */
GeminiLive.prototype._buildWavFromBlobs = function (blobs) {
  if (!blobs || !blobs.length) return null;
  try {
    var totalPcmBytes = 0;
    for (var i = 0; i < blobs.length; i++) totalPcmBytes += blobs[i].size;
    /* WAV header: PCM16, mono, 24 kHz */
    var sr = 24000, ch = 1, bps = 16, dl = totalPcmBytes;
    var hdr = new ArrayBuffer(44);
    var v   = new DataView(hdr);
    var ws  = function (o, s) { for (var j = 0; j < s.length; j++) v.setUint8(o + j, s.charCodeAt(j)); };
    ws(0,  'RIFF'); v.setUint32(4,  36 + dl, true);
    ws(8,  'WAVE'); ws(12, 'fmt ');
    v.setUint32(16, 16,  true); v.setUint16(20, 1,  true); /* PCM */
    v.setUint16(22, ch,  true); v.setUint32(24, sr, true);
    v.setUint32(28, sr * ch * bps / 8, true);
    v.setUint16(32, ch * bps / 8, true);
    v.setUint16(34, bps, true);
    ws(36, 'data'); v.setUint32(40, dl, true);
    /* Ghép header + tất cả PCM blobs thành một Blob duy nhất */
    var parts = [hdr].concat(blobs);
    return URL.createObjectURL(new Blob(parts, { type: 'audio/wav' }));
  } catch (e) {
    console.warn('[GeminiLive] _buildWavFromBlobs error:', e);
    return null;
  }
};
