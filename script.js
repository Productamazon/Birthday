const pageConfig = {
  friendName: "Ananda Krishna Siva",
  birthdayMonthDay: "03-07",
  birthYear: 2000,
};

const LOADER_DURATION_MS = 3000;
const PERF_PROFILE = "balanced-premium";
const MEDIA_PROFILE = "curated-stock";
const THEME_MODE = "batman-explicit";
const CTA_MOTION_PROFILE = "touch-cinematic";
const MOBILE_COMPAT_PROFILE = "redmi-chrome";
const REDMI_VIEWPORTS = [
  { name: "redmi-note-12", width: 393, height: 873, deviceScaleFactor: 2.75 },
  { name: "redmi-note-11", width: 393, height: 851, deviceScaleFactor: 2.75 },
  { name: "redmi-9a", width: 360, height: 800, deviceScaleFactor: 2.5 },
];

const INSPIRATION_SOURCES = [
  { url: "https://letusibiza.com/", focus: "event preloader drama and launch cuts" },
  { url: "https://www.gsproductions.co.za/", focus: "cinematic hero authority and pacing" },
  { url: "https://www.adovasio.it/", focus: "smooth progression and precision reveal cadence" },
  { url: "https://www.jasonbergh.com/", focus: "GSAP-style stagger choreography and depth interaction" },
  { url: "https://shift5.io/", focus: "minimal high-contrast structure and restraint" },
  { url: "https://www.neonrated.com/", focus: "high-energy transitions and glow accents" },
  { url: "https://www.uiuxsam.com/", focus: "portfolio-grade reveal polish and flow" },
];

const MEDIA_MANIFEST = {
  loopCity: { src: "assets/media/noir_loop_city.webm", intent: "hero-loop", kind: "video" },
  noir01: { src: "assets/media/noir_city_01.webp", intent: "city-still-primary", kind: "image" },
  noir02: { src: "assets/media/noir_city_02.webp", intent: "city-still-secondary", kind: "image" },
  noir03: { src: "assets/media/noir_city_03.webp", intent: "city-still-tertiary", kind: "image" },
};

