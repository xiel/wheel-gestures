import React from 'react'

import Skeleton from '../components/Layout/Skeleton'
import { Richtext } from '../components/Richtext/Richtext'
import SEO from '../components/seo'
import SimpleWheelDrag from '../components/SimpleWheelDrag/SimpleWheelDrag'

const IndexPage = () => (
  <Skeleton>
    <SEO title="Home" />
    <Richtext>
      <h1>Add wheel gestures to your web app</h1>
      <p>Allow users to interact with your website like on a touch device</p>
      <SimpleWheelDrag />
    </Richtext>
  </Skeleton>
)

export default IndexPage
