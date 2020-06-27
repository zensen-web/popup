import { LitElement, css } from 'lit-element'

export class Popup extends LitElement {
  static get properties () {
    return {
      __activated: {
        reflect: true,
        type: Boolean,
        attribute: 'active',
      },

      model: Object,
      hidden: {
        reflect: true,
        type: Boolean,
      },
      index: {
        reflect: true,
        type: Number,
      },
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

        :host([hidden]) {
          display: none;
        }
      `,
    ]
  }

  reactivated () {}
  deactivated () {}

  constructor () {
    super()

    this.hidden = false
    this.index = -1
    this.layout = ''
    this.model = {}

    this.onClose = () => {}
  }

  firstUpdated () {
    this.setAttribute('tabindex', '-1')
    this.focus()
  }

  update (changedProps) {
    if (changedProps.has('hidden')) {
      this.__activated = !this.hidden

      if (this.__activated) {
        this.reactivated()
      } else {
        this.deactivated()
      }
    }

    super.update(changedProps)
  }
}
