import { expect } from '@open-wc/testing'

import {
  register,
  unregister,
  push,
  pop,
  clear,
  reducer,
} from '../src/redux'

const DISMISS_FN = () => {}

describe('reducer', () => {
  it('initialize', () => expect(reducer(undefined, {})).to.eql({}))

  it('registers a stack', () =>
    expect(reducer({}, register('main'))).to.eql({
      main: [],
    })
  )

  it('fails to register a stack using a key that is already taken', () =>
    expect(() =>
      reducer(
        { main: [] },
        register('main'),
      ),
    ).to.throw(/Key already in use: main/)
  )

  it('unregisters a stack', () =>
    expect(
      reducer(
        {
          main: [],
          overlay: [],
        },
        unregister('overlay'),
      ),
    ).to.eql({ main: [] })
  )

  it('pushes a popup onto the stack', () =>
    expect(
      reducer(
        {
          main: [
            {
              model: { a: 10 },
            },
          ],
        },
        push('main', { model: { b: 12 } }),
      ),
    ).to.eql({
      main: [
        {
          model: { a: 10 },
        },
        {
          model: { b: 12 },
        },
      ],
    })
  )

  it('pops a popup from the stack', () =>
    expect(
      reducer(
        {
          main: [
            {
              model: { a: 10 },
              dismiss: DISMISS_FN,
            },
            {
              model: { b: 12 },
              dismiss: DISMISS_FN,
            },
          ],
        },
        pop('main'),
      ),
    ).to.eql({
      main: [
        {
          model: { a: 10 },
          dismiss: DISMISS_FN,
        },
      ],
    })
  )

  it('clears all popups from the target stack', () =>
    expect(
      reducer(
        {
          main: [
            {
              model: {},
              dismiss: DISMISS_FN,
            },
            {
              model: {},
              dismiss: DISMISS_FN,
            },
          ],
        },
        clear('main'),
      ),
    ).to.eql({ main: [] })
  )
})
