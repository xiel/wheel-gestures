import React, { useEffect, useMemo, useRef } from 'react'
import { Options as WAOptions, WheelAnalyzer, WheelPhase } from 'wheel-gestures'

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

interface Options extends Partial<WAOptions> {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
  wheelReason?: keyof typeof wheelType
}

export default function useWheelDragWA(
  handler: WheelDragHandler,
  { domTarget, wheelReason = 'user', preventWheelAction }: Options = {}
) {
  const dragState = useRef<WheelDragState>({
    down: false,
    delta: [0, 0],
  })
  const wheelAnalyzer = useMemo(() => new WheelAnalyzer({ preventWheelAction }), [preventWheelAction])

  useEffect(() => {
    const element = domTarget && 'current' in domTarget ? domTarget.current : domTarget
    return element ? wheelAnalyzer.observe(element) : undefined
  })

  useEffect(() => {
    if (!wheelAnalyzer) return

    const unsubscribe = wheelAnalyzer.subscribe((type, data) => {
      switch (type) {
        case wheelType[wheelReason].wheel:
          dragState.current.down = true
          dragState.current.delta = data.axisDeltas.map((d) => (d * -1) / 2)
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
