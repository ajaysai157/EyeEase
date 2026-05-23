function getBrightness(r, g, b) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function rgbStringToValues(rgb) {
  const values = rgb.match(/\d+/g);

  if (!values) {
    return [255, 255, 255];
  }

  return values.map(Number);
}

function analyzePageBrightness() {
  const bodyStyle = getComputedStyle(document.body);

  const bgColor = bodyStyle.backgroundColor;

  const [r, g, b] = rgbStringToValues(bgColor);

  return getBrightness(r, g, b);
}

function analyzeVisualEnvironment() {
  const elements = document.querySelectorAll("*");

  let totalBrightness = 0;

  let sampleCount = 0;

  let warmScore = 0;

  let coolScore = 0;

  for (let i = 0; i < elements.length; i += 60) {
    const style = getComputedStyle(elements[i]);

    const bg = style.backgroundColor;

    const values = bg.match(/\d+/g);

    if (!values) continue;

    const [r, g, b] = values.map(Number);

    const brightness = getBrightness(r, g, b);

    totalBrightness += brightness;

    sampleCount++;

    // Warm colors
    if (r > b) {
      warmScore++;
    }

    // Cool colors
    if (b > r) {
      coolScore++;
    }
  }

  const averageBrightness =
    sampleCount > 0 ? totalBrightness / sampleCount : 255;

  return {
    averageBrightness,
    warmScore,
    coolScore,
  };
}

function detectWebsiteMode() {
  const hostname = window.location.hostname;

  // Coding Websites
  if (
    hostname.includes("leetcode") ||
    hostname.includes("github") ||
    hostname.includes("hackerrank") ||
    hostname.includes("codeforces")
  ) {
    return "coding";
  }

  // Reading Websites
  if (
    hostname.includes("wikipedia") ||
    hostname.includes("medium") ||
    hostname.includes("docs") ||
    hostname.includes("notion")
  ) {
    return "reading";
  }

  // Media Websites
  if (
    hostname.includes("youtube") ||
    hostname.includes("netflix") ||
    hostname.includes("primevideo")
  ) {
    return "media";
  }

  return "default";
}

function applyComfortOverlay(opacity = 0.1) {
  const comfortStrength = opacity * 100;

  let overlay = document.getElementById("eyeease-overlay");

  // Create overlay once
  if (!overlay) {
    overlay = document.createElement("div");

    overlay.id = "eyeease-overlay";

    overlay.style.position = "fixed";

    overlay.style.top = "0";

    overlay.style.left = "0";

    overlay.style.width = "100vw";

    overlay.style.height = "100vh";

    overlay.style.pointerEvents = "none";

    overlay.style.zIndex = "2147483647";

    overlay.style.mixBlendMode = "soft-light";

    overlay.style.transition = `
      background 1.4s cubic-bezier(0.22, 1, 0.36, 1),
      backdrop-filter 1.4s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1)
    `;

    overlay.style.opacity = "0";

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });
  }

  overlay.style.display = "block";

  const mode = detectWebsiteMode();

  const visualData = analyzeVisualEnvironment();

  const brightness = visualData.averageBrightness;

  const isVeryBright = brightness > 200;

  const isCoolDominant = visualData.coolScore > visualData.warmScore;

  // =========================
  // CODING MODE
  // =========================
  if (mode === "coding") {
    overlay.style.backdropFilter = `
      brightness(${1 - comfortStrength * 0.0015})
      contrast(${1 - comfortStrength * 0.0012})
      saturate(${1 - comfortStrength * 0.002})
    `;

    overlay.style.background = `rgba(180, 210, 255, ${opacity})`;
  }

  // =========================
  // READING MODE
  // =========================
  else if (mode === "reading") {
    overlay.style.backdropFilter = `
      brightness(${1 - comfortStrength * 0.0012})
      contrast(${1 - comfortStrength * 0.001})
      saturate(${1 - comfortStrength * 0.0015})
    `;

    overlay.style.background = `rgba(255, 220, 180, ${opacity})`;
  }

  // =========================
  // MEDIA MODE
  // =========================
  else if (mode === "media") {
    overlay.style.backdropFilter = `
      brightness(${1 - comfortStrength * 0.001})
      contrast(${1 - comfortStrength * 0.0008})
      saturate(${1 - comfortStrength * 0.0025})
    `;

    overlay.style.background = `rgba(200, 200, 200, ${opacity})`;
  }

  // =========================
  // DEFAULT ADAPTIVE MODE
  // =========================
  else {
    // Very Bright Pages
    if (isVeryBright) {
      overlay.style.backdropFilter = `
        brightness(${1 - comfortStrength * 0.0016})
        contrast(${1 - comfortStrength * 0.0014})
        saturate(${1 - comfortStrength * 0.002})
      `;

      overlay.style.background = `rgba(255, 225, 180, ${opacity})`;
    }

    // Cool Dominant Pages
    else if (isCoolDominant) {
      overlay.style.backdropFilter = `
        brightness(${1 - comfortStrength * 0.0014})
        contrast(${1 - comfortStrength * 0.0012})
        saturate(${1 - comfortStrength * 0.0025})
      `;

      overlay.style.background = `rgba(180, 210, 255, ${opacity})`;
    }

    // Balanced Pages
    else {
      overlay.style.backdropFilter = `
        brightness(${1 - comfortStrength * 0.0012})
        contrast(${1 - comfortStrength * 0.001})
        saturate(${1 - comfortStrength * 0.0018})
      `;

      overlay.style.background = `rgba(255, 210, 160, ${opacity})`;
    }
  }
}

function applyNightComfort() {
  const hour = new Date().getHours();

  if (hour >= 20 || hour <= 6) {
    document.documentElement.style.filter = "sepia(0.08)";
  }
}

function initializeEyeEase() {
  chrome.storage.local.get(["enabled", "intensity"], (data) => {
    const enabled = data.enabled ?? true;

    const intensity = data.intensity ?? 0.92;

    if (!enabled) return;

    // Better perceptual scaling

    const overlayOpacity = Math.pow(intensity, 0.7) * 0.75;

    applyComfortOverlay(overlayOpacity);

    applyNightComfort();
  });
}

// INITIALIZE
initializeEyeEase();

// SETTINGS CHANGE LISTENER
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(["enabled"], (data) => {
    const overlay = document.getElementById("eyeease-overlay");

    // Extension Disabled
    if (!data.enabled) {
      if (overlay) {
        overlay.style.display = "none";
      }

      return;
    }

    // Extension Enabled
    initializeEyeEase();
  });
});

// SPA / DYNAMIC WEBSITE DETECTION
let lastUrl = location.href;

const observer = new MutationObserver(() => {
  const currentUrl = location.href;

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;

    setTimeout(() => {
      initializeEyeEase();
    }, 500);
  }
});

// Wait until page fully loads
window.addEventListener("load", () => {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
