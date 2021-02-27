import { css } from '@emotion/react'
import { colors } from 'styles/global'

export function Spinner(props: React.ComponentProps<'div'>) {
  return (
    <div
      css={css`
        @keyframes lds-grid {
          0%,
          100% {
            background-color: ${colors.green};
          }
          50% {
            background-color: white;
          }
        }

        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;

        div {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          animation: lds-grid 1.2s linear infinite;
        }
        div:nth-child(1) {
          top: 8px;
          left: 8px;
          animation-delay: 0s;
        }
        div:nth-child(2) {
          top: 8px;
          left: 32px;
          animation-delay: -0.4s;
        }
        div:nth-child(3) {
          top: 8px;
          left: 56px;
          animation-delay: -0.8s;
        }
        div:nth-child(4) {
          top: 32px;
          left: 8px;
          animation-delay: -0.4s;
        }
        div:nth-child(5) {
          top: 32px;
          left: 32px;
          animation-delay: -0.8s;
        }
        div:nth-child(6) {
          top: 32px;
          left: 56px;
          animation-delay: -1.2s;
        }
        div:nth-child(7) {
          top: 56px;
          left: 8px;
          animation-delay: -0.8s;
        }
        div:nth-child(8) {
          top: 56px;
          left: 32px;
          animation-delay: -1.2s;
        }
        div:nth-child(9) {
          top: 56px;
          left: 56px;
          animation-delay: -1.6s;
        }
      `}
      {...props}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
