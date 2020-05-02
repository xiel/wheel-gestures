import { ReverseSign, VectorXYZ, WheelEventData } from '../wheel-analyzer/wheel-analyzer-types'

export interface NormalizedWheel {
  axisDelta: VectorXYZ
  timeStamp: number
}

const LINE_HEIGHT = 16 * 1.125
const PAGE_HEIGHT = (typeof window !== 'undefined' && window.innerHeight) || 800
const DELTA_MODE_UNIT = [1, LINE_HEIGHT, PAGE_HEIGHT]

export function normalizeWheel(e: WheelEventData): NormalizedWheel {
  const deltaX = e.deltaX * DELTA_MODE_UNIT[e.deltaMode]
  const deltaY = e.deltaY * DELTA_MODE_UNIT[e.deltaMode]
  const deltaZ = (e.deltaZ || 0) * DELTA_MODE_UNIT[e.deltaMode]

  return {
    axisDelta: [deltaX, deltaY, deltaZ],
    timeStamp: e.timeStamp,
  }
}

const reverseAll = [-1, -1, -1]

export function reverseSign<T extends Pick<NormalizedWheel, 'axisDelta'>>(wheel: T, reverseSign: ReverseSign): T {
  if (!reverseSign) {
    return wheel
  }

  const multipliers = reverseSign === true ? reverseAll : reverseSign.map((shouldReverse) => (shouldReverse ? -1 : 1))

  return {
    ...wheel,
    axisDelta: wheel.axisDelta.map((delta, i) => delta * multipliers[i]),
  }
}
