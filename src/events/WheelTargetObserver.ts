import { WheelEventData } from '../types'
import { deepFreeze } from '../utils'

export type Unobserve = () => void

export function WheelTargetObserver(eventListener: (wheelEvent: WheelEventData) => void) {
  let targets: EventTarget[] = []

  /**
   * add event listener from target element
   * @param target
   */
  const observe = (target: EventTarget): Unobserve => {
    target.addEventListener('wheel', eventListener as EventListener, { passive: false })
    targets.push(target)

    return () => unobserve(target)
  }

  /**
   * remove event listener from target element
   * @param target
   */
  const unobserve = (target: EventTarget) => {
    target.removeEventListener('wheel', eventListener as EventListener)
    targets = targets.filter((t) => t !== target)
  }

  // stops watching all of its target elements for visibility changes.
  const disconnect = () => {
    targets.forEach(unobserve)
  }

  return deepFreeze({
    observe,
    unobserve,
    disconnect,
  })
}
