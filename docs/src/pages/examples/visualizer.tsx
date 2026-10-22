import React from 'react'

import SEO from '../../components/seo'
import SimpleWheelDrag from '../../components/SimpleWheelDrag/SimpleWheelDrag'
import Skeleton from '../../components/Skeleton/Skeleton'

const Index = () => (
  <Skeleton>
    <SEO title="Wheel visualizer" />
    <div className="px-6">
      <h2 className="text-3xl font-bold mt-8">Wheel momentum visualizer</h2>
      <p className="my-6 max-w-2xl leading-relaxed">
        Scroll inside the panel, then lift your fingers from the trackpad. The solid box follows active input; the
        translucent box also follows momentum after release. Both return to the center when their input ends. You can
        also drag the solid box. A mouse wheel may produce little or no momentum.
      </p>
      <SimpleWheelDrag />
    </div>
  </Skeleton>
)

export default Index
