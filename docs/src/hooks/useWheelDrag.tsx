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

  useEffect(() => {
    const offs = [
      wheelGestures.on('wheelstart', handler),
      wheelGestures.on('wheelmove', handler),
      wheelGestures.on('wheelend', handler),
    ]

    return () => offs.forEach((off) => off())
  }, [handler, wheelGestures, wheelReason])
}
