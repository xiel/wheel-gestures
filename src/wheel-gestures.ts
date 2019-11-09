import { WheelAnalyzer, WheelPhase } from './wheel-analyzer'
import EventBus from './events/EventBus'
import { WheelDragState, WheelGesturesEventMap, WheelReason } from './wheel-gestures.types'

export * from './wheel-analyzer'

export interface Props {
  axis?: 'x' | 'y' | 'all'
  wheelReason?: WheelReason
}

const wheelType = {
  [WheelReason.USER]: {
    start: WheelPhase.WHEEL_START,
    wheel: WheelPhase.WHEEL,
    end: WheelPhase.WHEEL_END,
  },
  [WheelReason.ANY]: {
    start: WheelPhase.ANY_WHEEL_START,
    wheel: WheelPhase.ANY_WHEEL,
    end: WheelPhase.ANY_WHEEL_END,
  },
}

export function WheelGestures({ axis = 'all', wheelReason = WheelReason.USER }: Props = {}) {
  let dragState: WheelDragState = {
    down: false,
    delta: [0, 0],
  }
  const wheelAnalyzer = new WheelAnalyzer({
    preventWheelAction: axis,
  })
  const { observe, unobserve, disconnect } = wheelAnalyzer
  const { on, off, dispatch } = EventBus<WheelGesturesEventMap>()

  wheelAnalyzer.subscribe((type, data) => {
    switch (type) {
      case wheelType[wheelReason].wheel:
        dragState = {
          down: true,
          delta: data.axisDeltas.map((d) => (d * -1) / 2),
        }
        break
      case wheelType[wheelReason].end:
        dragState = {
          ...dragState,
          down: false,
        }
        break
      default:
        return
    }

    dispatch('wheelpan', dragState)
    // dispatch('wheelswipe', { dir: 'left' })
    // dispatch('wheel-x', { x: 1 })
  })

  return Object.freeze({
    observe,
    unobserve,
    disconnect,
    on,
    off,
  })
}
