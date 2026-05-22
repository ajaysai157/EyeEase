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

function applyComfortOverlay(opacity = 0.08) {
  const existing = document.getElementById("eyeease-overlay");

  if (existing) return;

  const overlay = document.createElement("div");

  overlay.id = "eyeease-overlay";

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";

  overlay.style.width = "100vw";
  overlay.style.height = "100vh";

  overlay.style.pointerEvents = "none";

  overlay.style.zIndex = "999999999";

  overlay.style.background = `rgba(255, 180, 120, ${opacity})`;

  overlay.style.mixBlendMode = "multiply";

  document.body.appendChild(overlay);
}

function applyNightComfort() {
  const hour = new Date().getHours();

  if (hour >= 20 || hour <= 6) {
    document.documentElement.style.filter += " sepia(0.08)";
  }
}

function initializeEyeEase() {
  chrome.storage.local.get(["enabled", "intensity"], (data) => {
    const enabled = data.enabled ?? true;

    if (!enabled) return;

    const brightness = analyzePageBrightness();

    if (brightness > 180) {
      applyComfortOverlay(0.1);

      applyNightComfort();
    }
  });
}

initializeEyeEase();
