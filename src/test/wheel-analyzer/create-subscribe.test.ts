import { WheelAnalyzer } from '../../wheel-analyzer/wheel-analyzer'
import { createWheelEvent } from '../helper/generateEvents'

describe('creation', () => {
  it('can be created without options', () => {
    expect(WheelAnalyzer())
  })
})

describe('subscription', () => {
  it('can subscribe', () => {
    const wA = WheelAnalyzer()
    const callback = jest.fn()
    expect(wA.on('wheel', callback)).toBeTruthy()
  })

  it('can unsubscribe', () => {
    const wA = WheelAnalyzer()
    const callback = jest.fn()
    const callback2 = jest.fn()

    wA.on('wheel', callback)
    wA.off('wheel', callback)

    const unsubscribeCallback2 = wA.on('wheel', callback2)
    unsubscribeCallback2()

    wA.feedWheel(createWheelEvent())

    expect(callback).toHaveBeenCalledTimes(0)
    expect(callback2).toHaveBeenCalledTimes(0)
  })

  it('should work with new', function() {
    // @ts-ignore
    const wA = new WheelAnalyzer()
    const callback = jest.fn()
    expect(wA.on(callback))
  })
})

describe('bind events', () => {
  it.todo('observe, unobserve, disconnect')
})
