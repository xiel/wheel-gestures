import { debounce } from 'throttle-debounce'

const WHEELEVENTS_TO_MERGE = 2
const WHEELEVENTS_TO_ANALAZE = 3

interface ScrollPoint {
  currentDelta: number
  currentAbsDelta: number
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

export type PhaseData = ReturnType<typeof WheelAnalyzer.prototype.getCurrentState>
export type SubscribeFn = (type: WheelPhase, data: PhaseData) => void
type DeltaProp = 'deltaX' | 'deltaY'
type Axis = 'x' | 'y'

const axes: [Axis, Axis] = ['x', 'y']
const deltaProp: Record<Axis, DeltaProp> = {
  x: 'deltaX',
  y: 'deltaY',
}

interface Options {
  allowsAxis: Axis[]
  isDebug?: boolean
}

const defaults: Options = {
  allowsAxis: ['x', 'y'],
  isDebug: process.env.NODE_ENV === 'development',
}

export class WheelAnalyzer {
  private isScrolling = false
  private isMomentum = false
  private willEndSoon = false

  private lastAbsDelta = Infinity
  private axisDeltas: number[] = [0, 0]
  private deltaVelocity = 0 // px per second
  private deltaTotal = 0 // moved during this scroll interaction
  private scrollPoints: ScrollPoint[] = []
  private scrollPointsToMerge: ScrollPoint[] = []
  private overallDecreasing: boolean[] = []

  private subscriptions: SubscribeFn[] = []
  private targets: EventTarget[] = []

  private options: Options
  private readonly debouncedEndScroll: any

  constructor(options?: Partial<Options>) {
    this.debouncedEndScroll = debounce(50, this.endScroll)
    this.options = Object.assign(defaults, options)
  }

