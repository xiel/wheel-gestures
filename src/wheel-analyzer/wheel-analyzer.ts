import { average } from '../utils/utils'
import { normalizeWheel } from '../wheel-normalizer/wheel-normalizer'
import { createWheelAnalyzerState } from './state'
import {
  Axis,
  DeltaProp,
  PhaseData,
  PreventWheelActionType,
  ScrollPoint,
  SubscribeFn,
  Unobserve,
  Unsubscribe,
  WheelEventData,
  WheelPhase,
} from './wheel-analyzer-types'

const SOON_ENDING_THRESHOLD = 1.4
const ACC_FACTOR_MIN = 0.6
const ACC_FACTOR_MAX = 0.96
const DELTA_MAX_ABS = 150

const axes: [Axis, Axis] = ['x', 'y']
const deltaProp: Record<Axis, DeltaProp> = {
  x: 'deltaX',
  y: 'deltaY',
}

const isDev = process.env.NODE_ENV !== 'production'
const WHEELEVENTS_TO_MERGE = 2
const WHEELEVENTS_TO_ANALAZE = 5
const SOON_ENDING_WHEEL_COUNT = 3

export interface Options {
  preventWheelAction: PreventWheelActionType
}

const defaults: Options = {
  preventWheelAction: 'all',
}

export class WheelAnalyzer {
  private state = createWheelAnalyzerState()
  private subscriptions: SubscribeFn[] = []
  private targets: EventTarget[] = []
  private readonly options: Options

  public constructor(options: Partial<Options> = {}) {
    // merge passed options with defaults (filter undefined option values)
    this.options = Object.entries(options)
      .filter(([, value]) => value !== undefined)
      .reduce((o, [key, value]) => Object.assign(o, { [key]: value }), { ...defaults })
  }

  public observe = (target: EventTarget): Unobserve => {
    // TODO: need to test if passive supported? might throw error otherwise in older browsers?
    target.addEventListener('wheel', this.feedWheel as EventListener, { passive: false })
    this.targets.push(target)
    return this.unobserve.bind(this, target)
  }

  public unobserve = (target: EventTarget) => {
    target.removeEventListener('wheel', this.feedWheel as EventListener)
    this.targets = this.targets.filter((t) => t !== target)
  }

  // stops watching all of its target elements for visibility changes.
  public disconnect = () => {
    this.targets.forEach(this.unobserve)
  }

  public subscribe = (callback: SubscribeFn): Unsubscribe => {
    this.subscriptions.push(callback)
    // return bound unsubscribe
    return this.unsubscribe.bind(this, callback)
  }

  public unsubscribe = (callback: SubscribeFn) => {
    if (!callback) throw new Error('please pass the callback which was used to subscribe')
    this.subscriptions = this.subscriptions.filter((s) => s !== callback)
  }

  private publish = (type: WheelPhase) => {
    const data: PhaseData = {
      type,
      willEndSoon: this.willEndSoon,
      isMomentum: this.state.isMomentum,
      axisMovement: this.state.axisMovement,
      axisVelocity: this.state.axisVelocity,
    }
    this.subscriptions.forEach((fn) => fn(type, data))
  }

  public feedWheel = (wheelEvents: WheelEventData | WheelEventData[]) => {
    if (Array.isArray(wheelEvents)) {
      wheelEvents.forEach((wheelEvent) => this.processWheelEventData(wheelEvent))
    } else {
      this.processWheelEventData(wheelEvents)
    }
  }

