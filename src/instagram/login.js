const print = console.log

import {
  DEVICE,
  USER_AGENT_BASE,
  IG_SIG_KEY,
  LOGIN_URL,
  REQUEST_HEADERS,
} from './constants'


import axios from 'axios'

import md5 from 'blueimp-md5'
// import sha256 from 'js-sha256'
//
// import uuidjs from 'uuid-js'
// import hmac from 'hmac'

import { prefixUnsecureHeaders } from './unsecure_headers'
import { generate_uuid, generate_device_id, generate_signature } from './helpers'

const user_agent = USER_AGENT_BASE(DEVICE) // just insert params

print("USER_AGENT:", user_agent)

export default async (username, password) => {

  const phone_id = generate_uuid()
  print("PHONE_ID (just another uuid):", phone_id)

  const uuid = generate_uuid()
  print("UUID:", uuid)

  const USERNAME = username
  const PASSWORD = password

  const device_id = generate_device_id(md5(`${USERNAME}${USERNAME}`))
  print("DEVICE_ID:", device_id)

  // ##############################################
  // # The hardest part - sign data the proper way

  const data = JSON.stringify({
      'phone_id': phone_id,
      'username': USERNAME,
      'guid': uuid,
      'device_id': device_id,
      'password': PASSWORD,
      'login_attempt_count': '0',
  })

  print()
  print("Final POST DATA before signing:\n", data)
  const signed_data = generate_signature(data)
  print()
  print("Final POST DATA after signing:\n", signed_data)


  // console.log(`username: ${username}\npassword: ${password}`)
  print()
  print(" ---> POSTing to url:", LOGIN_URL)

  // session = requests.Session()
  // session.headers.update(REQUEST_HEADERS)
  // session.headers.update({'User-Agent': user_agent})
  // response = session.post(LOGIN_URL, data=data)

  try {
    const response = await axios({
      url: LOGIN_URL,
      method: 'POST',
      data: signed_data,
      headers: prefixUnsecureHeaders({
        // 'User-Agent': user_agent,
        'User-Agent': user_agent,
        ...REQUEST_HEADERS,
      }, 'replace')
    })

    print()
    print("---> Details of what is happened:")
    print(" - BODY:", response.data)
    print(" - HEADERS:", response.headers)
    print(" - RESPONSE:", response.status)

    return response.data
  } catch (err) {
    print()
    print(' - This error again')
    print(err)

    throw err
  }

}
