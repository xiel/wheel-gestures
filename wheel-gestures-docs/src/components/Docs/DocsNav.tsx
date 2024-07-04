import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ComponentProps } from 'react'

const liClass = 'my-2'
const aClass = 'block py-1 px-2 rounded hover:bg-gray-500 hover:bg-opacity-25 focus:bg-gray-500 focus:bg-opacity-25'
const aActiveClass = 'block py-1 px-2 rounded bg-gray-500 bg-opacity-25 bold font-semibold'

export const DocsNav = () => {
  return (
    <nav className="flex-grow px-6 my-8 min-w-64">
      <ul>
        <li className={liClass}>
          <LinkActiveClassName href="/docs/" className={aClass} activeClassName={aActiveClass}>
            Installation & Usage
          </LinkActiveClassName>
        </li>
        <li className={liClass}>
          <LinkActiveClassName href="/docs/options/" className={aClass} activeClassName={aActiveClass}>
            Options
          </LinkActiveClassName>
        </li>
        <li className={liClass}>
          <LinkActiveClassName href="/docs/observe/" className={aClass} activeClassName={aActiveClass}>
            observe(element)
          </LinkActiveClassName>
        </li>
        <li className={liClass}>
          <LinkActiveClassName href="/docs/on-wheel/" className={aClass} activeClassName={aActiveClass}>
            on('wheel', callback)
          </LinkActiveClassName>
        </li>
      </ul>
    </nav>
  )
}

function LinkActiveClassName(props: ComponentProps<typeof Link> & { activeClassName: string }) {
  const { href, activeClassName, ...rest } = props
  const isActive = href === usePathname()

  console.log(`isActive`, isActive)

  return <Link {...rest} href={href} className={clsx(aClass, isActive && activeClassName)} />
}
