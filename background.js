chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    intensity: 0.92
  });
});