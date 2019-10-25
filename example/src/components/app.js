import './popup-message'
import './overlay'

import { LitElement, html, css } from 'lit-element'

import { openPopup } from '../../../src'

export const RENDERER_POPUPS = {
  message: (hide, index, layout, model, closeHandler) => html`
    <x-popup-message
      .index="${index}"
      .layout="${layout}"
      .model="${model}"
      .onClose="${closeHandler}"
      ?hidden="${hide}"
    ></x-popup-message>
  `,
  overlay: (hide, index, layout, model, closeHandler) => html`
    <x-overlay
      .index="${index}"
      .layout="${layout}"
      .model="${model}"
      .onClose="${closeHandler}"
      ?hidden="${hide}"
    ></x-overlay>
`,
}

class App extends LitElement {
  static get properties () {
    return {
      __result: String,
    }
  }

  static get styles () {
    return css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      :host {
        display: block;
        width: 100vw;
        height: 100vh;
        font-size: 1.4rem;
      }

      .container {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
        flex-flow: nowrap column;
      }

      .overlay-stack[visible] {
        top: 4.8rem;
      }

      .button {
        outline: none;
        border: none;
        background: transparent;
        height: 2.4rem;
      }

      .button-overlay {
        background-color: #77F;
      }

      .button-popup {
        background-color: #7F7;
      }
    `
  }

  constructor () {
    super()

    this.__initHandlers()

    this.__result = ''
  }

  __initHandlers () {
    this.__handlers = {
      showOverlay: () =>
        openPopup('overlay', {
          title: 'Overlay',
          message: 'This is in the overlay stack',
        }, 'overlay'),
      showPopup: async () =>
        (this.__result = await openPopup('message', {
          title: 'Hello',
          message: 'Welcome to this app!',
        })),
    }
  }

  render () {
    return html`
      <div class="container">
        <button
          class="button button-popup"
          @click="${this.__handlers.showPopup}"
        >Show Popup</button>

        <button
          class="button button-overlay"
          @click="${this.__handlers.showOverlay}"
        >Show Overlay</button>

        <zen-popup-stack
          class="overlay-stack"
          key="overlay"
          .renderers="${RENDERER_POPUPS}"
        ></zen-popup-stack>

        <p>${this.__result}</p>

        <zen-popup-stack .renderers="${RENDERER_POPUPS}"></zen-popup-stack>
      </div>
    `
  }
}

window.customElements.define('x-app', App)
