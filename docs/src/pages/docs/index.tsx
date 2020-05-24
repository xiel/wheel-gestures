import React from 'react'

import CodeArea from '../../components/CodeArea/CodeArea'
import { simpleListener } from '../../components/Docs/docs-codes'
import { DocsContent } from '../../components/Docs/DocsContent'
import { DocsNav } from '../../components/Docs/DocsNav'
import SEO from '../../components/seo'
import Skeleton from '../../components/Skeleton/Skeleton'

export default function Index() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <DocsNav />
        <DocsContent>
          <h2>Getting started</h2>
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
          <h3>Motivation</h3>
          <p>
            Due to the many differences between different browsers, operating systems and input devices, wheel events
            are not the easiest to work with. Which makes many developers neglect the wheel event as an input event to
            their web apps. Others use the wheel event already, but are overwhelmed by their complexity and handle them
            in a suboptimal way.
          </p>
          <p>This small lib normalizes wheel events, provides useful meta data and an easier API.</p>
          <h3>License</h3>
          <p>MIT.</p>
          <p>Please don't use this library to implement unresponsive page scroll jacking.</p>
        </DocsContent>
      </div>
    </Skeleton>
  )
}
