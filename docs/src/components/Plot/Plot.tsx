import React, { RefObject, useEffect, useRef } from 'react'
import { WheelDragState, clamp } from 'wheel-gestures'
import c from './Plot.module.scss'

export type PlotData = Pick<WheelDragState, 'axisDelta' | 'isMomentum'>

interface Props {
  width?: number
  height?: number
  data: RefObject<PlotData[]>
}

interface DrawProps {
  canvas: HTMLCanvasElement
  data: PlotData[]
}

function draw({ canvas, data }: DrawProps) {
  const ctx = canvas.getContext('2d')!
  const { width, height } = canvas
  const middleY = height / 2

  // clean up
  ctx.clearRect(0, 0, width, height)

  // axis line
  ctx.fillStyle = 'rgba(0, 0, 0, 0.33)'
  ctx.fillRect(0, middleY, width, 1)

  const widthPerEvent = clamp(width / data.length, 0.25, 5)

  data.forEach(({ axisDelta: [deltaX, deltaY], isMomentum }, i) => {
    ctx.fillStyle = isMomentum ? 'rgba(255, 73, 73, 0.45)' : 'rgba(255, 73, 73, 1)'
    ctx.fillRect(widthPerEvent * i, middleY, widthPerEvent, deltaX)
    ctx.fillRect(widthPerEvent * i, middleY, widthPerEvent, deltaY)
  })
}

export function Plot({ width = 1000, height = 600, data }: Props) {
  const ctxRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let id = -1
    ;(function loop() {
      if (!ctxRef.current || !data?.current) return
      draw({ canvas: ctxRef.current, data: data.current })
      id = requestAnimationFrame(loop)
    })()

    return () => cancelAnimationFrame(id)
  }, [data])

  return <canvas ref={ctxRef} className={c.canvas} width={width} height={height} />
}
