import React, { useRef } from 'react'
import { animated, useSprings } from 'react-spring'

import c from './Gallery.module.scss'
import useWheelDrag from '../../hooks/useWheelDrag'
import { WheelReason } from 'wheel-gestures'

interface Props {}

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/296878/pexels-photo-296878.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const offsetX = useRef(0)
  const [props, set] = useSprings(pages.length, (i) => ({
    x: i * window.innerWidth,
    scale: 1,
    display: 'block',
  }))

  useWheelDrag(
    ({ down, delta: [x], axisVelocity }) => {
      if (!down) {
        console.log('add to current', x)
        offsetX.current += x
      }
      // const scale = down ? 1 - Math.abs(x) / window.innerWidth / 6 : 1
      const scale = 1

      console.log(x)

      set((i) => {
        if (!down) return { scale }
        return { x: down ? i * window.innerWidth + offsetX.current + x : 0, scale, immediate: down }
      })
    },
    { domTarget: containerRef, axis: 'x', wheelReason: WheelReason.USER }
  )

  return (
    <div ref={containerRef} className={c.gallery}>
      {props.map(({ x, display, scale }, i) => (
        <animated.div key={i} style={{ display, x, scale }}>
          <div style={{ backgroundImage: `url(${pages[i]})` }} />
        </animated.div>
      ))}
    </div>
  )
}
