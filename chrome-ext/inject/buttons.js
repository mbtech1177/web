const initButtons = () => {
  document.getElementById("likeHashtagButton").addEventListener("click", onHashtagButton, false)
  document.getElementById("likeUsernameButton").addEventListener("click", onLikeUsernameButton, false)
  document.getElementById("killAll").addEventListener("click", onKillAll, false)
}

const onHashtagButton = async (event) => {
  event.preventDefault()
  instagram.start()

  try {
    const form = document.forms[0]
    const hashtag = form.hashtag.value

    if (!hashtag) {
      throw new Error(`Empty hashtag field!`)
    }

    printLog(`Fetching photos by hashtag: ... `)

    const { items } = await request({
      method: 'get_hashtag_feed',
      params: [ hashtag ]
    })

    printLog(`OK, ${items.length} results`, false)

    likeItems(items, 10)

  } catch(err) {
    alert(err.message)
  }
}

const onLikeUsernameButton = async (event) => {
  event.preventDefault()
  instagram.start()

  try {
    const form = document.forms[0]
    const username = form.username.value

    if (!username) {
      throw new Error(`Empty field!`)
    }

    printLog(`Fetching photos by username @${username}: ... `)

    const { user } = await request({
      method: 'get_user_info',
      params: [ username ]
    })

    const { items } = await request({
      method: 'get_user_feed',
      params: [ user.pk ]
    })

    printLog(`OK, ${items.length} results`, false)

    likeItems(items, 10)

  } catch(err) {
    alert(err.message)
  }

}

const onKillAll = async (event) => {
  event.preventDefault()
  instagram.kill()

  printLog(`Stopping...`)

  alert(`
    Please wait until all requests are finished.
    Else, some old requests may be not stopped.
  `)
}
