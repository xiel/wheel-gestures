import { VectorXYZ } from '..'
import { reverseAxisDeltaSign } from '../wheel-normalizer/wheel-normalizer'

const wheelEvent = { axisDelta: [5, 2, 1] as VectorXYZ }

describe('reverseSign', () => {
  test('all: true', () => {
    expect(reverseAxisDeltaSign(wheelEvent, true)).toEqual({ axisDelta: [-5, -2, -1] })
  })

  test('none: false', () => {
    expect(reverseAxisDeltaSign(wheelEvent, false)).toEqual({ axisDelta: [5, 2, 1] })
  })

  test('custom: array', () => {
    expect(reverseAxisDeltaSign(wheelEvent, [false, false, false])).toEqual({ axisDelta: [5, 2, 1] })
    expect(reverseAxisDeltaSign(wheelEvent, [true, true, true])).toEqual({ axisDelta: [-5, -2, -1] })
    expect(reverseAxisDeltaSign(wheelEvent, [true, true, false])).toEqual({ axisDelta: [-5, -2, 1] })
  })
})

test.todo('normalizeWheel')
