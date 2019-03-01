const instagramUrl = (item = {}) => {
  if (!item.code) return ``
  return `https://instagram.com/p/${item.code}`
}

const userUrl = (item = {}) => {
  if (!item.username) return ``
  return `https://instagram.com/${item.username}`
}

const getURL = (item) => {
  const isUser = !!item.username

  return isUser ? userUrl(item) : instagramUrl(item)
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const makeGenerator = function * (from) {
  yield * from
}

const unwrapGenerator = async (generator) => {
  while (true) {
    const result = await generator.next()

    if (result.done) return result.value
  }
}

const unwrapAccumulateGenerator = async (generator) => {
  let results = []

  while (true) {
    const result = await generator.next()

    if (result.done) return results

    results.push(result.value)
  }
}

const reduceGenerator = async function * (generator, combine, initial = {}) {
  // const generator = createGenerator()

  let pass
  let accumulator = initial

  while (true) {
    const result = await generator.next()

    if (result.done) return accumulator

    accumulator = await combine(accumulator, result.value)
  }
}

const filterGenerator = async function * (generator, condition) {
  // const generator = createGenerator()

  let pass

  while (true) {
    const result = await generator.next(pass)

    if (result.done) return result.value

    if (await condition(result.value)) {
      pass = yield result.value
    } else {
      pass = undefined
    }
  }
}

const mapGenerator = async function * (generator, transform) {
  // const generator = createGenerator()

  let pass

  while (true) {
    const result = await generator.next(pass)

    if (result.done) return result.value

    pass = yield (await transform(result.value))
  }
}

const watchGenerator = async function * (generator, withValue) {
  // const generator = createGenerator()

  let pass

  while (true) {
    const result = await generator.next(pass)

    if (result.done) return result.value

    await withValue(result.value)

    pass = yield result.value
  }
}

const safeGenerator = async function * (generator, printLog = console.log, timeout = 5) {
  let index = 0
  let result

  while (true) {
    try {
      result = await generator.next()

      if (result.done) {
        return result.value
      }

      yield result.value
    } catch (err) {
      yield { status: 'error', error: err.message }
    }

    const num = `${++index}`
    const url = getURL(result)

    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return { status: 'skipped' }
    }

    const amp = 0.9
    const randomTimeout = timeout * (1 + amp * (0.5 - Math.random()))
    const sec = Math.max(0.5, randomTimeout)
    printLog(`Sleeping ${sec.toFixed(2)} seconds`)


    await sleep(sec * 1000)

    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return { status: 'skipped' }
    }
  }
}

const safeMap = async (items, transform, printLog = console.log, timeout = 5, n) => {
  instagram.start()

  const firstNItems = isNaN(n) ? items : items.slice(0, n)

  const queue = makeQueue(firstNItems, async (item, index) => {
    const num = `${index+1}/${firstNItems.length}`
    const url = getURL(item)

    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return { status: 'skipped' }
    }

    const amp = 0.9
    const randomTimeout = timeout * (1 + amp * (0.5 - Math.random()))
    const sec = Math.max(0.5, randomTimeout)
    printLog(`Sleeping ${sec.toFixed(2)} seconds`)

    await sleep(sec * 1000)

    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return { status: 'skipped' }
    }

    printLog(`${num}: Fetching <a href="${url}" target="_blank">${url}</a>... `)

    try {
      return await transform(item, index)
    } catch (err) {
      return { status: 'error', error: err.message }
    }
  })

  queue
    .then((res) => printLog(`Finished! Successful: ${res.filter(r => r.status == 'ok').length} items.`))
    .finally(() => instagram.kill())

  return queue
}


const likeItems = async (items, n = 10, printLog = console.log) => {
  instagram.start()

  const firstNItems = items.slice(0, n)

  if (!confirm(`Will put ${n} likes at:\n${firstNItems.map(i => instagramUrl(i)).join("\n")}. OK?`))
    return instagram.kill()

  const queue = makeQueue(firstNItems, async (item, index) => {
    const url = instagramUrl(item)
    const num = `${index+1}/${n}`

    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return
    }

    if (item.has_liked) {
      printLog(`${num}: SKIPPING (Already liked) <a href="${url}" target="_blank">${url}</a>`)
      return
    }

    const sec = 5 + 10 * Math.random()
    printLog(`Sleeping ${sec.toFixed(2)} seconds`)

    await sleep(sec * 1000)

    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return
    }

    printLog(`${num}: Sending like <a href="${url}" target="_blank">${url}</a>... `)

    try {
      const { status } = await instagram.request({
        method: 'like',
        params: [ item.id ],
      })

      printLog(`${status}`, false)
    } catch (err) {
      printLog(`error: ${err.message}`, false)
    }

    console.log('Liked item', num, item, url)
  })

  queue
    .then(() => printLog(`Finished! ${Math.min(n, items.length)} photos.`))
    .finally(() => instagram.kill())

}

const followList = async (users, n = 10, printLog = console.log) => {
  instagram.start()

  const firstNItems = users.slice(0, n)

  if (!confirm(`Will put follow ${n} users:\n${firstNItems.map(i => userUrl(i)).join("\n")}. OK?`))
    return instagram.kill()

  const queue = makeQueue(firstNItems, async (item, index) => {
    const url = userUrl(item)
    const num = `${index+1}/${n}`


    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return
    }

    if (item.has_liked) {
      printLog(`${num}: SKIPPING (Already followed) <a href="${url}" target="_blank">${url}</a>`)
      return
    }

    const sec = 5 + 10 * Math.random()
    printLog(`Sleeping ${sec.toFixed(2)} seconds`)

    await sleep(sec * 1000)

    if (instagram.isStopped) {
      printLog(`${num}: Skipping <a href="${url}" target="_blank">${url}</a>...`)
      return
    }

    printLog(`${num}: Following <a href="${url}" target="_blank">${url}</a>... `)

    try {
      const { status } = await instagram.request({
        method: 'follow',
        params: [ item.pk ],
      })

      printLog(`${status}`, false)
    } catch (err) {
      printLog(`error: ${err.message}`, false)
    }

    console.log('Followed user', num, item, url)
  })

  queue
    .then(() => printLog(`Finished! Followed ${Math.min(n, users.length)} users.`))
    .finally(() => instagram.kill())
}

const makeQueue = (items, step) => {
  return items.reduce(
      (queue, item, index) => queue.then(
        (results) => step(item, index).then(res => [ ...results, res ])
      ),
      Promise.resolve([])
    )
}
