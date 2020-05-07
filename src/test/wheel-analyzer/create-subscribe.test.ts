import { WheelAnalyzer } from '../../wheel-analyzer'

describe('creation', () => {
  it('can be created without options', () => {
    expect(new WheelAnalyzer())
  })
})

describe('subscription', () => {
  it('can subscribe', () => {
    const wA = new WheelAnalyzer()
    const callback = jest.fn()
    expect(wA.subscribe(callback))
  })
})
