import React from 'react'

import CodeArea from '../../../components/CodeArea/CodeArea'
import InlineCodeArea from '../../../components/CodeArea/InlineCodeArea'
import { codeWheelEventState } from '../../../components/Docs/docs-codes'
import { DocsNav } from '../../../components/Docs/DocsNav'
import Skeleton from '../../../components/Layout/Skeleton'
import { Richtext } from '../../../components/Richtext/Richtext'
import SEO from '../../../components/seo'

export default function Docs() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <DocsNav />
        <Richtext className="flex-1 px-6 max-w-full">
          <h3>API / wheelEventState</h3>
          <CodeArea>{codeWheelEventState}</CodeArea>
          <h3>Motivation</h3>
          <p>
            Due to the many differences between different browsers, operating systems and input devices, wheel events
            are not the easiest to work with. Which makes many developers neglect the wheel event as an input event to
            their web apps. Others use the wheel event already, but are overwhelmed by their complexity and handle them
            in a suboptimal way.
          </p>
          <p>This small lib normalizes wheel events, provides useful meta data and an easier API.</p>
          <h3>License</h3>
          <p>MIT.</p>
          <p>Please don't use this library to implement unresponsive page scroll jacking.</p>
          <h3>
            Momentum/Inertia detection <InlineCodeArea>isMomentum</InlineCodeArea>
          </h3>
          <p>Tested with all current versions of all major browsers (Chrome, Firefox, Safari, Edge)</p>
          <ul>
            <li>macOS + Magic Mouse & Magic Trackpad</li>
            <li>Windows 10 + Precision Touchpads (PTP)</li>
          </ul>
          <h3>Example</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus beatae debitis dicta dolor fuga labore
            necessitatibus, nemo nesciunt nihil odio perspiciatis, quasi qui quia repudiandae tempore unde ut vitae
            voluptatem!
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias debitis deserunt eius enim error fugit
            labore, maiores, necessitatibus nisi numquam optio placeat praesentium quaerat quia quibusdam suscipit vero
            voluptas voluptates!
          </p>
        </Richtext>
      </div>
    </Skeleton>
  )
}
