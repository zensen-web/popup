import { expect } from '@open-wc/testing'

import {
  register,
  unregister,
  freeze,
  push,
  pop,
  clear,
  reducer,
} from '../src/redux'

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

  it('freezes the popup', () =>
    expect(
      reducer(
        {
          main: [
            {
              model: { a: 10 },
            },
            {
              model: { b: 12 },
            },
          ],
        },
        freeze({ name: 'Beethoven' }, 'main'),
      ),
    ).to.eql({
      main: [
        {
          model: { a: 10 },
          state: { name: 'Beethoven' },
        },
        {
          model: { b: 12 },
        },
      ],
    })
  )

  it('does not freeze anything when there is only a single popup', () =>
    expect(
      reducer(
        {
          main: [
            {
              model: { a: 10 },
            },
          ],
        },
        freeze({ name: 'Beethoven' }, 'main'),
      ),
    ).to.eql({
      main: [
        {
          model: { a: 10 },
        },
      ],
    })
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
        push({ model: { b: 12 } }, 'main'),
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
            },
            {
              model: { b: 12 },
            },
          ],
        },
        pop('main'),
      ),
    ).to.eql({
      main: [
        {
          model: { a: 10 },
        },
      ],
    })
  )

  it('clears all popups from the target stack', () =>
    expect(
      reducer(
        {
          main: [
            { model: {} },
            { model: {} },
            { model: {} },
            { model: {} },
            { model: {} },
          ],
        },
        clear('main'),
      ),
    ).to.eql({ main: [] })
  )
})
