import * as methods from './methods'
const AVAILABLE_METHODS = Object.keys(methods)


class History {
  static get AVAILABLE_METHODS() {
    return AVAILABLE_METHODS
  }

  save (method, params, result) {
    console.log(method, params, result)

    return {}
  }

  get (...args) {
    return {}
  }

}

export default History
