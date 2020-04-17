import { Axis, DeltaProp } from './wheel-analyzer-types'

export const SOON_ENDING_THRESHOLD = 1.4
export const ACC_FACTOR_MIN = 0.6
export const ACC_FACTOR_MAX = 0.96
export const DELTA_MAX_ABS = 150

/**
 * the timeout is automatically adjusted during a gesture
 * the initial timeout period is pretty long, so even old mouses, which emit wheel events less often, can produce a continuous gesture
 */
export const WILL_END_TIMEOUT_DEFAULT = 400

export const axes: [Axis, Axis] = ['x', 'y']
export const deltaProp: Record<Axis, DeltaProp> = {
  x: 'deltaX',
  y: 'deltaY',
}

export const isDev = process.env.NODE_ENV !== 'production'
export const WHEELEVENTS_TO_MERGE = 2
export const WHEELEVENTS_TO_ANALAZE = 5

export const SOON_ENDING_WHEEL_COUNT = 3
