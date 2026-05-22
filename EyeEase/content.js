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

function applyComfortOverlay(opacity = 0.1) {
  let overlay = document.getElementById("eyeease-overlay");

  if (!overlay) {
    overlay = document.createElement("div");

    overlay.id = "eyeease-overlay";

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";

    overlay.style.width = "100vw";
    overlay.style.height = "100vh";

    overlay.style.pointerEvents = "none";

    overlay.style.zIndex = "999999999";

    overlay.style.mixBlendMode = 'soft-light';

    document.body.appendChild(overlay);
  }

  overlay.style.backdropFilter = `
  brightness(0.96)
  saturate(0.92)
  contrast(0.94)
`;

overlay.style.background =
  `rgba(255, 210, 160, ${opacity})`;
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
      const overlayOpacity = (1 - intensity) * 1.8;

      applyComfortOverlay(overlayOpacity);

      applyNightComfort();
    }
  });
}

initializeEyeEase();

chrome.storage.onChanged.addListener((changes) => {

  if (changes.intensity) {

    const intensity = changes.intensity.newValue;

    const overlayOpacity = (1 - intensity) * 1.8;

    applyComfortOverlay(overlayOpacity);
  }

  if (changes.enabled) {

    const enabled = changes.enabled.newValue;

    const overlay =
      document.getElementById('eyeease-overlay');

    if (overlay) {

      overlay.style.display =
        enabled ? 'block' : 'none';
    }
  }
});