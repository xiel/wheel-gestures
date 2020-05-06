import React from 'react'

import Gallery from '../components/Gallery/Gallery'
import Skeleton from '../components/Layout/Skeleton'
import SEO from '../components/seo'

const SecondPage = () => (
  <Skeleton>
    <SEO title="Page two" />
    <h1 onWheel={console.log}>Gallery Example</h1>
    <Gallery />
  </Skeleton>
)

export default SecondPage
