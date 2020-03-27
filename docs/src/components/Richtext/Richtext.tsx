import React from 'react'
import c from './Richtext.module.scss'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Richtext(props: Props) {
  return <div className={c.richtext} {...props}></div>
}
