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

  // upload_image: {
  //   name: 'Upload Image',
  //   params: [
  //     { name: 'image', type: 'file', labelText: 'Insert image URL' },
  //     { name: 'caption', type: 'text', labelText: 'Image caption' },
  //   ],
  //   run: async ({ caption, files }, printLog = console.log) => {
  //     const { image } = files
  //
  //     printLog(`Uploading image: ${caption}`)
  //     console.log('image', image)
  //
  //     try {
  //       const res = await instagram.request({ method: 'upload_photo', params: [image, caption] })
  //
  //       console.log('res', res)
  //     } catch (err) {
  //       console.log('err', err)
  //     }
  //
  //   },
  // },
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