  private shouldPreventDefault(e: WheelEventData) {
    const { preventWheelAction } = this.options
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

  private clampDelta(delta: number) {
    return Math.min(DELTA_MAX_ABS, Math.max(-DELTA_MAX_ABS, delta))
  }

  private processWheelEventData(wheelEvent: WheelEventData) {
    const normalizedWheel = normalizeWheel(wheelEvent)

    if (wheelEvent.preventDefault && this.shouldPreventDefault(wheelEvent)) {
      wheelEvent.preventDefault()
    }

    if (!this.state.isStarted) {
      this.start()
    }

    const currentDelta = this.clampDelta(
      Math.abs(normalizedWheel.deltaY) > Math.abs(normalizedWheel.deltaX)
        ? normalizedWheel.deltaY
        : normalizedWheel.deltaX
    )
    const currentAbsDelta = Math.abs(currentDelta)

    if (this.state.isMomentum && currentAbsDelta > this.state.lastAbsDelta) {
      this.end()
      this.start()
    }

    this.state.axisMovement = this.state.axisMovement.map(
      (prevDelta, i) => prevDelta + this.clampDelta(normalizedWheel[deltaProp[axes[i]]])
    )
    this.state.lastAbsDelta = currentAbsDelta

    this.state.scrollPointsToMerge.push({
      currentAbsDelta: currentAbsDelta,
      axisDeltaUnclampt: [normalizedWheel.deltaX, normalizedWheel.deltaY],
      timestamp: wheelEvent.timeStamp,
    })

    if (this.state.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE) {
      const { scrollPointsToMerge } = this.state
      const mergedScrollPoint: ScrollPoint = {
        currentAbsDelta: average(scrollPointsToMerge.map((b) => b.currentAbsDelta)),
        axisDeltaUnclampt: scrollPointsToMerge.reduce(
          ([sumX, sumY], { axisDeltaUnclampt: [x, y] }) => [sumX + x, sumY + y],
          [0, 0]
        ),
        timestamp: average(scrollPointsToMerge.map((b) => b.timestamp)),
      }

      this.state.scrollPoints.push(mergedScrollPoint)

      // only update velocity after a merged scrollpoint was generated
      this.updateVelocity()

      if (!this.state.isMomentum) {
        this.detectMomentum()
      }

      // reset merge array
      this.state.scrollPointsToMerge = []
    }

    if (!this.state.scrollPoints.length) {
      this.updateStartVelocity()
    }

    // publish start after velocity etc. have been updated
    if (!this.state.isStartPublished) {
      this.publish(WheelPhase.ANY_WHEEL_START)
      this.publish(WheelPhase.WHEEL_START)
      this.state.isStartPublished = true
    }

    this.publish(WheelPhase.ANY_WHEEL)
    this.publish(this.state.isMomentum ? WheelPhase.MOMENTUM_WHEEL : WheelPhase.WHEEL)

    // calc debounced end function, to recognize end of wheel event stream
    this.willEnd()
  }

  private updateStartVelocity() {
    const latestScrollPoint = this.state.scrollPointsToMerge[this.state.scrollPointsToMerge.length - 1]
    this.state.axisVelocity = latestScrollPoint.axisDeltaUnclampt.map((d) => d / this.state.willEndTimeout)
  }

  private updateVelocity() {
    // need to have two recent points to calc velocity
    const [pA, pB] = this.state.scrollPoints.slice(-2)

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
    const velocity = pB.axisDeltaUnclampt.map((d) => d / deltaTime)

    // calc the acceleration factor per axis
    const accelerationFactor = velocity.map((v, i) => {
      return v / (this.state.axisVelocity[i] || 1)
    })

    this.state.axisVelocity = velocity
    this.state.accelerationFactors.push(accelerationFactor)
    this.updateWillEndTimeout(deltaTime)
  }

  private updateWillEndTimeout(deltaTime: number) {
    // use current time between events rounded up and increased by a bit as timeout
    let newTimeout = Math.ceil(deltaTime / 10) * 10 * 1.2

    // double the timeout, when momentum was not detected yet
    if (!this.state.isMomentum) {
      newTimeout = Math.max(100, newTimeout * 2)
    }

    this.state.willEndTimeout = Math.min(1000, Math.round(newTimeout))
  }

  private static accelerationFactorInMomentumRange(accFactor: number) {
    // when main axis is the the other one and there is no movement/change on the current one
    if (accFactor === 0) return true
    return accFactor <= ACC_FACTOR_MAX && accFactor >= ACC_FACTOR_MIN
  }

  private detectMomentum() {
    if (this.state.accelerationFactors.length < WHEELEVENTS_TO_ANALAZE) {
      return this.state.isMomentum
    }

    const recentAccelerationFactors = this.state.accelerationFactors.slice(WHEELEVENTS_TO_ANALAZE * -1)

    // check recent acceleration / deceleration factors
    const detectedMomentum = recentAccelerationFactors.reduce((mightBeMomentum, accFac) => {
      // all recent need to match, if any did not match -> short circuit
      if (!mightBeMomentum) return false
      // when both axis decelerate exactly in the same rate it is very likely caused by momentum
      const sameAccFac = !!accFac.reduce((f1, f2) => (f1 && f1 < 1 && f1 === f2 ? 1 : 0))
      // check if acceleration factor is within momentum range
      const bothAreInRangeOrZero =
        accFac.filter(WheelAnalyzer.accelerationFactorInMomentumRange).length === accFac.length
      // one the requirements must be fulfilled
      return sameAccFac || bothAreInRangeOrZero
    }, true)

    // only keep the most recent events
    this.state.accelerationFactors = recentAccelerationFactors

    if (detectedMomentum && !this.state.isMomentum) {
      this.publish(WheelPhase.WHEEL_END)
      this.state.isMomentum = true
      this.publish(WheelPhase.MOMENTUM_WHEEL_START)
    }

    return this.state.isMomentum
  }

  private start() {
    this.state = createWheelAnalyzerState()
    this.state.isStarted = true
  }

  private willEnd = (() => {
    let willEndId: NodeJS.Timeout
    return () => {
      clearTimeout(willEndId)
      willEndId = setTimeout(this.end, this.state.willEndTimeout)
    }
  })()

  private end = () => {
    if (!this.state.isStarted) return

    if (this.state.isMomentum) {
      if (!this.willEndSoon) {
        this.publish(WheelPhase.MOMENTUM_WHEEL_CANCEL)
      } else {
        this.publish(WheelPhase.MOMENTUM_WHEEL_END)
      }
    } else {
      // in case of momentum, this event was already triggered when the momentum was detected so we do not trigger it here
      this.publish(WheelPhase.WHEEL_END)
    }

    this.publish(WheelPhase.ANY_WHEEL_END)

    this.state.isMomentum = false
    this.state.isStarted = false
  }

  private get willEndSoon() {
    const absDeltas = this.state.scrollPoints
      .slice(SOON_ENDING_WHEEL_COUNT * -1)
      .map(({ currentAbsDelta }) => currentAbsDelta)

    const absDeltaAverage = absDeltas.reduce((a, b) => a + b, 0) / absDeltas.length
    return absDeltaAverage <= SOON_ENDING_THRESHOLD
  }
}
