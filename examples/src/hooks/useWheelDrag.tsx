import React, { useEffect, useMemo } from 'react'
import { Props as WheelGesturesProps, WheelDragState, WheelGestures, WheelReason } from 'wheel-gestures'

type WheelDragHandler = (state: WheelDragState) => void

interface Options extends WheelGesturesProps {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
}

export default function useWheelDrag(
  handler: WheelDragHandler,
  { domTarget, wheelReason = WheelReason.USER, axis }: Options = {}
) {
  const wheelGestures = useMemo(() => WheelGestures({ wheelReason, axis }), [wheelReason, axis])

  useEffect(() => {
    const element = domTarget && 'current' in domTarget ? domTarget.current : domTarget
    return element ? wheelGestures.observe(element) : undefined
  })

  useEffect(() => wheelGestures.on('wheelpan', handler), [handler, wheelGestures, wheelReason])
}
