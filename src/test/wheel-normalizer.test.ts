import { VectorXYZ } from '..'
import { reverseSign } from '../wheel-normalizer/wheel-normalizer'

const wheelEvent = { axisDelta: [5, 2, 1] as VectorXYZ }

describe('reverseSign', () => {
  test('all: true', () => {
    expect(reverseSign(wheelEvent, true)).toEqual({ axisDelta: [-5, -2, -1] })
  })

  test('none: false', () => {
    expect(reverseSign(wheelEvent, false)).toEqual({ axisDelta: [5, 2, 1] })
  })

  test('custom: array', () => {
    expect(reverseSign(wheelEvent, [false, false, false])).toEqual({ axisDelta: [5, 2, 1] })
    expect(reverseSign(wheelEvent, [true, true, true])).toEqual({ axisDelta: [-5, -2, -1] })
    expect(reverseSign(wheelEvent, [true, true, false])).toEqual({ axisDelta: [-5, -2, 1] })
  })
})

test.todo('normalizeWheel')
