
class Collection {

  get default_key() {
    return 'misc'
  }

  constructor(name, available_keys) {
    this.name = name || 'collection'
    this.available_keys = available_keys
  }

  async save (key, values) {
    const savedAt = Date.now()

    if (!this.available_keys.includes(key)) {
      key = this.default_key
    }

    const entry = { savedAt, ...values }

    return ChromeStorage.append(`${this.name}.${key}`, entry)
  }

  async set(key, values) {
    const savedAt = Date.now()

    if (!this.available_keys.includes(key)) {
      key = this.default_key
    }

    const entry = { savedAt, ...values }

    return ChromeStorage.set(`${this.name}.${key}`, entry)
  }

  async get (...keys) {
    keys = keys.length ? keys : this.available_keys

    const _keys = keys.map(key => `${this.name}.${key}`)

    const result = await ChromeStorage.get(..._keys)

    return keys.reduce((obj, key) => ({
      ...obj,
      [key]: result[`${this.name}.${key}`] || [],
    }), {})
  }

}
