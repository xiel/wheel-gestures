import React, { useEffect, useMemo } from 'react'
import { WheelAnalyzer } from 'wheel-analyzer'

type WheelDragHandler = () => void

interface Options {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
}

export default function useWheelDrag(handler: WheelDragHandler, { domTarget }: Options = {}) {
  const wheelAnalyzer = useMemo(() => new WheelAnalyzer(), [])

  useEffect(() => {
    const element = domTarget && 'current' in domTarget && domTarget.current
    return element ? wheelAnalyzer.observe(element) : undefined
  })

  useEffect(() => {
    if (!wheelAnalyzer) return

    const unsubscribe = wheelAnalyzer.subscribe((type, data) => {
      console.log(type, data)
    })

    return () => unsubscribe()
  }, [wheelAnalyzer])

  return null
}
