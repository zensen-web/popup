import sinon from 'sinon'
import store from './utils/store'

import { fixture, html, expect } from '@open-wc/testing'

import { openPopup, popPopup } from '../src'
import { register, unregister } from '../src/redux'
import { POPUP_MESSAGE, RENDERER_POPUPS } from './utils/popup'

const KEY_MAIN = 'main'
const KEY_NOTIFICATIONS = 'notifications'

describe('popup-stack', () => {
  let sandbox
  let instance
  let dispatchSpy
  let blockers

  const getBlockerElements = () => instance.shadowRoot.querySelectorAll('.blocker')

  beforeEach(async () => {
    sandbox = sinon.createSandbox()
    dispatchSpy = sandbox.spy(store, 'dispatch')

    instance = await fixture(html`<zen-popup-stack></zen-popup-stack>`)

    return instance.updateComplete
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('renders', () => expect(instance).to.exist)

  it('does not have popups',
    () => expect(instance.getAttribute('haspopup')).to.not.exist)

  it('registers a reducer', () =>
    expect(dispatchSpy.calledWith(register(KEY_MAIN))).to.be.true)

  it('unregisters the reducer', () =>
    expect(dispatchSpy.calledWith(unregister(KEY_MAIN))).to.be.false)

  it('is unable to open a popup', () =>
    expect(openPopup('asdf')).to.be.rejected)

  context('when the key is changed', () => {
    beforeEach(async () => {
      instance.key = KEY_NOTIFICATIONS
      await instance.updateComplete
    })

    it('unregisters', () =>
      expect(dispatchSpy.calledWith(unregister(KEY_NOTIFICATIONS))))
  })

  context('when opening a popup', () => {
    let popupElem

    const MODEL = { message: 'state pushed' }

    beforeEach(async () => {
      instance.renderers = RENDERER_POPUPS
      await instance.updateComplete

      openPopup(POPUP_MESSAGE, MODEL)
      await instance.updateComplete

      blockers = getBlockerElements()
      popupElem = blockers[0].firstElementChild
    })

    it('passes model data to the popup', () =>
      expect(popupElem.model).to.eql(MODEL))

    context('when dismissing the popup', () => {
      let dismissStub

      beforeEach(async () => {
        dismissStub = sandbox.stub(instance.__stack[0], 'dismiss')
        popupElem.__handlers.close()
        await instance.updateComplete
        blockers = getBlockerElements()
      })

      it('does not render any blockers', () =>
        expect(blockers).to.be.empty)

      it('dismisses the popup', () =>
        expect(dismissStub.calledOnce).to.be.true)
    })

    context('when another popup is pushed onto the stack', () => {
      beforeEach(async () => {
        openPopup(POPUP_MESSAGE)
        await instance.updateComplete
        blockers = getBlockerElements()
      })

      it('has two popups', () =>
        expect(blockers.length).to.be.eq(2))

      it('hides the first blocker', () =>
        expect(blockers[0].hasAttribute('hide')).to.be.true
      )

      it('shows the second blocker', () =>
        expect(blockers[1].hasAttribute('hide')).to.be.false
      )

      context('when popup is popped from the stack', () => {
        beforeEach(async () => {
          popPopup()
          await instance.updateComplete
          blockers = getBlockerElements()
        })

        it('has one popup', () =>
          expect(blockers.length).to.be.eq(1))
      })
    })
  })
})
