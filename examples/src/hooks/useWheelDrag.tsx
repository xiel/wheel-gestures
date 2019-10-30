import React, { useEffect, useMemo } from 'react'
import { Props as WheelGesturesProps, WheelGestures } from 'wheel-gestures'

interface WheelDragState {
  down: boolean
  delta: number[]
}

type WheelDragHandler = (state: WheelDragState) => void

interface Options extends WheelGesturesProps {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
}

export default function useWheelDrag(
  handler: WheelDragHandler,
  { domTarget, wheelReason = 'user', axis }: Options = {}
) {
  const wheelGestures = useMemo(() => WheelGestures({ wheelReason, axis }), [wheelReason, axis])

  useEffect(() => {
    const element = domTarget && 'current' in domTarget ? domTarget.current : domTarget
    return element ? wheelGestures.observe(element) : undefined
  })

  useEffect(() => {
    if (!wheelGestures) return
    return wheelGestures.on('wheelpan', data => console.log(data))
  }, [handler, wheelGestures, wheelReason])

  return null
}
