const POPUP_REGISTER = 'POPUP_REGISTER'
const POPUP_UNREGISTER = 'POPUP_UNREGISTER'
const POPUP_FREEZE = 'POPUP_FREEZE'
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

export function freeze (state, key) {
  return {
    type: POPUP_FREEZE,
    state,
    key,
  }
}

export function push (detail, key) {
  return {
    type: POPUP_PUSH,
    detail,
    key,
  }
}

export function pop (key) {
  return { type: POPUP_POP, key }
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

    case POPUP_FREEZE:
      const stack = [ ...state[action.key] ]
      if (stack.length > 1) {
        const targetItem = stack[stack.length - 2]
        targetItem.state = action.state || null
      }

      return {
        ...state,
        [action.key]: stack,
      }

    case POPUP_PUSH:
      return {
        ...state,
        [action.key]: [
          ...state[action.key],
          action.detail,
        ],
      }

    case POPUP_POP:
      return {
        ...state,
        [action.key]: state[action.key].slice(0, -1),
      }

    case POPUP_CLEAR:
      return {
        ...state,
        [action.key]: [],
      }
  }

  return state
}
