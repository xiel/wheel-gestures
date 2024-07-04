import React from 'react'

import CodeArea from '../../components/CodeArea/CodeArea'
import { feedWheelExample, observeExample, unobserveExample, unobserveReturned } from '../../components/Docs/docs-codes'
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
          <h2>Observe Element(s)</h2>
          <h3>Add</h3>
          <p>To watch for wheel gestures on an element, add the element with .observe to the WheelGestures instance:</p>
          <CodeArea>{observeExample}</CodeArea>

          <h3>Remove</h3>
          <p>
            When you are ready to cleanup the event listeners you can call <code>.unobserve</code> method with the same
            element.
          </p>

          <CodeArea>{unobserveExample}</CodeArea>

          <p>
            Alternatively you can call the function returned from <code>.observe()</code>
          </p>
          <CodeArea>{unobserveReturned}</CodeArea>
          <hr />
          <h3>
            <em>Alternative:</em> Add events manually
          </h3>

          <p>
            If you prefer to add & remove event listeners yourself, you can also feed events to WheelGestures to process
            manually:
          </p>
          <CodeArea>{feedWheelExample}</CodeArea>
        </DocsContent>
      </div>
    </Skeleton>
  )
}
