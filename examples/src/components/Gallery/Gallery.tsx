import React, { useRef } from 'react'
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

const DECELERATION_RATE = 0.995
const projection = (startVelocityPxMs: number) => (startVelocityPxMs * DECELERATION_RATE) / (1 - DECELERATION_RATE)

// TODO: add select box to toggle momentumDetection
export default function Gallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const offsetX = useRef(0)
  const [spring, set] = useSpring(() => ({
    x: 0,
    config: springCfg.stiff,
  }))

  const onFrame = (currentValue: { x?: number }) => (offsetX.current = (currentValue.x ?? offsetX.current))

  useWheelDrag(
    ({ down, delta: [x], axisVelocity }) => {
      const [xVelo] = axisVelocity

      if (down) {
        set({ x: down ? offsetX.current + x : 0, immediate: down })
      } else {
        const width = window.innerWidth
        const config = { velocity: xVelo * -1 }
        const snapPoints = pages.map((_, i) => i * width * -1)

        console.log(x, xVelo)
        const projectionX = projection(xVelo) * -1
        const projectedTarget = offsetX.current + x + projectionX

        console.log('width', width)
        console.log('snapPoints', snapPoints)
        console.log('projectionX', projectionX)
        console.log('projectedTarget', projectedTarget)

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

        console.log('closestSnapPoint', closestSnapPoint)

        offsetX.current = closestSnapPoint.closest

        set({ x: closestSnapPoint.closest, config, onFrame })
      }
    },
    { domTarget: containerRef, axis: 'x', wheelReason: WheelReason.USER }
  )

  return (
    <div ref={containerRef} className={c.gallery}>
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
