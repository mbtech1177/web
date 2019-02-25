
const connectExtension = async () => {
  try {
    await instagram.init()

    if (!instagram.isConnected) {
      return {
        status: (CONNECTION.NOT_INSTALLED),
      }
    }

    const { user } = await instagram.request({ method: 'check_login' })

    instagram.kill()

    if (user && user.pk) {
      return {
        user,
        status: (CONNECTION.LOGGED_IN),
      }
      // alert(`Website connected to the extension. Username: @${user.full_name}`)
    } else {
      return {
        status: (CONNECTION.NOT_LOGGED_IN),
      }
      // alert(`Connected to the extension, but it's not logged in. Please login via pressing extension logo`)
    }

  } catch (err) {
    console.log(`ExtensionError`, err)

    instagram.kill()

    if (err instanceof NotInstalledError) {
      return {
        status: (CONNECTION.NOT_INSTALLED),
        error: `Extension is not installed or cannot be detected`,
      }
    }

    alert(err.message)
    return {
      status: (CONNECTION.UNKNOWN),
      error: err.message,
    }
  }
}

const fetchStats = async () => {
  
  instagram.start()

  const { data } = await instagram.request({ method: 'stats' })

  console.log('stats', data)

  instagram.kill()

  return data
}

const likePhotosByHashtag = async (hashtag, n, printLog = console.log) => {

  if (!instagram.isStopped) {
    alert(`Please stop all other tasks before running!`)
    return
  }

  if (!hashtag) {
    throw new Error(`Empty hashtag field!`)
  }

  instagram.start()

  try {

    printLog(`Fetching photos by hashtag: #${hashtag} ... `)

    const { items } = await instagram.request({
      method: 'get_hashtag_feed',
      params: [ hashtag ]
    })

    printLog(`OK, ${items.length} results`, false)
    console.log(`URLS:`, items.map(instagramUrl))

    likeItems(items, n, printLog)

  } catch(err) {
    console.error(err)
    alert(err.message)
  }
}

const likePhotosByUsername = async (username, n, printLog) => {
  if (!instagram.isStopped) {
    alert(`Please stop all other tasks before running!`)
    return
  }

  if (!username) {
    throw new Error(`Empty field!`)
  }

  try {
    instagram.start()

    printLog(`Fetching photos by username @${username}: ... `)

    const { user } = await instagram.request({
      method: 'get_user_info',
      params: [ username ]
    })

    const { items } = await instagram.request({
      method: 'get_user_feed',
      params: [ user.pk ]
    })

    printLog(`OK, ${items.length} results`, false)

    likeItems(items, n, printLog)

  } catch(err) {
    console.error(err)
    alert(err.message)
  }

}

const onKillAll = async (printLog = console.log) => {

  instagram.kill()

  printLog(`Stopping...`)

  alert(`
    Please wait until all requests are finished.
    Else, some old requests may be not stopped.
  `)
}
