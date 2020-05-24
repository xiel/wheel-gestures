import React from 'react'

import Gallery from '../../components/Gallery/Gallery'
import SEO from '../../components/seo'
import Skeleton from '../../components/Skeleton/Skeleton'

const Examples = () => (
  <Skeleton>
    <SEO title="Examples" />
    <h1>Gallery Example</h1>
    <Gallery />
  </Skeleton>
)

export default Examples
