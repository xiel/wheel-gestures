import { WheelAnalyzer } from './wheel-analyzer'
export * from './wheel-analyzer'
import EventBus from './events/EventBus'

interface Props {
  axis: 'x' | 'y' | 'all'
}

const defaults: Props = {
  axis: 'all',
}

export function WheelGestures({ axis }: Props = defaults) {
  const { feedWheel, subscribe, unsubscribe, observe, unobserve, disconnect } = new WheelAnalyzer({
    preventWheelAction: axis,
  })

  const { on } = EventBus({ events: ['wheelpan'] })

  on('wheelpan', () => undefined)

  return Object.freeze({
    observe,
    unobserve,
    disconnect,
    on,
  })
}
