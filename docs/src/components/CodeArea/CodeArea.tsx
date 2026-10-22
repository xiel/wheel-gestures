import 'prismjs/themes/prism-okaidia.css'

import Prism from 'prismjs'
import React, { useEffect, useRef, useState } from 'react'

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

Prism.manual = true

export default function CodeArea({ code, children, language = 'tsx' }: Props): JSX.Element {
  const source = code?.trim() ?? children?.trim() ?? ''
  const codeRef = useRef<HTMLElement>(null)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (!codeRef.current) return
    codeRef.current.textContent = source
    Prism.highlightElement(codeRef.current)
  }, [source, language])

  useEffect(() => {
    if (copyStatus === 'idle') return
    const timeout = setTimeout(() => setCopyStatus('idle'), 3000)
    return () => clearTimeout(timeout)
  }, [copyStatus])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(source)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <figure className={c.codeWrapper}>
      <div className={c.toolbar}>
        <span role="status">
          {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'failed' ? 'Select and copy the code manually.' : ''}
        </span>
        <button type="button" onClick={copyCode} aria-label="Copy code">
          Copy
        </button>
      </div>
      <pre className={'raw-code language-' + language}>
        <code ref={codeRef} className={'language-' + language}>
          {source}
        </code>
      </pre>
    </figure>
  )
}
