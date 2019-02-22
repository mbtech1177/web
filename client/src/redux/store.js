const { createStore, combineReducers } = Redux

const initialState = {
  isLoading: false,
  connection: {
    status: CONNECTION.UNKNOWN,
    description: '',
  },
  log: JSON.parse(localStorage.getItem('log')) || [],
  user: {},
  error: '',
}

const reducer = (state = initialState, action) => {
  console.log('action', action)

  if (action.type === 'PRINT_LOG') {
    const { line, newLine } = action.payload

    const log = newLine
      ? [ ...state.log, `<br>`, line ]
      : [ ...state.log, line ]

    localStorage.setItem('log', JSON.stringify(log))

    return {
      ...state,
      log,
    }
  }

  return {
    ...state,
    ...action.payload,
  }
}

const store = createStore(reducer)
