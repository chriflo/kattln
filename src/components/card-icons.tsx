import React from 'react'
import { Icon } from 'model/card'
import { UnreachableCaseError } from 'utils/unreachable-case-error'

interface CardIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  icon: Icon
}
export function CardIcon({ icon, ...props }: CardIconProps) {
  if (icon === 'blatt') return <BlattIcon {...props} />
  if (icon === 'schelle') return <SchelleIcon {...props} />
  if (icon === 'herz') return <HerzIcon {...props} />
  if (icon === 'eichel') return <EichelIcon {...props} />
  throw new UnreachableCaseError(icon)
}

export const EichelIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 121" {...props}>
      <path d="M13 21Q13 1 33 1v51H13z" fill="#ff0" stroke="#000" />
      <path d="M33 1q20 0 20 20v31H33z" fill="red" stroke="#000" />
      <path d="M13 52h20v10H13z" fill="#0000df" stroke="#000" />
      <path d="M37 96q0 23-21 23l8-9q1-1 3-2t2-6v-6" fill="#007f00" stroke="#000" />
      <path
        d="M27 108q4.2 0 4.2 2.5 0 3.5-2.2 5.07M35 96q0 11-4 15M33 96q0 6-1.5 10"
        fill="none"
        stroke="#000"
      />
      <path d="M20 117l6-6q2-2 3 0 .5 1-1 2" fill="none" stroke="#000" />
      <path d="M33 52v10h20V52z" stroke="#000" />
      <path d="M13 62Q1 62 1 74q0 22 32 22 31 0 31-22 0-12-10-12z" fill="#007f00" stroke="#000" />
      <path
        d="M33 66.5q-4.5 0-4.5 4.5 0 6 4.5 16 4.5-10 4.5-16 0-4.5-4.5-4.5M21 89q-11-9-11-15 0-7 5-7 2 0 2 4 0 1-.5 2t-.5 2q0 5 5 14M45 89q11-9 11-15 0-7-5-7-2 0-2 4 0 1 .5 2t.5 2q0 5-5 14M33 62v34M35.86 1v95M38.7 1.8V96M41.6 2.7V95M44.4 3v92M47.3 5.4v89.2M50.1 8.8v84.9M53 62v30.6M55.8 62.3V91M58.7 63v25.6M61.6 65v19.7"
        stroke="#000"
      />
    </svg>
  )
}

