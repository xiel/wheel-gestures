import React from 'react'

import CodeArea from '../components/CodeArea/CodeArea'
import InlineCodeArea from '../components/CodeArea/InlineCodeArea'
import { codeWheelEventState, simpleListener } from '../components/docs/docs-codes'
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
              <a href="#">API</a>
              <ul>
                <li>Options</li>
                <li>WheelEventState</li>
              </ul>
            </li>
            <li>
              <a href="#">Usage</a>
            </li>
          </ul>
        </nav>
        <Richtext className="flex-1 px-6 max-w-full">
          <h1>Docs</h1>
          <h3>Getting started</h3>
          <p>
            wheel-gestures is a small (2.5kB), low-level open-source library that makes handling wheel events a breeze.
            Your can use it in plain old JavaScript or with <em>any framework</em>.
          </p>
          <h3>Installation</h3>
          <p>Install wheel-gestures using your package manager and import it</p>
          <CodeArea language="shell">yarn add wheel-gestures # npm install wheel-gestures</CodeArea>
          <h3>Usage</h3>
          <p>
            Your can then import WheelGestures from the package into your JavaScript/TypeScript file, create an instance
            and add the element you want the user to be able to start wheel gestures on.
          </p>
          <CodeArea>{simpleListener}</CodeArea>
          <p>
            Now your callback you added with <code>.on('wheen', callback)</code> get's called for each recognized wheel
            event, with normalized information about the wheel deltas and addition meta data like velocity.
          </p>
          <p>
            Avoid adding multiple elements with <code>.observe()</code> that are ancestors/descendants (nested). This
            often leds to unexpected results.
          </p>
          <h4>Examples</h4>
          <ul>
            <li>Plain JavaScript / TypeScript</li>
            <li>React</li>
            <li>Vue</li>
            <li>Svelte</li>
          </ul>
          <h3>Options</h3>
          <CodeArea>{simpleListener}</CodeArea>
          <h3>API / wheelEventState</h3>
          <CodeArea>{codeWheelEventState}</CodeArea>
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
