const whenLogged = async (instagram) => {

  const { user } = await instagram.callMethod('get_user_info', 'instagram') // .then(data => alert(data.user.pk))

  console.log('current user id', user.pk, user)

  const follow = await instagram.callMethod('follow', user.pk)

  console.log('follow request', follow)
}

window.onload = async () => {
  const login_form = document.forms.instalogin

  if (!login_form) return

  const creds = await getCredentials()

  if (creds) {
    // document.getElementById('instalogin').style.display = 'none'
    document.getElementById('logged_in').style.display = ''
    document.getElementById('not_logged_in').style.display = 'none'
  }

  login_form.onsubmit = (event) => {
    event.preventDefault()

    const { username, password } = instalogin.elements

    const instagram = new Instagram()

    instagram.login(username.value, password.value)
      .then(user => alert(`Logged in as @${user.full_name}! You can now use the website`))
      .then(() => window.instagram = instagram)
      .then(() => saveCredentials(username.value, password.value))
      .then(() => whenLogged(instagram))
      .catch(err => alert(err.message))
  }
}
