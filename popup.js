document.addEventListener("DOMContentLoaded", () => {
  const platformSelect = document.getElementById("platform");
  const promptTextarea = document.getElementById("prompt");

  chrome.storage.local.get(["platform", "prompt"], data => {
    if (data.platform) platformSelect.value = data.platform;
    if (data.prompt) promptTextarea.value = data.prompt;
  });

  document.getElementById("save").addEventListener("click", () => {
    const platform = platformSelect.value;
    const prompt = promptTextarea.value;
    chrome.storage.local.set({ platform, prompt }, () => {
      alert("Settings saved!");
    });
  });
});
