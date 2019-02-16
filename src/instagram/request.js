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
import sha256 from 'js-sha256'

import uuidjs from 'uuid-js'
import hmac from 'hmac'

const user_agent = USER_AGENT_BASE(DEVICE) // just insert params

print("USER_AGENT:", user_agent)

const generate_uuid = () => uuidjs.create(4).hex

// ################################################
// # device_id = properly hashed login and password

const generate_device_id = (seed) => {
  const volatile_seed = "12345" // # Important ! :) :)

  // m = hashlib.md5()
  // m.update(seed.encode('utf-8') + volatile_seed.encode('utf-8'))

  const hex = md5(seed + volatile_seed)

  return `android-${hex.slice(0,16)}`
  //
  // return 'android-' + m.hexdigest()[:16]
}


const generate_signature = (data) => {
  // body = hmac.new(IG_SIG_KEY.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).hexdigest() + '.' + urllib.parse.quote(data)
  // const createHash = (data) => sha256.create(data)

  const header = sha256.hmac(IG_SIG_KEY, data)

  // const hmac_header = hmac(createHash, 64, IG_SIG_KEY).update(data).digest('hex')
  // const hmac_header = hmac(`${IG_SIG_KEY}` + data)
  const body = header + `.` + encodeURIComponent(data)
  const signature = `ig_sig_key_version=4&signed_body=${body}`

  return signature
}



export default async (request_data) => {

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

  const data = JSON.stringify(request_data)

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
      headers: {
        // 'User-Agent': user_agent,
        'X-Instaweb-User-Agent': user_agent,
        ...REQUEST_HEADERS,
      }
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
