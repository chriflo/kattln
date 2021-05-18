import { css } from '@emotion/react'
import React from 'react'
import { colors } from 'styles/global'

export function Header(props: unknown) {
  return (
    <header css={headerStyles} {...props}>
      <h1>Kattln</h1>
      <img
        src="/cards.svg"
        alt=""
        css={{ width: 50, position: 'fixed', top: 5, right: 5, zIndex: 1 }}
      />
    </header>
  )
}

export const headerHeight = 65
const headerStyles = css`
  position: fixed;
  top: 0;
  text-align: center;
  font-size: 32px;
  letter-spacing: 8px;
  width: 100%;
  height: ${headerHeight}px;
  padding: 16px;
  background: ${colors.blue};
  color: ${colors.mint};
`
