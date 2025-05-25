async function getTranscriptText() {
  const transcriptButton = [...document.querySelectorAll("button")].find(btn =>
    btn.innerText.includes("Transcript") || btn.getAttribute("aria-label")?.includes("Transcript")
  );
  if (transcriptButton) transcriptButton.click();

  await new Promise(res => setTimeout(res, 1000)); // wait for the transcript to load

  const items = [...document.querySelectorAll("#segments-container yt-formatted-string")];
  return items.map(el => el.textContent).join(" ");
}

function createSidebar(transcript) {
  if (document.querySelector("#yt-transcript-sidebar")) return;

  const sidebar = document.createElement("div");
  sidebar.id = "yt-transcript-sidebar";
  sidebar.innerHTML = `
    <h3>Video Transcript</h3>
    <textarea id="yt-transcript-text">${transcript}</textarea>
    <button id="copy-transcript">Copy Transcript</button>
    <button id="summarize-btn">Summarize</button>
  `;
  document.body.appendChild(sidebar);

  document.getElementById("copy-transcript").onclick = () => {
    navigator.clipboard.writeText(transcript);
    alert("Transcript copied!");
  };

  document.getElementById("summarize-btn").onclick = () => {
    chrome.storage.local.get(["platform", "prompt"], ({ platform, prompt }) => {
      if (!platform || !prompt) {
        alert("Please set platform and prompt via the extension popup.");
        return;
      }
      const finalPrompt = prompt.replace("[transcript]", transcript);
      let url;
      if (platform === "ChatGPT") url = "https://chat.openai.com/";
      else if (platform === "Gemini") url = "https://gemini.google.com/";
      else if (platform === "Claude") url = "https://claude.ai/";

      chrome.runtime.sendMessage({ action: "openAI", url, prompt: finalPrompt });
    });
  };
}

(async () => {
  const transcript = await getTranscriptText();
  if (transcript) createSidebar(transcript);
})();
