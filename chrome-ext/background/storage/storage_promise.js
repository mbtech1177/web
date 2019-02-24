class ChromeStorage {
  static set(key, value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject('Storage Error: Cant save'), 1000)

      chrome.storage.local.set({ [key]: value }, () => {
        resolve(value)
      })
    })
  }

  static get(...keys) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject('Storage Error: Cant fetch'), 1000)

      chrome.storage.local.get(keys, (obj) => {
        resolve(obj)
      })
    })
  }

  static async append(key, newValue) {
    const { [key]: arr } = await ChromeStorage.get(key)

    const newArr = [
      ...(arr || []),
      newValue,
    ]

    return ChromeStorage.set(key, newArr)
  }
}
