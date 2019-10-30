export interface Props<K> {
  events: K[]
}

export type EventMapEmpty = Record<string, any>
export type EventListener<D = unknown> = (data: D) => void
export type Off = () => void

export default function EventBus<
  EventMap extends Record<string | number | symbol, unknown> = EventMapEmpty,
  K extends string | number | symbol = keyof EventMap
>({ events }: Props<K>) {
  // TODO: add arrays on the fly
  const listeners = Object.fromEntries(
    events.map((eventName) => [eventName, new Array<EventListener<EventMap[K]>>()] as const)
  )

  function on<EK extends keyof EventMap>(type: EK, listener: EventListener<EventMap[EK]>): Off {
    listeners[type] = listeners[type].concat(listener as any)

    return off.bind(undefined, type, listener)
  }

  function off<EK extends keyof EventMap>(type: EK, listener: EventListener<EventMap[EK]>) {
    listeners[type] = listeners[type].filter((l) => l === listener as any)
  }

  function dispatch<EK extends keyof EventMap>(type: EK, data: EventMap[EK]) {
    listeners[type].forEach((l) => l(data as any))
  }

  return Object.freeze({
    on,
    off,
    dispatch,
  })
}
