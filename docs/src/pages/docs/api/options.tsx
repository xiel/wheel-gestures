import React from 'react'

import { configDefaults } from '../../../../../src'
import CodeArea from '../../../components/CodeArea/CodeArea'
import { DocsContent } from '../../../components/Docs/DocsContent'
import { DocsNav } from '../../../components/Docs/DocsNav'
import SEO from '../../../components/seo'
import Skeleton from '../../../components/Skeleton/Skeleton'

export default function Docs() {
  return (
    <Skeleton>
      <SEO title="Docs" />
      <div className="flex flex-wrap">
        <DocsNav />
        <DocsContent>
          <h2>Options</h2>

          <p>To customize the behaviour of wheel-gestures options can be passed at creation…</p>
          <CodeArea>{`const wheelGestures = WheelGestures({ preventWheelAction: 'x' })`}</CodeArea>
          <p>… or afterwards using the updateOptions method.</p>
          <CodeArea>{`wheelGestures.updateOptions({ preventWheelAction: 'y' })`}</CodeArea>
          <p>These are options available including a short description:</p>
          <h3>preventWheelAction</h3>
          <p>
            default: <code>{JSON.stringify(configDefaults.preventWheelAction)}</code>
          </p>
          <CodeArea>type PreventWheelActionType = boolean | 'x' | 'y' | 'z'</CodeArea>

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
