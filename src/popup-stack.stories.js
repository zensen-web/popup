import './popup-stack'
import { store } from '../test-helpers'

import { spyOn, expect, waitFor } from 'storybook/test'

import { openPopup, popPopup } from '.'
import { register, unregister } from './redux'
import { POPUP_MESSAGE, RENDERER_POPUPS } from '../test-helpers'

import { html } from 'lit'

const KEY_MAIN = 'main'
const KEY_NOTIFICATIONS = 'notifications'

let dispatchSpy = null

export default {
  title: 'Popup Stack',
  render: (args) => renderComponent('zen-popup-stack', args),
  beforeEach: () => {
    dispatchSpy = spyOn(store, 'dispatch')
  },
}

export const Mounted = {
  description: 'when mounted to the DOM',
  play: async ({ canvasElement }) => {
    const component = await getComponent(canvasElement)
    const { shadowRoot } = component

    const blockers = shadowRoot.querySelectorAll('.blocker')

    expect(component).toBeInTheDocument()
    expect(blockers).toHaveLength(0)
    expect(dispatchSpy).toHaveBeenCalledOnce()
    expect(dispatchSpy).toHaveBeenCalledWith(register(KEY_MAIN))
  },
}

export const Unmounted = {
  description: 'when mounted to the DOM',
  play: async ({ canvasElement }) => {
    const component = await getComponent(canvasElement)

    component.remove()

    expect(component).not.toBeInTheDocument()
    expect(dispatchSpy).toHaveBeenCalledTimes(2)
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, register(KEY_MAIN))
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, unregister(KEY_MAIN))
  },
}

export const KeyChange = {
  description: 'when the key is changed',
  play: async ({ canvasElement }) => {
    const component = await getComponent(canvasElement)
    const { shadowRoot } = component

    component.key = KEY_NOTIFICATIONS
    await component.updateComplete

    await expect(dispatchSpy).toHaveBeenCalledTimes(3)

    await expect(dispatchSpy).toHaveBeenNthCalledWith(
      1,
      register(KEY_MAIN),
    )

    await expect(dispatchSpy).toHaveBeenNthCalledWith(
      2,
      unregister(KEY_MAIN),
    )

    await expect(dispatchSpy).toHaveBeenNthCalledWith(
      3,
      register(KEY_NOTIFICATIONS),
    )
  },
}

export const InvalidPopupOpened = {
  description: 'when openPopup() is called with an invalid key',
  args: {
    renderers: RENDERER_POPUPS,
  },
  play: async ({ canvasElement }) => {
    const ERROR = new Error('Invalid popup key: asdf')

    const component = await getComponent(canvasElement)
    const { shadowRoot } = component

    // const fn = () => openPopup('asdf')

    // await expect(fn).rejects.toThrowError(ERROR)
  },
}

// export const PopupOpened = {
//   description: 'when a popup is opened',
//   play: async ({ canvasElement }) => {
//     const component = await getComponent(canvasElement)
//     const { shadowRoot } = component

//     const blockers = shadowRoot.querySelectorAll('.blocker')

//     expect(component).to.exist
//   },
// }

// export const PopupDismissed = {
//   description: 'when a popoup is dismissed',
//   play: async ({ canvasElement }) => {
//     const component = await getComponent(canvasElement)
//     const { shadowRoot } = component

//     const blockers = shadowRoot.querySelectorAll('.blocker')

//     expect(component).to.exist
//   },
// }

// export const MultiplePopups = {
//   description: 'when multiple popups are open at once',
//   play: async ({ canvasElement }) => {
//     const component = await getComponent(canvasElement)
//     const { shadowRoot } = component

//     const blockers = shadowRoot.querySelectorAll('.blocker')

//     expect(component).to.exist
//   },
// }







// describe('popup-stack', () => {
//   context('when opening a popup', () => {
//     let popupElem

//     const MODEL = { message: 'state pushed' }

//     beforeEach(async () => {
//       instance.renderers = RENDERER_POPUPS
//       await instance.updateComplete

//       openPopup(POPUP_MESSAGE, MODEL)
//       await instance.updateComplete

//       blockers = getBlockerElements()
//       popupElem = blockers[0].firstElementChild
//     })

//     it('passes model data to the popup', () =>
//       expect(popupElem.model).to.eql(MODEL))

//     it('has open attribute', () =>
//       expect(instance.hasAttribute('open')).to.be.true
//     )

//     context('when dismissing the popup', () => {
//       let dismissStub

//       beforeEach(async () => {
//         dismissStub = sandbox.stub(instance.__stack[0], 'dismiss')
//         popupElem.__handlers.close()
//         await instance.updateComplete
//         blockers = getBlockerElements()
//       })

//       it('does not render any blockers', () =>
//         expect(blockers).to.be.empty)

//       it('dismisses the popup', () =>
//         expect(dismissStub.calledOnce).to.be.true)

//       it('removes open attribute', () =>
//         expect(instance.hasAttribute('open')).to.be.false
//       )
//     })

//     context('when another popup is pushed onto the stack', () => {
//       beforeEach(async () => {
//         openPopup(POPUP_MESSAGE)
//         await instance.updateComplete
//         blockers = getBlockerElements()
//       })

//       it('has two popups', () =>
//         expect(blockers.length).to.be.eq(2))

//       it('hides the first blocker', () =>
//         expect(blockers[0].hasAttribute('hide')).to.be.true
//       )

//       it('shows the second blocker', () =>
//         expect(blockers[1].hasAttribute('hide')).to.be.false
//       )

//       context('when popup is popped from the stack', () => {
//         beforeEach(async () => {
//           popPopup()
//           await instance.updateComplete
//           blockers = getBlockerElements()
//         })

//         it('has one popup', () =>
//           expect(blockers.length).to.be.eq(1))
//       })
//     })
//   })
// })
