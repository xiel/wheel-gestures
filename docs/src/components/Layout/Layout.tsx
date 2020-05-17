import React from 'react'

interface Props {}

export function Content(props: Props) {
  return <div className="px-8 py-12 mx-auto max-w-md sm:max-w-5xl" {...props} />
}
