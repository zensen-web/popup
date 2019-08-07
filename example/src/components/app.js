import './popup-message'

import { LitElement, html, css } from 'lit-element'

import { openPopup } from '../../../src'

export const RENDERER_POPUPS = {
  message: (layout, model, closeHandler) => html`
    <x-popup-message
      .layout="${layout}"
      .model="${model}"
      .onClose="${closeHandler}"
    ></x-popup-message>
  `,
}

class App extends LitElement {
  static get styles () {
    return css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      :host {
        display: block;
        font-size: 1.4rem;
      }

      .container {
        display: flex;
        width: 100%;
        height: 100%;
        flex-flow: nowrap column;
      }

      .overlay-stack {
        top: 8rem;
      }
    `
  }

  constructor () {
    super()
    this.__initHandlers()
  }

  __initHandlers () {
    this.__handlers = {
      showOverlay: () =>
        openPopup('message', {
          title: 'Overlay',
          message: 'This is in the overlay stack',
        }, 'overlay'),
      showPopup: () =>
        openPopup('message', {
          title: 'Hello',
          message: 'Welcome to this app!',
        }),
    }
  }

  render () {
    return html`
      <div class="container">
      <button @click="${this.__handlers.showOverlay}">Show Overlay</button>
      <button @click="${this.__handlers.showPopup}">Show Popup</button>

        <zen-popup-stack
          class="overlay-stack"
          key="overlay"
          .renderers="${RENDERER_POPUPS}"
        ></zen-popup-stack>

        <zen-popup-stack .renderers="${RENDERER_POPUPS}"></zen-popup-stack>
      </div>
    `
  }
}

window.customElements.define('x-app', App)
