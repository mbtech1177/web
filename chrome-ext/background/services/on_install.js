chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({ url: "popup/popup.html" }, function (tab) {
      
    })
})