export const BlattIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 73" {...props}>
      <path d="M35 54q-1 10-7 14-3 1-4 4-2-3 1-6 8-6 5-12" fill="#007f00" stroke="#000" />
      <path
        d="M33.5 54q-1 10-6 12.5M25 66c1-1 3-1 3 2M25 70.4c-.3-3.4 2-3.4 1-2.4"
        fill="none"
        stroke="#000"
      />
      <path
        d="M33 1q-9 13-21 23Q1 33.5 1 47q0 16 17 16 8 0 15-7 7 7 15 7 17 0 17-16 0-13.5-11-23Q42 14 33 1"
        fill="#007f00"
        stroke="#000"
      />
      <path
        d="M33 1v55m2-52v53.8m2-51.1v52.6M39 9v51.8m2-49.5v50.2m2-47.8V62m2-46v46.5M47 18v45m2-43.3V63m2-41.5V63m2-39.5v39.2m2-37.5v37M57 27v34.5m2-32.2v31m2-28v26.5M63 37v18.5"
        stroke="#000"
      />
      <path
        d="M28 18q10 7 18 3m-8-3q-10 7-18 3m7 1.5q-4 0-8 2.5m20-2.5q4 0 8 2.5"
        fill="none"
        stroke="#000"
      />
      <path
        transform="matrix(1.7 0 0 1 -23 12)"
        d="M28 18q10 7 18 3m-8-3q-10 7-18 3m7 1.5q-4 0-8 2.5m20-2.5q4 0 8 2.5"
        fill="none"
        stroke="#000"
      />
      <path
        transform="matrix(2 0 0 1 -33 24)"
        d="M28 18q10 7 18 3m-8-3q-10 7-18 3m7 1.5q-4 0-8 2.5m20-2.5q4 0 8 2.5"
        fill="none"
        stroke="#000"
      />
    </svg>
  )
}
export const HerzIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 64" {...props}>
      <path
        d="M33 64q-9-14-21-24Q1 30.5 1 17 1 1 18 1q8 0 15 7 7-7 15-7 17 0 17 16 0 13.5-11 23-12 10-21 24"
        fill="#df0000"
        stroke="#000"
      />
      <path
        d="M33 8v56m2-57.8V61m2-56.3V58m2-54.3v52m2-52.9v50.5M43 2v49m2-49.5v47.1M47 1v45.4M49 1v43.3M51 1v41.4m2-41.1v39.2m2-38.8v37.1m2-36.3V37m2-33.3v31m2-29.5v27.1M63 8v20"
        stroke="#000"
      />
    </svg>
  )
}
export const SchelleIcon = (props: React.ComponentProps<'svg'>) => {
  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 72" {...props}>
      <circle cx="33" cy="65" r="5" stroke="#000" fill="#007f00" />
      <path d="M33 65v5M35 65v4M37 65v3" stroke="#000" />
      <circle cx="33" cy="33" r="32" fill="#ff0" />
      <path d="M2.5 23h61q3.5 10 0 20h-61q-3.5-10 0-20" fill="red" />
      <path d="M63 23v20" fill="none" stroke="#000" />
      <path
        d="M6 43v7M9 43v11M12 43v11M15 43v11M18 43v11M21 43v11M24 43v11M27 43v11M30 43v11M33 23v31M36 23v31M39 23v31M42 23v31M45 23v31M48 23v31M51 23v31M54 23v31M57 23v31M60 23v27"
        stroke="#000"
      />
      <path
        d="M27 48q-1.5-2.5-8-5-4 2-4 7l14 15M39 48q1.5-2.5 8-5 4 2 4 7L37 65"
        stroke="#000"
        fill="#007f00"
      />
      <path d="M29 65q-9-15 4-22 13 7 4 22" stroke="#000" fill="#007f00" />
      <path d="M3.1 43h-.3q3.7 17 26.6 22" fill="#007f00" />
      <path d="M29 65q-8-13-14-15-7-3-12.2-7" stroke="#000" fill="#007f00" />
      <path d="M62.9 43h.3q-3.7 17-26.6 22" fill="#007f00" />
      <path d="M37 65q8-13 14-15 7-3 12.2-7" stroke="#000" fill="#007f00" />
      <path d="M33 43v22" stroke="#000" />
      <circle cx="33" cy="33" r="32" stroke="#000" fill="none" />
      <path d="M33 1v5.2M35 1.2V6M31 1.2V6M37 1.2V5M29 1.2V5" stroke="#000" />
      <path d="M28 1.2q0 5.3 5 5.3t5-5.3" fill="none" stroke="#000" />
      <path
        d="M2.8 23h60.4M2.8 43h60.4M33 3h11.5M33 6h17M33 9h21M33 12h24M33 15h26.5M33 18h28M33 21h30"
        stroke="#000"
      />
      <circle cx="10" cy="33" r="5" stroke="#000" fill="none" />
      <path d="M5 33h10M5.2 31h9.6M5.2 35h9.6M6.8 29h6.4M6.8 37h6.4" stroke="#000" />
      <circle cx="33" cy="33" r="5" stroke="#000" fill="none" />
      <path d="M28 33h10M28.2 31h9.6M28.2 35h9.6M29.8 29h6.4M29.8 37h6.4" stroke="#000" />
      <circle cx="56" cy="33" r="5" stroke="#000" fill="none" />
      <path
        d="M51 33h10M51.2 31h9.6M51.2 35h9.6M52.8 29h6.4M52.8 37h6.4M33 63h11.5M33 60h17M33 57h21M33 54h24M33 51h26.5M33 48h28M33 45h30"
        stroke="#000"
      />
    </svg>
  )
}
