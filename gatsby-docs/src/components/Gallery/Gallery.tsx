import React, { useRef, useState } from 'react'
import { animated, config as springCfg, useSpring } from 'react-spring'

import c from './Gallery.module.scss'
import useWheelDrag from '../../hooks/useWheelDrag'
import { WheelReason } from 'wheel-gestures'
import { projection } from '../../utils/projection'
import { rubberband } from '../../utils/rubberband'

const pages = [
  'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const offsetX = useRef(0)
  const [selectedWheelReason, setSelectedWheelReason] = useState(WheelReason.USER)
  const [spring, set] = useSpring(() => ({
    x: offsetX.current,
    config: springCfg.stiff,
  }))

  const onFrame = (currentValue: { x?: number }) => {
    offsetX.current = currentValue.x ?? offsetX.current
  }

  useWheelDrag(
    ({ down, delta: [x], axisVelocity }) => {
      const [xVelo, yVelo] = axisVelocity
      const width = containerRef.current!.offsetWidth
      const minX = width * -1 * (pages.length - 1)

      if (down) {
        if (Math.abs(xVelo) > Math.abs(yVelo)) {
          set({ x: rubberband(minX, 0, offsetX.current + x), immediate: true })
        }
      } else {
        const config = { velocity: xVelo }
        const snapPoints = pages.map((_, i) => i * width * -1)
        const projectionX = projection(xVelo)
        const projectedTarget = offsetX.current + x + projectionX

        const closestSnapPoint = snapPoints.reduce(
          (acc, snapPoint) => {
            const diff = snapPoint - acc.projectedTarget
            const isCloser = Math.abs(diff) < Math.abs(acc.closestDiff)
            return isCloser ? { ...acc, closest: snapPoint, closestDiff: diff } : acc
          },
          {
            projectedTarget,
            closest: Infinity,
            closestDiff: Infinity,
          }
        )

        offsetX.current = closestSnapPoint.closest
        set({ x: closestSnapPoint.closest, config, onFrame })
      }
    },
    { domTarget: containerRef, axis: 'x', wheelReason: selectedWheelReason }
  )

  return (
    <div ref={containerRef} className={c.gallery}>
      <select value={selectedWheelReason} onChange={(e) => setSelectedWheelReason(e.target.value as WheelReason)}>
        <option value={WheelReason.USER}>momentum detection</option>
        <option value={WheelReason.ANY}>no momentum detection</option>
      </select>
      <animated.div style={{ x: spring.x }}>
        {pages.map((url, i) => (
          <div key={i}>
            <img src={url} alt="" />
          </div>
        ))}
      </animated.div>
    </div>
  )
}
