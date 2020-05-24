import React from 'react'

import CodeArea from '../../components/CodeArea/CodeArea'
import { simpleListener } from '../../components/Docs/docs-codes'
import { DocsNav } from '../../components/Docs/DocsNav'
import Skeleton from '../../components/Layout/Skeleton'
import { Richtext } from '../../components/Richtext/Richtext'
import SEO from '../../components/seo'

export default function Index() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <DocsNav />
        <Richtext className="flex-1 px-6 max-w-full">
          <h1>Docs</h1>
          <h3>Getting started</h3>
          <p>
            wheel-gestures is a small low-level open-source library that makes handling wheel events a breeze. You can
            use it in plain old JavaScript or with <em>any framework</em>.
          </p>
          <h3>Installation</h3>
          <p>Install wheel-gestures using your package manager:</p>
          <CodeArea language="shell">yarn add wheel-gestures # npm install wheel-gestures</CodeArea>
          <h3>Usage</h3>
          <p>
            Import WheelGestures from the package into your JavaScript/TypeScript file, create an instance and add the
            element you want the user to start a wheel gesture on.
          </p>
          <CodeArea>{simpleListener}</CodeArea>
          <p>
            The callback you added with <code>.on('wheel', callback)</code> now gets called for each recognized wheel
            event, with normalized information about the wheel deltas and additional metadata like velocity.
          </p>
          <p>
            Avoid adding multiple elements with <code>.observe()</code> that are ancestors/descendants.
          </p>
          <p>
            By default, wheel-gestures prevents the default (scrolling) on all axis. If you are only interested in
            allowing the user to perform a wheel gesture on one axis but keep the default behavior on the other, see the
            Options page and customize it.
          </p>
          <h4>Examples</h4>
          <ul>
            <li>Plain JavaScript / TypeScript</li>
            <li>React</li>
            <li>Vue</li>
            <li>Svelte</li>
          </ul>
        </Richtext>
      </div>
    </Skeleton>
  )
}
