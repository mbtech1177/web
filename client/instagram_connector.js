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
  _currend_id = ""
  _instaweb_dev_id = "kmdamjjnlpjgbnaeaboghopmcchjpaep"
  _instaweb_id = "njonkbhnmmjgancfbncekpgkmidhbbpo"

  isStopped = false
  isConnected = false

  _check_working_id = () => new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      this._instaweb_id,
      { method: 'ping' }, null,
      ({ status, pong } = {}) => status === 'ok' && pong && resolve(this._instaweb_id))

    chrome.runtime.sendMessage(
      this._instaweb_dev_id,
      { method: 'ping' }, null,
      ({ status, pong } = {}) => status === 'ok' && pong && resolve(this._instaweb_dev_id))

    setTimeout(() => reject(new NotInstalledError(`Cant find any working extension`)), 500)
  })

  init = async () => {
    try {
      this._currend_id = await this._check_working_id()

      this.isConnected = true
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

      console.log('request', data.method, '->', status, message)

      if (status !== 'ok') {
        reject(new InstagramError(status, error))
      } else {
        resolve(message)
      }
    }

    setTimeout(() => reject(new TimeoutError(`Request timeout`)), 1000)

    console.log(`send_message`, this._currend_id, data)
    chrome.runtime.sendMessage(this._currend_id, data, null, handler)
  })

}

const instagram = new InstagramConnector()
