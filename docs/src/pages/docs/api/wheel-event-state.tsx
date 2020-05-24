import React from 'react'

import CodeArea from '../../../components/CodeArea/CodeArea'
import InlineCodeArea from '../../../components/CodeArea/InlineCodeArea'
import { codeWheelEventState } from '../../../components/Docs/docs-codes'
import { DocsContent } from '../../../components/Docs/DocsContent'
import { DocsNav } from '../../../components/Docs/DocsNav'
import SEO from '../../../components/seo'
import Skeleton from '../../../components/Skeleton/Skeleton'

export default function Docs() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <DocsNav />
        <DocsContent>
          <h2>WheelEventState</h2>
          <CodeArea>{codeWheelEventState}</CodeArea>
          <h3>
            Momentum/Inertia detection <InlineCodeArea>isMomentum</InlineCodeArea>
          </h3>
          <p>Tested with all current versions of all major browsers (Chrome, Firefox, Safari, Edge)</p>
          <ul>
            <li>macOS + Magic Mouse & Magic Trackpad</li>
            <li>Windows 10 + Precision Touchpads (PTP)</li>
          </ul>
        </DocsContent>
      </div>
    </Skeleton>
  )
}
