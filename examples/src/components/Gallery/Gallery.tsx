import React, { useRef, useState } from 'react'
import { animated, config as springCfg, useSpring } from 'react-spring'

import c from './Gallery.module.scss'
import useWheelDrag from '../../hooks/useWheelDrag'
import { WheelReason } from 'wheel-gestures'

interface Props {}

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=600&w=1000',
  'https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=600&w=1000',
  'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=600&w=1000',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=600&w=1000',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=600&w=1000',
]

const DECAY_FAST = 0.99
const DECAY_NORMAL = 0.998
const projection = (startVelocityPxMs: number) => (startVelocityPxMs * DECAY_FAST) / (1 - DECAY_FAST)

const rubberband = (distance: number, dimension: number, constant = 0.55) =>
  (distance * dimension * constant) / (constant * distance + dimension)

const rubberbandClamp = (min: number, max: number, delta: number, constant?: number) =>
  delta < min
    ? -rubberband(min - delta, max - min, constant) + min
    : delta > max
    ? rubberband(delta - max, max - min, constant) + max
    : delta

// TODO: add select box to toggle momentumDetection
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
      const [xVelo] = axisVelocity

      if (down) {
        const unrubberedX = offsetX.current + x

        set({ x: down ? unrubberedX : 0, immediate: down })
      } else {
        const width = window.innerWidth
        const config = { velocity: xVelo * -1 }
        const snapPoints = pages.map((_, i) => i * width * -1)
        const projectionX = projection(xVelo) * -1
        const projectedTarget = offsetX.current + x + projectionX

        const closestSnapPoint = snapPoints.reduce(
          (acc, snapPoint) => {
            const diff = snapPoint - acc.projectedTarget
            const isCloser = Math.abs(diff) < Math.abs(acc.closestDiff)
            return isCloser ? { ...acc, closest: snapPoint, closestDiff: diff } : acc
          },
          {
            projectedTarget: projectedTarget,
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
