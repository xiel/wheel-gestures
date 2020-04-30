import { reverseSign } from '../wheel-normalizer/wheel-normalizer'

describe('wheel-normalizer', () => {
  it('reverseSign - all: true', () => {
    const wheelEvent = { deltaX: 5, deltaY: 2, deltaZ: 1 }

    expect(reverseSign(wheelEvent, true)).toEqual({
      deltaX: -5,
      deltaY: -2,
      deltaZ: -1,
    })
  })

  it.todo('reverseSign - none: false')
  it.todo('reverseSign - custom: array')
})
