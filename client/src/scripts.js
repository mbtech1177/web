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

  comment_by_hashtag: {
    name: 'Comment photos from hashtag feed',
    description: 'Will post the same comment: 🔥 @{username}!',
    params: [
      { name: 'hashtag', type: 'text', prefix: '#', defaultValue: 'cats' },
      { name: 'nPhotos', type: 'number', values: [1,2,5,10,20,50] },
    ],
    run: async ({ hashtag, nPhotos }, printLog = console.log) => {
      if (!hashtag) {
        throw new Error(`Empty hashtag field!`)
      }

      printLog(`Fetching photos by hashtag: #${hashtag} ... `)

      const { items } = await instagram.request({
        method: 'get_hashtag_feed',
        params: [ hashtag ]
      })

      printLog(`OK, ${items.length} results`, false)
      console.log(`URLS:`, items.map(instagramUrl))

      const comment_text = item => window.comment_text
          ? window.comment_text(item)
          : `🔥 @${item.user.username}!`

      return safeMap(items.slice(0, nPhotos), item => instagram.request({ method: 'comment', params: [ item.id, comment_text(item) ] }), printLog)
    }
  },

  comment_by_user: {
    name: 'Comment photos from user',
    params: [
      { name: 'username', type: 'text', prefix: '@', defaultValue: 'ohld' },
      { name: 'nPhotos', type: 'number', values: [1,2,3] },
    ],
    run: async ({ username, nPhotos }, printLog = console.log) => {
      if (!username) {
        throw new Error(`Empty username field!`)
      }

      printLog(`Fetching photos by username: @${username} ... `)

      const { user } = await instagram.request({ method: 'get_user_info', params: [username] })

      const { items } = await instagram.request({
        method: 'get_user_feed',
        params: [ user.pk ]
      })

      printLog(`OK, ${items.length} results`, false)
      console.log(`URLS:`, items.map(instagramUrl))

      const comment_text = item => window.comment_text
          ? window.comment_text(item)
          : `🔥 @${item.user.username}!`

      return safeMap(items.slice(0, nPhotos), item => instagram.request({ method: 'comment', params: [ item.id, comment_text(item) ] }), printLog)
    }
  },

  follow_by_hashtag: {
    name: 'Follow people who posts by hashtag',
    params: [
      { name: 'hashtag', type: 'text', prefix: '#', labelText: 'Hashtag', defaultValue: 'cats' },
      { name: 'nUsers', type: 'number', labelText: 'Number of users', values: [1,5,10,20,50] },
    ],
    run: async ({ hashtag, nUsers }, printLog = console.log) => {
      if (!hashtag) {
        throw new Error(`Empty hashtag field!`)
      }

      printLog(`Fetching photos by hashtag: #${hashtag} ... `)

      const { items } = await instagram.request({
        method: 'get_hashtag_feed',
        params: [ hashtag ]
      })

      printLog(`OK, ${items.length} results`, false)
      console.log(`URLS:`, items.map(instagramUrl))

      return followList(items.map(item => item.user), nUsers, printLog)
    }
  },

  like_location: {
    params: [
      { name: 'location_name', type: 'text', labelText: 'Location name' },
      { name: 'nPhotos', type: 'number', labelText: 'Number of photos', values: [1,2,5,10,20,50] },
    ],
    run: async ({ location_name, nPhotos }, printLog = console.log) => {
      const { items: locations } = await instagram.request({ method: 'search_location', params: [location_name] })

      if (!locations.length) throw new Error(`Location ${location_name} not found`)

      printLog(`Location search by '${location_name}': found ${locations.length} items.`)

      const { location } = locations[0]

      printLog(`Using '${location.name}'`)

      const { items } = await instagram.request({ method: 'get_location_feed', params: [ location.pk ] })

      printLog(`Loaded ${items.length} photos. Requested to like ${nPhotos}.`)

      if (!items.length) {
        printLog(`Sorry, no photos to like in this location. Try more specific name.`)
        return
      }

      return safeMap(items.slice(0, nPhotos), item => instagram.request({ method: 'like', params: [item.id] }), printLog)
    }
  },

  load_pictures: {
    params: [
      {
        name: 'username',
        type: 'text',
        prefix: '@',
        labelText: 'Username',
        defaultValue: 'ohld',
      },
      {
        name: 'max_id',
        type: 'text',
        labelText: 'max_id (leave empty)',
      }
    ],
    run: async ({ username, max_id }, printLog = console.log) => {

      const { user: { pk, media_count } } = await instagram.request({ method: 'get_user_info', params: [ username ] })

      if (!pk || isNaN(pk)) throw new Error(`No user id: ${pk}`)

      const { items, next_max_id } = await instagram.request({ method: 'get_user_feed', params: [ pk, max_id ] })

      printLog(`Loaded a batch of ${items.length} items. Total users media: ${media_count}`)
      printLog(`You can access a next batch manually using this id: ${next_max_id}`)
      printLog(`Download this batch: downloadCSV()`)

      window.items = items
      window.downloadCSV = () => download(`items_${username}.csv`, getCSV(items))

      // downloadCSV()

      return
    }
  },

  load_stories: {
    params: [
      {
        name: 'username',
        type: 'text',
        prefix: '@',
        labelText: 'Username',
        defaultValue: 'ohld',
      },
    ],
    run: async ({ username }, printLog = console.log) => {

      const { user: { pk, media_count } } = await instagram.request({ method: 'get_user_info', params: [ username ] })

      if (!pk || isNaN(pk)) throw new Error(`No user id: ${pk}`)

      const { broadcast, reel, post_live_item } = await instagram.request({ method: 'get_user_story_feed', params: [ pk ] })

      console.log('Loaded')
      console.log('broadcast', broadcast)
      console.log('reel', reel)
      console.log('post_live_item', post_live_item)

      if (!reel) {
        printLog(`No stories for user @${username}. Abort`)
        return
      }

      const { items } = reel
      printLog(`Loaded ${items.length} stories for @${username}. Livestream: ${!!broadcast}. Finished streams: ${!!post_live_item}`)
      printLog(`Download this batch: downloadCSV()`)

      window.items = items
      window.downloadCSV = () => download(`stories_${username}.csv`, getCSV(items))

      items.map((item,index) => {
        printLog(`Story ${index+1}: `)

        if (item.video_dash_manifest) {
          printLog(`Video`, false)
          const matches = item.video_dash_manifest.match(/<BaseURL>(.*?)<\/BaseURL>/g)

          console.log('matches', matches)
          const urls = matches.map(token => token.replace(/<.*?>/g, ''))

          const types = ["Audio", "Video", "Video HD"]

          urls.map((url, index) => printLog(`<a href="${url}">Download ${types[index]}</a>`))
        } else if (item.image_versions2 && item.image_versions2.candidates) {
          printLog(`Photo`, false)
          const photo = item.image_versions2.candidates[0]

          console.log('photo', photo)
          const url = photo.url

          printLog(`<a href="${url}">Download Photo</a>`)
        } else {
          printLog(`Wrong format, skip`, false)
        }
      })
    }
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
      printLog(`\t\tdownload('followers_${username}.csv', getCSV(followers))`)

      window.followers = followers
      window.downloadCSV = () => download(`followers_${username}.csv`, getCSV(followers))

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
