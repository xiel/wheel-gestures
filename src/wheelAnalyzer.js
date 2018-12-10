import rb from './global-rb';
import './pubsub';
import debounce from './debounce';

const WHEELEVENTS_TO_MERGE = 2; // 2
const WHEELEVENTS_TO_ANALAZE = 3;

// const ABSDELTA_DECREASE_THRESHOLD = 3;

const defaults = {
  isDebug: true,
};

const WheelAnalyzer = function(options){
  if (!(this instanceof WheelAnalyzer)) {
    return new WheelAnalyzer(options);
  }

  this.isScrolling = false;
  this.isMomentum = false;
  this.isInterrupted = false;
  this.willEndSoon = false;

  this.lastAbsDelta = Infinity;
  this.deltaVelocity = 0; // px per second
  this.deltaTotal = 0; // moved during this scroll interaction
  this.scrollPoints = [];
  this.scrollPointsToMerge = [];
  this.overallDecreasing = [];

  this._debouncedEndScroll = debounce(this._endScroll, {delay: 50});

  // callback api
  rb.createPubSub(this);

  this.options = Object.assign(defaults, options);
};

Object.assign(WheelAnalyzer.prototype, {

  feedWheel: function(wheelEvents) {
    const that = this;

    if (!wheelEvents) {
      return;
    }

    if (Array.isArray(wheelEvents)) {
      wheelEvents.forEach(function (wheelEvent) {
        that._addWheelEvent(wheelEvent);
      });
    } else {
      this._addWheelEvent(wheelEvents);
    }
  },

  _addWheelEvent: function(e) {
    if (e.deltaMode !== 0) {
      if (this.options.isDebug) {
        rb.logWarn('deltaMode is not 0');
      }
      return;
    }

    if (!this.isScrolling) {
      this._beginScroll(e);
    }

    this._debouncedEndScroll(e);

    const currentDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const currentAbsDelta = Math.abs(currentDelta);

    if (currentAbsDelta > this.lastAbsDelta) {
      this._endScroll(e);
      this._beginScroll(e);
    }

    this.deltaTotal = this.deltaTotal + currentDelta;
    this.lastAbsDelta = currentAbsDelta;

    this.scrollPointsToMerge.push({
      currentDelta: currentDelta,
      currentAbsDelta: currentAbsDelta,
      timestamp: e.timeStamp || Date.now(),
    });

    if (this.scrollPointsToMerge.length === WHEELEVENTS_TO_MERGE) {
      this.scrollPoints.push({
        currentDelta: Math.round(this.scrollPointsToMerge.reduce(function (a, b) {
          return a + b.currentDelta;
        }, 0) / WHEELEVENTS_TO_MERGE),
        currentAbsDelta: Math.round(this.scrollPointsToMerge.reduce(function (a, b) {
          return a + b.currentAbsDelta;
        }, 0) / WHEELEVENTS_TO_MERGE),
        timestamp: Math.round(this.scrollPointsToMerge.reduce(function (a, b) {
          return a + b.timestamp;
        }, 0) / WHEELEVENTS_TO_MERGE),
      });

      // reset merge array
      this.scrollPointsToMerge.length = 0;

      if (this.scrollPoints.length > WHEELEVENTS_TO_ANALAZE) {
        this.updateVelocity();

        // check if momentum can be recognized
        if (!this.isMomentum && this._checkForMomentum()) {
          this.publish('recognized', this.getCurrentState());
          //this.onMomentumRecognized.fireWith(this, this.getCurrentState());
        } else if (this.isMomentum) {
          this._checkForEnding();
        }
      }
    }
  },

  getCurrentState: function() {
    return {
      willEndSoon: this.willEndSoon,
      isScrolling: this.isScrolling,
      isMomentum: this.isMomentum,
      isInterrupted: this.isInterrupted,
      deltaVelocity: this.deltaVelocity,
      deltaTotal: this.deltaTotal,
    };
  },

  _beginScroll: function() {
    this.willEndSoon = false;
    this.isScrolling = true;
    this.isMomentum = false;
    this.isInterrupted = false;
    this.lastAbsDelta = Infinity;
    this.deltaVelocity = 0;
    this.deltaTotal = 0;
    this.scrollPoints = [];
    this.overallDecreasing.length = 0;
    this.scrollPointsToMerge.length = 0;
  },

  _endScroll: function(e) {
    if (this.isMomentum) {
      this.isMomentum = false;
      this._momentumEnded(e);
    }

    this.isScrolling = false;
  },

  _momentumEnded: function() {
    if (!this.willEndSoon) {
      this.isInterrupted = true;
      this.publish('interrupted', this.getCurrentState());
    } else {
      this.publish('ended', this.getCurrentState());
    }
  },

  updateVelocity: function() {
    const scrollPointsToAnalyze = this.scrollPoints.slice(WHEELEVENTS_TO_ANALAZE * -1);

    const totalDelta = scrollPointsToAnalyze.reduce(function (a, b) {
      return a + b.currentDelta;
    }, 0);

    const timePassedInInterval = Math.abs(scrollPointsToAnalyze[scrollPointsToAnalyze.length - 1].timestamp - scrollPointsToAnalyze[0].timestamp);
    const currentVelocity = totalDelta / (timePassedInInterval || 1) * 1000;

    this.deltaVelocity = this.deltaVelocity ? currentVelocity * 0.8 + this.deltaVelocity * 0.2 : currentVelocity;
  },

  _checkForMomentum: function() {
    if (this.isMomentum) {
      return this.isMomentum;
    }

    // get the latest WHEELEVENTS_TO_ANALAZE
    const scrollPointsToAnalize = this.scrollPoints.slice(WHEELEVENTS_TO_ANALAZE * -1);
    const scrollPointsToAnalizeAbsDeltas = scrollPointsToAnalize.map(function (scrollPoint) {
      return scrollPoint.currentAbsDelta;
    });

    if (scrollPointsToAnalize.length < WHEELEVENTS_TO_ANALAZE) {
      return rb.logError('not enough points.');
    }

    // check if delta is all decreasing
    const absDeltasMin = Math.min.apply(null, scrollPointsToAnalizeAbsDeltas);
    const absDeltasMax = Math.max.apply(null, scrollPointsToAnalizeAbsDeltas);
    const isOverallDecreasing = absDeltasMin < absDeltasMax && absDeltasMin === scrollPointsToAnalizeAbsDeltas[scrollPointsToAnalizeAbsDeltas.length - 1];

    this.overallDecreasing.push(isOverallDecreasing);

    if (this._checkDecreases(this.overallDecreasing)) {
      this.isMomentum = true;
    }

    return this.isMomentum;
  },

  _checkForEnding() {
    const scrollPointsToAnalize = this.scrollPoints.slice(WHEELEVENTS_TO_ANALAZE * -1);
    const scrollPointsToAnalizeAbsDeltas = scrollPointsToAnalize.map(function (scrollPoint) {
      return scrollPoint.currentAbsDelta;
    });
    const absDeltaAvrg = scrollPointsToAnalizeAbsDeltas.reduce(function (a, b) {
      return a + b;
    }) / scrollPointsToAnalizeAbsDeltas.length;

    if (absDeltaAvrg < 1.3) {
      this.willEndSoon = true;
    }

    return this.willEndSoon;
  },

  _checkDecreases(decreaseBooleans) {
    const decreaseBooleansToCheck = decreaseBooleans.slice(-3);

    if (decreaseBooleansToCheck.length < 3) {
      return false;
    }
    return decreaseBooleansToCheck.reduce(function (a, b) {
      return a && b;
    });
  },
});

rb.WheelAnalyzer = WheelAnalyzer;

export default WheelAnalyzer;
