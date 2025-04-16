let flag = false;
let currentPathname = window.location.pathname;

// Check if the ad container is active
function checkAdContainer() {
  const adContainer = document.querySelector(
    "ytd-reel-video-renderer[is-active] #experiment-overlay ytd-ad-slot-renderer"
  );
  if (adContainer) {
    console.log("Ad detected, skipping...");
    flag = false;
    chrome.runtime.sendMessage({ action: "progressComplete" });
  }
  return !!adContainer;
}

// Check if the video progress is near completion
function checkProgressBar() {
  const progressBar = document.querySelector('[aria-valuenow]');
  if (!progressBar) return;

  const progressValue = parseFloat(progressBar.getAttribute("aria-valuenow"));
  if (isNaN(progressValue)) return;

  if (progressValue > 90) {
    flag = true;
  } else if (progressValue === 0 && flag) {
    console.log("Progress completed. Requesting next short...");
    flag = false;
    chrome.runtime.sendMessage({ action: "progressComplete" });
  }
}

// Monitor if the URL path has changed (for Shorts navigation)
function checkPathnameChange() {
  if (window.location.pathname !== currentPathname) {
    currentPathname = window.location.pathname;
    console.log("Short changed:", currentPathname);

    if (checkAdContainer()) return;

    checkProgressBar();
  }
}

// Respond to background message to click "Next" button
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clickButton") {
    const button = document.querySelector(
      "#navigation-button-down > ytd-button-renderer > yt-button-shape > button"
    );
    if (button) {
      console.log("Clicking 'Next' button.");
      button.click();
    } else {
      console.log("Navigation button not found.");
    }
  }
});

// Main check function, runs on interval
function check() {
  chrome.storage.local.get('extensionEnabled', (data) => {
    if (data.extensionEnabled) {
      checkPathnameChange();
      checkProgressBar();
    }
  });
}

chrome.storage.local.get(['voiceCommandsEnabled'], (data) => {
  if (data.voiceCommandsEnabled) {
    console.log("Voice command is enabled. Starting recognition...");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    
    console.log(recognition)
    recognition.onresult = function (event) {
      console.log(event)
      const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Recognized command:", command);

      const video = document.querySelector(
        "#shorts-player > div.html5-video-container > video"
      );
      if (!video) {
        console.log("Video element not found.");
        return;
      }

      switch (command) {
        case "play":
          video.play();
          break;
        case "pause":
          video.pause();
          break;
        case "next":
        case "front":
          const nextBtn = document.querySelector(
            "#navigation-button-down > ytd-button-renderer > yt-button-shape > button"
          );
          nextBtn?.click();
          break;
        case "back":
          const backBtn = document.querySelector(
            "#navigation-button-up > ytd-button-renderer > yt-button-shape > button"
          );
          backBtn?.click();
          break;
        default:
          console.log("Unknown command:", command);
      }
    };

    recognition.onerror = function (event) {
      console.error("Speech recognition error:", event.error);
      recognition.start()
    };

    recognition.onend = function () {
      console.log("Speech recognition ended. Restarting...");
      recognition.start(); // Keep it listening
    };

    recognition.start();
  } else {
    console.log("Voice command is disabled.");
  }
});

// Run check every 500ms instead of 10ms to reduce load
setInterval(check, 10);

// TODO: 
// bug fix - need to reload page for extension to work (reloading must be injecting the content script)
// reduce the time needed to for voice command to take the desired action