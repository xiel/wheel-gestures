/* eslint-disable simple-import-sort/imports */
import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css'
import 'prismjs/components/prism-bash'
import React, { useEffect, useRef } from 'react'

import c from './CodeArea.module.scss'

interface Props {
  code?: string
  children?: string
  language?: string
}

export default function CodeArea({ code, children, language = 'tsx' }: Props): JSX.Element {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => Prism.highlightElement(ref.current!))

  return (
    <figure className={c.codeWrapper}>
      <pre className={'raw-code raw-code language-' + language}>
        <code ref={ref} className={'language-' + language}>
          {code?.trim()}
          {children?.trim()}
        </code>
      </pre>
    </figure>
  )
}
