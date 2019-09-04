import React, { useEffect, useMemo, useRef } from 'react'
import { WheelAnalyzer, WheelPhase } from 'wheel-analyzer'

interface WheelDragState {
  down: boolean
  delta: number[]
}

type WheelDragHandler = (state: WheelDragState) => void

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

interface Options {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
  wheelReason?: keyof typeof wheelType
}

export default function useWheelDrag(handler: WheelDragHandler, { domTarget, wheelReason = 'user' }: Options = {}) {
  const dragState = useRef<WheelDragState>({
    down: false,
    delta: [0, 0],
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
        // case wheelType[wheelReason].start:
        //   dragState.current.down = true
        //   break
        case wheelType[wheelReason].wheel:
          dragState.current.down = true
          dragState.current.delta = data.axisDeltas.map((d) => d * -1 / 2)
          break
        case wheelType[wheelReason].end:
          dragState.current.down = false
          break
        default:
          return
      }

      handler(dragState.current)
    })

    return () => unsubscribe()
  }, [handler, wheelAnalyzer, wheelReason])

  return null
}
