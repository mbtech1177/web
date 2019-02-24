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
  window.instagram.history = new ChromeHistory()
  window.instagram.confirmator = new AllowAll()
  window.stats = new InstagramStats(window.instagram)

  if (!username || !password) {
    console.log(`No credentials!`)
  } else {
    const user = await instagram.login(username, password)
  }

  chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {

    console.log('message', message)
    console.log('sender', sender)

    const { method, params } = message


    try {
      if (method === 'ping') {
        return sendResponse({ status: 'ok', pong: 'pong' })
      }

      if (method === 'stats') {
        await stats.updateValues()

        const data = await stats.getInfo()

        return sendResponse({ status: 'ok', data })
      }

      if (method === 'login') {
        const [ username, password ] = params || []

        try {
          const user = await instagram.login(username, password, true)

          return sendResponse({ status: 'ok', user })
        } catch (err) {
          console.error(err)
          return sendResponse({ status: 'error', error: err.message })
        }
      }

      if (method === 'exit') {
        // TODO: logout
        instagram.user = {}
        return sendResponse({ status: 'ok', user: instagram.user })
      }

      if (method === 'check_login') {
        if (!instagram.user) {
          instagram.user = instagram.user
        }

        return sendResponse({ status: 'ok', user: instagram.user })
      }

      if (method === 'get_history') {
        const history = await getHistory(...params)

        return sendResponse({ status: 'ok', history })
      }

      if (!instagram) {
        return sendResponse({ status: 'error', error: 'Not initialized' })
      }

      const res = await instagram.callMethod(method, ...params)

      return sendResponse({ status: res.status })
    } catch (err) {
      console.error(err)
      return sendResponse({ status: 'error', error: err.message })
    }

  });

  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log('message', message)
    console.log('sender', sender)

    const { req_id, method, params } = message

    try {
      if (method === 'login') {
        const [ username, password ] = params || []

        try {
          const user = await instagram.login(username, password, true)

          return replyToRequest(sender, req_id, { status: 'ok', user })
        } catch (err) {
          console.error(err)
          return replyToRequest(sender, req_id, { status: 'error', error: err.message })
        }
      }

      if (method === 'exit') {
        // TODO: logout
        instagram.user = {}
        return replyToRequest(sender, req_id, { status: 'ok', user: instagram.user })
      }

      if (method === 'check_login') {
        return replyToRequest(sender, req_id, { status: 'ok', user: instagram.user })
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
