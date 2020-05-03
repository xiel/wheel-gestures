import React from 'react'

import Skeleton from '../components/Layout/Skeleton'
import SEO from '../components/seo'
import Gallery from '../components/Gallery/Gallery'
import WheelRecorder from '../components/WheelRecorder/WheelRecorder'

const SecondPage = () => (
  <Skeleton>
    <SEO title="Page two" />
    <h1>Gallery Example</h1>
    <WheelRecorder />
    <Gallery />
  </Skeleton>
)

export default SecondPage
