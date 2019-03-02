class InstagramError extends Error {
  constructor(status, errorMessage = '', { error_title, error_type, message } = {}) {
    let _message = ''

    if (error_title) {
      _message = `${error_title}`
    } else if (error_type) {
      _message = `${error_type}`
    } else if (message) {
      _message = `${message}`
    } else if (errorMessage) {
      _message = `${status}: ${errorMessage}`
    } else {
      _message = `${status}`
    }

    super(errorMessage)

    this.name = `InstagramError`
    this.status = status
    this.message = _message

    // error_title: "Incorrect password for phystechtv"
    // error_type: "bad_password"
    // invalid_credentials: true
    // message: "The password you entered is incorrect. Please try again."
    // status: "fail"

    // console.log('building error', error_title, error_type, message)
    // console.log('building error', this, status, errorMessage, message)

  }
}

class TimeoutError extends Error {}

class InstagramConnector {

  constructor() {
    this.isStopped = false
    this.isConnected = false
  }

  async init () {
    try {
      const ping = await this.request({
        method: 'ping'
      })

      console.log('ping', ping)

      this.isConnected = ping.status === 'ok' && Boolean(ping.pong)
    } catch (err) {
      if (err instanceof TimeoutError) {
        this.isConnected = false
        return
      }

      throw err
    }

  }

  start () { this.isStopped = false }
  kill () { this.isStopped = true }

  request (data) {
    return new Promise((resolve, reject) => {

    if (this.isStopped) return reject(new Error(`Request was killed`))

    // { method, params } = method

    const req_id = Date.now()

    const handler = (message, sender) => {
      const { status, error } = message

      if (message.req_id && req_id !== message.req_id) return

      chrome.runtime.onMessage && chrome.runtime.onMessage.removeListener(handler)

      console.log('request', data.method, '->', status, message)

      if (status !== 'ok') {
        reject(new InstagramError(status, error, message))
      } else {
        resolve(message)
      }
    }

    setTimeout(() => reject(new TimeoutError(`Request timeout`)), 10000)

    chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(handler)

    console.log(`send_message`, null, { req_id, ...data })
    chrome.runtime.sendMessage(null, { req_id, ...data })

    })

  }

}

const instagram = new InstagramConnector()
