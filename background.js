chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Check if the message indicates that the progress reached 100
  if (message.action === "progressComplete") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "clickButton"});
    });
  }
});

// function triggerButtonClick() {
//   // Send a message to the content script
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {action: "clickButton"});
//   });
// }

