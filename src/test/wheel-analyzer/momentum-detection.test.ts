import { PhaseData, WheelAnalyzer, WheelTypes } from '../../wheel-analyzer'
import swipeRight from '../fixtures/swipe-right.json'

jest.useFakeTimers()

type Range = [number, number]

interface PhaseRange {
  wheelType: WheelTypes
  range: Range
  data?: PhaseData
  canceled?: boolean
}

describe('momentum detection', () => {
  it('recognized swipe right', () => {
    const wA = new WheelAnalyzer({ isDebug: true })
    const phases: PhaseRange[] = []
    const phaseRange: Record<WheelTypes, Range> = {
      WHEEL: [-1, -1],
      MOMENTUM_WHEEL: [-1, -1],
      ANY_WHEEL: [-1, -1],
    }
    let eventIndex = -1

    // record phases with counts
    wA.subscribe((type, data) => {
      const isStart = type.endsWith('_START')
      const isEnd = type.endsWith('_END')
      const isCancel = type.endsWith('_CANCEL')
      const wheelType = type.replace('_START', '').replace('_END', '') as WheelTypes

      if (isStart) {
        phaseRange[wheelType][0] = eventIndex
      } else if (isEnd || isCancel) {
        phaseRange[wheelType][1] = eventIndex

        if (phaseRange[wheelType][0] >= 0) {
          phases.push({
            wheelType,
            range: phaseRange[wheelType],
            data,
            ...(isCancel ? { canceled: isCancel } : null),
          })
        }

        phaseRange[wheelType] = [-1, -1]
      }
    })

    // feed test wheel events and update index which is used to keep track of the ranges
    swipeRight.wheelEvents.forEach((e, i) => {
      eventIndex = i
      wA.feedWheel(e)
    })

    // fast forward and exhaust currently pending timers, this will trigger the *_END events
    jest.runOnlyPendingTimers()

    expect(eventIndex).toMatchInlineSnapshot(`63`)
    expect(phases).toMatchSnapshot()
  })
})
