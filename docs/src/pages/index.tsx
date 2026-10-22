import Link from 'next/link'
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
          <h2>Wheel and trackpad gestures, made easy</h2>
          <p>
            Normalized movement, velocity, and momentum detection for wheel and trackpad input. Build your own
            interactions or add wheel support to an Embla carousel.
          </p>
        </div>

        <Gallery />
        <p>
          Try the new <Link href="/examples#time-picker">looping time picker</Link> or see{' '}
          <Link href="/examples#momentum">momentum detection in action</Link>.
        </p>

        <div className="mx-auto max-w-xl">
          <h3>Build with the core library</h3>
          <p>For custom interactions in JavaScript or any framework:</p>
          <CodeArea language="shell">npm install wheel-gestures</CodeArea>
          <p>Or with Yarn:</p>
          <CodeArea language="shell">yarn add wheel-gestures</CodeArea>
          <p>
            Follow the <Link href="/docs#core">core library guide</Link>. For carousels and pickers, use the{' '}
            <Link href="/docs#embla">Embla integration</Link> instead.
          </p>
        </div>
      </div>
    </Richtext>
  </Skeleton>
)

export default IndexPage
