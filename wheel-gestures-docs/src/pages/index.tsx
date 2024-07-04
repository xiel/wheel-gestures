import React from 'react'

import CodeArea from '../components/CodeArea/CodeArea'
import Gallery from '../components/Gallery/Gallery'
import { Richtext } from '../components/Richtext/Richtext'
import SEO from '../components/seo'
import Skeleton from '../components/Skeleton/Skeleton'

const IndexPage = () => (
  <Skeleton>
    <SEO title="Home" />
    <Richtext>
      <div className="text-center px-6">
        <div className="mx-auto max-w-2xl">
          <h2>wheel interactions made easy</h2>
          <p>
            Allow users to interact with your website like on a touch device. <br />
            This lib normalizes wheel event data and provides useful meta data.
          </p>
        </div>

        <Gallery />

        <div className="mx-auto max-w-xl">
          <h3>Installation</h3>
          <p>Install wheel-gestures using your package manager:</p>
          <CodeArea language="shell">yarn add wheel-gestures # npm install wheel-gestures</CodeArea>
          <p>
            Learn how to use wheel-gestures in the <Link to="/docs/">docs</Link> or have a look at the{' '}
            <Link to="/examples/">examples</Link>.
          </p>
        </div>
      </div>
    </Richtext>
  </Skeleton>
)

export default IndexPage
