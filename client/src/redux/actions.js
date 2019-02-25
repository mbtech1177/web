const updateConnectionStatus = (status) => {
  return {
    type: 'UPDATE_CONNECTION_STATUS',
    payload: {
      connection: {
        status,
        description: CONNECTION_MESSAGES[status],
      }
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

const updateInstagramServiceStatus = ({ isStopped }) => {
  return {
    type: 'INSTAGRAM',
    payload: {
      instagram: {
        isStopped,
      }
    }
  }
}

const notifyWhenQueueFinished = () => {
  return {
    type: 'ALERT_WHEN_QUEUE_FINISHED',
    payload: {
      notifyWhenQueueFinished: true,
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

const clearLog = () => {
  return {
    type: 'CLEAR_LOG',
    payload: {}
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
    type: 'SHOW_ERROR',
    payload: {
      error,
    }
  }
}

const updateStats = (data) => {
  return {
    type: 'UPDATE_STATS',
    payload: {
      stats: data,
    }
  }
}
