import React from 'react'

interface Props {}

export function Content(props: Props) {
  return <div className="px-6 md:px-8 py-6 md:py-12 mx-auto sm:max-w-5xl" {...props} />
}
