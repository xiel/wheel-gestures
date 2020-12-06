import { Link } from 'gatsby'
import React from 'react'

const liClass = 'my-2'
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
          <Link to="/docs/options/" className={aClass} activeClassName={aActiveClass}>
            Options
          </Link>
        </li>
        <li className={liClass}>
          <Link to="/docs/observe/" className={aClass} activeClassName={aActiveClass}>
            observe(element)
          </Link>
        </li>
        <li className={liClass}>
          <Link to="/docs/on-wheel/" className={aClass} activeClassName={aActiveClass}>
            on('wheel', callback)
          </Link>
        </li>
      </ul>
    </nav>
  )
}
