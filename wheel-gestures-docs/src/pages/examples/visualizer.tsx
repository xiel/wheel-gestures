import React from 'react'

import SEO from '../../components/seo'
import SimpleWheelDrag from '../../components/SimpleWheelDrag/SimpleWheelDrag'
import Skeleton from '../../components/Skeleton/Skeleton'

const Index = () => (
  <Skeleton>
    <SEO title="Examples" />
    <h1>Visualizer</h1>
    <SimpleWheelDrag />
  </Skeleton>
)

export default Index
