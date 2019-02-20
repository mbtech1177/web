class InstagramError extends Error {
  constructor(status, message = '') {
    super(message)
    this.status = status

    this.message = `InstagramError ${status}: ${message}`
  }
}

class InstagramConnector {

  isStopped = false

  start = () => this.isStopped = false
  kill = () => this.isStopped = true

  request = (data) => new Promise((resolve, reject) => {
    if (this.isStopped) return reject(new InstagramError(null, `Request was killed`))

    // { method, params } = method

    const req_id = Date.now()

    const handler = (message, sender) => {
      const { status, error } = message
      if (req_id === message.req_id) {
        chrome.runtime.onMessage.removeListener(handler)

        console.log('request', data.method, '->', status, message)

        if (status !== 'ok') {
          reject(new InstagramError(status, error))
        } else {
          resolve(message)
        }
      }
    }

    chrome.runtime.onMessage.addListener(handler)

    chrome.runtime.sendMessage(null, { req_id, ...data })
  })

}

const instagram = new InstagramConnector()
