interface Props<T> {
  events: T[]
}

type EventListener = () => void

export default function EventBus<T extends string>({ events }: Props<T>) {
  const listeners = Object.fromEntries(events.map((eventName) => [eventName, new Array<EventListener>()] as const))

  function on(type: T, listener: EventListener) {
    listeners[type] = listeners[type].concat(listener)
    return off.bind(undefined, type, listener)
  }

  function off(type: T, listener: EventListener) {
    listeners[type] = listeners[type].filter((l) => l === listener)
  }

  function dispatch(type: T) {
    listeners[type].forEach((l) => l())
  }

  return Object.freeze({
    on,
    off,
    dispatch,
  })
}
