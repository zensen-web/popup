import { test, expect } from 'vitest'

import {
  register,
  unregister,
  push,
  pop,
  clear,
  reducer,
} from './redux'

const DISMISS_FN = () => {}

test('initialize', () => {
  expect(reducer(undefined, {})).toEqual({})
})

test('registers a stack', () => {
  const result = reducer({}, register('main'))

  expect(result).toEqual({
    main: [],
  })
})

test('fails to register a stack using a key that is already taken', () => {
  const fn = () => reducer(
    { main: [] },
    register('main'),
  )

  expect(fn).toThrow(new Error('Key already in use: main'))
})

test('unregisters a stack', () => {
  const result = reducer(
    {
      main: [],
      overlay: [],
    },
    unregister('overlay'),
  )

  expect(result).toEqual({ main: [] })
})

test('pushes a popup onto the stack', () => {
  const result = reducer(
    {
      main: [
        {
          model: { a: 10 },
        },
      ],
    },
    push('main', { model: { b: 12 } }),
  )

  expect(result).toEqual({
    main: [
      {
        model: { a: 10 },
      },
      {
        model: { b: 12 },
      },
    ],
  })
})

test('pops a popup from the stack', () => {
  const result = reducer(
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
  )

  expect(result).toEqual({
    main: [
      {
        model: { a: 10 },
        dismiss: DISMISS_FN,
      },
    ],
  })
})

test('clears all popups from the target stack', () => {
  const result = reducer(
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
  )

  expect(result).toEqual({ main: [] })
})
