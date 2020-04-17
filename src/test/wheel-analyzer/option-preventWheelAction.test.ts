import slowDragRight from '../fixtures/slow-drag-right.json'
import squareMoveTrackpad from '../fixtures/square-move-trackpad.json'
import swipeUpTrackpad from '../fixtures/swipe-up-trackpad.json'
import { Options, WheelAnalyzer } from '../../wheel-analyzer'
import { SubscribeFn, WheelEventData } from '../../wheel-analyzer.types'

interface Opts {
  callback?: SubscribeFn
  options?: Partial<Options>
}

function feedWheelEvents(wheelEvents: WheelEventData[], { callback = () => undefined, options }: Opts = {}) {
  // need to use fake timers, so we can run the debounced end function after feeding all events
  jest.useFakeTimers()
  const wA = new WheelAnalyzer(options)
  const unsubscribe = wA.subscribe(callback)
  wA.feedWheel(wheelEvents)
  // fast forward and exhaust currently pending timers
  jest.runOnlyPendingTimers()
  unsubscribe()
}

function testPreventWheelActionWithOptions(wheelEvents: WheelEventData[], opts: Opts = {}) {
  const preventDefault = jest.fn()
  const wheelEventsWithPreventDefault = wheelEvents.map((e) => ({ ...e, preventDefault }))
  feedWheelEvents(wheelEventsWithPreventDefault, opts)
  return {
    wheelEventsWithPreventDefault,
    preventDefault,
  }
}

describe('preventDefault should be called when drag is on defined axis', () => {
  it('default (all) - slowDragRight', () => {
    const { wheelEventsWithPreventDefault, preventDefault } = testPreventWheelActionWithOptions(
      slowDragRight.wheelEvents
    )

    expect(wheelEventsWithPreventDefault.length).toBe(194)
    expect(preventDefault).toBeCalledTimes(194)
  })

  it('default (all) - squareMoveTrackpad', () => {
    const { wheelEventsWithPreventDefault, preventDefault } = testPreventWheelActionWithOptions(
      squareMoveTrackpad.wheelEvents
    )

    expect(wheelEventsWithPreventDefault.length).toBe(207)
    expect(preventDefault).toBeCalledTimes(207)
  })

  it('x - slowDragRight', () => {
    const {
      wheelEventsWithPreventDefault,
      preventDefault,
    } = testPreventWheelActionWithOptions(slowDragRight.wheelEvents, { options: { preventWheelAction: 'x' } })

    expect(wheelEventsWithPreventDefault.length).toBe(194)
    // gets called a few times when deltas are equal
    expect(preventDefault).toBeCalledTimes(194)
  })

  it('y - slowDragRight', () => {
    const {
      wheelEventsWithPreventDefault,
      preventDefault,
    } = testPreventWheelActionWithOptions(slowDragRight.wheelEvents, { options: { preventWheelAction: 'y' } })

    expect(wheelEventsWithPreventDefault.length).toBe(194)
    // gets called a few times when deltas are equal
    expect(preventDefault).toBeCalledTimes(3)
  })

  it('x - swipeUpTrackpad', () => {
    const {
      wheelEventsWithPreventDefault,
      preventDefault,
    } = testPreventWheelActionWithOptions(swipeUpTrackpad.wheelEvents, { options: { preventWheelAction: 'x' } })

    expect(wheelEventsWithPreventDefault.length).toBe(85)
    // gets called a few times when deltas are equal
    expect(preventDefault).toBeCalledTimes(0)
  })

  it('y - swipeUpTrackpad', () => {
    const {
      wheelEventsWithPreventDefault,
      preventDefault,
    } = testPreventWheelActionWithOptions(swipeUpTrackpad.wheelEvents, { options: { preventWheelAction: 'y' } })

    expect(wheelEventsWithPreventDefault.length).toBe(85)
    // gets called a few times when deltas are equal
    expect(preventDefault).toBeCalledTimes(85)
  })
})

test('should warn about unsupported preventWheelAction in debug mode', () => {
  const logWarn = spyOn(console, 'warn')

  testPreventWheelActionWithOptions(swipeUpTrackpad.wheelEvents, {
    // @ts-ignore
    options: { preventWheelAction: 'xyz' },
  })

  expect(logWarn.calls.mostRecent().args[0]).toMatchInlineSnapshot(`"unsupported preventWheelAction value: xyz"`)
})