const PERF_TUNINGS = {
  "balanced-premium": {
    mistCount: 86,
    rainCount: 152,
    emberCount: 102,
    confettiCelebrate: 210,
    confettiZero: 332,
    mobileFxScale: 1,
  },
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileQuery = window.matchMedia("(max-width: 760px)");

document.querySelectorAll("[data-friend-name]").forEach((node) => {
  node.textContent = pageConfig.friendName;
});

document.body.dataset.perfProfile = PERF_PROFILE;
document.body.dataset.mediaProfile = MEDIA_PROFILE;
document.body.dataset.themeMode = THEME_MODE;
document.body.dataset.ctaMotionProfile = CTA_MOTION_PROFILE;
document.body.dataset.mobileCompatProfile = MOBILE_COMPAT_PROFILE;

const activePerfTuning = PERF_TUNINGS[PERF_PROFILE] || PERF_TUNINGS["balanced-premium"];

window.__BIRTHDAY_SITE_CONFIG = {
  friendName: pageConfig.friendName,
  birthdayMonthDay: pageConfig.birthdayMonthDay,
  birthYear: pageConfig.birthYear,
  LOADER_DURATION_MS,
  PERF_PROFILE,
  MEDIA_PROFILE,
  THEME_MODE,
  CTA_MOTION_PROFILE,
  MOBILE_COMPAT_PROFILE,
  REDMI_VIEWPORTS,
  INSPIRATION_SOURCES,
};

const openingSequence = document.getElementById("openingSequence");
const loadingBar = document.getElementById("loadingBar");
const openingCount = document.getElementById("openingCount");
const loadingStage = document.getElementById("loadingStage");
const loadingPhases = document.getElementById("loadingPhases");
const heroLoopVideo = document.getElementById("heroLoopVideo");

function resolveMediaSource(key) {
  const entry = MEDIA_MANIFEST[key];
  return entry ? entry.src : "";
}

function hydrateMediaNode(node) {
  const mediaKey = node.dataset.mediaKey;
  if (!mediaKey) {
    return;
  }
  const src = resolveMediaSource(mediaKey);
  if (!src) {
    return;
  }

  if (node.tagName === "VIDEO") {
    const posterKey = node.dataset.posterKey;
    if (posterKey) {
      const posterSrc = resolveMediaSource(posterKey);
      if (posterSrc) {
        node.setAttribute("poster", posterSrc);
      }
    }
    if (prefersReducedMotion) {
      return;
    }
    if (!node.getAttribute("src")) {
      node.setAttribute("src", src);
      node.load();
    }
    return;
  }

  if (node.tagName === "IMG" && !node.getAttribute("src")) {
    node.setAttribute("src", src);
    if (node.complete) {
      node.classList.add("ready");
      return;
    }
    node.addEventListener(
      "load",
      () => {
        node.classList.add("ready");
      },
      { once: true }
    );
  }
}

function initDeferredMedia() {
  const nodes = Array.from(document.querySelectorAll(".deferred-media"));
  if (!nodes.length) {
    return;
  }

  const immediate = nodes.filter((node) => node.id === "heroLoopVideo");
  immediate.forEach(hydrateMediaNode);

  const deferred = nodes.filter((node) => node.id !== "heroLoopVideo");
  if (!deferred.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    deferred.forEach((node) => {
      hydrateMediaNode(node);
      if (node.tagName === "VIDEO") {
        node.classList.add("ready");
      }
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          hydrateMediaNode(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "220px 0px 220px 0px", threshold: 0.01 }
  );

  deferred.forEach((node) => observer.observe(node));
}

function syncHeroLoopState() {
  if (!heroLoopVideo) {
    return;
  }
  if (prefersReducedMotion) {
    heroLoopVideo.pause();
    return;
  }
  if (document.hidden) {
    heroLoopVideo.pause();
  } else {
    heroLoopVideo.play().catch(() => {});
  }
}

if (heroLoopVideo) {
  heroLoopVideo.addEventListener("canplay", () => {
    heroLoopVideo.classList.add("ready");
    syncHeroLoopState();
  });
  heroLoopVideo.addEventListener("error", () => {
    heroLoopVideo.classList.add("ready");
  });
  window.setTimeout(() => {
    if (!heroLoopVideo.classList.contains("ready")) {
      heroLoopVideo.classList.add("ready");
    }
  }, 2200);
}

function setLoadingPhase(index) {
  if (!loadingPhases) {
    return;
  }
  loadingPhases.querySelectorAll("span").forEach((node, idx) => {
    node.classList.toggle("active", idx <= index);
  });
}

function hideLoader() {
  if (!openingSequence) {
    return;
  }
  openingSequence.classList.add("launching");
  window.setTimeout(() => {
    openingSequence.classList.add("hidden");
  }, 640);
}

function runOpeningSequence() {
  if (!openingSequence || !loadingBar || !openingCount || !loadingStage) {
    return;
  }

  const stageLines = [
    "BATCAVE BOOT // visual core",
    "SIGNAL SYNC // transition matrix",
    "CITY LAUNCH // final lock",
  ];

  const duration = prefersReducedMotion ? 1600 : LOADER_DURATION_MS;
  const start = performance.now();
  let stageIndex = 0;
  let lastRounded = -1;
  setLoadingPhase(0);
  loadingStage.textContent = stageLines[0];

  function animate(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = progress * 100;
    const rounded = Math.round(value);

    if (rounded !== lastRounded) {
      lastRounded = rounded;
      openingCount.textContent = `${rounded}%`;
      loadingBar.style.width = `${value}%`;
    }

    let nextStage = 0;
    if (progress >= 2 / 3) {
      nextStage = 2;
    } else if (progress >= 1 / 3) {
      nextStage = 1;
    }
    if (nextStage !== stageIndex) {
      stageIndex = nextStage;
      loadingStage.textContent = stageLines[nextStage];
      setLoadingPhase(nextStage);
    }

    if (progress < 1) {
      window.requestAnimationFrame(animate);
      return;
    }

    loadingStage.textContent = "LAUNCH COMPLETE.";
    setLoadingPhase(stageLines.length - 1);
    hideLoader();
  }

  window.requestAnimationFrame(animate);
}

function initSectionHandoffs() {
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if (!document.body.dataset.activeSection) {
    document.body.dataset.activeSection = "hero";
  }

  if (!sections.length || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .slice(0, 1)
        .forEach((entry) => {
          document.body.dataset.activeSection = entry.target.id;
        });
    },
    {
      threshold: [0.24, 0.4, 0.6, 0.8],
      rootMargin: "-10% 0px -45% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

const revealItems = document.querySelectorAll(".reveal");
revealItems.forEach((node, index) => {
  node.style.transitionDelay = `${(index % 7) * 55}ms`;
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("show"));
}

const heroCtas = Array.from(document.querySelectorAll(".hero-actions .btn"));
const cinematicActionButtons = Array.from(document.querySelectorAll(".toggle-btn, .dock-btn, .board-nav"));
const ctaStateTimers = new WeakMap();

function getCtaTimers(node) {
  if (!ctaStateTimers.has(node)) {
    ctaStateTimers.set(node, { release: 0, glint: 0 });
  }
  return ctaStateTimers.get(node);
}

function clearCtaTimer(node, timerKey) {
  const timers = getCtaTimers(node);
  if (timers[timerKey]) {
    window.clearTimeout(timers[timerKey]);
    timers[timerKey] = 0;
  }
}

function pulseCtaGlint(node) {
  clearCtaTimer(node, "glint");
  node.classList.add("is-glinting");
  const timers = getCtaTimers(node);
  timers.glint = window.setTimeout(() => {
    node.classList.remove("is-glinting");
    timers.glint = 0;
  }, 380);
}

function releaseCta(node) {
  node.classList.remove("is-pressed");
  node.classList.add("is-releasing");
  clearCtaTimer(node, "release");
  const timers = getCtaTimers(node);
  timers.release = window.setTimeout(() => {
    node.classList.remove("is-releasing");
    timers.release = 0;
  }, 220);
}

function pressCta(node) {
  node.classList.remove("is-releasing");
  node.classList.add("is-pressed");
  pulseCtaGlint(node);
}

function scrollToAnchorTarget(anchor) {
  const href = anchor.getAttribute("href");
  if (!href || !href.startsWith("#")) {
    return;
  }
  const target = document.querySelector(href);
  if (!target) {
    return;
  }
  const offset = prefersReducedMotion ? 0 : 150;
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    if (history.replaceState) {
      history.replaceState(null, "", href);
    }
  }, offset);
}

function initHeroCtaStates() {
  const allInteractiveButtons = [...heroCtas, ...cinematicActionButtons];
  allInteractiveButtons.forEach((cta) => {
    cta.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      pressCta(cta);
    });

    cta.addEventListener("pointerup", () => {
      releaseCta(cta);
    });

    cta.addEventListener("pointercancel", () => {
      releaseCta(cta);
    });

    cta.addEventListener("pointerleave", () => {
      if (!cta.classList.contains("is-pressed")) {
        return;
      }
      releaseCta(cta);
    });

    cta.addEventListener("blur", () => {
      cta.classList.remove("is-focused");
      cta.classList.remove("is-pressed");
      cta.classList.remove("is-glinting");
    });

    cta.addEventListener("focus", () => {
      cta.classList.add("is-focused");
    });

    cta.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        if (event.key === " ") {
          event.preventDefault();
        }
        pressCta(cta);
      }
    });

    cta.addEventListener("keyup", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        releaseCta(cta);
        if (event.key === " " && cta.tagName === "A") {
          cta.click();
        }
      }
    });
  });

  heroCtas
    .filter((cta) => cta.tagName === "A")
    .forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || !href.startsWith("#")) {
          return;
        }
        event.preventDefault();
        releaseCta(anchor);
        scrollToAnchorTarget(anchor);
      });
    });
}

