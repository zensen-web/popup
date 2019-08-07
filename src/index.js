import { Popup } from './popup'
import { genComponent } from './popup-stack'
import { push, clear, reducer as popupReducer, pop } from './redux'

let __store = null

export {
  popupReducer,
  Popup,
}

export function configure (store) {
  __store = store

  const component = genComponent(store)
  window.customElements.define('zen-popup-stack', component)
}

export function openPopup (key, model = {}, stack = 'main') {
  return new Promise((resolve, reject) => {
    const detail = {
      key,
      model,
      dismiss: response =>
        (response instanceof Error ? reject(response) : resolve(response)),
    }

    __store.dispatch(push(detail, stack))
  })
}

export function popPopup (key = 'main') {
  __store.dispatch(pop(key))
}

export function clearPopups (key = 'main') {
  __store.dispatch(clear(key))
}
