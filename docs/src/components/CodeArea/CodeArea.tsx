import './prism-atom-dark.css'

import Prism from 'prismjs'
import React, { useEffect, useRef } from 'react'

import c from './CodeArea.module.scss'

interface Props {
  code?: string
  children?: string
}

export default function CodeArea({ code, children }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => Prism.highlightElement(ref.current!))

  return (
    <figure className={c.codeWrapper}>
      <pre className="raw-code raw-code language-tsx">
        <code ref={ref} className="language-tsx">
          {code}
          {children}
        </code>
      </pre>
    </figure>
  )
}
