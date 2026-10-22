import { animated, useReducedMotion, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import React, { useRef, useState } from 'react'
import { addVectors, WheelGesturesConfig } from 'wheel-gestures'

import useWheelDrag from '../../hooks/useWheelDrag'
import { Plot, PlotData } from '../Plot/Plot'
import { WheelEventNotice } from '../Skeleton/WheelEventNotice'
import WheelRecorder from '../WheelRecorder/WheelRecorder'
import c from './SimpleWheelDrag.module.scss'

export default function SimpleWheelDrag() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef([0, 0, 0])
  const [{ xyz }, set] = useSpring(() => ({ xyz: [0, 0, 0] }))
  const [springMomentum, setSpringMomentum] = useSpring(() => ({ xyz: [0, 0, 0] }))
  const reducedMotion = useReducedMotion()
  const [preventWheelAction, setPreventWheelAction] = useState<WheelGesturesConfig['preventWheelAction']>(true)
  const [wheelSource, wheelSourceSet] = useState('Idle')
  const plotData = useRef<PlotData[]>([])

  useWheelDrag(
    ({ isStart, isMomentum, isEnding, axisMovement, axisDelta }) => {
      if (isStart) {
        posRef.current = xyz.get()
      }

      // update user spring
      set.start({
        xyz: isEnding || isMomentum ? [0, 0, 0] : addVectors(axisMovement, posRef.current),
        immediate: !!reducedMotion || !(isEnding || isMomentum),
      })

      // update momentum spring
      setSpringMomentum.start({
        xyz: isEnding ? [0, 0, 0] : addVectors(axisMovement, posRef.current),
        immediate: !!reducedMotion || !isEnding,
      })

      wheelSourceSet(isEnding ? 'Idle' : isMomentum ? 'Momentum' : 'User input')

      if (isStart) {
        plotData.current.length = 0
      }
      plotData.current.push({ axisDelta, isMomentum })
    },
    { domTarget: containerRef, preventWheelAction }
  )

  useDrag(
    ({ movement, dragging, event }) => {
      if (event) {
        event.preventDefault()
      }
      set.start({ xyz: dragging ? [...movement, 0] : [0, 0, 0], immediate: !!reducedMotion || dragging })
      setSpringMomentum.start({ xyz: dragging ? [...movement, 0] : [0, 0, 0], immediate: !!reducedMotion || dragging })
    },
    { target: elRef, eventOptions: { passive: false } }
  )

  const interpolate = (x: number, y: number) => `translate3D(${x}px, ${y}px, 0)`

  return (
    <div>
      <WheelEventNotice />
      <ul className={c.legend} aria-label="Visualization legend">
        <li>
          <span className={c.swatch} aria-hidden="true" /> Solid: user input
        </li>
        <li>
          <span className={`${c.swatch} ${c.faded}`} aria-hidden="true" /> Translucent: user input + momentum
        </li>
      </ul>
      <div className={c.container} ref={containerRef}>
        <animated.div
          aria-hidden="true"
          className={c.box + ' ' + c.momentum}
          style={{
            transform: springMomentum.xyz.to(interpolate),
          }}
        />
        <animated.div
          ref={elRef}
          aria-label="Drag to explore movement"
          className={c.box}
          style={{
            transform: xyz.to(interpolate),
          }}
        />
        <Plot data={plotData} />
      </div>
      <p className={c.explanation}>
        Bars show each wheel event’s movement. Faded bars indicate detected momentum; the plot resets for each gesture.
      </p>
      <div className={c.options}>
        <WheelRecorder domTarget={containerRef} />
        <label>
          Prevent page scrolling
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={preventWheelAction.toString()}
            onChange={({ target }) => {
              try {
                setPreventWheelAction(JSON.parse(target.value))
              } catch (e) {
                setPreventWheelAction(target.value as WheelGesturesConfig['preventWheelAction'])
              }
            }}
          >
            <option value="true">Both axes</option>
            <option value="false">Neither axis</option>
            <option value="x">Horizontal only</option>
            <option value="y">Vertical only</option>
          </select>
        </label>
        <span role="status">Input: {wheelSource}</span>
      </div>
    </div>
  )
}