const liveTimecode = document.getElementById("liveTimecode");
function updateTimecode() {
  if (!liveTimecode) {
    return;
  }
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  liveTimecode.textContent = `${hh}:${mm}:${ss}`;
}

const countdownTarget = document.getElementById("countdownTarget");
const countdownStatus = document.getElementById("countdownStatus");
const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");
let zeroTriggered = false;

function parseMonthDay(monthDay) {
  const [month, day] = monthDay.split("-").map((value) => Number(value));
  if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  return { month, day };
}

function nextBirthdayDate(month, day) {
  const now = new Date();
  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0, 0);
  if (target <= now) {
    target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
  }
  return target;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function runCountdown() {
  if (!countdownTarget || !countdownStatus || !cdDays || !cdHours || !cdMinutes || !cdSeconds) {
    return;
  }

  const parsed = parseMonthDay(pageConfig.birthdayMonthDay);
  if (!parsed) {
    countdownTarget.textContent = "Invalid date in script.js";
    countdownStatus.textContent = "Use MM-DD";
    return;
  }

  const now = new Date();
  const isBirthdayToday = now.getMonth() + 1 === parsed.month && now.getDate() === parsed.day;
  const targetDate = nextBirthdayDate(parsed.month, parsed.day);
  const displayDate = isBirthdayToday
    ? new Date(now.getFullYear(), parsed.month - 1, parsed.day)
    : targetDate;

  countdownTarget.textContent = `Target: ${displayDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  const birthdayYear = isBirthdayToday ? now.getFullYear() : targetDate.getFullYear();
  const turningAge = birthdayYear - pageConfig.birthYear;

  const tick = () => {
    if (isBirthdayToday) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      countdownStatus.textContent = `LEVEL ${turningAge} UNLOCKED.`;
      triggerZeroCinematic();
      return false;
    }

    const current = new Date();
    const diff = targetDate.getTime() - current.getTime();
    if (diff <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      countdownStatus.textContent = `LEVEL ${turningAge} UNLOCKED.`;
      triggerZeroCinematic();
      return false;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
    countdownStatus.textContent = `COUNTDOWN TO LEVEL ${turningAge}.`;
    return true;
  };

  const active = tick();
  if (!active) {
    return;
  }

  const timer = window.setInterval(() => {
    const keepGoing = tick();
    if (!keepGoing) {
      window.clearInterval(timer);
    }
  }, 1000);
}

const scrollProgressBar = document.getElementById("scrollProgressBar");
function updateScrollProgress() {
  if (!scrollProgressBar) {
    return;
  }
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  scrollProgressBar.style.width = `${Math.max(0, Math.min(100, ratio))}%`;
}

const spotlightLayer = document.querySelector(".spotlight-layer");
if (spotlightLayer && !prefersReducedMotion) {
  let spotlightRaf = 0;
  let nextMx = 0;
  let nextMy = 0;
  window.addEventListener("pointermove", (event) => {
    nextMx = event.clientX;
    nextMy = event.clientY;
    if (spotlightRaf) {
      return;
    }
    spotlightRaf = window.requestAnimationFrame(() => {
      spotlightLayer.style.setProperty("--mx", `${nextMx}px`);
      spotlightLayer.style.setProperty("--my", `${nextMy}px`);
      spotlightRaf = 0;
    });
  });
}

const filmBoard = document.getElementById("filmBoard");
const filmCards = Array.from(document.querySelectorAll(".film-card"));
const showreelPrev = document.getElementById("showreelPrev");
const showreelNext = document.getElementById("showreelNext");
const viewButtons = document.querySelectorAll(".toggle-btn");
const cardTiltState = new WeakMap();
let activeCardIndex = 0;

function syncLayoutByViewport() {
  const isMobile = mobileQuery.matches;
  document.body.classList.toggle("has-mobile-dock", isMobile);
  if (!filmBoard) {
    return;
  }
  filmBoard.classList.toggle("mobile-swipe", isMobile && filmBoard.classList.contains("grid-view"));
}

function setActiveCard(index, shouldScroll = true) {
  if (!filmCards.length) {
    return;
  }
  const safeIndex = ((index % filmCards.length) + filmCards.length) % filmCards.length;
  activeCardIndex = safeIndex;
  filmCards.forEach((card, idx) => card.classList.toggle("active", idx === safeIndex));

  if (shouldScroll) {
    filmCards[safeIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextView = button.dataset.view;
    if (!filmBoard || !nextView) {
      return;
    }

    filmBoard.classList.toggle("grid-view", nextView === "grid");
    filmBoard.classList.toggle("list-view", nextView === "list");
    syncLayoutByViewport();

    viewButtons.forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  });
});

if (showreelPrev) {
  showreelPrev.addEventListener("click", () => {
    setActiveCard(activeCardIndex - 1);
  });
}

if (showreelNext) {
  showreelNext.addEventListener("click", () => {
    setActiveCard(activeCardIndex + 1);
  });
}

filmCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    setActiveCard(index, false);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveCard(index, false);
    }
  });

  if (!prefersReducedMotion) {
    card.addEventListener("pointermove", (event) => {
      if (!filmBoard || filmBoard.classList.contains("list-view") || mobileQuery.matches) {
        return;
      }
      if (!cardTiltState.has(card)) {
        cardTiltState.set(card, { x: 0, y: 0, raf: 0 });
      }
      const state = cardTiltState.get(card);
      state.x = event.clientX;
      state.y = event.clientY;
      if (state.raf) {
        return;
      }
      state.raf = window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = state.x - rect.left;
        const y = state.y - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 9;
        const rotateX = (0.5 - (y / rect.height)) * 9;
        card.style.transform = `perspective(780px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        state.raf = 0;
      });
    });

    card.addEventListener("pointerleave", () => {
      const state = cardTiltState.get(card);
      if (state && state.raf) {
        window.cancelAnimationFrame(state.raf);
        state.raf = 0;
      }
      card.style.transform = "";
    });
  }
});

