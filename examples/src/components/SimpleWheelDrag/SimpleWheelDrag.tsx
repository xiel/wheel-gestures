import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import c from './SimpleWheelDrag.module.scss'
import useWheelDrag from '../../hooks/useWheelDrag'
import WheelRecorder from '../WheelRecorder/WheelRecorder'

export default function SimpleWheelDrag() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  const [springMomentum, setSpringMomentum] = useSpring(() => ({ xy: [0, 0] }))
  const [preventWheelAction, setPreventWheelAction] = useState<'all' | 'x' | 'y'>('all')

  const bind = useDrag(
    ({ down, delta }) => {
      set({ xy: down ? delta : [0, 0] })
    },
    { domTarget: elRef }
  )

  useWheelDrag(
    ({ down, delta }) => {
      set({ xy: down ? delta : [0, 0] }) // immediate: down
    },
    { domTarget: containerRef, preventWheelAction }
  )

  // update momentum spring
  useWheelDrag(
    ({ down, delta }) => {
      setSpringMomentum({ xy: down ? delta : [0, 0] }) // immediate: down
    },
    { domTarget: containerRef, preventWheelAction, wheelReason: 'any' }
  )

  const interpolate = (x: number, y: number) => `translate3D(${x}px, ${y}px, 0)`

  // bind does not seem to be correctly typed...
  useEffect(bind as any, [bind])

  return (
    <div className={c.page}>
      <WheelRecorder domTarget={containerRef} />
      <label>
        preventWheelAction (axis):{' '}
        <select onChange={e => setPreventWheelAction(e.target.value as any)}>
          <option>all</option>
          <option>x</option>
          <option>y</option>
        </select>
      </label>

      <div className={c.container} ref={containerRef}>
        <animated.div
          className={c.box + ' ' + c.momentum}
          style={{
            transform: springMomentum.xy.interpolate(interpolate as any),
          }}
        />
        <animated.div
          ref={elRef}
          className={c.box}
          style={{
            transform: xy.interpolate(interpolate as any),
          }}
        />
      </div>
    </div>
  )
}
