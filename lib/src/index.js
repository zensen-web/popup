import { Popup } from './popup'
import { genComponent } from './popup-stack'
import { push, clear, reducer, pop } from './redux'

let __store = null

export default {
  Component: Popup,
  reducer,
  configure (store) {
    __store = store

    const component = genComponent(store)
    window.customElements.define('zen-popup-stack', component)
  },
  push (key, model = {}, stack = 'main') {
    return new Promise((resolve, reject) => {
      const detail = {
        key,
        model,
        dismiss: response =>
          (response instanceof Error ? reject(response) : resolve(response)),
      }

      __store.dispatch(push(stack, detail))
    })
  },
  pop (key = 'main') {
    __store.dispatch(pop(key))
  },
  clear (key = 'main') {
    __store.dispatch(clear(key))
  },
}
