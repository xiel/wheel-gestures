import React, { useEffect, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import c from './SimpleWheelDrag.module.scss'
import useWheelDrag from '../../hooks/useWheelDrag'
import WheelRecorder from '../WheelRecorder/WheelRecorder'

export default function SimpleWheelDrag() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

  const bind = useDrag(
    ({ down, delta }) => {
      set({ xy: down ? delta : [0, 0] })
    },
    { domTarget: elRef }
  )

  useWheelDrag(
    ({ down, delta }) => {
      set({ xy: down ? delta : [0, 0] })
    },
    { domTarget: containerRef }
  )

  const interpolate = (x: number, y: number) => `translate3D(${x}px, ${y}px, 0)`

  useEffect(bind as any, [bind])

  return (
    <div className={c.container} ref={containerRef}>
      <WheelRecorder domTarget={containerRef} />
      <animated.div
        ref={elRef}
        className={c.box}
        style={{
          transform: xy.interpolate(interpolate as any),
        }}
      />
    </div>
  )
}
