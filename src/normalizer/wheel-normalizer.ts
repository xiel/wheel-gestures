import { WheelEventData } from '../wheel-analyzer.types'

const LINE_HEIGHT = 16 * 1.125
const PAGE_HEIGHT = (typeof window !== 'undefined' && window.innerHeight) || 800
const DELTA_MODE_UNIT = [1, LINE_HEIGHT, PAGE_HEIGHT]

export function normalizeWheel(e: WheelEventData) {
  const deltaX = e.deltaX * DELTA_MODE_UNIT[e.deltaMode]
  const deltaY = e.deltaY * DELTA_MODE_UNIT[e.deltaMode]
  const deltaZ = (e.deltaZ || 0) * DELTA_MODE_UNIT[e.deltaMode]

  return {
    deltaX,
    deltaY,
    deltaZ,
    deltaMode: 0 as const,
    timestamp: e.timeStamp,
  }
}
