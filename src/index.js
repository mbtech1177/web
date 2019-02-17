import Instagram from './instagram'

const whenLogged = async (instagram) => {

  const { user } = await instagram.callMethod('get_user_info', 'instagram') // .then(data => alert(data.user.pk))

  console.log('current user id', user.pk, user)

  const follow = await instagram.callMethod('follow', user.pk)

  console.log('follow request', follow)
}

window.onload = () => {
  const login_form = document.forms.instalogin

  window.Instagram = Instagram

  login_form.onsubmit = (event) => {
    event.preventDefault()

    const { username, password } = instalogin.elements

    const instagram = new Instagram()

    instagram.login(username.value, password.value)
      .then(user => alert('logged in as @' + user.full_name))
      .then(() => window.instagram = instagram)
      .then(whenLogged)
      .catch(err => alert(err.message))

    // const user_info = instagram.callMethod('get_user_info', 'instagram')
    // alert(user_info)
  }
}
