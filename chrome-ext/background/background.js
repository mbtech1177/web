const replyToRequest = (sender, req_id, data) => {
  console.log('reply to', req_id, data)
  if (sender.tab) {
    return chrome.tabs.sendMessage(sender.tab.id, { req_id, ...data })
  } else {
    return chrome.runtime.sendMessage(sender.id, { req_id, ...data })
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const { username, password } = await getCredentials()

  window.instagram = new Instagram()
  window.user = {}

  if (!username || !password) {
    console.log(`No credentials!`)
  } else {
    window.user = await instagram.login(username, password)
  }

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('message', message)
    console.log('sender', sender)

    const { req_id, method, params } = message

    try {
      if (method === 'login') {
        const [ username, password ] = params || []

        try {
          window.user = await instagram.login(username, password, true)

          return replyToRequest(sender, req_id, { status: 'ok', user: window.user })
        } catch (err) {
          console.error(err)
          return replyToRequest(sender, req_id, { status: 'error', error: err.message })
        }
      }

      if (method === 'exit') {
        // TODO: logout
        window.user = {}
        return replyToRequest(sender, req_id, { status: 'ok', user: window.user })
      }

      if (method === 'check_login') {
        if (!window.user) {
          window.user = instagram.user
        }

        return replyToRequest(sender, req_id, { status: 'ok', user: window.user })
      }

      if (method === 'get_history') {
        return replyToRequest(sender, req_id, { status: 'ok', history })
      }

      if (!instagram) {
        return replyToRequest(sender, req_id, { status: 'error', error: 'Not initialized' })
      }

      const res = await instagram.callMethod(method, ...params)

      saveToHistory({ method, params }, res)
      return replyToRequest(sender, req_id, res)
    } catch (err) {
      console.error(err)
      return replyToRequest(sender, req_id, { status: 'error', error: err.message })
    }

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
