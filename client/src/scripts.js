const scripts = {

  test: {
    name: 'Test text input',
    params: [
      { name: 'username', type: 'text', prefix: '@', defaultValue: 'kanyewest' },
      { name: 'password', type: 'text' },
    ],
    run: async ({ username, password } = {}) => {
      alert(username + ': ' + password)
    },
  },

  load_followers: {
    name: 'Load full list of user followers',
    params: [
      {
        name: 'username',
        type: 'text',
        prefix: '@',
        labelText: 'Username',
        defaultValue: 'burkinafan',
      },
    ],
    run: async ({ username, isFullInfo = false }, printLog = console.log, timeout) => {
      const { user: { pk } } = await instagram.request({ method: 'get_user_info', params: [username] }, true)

      if (!pk || isNaN(pk)) throw new Error(`No user id: ${pk}`)

      const followers_paging_generator = instagram.request_generator({ method: 'get_user_followers', params: [ pk ] })

      const safe_paging = safeGenerator(followers_paging_generator, printLog, timeout)

      const full_follower_list = mapGenerator(safe_paging, async followers => {
        printLog(`Batch of followers for @${username} loaded: ${followers.length}`)

        if (!isFullInfo) {
          return followers
        }

        const safe_batch = safeGenerator(makeGenerator(followers), printLog, timeout)

        const batch = await unwrapAccumulateGenerator(mapGenerator(safe_batch, async follower => {
          const { user } = await instagram.request({ method: 'get_user_info', params: [follower.pk]})

          printLog(`Loaded info for @${user.username}`)

          return user
        }))
        // const users = mapGenerator(infos, ({ user }) => user)
        //
        // const and_print = watchGenerator(users, user => printLog(`Loaded info for @${user.username}`))

        // return unwrapAccumulateGenerator(and_print)

        printLog(`Loaded batch. ${batch.length}`)

        return batch
      })

      const followers = await unwrapGenerator(reduceGenerator(full_follower_list, (arr, batch) => [ ...arr, ...batch ], []))

      printLog(`Followers for @${username} loaded: ${followers.length}`)
      printLog(`You can access them in window.followers or download using`)
      // printLog(`\t\tdownloadCSV()`)
      // printLog(`or`)
      printLog(`\t\tdownload('followers.csv', getCSV(followers))`)

      window.followers = followers
      window.downloadCSV = () => download('followers.csv', getCSV(followers))

      downloadCSV()
    },
  },

  like_followers: {
    name: 'Like first photos of user followers',
    params: [
      {
        name: 'username',
        type: 'text',
        prefix: '@',
        labelText: 'Username',
      },
      {
        name: 'nFollowers',
        type: 'number',
        values: [1, 2, 3, 5, 10],
        labelText: 'Number of followers',
      },
    ],
    run: async ({ username, nFollowers = 3 } = {}, printLog = console.log) => {
      const { user: { pk } } = await instagram.request({ method: 'get_user_info', params: [username] }, true)

      if (!pk || isNaN(pk)) throw new Error(`No user id: ${pk}`)

      const { users: followers } = await instagram.request({ method: 'get_user_followers', params: [pk] }, true)

      printLog(`Followers for @${username} loaded: ${followers.length}`)

      if (!followers || !followers.length) throw new Error(`No followers: ${followers}`)

      printLog(`Will like ${followers.slice(0, nFollowers).length} followers`)

      const photos = await safeMap(followers.slice(0, nFollowers), user => instagram.request({ method: 'get_user_feed', params: [user.pk] }), printLog)

      const first_photos = photos.map(feed => feed.items && feed.items[0]).filter(item => !!item)

      return await safeMap(first_photos, item => instagram.request({ method: 'like', params: [item.id] }), printLog)
    },
  },
}
