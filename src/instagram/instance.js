import login from './login'
import { API_URL } from './constants'


export default class Instagram {

  constructor(username, password) {
    this.isLogged = false
    this.rank_token = ''

    this.username = username
    this.password = password

    this.login()
  }

  login() {
    return login(this.username, this.password)
      .then(({ logged_in_user }) => {
        console.log('logged in as', `@${logged_in_user.username}`)

        this.isLogged = true

        return logged_in_user
      })
  }

  send_request(url) {
    
  }

}
