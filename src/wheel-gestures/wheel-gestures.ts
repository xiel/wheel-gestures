import EventBus from '../events/EventBus'
import { WheelAnalyzer } from '../wheel-analyzer/wheel-analyzer'
import { WheelPhase } from '../wheel-analyzer/wheel-analyzer-types'
import { WheelDragState, WheelGesturesEventMap, WheelReason } from './wheel-gestures-types'

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
  const wheelAnalyzer = WheelAnalyzer({
    preventWheelAction: axis,
  })

  const { observe, unobserve, disconnect } = wheelAnalyzer
  const { on, off, dispatch } = EventBus<WheelGesturesEventMap>()

  wheelAnalyzer.subscribe((type, data) => {
    let dragState: WheelDragState = {
      ...data,
      // TODO: move into analyzer
      down: true,
    }

    switch (type) {
      case wheelType[wheelReason].start:
        dragState = {
          ...dragState,
          down: true,
        }
        dispatch('wheelstart', dragState)
        break
      case wheelType[wheelReason].wheel:
        dragState = {
          ...dragState,
          down: true,
        }
        dispatch('wheelmove', dragState)
        break
      case wheelType[wheelReason].end:
        dragState = {
          ...dragState,
          down: false,
        }
        dispatch('wheelend', dragState)
        break
      default:
        return
    }
  })

  return Object.freeze({
    observe,
    unobserve,
    disconnect,
    on,
    off,
  })
}
