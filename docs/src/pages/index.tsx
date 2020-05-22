import React from 'react'

import Skeleton from '../components/Layout/Skeleton'
import { Richtext } from '../components/Richtext/Richtext'
import SEO from '../components/seo'
import SimpleWheelDrag from '../components/SimpleWheelDrag/SimpleWheelDrag'

const IndexPage = () => (
  <Skeleton>
    <SEO title="Home" />
    <Richtext>
      <div className="text-center px-6">
        <div className="mx-auto max-w-2xl">
          <h2>Dealing with wheel events made easy</h2>
          <p>
            Allow users to interact with your website like on a touch device. <br />
            This lib normalizes wheel event data and provides useful meta data.
          </p>
        </div>
        <SimpleWheelDrag />
      </div>
    </Richtext>
  </Skeleton>
)

export default IndexPage
