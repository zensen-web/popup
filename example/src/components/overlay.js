import { css, html } from 'lit-element'

import { Popup } from '../../../src/popup'
import { openPopup } from '../../../src'

export const ID_CONTAINER = 'container'

export const TRANSITION_SIDE = {
  LEFT: 'left',
  RIGHT: 'right',
}

const CSS_LEFT = css`left`
const CSS_RIGHT = css`right`

class Overlay extends Popup {
  static get properties () {
    return {
      __value: String,
      __transition: {
        reflect: true,
        type: Boolean,
        attribute: 'transition',
      },

      side: {
        reflect: true,
        type: String,
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
          position: relative;
          width: 100%;
          height: 100%;
        }

        .content {
          position: absolute;
          top: 0;
          width: 28rem;
          height: 100%;
          background-color: #FFF;
        }

        :host([side=${CSS_LEFT}]) .content {
          left: 0;
          transform: translateX(-100%);
          transition: transform 200ms ease-out;
        }

        :host([side=${CSS_RIGHT}]) .content {
          right: 0;
          transform: translateX(100%);
          transition: transform 200ms ease-out;
        }

        :host([transition]) .content {
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
    this.canDismiss = true
    this.side = TRANSITION_SIDE.LEFT

    this.__transition = false
    this.__value = ''

    this.__handlers = {
      keyPress: e => (this.__value = e.currentTarget.value),
      clickDismissButton: () => this.dismiss(),
      clickBlocker: e => {
        if (e.target.id === ID_CONTAINER) {
          this.dismiss()
        }
      },
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

  dismiss () {
    if (this.canDismiss) {
      this.__transition = false
    }
  }

  firstUpdated () {
    super.firstUpdated()

    this.__transition = true
  }

  render () {
    return html`
      <div
        id="${ID_CONTAINER}"
        class="container"
        @click="${this.__handlers.clickBlocker}"
      >
        <div class="content" @transitionend="${this.__handlers.transitionEnd}">
          <p class="text text-title">${this.model.title}</p>
          <p class="text text-message">${this.model.message}</p>

          <button @click="${this.__handlers.open}">Open</button>

          <button
            @click="${this.__handlers.clickDismissButton}"
          >Dismiss</button>

          <input
            type="text"
            .value="${this.__value}"
            @keyup="${this.__handlers.keyPress}"
          >
        </div>
      </div>
    `
  }
}

window.customElements.define('x-overlay', Overlay)