if (filmBoard) {
  let ticking = false;
  filmBoard.addEventListener("scroll", () => {
    if (!filmBoard.classList.contains("mobile-swipe") || ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(() => {
      const center = filmBoard.scrollLeft + (filmBoard.clientWidth / 2);
      let closest = 0;
      let minDistance = Number.POSITIVE_INFINITY;
      filmCards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + (card.clientWidth / 2);
        const distance = Math.abs(cardCenter - center);
        if (distance < minDistance) {
          minDistance = distance;
          closest = idx;
        }
      });
      setActiveCard(closest, false);
      ticking = false;
    });
  });
}

const intensityRange = document.getElementById("intensityRange");
const intensityValue = document.getElementById("intensityValue");

if (intensityRange && intensityValue) {
  intensityRange.addEventListener("input", () => {
    const value = Number(intensityRange.value);
    intensityValue.textContent = `${value}%`;
    document.documentElement.style.setProperty("--intensity", String(value / 100));
  });
}

const batSignalBtn = document.getElementById("batSignalBtn");
let signalPulse = 0;
if (batSignalBtn) {
  batSignalBtn.addEventListener("click", () => {
    signalPulse = 1;
  });
}

const processSteps = document.querySelectorAll(".process-step");
processSteps.forEach((step) => {
  step.addEventListener("click", () => {
    processSteps.forEach((node) => node.classList.remove("active"));
    step.classList.add("active");
  });
});

