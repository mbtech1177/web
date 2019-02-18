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
    } else {
      console.log('inject.js: request error', message)
    }
  }
})

chrome.runtime.sendMessage(null, {
  method: 'get_user_info',
  params: []
})

document.getElementById("likeButton").addEventListener("click", function () {
  const form = document.forms[0]

  const media_id = form.media_id.value

  chrome.runtime.sendMessage(null, {
    method: 'like',
    params: [ media_id ]
  })

  // window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*")
}, false)
