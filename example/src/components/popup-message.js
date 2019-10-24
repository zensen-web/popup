import { css, html } from 'lit-element'

import { Popup } from '../../../src/popup'

import { openPopup } from '../../../src'

class MessagePopup extends Popup {
  static get properties () {
    return {
      __value: String,
      __result: String,
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
          width: 28rem;
          opacity: 0;
          background-color: #FFF;
          transform: translateY(-2.4rem);
          transition: all 200ms ease-out;
        }

        :host([transition][active]) {
          opacity: 1;
          transform: translateX(0);
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

    this.__transition = false
    this.__result = ''
    this.__value = ''

    this.__handlers = {
      change: e => (this.__value = e.currentTarget.value),
      close: () => (this.__transition = false),
      open: async () => {
        this.__result = await openPopup('message', {
          title: 'Sub-Menu',
          message: 'Some more stuff',
        })
      },
    }
  }

  connectedCallback () {
    super.connectedCallback()

    this.addEventListener('transitionend', e => {
      if (e.propertyName === 'transform' && !this.__transition) {
        this.onClose(this.__value)
      }
    })
  }

  reactivated () {
    console.info('reactivated()')
  }

  deactivated () {
    console.info('deactivated()')
  }

  firstUpdated () {
    super.firstUpdated()

    this.__transition = true
  }

  render () {
    return html`
      <p class="text text-title">${this.model.title}</p>
      <p class="text text-message">${this.model.message}</p>
      <p>Result: ${this.__result ? this.__result : 'N/A'}</p>

      <div>
        <input
          .value="${this.__value}"
          @input="${this.__handlers.change}"
        />
      </div>

      <button @click="${this.__handlers.open}">Open</button>
      <button @click="${this.__handlers.close}">Close</button>
    `
  }
}

window.customElements.define('x-popup-message', MessagePopup)
