import { subscribeAndFeedWheelEvents } from '../helper/recordPhases'
import { createWheelEvent } from '../helper/generateEvents'
import { WheelPhase } from '../..'

describe('axisDelta', () => {
  it('only wheel events should have delta', () => {
    const wheelEvent = createWheelEvent({ deltaX: 5, deltaY: 2, deltaZ: 1 })
    const { allPhaseData } = subscribeAndFeedWheelEvents({ wheelEvents: [wheelEvent, wheelEvent, wheelEvent] })
    const moveEventTypes = [WheelPhase.ANY_WHEEL, WheelPhase.WHEEL, WheelPhase.MOMENTUM_WHEEL]

    // check move types
    allPhaseData
      .filter((data) => moveEventTypes.includes(data.type))
      .every((data) => expect(data.axisDelta).toEqual([5, 2, 1]))

    // check non-move types (start & end events)
    allPhaseData
      .filter((data) => !moveEventTypes.includes(data.type))
      .every((data) => expect(data.axisDelta).toEqual([0, 0, 0]))
  })
})
