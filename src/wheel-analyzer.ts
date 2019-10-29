import { debounce } from 'throttle-debounce'

const WHEELEVENTS_TO_MERGE = 2
const WHEELEVENTS_TO_ANALAZE = 5

const SOON_ENDING_WHEEL_COUNT = 3
const SOON_ENDING_THRESHOLD = 1.4

const ACC_FACTOR_MIN = 0.6
const ACC_FACTOR_MAX = 0.96

interface ScrollPoint {
  currentDelta: number
  currentAbsDelta: number
  axisDelta: number[]
  timestamp: number
}

type WheelEventDataRequiredFields = 'deltaMode' | 'deltaX' | 'deltaY'
export interface WheelEventData
  extends Pick<WheelEvent, WheelEventDataRequiredFields>,
    Partial<Omit<WheelEvent, WheelEventDataRequiredFields>> {}

export type WheelTypes = 'WHEEL' | 'ANY_WHEEL' | 'MOMENTUM_WHEEL'

export enum WheelPhase {
  'ANY_WHEEL_START' = 'ANY_WHEEL_START',
  'ANY_WHEEL' = 'ANY_WHEEL',
  'ANY_WHEEL_END' = 'ANY_WHEEL_END',
  'WHEEL_START' = 'WHEEL_START',
  'WHEEL' = 'WHEEL',
  'WHEEL_END' = 'WHEEL_END',
  'MOMENTUM_WHEEL_START' = 'MOMENTUM_WHEEL_START',
  'MOMENTUM_WHEEL' = 'MOMENTUM_WHEEL',
  'MOMENTUM_WHEEL_CANCEL' = 'MOMENTUM_WHEEL_CANCEL',
  'MOMENTUM_WHEEL_END' = 'MOMENTUM_WHEEL_END',
}

const console = window.console

export type PhaseData = ReturnType<typeof WheelAnalyzer.prototype.getCurrentState>
export type SubscribeFn = (type: WheelPhase, data: PhaseData) => void
export type Unsubscribe = () => void
export type Unobserve = () => void
type DeltaProp = 'deltaX' | 'deltaY'
type PreventWheelActionType = 'all' | 'x' | 'y'
type Axis = 'x' | 'y'

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
  private isMomentum = false
  private lastAbsDelta = Infinity
  private axisDeltas: number[] = [0, 0]
  private axisVelocity: number[] = [0, 0]
  private accelerationFactors: number[][] = []
  private deltaVelocity = 0 // px per second
  private deltaTotal = 0 // moved during this scroll interaction

  /**
   * @description merged scrollPoints
   */
  private scrollPoints: ScrollPoint[] = []
  private scrollPointsToMerge: ScrollPoint[] = []

  private subscriptions: SubscribeFn[] = []
  private targets: EventTarget[] = []

  private options: Options
  private readonly willEnd = this.end

  public constructor(options: Partial<Options> = {}) {
    this.willEnd = debounce(99, () => this.end())

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

  private processWheelEventData(e: WheelEventData) {
    if (e.deltaMode !== 0) {
      if (this.options.isDebug) {
        this.debugMessage('deltaMode is not 0')
      }
      return
    }

    if (e.preventDefault && this.shouldPreventDefault(e)) {
      e.preventDefault()
    }

    if (!this.isStarted) {
      this.start()
    }

    const currentDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    const currentAbsDelta = Math.abs(currentDelta)

    if (this.isMomentum && currentAbsDelta > this.lastAbsDelta) {
      this.end()
      this.start()
    }

    this.axisDeltas = this.axisDeltas.map((delta, i) => delta + e[deltaProp[axes[i]]])
    this.deltaTotal = this.deltaTotal + currentDelta
    this.lastAbsDelta = currentAbsDelta

    this.scrollPointsToMerge.push({
      currentDelta: currentDelta,
      currentAbsDelta: currentAbsDelta,
      axisDelta: [e.deltaX, e.deltaY],
      timestamp: e.timeStamp || Date.now(),
    })

    if (this.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE) {
      const mergedScrollPoint = {
        currentDelta: this.scrollPointsToMerge.reduce((sum, b) => sum + b.currentDelta, 0) / WHEELEVENTS_TO_MERGE,
        currentAbsDelta: this.scrollPointsToMerge.reduce((sum, b) => sum + b.currentAbsDelta, 0) / WHEELEVENTS_TO_MERGE,
        axisDelta: this.scrollPointsToMerge
          .reduce(([sumX, sumY], { axisDelta: [x, y] }) => [sumX + x, sumY + y], [0, 0])
          .map((sum) => sum / WHEELEVENTS_TO_MERGE),
        timestamp: this.scrollPointsToMerge.reduce((sum, b) => sum + b.timestamp, 0) / WHEELEVENTS_TO_MERGE,
      }

      this.scrollPoints.push(mergedScrollPoint)

      // only update velo after a merged scrollpoint was generated
      this.updateVelocityNew()

      if (!this.isMomentum) {
        this.detectMomentum()
      }

      // reset merge array
      this.scrollPointsToMerge = []
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

  private updateVelocityNew() {
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
    const velocity = pB.axisDelta.map((d) => d / deltaTime)

    // calc the acceleration factor per axis
    const accelerationFactor = velocity.map((v, i) => {
      return v / (this.axisVelocity[i] || 1)
    })

    this.axisVelocity = velocity
    this.accelerationFactors.push(accelerationFactor)
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
    this.isMomentum = false
    this.lastAbsDelta = Infinity
    this.axisDeltas = [0, 0]
    this.axisVelocity = [0, 0]
    this.deltaVelocity = 0
    this.deltaTotal = 0
    this.scrollPointsToMerge = []
    this.scrollPoints = []
    this.accelerationFactors = []

    this.publish(WheelPhase.ANY_WHEEL_START)
    this.publish(WheelPhase.WHEEL_START)
  }

  private end() {
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
