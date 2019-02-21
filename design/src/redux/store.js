const { createStore, combineReducers } = Redux

const initialState = {
  isLoading: false,
  connectionStatus: CONNECTION.UNKNOWN,
  log: [],
  user: {},
  error: '',
}

const reducer = (state = initialState, action) => {
  console.log('action', action)
  if (action.type === 'PRINT_LOG') {
    return {
      ...state,
      log: action.payload.newLine
        ? [ ...state.log, `<br>`, action.payload.line ]
        : [ ...state.log, action.payload.line ],
    }
  }

  return {
    ...state,
    ...action.payload,
  }
}

const store = createStore(reducer)
