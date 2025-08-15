import { store } from '../test-helpers'

import { expect } from 'vitest'

import { configure, popPopup, clearPopups, openPopup } from '.'
import { pop, clear } from './redux'

const KEY_MAIN = 'main'

describe('index', () => {
  let sandbox
  let dispatchStub
  let customElementStub

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    dispatchStub = sandbox.stub(store, 'dispatch')
    customElementStub = sandbox.stub(window.customElements, 'define')

    configure(store)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('generates the custom component', () =>
    expect(customElementStub.calledOnce).to.be.true)

  context('openPopup()', () => {
    beforeEach(() => {
      openPopup('message', { a: 10 })
    })

    it('dispatches action', () => expect(dispatchStub.calledOnce).to.be.true)
  })

  context('popPopup()', () => {
    beforeEach(() => {
      popPopup()
    })

    it('dispatches action',
      () => expect(dispatchStub.calledWith(pop(KEY_MAIN))).to.be.true)
  })

  context('clearPopups()', () => {
    beforeEach(() => {
      clearPopups()
    })

    it('dispatches action',
      () => expect(dispatchStub.calledWith(clear(KEY_MAIN))).to.be.true)
  })
})
