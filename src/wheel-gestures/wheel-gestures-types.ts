export type VectorXYZ = [number, number, number]
export type BooleanXYZ = [boolean, boolean, boolean]

export interface WheelGesturesInternalState {
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

export interface WheelGesturesConfig {
  preventWheelAction: PreventWheelActionType
  reverseSign: ReverseSign
}

export type WheelGesturesOptions = Partial<WheelGesturesConfig>

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

export interface WheelEventState {
  isStart: boolean
  isMomentum: boolean
  isEnding: boolean
  isMomentumCancel: boolean
  axisMovement: VectorXYZ
  axisVelocity: VectorXYZ
  axisDelta: VectorXYZ
  event: WheelEvent | WheelEventData
}

export type WheelGesturesEventMap = {
  wheel: WheelEventState
}

export type Unobserve = () => void
export type PreventWheelActionType = 'all' | 'x' | 'y'
export type ReverseSign = BooleanXYZ | boolean
