import {
  Axis,
  DeltaProp,
  PreventWheelActionType,
  ScrollPoint,
  SubscribeFn,
  Unobserve,
  Unsubscribe,
  WheelEventData,
  WheelPhase,
} from './wheel-analyzer.types'
import { normalizeWheel } from './normalizer/wheel-normalizer'

const WHEELEVENTS_TO_MERGE = 2
const WHEELEVENTS_TO_ANALAZE = 5

const SOON_ENDING_WHEEL_COUNT = 3
const SOON_ENDING_THRESHOLD = 1.4

const ACC_FACTOR_MIN = 0.6
const ACC_FACTOR_MAX = 0.96
const DELTA_MAX_ABS = 150

// the initial timeout period is pretty long, so even old mouses, which emit wheel events less often, can produce a continuous gesture
// the timeout is automatically adjusted during a gesture
const WILL_END_TIMEOUT_DEFAULT = 400

const axes: [Axis, Axis] = ['x', 'y']
const deltaProp: Record<Axis, DeltaProp> = {
  x: 'deltaX',
  y: 'deltaY',
}

export interface Options {
  preventWheelAction: PreventWheelActionType
  isDebug?: boolean
}

const defaults: Options = {
  preventWheelAction: 'all',
  isDebug: process.env.NODE_ENV === 'development',
}

export class WheelAnalyzer {
  private isStarted = false
  private isStartPublished = false
  private isMomentum = false
  private lastAbsDelta = Infinity
  private axisDeltas: number[] = [0, 0]
  private axisVelocity: number[] = [0, 0]
  private accelerationFactors: number[][] = []
  private deltaVelocity = 0 // px per second
  private deltaTotal = 0 // moved during this scroll interaction

  private scrollPoints: ScrollPoint[] = []
  private scrollPointsToMerge: ScrollPoint[] = []

  private subscriptions: SubscribeFn[] = []
  private targets: EventTarget[] = []

  private options: Options
  private willEndTimeout = WILL_END_TIMEOUT_DEFAULT

  private willEnd = (() => {
    let willEndId = setTimeout(() => {}, this.willEndTimeout)
    return () => {
      clearTimeout(willEndId)
      willEndId = setTimeout(this.end, this.willEndTimeout)
    }
  })()

  public constructor(options: Partial<Options> = {}) {
    // merge passed options with defaults (filter undefined option values)
    this.options = Object.entries(options)
      .filter(([, value]) => value !== undefined)
      .reduce((o, [key, value]) => Object.assign(o, { [key]: value }), { ...defaults })
  }

