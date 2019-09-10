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

export function openPopup (popupArg) {
  return new Promise((resolve, reject) => {
    const detail = {
      key: '',
      model: {},
      useBlocker: true,
      dismiss: response =>
        (response instanceof Error ? reject(response) : resolve(response)),
    }

    if (typeof popupArg === 'string') {
      detail.key = popupArg
    } else {
      detail.key = popupArg.key
      detail.model = popupArg.model
      if ('useBlocker' in popupArg) detail.useBlocker = popupArg.useBlocker
    }

    __store.dispatch(push(detail, popupArg.stack || 'main'))
  })
}

export function popPopup (key = 'main') {
  __store.dispatch(pop(key))
}

export function clearPopups (key = 'main') {
  __store.dispatch(clear(key))
}
