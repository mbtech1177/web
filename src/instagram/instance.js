const print = console.log

import {
  API_URL,
  DEVICE,
  USER_AGENT_BASE,
  IG_SIG_KEY,
  LOGIN_URL,
  REQUEST_HEADERS,
} from './constants'


import axios from 'axios'
import * as methods from './methods'
import { prefixUnsecureHeaders } from './unsecure_headers'
import { generate_uuid, generate_device_id_from_username, generate_signature } from './helpers'

export default class Instagram {

  constructor(username, password) {
    this.is_logged_in = false
    this.user_id = null
    this.user = null
    this.history = null
    this.confirmator = null // new Confirmator()

    this.user_agent = USER_AGENT_BASE(DEVICE) // just insert params

    print("USER_AGENT:", this.user_agent)

    this.phone_id = generate_uuid()
    print("PHONE_ID (just another uuid):", this.phone_id)

    this.uuid = generate_uuid()
    print("UUID:", this.uuid)

    this.rank_token = () => `${this.user_id}_${this.uuid}`

    this.username = username
    this.password = password

    this.total_requests = 0
    this.last_response = {}

    // if (username && password) {
    //   this.login(username, password)
    // }
  }

  async login(username, password, forceLogin = false) {
    if (this.is_logged_in && !forceLogin) {
      throw new Error(`Already logged in`)
    }

    const USERNAME = username || this.username
    const PASSWORD = password || this.password

    try {
      const { logged_in_user, status } = await this._login(USERNAME, PASSWORD)

      const MASKED_PASSWORD = PASSWORD.split('').fill('*').join('')
      this.history && this.history.save('login', [USERNAME, MASKED_PASSWORD], { status })

      if (logged_in_user) {
        this.is_logged_in = true
        this.user_id = logged_in_user.pk
        this.user = logged_in_user
        return logged_in_user
      } else {
        throw new Error(`Could not log in: ${response}`)
      }
    } catch (err) {
      console.error(`LoginError: ${err.message}`)
      throw err
    }
  }

  async _login(username, password) {
    this.device_id = generate_device_id_from_username(username)
    print("DEVICE_ID:", this.device_id)

    const data = JSON.stringify({
        'phone_id': this.phone_id,
        'username': username,
        'guid': this.uuid,
        'device_id': this.device_id,
        'password': password,
        'login_attempt_count': '0',
    })

    print("Final POST DATA before signing:\n", data)
    const signed_data = generate_signature(data)
    print("Final POST DATA after signing:\n", signed_data)

    const response = await this.send_request('accounts/login/', data, true)

    if (response['message'] == 'checkpoint_required') {
      // In case of 'suspicious activity'
      console.log('Checkpoing required:', response['checkpoint_url'])
    }

    return response
  }

  async _request(endpoint, method = 'GET', post_data, extra_headers = {}) {
    const headers = prefixUnsecureHeaders({
      'User-Agent': this.user_agent,
      ...REQUEST_HEADERS,
      ...extra_headers,
    }, 'replace')

    const response = await axios({
      url: API_URL + endpoint,
      method,
      data: post_data,
      headers,
    })

    const { data, status } = response

    if (status == 200) {
      this.last_response = response
      return data
    }

    console.error(`Request returns error! Status: ${status}`)


    if (data.message.includes('feedback_required')) {
      console.error(`ATTENTION! 'feedback_required', your action could have been blocked`)
      throw new Error('feedback_required')
    }

    if (status === 429) {
      const sleep_minutes = 5

      console.error(
        `That means 'too many requests'. I'll go to sleep
        for ${sleep_minutes} minutes`)

      await sleep(5 * 60 * 1000)

    } else if (status === 400) {

      const error_message = data.message
      const error_type = data.error_type

      console.log(`Instagram's error message: ${error_message}, Error type: ${error_type}`)
      throw new Error(`InstagramError: ${error_type}: ${error_message}`)
    }

    return false
  }

  _get(endpoint, extra_headers = {}) {
    return this._request(endpoint, 'GET', null, extra_headers)
  }

  _post(endpoint, data, extra_headers = {}) {
    return this._request(endpoint, 'POST', data, extra_headers)
  }

  send_request(endpoint, data = null, doLogin = false) {
    if (!this.is_logged_in && !doLogin) {
      throw new Error(`Not logged in! Tried to call ${endpoint}`)
    }

    if (!this.user_id && !doLogin) {
      console.warn(`'user_id' is undefined! Endpoints that need rank_token will not work. Try to relogin.`)
    }

    try {
      if (data) {
        return this._post(endpoint, generate_signature(data))
      } else {
        return this._get(endpoint)
      }
    } catch (err) {
      console.error(`Request failed:`, err, `Data:`, endpoint, data, )
      throw err
    }
  }

  async callMethod(name, ...args) {
    const _method = methods[name]

    if (typeof _method != 'function') {
      throw new Error(`No method: ${name}. Available methods: ${Object.keys(methods).join()}`)
    }

    if (this.confirmator) {
      const ok = await this.confirmator.confirm(`${name} ${args.join(' ')}?`)

      if (!ok) throw new Error(`User rejected request`)
    }

    const result = await _method(this, args)

    this.history && this.history.save(name, args, result)

    return result
  }

}