const surprisePanel = document.getElementById("surprisePanel");
const surpriseBtn = document.getElementById("surpriseBtn");
const mobileCelebrateBtn = document.getElementById("mobileCelebrateBtn");
const closeSurpriseBtn = document.getElementById("closeSurpriseBtn");

function openSurprise() {
  if (!surprisePanel) {
    return;
  }
  surprisePanel.classList.add("open");
  createConfettiBurst("celebrate");
}

function closeSurprise() {
  if (!surprisePanel) {
    return;
  }
  surprisePanel.classList.remove("open");
}

if (surpriseBtn) {
  surpriseBtn.addEventListener("click", openSurprise);
}
if (mobileCelebrateBtn) {
  mobileCelebrateBtn.addEventListener("click", openSurprise);
}
if (closeSurpriseBtn) {
  closeSurpriseBtn.addEventListener("click", closeSurprise);
}

const zeroCinematic = document.getElementById("zeroCinematic");
const zeroCloseBtn = document.getElementById("zeroCloseBtn");
let fxMode = "idle";

function triggerZeroCinematic() {
  if (zeroTriggered) {
    return;
  }
  zeroTriggered = true;
  fxMode = "zero";
  document.body.classList.add("zero-mode");
  if (zeroCinematic) {
    zeroCinematic.classList.add("open");
  }
  createConfettiBurst("zero");
}

