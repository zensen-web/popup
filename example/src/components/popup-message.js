import { css, html } from 'lit-element'

import { Popup } from '../../../src/popup'

import { openPopup } from '../../../src'

class MessagePopup extends Popup {
  static get properties () {
    return {
      state: Object,
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
          width: 28rem;
          height: 8rem;
          background-color: red;
        }

        .text {
          margin: 0;
          padding: 0;
        }

        .text-title {
          font-size: 2.4rem;
        }

        .text-message {
          font-size: 1.6rem;
        }
      `,
    ]
  }

  constructor () {
    super()

    this.model = {
      title: '',
      message: '',
    }

    this.state = {
      a: 123,
    }

    this.__handlers = {
      close: () => this.onClose(),
      open: () => openPopup('message', {
        title: 'Sub-Menu',
        message: 'Some more stuff',
      }),
    }
  }

  freeze () {
    return {
      a: 456,
    }
  }

  restore (state) {
    this.state = state
  }

  render () {
    return html`
      <p class="text text-title">${this.model.title}</p>
      <p class="text text-message">${this.model.message}</p>
      <p class="text">a: ${this.state.a}</p>

      <button @click="${this.__handlers.open}">Open</button>
      <button @click="${this.__handlers.close}">Close</button>
    `
  }
}

window.customElements.define('x-popup-message', MessagePopup)
