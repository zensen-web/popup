import { connect } from 'pwa-helpers'
import { LitElement, html, css } from 'lit-element'

import { register, unregister, pop, freeze } from './redux'

export const ID_BLOCKER = 'blocker'

export function genComponent (store) {
  return class extends connect(store)(LitElement) {
    static get properties () {
      return {
        __stack: Array,
        __hasPopup: {
          reflect: true,
          type: Boolean,
          attribute: 'haspopup',
        },

        key: String,
        renderers: Object,
        layout: {
          reflect: true,
          type: String,
        },
      }
    }

    static get styles () {
      return css`
        :host {
          display: block;
          position: absolute;
          width: 0;
          height: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }

        :host([haspopup]) {
          width: 100%;
          height: 100%;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      `
    }

    constructor () {
      super()
      this.__initState()
      this.__initHandlers()
    }

    __initState () {
      this.__popupElem = null
      this.__stack = []

      this.key = 'main'
      this.layout = ''
      this.renderers = {}
    }

    __initHandlers () {
      this.__handlers = {
        close: result => {
          const item = this.getLastItem()
          if (item && item.dismiss) {
            item.dismiss(result)
          }

          store.dispatch(pop(this.key))
        },
      }
    }

    disconnectedCallback () {
      super.disconnectedCallback()

      if (this.key) {
        store.dispatch(unregister(this.key))
      }
    }

    stateChanged (state) {
      this.__stack = state.popup[this.key] || []
    }

    getLastItem () {
      return this.__stack.length > 0
        ? this.__stack[this.__stack.length - 1]
        : null
    }

    updateKey (changedProps) {
      const oldKey = changedProps.get('key')
      if (oldKey) {
        store.dispatch(unregister(oldKey))
      }

      if (this.key) {
        store.dispatch(register(this.key))
      }
    }

    updateStack (changedProps) {
      this.__hasPopup = Boolean(this.__stack.length)

      const stackLength = this.__stack.length
      const oldStack = changedProps.get('__stack')

      if (this.__popupElem && oldStack && oldStack.length < stackLength) {
        const state = this.__popupElem.freeze()
        store.dispatch(freeze(state, this.key))
      }
    }

    update (changedProps) {
      if (changedProps.has('key')) {
        this.updateKey(changedProps)
      }

      if (changedProps.has('__stack')) {
        this.updateStack(changedProps)
      }

      super.update(changedProps)
    }

    updated (changedProps) {
      const blockerElem = this.shadowRoot.getElementById(ID_BLOCKER)
      this.__popupElem = blockerElem ? blockerElem.firstElementChild : null

      const stack = this.__stack
      const oldStack = changedProps.get('__stack')

      if (this.__popupElem && oldStack && oldStack.length > stack.length) {
        const lastItem = this.__stack[this.__stack.length - 1]
        if (lastItem.state) {
          this.__popupElem.restore({ ...lastItem.state })
        }
      }
    }

    render () {
      const item = this.getLastItem()
      if (item) {
        const renderer = this.renderers[item.key]
        if (!renderer) {
          item.dismiss(new Error('Invalid renderer:', item.key))
        }

        return html`
          <div id="${ID_BLOCKER}" class="container">
          ${renderer(this.layout, item.model, this.__handlers.close)}
          </div>
        `
      }

      return html``
    }
  }
}
