const doConnect = async () => {
  try {
    await instagram.init()

    if (!instagram.isConnected) {
      updateConnectionStatus(CONNECTION.NOT_INSTALLED)
    }

    const { user } = await request({ method: 'check_login' }, true)

    if (user && user.pk) {
      updateConnectionStatus(CONNECTION.LOGGED_IN)
      // alert(`Website connected to the extension. Username: @${user.full_name}`)
    } else {
      updateConnectionStatus(CONNECTION.NOT_LOGGED_IN)
      // alert(`Connected to the extension, but it's not logged in. Please login via pressing extension logo`)
    }

    instagram.kill()

  } catch (err) {
    console.error(err)
    alert(err.message)
    updateConnectionStatus(CONNECTION.UNKNOWN)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("extension-connected")) {
    doConnect()
    initButtons()
  }
}, false)
