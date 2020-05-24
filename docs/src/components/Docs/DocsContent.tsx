import clsx from 'clsx'
import * as React from 'react'

import { Richtext } from '../Richtext/Richtext'

type Props = {
  className?: string
}

export const DocsContent: React.FunctionComponent<Props> = ({ className, ...props }: Props) => {
  return <Richtext className={clsx('flex-1 px-6 min-w-xl max-w-full', className)} {...props} />
}
