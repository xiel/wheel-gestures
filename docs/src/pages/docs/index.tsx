import Link from 'next/link'
import React from 'react'

import CodeArea from '../../components/CodeArea/CodeArea'
import { emblaExample, emblaInstall, simpleListener } from '../../components/Docs/docs-codes'
import { DocsContent } from '../../components/Docs/DocsContent'
import { DocsNav } from '../../components/Docs/DocsNav'
import SEO from '../../components/seo'
import Skeleton from '../../components/Skeleton/Skeleton'

export default function Index() {
  return (
    <Skeleton>
      <SEO title="Getting started" />
      <div className="flex flex-wrap">
        <DocsNav />
        <DocsContent>
          <h2>Getting started</h2>
          <p>
            Choose the core library for custom wheel and trackpad interactions, or the Embla plugin for a carousel or
            picker with dragging, snapping, and wheel support.
          </p>
          <ul>
            <li>
              <a href="#core">Core library</a> — normalized gesture data in JavaScript or any framework.
            </li>
            <li>
              <a href="#embla">Embla integration</a> — ready-made wheel support for React carousels and pickers.
            </li>
          </ul>
          <h3 id="core">Core library</h3>
          <p>Install wheel-gestures using your package manager:</p>
          <CodeArea language="shell">npm install wheel-gestures</CodeArea>
          <p>Or with Yarn:</p>
          <CodeArea language="shell">yarn add wheel-gestures</CodeArea>
          <h3>Usage</h3>
          <p>
            Import WheelGestures from the package into your JavaScript/TypeScript file, create an instance and add the
            element you want the user to start a wheel gesture on.
          </p>
          <CodeArea>{simpleListener}</CodeArea>
          <p>
            The callback you added with <code>.on('wheel', callback)</code> now gets called for each recognized wheel
            event, with normalized information (eg. deltas) and metadata like velocity.
          </p>
          <p>
            Avoid adding multiple elements with <code>.observe()</code> that are ancestors/descendants.
          </p>
          <p>
            By default, wheel-gestures prevents the default (scrolling) on all axis. If you are only interested in
            allowing the user to perform a wheel gesture on one axis but keep the default behavior on the other, see the
            Options page and customize it.
          </p>
          <h3>Examples</h3>
          <p>
            Try the <Link href="/examples">interactive demos</Link> or explore momentum detection in the{' '}
            <Link href="/examples/visualizer">wheel visualizer</Link>.
          </p>
          <h3 id="embla">Embla integration for React</h3>
          <p>
            Install these packages in an existing React project. The plugin includes wheel-gestures as a dependency, so
            you do not need to install it separately unless you also use the core API directly. These are the compatible
            versions used by this site's carousel and time picker:
          </p>
          <CodeArea language="shell">{emblaInstall}</CodeArea>
          <CodeArea>{emblaExample}</CodeArea>
          <p>
            For a vertical, looping example with wheel support, try the{' '}
            <Link href="/examples#time-picker">time picker and copy its source</Link>.
          </p>
          <h3>Motivation</h3>
          <p>
            Due to the many differences between different browsers, operating systems and input devices, wheel events
            are not the easiest to work with. Which makes many developers neglect the wheel event as an input event to
            their web apps. Others use the wheel event already, but are overwhelmed by their complexity and handle them
            in a suboptimal way.
          </p>
          <p>This small lib normalizes wheel events, provides useful meta data and an easier API.</p>
          <h3>License</h3>
          <p>Don't use this library to implement unresponsive page scroll jacking.</p>
          <p>MIT.</p>
        </DocsContent>
      </div>
    </Skeleton>
  )
}
