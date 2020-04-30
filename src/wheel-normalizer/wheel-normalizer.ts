import { ReverseSign, WheelEventData } from '../wheel-analyzer/wheel-analyzer-types'

interface NormalizedWheel {
  deltaX: number
  deltaY: number
  deltaZ: number
  timeStamp: number
  deltaMode: 0
}

const LINE_HEIGHT = 16 * 1.125
const PAGE_HEIGHT = (typeof window !== 'undefined' && window.innerHeight) || 800
const DELTA_MODE_UNIT = [1, LINE_HEIGHT, PAGE_HEIGHT]

export function reverseSign<T extends Pick<NormalizedWheel, 'deltaX' | 'deltaY' | 'deltaZ'>>(
  wheel: T,
  reverseSign: ReverseSign
): T {
  if (!reverseSign) {
    return wheel
  }

  const [multiplierX, multiplierY, multiplierZ] =
    reverseSign === true ? [-1, -1, -1] : reverseSign.map((shouldReverse) => (shouldReverse ? -1 : 1))

  return {
    ...wheel,
    deltaX: wheel.deltaX * multiplierX,
    deltaY: wheel.deltaY * multiplierY,
    deltaZ: wheel.deltaZ * multiplierZ,
  }
}

export function normalizeWheel(e: WheelEventData): NormalizedWheel {
  const deltaX = e.deltaX * DELTA_MODE_UNIT[e.deltaMode]
  const deltaY = e.deltaY * DELTA_MODE_UNIT[e.deltaMode]
  const deltaZ = (e.deltaZ || 0) * DELTA_MODE_UNIT[e.deltaMode]

  return {
    deltaX,
    deltaY,
    deltaZ,
    deltaMode: 0,
    timeStamp: e.timeStamp,
  }
}
