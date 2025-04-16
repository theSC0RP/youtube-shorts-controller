document.addEventListener('DOMContentLoaded', function () {
  let toggleExtension = document.getElementById('toggleExtension');

  // Get the current extension state from storage
  chrome.storage.local.get('extensionEnabled', function (data) {
      toggleExtension.checked = data.extensionEnabled;
  });

  // Toggle extension state when checkbox is clicked
  toggleExtension.addEventListener('change', function () {
      let isEnabled = toggleExtension.checked;
      
      // Update extension state in storage
      chrome.storage.local.set({ 'extensionEnabled': isEnabled });
  });


  let toggleVoiceCommand = document.getElementById('toggleVoiceCommand');

  // Get the current voice command state from storage
  chrome.storage.local.get('voiceCommandsEnabled', function (data) {
      toggleVoiceCommand.checked = data.voiceCommandsEnabled;
  });

  // Toggle voice commands state when checkbox is clicked
  toggleVoiceCommand.addEventListener('change', function () {
    let areVoiceCommandsEnabled = toggleVoiceCommand.checked;
    
    // Update voice commands state in storage
    chrome.storage.local.set({ 'voiceCommandsEnabled': areVoiceCommandsEnabled });
  });
});