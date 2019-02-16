import { IG_SIG_KEY } from './constants'

import md5 from 'blueimp-md5'
import sha256 from 'js-sha256'
import uuidjs from 'uuid-js'

export const generate_uuid = () => uuidjs.create(4).hex

// ################################################
// # device_id = properly hashed login and password

export const generate_device_id = (seed) => {
  const volatile_seed = "12345" // # Important ! :) :)

  const hex = md5(seed + volatile_seed)

  return `android-${hex.slice(0,16)}`
}

export const generate_device_id_from_username = (username) => {
  return generate_device_id(md5(`${username}${username}`))
}

export const generate_signature = (data) => {
  if (typeof data != 'string' && !(data instanceof String)) {
    data = JSON.stringify(data)
  }
  // body = hmac.new(IG_SIG_KEY.encode('utf-8'), data.encode('utf-8'), hashlib.sha256).hexdigest()
  // + '.' + urllib.parse.quote(data)
  const header = sha256.hmac(IG_SIG_KEY, data)
  const body = header + `.` + encodeURIComponent(data)
  const signature = `ig_sig_key_version=4&signed_body=${body}`

  return signature
}
