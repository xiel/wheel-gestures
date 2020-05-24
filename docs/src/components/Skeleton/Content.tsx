import React from 'react'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export function Content(props: Props) {
  return <div className="mx-auto max-w-5xl" {...props} />
}
