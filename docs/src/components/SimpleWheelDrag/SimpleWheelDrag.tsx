import React, { useRef, useState, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import WheelRecorder from '../WheelRecorder/WheelRecorder'
import useWheelDrag from '../../hooks/useWheelDrag'
import { WheelReason, addVectors } from 'wheel-gestures'
import { useDrag } from 'react-use-gesture'
import c from './SimpleWheelDrag.module.scss'
import { Plot, PlotData } from '../Plot/Plot'

export default function SimpleWheelDrag() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const movementFromRef = useRef([0, 0, 0])
  const [{ xyz }, set] = useSpring(() => ({ xyz: [0, 0, 0] }))
  const [springMomentum, setSpringMomentum] = useSpring(() => ({ xyz: [0, 0, 0] }))
  const [preventWheelAction, setPreventWheelAction] = useState<'all' | 'x' | 'y'>('all')
  const [momentumScroll, momentumScrollSet] = useState(false)
  const plotData = useRef<PlotData[]>([])

  useWheelDrag(
    ({ start, down, axisMovement }) => {
      if (start) {
        movementFromRef.current = xyz.get()
      }

      set({
        xyz: down ? addVectors(axisMovement, movementFromRef.current) : [0, 0, 0],
        immediate: down,
      })
    },
    { domTarget: containerRef, axis: preventWheelAction }
  )

  // update momentum spring
  useWheelDrag(
    ({ start, down, axisMovement, axisDelta, isMomentum }) => {
      setSpringMomentum({
        xyz: down ? addVectors(axisMovement, movementFromRef.current) : [0, 0, 0],
        immediate: down,
      })

      momentumScrollSet(down && isMomentum)

      if (start) {
        plotData.current.length = 0
      }
      plotData.current.push({ axisDelta, isMomentum })
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
      set({ xyz: dragging ? [...movement, 0] : [0, 0, 0], immediate: dragging })
      setSpringMomentum({ xyz: dragging ? [...movement, 0] : [0, 0, 0], immediate: dragging })
    },
    { domTarget: elRef, eventOptions: { passive: false } }
  )

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
            transform: springMomentum.xyz.to(interpolate),
          }}
        />
        <animated.div
          ref={elRef}
          className={c.box}
          style={{
            transform: xyz.to(interpolate),
          }}
        />
      </div>
      {momentumScroll ? 'momentum scroll' : 'user scroll'}
      <Plot data={plotData} />
    </div>
  )
}
