import { connect } from 'pwa-helpers'
import { LitElement, html, css } from 'lit-element'

import { register, unregister, pop, freeze } from './redux'

export const ID_BLOCKER = 'blocker'

export function genComponent (store) {
  return class extends connect(store)(LitElement) {
    static get properties () {
      return {
        __canRender: Boolean,
        __stack: Array,
        __open: {
          reflect: true,
          type: Boolean,
          attribute: 'open',
        },
        __hasPopup: {
          reflect: true,
          type: Boolean,
          attribute: 'haspopup',
        },
        __visible: {
          reflect: true,
          type: Boolean,
          attribute: 'visible',
        },

        key: String,
        renderers: Object,
        layout: {
          reflect: true,
          type: String,
        },
        hideBlocker: {
          reflect: true,
          type: Boolean,
        },
      }
    }

    static get styles () {
      return css`
        :host {
          display: block;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.0);
          transition: background-color 200ms ease-in;
        }

        :host([haspopup]) {
          background-color: rgba(0, 0, 0, 0.5);
        }

        :host([visible]) {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        :host([hideBlocker]) {
          position: unset;
          background-color: transparent;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
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
      this.__open = false
      this.__restore = false
      this.__visible = false
      this.__hasPopup = false
      this.__canRender = true
      this.__popupElem = null
      this.__stack = []

      this.key = 'main'
      this.hideBlocker = false
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

    connectedCallback () {
      super.connectedCallback()

      this.addEventListener('transitionend', () => {
        this.__open = Boolean(this.__stack.length)
      })
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
      this.__canRender = false
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

      this.__visible = this.__hasPopup || this.__open
      super.update(changedProps)
    }

    updated (changedProps) {
      const blockerElem = this.shadowRoot.getElementById(ID_BLOCKER)
      this.__popupElem = blockerElem ? blockerElem.firstElementChild : null
      this.__canRender = true

      if (changedProps.has('__stack')) {
        const stack = this.__stack
        const oldStack = changedProps.get('__stack')

        this.__restore = oldStack && oldStack.length > stack.length
      }

      if (this.__popupElem && this.__restore) {
        const lastItem = this.__stack[this.__stack.length - 1]
        if (lastItem.state) {
          this.__popupElem.restore({ ...lastItem.state })
        }

        this.__restore = false
      }
    }

    render () {
      const item = this.getLastItem()
      const renderer = item ? this.renderers[item.key] : null
      if (item && !renderer) {
        item.dismiss(new Error('Invalid renderer:', item.key))
      }

      const canRender = this.__canRender && renderer
      return this.__hasPopup || this.__open
        ? html`
          <div id="${ID_BLOCKER}" class="container">
            ${canRender ? renderer(this.layout, item.model, this.__handlers.close) : ''}
          </div>
        `
        : html``
    }
  }
}
