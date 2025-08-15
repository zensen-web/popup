import { configure, popupReducer } from '../../../src'

import { createLogger } from 'redux-logger'

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

const INITIAL_STATE = {}

const REDUCERS = combineReducers({
  popup: popupReducer,
})

const enhancers = [applyMiddleware(createLogger())]

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}

const store = createStore(REDUCERS, INITIAL_STATE, compose(...enhancers))
configure(store)

export default store