  public observe = (target: EventTarget): Unobserve => {
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

  public feedWheel = (wheelEvents: WheelEventData | WheelEventData[]) => {
    if (!wheelEvents) return

    if (Array.isArray(wheelEvents)) {
      wheelEvents.forEach((wheelEvent) => this.processWheelEventData(wheelEvent))
    } else {
      this.processWheelEventData(wheelEvents)
    }
  }

  private publish = (phase: WheelPhase, data = this.getCurrentState(phase)) => {
    this.subscriptions.forEach((fn) => fn(phase, data))
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

    this.debugMessage('unsupported preventWheelAction value: ' + preventWheelAction, 'warn')
  }

  private clampDelta(delta: number) {
    return Math.min(DELTA_MAX_ABS, Math.max(-DELTA_MAX_ABS, delta))
  }

  private processWheelEventData(wheelEvent: WheelEventData) {
    const normalizedWheel = normalizeWheel(wheelEvent)

    if (wheelEvent.preventDefault && this.shouldPreventDefault(wheelEvent)) {
      wheelEvent.preventDefault()
    }

    if (!this.isStarted) {
      this.start()
    }

    const currentDelta = this.clampDelta(
      Math.abs(normalizedWheel.deltaY) > Math.abs(normalizedWheel.deltaX)
        ? normalizedWheel.deltaY
        : normalizedWheel.deltaX
    )
    const currentAbsDelta = Math.abs(currentDelta)

    if (this.isMomentum && currentAbsDelta > this.lastAbsDelta) {
      this.end()
      this.start()
    }

    this.axisDeltas = this.axisDeltas.map(
      (prevDelta, i) => prevDelta + this.clampDelta(normalizedWheel[deltaProp[axes[i]]])
    )
    this.deltaTotal = this.deltaTotal + currentDelta
    this.lastAbsDelta = currentAbsDelta

    this.scrollPointsToMerge.push({
      currentDelta: currentDelta,
      currentAbsDelta: currentAbsDelta,
      axisDeltaUnclampt: [normalizedWheel.deltaX, normalizedWheel.deltaY],
      timestamp: wheelEvent.timeStamp || Date.now(),
    })

    if (this.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE) {
      const mergedScrollPoint: ScrollPoint = {
        currentDelta: this.scrollPointsToMerge.reduce((sum, b) => sum + b.currentDelta, 0) / WHEELEVENTS_TO_MERGE,
        currentAbsDelta: this.scrollPointsToMerge.reduce((sum, b) => sum + b.currentAbsDelta, 0) / WHEELEVENTS_TO_MERGE,
        axisDeltaUnclampt: this.scrollPointsToMerge.reduce(
          ([sumX, sumY], { axisDeltaUnclampt: [x, y] }) => [sumX + x, sumY + y],
          [0, 0]
        ),
        //.map((sum) => sum / WHEELEVENTS_TO_MERGE),
        timestamp: this.scrollPointsToMerge.reduce((sum, b) => sum + b.timestamp, 0) / WHEELEVENTS_TO_MERGE,
      }

      this.scrollPoints.push(mergedScrollPoint)

      // only update velocity after a merged scrollpoint was generated
      this.updateVelocity()

      if (!this.isMomentum) {
        this.detectMomentum()
      }

      // reset merge array
      this.scrollPointsToMerge = []
    }

    if (!this.scrollPoints.length) {
      this.updateStartVelocity()
    }

    // publish start after all data points have been updated
    // TODO: check momentum afterwards
    if (!this.isStartPublished) {
      this.publish(WheelPhase.ANY_WHEEL_START)
      this.publish(WheelPhase.WHEEL_START)
      this.isStartPublished = true
    }

    this.publish(WheelPhase.ANY_WHEEL)
    this.publish(this.isMomentum ? WheelPhase.MOMENTUM_WHEEL : WheelPhase.WHEEL)

    // calc debounced end function, to recognize end of wheel event stream
    this.willEnd()
  }

  private debugMessage(msg: string, level: keyof Console = 'log') {
    if (!this.options.isDebug) return
    console[level](msg)
  }

  private updateStartVelocity() {
    const latestScrollPoint = this.scrollPointsToMerge[this.scrollPointsToMerge.length - 1]
    this.axisVelocity = latestScrollPoint.axisDeltaUnclampt.map((d) => d / WILL_END_TIMEOUT_DEFAULT)
  }

  private updateVelocity() {
    // need to have two recent points to calc velocity
    const [pA, pB] = this.scrollPoints.slice(-2)

    if (!pA || !pB) {
      return
    }

    // time delta
    const deltaTime = pB.timestamp - pA.timestamp

    if (deltaTime <= 0) {
      this.debugMessage('invalid deltaTime')
      return
    }

    // calc the velocity per axes
    const velocity = pB.axisDeltaUnclampt.map((d) => d / deltaTime)

    // calc the acceleration factor per axis
    const accelerationFactor = velocity.map((v, i) => {
      return v / (this.axisVelocity[i] || 1)
    })

    this.axisVelocity = velocity
    this.accelerationFactors.push(accelerationFactor)
    this.updateWillEndTimeout(deltaTime)
  }

  private updateWillEndTimeout(deltaTime: number) {
    // use current time between events rounded up and increased by a bit as timeout
    let newTimeout = Math.ceil(deltaTime / 10) * 10 * 1.2

    // double the timeout, when momentum was not detected yet
    if (!this.isMomentum) {
      newTimeout = Math.max(100, newTimeout * 2)
    }

    this.willEndTimeout = Math.min(1000, Math.round(newTimeout))
  }

  private static accelerationFactorInMomentumRange(accFactor: number) {
    // when main axis is the the other one and there is no movement/change on the current one
    if (accFactor === 0) return true
    return accFactor <= ACC_FACTOR_MAX && accFactor >= ACC_FACTOR_MIN
  }

  private detectMomentum() {
    if (this.accelerationFactors.length < WHEELEVENTS_TO_ANALAZE) {
      return this.isMomentum
    }

    const recentAccelerationFactors = this.accelerationFactors.slice(WHEELEVENTS_TO_ANALAZE * -1)

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
    this.accelerationFactors = recentAccelerationFactors

    if (detectedMomentum && !this.isMomentum) {
      this.publish(WheelPhase.WHEEL_END)
      this.isMomentum = true
      this.publish(WheelPhase.MOMENTUM_WHEEL_START)
    }

    return this.isMomentum
  }

  private getDebugState(): Partial<WheelAnalyzer> {
    const { ...props } = this
    return props
  }

  public getCurrentState(type: WheelPhase) {
    const debugData = this.options.isDebug ? this.getDebugState() : null
    return {
      type,
      debugData,
      willEndSoon: this.willEndSoon,
      isMomentum: this.isMomentum,
      deltaVelocity: this.deltaVelocity,
      deltaTotal: this.deltaTotal,
      axisDeltas: this.axisDeltas,
      axisVelocity: this.axisVelocity,
    }
  }

  private start() {
    this.isStarted = true
    this.isStartPublished = false
    this.isMomentum = false
    this.lastAbsDelta = Infinity
    this.axisDeltas = [0, 0]
    this.axisVelocity = [0, 0]
    this.deltaVelocity = 0
    this.deltaTotal = 0
    this.scrollPointsToMerge = []
    this.scrollPoints = []
    this.accelerationFactors = []
    this.willEndTimeout = WILL_END_TIMEOUT_DEFAULT
  }

  private end = () => {
    if (!this.isStarted) return

    if (this.isMomentum) {
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

    this.isMomentum = false
    this.isStarted = false
  }

  private get willEndSoon() {
    const absDeltas = this.scrollPoints
      .slice(SOON_ENDING_WHEEL_COUNT * -1)
      .map(({ currentAbsDelta }) => currentAbsDelta)
    const absDeltaAverage = absDeltas.reduce((a, b) => a + b, 0) / absDeltas.length
    return absDeltaAverage <= SOON_ENDING_THRESHOLD
  }
}
