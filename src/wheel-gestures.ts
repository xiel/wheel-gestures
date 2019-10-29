import { Unsubscribe, WheelAnalyzer, WheelPhase } from './wheel-analyzer'
export * from './wheel-analyzer'
import EventBus from './events/EventBus'
import { WheelDragState } from './wheel-gestures.types'

export interface Props {
  axis?: 'x' | 'y' | 'all'
  wheelReason?: WheelReason
}

export type WheelReason = keyof typeof wheelType

const wheelType = {
  user: {
    start: WheelPhase.WHEEL_START,
    wheel: WheelPhase.WHEEL,
    end: WheelPhase.WHEEL_END,
  },
  any: {
    start: WheelPhase.ANY_WHEEL_START,
    wheel: WheelPhase.ANY_WHEEL,
    end: WheelPhase.ANY_WHEEL_END,
  },
}

type WheelDragHandler = (state: WheelDragState) => void

export function WheelGestures({ axis = 'all', wheelReason = 'user' }: Props = {}) {
  let unsubscribe: Unsubscribe | undefined
  let dragState: WheelDragState = {
    down: false,
    delta: [0, 0],
  }
  const wheelAnalyzer = new WheelAnalyzer({
    preventWheelAction: axis,
  })
  const { observe, unobserve, disconnect } = wheelAnalyzer
  const { on, off, dispatch } = EventBus({ events: ['wheelpan'] })

  // TODO: subscribe on first on, unsubscribe on last off...
  unsubscribe = wheelAnalyzer.subscribe((type, data) => {
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
  })

  return Object.freeze({
    observe,
    unobserve,
    disconnect,
    on,
    off,
  })
}
