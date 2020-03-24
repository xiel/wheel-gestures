import React, { useEffect } from 'react'
import Prism from 'prismjs'
import 'prism-themes/themes/prism-xonokai.css'

interface Props {
  code?: string
  children?: string
}

export default function CodeArea({ code, children }: Props) {
  useEffect(() => Prism.highlightAll())

  return (
    <section>
      <pre className="raw-code">
        <code className="language-tsx">{code || children}</code>
      </pre>
    </section>
  )
}
