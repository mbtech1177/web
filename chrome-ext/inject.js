let _user = null
let kill = false

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const request = (data) => new Promise((resolve, reject) => {
  if (kill) return reject(`Request was killed`)

  const req_id = Date.now()
  showLoader()

  const handler = (message, sender) => {
    if (req_id === message.req_id) {
      chrome.runtime.onMessage.removeListener(handler)
      console.log('inject.js: request', data.method, '->', message.status, message)
      printLog(`${data.method} -> status: ${message.status}`)
      // printOutput(`${JSON.stringify(message)}`)
      hideLoader()
      resolve(message)
    }
  }

  chrome.runtime.onMessage.addListener(handler)

  chrome.runtime.sendMessage(null, { req_id, ...data })
})

const onConnect = async (event) => {
  event.preventDefault()

  try {
    const { user } = await request({ method: 'login' })

    _user = user

    alert(`Website connected to the extension. Username: @${_user.full_name}`)
  } catch (err) {
    alert(err.message)
  }
}

const onHashtagButton = async (event) => {
  event.preventDefault()

  try {
    const form = document.forms[0]
    const hashtag = form.hashtag.value

    if (!hashtag) {
      throw new Error(`Empty hashtag field!`)
    }

    const { items } = await request({
      method: 'get_hashtag_feed',
      params: [ hashtag ]
    })

    const firstTenItems = items.slice(0, 10)

    if (!confirm(`Will put 10 likes at:\n${firstTenItems.map(i => i.id).join("\n")}. OK?`))
      return

    firstTenItems.reduce((queue, item) => queue.then(async () => {
        printLog(`Like ${item.id}`)

        await request({
          method: 'like',
          params: [ item.id ],
        })

        await sleep(5000 + 10000 * Math.random())

    }), Promise.resolve())


  } catch(err) {
    alert(err.message)
  }
}

const onLikeButton = (event) => {
  event.preventDefault()

  const form = document.forms[0]

  const media_id = form.media_id.value

  if (!media_id) return alert(`You need to fill media_id`)

  chrome.runtime.sendMessage(null, {
    method: 'like',
    params: [ media_id ]
  })
}

const onUnlikeButton = (event) => {
  event.preventDefault()

  const form = document.forms[0]

  const media_id = form.media_id.value

  if (!media_id) return alert(`You need to fill media_id`)

  chrome.runtime.sendMessage(null, {
    method: 'unlike',
    params: [ media_id ]
  })
}

const onViewButton = async (event) => {
  event.preventDefault()

  const form = document.forms[0]

  const media_id = form.media_id.value

  if (!media_id) return alert(`You need to fill media_id`)

  const { num_results, items } = await request({
    method: 'media_info',
    params: [ media_id ]
  })

  console.log('media_info', num_results, items)

  const photo_url = items[0].image_versions2.candidates[0].url

  document.getElementById("photo_viewer").src = photo_url
}

const onLoadHistory = async (event) => {
  event.preventDefault()
}

const onKillAll = async (event) => {
  event.preventDefault()

  kill = true
}

document.getElementById("connect").addEventListener("click", onConnect, false)
document.getElementById("likeHashtagButton").addEventListener("click", onHashtagButton, false)

document.getElementById("likeButton").addEventListener("click", onLikeButton, false)
document.getElementById("unlikeButton").addEventListener("click", onUnlikeButton, false)
document.getElementById("viewButton").addEventListener("click", onViewButton, false)

document.getElementById("killAll").addEventListener("click", onKillAll, false)
// document.getElementById("loadHistory").addEventListener("click", onLoadHistory, false)
