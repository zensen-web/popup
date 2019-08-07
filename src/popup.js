import { LitElement, css } from 'lit-element'

export class Popup extends LitElement {
  static get properties () {
    return {
      model: Object,
      layout: {
        reflect: true,
        type: String,
      },
    }
  }

  static get styles () {
    return [
      css`
        :host {
          display: inline-block;
          outline: none;
        }
      `,
    ]
  }

  constructor () {
    super()

    this.layout = ''
    this.model = {}

    this.onClose = () => {}
  }

  freeze () { /* return state to free */ }
  restore (_state) {}

  firstUpdated () {
    this.setAttribute('tabindex', '-1')
    this.focus()
  }
}
