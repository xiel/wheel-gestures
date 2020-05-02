import { addVectors, average } from '../utils'
import { clampDelta, normalizeWheel, reverseSign } from '../wheel-normalizer/wheel-normalizer'
import { createWheelAnalyzerState } from './state'
import {
  PhaseData,
  PreventWheelActionType,
  ReverseSign,
  ScrollPoint,
  SubscribeFn,
  Unobserve,
  Unsubscribe,
  VectorXYZ,
  WheelEventData,
  WheelPhase,
} from './wheel-analyzer-types'

const isDev = process.env.NODE_ENV !== 'production'
const SOON_ENDING_THRESHOLD = 1.4
const ACC_FACTOR_MIN = 0.6
const ACC_FACTOR_MAX = 0.96
const WHEELEVENTS_TO_MERGE = 2
const WHEELEVENTS_TO_ANALAZE = 5
const SOON_ENDING_WHEEL_COUNT = 3
const reverseSignDefault: ReverseSign = [true, true, false]

export interface Options {
  preventWheelAction: PreventWheelActionType
  reverseSign: ReverseSign
}

export function WheelAnalyzer(optionsParam: Partial<Options> = {}) {
  let options: Options
  let state = createWheelAnalyzerState()
  let subscriptions: SubscribeFn[] = []
  let targets: EventTarget[] = []
  let currentEvent: WheelEventData

  const observe = (target: EventTarget): Unobserve => {
    target.addEventListener('wheel', feedWheel as EventListener, { passive: false })
    targets.push(target)

    return () => unobserve(target)
  }

  const unobserve = (target: EventTarget) => {
    target.removeEventListener('wheel', feedWheel as EventListener)
    targets = targets.filter((t) => t !== target)
  }

  // stops watching all of its target elements for visibility changes.
  const disconnect = () => {
    targets.forEach(unobserve)
  }

  const subscribe = (callback: SubscribeFn): Unsubscribe => {
    subscriptions.push(callback)
    // return bound unsubscribe
    return () => unsubscribe(callback)
  }

  const unsubscribe = (callback: SubscribeFn) => {
    if (!callback) {
      if (isDev) throw new Error('please pass the callback used to subscribe')
      return
    }
    subscriptions = subscriptions.filter((s) => s !== callback)
  }

  const publish = (type: WheelPhase, additionalData?: Partial<PhaseData>) => {
    const data: PhaseData = {
      type,
      isEndingSoon: willEndSoon(),
      isMomentum: state.isMomentum,
      axisMovement: state.axisMovement,
      axisVelocity: state.axisVelocity,
      axisDelta: [0, 0, 0],
      event: currentEvent,
      ...additionalData,
    }
    subscriptions.forEach((fn) => fn(type, data))
  }

  const feedWheel = (wheelEvents: WheelEventData | WheelEventData[]) => {
    if (Array.isArray(wheelEvents)) {
      wheelEvents.forEach((wheelEvent) => processWheelEventData(wheelEvent))
    } else {
      processWheelEventData(wheelEvents)
    }
  }

  const updateOptions = (newOptions: Partial<Options> = {}): Options => {
    const { preventWheelAction = 'all', reverseSign = reverseSignDefault, ...otherOptions } = newOptions
    options = { preventWheelAction, reverseSign, ...otherOptions }
    return options
  }

  const shouldPreventDefault = (e: WheelEventData) => {
    const { preventWheelAction } = options
    const { deltaX, deltaY } = e

    switch (preventWheelAction) {
      case 'all':
        return true
      case 'x':
        return Math.abs(deltaX) >= Math.abs(deltaY)
      case 'y':
        return Math.abs(deltaY) >= Math.abs(deltaX)
    }

    isDev && console.warn('unsupported preventWheelAction value: ' + preventWheelAction, 'warn')
  }

  const processWheelEventData = (wheelEvent: WheelEventData) => {
    const { axisDelta } = clampDelta(reverseSign(normalizeWheel(wheelEvent), options.reverseSign))
    const [deltaX, deltaY] = axisDelta // TODO: deltaZ

    if (
      wheelEvent.deltaMode === 0 &&
      (Math.abs(deltaX) != Math.abs(wheelEvent.deltaX) || Math.abs(deltaY) != Math.abs(wheelEvent.deltaY))
    ) {
      console.log(axisDelta, [wheelEvent.deltaX, wheelEvent.deltaY], wheelEvent)
    }

    if (wheelEvent.preventDefault && shouldPreventDefault(wheelEvent)) {
      wheelEvent.preventDefault()
    }

    if (!state.isStarted) {
      start()
    }

    // TODO: deltaZ
    // TODO: would be better done on averaged deltas !
    const currentDelta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX
    const currentAbsDelta = Math.abs(currentDelta)

    if (state.isMomentum && currentAbsDelta > state.lastAbsDelta) {
      end()
      start()
    }

    currentEvent = wheelEvent

    // TODO: clampDelta like reverseSign
    state.axisMovement = addVectors(state.axisMovement, axisDelta)
    state.lastAbsDelta = currentAbsDelta

    state.scrollPointsToMerge.push({
      currentAbsDelta: currentAbsDelta,
      // TODO: there is no unclampt anymore
      axisDeltaUnclampt: axisDelta,
      timestamp: wheelEvent.timeStamp,
    })

    if (state.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE) {
      const { scrollPointsToMerge } = state
      const mergedScrollPoint: ScrollPoint = {
        currentAbsDelta: average(scrollPointsToMerge.map((b) => b.currentAbsDelta)),
        axisDeltaUnclampt: scrollPointsToMerge.map((b) => b.axisDeltaUnclampt).reduce(addVectors),
        timestamp: average(scrollPointsToMerge.map((b) => b.timestamp)),
      }

      state.scrollPoints.push(mergedScrollPoint)

      // only update velocity after a merged scrollpoint was generated
      updateVelocity()

      if (!state.isMomentum) {
        detectMomentum()
      }

      // reset merge array
      state.scrollPointsToMerge = []
    }

    if (!state.scrollPoints.length) {
      updateStartVelocity()
    }

    // publish start after velocity etc. have been updated
    if (!state.isStartPublished) {
      publish(WheelPhase.ANY_WHEEL_START)
      publish(WheelPhase.WHEEL_START)
      state.isStartPublished = true
    }

    // only wheel event (move) and not start/end get the delta values
    publish(WheelPhase.ANY_WHEEL, { axisDelta })
    publish(state.isMomentum ? WheelPhase.MOMENTUM_WHEEL : WheelPhase.WHEEL, { axisDelta })

    // calc debounced end function, to recognize end of wheel event stream
    willEnd()
  }

  const updateStartVelocity = () => {
    const latestScrollPoint = state.scrollPointsToMerge[state.scrollPointsToMerge.length - 1]
    state.axisVelocity = latestScrollPoint.axisDeltaUnclampt.map((d) => d / state.willEndTimeout) as VectorXYZ
  }

  const updateVelocity = () => {
    // need to have two recent points to calc velocity
    const [pA, pB] = state.scrollPoints.slice(-2)

    if (!pA || !pB) {
      return
    }

    // time delta
    const deltaTime = pB.timestamp - pA.timestamp

    if (deltaTime <= 0) {
      isDev && console.warn('invalid deltaTime')
      return
    }

    // calc the velocity per axes
    const velocity = pB.axisDeltaUnclampt.map((d) => d / deltaTime) as VectorXYZ

    // calc the acceleration factor per axis
    const accelerationFactor = velocity.map((v, i) => {
      return v / (state.axisVelocity[i] || 1)
    })

    state.axisVelocity = velocity
    state.accelerationFactors.push(accelerationFactor)
    updateWillEndTimeout(deltaTime)
  }

  const updateWillEndTimeout = (deltaTime: number) => {
    // use current time between events rounded up and increased by a bit as timeout
    let newTimeout = Math.ceil(deltaTime / 10) * 10 * 1.2

    // double the timeout, when momentum was not detected yet
    if (!state.isMomentum) {
      newTimeout = Math.max(100, newTimeout * 2)
    }

    state.willEndTimeout = Math.min(1000, Math.round(newTimeout))
  }

  const accelerationFactorInMomentumRange = (accFactor: number) => {
    // when main axis is the the other one and there is no movement/change on the current one
    if (accFactor === 0) return true
    return accFactor <= ACC_FACTOR_MAX && accFactor >= ACC_FACTOR_MIN
  }

  const detectMomentum = () => {
    if (state.accelerationFactors.length < WHEELEVENTS_TO_ANALAZE) {
      return state.isMomentum
    }

    const recentAccelerationFactors = state.accelerationFactors.slice(WHEELEVENTS_TO_ANALAZE * -1)

    // check recent acceleration / deceleration factors
    const detectedMomentum = recentAccelerationFactors.reduce((mightBeMomentum, accFac) => {
      // all recent need to match, if any did not match -> short circuit
      if (!mightBeMomentum) return false
      // when both axis decelerate exactly in the same rate it is very likely caused by momentum
      const sameAccFac = !!accFac.reduce((f1, f2) => (f1 && f1 < 1 && f1 === f2 ? 1 : 0))
      // check if acceleration factor is within momentum range
      const bothAreInRangeOrZero = accFac.filter(accelerationFactorInMomentumRange).length === accFac.length
      // one the requirements must be fulfilled
      return sameAccFac || bothAreInRangeOrZero
    }, true)

    // only keep the most recent events
    state.accelerationFactors = recentAccelerationFactors

    if (detectedMomentum && !state.isMomentum) {
      publish(WheelPhase.WHEEL_END)
      state.isMomentum = true
      publish(WheelPhase.MOMENTUM_WHEEL_START)
    }

    return state.isMomentum
  }

  const start = () => {
    state = createWheelAnalyzerState()
    state.isStarted = true
    state.startTime = Date.now()
  }

  const willEnd = (() => {
    let willEndId: NodeJS.Timeout
    return () => {
      clearTimeout(willEndId)
      willEndId = setTimeout(end, state.willEndTimeout)
    }
  })()

  const end = () => {
    if (!state.isStarted) return

    if (state.isMomentum) {
      if (!willEndSoon()) {
        publish(WheelPhase.MOMENTUM_WHEEL_CANCEL)
      } else {
        publish(WheelPhase.MOMENTUM_WHEEL_END)
      }
    } else {
      // in case of momentum, this event was already triggered when the momentum was detected so we do not trigger it here
      publish(WheelPhase.WHEEL_END)
    }

    publish(WheelPhase.ANY_WHEEL_END)

    state.isMomentum = false
    state.isStarted = false
  }

  const willEndSoon = () => {
    const absDeltas = state.scrollPoints
      .slice(SOON_ENDING_WHEEL_COUNT * -1)
      .map(({ currentAbsDelta }) => currentAbsDelta)

    const absDeltaAverage = absDeltas.reduce((a, b) => a + b, 0) / absDeltas.length
    return absDeltaAverage <= SOON_ENDING_THRESHOLD
  }

  updateOptions(optionsParam)

  return Object.freeze({
    observe,
    unobserve,
    disconnect,
    subscribe,
    unsubscribe,
    feedWheel,
    updateOptions,
  })
}
