import React, { useEffect, useMemo, useRef } from 'react'
import { WheelAnalyzer, WheelPhase } from 'wheel-analyzer'

interface WheelDragState {
  down: boolean
  delta: number[]
}

type WheelDragHandler = (state: WheelDragState) => void

interface Options {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
}

export default function useWheelDrag(handler: WheelDragHandler, { domTarget }: Options = {}) {
  const dragState = useRef<WheelDragState>({
    down: false,
    delta: [0,0]
  })
  const wheelAnalyzer = useMemo(() => new WheelAnalyzer(), [])

  useEffect(() => {
    const element = domTarget && 'current' in domTarget ? domTarget.current : domTarget
    return element ? wheelAnalyzer.observe(element) : undefined
  })

  useEffect(() => {
    if (!wheelAnalyzer) return

    const unsubscribe = wheelAnalyzer.subscribe((type, data) => {
      switch (type) {
        case WheelPhase.WHEEL_START:
          dragState.current.down = true
          break
        case WheelPhase.WHEEL:
          dragState.current.delta = data.axisDeltas.map(d => d * -1)
          break
        case WheelPhase.WHEEL_END:
          dragState.current.down = false
          break
        default:
          return
      }

      handler(dragState.current)
    })

    return () => unsubscribe()
  }, [handler, wheelAnalyzer])

  return null
}
