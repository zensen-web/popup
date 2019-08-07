import { createStore, combineReducers } from 'redux'

import { configure, popupReducer } from '../../src'

const INITIAL_STATE = {}

const REDUCERS = combineReducers({
  popup: popupReducer,
})

const store = createStore(REDUCERS, INITIAL_STATE)
configure(store)

export default store
