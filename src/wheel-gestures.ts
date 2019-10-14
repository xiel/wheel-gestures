import { WheelAnalyzer, WheelPhase } from './wheel-analyzer'
export * from './wheel-analyzer'
import EventBus from './events/EventBus'

interface Props {
  axis: 'x' | 'y' | 'all'
  wheelReason?: keyof typeof wheelType
}

const defaults: Props = {
  axis: 'all',
}

interface WheelDragState {
  down: boolean
  delta: number[]
}

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

export function WheelGestures({ axis, wheelReason = 'user' }: Props = defaults) {
  const dragState: WheelDragState = {
    down: false,
    delta: [0, 0],
  }
  const wheelAnalyzer = new WheelAnalyzer({
    preventWheelAction: axis,
  })
  const { observe, unobserve, disconnect } = wheelAnalyzer

  const { on, off, dispatch } = EventBus({ events: ['wheelpan'] })

  const unsubscribe = wheelAnalyzer.subscribe((type, data) => {
    switch (type) {
      case wheelType[wheelReason].wheel:
        dragState.down = true
        dragState.delta = data.axisDeltas.map((d) => (d * -1) / 2)
        break
      case wheelType[wheelReason].end:
        dragState.down = false
        break
      default:
        return
    }

    dispatch('wheelpan', /* dragState */)
  })

  // on('wheelpan', () => undefined)

  return Object.freeze({
    observe,
    unobserve,
    disconnect,
    on,
  })
}
