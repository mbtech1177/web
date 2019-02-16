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
import login from './login'
import * as methods from './methods'
import { prefixUnsecureHeaders } from './unsecure_headers'
import { generate_uuid, generate_device_id_from_username, generate_signature } from './helpers'

export default class Instagram {

  constructor(username, password) {
    this.is_logged_in = false
    this.user_id = null

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

    const { logged_in_user} = await this._login(USERNAME, PASSWORD)

    if (logged_in_user) {
      this.is_logged_in = true
      this.user_id = logged_in_user.pk
      return logged_in_user
    } else {
      throw new Error(`Could not log in: ${response}`)
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

    try {
      // const response = await this._post('accounts/login/', signed_data)
      const response = await this.send_request('accounts/login/', data, true)

      print()
      print("---> Details of what is happened:")
      print(" - BODY:", response)

      return response

    } catch (err) {
      print()
      print(' - This error again')
      print(err)

      throw err
    }
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
    }

    return false
  }

  _get(endpoint, extra_headers = {}) {
    return this._request(endpoint, 'GET', null, extra_headers)
  }

  _post(endpoint, data, extra_headers = {}) {
    return this._request(endpoint, 'POST', data, extra_headers)
  }

  send_request(endpoint, post = false, doLogin = false, with_signature = true) {
    if (!this.is_logged_in && !doLogin) {
      throw new Error(`Not logged in! Tried to call ${endpoint}`)
    }

    if (!this.user_id) {
      console.warn(`user_id is undefined! Endpoints that need rank_token will not work`)
    }

    // if (this.queue.length) {
    //   await this.whenQueueEnds(this.queue)
    // }

    try {
      this.total_requests += 1

      if (!post) {
        return this._get(endpoint)
      }

      if (with_signature) {
        // Only `send_direct_item` doesn't need a signature
        const data = generate_signature(post)

        return this._post(endpoint, data)
      } else {
        return this._post(endpoint, post)
      }
    } catch (err) {
      console.error(err)
    }


        //
        // self.session.headers.update(config.REQUEST_HEADERS)
        // self.session.headers.update({'User-Agent': self.user_agent})
        // try:
        //     self.total_requests += 1
        //     if post is not None:  # POST
        //         if with_signature:
        //             # Only `send_direct_item` doesn't need a signature
        //             post = self.generate_signature(post)
        //         response = self.session.post(
        //             config.API_URL + endpoint, data=post)
        //     else:  # GET
        //         response = self.session.get(
        //             config.API_URL + endpoint)
        // except Exception as e:
        //     self.logger.warning(str(e))
        //     return False



  }

  callMethod(name, ...args) {
    const _method = methods[name]

    if (typeof _method != 'function') {
      throw new Error(`No method: ${name}. Available methods: ${Object.keys(methods).join()}`)
    }

    return _method(this, args)
  }

}
