import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css'
import React, { useCallback } from 'react'

import c from './CodeArea.module.scss'

interface Props {
  code?: string
  children?: string
  language?: string
}

require('prismjs/components/prism-bash')
require('prismjs/components/prism-markup')
require('prismjs/components/prism-css')
require('prismjs/components/prism-javascript')
require('prismjs/components/prism-typescript')
require('prismjs/components/prism-jsx')
require('prismjs/components/prism-tsx')

// By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
Prism.manual = true

export default function CodeArea({ code, children, language = 'tsx' }: Props): JSX.Element {
  const highlightCode = useCallback((el: HTMLElement) => {
    el && Prism.highlightElement(el)
  }, [])

  return (
    <figure className={c.codeWrapper}>
      <pre className={'raw-code raw-code language-' + language}>
        <code ref={highlightCode} className={'language-' + language}>
          {code?.trim()}
          {children?.trim()}
        </code>
      </pre>
    </figure>
  )
}
