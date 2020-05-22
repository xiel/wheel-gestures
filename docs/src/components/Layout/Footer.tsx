import React from 'react'
import GitHubButton from 'react-github-btn'

import { Content } from './Content'

interface Props {}

export function Footer(props: Props) {
  return (
    <Content>
      <footer className="flex flex-wrap items-center justify-between px-4 py-4 mt-6 border-t-2">
        <div className="text-xs px-2 py-2">
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
        <div className="flex items-center px-2 py-2">
          <GitHubButton
            href="https://github.com/xiel/wheel-gestures"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            aria-label="Star xiel/wheel-gestures on GitHub"
            data-size="large"
            // data-show-count
          >
            View on Github
          </GitHubButton>
        </div>
      </footer>
    </Content>
  )
}
