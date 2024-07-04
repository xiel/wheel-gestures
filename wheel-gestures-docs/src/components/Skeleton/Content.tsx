import React from 'react'

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export function Content(props: Props) {
  return <div className="mx-auto max-w-5xl" {...props} />
}
