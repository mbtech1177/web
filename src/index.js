import Instagram from './instagram'


window.onload = () => {
  const login_form = document.forms.instalogin

  window.Instagram = Instagram

  login_form.onsubmit = (event) => {
    event.preventDefault()

    const { username, password } = instalogin.elements

    const instagram = new Instagram()

    instagram.login(username.value, password.value)
      .then(user => alert('logged in as @' + user.full_name))
      .then(
        () => window.instagram = instagram)
        .catch(err => alert(err.message)
      )

    instagram.callMethod('get_user_info', 'instagram')
      .then(user_info => alert(user_info['pk']))

    // const user_info = instagram.callMethod('get_user_info', 'instagram')
    // alert(user_info)
    // instagram.callMethod('follow', user_info['pk']).catch(err => alert(err.message))
  }
}
