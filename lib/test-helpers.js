import { html } from 'lit'
import { createStore, combineReducers } from 'redux'

import { configure, popupReducer } from './src'
import { Popup } from './src/popup'

export const ID_BUTTON_SAVE = 'button-save'
export const ID_BUTTON_CLOSE = 'button-close'
export const POPUP_MESSAGE = 'message'
export const POPUP_RESULT = 'asdf'

const INITIAL_STATE = {}

const REDUCERS = combineReducers({
  popup: popupReducer,
})

export const store = createStore(REDUCERS, INITIAL_STATE)
configure(store)

export const RENDERER_POPUPS = {
  [POPUP_MESSAGE]: (hide, index, layout, model, closeHandler) => html`
    <x-popup-test
      .index="${index}"
      .layout="${layout}"
      .model="${model}"
      .onClose="${closeHandler}"
      ?hidden="${hide}"
    ></x-popup-test>
  `,
}

class TestPopup extends Popup {
  static get properties () {
    return {
      __state: Object,
    }
  }

  constructor () {
    super()

    this.__state = {
      a: 123,
    }

    this.__handlers = {
      close: () => this.onClose(),
      save: () => this.onClose(POPUP_RESULT),
    }
  }

  update (changedProps) {
    this.__state = this.model
    super.update(changedProps)
  }

  render () {
    return html`
      <button
        id="${ID_BUTTON_SAVE}"
        @click="${this.__handlers.save}"
      >Save</button>

      <button
        id="${ID_BUTTON_CLOSE}"
        @click="${this.__handlers.close}"
      >Close</button>
    `
  }
}

window.customElements.define('x-popup-test', TestPopup)
