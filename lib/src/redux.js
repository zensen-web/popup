const POPUP_REGISTER = 'POPUP_REGISTER'
const POPUP_UNREGISTER = 'POPUP_UNREGISTER'
const POPUP_PUSH = 'POPUP_PUSH'
const POPUP_POP = 'POPUP_POP'
const POPUP_CLEAR = 'POPUP_CLEAR'

export function register (key) {
  return {
    type: POPUP_REGISTER,
    key,
  }
}

export function unregister (key) {
  return {
    type: POPUP_UNREGISTER,
    key,
  }
}

export function push (key, detail) {
  return {
    type: POPUP_PUSH,
    key,
    detail,
  }
}

export function pop (key, result) {
  return { type: POPUP_POP, key, result }
}

export function clear (key) {
  return { type: POPUP_CLEAR, key }
}

export function reducer (state = {}, action) {
  switch (action.type) {
    case POPUP_REGISTER:
      if (state[action.key]) {
        throw new Error(`Key already in use: ${action.key}`)
      }

      return {
        ...state,
        [action.key]: [],
      }

    case POPUP_UNREGISTER:
      const result = { ...state }
      delete result[action.key]
      return result

    case POPUP_PUSH:
      return {
        ...state,
        [action.key]: [
          ...state[action.key],
          action.detail,
        ],
      }

    case POPUP_POP:
      const stack = state[action.key]
      const item = stack[stack.length - 1]
      item.dismiss(action.result)

      return {
        ...state,
        [action.key]: state[action.key].slice(0, -1),
      }

    case POPUP_CLEAR:
      state[action.key].forEach(item => item.dismiss())

      return {
        ...state,
        [action.key]: [],
      }
  }

  return state
}