  // TODO: improve with wheelIntent
  public observe = (target: EventTarget) => {
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

  private publish = (phase: WheelPhase, data = this.getCurrentState(phase)) => {
    this.subscriptions.forEach((fn) => fn(phase, data))
  }

  public subscribe = (callback: SubscribeFn) => {
    this.subscriptions.push(callback)
    // return bound unsubscribe
    return this.unsubscribe.bind(this, callback)
  }

  public unsubscribe = (callback: SubscribeFn) => {
    if (!callback) {
      return console.warn('need to provide callback used to subscribe')
    }
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

  private processWheelEventData(e: WheelEventData) {
    if (e.deltaMode !== 0) {
      if (this.options.isDebug) {
        console.warn('deltaMode is not 0')
      }
      return
    }

    // TODO: only prevent when wheel event was in allowed dir (keep preventing for current series tho)
    if (e.preventDefault) {
      e.preventDefault()
    }

    if (!this.isScrolling) {
      this.beginScroll()
    }

    this.debouncedEndScroll(e)

    const currentDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    const currentAbsDelta = Math.abs(currentDelta)

    // TODO: added this.isMomentum here recently
    if (this.isMomentum && currentAbsDelta > this.lastAbsDelta) {
      console.log('larger abs delte, restart scroll!')
      this.endScroll()
      this.beginScroll()
    }

    this.axisDeltas = this.axisDeltas.map((delta, i) => delta + e[deltaProp[axes[i]]])
    this.deltaTotal = this.deltaTotal + currentDelta
    this.lastAbsDelta = currentAbsDelta

    this.scrollPointsToMerge.push({
      currentDelta: currentDelta,
      currentAbsDelta: currentAbsDelta,
      timestamp: e.timeStamp || Date.now(),
    })

    if (this.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE) {
      this.scrollPoints.push({
        currentDelta: Math.round(
          this.scrollPointsToMerge.reduce(function(a, b) {
            return a + b.currentDelta
          }, 0) / WHEELEVENTS_TO_MERGE
        ),
        currentAbsDelta: Math.round(
          this.scrollPointsToMerge.reduce(function(a, b) {
            return a + b.currentAbsDelta
          }, 0) / WHEELEVENTS_TO_MERGE
        ),
        timestamp: Math.round(
          this.scrollPointsToMerge.reduce(function(a, b) {
            return a + b.timestamp
          }, 0) / WHEELEVENTS_TO_MERGE
        ),
      })

      // reset merge array
      this.scrollPointsToMerge.length = 0
    }

    this.publish(WheelPhase.ANY_WHEEL)
    this.publish(this.isMomentum ? WheelPhase.MOMENTUM_WHEEL : WheelPhase.WHEEL)

    if (this.scrollPoints.length > WHEELEVENTS_TO_ANALAZE) {
      this.updateVelocity()

      // check if momentum can be recognized
      if (!this.isMomentum && this.checkForMomentum()) {
        console.log('MOMENTUM!')
        this.publish(WheelPhase.WHEEL_END)
        this.publish(WheelPhase.MOMENTUM_WHEEL_START)
      } else if (this.isMomentum) {
        this.checkForEnding()
      }
    }
  }

  getDebugState() {
    const { scrollPointsToMerge, scrollPoints } = this
    return { scrollPointsToMerge, scrollPoints }
  }

  getCurrentState(type: WheelPhase) {
    const debugData = this.options.isDebug ? this.getDebugState() : null
    return {
      type,
      debugData,
      willEndSoon: this.willEndSoon,
      isScrolling: this.isScrolling,
      isMomentum: this.isMomentum,
      deltaVelocity: this.deltaVelocity,
      deltaTotal: this.deltaTotal,
      axisDeltas: this.axisDeltas,
    }
  }

  beginScroll() {
    this.willEndSoon = false
    this.isScrolling = true
    this.isMomentum = false
    this.lastAbsDelta = Infinity
    this.axisDeltas = [0, 0]
    this.deltaVelocity = 0
    this.deltaTotal = 0
    this.scrollPoints = []
    this.overallDecreasing.length = 0
    this.scrollPointsToMerge.length = 0

    this.publish(WheelPhase.ANY_WHEEL_START)
    this.publish(WheelPhase.WHEEL_START)
  }

  private endScroll() {
    this.isScrolling = false

    if (this.isMomentum) {
      if (!this.willEndSoon) {
        this.publish(WheelPhase.MOMENTUM_WHEEL_CANCEL)
      } else {
        this.publish(WheelPhase.MOMENTUM_WHEEL_END)
      }
      this.isMomentum = false
    } else {
      // in case of momentum, this event was triggered when the momentum was detected
      this.publish(WheelPhase.WHEEL_END)
    }

    this.publish(WheelPhase.ANY_WHEEL_END)
  }

  updateVelocity() {
    const scrollPointsToAnalyze = this.scrollPoints.slice(WHEELEVENTS_TO_ANALAZE * -1)

    const totalDelta = scrollPointsToAnalyze.reduce(function(a, b) {
      return a + b.currentDelta
    }, 0)

    const timePassedInInterval = Math.abs(
      scrollPointsToAnalyze[scrollPointsToAnalyze.length - 1].timestamp - scrollPointsToAnalyze[0].timestamp
    )
    const currentVelocity = (totalDelta / (timePassedInInterval || 1)) * 1000

    this.deltaVelocity = this.deltaVelocity ? currentVelocity * 0.8 + this.deltaVelocity * 0.2 : currentVelocity
  }

  checkForMomentum() {
    if (this.isMomentum) {
      return this.isMomentum
    }

    // get the latest WHEELEVENTS_TO_ANALAZE
    const scrollPointsToAnalize = this.scrollPoints.slice(WHEELEVENTS_TO_ANALAZE * -1)
    const scrollPointsToAnalizeAbsDeltas = scrollPointsToAnalize.map(function(scrollPoint) {
      return scrollPoint.currentAbsDelta
    })

    if (scrollPointsToAnalize.length < WHEELEVENTS_TO_ANALAZE) {
      return console.error('not enough points.')
    }

    // check if delta is all decreasing
    const absDeltasMin = Math.min.apply(null, scrollPointsToAnalizeAbsDeltas)
    const absDeltasMax = Math.max.apply(null, scrollPointsToAnalizeAbsDeltas)
    const isOverallDecreasing =
      absDeltasMin < absDeltasMax &&
      absDeltasMin === scrollPointsToAnalizeAbsDeltas[scrollPointsToAnalizeAbsDeltas.length - 1]

    this.overallDecreasing.push(isOverallDecreasing)

    if (this.checkDecreases()) {
      this.isMomentum = true
    }

    return this.isMomentum
  }

  checkForEnding() {
    const scrollPointsToAnalize = this.scrollPoints.slice(WHEELEVENTS_TO_ANALAZE * -1)
    const scrollPointsToAnalizeAbsDeltas = scrollPointsToAnalize.map(function(scrollPoint) {
      return scrollPoint.currentAbsDelta
    })
    const absDeltaAvrg =
      scrollPointsToAnalizeAbsDeltas.reduce(function(a, b) {
        return a + b
      }) / scrollPointsToAnalizeAbsDeltas.length

    if (absDeltaAvrg <= 1.34) {
      this.willEndSoon = true
    }

    return this.willEndSoon
  }

  checkDecreases() {
    const decreaseBooleansToCheck = this.overallDecreasing.slice(-3)

    if (decreaseBooleansToCheck.length < 3) {
      return false
    }
    return decreaseBooleansToCheck.reduce(function(a, b) {
      return a && b
    })
  }
}
