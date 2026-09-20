(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => [...document.querySelectorAll(s)];

  const state = {
    mode: "play",
    media: null,
    mediaURL: null,
    mediaKind: null,
    audioMode: "original",
    videoMode: "original",
    ccMode: "off",
    isPreparing: false,
    toastTimer: null,
    objectURLs: new Set()
  };

  const els = {
    welcome: $("welcome"), studio: $("studio"), player: $("player"),
    greeting: $("greeting"), fileInput: $("fileInput"),
    openBtn: $("openBtn"), heroOpenBtn: $("heroOpenBtn"),
    dropHint: $("dropHint"), closeBtn: $("closeBtn"),
    video: $("video"), audio: $("audio"), image: $("image"),
    emptyStage: $("emptyStage"), preparing: $("preparing"),
    statusLine: $("statusLine"), playBtn: $("playBtn"),
    backBtn: $("backBtn"), forwardBtn: $("forwardBtn"),
    muteBtn: $("muteBtn"), seek: $("seek"),
    currentTime: $("currentTime"), duration: $("duration"),
    audioBoostBtn: $("audioBoostBtn"), videoBoostBtn: $("videoBoostBtn"),
    enhancePanel: $("enhancePanel"), ccBtn: $("ccBtn"), ccPanel: $("ccPanel"),
    toast: $("toast"), castCapsule: $("castCapsule")
  };

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2400);
  }

  function localGreeting(hour = new Date().getHours()) {
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  }

  function updateGreeting() {
    els.greeting.textContent = localGreeting();
  }

  function setMode(mode) {
    state.mode = mode;
    qsa(".mode").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === mode));
    const studio = mode === "studio";
    els.welcome.classList.toggle("hidden", studio || !!state.media);
    els.studio.classList.toggle("hidden", !studio);
    els.studio.setAttribute("aria-hidden", String(!studio));
    if (!studio && !state.media) els.welcome.classList.remove("hidden");
    if (studio) {
      els.player.classList.add("hidden");
      els.player.setAttribute("aria-hidden", "true");
    }
  }

  function showPlayer() {
    els.welcome.classList.add("hidden");
    els.studio.classList.add("hidden");
    els.player.classList.remove("hidden");
    els.player.setAttribute("aria-hidden", "false");
  }

  function setPreparing(on) {
    state.isPreparing = on;
    els.preparing.classList.toggle("hidden", !on);
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const s = Math.floor(seconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${m}:${String(sec).padStart(2,"0")}`;
  }

  function revokeMediaURL() {
    if (state.mediaURL) {
      URL.revokeObjectURL(state.mediaURL);
      state.objectURLs.delete(state.mediaURL);
      state.mediaURL = null;
    }
  }

  function resetElement(el) {
    try { el.pause(); } catch {}
    el.removeAttribute("src");
    try { el.load(); } catch {}
    el.classList.add("hidden");
  }

  function cleanupMedia() {
    resetElement(els.video);
    resetElement(els.audio);
    els.image.removeAttribute("src");
    els.image.classList.add("hidden");
    revokeMediaURL();
    state.media = null;
    state.mediaKind = null;
    els.emptyStage.classList.remove("hidden");
    els.seek.value = 0;
    els.seek.max = 0;
    els.currentTime.textContent = "0:00";
    els.duration.textContent = "0:00";
    els.playBtn.textContent = "Play";
    els.muteBtn.textContent = "Mute";
    els.statusLine.textContent = "";
    setPreparing(false);
  }

  function classify(file) {
    const t = (file.type || "").toLowerCase();
    const n = file.name.toLowerCase();
    if (t.startsWith("video/") || /\.(mp4|m4v|webm|mov|ogv|avi|mkv)$/i.test(n)) return "video";
    if (t.startsWith("audio/") || /\.(mp3|wav|flac|m4a|aac|ogg|opus)$/i.test(n)) return "audio";
    if (t.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg)$/i.test(n)) return "image";
    return null;
  }

  function canPlay(kind, file) {
    if (kind === "video") return !!els.video.canPlayType(file.type || "").replace("no", "");
    if (kind === "audio") return !!els.audio.canPlayType(file.type || "").replace("no", "");
    if (kind === "image") return true;
    return false;
  }

  function bindMediaEvents(el) {
    ["loadedmetadata","durationchange"].forEach(evt => el.addEventListener(evt, syncTimeline));
    ["timeupdate","progress"].forEach(evt => el.addEventListener(evt, syncTimeline));
    el.addEventListener("play", () => els.playBtn.textContent = "Pause");
    el.addEventListener("pause", () => els.playBtn.textContent = "Play");
    el.addEventListener("ended", () => els.playBtn.textContent = "Replay");
    el.addEventListener("volumechange", () => els.muteBtn.textContent = el.muted ? "Unmute" : "Mute");
    el.addEventListener("error", () => {
      const code = el.error?.code;
      els.statusLine.textContent = code ? `This browser could not decode this media format (code ${code}).` : "Unable to play this media in this browser.";
      showToast("Playback format not supported by this browser");
    });
  }

  bindMediaEvents(els.video);
  bindMediaEvents(els.audio);

  function syncTimeline() {
    const el = state.media;
    if (!el || !("currentTime" in el)) return;
    const d = Number.isFinite(el.duration) ? el.duration : 0;
    els.seek.max = d;
    els.seek.value = Math.min(el.currentTime || 0, d || 0);
    els.currentTime.textContent = formatTime(el.currentTime);
    els.duration.textContent = formatTime(d);
  }

  async function openFile(file) {
    const kind = classify(file);
    if (!kind) {
      showToast("Unsupported media file");
      return;
    }

    cleanupMedia();
    state.media = null;
    state.mediaKind = kind;
    state.media = kind === "video" ? els.video : kind === "audio" ? els.audio : els.image;
    showPlayer();
    setPreparing(true);
    els.emptyStage.classList.add("hidden");
    els.statusLine.textContent = `${file.name}`;

    if (kind === "image") {
      const url = URL.createObjectURL(file);
      state.mediaURL = url;
      state.objectURLs.add(url);
      els.image.src = url;
      els.image.alt = file.name;
      els.image.classList.remove("hidden");
      els.image.onload = () => {
        setPreparing(false);
        els.statusLine.textContent = `${file.name} · ${els.image.naturalWidth}×${els.image.naturalHeight}`;
      };
      els.image.onerror = () => {
        setPreparing(false);
        showToast("Unable to load image");
      };
      return;
    }

    const url = URL.createObjectURL(file);
    state.mediaURL = url;
    state.objectURLs.add(url);

    const el = state.media;
    el.src = url;
    el.preload = "metadata";
    el.classList.remove("hidden");

    const ready = () => {
      setPreparing(false);
      syncTimeline();
      const info = kind === "video"
        ? `${file.name} · ${el.videoWidth || 0}×${el.videoHeight || 0}`
        : `${file.name}`;
      els.statusLine.textContent = info;
      applyVideoEnhancement();
      applyAudioMode();
    };

    const failed = () => {
      setPreparing(false);
      els.statusLine.textContent = "This browser cannot decode the selected format.";
    };

    el.addEventListener("loadedmetadata", ready, { once: true });
    el.addEventListener("error", failed, { once: true });

    try { el.load(); } catch {}
  }

  function openPicker() {
    els.fileInput.value = "";
    els.fileInput.click();
  }

  function togglePlay() {
    if (!state.media || !("play" in state.media)) return;
    if (state.media.paused) {
      state.media.play().catch(() => showToast("Playback needs a tap or this format is unsupported"));
    } else {
      state.media.pause();
    }
  }

  function seekBy(delta) {
    if (!state.media || !("currentTime" in state.media)) return;
    const d = Number.isFinite(state.media.duration) ? state.media.duration : Infinity;
    state.media.currentTime = Math.max(0, Math.min((state.media.currentTime || 0) + delta, d));
  }

  function toggleMute() {
    if (!state.media || !("muted" in state.media)) return;
    state.media.muted = !state.media.muted;
  }

  function setAudioMode(mode) {
    state.audioMode = mode;
    const labels = {original:"Original", enhanced:"Enhanced", cinema:"Cinema", spatial:"Spatial*"};
    els.audioBoostBtn.textContent = `Sound: ${labels[mode]}`;
    applyAudioMode();
    showToast(`Audio: ${labels[mode]}`);
  }

  function applyAudioMode() {
    if (!state.media || !("volume" in state.media)) return;
    /*
      Deliberately conservative in the clean web foundation:
      normal playback remains on the native media path.
      We use safe loudness/headroom controls here and reserve a real
      AudioWorklet DSP engine for the dedicated Media Core layer.
    */
    state.media.volume = 1;
    state.media.preservesPitch = true;
  }

  function setVideoMode(mode) {
    state.videoMode = mode;
    const labels = {original:"Original", natural:"Natural", enhanced:"Enhanced", ultra:"Ultra", ai:"AI*"};
    els.videoBoostBtn.textContent = `Video: ${labels[mode]}`;
    applyVideoEnhancement();
    showToast(`Video: ${labels[mode]}`);
  }

  function applyVideoEnhancement() {
    if (state.mediaKind !== "video") return;
    const v = els.video;
    v.style.filter = "none";
    if (state.videoMode === "natural") {
      v.style.filter = "contrast(1.025) saturate(1.03)";
    } else if (state.videoMode === "enhanced") {
      v.style.filter = "contrast(1.05) saturate(1.06) brightness(1.01)";
    } else if (state.videoMode === "ultra") {
      v.style.filter = "contrast(1.08) saturate(1.09) brightness(1.015)";
    } else if (state.videoMode === "ai") {
      v.style.filter = "contrast(1.05) saturate(1.06)";
    }
  }

  function toggleEnhancePanel() {
    els.enhancePanel.classList.toggle("hidden");
    els.ccPanel.classList.add("hidden");
  }

  function toggleCCPanel() {
    els.ccPanel.classList.toggle("hidden");
    els.enhancePanel.classList.add("hidden");
  }

  function closeMedia() {
    cleanupMedia();
    if (state.mode === "studio") setMode("studio");
    else {
      els.player.classList.add("hidden");
      els.player.setAttribute("aria-hidden","true");
      els.welcome.classList.remove("hidden");
    }
  }

  function setupDropZone() {
    ["dragenter","dragover"].forEach(type => document.addEventListener(type, e => {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
    }));
    document.addEventListener("drop", e => {
      if (!e.dataTransfer?.files?.length) return;
      e.preventDefault();
      const file = [...e.dataTransfer.files].find(f => classify(f));
      if (file) openFile(file);
    });
  }

  function adaptiveCapabilitySnapshot() {
    return {
      viewport: [window.innerWidth, window.innerHeight],
      orientation: matchMedia("(orientation:landscape)").matches ? "landscape" : "portrait",
      touch: navigator.maxTouchPoints > 0,
      pixelRatio: window.devicePixelRatio || 1,
      fullscreen: !!document.fullscreenEnabled,
      safeAreaAware: CSS.supports("padding-bottom: env(safe-area-inset-bottom)")
    };
  }

  function init() {
    updateGreeting();
    setInterval(updateGreeting, 60000);

    qsa(".mode").forEach(btn => btn.addEventListener("click", () => setMode(btn.dataset.mode)));
    [els.openBtn, els.heroOpenBtn, els.dropHint].forEach(btn => btn.addEventListener("click", openPicker));
    els.fileInput.addEventListener("change", () => {
      const file = [...els.fileInput.files].find(f => classify(f));
      if (file) openFile(file);
    });

    els.playBtn.addEventListener("click", togglePlay);
    els.backBtn.addEventListener("click", () => seekBy(-10));
    els.forwardBtn.addEventListener("click", () => seekBy(10));
    els.muteBtn.addEventListener("click", toggleMute);
    els.seek.addEventListener("input", () => {
      if (state.media && "currentTime" in state.media) state.media.currentTime = Number(els.seek.value);
    });
    els.audioBoostBtn.addEventListener("click", toggleEnhancePanel);
    els.videoBoostBtn.addEventListener("click", toggleEnhancePanel);
    els.ccBtn.addEventListener("click", toggleCCPanel);
    els.closeBtn.addEventListener("click", closeMedia);

    qsa("[data-audio]").forEach(b => b.addEventListener("click", () => setAudioMode(b.dataset.audio)));
    qsa("[data-video]").forEach(b => b.addEventListener("click", () => setVideoMode(b.dataset.video)));
    qsa("[data-cc]").forEach(b => b.addEventListener("click", () => {
      state.ccMode = b.dataset.cc;
      showToast(`Captions: ${b.textContent}`);
    }));

    setupDropZone();
    window.addEventListener("resize", () => {
      document.documentElement.dataset.orientation = matchMedia("(orientation:landscape)").matches ? "landscape" : "portrait";
    });

    window.__foldroneCapabilities = adaptiveCapabilitySnapshot();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  init();
})();
