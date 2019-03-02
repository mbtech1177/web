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
      {
        name: 'isFullInfo',
        type: 'checkbox',
        prefix: '',
        labelText: 'Download full profile for each followers (takes much longer)',
        defaultValue: false,
      },
    ],
    run: async ({ username, isFullInfo = false }, printLog = console.log, timeout) => {
      const { user: { pk } } = await instagram.request({ method: 'get_user_info', params: [username] }, true)

      if (!pk || isNaN(pk)) throw new Error(`No user id: ${pk}`)

      const followers_paging_generator = instagram.request_generator({ method: 'get_user_followers', params: [ pk ] })

      const safe_paging = safeGenerator(followers_paging_generator, printLog, timeout)

      const full_follower_list = mapGenerator(safe_paging, async (followers, batchIndex) => {
        printLog(`Batch ${batchIndex+1} of followers for @${username} loaded: ${followers.length}`)

        if (!isFullInfo) {
          return followers
        }

        const safe_batch = safeGenerator(makeGenerator(followers), printLog, timeout)

        const batch = await unwrapAccumulateGenerator(mapGenerator(safe_batch, async (follower, index) => {
          const { user } = await instagram.request({ method: 'get_user_info', params: [follower.pk]})

          printLog(`Batch ${batchIndex+1}: ${index+1}/${followers.length}: Loaded info for @${user.username}`)

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

  load_hashtag: {
    name: 'Load list of photos by hashtag',
    params: [
      {
        name: 'hashtag',
        type: 'text',
        prefix: '#',
        labelText: 'Hashtag',
        defaultValue: 'vr',
      },
      {
        name: 'nPhotos',
        type: 'number',
        values: [10, 50, 100, 200],
        labelText: 'Number of photos to download',
        defaultValue: 10,
      },
    ],
    run: async ({ hashtag, nPhotos }, printLog = console.log, timeout) => {
      const photos_paging_generator = instagram.request_generator({ method: 'get_hashtag_feed', params: [ hashtag ] })

      const safe_paging = safeGenerator(photos_paging_generator, printLog, timeout)

      const full_photos_list = mapGenerator(safe_paging, async (page, batchIndex) => {
        printLog(`Batch ${batchIndex+1} of photos for #${hashtag} loaded: ${page.length}`)

        const safe_batch = safeGenerator(makeGenerator(followers), printLog, timeout)

        const batch = await unwrapAccumulateGenerator(mapGenerator(safe_batch, async (item, index) => {
          const { item } = await instagram.request({ method: 'media_info', params: [ item.id ]})

          printLog(`Batch ${batchIndex+1}: ${index+1}/${followers.length}: Loaded info for @${user.username}`)

          return item
        }))

        printLog(`Loaded batch. ${batch.length}`)

        return batch
      })

      const photos = await unwrapGenerator(reduceGenerator(full_photos_list, (arr, batch) => [ ...arr, ...batch ], []))

      printLog(`Photos by #${hashtag} loaded: ${photos.length}`)
      printLog(`You can access them in window.photos or download using`)
      // printLog(`\t\tdownloadCSV()`)
      // printLog(`or`)
      printLog(`\t\tdownload('photos-${hashtag}.csv', getCSV(photos))`)

      window.photos = photos
      window.downloadCSV = () => download(`photos-${hashtag}.csv`, getCSV(photos))

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
      {
        name: 'nLikePhotos',
        type: 'number',
        values: [1],
        labelText: 'How many photos to like',
      },
    ],
    run: async ({ username, nFollowers = 3, nLikePhotos = 1 } = {}, printLog = console.log) => {
      const { user: { pk } } = await instagram.request({ method: 'get_user_info', params: [username] }, true)

      if (!pk || isNaN(pk)) throw new Error(`No user id: ${pk}`)

      const followers_paging_generator = instagram.request_generator({ method: 'get_user_followers', params: [ pk ] }, nFollowers)

      const followers_g = safeGenerator(followers_paging_generator, async followers => {

        printLog(`Followers for @${username} loaded: ${followers.length}`)

        if (!followers || !followers.length) throw new Error(`No followers: ${followers}`)

        printLog(`Will like ${followers.length} followers`)

        const photos = await safeMap(followers, user => instagram.request({ method: 'get_user_feed', params: [user.pk] }), printLog)

        const first_photos = photos.map(feed => feed.items && feed.items[0]).filter(item => !!item)

        return await safeMap(first_photos, item => instagram.request({ method: 'like', params: [item.id] }), printLog)

      }, printLog)

      const followers = await unwrapGenerator(followers_g)

      printLog(`Followers for @${username} loaded: ${followers.length}`)

      if (!followers || !followers.length) throw new Error(`No followers: ${followers}`)

      printLog(`Will like ${followers.slice(0, nFollowers).length} followers`)

      // const followers_generator = makeGenerator(followers)

      // const photos_g = safeGenerator(followers_generator, user => instagram.request({ method: 'get_user_feed', params: [user.pk] }), printLog)
      //
      // const photos = await unwrapGenerator(photos_g)
      const photos = await safeMap(followers.slice(0, nFollowers), user => instagram.request({ method: 'get_user_feed', params: [user.pk] }), printLog)

      const first_photos = photos.map(feed => feed.items && feed.items[0]).filter(item => !!item)

      return await safeMap(first_photos, item => instagram.request({ method: 'like', params: [item.id] }), printLog)
    },
  },
}
