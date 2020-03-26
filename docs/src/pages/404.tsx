import React from 'react'

import Skeleton from '../components/Layout/Skeleton'
import SEO from '../components/seo'

const NotFoundPage = () => (
  <Skeleton>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Skeleton>
)

export default NotFoundPage
