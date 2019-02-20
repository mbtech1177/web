const CONNECTION = Object.freeze({
  UNKNOWN:        `Connection status: UNKNOWN`,
  NOT_INSTALLED:  `Connection status: NOT_INSTALLED`,
  NOT_LOGGED_IN:  `Connection status: NOT_LOGGED_IN`,
  LOGGED_IN:      `Connection status: LOGGED_IN`,
})

let status = CONNECTION.UNKNOWN

const showLoader = () => document.getElementById("loading").style.display = ''
const hideLoader = () => document.getElementById("loading").style.display = 'none'

const printOutput = (output) =>
  document.getElementById("output").innerText = String(output)

const printLog = (line, newLine = true) => {
  console.log('PrintLog', line)
  document.getElementById("log").innerHTML +=
    (newLine ? `<br>` : ``)
    + `${String(line)}`
}

const updateConnectionStatus = (_status) => {
  status = _status

  if (status === CONNECTION.NOT_INSTALLED) {
    document.getElementById("extensionInstalled").style.display = ''
  } else {
    document.getElementById("extensionInstalled").style.display = 'none'
  }

  if (status === CONNECTION.NOT_LOGGED_IN) {
    document.getElementById("loggedIn").style.display = 'none'
    document.getElementById("notLoggedIn").style.display = ''
  } else if (status === CONNECTION.LOGGED_IN) {
    document.getElementById("loggedIn").style.display = ''
    document.getElementById("notLoggedIn").style.display = 'none'
  } else {
    document.getElementById("loggedIn").style.display = 'none'
    document.getElementById("notLoggedIn").style.display = 'none'
  }

  document.getElementById("connectionStatus").innerText = status
}
