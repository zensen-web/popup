import { connect } from 'pwa-helpers'
import { LitElement, html, css } from 'lit-element'

import { register, unregister, pop } from './redux'

export const CSS_NONE = css`display: none;`

export function genComponent (store) {
  return class extends connect(store)(LitElement) {
    static get properties () {
      return {
        __stack: Array,
        __open: {
          reflect: true,
          type: Boolean,
          attribute: 'open',
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
          attribute: 'hideblocker',
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

          --backdrop-color: rgba(0, 0, 0, 0.5)
        }

        :host([open]) {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        :host([hideblocker]) {
          position: unset;
        }

        .container {
          display: grid;
          height: 100%;
        }

        .blocker {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--backdrop-color);
          grid-area: 1 / 1 / 2 / 2;
        }

        .container[hide] {
          background-color: transparent;
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
      this.__stack = []

      this.hideBlocker = false
      this.key = 'main'
      this.layout = ''
      this.renderers = {}
    }

    __initHandlers () {
      this.__handlers = {
        close: result => store.dispatch(pop(this.key, result)),
      }
    }

    connectedCallback () {
      super.connectedCallback()

      this.addEventListener('transitionend', () =>
        (this.__open = Boolean(this.__stack.length)))
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

    update (changedProps) {
      if (changedProps.has('key')) {
        const oldKey = changedProps.get('key')
        if (oldKey) {
          store.dispatch(unregister(oldKey))
        }

        if (this.key) {
          store.dispatch(register(this.key))
        }
      }

      super.update(changedProps)
    }

    updated (changedProps) {
      if (changedProps.has('__stack')) {
        const stack = this.__stack
        const oldStack = changedProps.get('__stack')

        this.__restore = oldStack && oldStack.length > stack.length
      }
    }

    __renderItem (item, index) {
      const last = index === this.__stack.length - 1
      const hide = this.__stack.length > 1 && !last
      const renderer = this.renderers[item.key]

      if (!renderer) {
        item.dismiss(new Error('Invalid popup key:', item.key))
      }

      return html`
        <div style="z-index: ${index}" class="blocker" ?hide="${hide}">
          ${renderer(false, index, this.layout, item.model, this.__handlers.close)}
        </div>
      `
    }

    render () {
      return html`
        <div class="container">
          ${this.__stack.map((item, index) => this.__renderItem(item, index))}
        </div>
      `
    }
  }
}
