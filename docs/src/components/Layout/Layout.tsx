import React, { FunctionComponent } from 'react'
import c from './Layout.module.scss'

interface Props {}

export function Content(props: Props) {
  return <div className={c.content} {...props} />
}
