import * as React from 'react'

import c from './WheelIndicator.module.scss'

interface Props {
  visible?: boolean
  flipped?: boolean
}

export function WheelIndicator({ visible, flipped }: Props) {
  return (
    <div className={`${c.outerBox} ${visible ? '' : c.hidden}`}>
      <span className={c.label}>scroll sideways</span>
      <div className={`${c.wheelIndicator} ${flipped ? c.flipped : ''}`}>
        <div className={c.fingers}>
          <span className={c.finger} />
          <span className={c.finger} />
        </div>
      </div>
    </div>
  )
}
