import { css, Global } from '@emotion/react'
import emotionReset from 'emotion-reset'
import React from 'react'

export const colors = {
  black: '#1a181b',
  white: '#f4faff',
  blue: '#1e152a',
  mint: '#eaf2ef',
  green: '#14281d',
}

export const fontSet = {
  headline: css`
    font-size: 20px;
    letter-spacing: 1px;
  `,
}

export const mediaQuery = {
  medium: '@media screen and (min-width: 768px)',
} as const

export function GlobalStyles() {
  return (
    <Global
      styles={css`
        ${emotionReset};
        html,
        body {
          height: 100%;
        }
        html {
          font-family: Arial, Helvetica, sans-serif;
          box-sizing: border-box;
          color: ${colors.black};
        }
        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }
      `}
    />
  )
}
