import React from 'react'

import CodeUseWheelDrag from '!!raw-loader!../hooks/useWheelDrag'

import CodeArea from '../components/CodeArea/CodeArea'
import Skeleton from '../components/Layout/Skeleton'
import { Richtext } from '../components/Richtext/Richtext'
import SEO from '../components/seo'
import SimpleWheelDrag from '../components/SimpleWheelDrag/SimpleWheelDrag'

const IndexPage = () => (
  <Skeleton>
    <SEO title="Home" />
    <Richtext>
      <h1>Add wheel gestures to your web app</h1>
      <p>Allow users to interact with your website like on a touch device</p>
      <h3>Demo</h3>
      <SimpleWheelDrag />
      <h3>Installation</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium adipisci, debitis enim est
        facere illo ipsa maiores mollitia neque nisi non nostrum placeat possimus recusandae, sequi soluta, sunt vero!{' '}
      </p>
      <ul>
        <li>lorem lorem ipsum dolor</li>
        <li>lorem lorem ipsum dolor</li>
        <li>lorem lorem ipsum dolor</li>
      </ul>
      <div className="mt-4">
        <a
          href="#"
          className="inline-block bg-indigo-500 text-white px-5 py-3 rounded shadow-5 uppercase tracking-wider font-semibold text-sm"
        >
          Book your escape
        </a>
      </div>
      <h3>momentum detection - Compatibility</h3>
      <table>
        <thead>
          <tr>
            <td />
            <th>Firefox</th>
            <th>Chromium (Edge, Chrome etc.)</th>
            <th>Safari</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              macOS +
              <br />
              Magic Mouse & Magic Trackpad
            </th>
            <td>
              <span role="img" aria-label="tested">
                ✅
              </span>
            </td>
            <td>
              <span role="img" aria-label="tested">
                ✅
              </span>
            </td>
            <td>
              <span role="img" aria-label="tested">
                ✅
              </span>
            </td>
          </tr>
          <tr>
            <th>
              Windows 10 +
              <br />
              Precision Touchpads (PTP)
            </th>
            <td>
              <span role="img" aria-label="tested">
                ✅
              </span>
            </td>
            <td>
              <span role="img" aria-label="tested">
                ✅
              </span>
            </td>
            <td />
          </tr>
        </tbody>
      </table>
      <h3>Example</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus beatae debitis dicta dolor fuga labore
        necessitatibus, nemo nesciunt nihil odio perspiciatis, quasi qui quia repudiandae tempore unde ut vitae
        voluptatem!
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias debitis deserunt eius enim error fugit labore,
        maiores, necessitatibus nisi numquam optio placeat praesentium quaerat quia quibusdam suscipit vero voluptas
        voluptates!
      </p>
      <CodeArea>{CodeUseWheelDrag}</CodeArea>
      <br />
    </Richtext>
  </Skeleton>
)

export default IndexPage
