import { css } from '@emotion/react'
import React from 'react'
import { colors } from 'styles/global'

export function Header(props: any) {
  return (
    <>
      <h1 css={headerStyles} {...props}>
        Kattln
      </h1>
      <img src="/cards.svg" css={{ width: 50, position: 'fixed', top: 5, right: 5, zIndex: 1 }} />
    </>
  )
}

const headerStyles = css`
  position: fixed;
  top: 0;
  text-align: center;
  font-size: 32px;
  letter-spacing: 8px;
  width: 100%;
  padding: 16px;
  background: ${colors.blue};
  color: ${colors.mint};
  z-index: 0;
`
