const whenLogged = async (instagram) => {

  const { user } = await instagram.callMethod('get_user_info', 'instagram') // .then(data => alert(data.user.pk))

  console.log('current user id', user.pk, user)

  const follow = await instagram.callMethod('follow', user.pk)

  console.log('follow request', follow)
}

window.onload = () => {
  const login_form = document.forms.instalogin

  if (!login_form) return

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
