import { WheelAnalyzer } from './wheel-analyzer'
import EventBus from './events/EventBus'

interface Props {
  axis: 'x' | 'y' | 'all'
}

const defaults: Props = {
  axis: 'all',
}

export default function WheelGestures({ axis }: Props = defaults) {
  const { feedWheel, subscribe, unsubscribe, observe, unobserve, disconnect } = new WheelAnalyzer({
    preventWheelAction: axis,
  })

  const { on } = EventBus({ events: ['pan', 'pan-x', 'pan-y'] })

  on('pan-x', () => undefined)

  return Object.freeze({
    observe,
    unobserve,
    disconnect,
    on,
  })
}