function closeZeroCinematic() {
  fxMode = "idle";
  document.body.classList.remove("zero-mode");
  if (zeroCinematic) {
    zeroCinematic.classList.remove("open");
  }
}

if (zeroCloseBtn) {
  zeroCloseBtn.addEventListener("click", closeZeroCinematic);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSurprise();
    closeZeroCinematic();
  }
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const selector = button.getAttribute("data-jump");
    if (!selector) {
      return;
    }
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas ? fxCanvas.getContext("2d") : null;
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;

let mistParticles = [];
let rainDrops = [];
let embers = [];
let lightning = 0;
let confettiPieces = [];
let confettiFrame = null;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getPerformanceCount(baseCount) {
  const scale = mobileQuery.matches ? activePerfTuning.mobileFxScale : 1;
  return Math.max(16, Math.round(baseCount * scale));
}

function resizeCanvases() {
  if (fxCanvas) {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  mistParticles = Array.from({ length: getPerformanceCount(activePerfTuning.mistCount) }, () => ({
    x: randomBetween(0, window.innerWidth),
    y: randomBetween(0, window.innerHeight),
    r: randomBetween(0.6, 2.1),
    vx: randomBetween(-0.14, 0.14),
    vy: randomBetween(-0.09, 0.09),
  }));

  rainDrops = Array.from({ length: getPerformanceCount(activePerfTuning.rainCount) }, () => ({
    x: randomBetween(0, window.innerWidth),
    y: randomBetween(-window.innerHeight, window.innerHeight),
    len: randomBetween(16, 36),
    speed: randomBetween(9, 21),
  }));

  embers = Array.from({ length: getPerformanceCount(activePerfTuning.emberCount) }, () => ({
    x: randomBetween(0, window.innerWidth),
    y: randomBetween(window.innerHeight * 0.56, window.innerHeight),
    vx: randomBetween(-0.9, 0.9),
    vy: randomBetween(-1.9, -0.5),
    life: randomBetween(0.25, 1),
  }));
}

function renderFx() {
  if (!fxCtx || !fxCanvas) {
    return;
  }

  const width = fxCanvas.width;
  const height = fxCanvas.height;
  fxCtx.clearRect(0, 0, width, height);

  if (fxMode === "zero") {
    fxCtx.fillStyle = "rgba(4, 6, 10, 0.26)";
    fxCtx.fillRect(0, 0, width, height);

    fxCtx.strokeStyle = "rgba(210, 220, 240, 0.2)";
    fxCtx.lineWidth = 1;
    rainDrops.forEach((drop) => {
      fxCtx.beginPath();
      fxCtx.moveTo(drop.x, drop.y);
      fxCtx.lineTo(drop.x - 12, drop.y + drop.len);
      fxCtx.stroke();
      drop.y += drop.speed;
      if (drop.y > height + 40) {
        drop.y = randomBetween(-height * 0.45, -10);
        drop.x = randomBetween(0, width);
      }
    });

    embers.forEach((ember) => {
      fxCtx.fillStyle = `rgba(255, 120, 138, ${ember.life})`;
      fxCtx.fillRect(ember.x, ember.y, 2, 2);
      ember.x += ember.vx;
      ember.y += ember.vy;
      ember.life -= 0.01;
      if (ember.life <= 0 || ember.y < height * 0.2) {
        ember.x = randomBetween(0, width);
        ember.y = randomBetween(height * 0.6, height);
        ember.vx = randomBetween(-0.9, 0.9);
        ember.vy = randomBetween(-1.9, -0.5);
        ember.life = randomBetween(0.25, 1);
      }
    });

    if (Math.random() < 0.02) {
      lightning = 1;
    }
    lightning *= 0.9;
    if (lightning > 0.03) {
      fxCtx.fillStyle = `rgba(240, 246, 255, ${lightning * 0.32})`;
      fxCtx.fillRect(0, 0, width, height);
    }
  } else {
    mistParticles.forEach((particle) => {
      fxCtx.fillStyle = "rgba(195, 204, 223, 0.25)";
      fxCtx.beginPath();
      fxCtx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      fxCtx.fill();
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -4) {
        particle.x = width + 4;
      }
      if (particle.x > width + 4) {
        particle.x = -4;
      }
      if (particle.y < -4) {
        particle.y = height + 4;
      }
      if (particle.y > height + 4) {
        particle.y = -4;
      }
    });
  }

  if (signalPulse > 0) {
    const gradient = fxCtx.createRadialGradient(width * 0.5, height * 0.22, 0, width * 0.5, height * 0.22, width * 0.52);
    gradient.addColorStop(0, `rgba(230, 84, 101, ${signalPulse * 0.28})`);
    gradient.addColorStop(1, "rgba(230, 84, 101, 0)");
    fxCtx.fillStyle = gradient;
    fxCtx.fillRect(0, 0, width, height);
    signalPulse *= 0.91;
  }

  window.requestAnimationFrame(renderFx);
}

