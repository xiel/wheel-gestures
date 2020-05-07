import React from 'react'
import { Link } from 'gatsby'

import Skeleton from '../components/Layout/Skeleton'
import SEO from '../components/seo'
import SimpleWheelDrag from '../components/SimpleWheelDrag/SimpleWheelDrag'
import CodeArea from '../components/CodeArea/CodeArea'

// eslint-disable-next-line react-app/import/no-webpack-loader-syntax
import CodeAreaCode from '!!raw-loader!../components/CodeArea/CodeArea'
import { Richtext } from '../components/Richtext/Richtext'

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
      <div style={{ overflow: 'auto', height: 300, fontSize: 25 }}>
        <div style={{ width: '100vw', background: 'beige' }}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aut consectetur consequatur,
            doloremque eveniet, fuga hic illum iste odio officia pariatur provident quasi ratione repellendus sequi
            soluta voluptate voluptates?
          </p>
        </div>
      </div>
      <h3>momentum detection - Compatibility</h3>
      <p>momentum detection tested with</p>-
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
              <span aria-label="tested">✅</span>
            </td>
            <td>
              <span aria-label="tested">✅</span>
            </td>
            <td>
              <span aria-label="tested">✅</span>
            </td>
          </tr>
          <tr>
            <th>
              Windows 10 +
              <br />
              Precision Touchpads (PTP)
            </th>
            <td>
              <span aria-label="tested">✅</span>
            </td>
            <td>
              <span aria-label="tested">✅</span>
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
      <Link to="/gallery">Go to page 2</Link>
    </Richtext>
  </Skeleton>
)

export default IndexPage
