import { WheelEventData } from '../../types'
import swipeRight from '../fixtures/swipe-right.json'
import { subscribeAndFeedWheelEvents } from '../helper/recordPhases'

const event = (timeStamp: number, deltaX: number, momentum?: boolean): WheelEventData => ({
  deltaMode: 0,
  deltaX,
  deltaY: 0,
  timeStamp,
  ...(momentum === undefined ? {} : { momentum }),
})

afterEach(() => jest.useRealTimers())

test('native false overrides a deceleration pattern that normally detects momentum', () => {
  const events = swipeRight.wheelEvents
  const fallback = subscribeAndFeedWheelEvents({ wheelEvents: events }).allPhaseData
  expect(fallback.some((state) => state.isMomentum)).toBe(true)

  const native = subscribeAndFeedWheelEvents({
    wheelEvents: events.map((wheelEvent) => ({ ...wheelEvent, momentum: false })),
  }).allPhaseData
  expect(native.every((state) => !state.isMomentum)).toBe(true)
})

test('native momentum starts immediately, including a zero-delta transition', () => {
  const { allPhaseData } = subscribeAndFeedWheelEvents({
    wheelEvents: [event(10, 5, false), event(20, -0, true), event(30, 3, true)],
  })
  expect(allPhaseData.map(({ isStart, isMomentum, isEnding }) => [isStart, isMomentum, isEnding])).toEqual([
    [true, false, false],
    [false, true, false],
    [false, true, false],
    [false, true, true],
  ])
})

test('a native momentum spike does not cancel the gesture', () => {
  const { allPhaseData } = subscribeAndFeedWheelEvents({
    wheelEvents: [event(10, 1, true), event(20, 30, true)],
  })
  expect(allPhaseData.filter((state) => state.isStart)).toHaveLength(1)
  expect(allPhaseData.every((state) => state.isMomentum && !state.isMomentumCancel)).toBe(true)
})

test('native false cancels momentum even when the next user delta is small', () => {
  const { allPhaseData } = subscribeAndFeedWheelEvents({
    wheelEvents: [event(10, 5, false), event(20, 4, true), event(30, 1, false)],
  })
  expect(allPhaseData[2]).toMatchObject({ isMomentum: true, isEnding: true, isMomentumCancel: true })
  expect(allPhaseData[2].event).toMatchObject({ timeStamp: 20 })
  expect(allPhaseData[3]).toMatchObject({ isStart: true, isMomentum: false, axisMovement: [1, 0, 0] })
  expect(allPhaseData[3].previous).toBeUndefined()
})

test('missing and non-boolean values keep the existing heuristic behavior', () => {
  const baseline = subscribeAndFeedWheelEvents({ wheelEvents: swipeRight.wheelEvents }).allPhaseData
  for (const momentum of [undefined, null, 0, 'false']) {
    const { allPhaseData } = subscribeAndFeedWheelEvents({
      wheelEvents: swipeRight.wheelEvents.map((wheelEvent) => ({ ...wheelEvent, momentum } as WheelEventData)),
    })
    expect(allPhaseData.map(({ isStart, isMomentum, isEnding }) => [isStart, isMomentum, isEnding])).toEqual(
      baseline.map(({ isStart, isMomentum, isEnding }) => [isStart, isMomentum, isEnding])
    )
  }
})

test('reads a browser-style inherited momentum getter', () => {
  const wheelEvent = Object.assign(Object.create({ get momentum() { return true } }), event(10, 5))
  const { allPhaseData } = subscribeAndFeedWheelEvents({ wheelEvents: [wheelEvent] })
  expect(allPhaseData[0]).toMatchObject({ isStart: true, isMomentum: true })
})
