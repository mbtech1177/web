function sendIntoActiveTab(data) {
  if (!activeTab || !data) return

  console.log('sending message to', activeTab.id, data)
  chrome.tabs.sendMessage(activeTab.id, data)
}

let activeTab = null

function updateActive(tab) {
    activeTab = tab
}
function onActivated(info) {
    chrome.tabs.get(info.tabId, updateActive)
}
function onUpdated(info, tab) {
    if (tab.active)
        updateActive(tab)
}
chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
    updateActive(tabs[0])
})

chrome.tabs.onActivated.addListener(onActivated)
chrome.tabs.onUpdated.addListener(onUpdated)
