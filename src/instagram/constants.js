export const API_URL = 'https://i.instagram.com/api/v1/'
export const LOGIN_URL = API_URL + 'accounts/login/'

// # I have more devices here:
// # https://github.com/instagrambot/instabot/blob/72d10447986db39ac95f3d0980936d9c08428b02/instabot/api/devices.py
// # idk which to use, let's for now use this one, because it is just works

export const DEVICE = {
    'instagram_version': '26.0.0.10.86',
    'android_version': 24,
    'android_release': '7.0',
    'dpi': '640dpi',
    'resolution': '1440x2560',
    'manufacturer': 'HUAWEI',
    'device': 'LON-L29',
    'model': 'HWLON',
    'cpu': 'hi3660'
}

export const REQUEST_HEADERS = {
    'X-IG-Capabilities': '3brTBw==', // base64.b64encode(struct.pack('<i', 131316445)).decode('ascii')
    'X-IG-Connection-Type': 'WIFI',
    'X-FB-HTTP-Engine': 'Liger',
    'Accept': '*/*',
    'Accept-Language': 'en-US',
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',

    'Accept-Encoding': 'gzip,deflate',
    'Connection': 'Keep-Alive',
    'Cookie2': '$Version=1',

      // xhr.js:126 Refused to set unsafe header "User-Agent"
      // xhr.js:126 Refused to set unsafe header "Connection"
      // xhr.js:126 Refused to set unsafe header "Accept-Encoding"
      // xhr.js:126 Refused to set unsafe header "Cookie2"

      // 'X-Instaweb-Accept-Encoding': 'gzip,deflate',
      // 'X-Instaweb-Connection': 'Keep-Alive',
      // 'X-Instaweb-Cookie2': '$Version=1',
}


export const IG_SIG_KEY = '99e16edcca71d7c1f3fd74d447f6281bd5253a623000a55ed0b60014467a53b1'

// console.log(" ---> Preparing consts:")

export const USER_AGENT_BASE = (params) =>
    `Instagram ${params.instagram_version} `
  + `Android (${params.android_version}/${params.android_release}; `
  + `${params.dpi}; ${params.resolution}; ${params.manufacturer}; `
  + `${params.device}; ${params.model}; ${params.cpu}; en_US)`
