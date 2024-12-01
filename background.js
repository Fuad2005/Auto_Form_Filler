chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'saveData') {
      chrome.storage.local.set(request.data, function() {
        console.log('Data saved');
      });
    }
    if (request.action === 'getData') {
      chrome.storage.local.get(request.data, function(result) {
        sendResponse(result);
      });
    }
    if (request.action === 'loadData') {
      chrome.storage.local.get(request.data, function(result) {
        const data = result || {};
        sendResponse(data);
      });
      return true; // Keep the message channel open
    }

  });


chrome.storage.local.get('Default-Profile', function(result) {
  
    if (!result['Default-Profile']) {
      chrome.storage.local.set({ 'Default-Profile': {} }, function() {
        console.log('Default-Profile added');
      });
    }
  });



chrome.storage.local.get('applications', function(result) {
  
    if (!result['applications']) {
      chrome.storage.local.set({ 'applications': [] }, function() {
        console.log('applications added');
      });
    }
  });



