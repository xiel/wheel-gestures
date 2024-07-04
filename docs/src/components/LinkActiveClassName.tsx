import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ComponentProps } from 'react'

export function LinkActiveClassName(props: ComponentProps<typeof Link> & { activeClassName: string }) {
  const { href, className, activeClassName, ...rest } = props
  const isActive = href === usePathname()
  return <Link {...rest} href={href} className={clsx(className, isActive && activeClassName)} />
}
