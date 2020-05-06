import { deepFreeze } from '../utils'
import { BooleanXYZ } from './wheel-gestures-types'

export type PreventWheelActionType = true | 'x' | 'y' | 'z' | false
export type ReverseSign = BooleanXYZ | boolean

export interface WheelGesturesConfig {
  preventWheelAction: PreventWheelActionType
  reverseSign: ReverseSign
}

// all options are optional and have reasonable defaults
export type WheelGesturesOptions = Partial<WheelGesturesConfig>

export const configDefaults: WheelGesturesConfig = deepFreeze({
  preventWheelAction: true,
  reverseSign: [true, true, false],
})
