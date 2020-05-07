import React from 'react'
import { Link } from 'gatsby'

import Skeleton from '../components/Layout/Skeleton'
import SEO from '../components/seo'
import Gallery from '../components/Gallery/Gallery'

const SecondPage = () => (
  <Skeleton>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
    <Gallery />
  </Skeleton>
)

export default SecondPage
