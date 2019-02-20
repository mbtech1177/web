const whenLogged = async () => {

  const { user } = await instagram.request({
    method: 'get_user_info',
    params: [ 'instagram' ]
  })

  console.log('@instagram', user.pk, user)

  // const follow = await instagram.callMethod('follow', user.pk)

  // console.log('follow request', follow)

  await updateView()
}

const openControlPanel = () => {
  window.open(`https://caffeinum.github.io/instaweb`)
}

const updateView = async () => {
  const { user } = await instagram.request({
    method: 'check_login'
  })

  console.log('update view, user =', user)

  setView({
    logged_in: !!user.pk
  })

  // const creds = await getCredentials()
  //
  // setView({
  //   logged_in: creds && creds.username && creds.password,
  // })
}

const setView = ({ logged_in } = {}) => {
  if (logged_in) {
    document.querySelectorAll('.logged_in')    .forEach(elem => elem.style.display = '')
    document.querySelectorAll('.not_logged_in').forEach(elem => elem.style.display = 'none')
  }
  else {
    document.querySelectorAll('.logged_in')    .forEach(elem => elem.style.display = 'none')
    document.querySelectorAll('.not_logged_in').forEach(elem => elem.style.display = '')
  }
}

window.onload = async () => {
  const login_form = document.forms.instalogin

  if (!login_form) return

  await updateView()

  document.querySelector('#exit').onclick = async () => {
    await clearCredentials()

    await instagram.request({
      method: 'exit',
    })

    await updateView()
  }

  login_form.onsubmit = async (event) => {
    event.preventDefault()

    const { username, password } = instalogin.elements

    try {
      const res = await instagram.request({
        method: 'login',
        params: [ username.value, password.value ]
      })

      // const { user } = await instagram.request({
      //   method: 'get_user_info',
      // })

      // const instagram = new Instagram()
      //
      // instagram.login(username.value, password.value)
      // window.instagram = instagram)
      await saveCredentials(username.value, password.value)
      await whenLogged()
      openControlPanel()
    } catch (err) {
      alert(err.message)
      console.error(err)
    }


      // .then(user => alert(`Logged in as @${user.full_name}! You can now use the website`))
      // .then(() => window.instagram = instagram)
      // .then(() => saveCredentials(username.value, password.value))
      // .then(() => whenLogged(instagram))
      // .catch(err => alert(err.message))
  }
}
