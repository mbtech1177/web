const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const request = async (data, passError = false) => {
  try {
    showLoader()
    const message = await instagram.request(data)
    // printOutput(`${JSON.stringify(message)}`)
    return message
  } catch (err) {
    if (passError) {
      hideLoader()
      throw err
    } else {
      alert(`Request to Instagram service errored: ${err.message}`)
    }
  } finally {
    hideLoader()
  }
}

const instagramUrl = (item = {}) => {
  if (!item.code) return ``
  return `https://instagram.com/p/${item.code}`
}
