import { Link } from 'gatsby'
import React from 'react'

type Props = {}

const liClass = 'my-2'
const ulClass = 'pl-4'
const aClass = 'block py-1 px-2 rounded hover:bg-gray-500 hover:bg-opacity-25 focus:bg-gray-500 focus:bg-opacity-25'
const aActiveClass = 'block py-1 px-2 rounded bg-gray-500 bg-opacity-25 bold font-semibold'

export const DocsNav = () => {
  return (
    <nav className="flex-grow px-6 my-8 min-w-64">
      <ul>
        <li className={liClass}>
          <Link to="/docs/" className={aClass} activeClassName={aActiveClass}>
            Installation & Usage
          </Link>
        </li>
        <li className={liClass}>
          <Link to="/docs/api/" className={aClass} activeClassName={aActiveClass}>
            API
          </Link>
          <ul className={ulClass}>
            <li className={liClass}>
              <Link to="/docs/api/options/" className={aClass} activeClassName={aActiveClass}>
                Options
              </Link>
            </li>
            <li className={liClass}>
              <Link to="/docs/api/wheel-event-state/" className={aClass} activeClassName={aActiveClass}>
                WheelEventState
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}
