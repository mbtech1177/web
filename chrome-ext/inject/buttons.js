const onHashtagButton = async (event) => {
  event.preventDefault()

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

    const firstTenItems = items.slice(0, 10)

    if (!confirm(`Will put 10 likes at:\n${firstTenItems.map(i => instagramUrl(i)).join("\n")}. OK?`))
      return

    firstTenItems.reduce((queue, item) => queue.then(async () => {
      const url = instagramUrl(item)

      if (instagram.isStopped) {
        printLog(`Skipping <a href="${url}" target="_blank">${url}</a>...`)
        return
      }

      printLog(`Sending like <a href="${url}" target="_blank">${url}</a>...`)

      const { status } = await request({
        method: 'like',
        params: [ item.id ],
      }, true)

      printLog(`${status}`, false)

      console.log('Liked item', item, url)

      const sec = 5 + 10 * Math.random()
      printLog(`Sleeping ${sec.toFixed(2)} seconds`)

      await sleep(sec * 1000)

    }), Promise.resolve())


  } catch(err) {
    alert(err.message)
  }
}

const onKillAll = async (event) => {
  event.preventDefault()

  instagram.kill()

  printLog(`Stopping...`)
}
