import { reverseSign } from '../wheel-normalizer/wheel-normalizer'

describe('wheel-normalizer', () => {
  it('reverseSign - all: true', () => {
    expect(reverseSign({ deltaX: 5, deltaY: 2, deltaZ: 1 }, true)).toEqual({
      deltaX: -5,
      deltaY: -2,
      deltaZ: -1,
    })
  })

  it('reverseSign - none: false', () => {
    expect(reverseSign({ deltaX: 5, deltaY: 2, deltaZ: 1 }, false)).toEqual({
      deltaX: 5,
      deltaY: 2,
      deltaZ: 1,
    })
  })

  it('reverseSign - custom: array', () => {
    const wheelEvent = { deltaX: 5, deltaY: 2, deltaZ: 1 }

    expect(reverseSign(wheelEvent, [false, false, false])).toEqual({
      deltaX: 5,
      deltaY: 2,
      deltaZ: 1,
    })

    expect(reverseSign(wheelEvent, [true, true, true])).toEqual({
      deltaX: -5,
      deltaY: -2,
      deltaZ: -1,
    })

    expect(reverseSign(wheelEvent, [true, true, false])).toEqual({
      deltaX: -5,
      deltaY: -2,
      deltaZ: 1,
    })
  })
})
