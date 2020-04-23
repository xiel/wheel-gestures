import { createWheelEvent } from '../helper/generateEvents'
import { subscribeAndFeedWheelEvents } from '../helper/recordPhases'

describe('updateOptions', () => {
  it('should be able to switch option (preventWheelAction)', function() {
    const { feedEvents, wheelAnalyzer } = subscribeAndFeedWheelEvents()
    const preventDefault = jest.fn()

    function feedDeltaYEvent() {
      feedEvents([
        createWheelEvent({
          deltaY: 5,
          timeStamp: Date.now(),
          preventDefault,
        }),
      ])
    }

    wheelAnalyzer.updateOptions({ preventWheelAction: 'x' })
    feedDeltaYEvent()
    expect(preventDefault).toHaveBeenCalledTimes(0)

    wheelAnalyzer.updateOptions({ preventWheelAction: 'y' })
    feedDeltaYEvent()
    expect(preventDefault).toHaveBeenCalledTimes(1)

    wheelAnalyzer.updateOptions({})
    feedDeltaYEvent()
    expect(preventDefault).toHaveBeenCalledTimes(2)

    wheelAnalyzer.updateOptions({ preventWheelAction: 'x' })
    feedDeltaYEvent()
    expect(preventDefault).toHaveBeenCalledTimes(2)
  })
})
