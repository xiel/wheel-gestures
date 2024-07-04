import React from 'react'
import { configDefaults } from 'wheel-gestures'

import CodeArea from '../../components/CodeArea/CodeArea'
import { optionsExample } from '../../components/Docs/docs-codes'
import { DocsContent } from '../../components/Docs/DocsContent'
import { DocsNav } from '../../components/Docs/DocsNav'
import SEO from '../../components/seo'
import Skeleton from '../../components/Skeleton/Skeleton'

// const configDefaults: WheelGesturesConfig = {
//   preventWheelAction: true,
//   reverseSign: [true, true, false],
// }

export default function Options() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <DocsNav />
        <DocsContent>
          <h2>Options</h2>

          <p>
            To customize the behaviour of wheel-gestures options can be passed at creation or afterwards using the
            updateOptions method.
          </p>
          <CodeArea>{optionsExample}</CodeArea>

          <h3>preventWheelAction</h3>
          <table>
            <tbody>
              <tr>
                <th>default</th>
                <td>
                  <code>{JSON.stringify(configDefaults.preventWheelAction)}</code>
                </td>
              </tr>
              <tr>
                <th>type</th>
                <td>
                  <code>boolean | 'x' | 'y' | 'z'</code>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>reverseSign:</h3>
          <table>
            <tbody>
              <tr>
                <th>default</th>
                <td>
                  <code>{JSON.stringify(configDefaults.reverseSign)}</code>
                </td>
              </tr>
              <tr>
                <th>type</th>
                <td>
                  <code>boolean</code> | <code>[boolean, boolean, boolean]</code>
                </td>
              </tr>
            </tbody>
          </table>
        </DocsContent>
      </div>
    </Skeleton>
  )
}
