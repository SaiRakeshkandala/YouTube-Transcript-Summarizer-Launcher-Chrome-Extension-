chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openAI") {
    chrome.tabs.create({ url: request.url }, tab => {
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => {
            navigator.clipboard.writeText(text);
          },
          args: [request.prompt]
        });
      }, 1500);
    });
  }
});
