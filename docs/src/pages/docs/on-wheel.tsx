import React from 'react'

import CodeArea from '../../components/CodeArea/CodeArea'
import { codeWheelEventState, offWheelCallbackExample, wheelCallbackExample } from '../../components/Docs/docs-codes'
import { DocsContent } from '../../components/Docs/DocsContent'
import { DocsNav } from '../../components/Docs/DocsNav'
import SEO from '../../components/seo'
import Skeleton from '../../components/Skeleton/Skeleton'

export default function Docs() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <DocsNav />
        <DocsContent>
          <h2>Add Callback</h2>
          <p>
            After creating an instance, you can add a callback using <code>on('wheel', callback)</code>, which will be
            called with the a WheelEventState object.
          </p>
          <CodeArea>{wheelCallbackExample}</CodeArea>
          <p>The data provided is easily extracted using object & array destructuring.</p>
          <p>See below in what form the data is provided.</p>

          <h3>WheelEventState</h3>
          <p>
            This is the TypeScript type of the WheelEventState object provided. Even if you do not use TypeScript, this
            might be helpful to see how the data is provided:
          </p>
          <CodeArea>{codeWheelEventState}</CodeArea>
          <h3>
            Momentum/inertia detection <code>isMomentum</code>
          </h3>
          <p>Tested with all current versions of all major browsers (Chrome, Firefox, Safari, Edge)</p>
          <ul>
            <li>macOS + Magic Mouse & Magic Trackpad</li>
            <li>Windows 10 + Precision Touchpads (PTP)</li>
          </ul>

          <h2>Remove Callback</h2>
          <p>To cleanup you can use one of the following methods to remove the callback:</p>
          <CodeArea>{offWheelCallbackExample}</CodeArea>
        </DocsContent>
      </div>
    </Skeleton>
  )
}
