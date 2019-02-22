const CONNECTION = Object.freeze({
  UNKNOWN:        `Connection status: UNKNOWN`,
  NOT_INSTALLED:  `Connection status: NOT_INSTALLED`,
  NOT_LOGGED_IN:  `Connection status: NOT_LOGGED_IN`,
  LOGGED_IN:      `Connection status: LOGGED_IN`,
})

const CONNECTION_MESSAGES = {
  [CONNECTION.UNKNOWN]: `Unknown error`,
  [CONNECTION.NOT_INSTALLED]: `Extension is not installed or not detected`,
  [CONNECTION.NOT_LOGGED_IN]: `Connected to the extension, but it's not logged in. Please login via pressing extension logo`,
  [CONNECTION.LOGGED_IN]: `Website connected to the extension.`,
}
