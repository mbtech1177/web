chrome.runtime.onInstalled.addListener(async function (object) {
  const { username, password } = await getCredentials()

  if (!username || !password) {
    chrome.tabs.create({ url: "popup/popup.html" }, function (tab) {})
  }
})
