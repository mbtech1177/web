const saveToHistory = (request, response) => {
  const savedAt = Date.now()
  return new Promise((resolve, reject) => {
    resolve(response)
    // chrome.storage.local.get(['history'], ({ history = [] }) => {
    //   const entry = { savedAt, request, response }
    //   chrome.storage.local.set({ history: [ ...history, entry ]}, () => {
    //   })
    // })
    //
    // setTimeout(() => reject('Storage Error: Cant save to history (you probably can ignore this error)'), 5000)
  })
}

const getHistory = () => new Promise((resolve, reject) => {
  chrome.storage.local.get(['history'], ({ history = [] }) => {
    resolve(history)
  })
})
