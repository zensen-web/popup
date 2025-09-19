import popup from '../../../lib/src'

import { createLogger } from 'redux-logger'

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

const INITIAL_STATE = {}

const REDUCERS = combineReducers({
  popup: popup.reducer,
})

const enhancers = [applyMiddleware(createLogger())]

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}

const store = createStore(REDUCERS, INITIAL_STATE, compose(...enhancers))
popup.configure(store)

export default store
