import { WheelAnalyzer } from '../../wheel-analyzer/wheel-analyzer'

describe('creation', () => {
  it('can be created without options', () => {
    expect(WheelAnalyzer())
  })
})

describe('subscription', () => {
  it('can subscribe', () => {
    const wA = WheelAnalyzer()
    const callback = jest.fn()
    expect(wA.subscribe(callback))
  })

  it('should work with new', function() {
    // @ts-ignore
    const wA = new WheelAnalyzer()
    const callback = jest.fn()
    expect(wA.subscribe(callback))
  })
})
