import 'prismjs/themes/prism-okaidia.css'

import Prism from 'prismjs'
import React, { useEffect, useRef } from 'react'

interface Props {
  code?: string
  children?: string
  language?: string
}

export default function InlineCodeArea({ code, children, language = 'tsx' }: Props) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => Prism.highlightElement(ref.current!))

  return (
    <code ref={ref} className={'language-' + language}>
      {code}
      {children}
    </code>
  )
}
