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
  });


chrome.storage.local.get('DefaultProfile', function(result) {
  
    if (!result['DefaultProfile']) {
      chrome.storage.local.set({ 'DefaultProfile': {} }, function() {
        console.log('DefaultProfile added');
      });
    }
  });