function createConfettiBurst(mode) {
  if (!confettiCanvas) {
    return;
  }
  const isZero = mode === "zero";
  const count = getPerformanceCount(isZero ? activePerfTuning.confettiZero : activePerfTuning.confettiCelebrate);
  const palette = isZero
    ? ["#f8cad1", "#ee5f73", "#fbe7ea", "#d22f3f", "#94b7de"]
    : ["#ee5f73", "#f8cad1", "#d22f3f", "#94b7de"];

  confettiPieces = Array.from({ length: count }, () => ({
    x: confettiCanvas.width / 2,
    y: confettiCanvas.height * (isZero ? 0.46 : 0.34),
    size: randomBetween(4.6, 11),
    color: palette[Math.floor(Math.random() * palette.length)],
    vx: randomBetween(-6.4, 6.4),
    vy: randomBetween(isZero ? -10.5 : -8.2, 2),
    gravity: randomBetween(0.08, 0.17),
    rotation: randomBetween(0, Math.PI * 2),
    vr: randomBetween(-0.23, 0.23),
    life: randomBetween(88, 175),
  }));

  if (!confettiFrame) {
    renderConfetti();
  }
}

function renderConfetti() {
  if (!confettiCtx || !confettiCanvas) {
    return;
  }
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let active = 0;

  confettiPieces.forEach((piece) => {
    if (piece.life <= 0) {
      return;
    }
    active += 1;
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += piece.gravity;
    piece.rotation += piece.vr;
    piece.life -= 1;

    confettiCtx.save();
    confettiCtx.translate(piece.x, piece.y);
    confettiCtx.rotate(piece.rotation);
    confettiCtx.globalAlpha = Math.max(piece.life / 175, 0);
    confettiCtx.fillStyle = piece.color;
    confettiCtx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.56);
    confettiCtx.restore();
  });

  if (active > 0) {
    confettiFrame = window.requestAnimationFrame(renderConfetti);
  } else {
    window.cancelAnimationFrame(confettiFrame);
    confettiFrame = null;
  }
}

mobileQuery.addEventListener("change", () => {
  syncLayoutByViewport();
  resizeCanvases();
});
window.addEventListener("resize", () => {
  resizeCanvases();
  syncLayoutByViewport();
  updateScrollProgress();
});
window.addEventListener("scroll", updateScrollProgress, { passive: true });
document.addEventListener("visibilitychange", syncHeroLoopState);
window.addEventListener("focus", syncHeroLoopState);
window.addEventListener("pageshow", syncHeroLoopState);

initDeferredMedia();
initSectionHandoffs();
initHeroCtaStates();
resizeCanvases();
syncLayoutByViewport();
setActiveCard(0, false);
updateScrollProgress();
updateTimecode();
window.setInterval(updateTimecode, 1000);
renderFx();
runCountdown();
runOpeningSequence();
syncHeroLoopState();
