import React from 'react'
import { css } from '@emotion/react'
import { colors } from 'styles/global'

export function SinglePlayer({
  name,
  highlighted,
  itsMe,
  ...props
}: {
  name: string
  highlighted: boolean
  itsMe: boolean
}) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(${highlighted ? 1.5 : 1});
      `}
      {...props}
    >
      <PlayerIcon css={{ height: 40, width: 40 }} />
      <p
        css={css`
          display: flex;
          justify-content: center;
          padding: 4px;
          background: ${highlighted ? colors.green : colors.mint};
          color: ${highlighted ? colors.mint : colors.green};
        `}
        key={name}
      >
        {`${itsMe ? 'du - ' : ''}${name}`}
      </p>
    </div>
  )
}

export function PlayerIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect width="24" height="24" fill="none" rx="0" ry="0" />
      <path
        d="M12.65 21.4039H3.61993C2.94989 21.4039 2.39996 20.8538 2.39996 20.1738C2.39996 18.0038 3.63995 15.7639 5.40997 14.1638C5.68988 14.4438 5.97992 14.7338 6.25995 15.0139C4.69989 16.3939 3.60004 18.3339 3.60004 20.1738L11.4299 20.1838C11.84 20.5938 12.2399 20.9938 12.65 21.4039Z"
        fill="#139DB8"
      />
      <path
        d="M15.0168 12.1273C16.3634 11.1772 17.2444 9.60925 17.2444 7.83936C17.2444 4.94775 14.8928 2.59619 12.0012 2.59619C9.10962 2.59619 6.75806 4.94775 6.75806 7.83936C6.75806 9.60868 7.63849 11.1762 8.98434 12.1264C7.70322 12.482 6.46291 13.2077 5.40991 14.1638L6.25989 15.0138C7.54993 13.8538 9.15991 13.0838 10.6998 13.0838H13.2999C16.6898 13.0838 20.3999 16.7938 20.3999 20.1738C20.3999 20.1938 20.3899 20.2038 20.3799 20.2038L11.4298 20.1838C11.7224 20.4763 12.0098 20.7637 12.2994 21.0533C12.4157 21.1696 12.5324 21.2863 12.6499 21.4038H20.3799C21.0499 21.4038 21.6 20.8538 21.6 20.1738C21.6 16.7145 18.4611 13.0857 15.0168 12.1273ZM12.0645 11.8838C14.265 11.8498 16.0452 10.0487 16.0452 7.83936C16.0452 5.60986 14.2307 3.79541 12.0012 3.79541C9.77173 3.79541 7.95728 5.60986 7.95728 7.83936C7.95728 10.0487 9.73748 11.8498 11.9379 11.8838H12.0645Z
"
        fill="#FFB6B6"
      />
      <path
        d="M8.3082 21.4038H3.61987C2.94983 21.4038 2.3999 20.8538 2.3999 20.1738C2.3999 18.8416 2.86725 17.483 3.63767 16.2623L4.47558 17.1847C3.9263 18.1397 3.59998 19.1716 3.59998 20.1738L7.19501 20.1784L8.3082 21.4038Z
"
        fill="black"
      />
    </svg>
  )
}
