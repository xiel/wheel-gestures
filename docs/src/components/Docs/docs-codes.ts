import { WheelGesturesOptions } from 'wheel-gestures'

export const simpleListener = `
import { WheelGestures } from 'wheel-gestures'

// create an instance per element
const wheelGestures = WheelGestures()

// find and observe the element the user can interact with
const element = window.document.querySelector('.slider')
wheelGestures.observe(element)

// add your event callback 
wheelGestures.on('wheel', (wheelEventState) => {
  //...
})`

export const codeWheelEventState = `
export interface WheelEventState {
  isStart: boolean
  isMomentum: boolean
  isEnding: boolean
  isMomentumCancel: boolean
  axisDelta: VectorXYZ
  axisVelocity: VectorXYZ
  axisMovement: VectorXYZ
  axisMovementProjection: VectorXYZ
  event: WheelEvent | WheelEventData
  previous?: WheelEventState
}`
