import { debounce } from 'throttle-debounce'

const WHEELEVENTS_TO_MERGE = 2
const WHEELEVENTS_TO_ANALAZE = 3

interface ScrollPoint {
  currentDelta: number
  currentAbsDelta: number
  timestamp: number
}

export enum WheelPhase {
  'IDLE' = 'IDLE',
  'RECOGNIZED' = 'RECOGNIZED',
  'INTERRUPTED' = 'INTERRUPTED',
  'ENDED' = 'ENDED',
}

type PhaseData = ReturnType<typeof WheelAnalyzer.prototype.getCurrentState>
type SubscribeFn = (type: WheelPhase, data: PhaseData) => void

type Axis = 'x' | 'y'

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
  private isInterrupted = false
  private willEndSoon = false

  private lastAbsDelta = Infinity
  private deltaVelocity = 0 // px per second
  private deltaTotal = 0 // moved during this scroll interaction
  private scrollPoints: ScrollPoint[] = []
  private scrollPointsToMerge: ScrollPoint[] = []
  private overallDecreasing: boolean[] = []

  private subscriptions: SubscribeFn[] = []
  private targets: Element[] = []

  private options: any
  private readonly debouncedEndScroll: any

  constructor(options?: Partial<Options>) {
    this.debouncedEndScroll = debounce(50, this.endScroll)
    this.options = Object.assign(defaults, options)
    console.log(this)
  }

  // TODO: improve with wheelIntent
  public observe = (target: Element) => {
    target.addEventListener('wheel', this.feedWheel, { passive: false })
    this.targets.push(target)
    return this.unobserve.bind(this, target)
  }

  public unobserve = (target: Element) => {
    target.removeEventListener('wheel', this.feedWheel)
    this.targets = this.targets.filter(t => t !== target)
  }

  // stops watching all of its target elements for visibility changes.
  public disconnect = () => {
    this.targets.forEach(this.unobserve)
  }

  private publish: SubscribeFn = (phase, data) => {
    this.subscriptions.forEach(fn => fn(phase, data))
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
    this.subscriptions = this.subscriptions.filter(s => s !== callback)
  }

  public feedWheel = wheelEvents => {
    const that = this

    if (!wheelEvents) {
      return
    }

    if (Array.isArray(wheelEvents)) {
      wheelEvents.forEach(function(wheelEvent) {
        that.addWheelEvent(wheelEvent)
      })
    } else {
      this.addWheelEvent(wheelEvents)
    }
  }

  private addWheelEvent(e: WheelEvent) {
    if (e.deltaMode !== 0) {
      if (this.options.isDebug) {
        console.warn('deltaMode is not 0')
      }
      return
    }

    // TODO: only prevent when wheel event was in allowed dir (keep preventing for current series tho)
    e.preventDefault()

    if (!this.isScrolling) {
      this.beginScroll()
    }

    this.debouncedEndScroll(e)

    const currentDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    const currentAbsDelta = Math.abs(currentDelta)

    if (currentAbsDelta > this.lastAbsDelta) {
      this.endScroll(e)
      this.beginScroll()
    }

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

      if (this.scrollPoints.length > WHEELEVENTS_TO_ANALAZE) {
        this.updateVelocity()

        // check if momentum can be recognized
        if (!this.isMomentum && this.checkForMomentum()) {
          this.publish(WheelPhase.RECOGNIZED, this.getCurrentState())
          //this.onMomentumRecognized.fireWith(this, this.getCurrentState());
        } else if (this.isMomentum) {
          this.checkForEnding()
        }
      }
    }
  }

  getCurrentState() {
    return {
      willEndSoon: this.willEndSoon,
      isScrolling: this.isScrolling,
      isMomentum: this.isMomentum,
      isInterrupted: this.isInterrupted,
      deltaVelocity: this.deltaVelocity,
      deltaTotal: this.deltaTotal,
    }
  }

  beginScroll() {
    this.willEndSoon = false
    this.isScrolling = true
    this.isMomentum = false
    this.isInterrupted = false
    this.lastAbsDelta = Infinity
    this.deltaVelocity = 0
    this.deltaTotal = 0
    this.scrollPoints = []
    this.overallDecreasing.length = 0
    this.scrollPointsToMerge.length = 0
  }

  endScroll(e: WheelEvent) {
    if (this.isMomentum) {
      this.isMomentum = false
      this.momentumEnded()
    }

    this.isScrolling = false
  }

  momentumEnded() {
    if (!this.willEndSoon) {
      this.isInterrupted = true
      this.publish(WheelPhase.INTERRUPTED, this.getCurrentState())
    } else {
      this.publish(WheelPhase.ENDED, this.getCurrentState())
    }
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

    if (this.checkDecreases(this.overallDecreasing)) {
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

  checkDecreases(decreaseBooleans) {
    const decreaseBooleansToCheck = decreaseBooleans.slice(-3)

    if (decreaseBooleansToCheck.length < 3) {
      return false
    }
    return decreaseBooleansToCheck.reduce(function(a, b) {
      return a && b
    })
  }
}
