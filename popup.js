document.addEventListener('DOMContentLoaded', function () {
  var toggleExtension = document.getElementById('toggleExtension');

  // Get the current extension state from storage
  chrome.storage.sync.get('extensionEnabled', function (data) {
      toggleExtension.checked = data.extensionEnabled;
  });

  // Toggle extension state when checkbox is clicked
  toggleExtension.addEventListener('change', function () {
      var isEnabled = toggleExtension.checked;
      
      // Update extension state in storage
      chrome.storage.sync.set({ 'extensionEnabled': isEnabled });
  });
});