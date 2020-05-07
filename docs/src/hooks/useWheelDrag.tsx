import React, { useEffect, useRef } from 'react'
import { WheelEventState, WheelGestures, WheelGesturesOptions } from 'wheel-gestures'

type WheelDragHandler = (state: WheelEventState) => void

interface Options extends WheelGesturesOptions {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
}

export default function useWheelDrag(handler: WheelDragHandler, { domTarget, preventWheelAction }: Options = {}) {
  const wheelGestures = useRef(WheelGestures())

  useEffect(() => {
    wheelGestures.current.updateOptions({ preventWheelAction })
  }, [preventWheelAction])

  useEffect(() => {
    const element = domTarget && 'current' in domTarget ? domTarget.current : domTarget
    return element ? wheelGestures.current.observe(element) : undefined
  })

  useEffect(() => wheelGestures.current.on('wheel', handler), [handler, wheelGestures])
}
