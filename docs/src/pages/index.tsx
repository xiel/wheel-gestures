import { Link } from 'gatsby'
import React from 'react'

import CodeAreaCode from '!!raw-loader!../components/CodeArea/CodeArea'

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
      <CodeArea>{CodeAreaCode}</CodeArea>
      <h3>Example</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus beatae debitis dicta dolor fuga labore
        necessitatibus, nemo nesciunt nihil odio perspiciatis, quasi qui quia repudiandae tempore unde ut vitae
        voluptatem!
      </p>
      <ul>
        <li>
          <Link to="/gallery">Gallery</Link>
        </li>
      </ul>
    </Richtext>
  </Skeleton>
)

export default IndexPage
