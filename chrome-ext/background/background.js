
window.user = {}

const saveToHistory = (request, response) => {
  const savedAt = Date.now()
  return new Promise((resolve, reject) => {
    resolve(response)
    // chrome.storage.local.get(['history'], ({ history = [] }) => {
    //   const entry = { savedAt, request, response }
    //   chrome.storage.local.set({ history: [ ...history, entry ]}, () => {
    //   })
    // })
    //
    // setTimeout(() => reject('Storage Error: Cant save to history (you probably can ignore this error)'), 5000)
  })
}

const getHistory = () => new Promise((resolve, reject) => {
  chrome.storage.local.get(['history'], ({ history = [] }) => {
    resolve(history)
  })
})

const replyToRequest = (sender, req_id, data) => {
  return chrome.tabs.sendMessage(sender.tab.id, { req_id, ...data })
}

document.addEventListener('DOMContentLoaded', async () => {
  const { username, password } = await getCredentials()

  if (!username || !password) {
    console.error(`No credentials`)
  }

  window.instagram = new Instagram(username, password)
  window.user = await instagram.login()

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('message', message)
    console.log('sender', sender)

    const { req_id, method, params } = message

    if (method === 'login') {
      if (!window.user) window.user = await instagram.login()
      return replyToRequest(sender, req_id, { status: 'ok', user: window.user })
    }

    if (method === 'get_history') {
      return replyToRequest(sender, req_id, { status: 'ok', history })
    }

    instagram.callMethod(method, ...params)
      .then(res => saveToHistory({ method, params }, res))
      .then(res => replyToRequest(sender, req_id, res))
      .catch(err => {
        console.error(err)
        replyToRequest(sender, req_id, { status: 'error', message: err.message })
      })

  })

}, false);


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
