import React, { useEffect, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import c from './SimpleWheelDrag.module.scss'
import useWheelDrag from '../../hooks/useWheelDrag'

export default function SimpleWheelDrag() {
  const elRef = useRef<HTMLDivElement | null>(null)
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))

  const bind = useDrag(({ down, delta }) => {
    set({ xy: down ? delta : [0, 0] })
  }, { domTarget: elRef })

  const wheelDrag = useWheelDrag(() => {

  }, { domTarget: elRef })

  console.log('wheelDrag', wheelDrag)

  const interpolate = (x: number, y: number) => `translate3D(${x}px, ${y}px, 0)`

  useEffect(bind as any, [bind])

  return (
    <animated.div
      ref={elRef}
      className={c.box}
      style={{
        transform: xy.interpolate(interpolate as any),
      }}
    />
  )
}
