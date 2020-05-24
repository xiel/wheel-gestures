import React, { useEffect, useRef, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { addVectors, WheelGesturesConfig } from 'wheel-gestures'

import useWheelDrag from '../../hooks/useWheelDrag'
import { Plot, PlotData } from '../Plot/Plot'
import WheelRecorder from '../WheelRecorder/WheelRecorder'
import c from './SimpleWheelDrag.module.scss'

export default function SimpleWheelDrag() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const elRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef([0, 0, 0])
  const [{ xyz }, set] = useSpring(() => ({ xyz: [0, 0, 0] }))
  const [springMomentum, setSpringMomentum] = useSpring(() => ({ xyz: [0, 0, 0] }))
  const [preventWheelAction, setPreventWheelAction] = useState<WheelGesturesConfig['preventWheelAction']>(true)
  const [wheelSource, wheelSourceSet] = useState('-')
  const plotData = useRef<PlotData[]>([])

  useWheelDrag(
    ({ isStart, isMomentum, isEnding, axisMovement, axisDelta }) => {
      if (isStart) {
        posRef.current = xyz.get()
      }

      // update user spring
      set({
        xyz: isEnding || isMomentum ? [0, 0, 0] : addVectors(axisMovement, posRef.current),
        immediate: !(isEnding || isMomentum),
      })

      // update momentum spring
      setSpringMomentum({
        xyz: isEnding ? [0, 0, 0] : addVectors(axisMovement, posRef.current),
        immediate: !isEnding,
      })

      wheelSourceSet(isEnding ? '-' : isMomentum ? 'momentum' : 'user')

      if (isStart) {
        plotData.current.length = 0
      }
      plotData.current.push({ axisDelta, isMomentum })
    },
    { domTarget: containerRef, preventWheelAction }
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
        <Plot data={plotData} />
      </div>
      <div className={c.options}>
        <WheelRecorder domTarget={containerRef} />
        <label>
          preventWheelAction{' '}
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
            <option>true</option>
            <option>false</option>
            <option>x</option>
            <option>y</option>
          </select>
        </label>
        wheelSource: {wheelSource}
      </div>
    </div>
  )
}
