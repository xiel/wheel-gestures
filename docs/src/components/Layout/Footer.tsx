import React from 'react'

import { Content } from './Layout'

interface Props {}

export function Footer(props: Props) {
  return (
    <Content>
      <footer className="flex flex-wrap items-center justify-between py-8">
        <div className="text-xs">
          <p>
            An Open Source project by{' '}
            <a className="hover:underline focus:underline" href="https://xiel.dev">
              Felix Leupold
            </a>{' '}
            (
            <a className="hover:underline focus:underline" href="https://github.com/xiel">
              @xiel
            </a>
            )
          </p>
        </div>
      </footer>
    </Content>
  )
}
