class ChromeHistory extends History {

  collection = new Collection('history', [
    ...History.AVAILABLE_METHODS, 'login', 'misc'
  ])

  async save (method, params, result) {
    const { status } = result

    const entry = { params, status }

    return this.collection.save(method, entry)
  }

  async get (...methods) {
    return this.collection.get(...methods)
  }

}
