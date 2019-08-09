import { css, html } from 'lit-element'

import { Popup } from '../../../src/popup'
import { openPopup } from '../../../src'

class Overlay extends Popup {
  static get properties () {
    return {
      __value: String,
      __transition: {
        reflect: true,
        type: Boolean,
        attribute: 'transition',
      },
    }
  }

  static get styles () {
    return [
      super.styles,
      css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        :host {
          width: 100%;
          height: 100%;
        }

        .container {
          width: 28rem;
          height: 100%;
          background-color: #FFF;
          transform: translateX(-100%);
          transition: transform 200ms ease-out;
        }

        :host([transition]) .container {
          transform: translateX(0);
        }

        .text {
          margin: 0;
        }
      `,
    ]
  }

  constructor () {
    super()
    this.__transition = false
    this.__value = ''

    this.__handlers = {
      dismiss: () => (this.__transition = false),
      keyPress: e => (this.__value = e.currentTarget.value),
      transitionEnd: () => {
        if (!this.__transition) {
          this.onClose()
        }
      },
      open: () =>
        openPopup('overlay', {
          title: 'Overlay',
          message: 'This is in the overlay stack',
        }, 'overlay'),
    }
  }

  freeze () {
    return { value: this.__value }
  }

  restore (state) {
    this.__value = state.value
  }

  firstUpdated () {
    super.firstUpdated()

    this.__transition = true
  }

  render () {
    return html`
      <div
        class="container"
        @transitionend="${this.__handlers.transitionEnd}"
      >
        <p class="text text-title">${this.model.title}</p>
        <p class="text text-message">${this.model.message}</p>

        <button @click="${this.__handlers.open}">Open</button>
        <button @click="${this.__handlers.dismiss}">Dismiss</button>
        <input
          type="text"
          .value="${this.__value}"
          @keyup="${this.__handlers.keyPress}"
        >
      </div>
    `
  }
}

window.customElements.define('x-overlay', Overlay)
