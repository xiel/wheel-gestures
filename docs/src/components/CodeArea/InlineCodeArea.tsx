import './prism-atom-dark.css'

import Prism from 'prismjs'
import React, { useEffect, useRef } from 'react'

interface Props {
  code?: string
  children?: string
}

export default function InlineCodeArea({ code, children }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => Prism.highlightElement(ref.current!))

  return (
    <code ref={ref} className="language-tsx">
      {code}
      {children}
    </code>
  )
}
