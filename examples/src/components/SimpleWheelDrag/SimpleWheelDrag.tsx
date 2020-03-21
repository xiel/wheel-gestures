import React, { useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import c from './SimpleWheelDrag.module.scss'
import WheelRecorder from '../WheelRecorder/WheelRecorder'
import useWheelDrag from '../../hooks/useWheelDrag'
import { WheelReason } from 'wheel-gestures'

export default function SimpleWheelDrag() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  const [springMomentum, setSpringMomentum] = useSpring(() => ({ xy: [0, 0] }))
  const [preventWheelAction, setPreventWheelAction] = useState<'all' | 'x' | 'y'>('all')

  useWheelDrag(
    ({ down, delta }) => {
      set({ xy: down ? delta : [0, 0] }) // immediate: down
    },
    { domTarget: containerRef, axis: preventWheelAction }
  )

  // update momentum spring
  useWheelDrag(
    ({ down, delta }) => {
      setSpringMomentum({ xy: down ? delta : [0, 0] }) // immediate: down
    },
    { domTarget: containerRef, axis: preventWheelAction, wheelReason: WheelReason.ANY }
  )

  const interpolate = (x: number, y: number) => `translate3D(${x}px, ${y}px, 0)`

  return (
    <div className={c.page}>
      <div className={c.options}>
        <WheelRecorder domTarget={containerRef} />
        <label>
          preventWheelAction{' '}
          <select onChange={(e) => setPreventWheelAction(e.target.value as any)}>
            <option>all</option>
            <option>x</option>
            <option>y</option>
          </select>
        </label>
      </div>

      <div className={c.container} ref={containerRef}>
        <animated.div
          className={c.box + ' ' + c.momentum}
          style={{
            transform: springMomentum.xy.to(interpolate),
          }}
        />
        <animated.div
          ref={elRef}
          className={c.box}
          style={{
            transform: xy.to(interpolate),
          }}
        />
      </div>
    </div>
  )
}
