export type VectorXYZ = [number, number, number]
export type BooleanXYZ = [boolean, boolean, boolean]

export interface WheelAnalyzerState {
  isStarted: boolean
  isStartPublished: boolean
  isMomentum: boolean
  startTime: number
  lastAbsDelta: number
  axisMovement: VectorXYZ
  axisVelocity: VectorXYZ
  accelerationFactors: number[][]
  scrollPoints: MergedScrollPoint[]
  scrollPointsToMerge: ScrollPoint[]
  willEndTimeout: number
}

export interface PhaseData {
  type: WheelPhase
  isMomentum: boolean
  axisMovement: VectorXYZ
  axisVelocity: VectorXYZ
  axisDelta: VectorXYZ
  event: WheelEvent | WheelEventData
}

export interface ScrollPoint {
  deltaMaxAbs: number
  axisDelta: VectorXYZ
  timeStamp: number
}

export interface MergedScrollPoint {
  deltaMaxAbsAverage: number
  axisDeltaSum: VectorXYZ
  timeStamp: number
}

export type WheelEventDataRequiredFields = 'deltaMode' | 'deltaX' | 'deltaY' | 'timeStamp'

export interface WheelEventData
  extends Pick<WheelEvent, WheelEventDataRequiredFields>,
    Partial<Omit<WheelEvent, WheelEventDataRequiredFields>> {}

export type WheelTypes = 'WHEEL' | 'ANY_WHEEL' | 'MOMENTUM_WHEEL'

export enum WheelPhase {
  'ANY_WHEEL_START' = 'ANY_WHEEL_START',
  'ANY_WHEEL' = 'ANY_WHEEL',
  'ANY_WHEEL_END' = 'ANY_WHEEL_END',
  'WHEEL_START' = 'WHEEL_START',
  'WHEEL' = 'WHEEL',
  'WHEEL_END' = 'WHEEL_END',
  'MOMENTUM_WHEEL_START' = 'MOMENTUM_WHEEL_START',
  'MOMENTUM_WHEEL' = 'MOMENTUM_WHEEL',
  'MOMENTUM_WHEEL_CANCEL' = 'MOMENTUM_WHEEL_CANCEL',
  'MOMENTUM_WHEEL_END' = 'MOMENTUM_WHEEL_END',
}

export type SubscribeFn = (type: WheelPhase, data: PhaseData) => void
export type Unsubscribe = () => void

export type Unobserve = () => void
export type PreventWheelActionType = 'all' | 'x' | 'y'
export type ReverseSign = BooleanXYZ | boolean
