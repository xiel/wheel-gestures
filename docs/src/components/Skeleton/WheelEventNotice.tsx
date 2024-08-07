import * as React from 'react'
import { useEffect, useState } from 'react'

import { Richtext } from '../Richtext/Richtext'

export function WheelEventNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="bg-pink-800 text-white overflow-hidden">
      <Richtext>
        <div className="text-center px-6">
          <p>
            Please note the demos only support wheel & scroll events made with <strong>trackpads & mouse</strong>.
          </p>
        </div>
      </Richtext>
    </div>
  )
}
