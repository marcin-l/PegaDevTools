/*chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "https://marcinlesniak.pl/PegaDevTools";
    chrome.tabs.create({ url: newURL });
});*/
/*
 chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log('The color is green.');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
  
  
  */
  
  
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// 	if(request.cmd == "read_file") {
// 		$.ajax({
// 			url: chrome.extension.getURL(request.file),
// 			dataType: "html",
// 			success: sendResponse
// 	});
// 	return true;
// 	}
// })