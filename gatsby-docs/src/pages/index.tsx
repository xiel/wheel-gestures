import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import SimpleWheelDrag from '../components/SimpleWheelDrag/SimpleWheelDrag'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Gestures like on a touch device</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium adipisci, debitis enim est facere
      illo ipsa maiores mollitia neque nisi non nostrum placeat possimus recusandae, sequi soluta, sunt vero!
    </p>
    <SimpleWheelDrag />
    <Link to="/gallery/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
