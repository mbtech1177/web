const updateConnectionStatus = (status) => {
  return {
    type: 'UPDATE_CONNECTION_STATUS',
    payload: {
      connectionStatus: status
    }
  }
}

const showLoader = () => {
  return {
    type: 'LOADER',
    payload: {
      isLoading: true,
    }
  }
}

const hideLoader = () => {
  return {
    type: 'LOADER',
    payload: {
      isLoading: false,
    }
  }
}

const printLog = (line, newLine = true) => {
  return {
    type: 'PRINT_LOG',
    payload: {
      line: String(line),
      newLine,
    }
  }
}

const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: {
      user,
    }
  }
}

const showErrorMessage = (error) => {
  return {
    type: 'SET_USER',
    payload: {
      error,
    }
  }
}
