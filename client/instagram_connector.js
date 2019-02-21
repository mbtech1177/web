class InstagramError extends Error {
  constructor(status, message = '') {
    super(message)
    this.status = status

    this.message = `InstagramError ${status}: ${message}`
  }
}

class TimeoutError extends Error {}
class NotInstalledError extends Error {}

class InstagramConnector {
  _instaweb_id = "kmdamjjnlpjgbnaeaboghopmcchjpaep"

  isStopped = false
  isConnected = false

  init = async () => {
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

  start = () => this.isStopped = false
  kill = () => this.isStopped = true

  request = (data) => new Promise((resolve, reject) => {
    if (this.isStopped) return reject(new Error(`Request was killed`))

    // { method, params } = method

    const req_id = Date.now()

    const handler = (message, sender) => {
      if (!message) return reject(new NotInstalledError())

      const { status, error } = message

      if (message.req_id && req_id !== message.req_id) return

      chrome.runtime.onMessage && chrome.runtime.onMessage.removeListener(handler)

      console.log('request', data.method, '->', status, message)

      if (status !== 'ok') {
        reject(new InstagramError(status, error))
      } else {
        resolve(message)
      }
    }

    setTimeout(() => reject(new TimeoutError(`Request timeout`)), 1000)

    chrome.runtime.onMessage && chrome.runtime.onMessage.addListener(handler)

    console.log(`send_message`, this._instaweb_id, data)
    chrome.runtime.sendMessage(this._instaweb_id, data, null, handler)
  })

}

const instagram = new InstagramConnector()
