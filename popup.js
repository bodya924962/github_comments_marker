chrome.tabs.query({ active: true }, tabs => {
  chrome.tabs.executeScript({
    file: "contentScript.js",
  })
})