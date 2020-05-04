import EventBus from '../events/EventBus'
import { absMax, addVectors, average, lastOf } from '../utils'
import { clampAxisDelta, normalizeWheel, reverseAxisDeltaSign } from '../wheel-normalizer/wheel-normalizer'
import { createWheelAnalyzerState } from './state'
import {
  MergedScrollPoint,
  PreventWheelActionType,
  ReverseSign,
  Unobserve,
  VectorXYZ,
  WheelEventData,
  WheelGesturesEventMap,
  WheelGestureState,
} from './wheel-analyzer-types'

const isDev = process.env.NODE_ENV !== 'production'
const ACC_FACTOR_MIN = 0.6
const ACC_FACTOR_MAX = 0.96
const WHEELEVENTS_TO_MERGE = 2
const WHEELEVENTS_TO_ANALAZE = 5
const reverseSignDefault: ReverseSign = [true, true, false]

export type TWheelAnalyzer = ReturnType<typeof WheelAnalyzer>

export interface Options {
  preventWheelAction: PreventWheelActionType
  reverseSign: ReverseSign
}

export function WheelAnalyzer(optionsParam: Partial<Options> = {}) {
  const { on, off, dispatch } = EventBus<WheelGesturesEventMap>()
  let options: Options
  let state = createWheelAnalyzerState()
  let targets: EventTarget[] = []
  let currentEvent: WheelEventData
  let negativeZeroFingerUpSpecialEvent = false

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

  const publishWheel = (additionalData?: Partial<WheelGestureState>) => {
    const data: WheelGestureState = {
      isStart: false,
      isEnding: false,
      isMomentumCancel: false,
      isMomentum: state.isMomentum,
      axisMovement: state.axisMovement,
      axisVelocity: state.axisVelocity,
      axisDelta: [0, 0, 0],
      event: currentEvent,
      ...additionalData,
    }
    dispatch('wheel', data)
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
    const { axisDelta, timeStamp } = clampAxisDelta(
      reverseAxisDeltaSign(normalizeWheel(wheelEvent), options.reverseSign)
    )
    const deltaMaxAbs = absMax(axisDelta)

    if (wheelEvent.preventDefault && shouldPreventDefault(wheelEvent)) {
      wheelEvent.preventDefault()
    }

    if (!state.isStarted) {
      start()
    }
    // check if user started scrolling again -> cancel
    else if (state.isMomentum && deltaMaxAbs > Math.max(2, state.lastAbsDelta * 2)) {
      end(true)
      start()
    }

    // special finger up event on windows + blink
    if (deltaMaxAbs === 0 && Object.is && Object.is(wheelEvent.deltaX, -0)) {
      negativeZeroFingerUpSpecialEvent = true
      // return -> zero delta event should not influence velocity
      return
    }

    currentEvent = wheelEvent
    state.axisMovement = addVectors(state.axisMovement, axisDelta)
    state.lastAbsDelta = deltaMaxAbs
    state.scrollPointsToMerge.push({
      deltaMaxAbs,
      axisDelta,
      timeStamp,
    })

    if (state.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE) {
      const { scrollPointsToMerge } = state
      const mergedScrollPoint: MergedScrollPoint = {
        deltaMaxAbsAverage: average(scrollPointsToMerge.map((b) => b.deltaMaxAbs)),
        axisDeltaSum: scrollPointsToMerge.map((b) => b.axisDelta).reduce(addVectors),
        timeStamp: average(scrollPointsToMerge.map((b) => b.timeStamp)),
      }

      // TODO: remove scroll points
      state.scrollPoints.push(mergedScrollPoint)

      // only update velocity after a merged scrollpoint was generated
      updateVelocity()

      // reset merge array
      state.scrollPointsToMerge = []

      if (!state.isMomentum) {
        detectMomentum()
      }
    }

    if (!state.scrollPoints.length) {
      updateStartVelocity()
    }

    // only wheel event (move) and not start/end get the delta values
    publishWheel({ axisDelta, isStart: !state.isStartPublished }) // state.isMomentum ? MOMENTUM_WHEEL : WHEEL, { axisDelta })

    // publish start after velocity etc. have been updated
    state.isStartPublished = true

    // calc debounced end function, to recognize end of wheel event stream
    willEnd()
  }

  const updateStartVelocity = () => {
    state.axisVelocity = lastOf(state.scrollPointsToMerge).axisDelta.map((d) => d / state.willEndTimeout) as VectorXYZ
  }

  const updateVelocity = () => {
    // need to have two recent points to calc velocity
    const [pA, pB] = state.scrollPoints.slice(-2)

    if (!pA || !pB) {
      return
    }

    // time delta
    const deltaTime = pB.timeStamp - pA.timeStamp

    if (deltaTime <= 0) {
      isDev && console.warn('invalid deltaTime')
      return
    }

    // calc the velocity per axes
    const velocity = pB.axisDeltaSum.map((d) => d / deltaTime) as VectorXYZ

    // calc the acceleration factor per axis
    const accelerationFactor = velocity.map((v, i) => v / (state.axisVelocity[i] || 1))

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
    if (state.accelerationFactors.length >= WHEELEVENTS_TO_ANALAZE) {
      if (negativeZeroFingerUpSpecialEvent) {
        negativeZeroFingerUpSpecialEvent = false

        if (absMax(state.axisVelocity) >= 0.2) {
          recognizedMomentum()
          return
        }
      }

      const recentAccelerationFactors = state.accelerationFactors.slice(WHEELEVENTS_TO_ANALAZE * -1)

      // check recent acceleration / deceleration factors
      const detectedMomentum = recentAccelerationFactors.reduce((mightBeMomentum: boolean, accFac) => {
        // all recent need to match, if any did not match -> short circuit
        if (!mightBeMomentum) return false

        // when both axis decelerate exactly in the same rate it is very likely caused by momentum
        const sameAccFac = !!accFac.reduce((f1, f2) => (f1 && f1 < 1 && f1 === f2 ? 1 : 0))

        // check if acceleration factor is within momentum range
        const bothAreInRangeOrZero = accFac.filter(accelerationFactorInMomentumRange).length === accFac.length

        // one the requirements must be fulfilled
        return sameAccFac || bothAreInRangeOrZero
      }, true)

      if (detectedMomentum) {
        recognizedMomentum()
      }

      // only keep the most recent events
      state.accelerationFactors = recentAccelerationFactors
    }
  }

  const recognizedMomentum = () => {
    state.isMomentum = true
  }

  const start = () => {
    state = createWheelAnalyzerState()
    state.isStarted = true
    state.startTime = Date.now()
    negativeZeroFingerUpSpecialEvent = false
  }

  const willEnd = (() => {
    let willEndId: number
    return () => {
      clearTimeout(willEndId)
      willEndId = setTimeout(end, state.willEndTimeout)
    }
  })()

  const end = (isMomentumCancel = false) => {
    if (!state.isStarted) return
    if (state.isMomentum && isMomentumCancel) {
      publishWheel({ isEnding: true, isMomentumCancel: true })
    } else {
      publishWheel({ isEnding: true })
    }

    state.isMomentum = false
    state.isStarted = false
  }

  updateOptions(optionsParam)

  return Object.freeze({
    on,
    off,
    observe,
    unobserve,
    disconnect,
    feedWheel,
    updateOptions,
  })
}
