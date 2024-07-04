import React, { useCallback, useEffect, useRef, useState } from 'react'
import { animated, config as springCfg, useSpring } from 'react-spring'

import useRefOfLatest from '../../hooks/useRefOfLatest'
import useWheelDrag, { WheelDragHandler } from '../../hooks/useWheelDrag'
import { rubberband } from '../../utils/rubberband'
import { WheelIndicator } from '../WheelIndicator/WheelIndicator'
import c from './Gallery.module.scss'

const pages = [
  'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const offsetX = useRef(0)
  const [momentumDetectionEnabled, setSelectedWheelReason] = useState(true)
  const [spring, set] = useSpring(() => ({
    x: offsetX.current,
    config: springCfg.stiff,
  }))
  const [indicatorVisible, setIndicatorVisible] = useState(false)
  const [indicatorFlipped, setIndicatorFlipped] = useState(false)
  const refLatest = useRefOfLatest({ indicatorVisible })

  useEffect(() => {
    if (indicatorVisible) return

    const id = setTimeout(() => {
      setIndicatorVisible(true)
    }, 2000)
    return () => clearTimeout(id)
  }, [indicatorVisible])

  const wheelDragHandler = useCallback<WheelDragHandler>(
    (state) => {
      const {
        isEnding,
        isMomentum,
        axisMovement: [x],
        axisVelocity,
        previous,
        axisMovementProjection,
      } = state

      if (!containerRef.current) return

      const [xVelo, yVelo] = axisVelocity
      const width = containerRef.current.offsetWidth
      const minX = width * -1 * (pages.length - 1)

      if (refLatest.current.indicatorVisible) {
        setIndicatorVisible(false)
      }

      if (isEnding || (momentumDetectionEnabled && isMomentum)) {
        // only snap at momentum begin
        if (momentumDetectionEnabled && previous?.isMomentum) return

        const config = { velocity: xVelo }
        const snapPoints = pages.map((_, i) => i * width * -1)
        const [projectionX] = axisMovementProjection
        const projectedTarget = offsetX.current + projectionX

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

        // update indicator direction
        const hitFirst = closestSnapPoint.closest === snapPoints[0]
        const hitLast = closestSnapPoint.closest === snapPoints[snapPoints.length - 1]

        if (hitFirst) {
          setIndicatorFlipped(false)
        } else if (hitLast) {
          setIndicatorFlipped(true)
        }

        offsetX.current = closestSnapPoint.closest

        set({
          x: closestSnapPoint.closest,
          config,
          onChange: (currentValue: { x?: number }) => {
            offsetX.current = currentValue.x ?? offsetX.current
          },
        })
      } else {
        if (Math.abs(xVelo) > Math.abs(yVelo)) {
          set({ x: rubberband(minX, 0, offsetX.current + x), immediate: true })
        }
      }
    },
    [momentumDetectionEnabled, refLatest, set]
  )

  useWheelDrag(wheelDragHandler, { domTarget: containerRef, preventWheelAction: 'x' })

  return (
    <div className={c.outer}>
      <div className={c.galleryWrapper}>
        <div ref={containerRef} className={c.gallery}>
          <animated.div style={{ x: spring.x }}>
            {pages.map((url, i) => (
              <div key={i}>
                <img src={url} alt={'demo image ' + i + 1} loading="lazy" />
              </div>
            ))}
          </animated.div>
        </div>
        <WheelIndicator visible={indicatorVisible} flipped={indicatorFlipped} />
      </div>
      <select value={momentumDetectionEnabled ? 'on' : ''} onChange={(e) => setSelectedWheelReason(!!e.target.value)}>
        <option value="on">momentum detection</option>
        <option value="">no momentum detection</option>
      </select>
    </div>
  )
}
