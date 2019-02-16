import Instagram from './instagram'


window.onload = () => {
  const login_form = document.forms.instalogin

  login_form.onsubmit = (event) => {
    event.preventDefault()

    const { username, password } = instalogin.elements

    const instagram = new Instagram(username.value, password.value)

    instagram.login()
      .then(user => alert('logged in as @' + user.full_name))
      .catch(err => alert(err.message))
  }
}
