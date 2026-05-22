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

function applyComfortFilter(intensity = 0.92) {
  document.documentElement.style.filter = `
    brightness(${intensity})
    contrast(0.96)
    saturate(0.95)
  `;
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
    const intensity = data.intensity ?? 0.92;

    if (!enabled) return;

    const brightness = analyzePageBrightness();
    if (!enabled) return;

    const brightness = analyzePageBrightness();

    if (brightness > 180) {
      applyComfortFilter(intensity);
      applyNightComfort();
    }
  });
}

initializeEyeEase();
