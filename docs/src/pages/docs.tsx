import React from 'react'

import CodeArea from '../components/CodeArea/CodeArea'
import InlineCodeArea from '../components/CodeArea/InlineCodeArea'
import { simpleListener } from '../components/docs/docs-codes'
import Skeleton from '../components/Layout/Skeleton'
import { Richtext } from '../components/Richtext/Richtext'
import SEO from '../components/seo'

export default function Docs() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <nav className="px-6 my-8 w-1/3">
          <ul>
            <li>
              <a href="#">Installation</a>
            </li>
            <li>
              <a href="#">Usage</a>
            </li>
            <li>
              <a href="#">Usage</a>
            </li>
            <li>
              <a href="#">Options</a>
            </li>
            <li>
              <a href="#">Usage</a>
            </li>
          </ul>
        </nav>
        <Richtext className="px-6 max-w-full">
          <h1>Docs</h1>

          <h3>Installation</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium adipisci, debitis enim est
            facere illo ipsa maiores mollitia neque nisi non nostrum placeat possimus recusandae, sequi soluta, sunt
            vero!{' '}
          </p>
          <CodeArea>yarn add wheel-gestures</CodeArea>
          <ul>
            <li>lorem lorem ipsum dolor</li>
            <li>lorem lorem ipsum dolor</li>
            <li>lorem lorem ipsum dolor</li>
          </ul>
          <h3>Getting started</h3>
          <h3>Usage</h3>
          <h3>Options</h3>
          <CodeArea>{simpleListener}</CodeArea>
          <h3>
            Momentum/Inertia detection <InlineCodeArea>isMomentum</InlineCodeArea>
          </h3>
          <p>Tested with all current versions of all major browsers (Chrome, Firefox, Safari, Edge)</p>
          <ul>
            <li>macOS + Magic Mouse & Magic Trackpad</li>
            <li>Windows 10 + Precision Touchpads (PTP)</li>
          </ul>

          <h3>Example</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus beatae debitis dicta dolor fuga labore
            necessitatibus, nemo nesciunt nihil odio perspiciatis, quasi qui quia repudiandae tempore unde ut vitae
            voluptatem!
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias debitis deserunt eius enim error fugit
            labore, maiores, necessitatibus nisi numquam optio placeat praesentium quaerat quia quibusdam suscipit vero
            voluptas voluptates!
          </p>
        </Richtext>
      </div>
    </Skeleton>
  )
}
