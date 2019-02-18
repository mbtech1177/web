let _user = null

console.log('user', _user)

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('inject.js: message', message)

  const { status, user } = message

  if (user) {
    _user = user

    console.log('inject.js: logged in as', user)

    alert(`Website connected to the extension. Username: @${user.full_name}`)
  } else {
    if (status == 'ok') {
      console.log('inject.js: request success', message)
      alert(`Request succeeded: ${message}`)
    } else {
      console.log('inject.js: request error', message)
    }
  }
})


document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms[0]

  console.log('form', form)
  form.onsubmit = function (event) {
    event.preventDefault()
    return false
  }
})


document.getElementById("connect").addEventListener("click", function () {

  chrome.runtime.sendMessage(null, {
    method: 'get_user_info',
    params: []
  })

  // window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*")
}, false)


document.getElementById("likeButton").addEventListener("click", function () {
  const form = document.forms[0]

  const media_id = form.media_id.value

  chrome.runtime.sendMessage(null, {
    method: 'like',
    params: [ media_id ]
  })

  // window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*")
}, false)


document.getElementById("unlikeButton").addEventListener("click", function () {
  const form = document.forms[0]

  const media_id = form.media_id.value

  chrome.runtime.sendMessage(null, {
    method: 'unlike',
    params: [ media_id ]
  })

  // window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*")
}, false)
