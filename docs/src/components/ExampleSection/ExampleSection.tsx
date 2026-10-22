import React, { ReactNode } from 'react'

import c from './ExampleSection.module.scss'

type Props = {
  id: string
  title: string
  description: ReactNode
  children: ReactNode
  code: ReactNode
}

export default function ExampleSection({ id, title, description, children, code }: Props) {
  return (
    <section id={id} className={c.section} aria-labelledby={`${id}-title`}>
      <div className={c.intro}>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
      <details className={c.code}>
        <summary>View code: {title}</summary>
        <div>{code}</div>
      </details>
    </section>
  )
}
