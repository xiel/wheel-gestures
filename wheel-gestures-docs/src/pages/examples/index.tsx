import React from 'react'

import Gallery from '../../components/Gallery/Gallery'
import SEO from '../../components/seo'
import SimpleWheelDrag from '../../components/SimpleWheelDrag/SimpleWheelDrag'
import Skeleton from '../../components/Skeleton/Skeleton'

const Examples = () => (
  <Skeleton>
    <SEO title="Examples" />
    <SimpleWheelDrag />
    <Gallery />
  </Skeleton>
)

export default Examples
