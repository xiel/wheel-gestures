import { rubberband } from './rubberband'

describe('rubberband', () => {

  test('values in range',() => {
    expect(rubberband(0, 100, 0)).toBe(0)
  })

  test('values in range',() => {
    expect(rubberband(0, 100, 50)).toBe(50)
  })

  test('values in range',() => {
    expect(rubberband(0, 100, 100)).toBe(100)
  })

  test('values in range',() => {
    expect(rubberband(-1000, 1000, 0)).toBe(0)
  })

  test('below min value',() => {
    expect(rubberband(0, 100, -100)).toBe(-50)
  })

  test('above max value',() => {
    expect(rubberband(0, 100, 200)).toBe(150)
  })

  test('negative values',() => {
    expect(rubberband(-2000, -1000, 0)).toBe(-500)
  })

  test('all negative values',() => {
    expect(rubberband(-2000, -1000, -500)).toBe(-750)
  })

})
