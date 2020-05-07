/**
 * public types
 * these types are exported by the module
 */
export type VectorXYZ = [number, number, number]
export type BooleanXYZ = [boolean, boolean, boolean]
export type PreventWheelActionType = true | 'x' | 'y' | 'z' | false
export type ReverseSign = BooleanXYZ | boolean

export interface WheelGesturesConfig {
  preventWheelAction: PreventWheelActionType
  reverseSign: ReverseSign
}

// all options are optional and have reasonable defaults
export type WheelGesturesOptions = Partial<WheelGesturesConfig>
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
  previous?: WheelEventState
}

export type WheelGesturesEventMap = {
  wheel: WheelEventState
}
