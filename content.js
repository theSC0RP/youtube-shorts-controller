let flag = false;
function checkProgressBar() {
  if (document) {
    // Get the progress bar element
    var progressBar = document.getElementById("progress-bar-line");

    if (progressBar) {
      // Get the aria-valuenow attribute value
      var progressValue = progressBar.getAttribute("aria-valuenow");
      console.log("Next video will be played");
      
      // Check if the progress value is equal to 100
      if (progressValue != 0 && progressValue>97) {
          flag = true
          // Send a message to the background script indicating that the progress reached 100
          
          // clearInterval(progressInterval); // Stop checking once it reaches 100
      } else if (progressValue == 0 && flag == true) {
        console.log("changing video")
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
      console.log("Click button");
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
      checkProgressBar();
  }
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