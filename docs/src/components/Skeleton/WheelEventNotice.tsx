import * as React from 'react'
import { useEffect, useState } from 'react'

import { Richtext } from '../Richtext/Richtext'

export function WheelEventNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="bg-pink-800 text-white overflow-hidden">
      <Richtext>
        <div className="text-center px-6">
          <p>
            The wheel visualizer and recorder need a <strong>trackpad or mouse wheel</strong>. You can also drag the
            boxes, and use touch, mouse dragging, or the buttons in the photo gallery.
          </p>
        </div>
      </Richtext>
    </div>
  )
}
