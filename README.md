# zensen-popup

A declarative popup stack manager in `LitElement`.

## Features

- Provides a single manager element to handle all of your popups
- Push multiple popups onto the stack at will
- Provides multiple stacks for different classes of popups
- Has an intuitive interface for pushing data to popups, and retrieving

## Install

Using `npm`:

```
$ npm install @zensen/popup
```

Using `yarn`:

```
$ yarn add @zensen/popup
```

## Configuring, Creating, and Registering Popup Components

Configuring the popup stack component by providing a `redux` store object

```js
import { configure } from '@zensen/popup'

configure(store)
```

Create your own popup components by extending this package's `Popup` base class

```js
import { Popup } from '@zensen/popup'
import { css, html } from 'lit-element'

class ConfirmPopup extends Popup {
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

    this.__handlers = {
      confirm: () => this.onClose(true),
      cancel: () => this.onClose(false),
    }
  }

  render () {
    return html`
      <p class="text text-title">${this.model.title}</p>
      <p class="text text-message">${this.model.message}</p>

      <button @click="${this.__handlers.confirm}">Confirm</button>
      <button @click="${this.__handlers.cancel}">Cancel</button>
    `
  }
}

window.customElements.define('x-popup-confirm', ConfirmPopup)
```

The next step is to create a map of popup renderer functions that will be used to register each type of popup component with the popup stack:

```js
export const POPUP_CONFIRM = 'confirm'

export const RENDERER_POPUPS = {
  [POPUP_CONFIRM]: (hide, index, layout, model, closeHandler) => html`
    <x-popup-confirm
      .index="${index}"
      .layout="${layout}"
      .model="${model}"
      .onClose="${closeHandler}"
      ?hidden="${hide}"
    ></x-popup-confirm>
  `,
}
```

Then, we instantiate the popup stack component in our app, assigning our renderers to it.

NOTE: _It's usually a good idea to put this towards the top of your app's DOM towards as the last child of its containing element._

```js
import './popup-confirm'

import { LitElement, html, css } from 'lit-element'

export const POPUP_CONFIRM = 'confirm'

export const RENDERER_POPUPS = {
  [POPUP_CONFIRM]: (layout, model, closeHandler) => html`
    <x-popup-confirm
      .layout="${layout}"
      .model="${model}"
      .onClose="${closeHandler}"
    ></x-popup-confirm>
  `,
}

class App extends LitElement {
  static get styles () {
    return css`
      :host {
        display: block;
      }

      .container {
        display: flex;
        width: 100%;
        height: 100%;
      }
    `
  }

  render () {
    return html`
      <div class="container">
        <!-- PUT APP CONTENT HERE -->
      </div>

      <zen-popup-stack .renderers="${RENDERER_POPUPS}"></zen-popup-stack>
    `
  }
}

window.customElements.define('x-app', App)
```

## API

We can open popups like so:

```js
import { openPopup } from '@zensen/popup'

const result = await openPopup(POPUP_CONFIRM, {
  title: 'Welcome',
  message: 'Would you like some annoying emails?',
})
```

`openPopup()` returns a promise, so it can be `await`ed. It will resolve once the popup calls its `this.onClose()` callback. `openPopup()` will return whatever is passed into `this.onClose()`. In the case of our _Confirm Popup_, it will return `true` when the `Confirm` button is clicked, or `false` when the `Cancel` button is clicked.

We can also manually remove the last popup from the stack like so:

```js
import { popPopup } from '@zensen/popup'

popPopup()
```

The entire popup stack can be cleared with a single command:

```js
import { clearPopup } from '@zensen/popup'

clearPopups()
```

## Advanced Usage

Each popup stack is associated with a stack array in the popup reducer for `redux`. Each popup stack **must** be associated with a array. This can be done by providing each instance of `zen-popup-stack` their own `key` property:

```js
import '@zensen/popup'

<zen-popup-stack key="popups"></zen-popup-stack>
<zen-popup-stack key="overlays"></zen-popup-stack>
<zen-popup-stack key="banners"></zen-popup-stack>
```

By checking your `redux` state, you'll notice an array key under the popup reducer for each instance: `popups`, `overlays`, and `banners`. If a key isn't provided, then that instance's key defaults to `main`, so this works as well:

```js

import '@zensen/popup'

<zen-popup-stack></zen-popup-stack>                <!-- 'main'     -->
<zen-popup-stack key="popups"></zen-popup-stack>   <!-- 'popups'   -->
<zen-popup-stack key="overlays"></zen-popup-stack> <!-- 'overlays' -->
<zen-popup-stack key="banners"></zen-popup-stack>  <!-- 'banners'  -->
```

This can be useful for apps that need multiple stacks for diverse roles.

If you want to render popups without the blocker, you can add the attribute `hideBlocker`:

```js
import '@zensen/popup'

<zen-popup-stack hideBlocker></zen-popup-stack>
```

If you want to change the color of the blocker itself, you can attach a class to the popup stack and manipulate the `--backdrop-color` variable as needed:

```js
import '@zensen/popup'

static get styles() {
  return css`
    .popup-stack {
      --backdrop-color: blue;
    }
  `
}

<zen-popup-stack class="popup-stack"></zen-popup-stack>
```
