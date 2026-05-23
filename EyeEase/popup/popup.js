const toggle =
  document.getElementById("toggle");

const intensity =
  document.getElementById("intensity");

const intensityValue =
  document.getElementById(
    "intensity-value"
  );

const currentMode =
  document.getElementById(
    "current-mode"
  );

// LOAD SETTINGS
chrome.storage.local.get(
  ["enabled", "intensity"],
  (data) => {

    const enabled =
      data.enabled ?? true;

    // Convert internal value to %
    const savedIntensity =
      data.intensity ?? 0.5;

    const percentage =
      Math.round(savedIntensity * 100);

    toggle.checked = enabled;

    intensity.value = percentage;

    intensityValue.textContent =
      `${percentage}%`;

    detectMode();
  }
);

// DETECT MODE
function detectMode() {

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },

    (tabs) => {

      const url = tabs[0].url;

      if (
        url.includes("leetcode") ||
        url.includes("github")
      ) {

        currentMode.textContent =
          "Coding";
      }

      else if (
        url.includes("youtube") ||
        url.includes("netflix")
      ) {

        currentMode.textContent =
          "Media";
      }

      else if (
        url.includes("wikipedia") ||
        url.includes("medium")
      ) {

        currentMode.textContent =
          "Reading";
      }

      else {

        currentMode.textContent =
          "Adaptive";
      }
    }
  );
}

// TOGGLE
toggle.addEventListener(
  "change",
  () => {

    chrome.storage.local.set({
      enabled: toggle.checked
    });
  }
);

// SLIDER
intensity.addEventListener(
  "input",
  () => {

    const percentage =
      parseInt(intensity.value);

    intensityValue.textContent =
      `${percentage}%`;

    // Convert 0-100 → 0-1
    const normalized =
      percentage / 100;

    chrome.storage.local.set({
      intensity: normalized
    });
  }
);