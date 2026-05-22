const toggle = document.getElementById('toggle');
const intensity = document.getElementById('intensity');

chrome.storage.local.get(
  ['enabled', 'intensity'],
  (data) => {
    toggle.checked = data.enabled ?? true;
    intensity.value = data.intensity ?? 0.92;
  }
);

toggle.addEventListener('change', () => {
  chrome.storage.local.set({
    enabled: toggle.checked
  });
});

intensity.addEventListener('input', () => {
  chrome.storage.local.set({
    intensity: intensity.value
  });
});