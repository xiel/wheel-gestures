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

export const optionsExample = `
const wheelGestures = WheelGestures({ preventWheelAction: 'x' })

// ... or later after creation
wheelGestures.updateOptions({ preventWheelAction: 'y' })
`

export const codeWheelEventState = `
export type VectorXYZ = [number, number, number]

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

export const observeExample = `
const wheelGestures = WheelGestures()
const domElement = document.getElementById("wheel-movable")
wheelGestures.observe(domElement)
`

export const unobserveExample = `
wheelGestures.unobserve(domElement)
`

export const unobserveReturned = `
const unobserveDomElement = wheelGestures.observe(domElement)
// later in clean up...
unobserveDomElement()
`

export const feedWheelExample = `
const wheelGestures = WheelGestures()
const domElement = document.getElementById("wheel-movable")

domElement.addEventListener("wheel", wheelGestures.feedWheel)
`
export const wheelCallbackExample = `
const wheelGestures = WheelGestures()

wheelGestures.on("wheel", (wheelEventState) => {
  const {
    isStart,
    isEnding,
    axisDelta: [deltaX, deltaY, deltaZ],
    ...moreData
  } = wheelEventState
  
  // use the data...
  console.log(deltaX, deltaY, deltaZ)
})
`

export const offWheelCallbackExample = `
wheelGestures.on("wheel", callback)
wheelGestures.off("wheel", callback)

// alternative:
const off = wheelGestures.on("wheel", callback)
off()
`
