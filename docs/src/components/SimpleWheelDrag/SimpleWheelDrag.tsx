import React, { useRef, useState, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import WheelRecorder from '../WheelRecorder/WheelRecorder'
import useWheelDrag from '../../hooks/useWheelDrag'
import { WheelReason } from 'wheel-gestures'
import { useDrag } from 'react-use-gesture'
import c from './SimpleWheelDrag.module.scss'

export default function SimpleWheelDrag() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  const [springMomentum, setSpringMomentum] = useSpring(() => ({ xy: [0, 0] }))
  const [preventWheelAction, setPreventWheelAction] = useState<'all' | 'x' | 'y'>('all')

  useWheelDrag(
    ({ down, axisMovement }) => {
      set({ xy: down ? axisMovement : [0, 0], immediate: down }) // immediate: down
    },
    { domTarget: containerRef, axis: preventWheelAction }
  )

  // update momentum spring
  useWheelDrag(
    ({ down, axisMovement, axisDelta, isMomentum, isEndingSoon }) => {
      setSpringMomentum({ xy: down ? axisMovement : [0, 0], immediate: down }) // immediate: down
    },
    {
      domTarget: containerRef,
      axis: preventWheelAction,
      wheelReason: WheelReason.ANY,
    }
  )

  const bind = useDrag(
    ({ movement, dragging, event }) => {
      event?.preventDefault()
      set({ xy: dragging ? movement : [0, 0], immediate: dragging })
      setSpringMomentum({ xy: dragging ? movement : [0, 0], immediate: dragging })
    },
    { domTarget: containerRef, eventOptions: { passive: false } }
  )

  // @ts-ignore
  useEffect(bind, [bind])

  const interpolate = (x: number, y: number) => `translate3D(${x}px, ${y}px, 0)`

  return (
    <div>
      <div className={c.options}>
        <WheelRecorder domTarget={containerRef} />
        <label>
          preventWheelAction{' '}
          <select value={preventWheelAction} onChange={(e) => setPreventWheelAction(e.target.value as any)}>
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
