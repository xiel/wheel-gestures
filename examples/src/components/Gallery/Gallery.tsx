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

const DECELERATION_RATE = 0.998
const projection = (startVelocityPxMs: number) => (startVelocityPxMs * DECELERATION_RATE) / (1 - DECELERATION_RATE)

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const offsetX = useRef(0)
  const [spring, set] = useSpring(() => ({
    x: 0,
    config: springCfg.slow,
  }))

  useWheelDrag(
    ({ down, delta: [x], axisVelocity }) => {
      const [xVelo] = axisVelocity
      let projectionX = projection(xVelo) * -1

      console.log(x, xVelo)

      if (down) {
        set({ x: down ? offsetX.current + x : 0, immediate: down })
      } else {
        // projectionX = projectionX + (projectionX + offsetX.current) % window.innerWidth
        const config = { velocity: xVelo * -1 }
        // const config = undefined
        offsetX.current += x
        set({ x: offsetX.current + projectionX, config })
        offsetX.current += projectionX
      }

    },
    { domTarget: containerRef, axis: 'x', wheelReason: WheelReason.USER }
  )

  return (
    <div ref={containerRef} className={c.gallery}>
      <animated.div style={{ x: spring.x }}>
        {pages.map((url, i) => (
          <div key={i}>
            <img src={url} />
          </div>
        ))}
      </animated.div>
    </div>
  )
}
