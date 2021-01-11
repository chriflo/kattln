import { css } from '@emotion/react'
import React from 'react'
import { colors } from 'styles/global'

export function Header(props: any) {
  return (
    <header css={headerStyles}>
      <h1 {...props}>Kattln</h1>
      <img src="/cards.svg" css={{ width: 50, position: 'fixed', top: 5, right: 5, zIndex: 1 }} />
    </header>
  )
}

const headerStyles = css`
  text-align: center;
  font-size: 32px;
  letter-spacing: 8px;
  width: 100%;
  padding: 16px;
  background: ${colors.blue};
  color: ${colors.mint};
`
