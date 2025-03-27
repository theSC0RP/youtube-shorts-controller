let flag = false;
function checkProgressBar() {
  if (document) {
    // Get the progress bar element
    var progressBar = document.querySelector('[aria-valuenow]');
    
    if (progressBar) {
      // Get the aria-valuenow attribute value
      var progressValue = progressBar.getAttribute("aria-valuenow");
      
      if (progressValue != 0 && progressValue>97) {
        flag = true
      } else if (progressValue == 0 && flag == true) {
        flag = false
        chrome.runtime.sendMessage({ action: "progressComplete" });
      }
    }
  }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Check if the message indicates to click the button
  if (message.action === "clickButton") {
      // Perform the button click
      var button = document.querySelector("#navigation-button-down > ytd-button-renderer > yt-button-shape > button");
      if (button) {
        button.click();
      } else {
        console.log("Button not found.");
      }
  }
});

let currentPathname = window.location.pathname;

// Function to check for changes in the pathname
function checkPathnameChange() {
  if (window.location.pathname !== currentPathname) {
      // Update the currentPathname variable
      currentPathname = window.location.pathname;
      if (checkAdContainer()) {
        chrome.runtime.sendMessage({ action: "progressComplete" });
      }

      checkProgressBar();
  }
}

// Handles ad shorts spearately
const checkAdContainer = () => {
  let adContainer = document.querySelector("ytd-reel-video-renderer[is-active] #experiment-overlay ytd-ad-slot-renderer")
  if (adContainer) {
    flag = false
    chrome.runtime.sendMessage({ action: "progressComplete" });
  }

  return adContainer;
}

const check = () => {
  chrome.storage.sync.get('extensionEnabled', function (data) {
    if (data.extensionEnabled) {
      checkProgressBar();
      checkPathnameChange();
    } 
  });
}

setInterval(check, 10);