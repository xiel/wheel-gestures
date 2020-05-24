import React from 'react'

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
          <h2>API</h2>
        </DocsContent>
      </div>
    </Skeleton>
  )
}
