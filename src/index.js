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
      .then(() => window.instagram = instagram)
      .catch(err => alert(err.message))
  }
}
