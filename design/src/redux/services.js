
const connectExtension = async () => {
  try {
    await instagram.init()

    if (!instagram.isConnected) {
      return (CONNECTION.NOT_INSTALLED)
    }

    const { user } = await request({ method: 'check_login' }, true)

    if (user && user.pk) {
      return (CONNECTION.LOGGED_IN)
      // alert(`Website connected to the extension. Username: @${user.full_name}`)
    } else {
      return (CONNECTION.NOT_LOGGED_IN)
      // alert(`Connected to the extension, but it's not logged in. Please login via pressing extension logo`)
    }

    instagram.kill()

  } catch (err) {
    console.error(err)
    alert(err.message)
    return (CONNECTION.UNKNOWN)
  }
}

const onHashtagButton = async () => {

  if (!instagram.isStopped) {
    alert(`Please stop all other tasks before running!`)
    return
  }

  instagram.start()

  try {
    const form = document.forms[0]
    const hashtag = form.hashtag.value

    if (!hashtag) {
      throw new Error(`Empty hashtag field!`)
    }

    printLog(`Fetching photos by hashtag: #${hashtag} ... `)

    const { items } = await request({
      method: 'get_hashtag_feed',
      params: [ hashtag ]
    })

    printLog(`OK, ${items.length} results`, false)
    console.log(`URLS:`, items.map(instagramUrl))

    likeItems(items, 10)

  } catch(err) {
    alert(err.message)
  }
}

const onLikeUsernameButton = async () => {
  if (!instagram.isStopped) {
    alert(`Please stop all other tasks before running!`)
    return
  }

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

const onKillAll = async () => {

  instagram.kill()

  printLog(`Stopping...`)

  alert(`
    Please wait until all requests are finished.
    Else, some old requests may be not stopped.
  `)
}
