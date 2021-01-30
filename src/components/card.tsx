import { css } from '@emotion/react'
import React from 'react'
import { Icon } from 'model/card'
import { UnreachableCaseError } from 'utils/unreachable-case-error'
import { EichelIcon, BlattIcon, HerzIcon, SchelleIcon } from './card-icons'

type Card = import('model/card').Card

export const cardHeight = 150

interface CardProps extends React.ComponentProps<'button'> {
  card: Card
}

export const Card = ({ card, ...props }: CardProps) => {
  const Icon = getIconComponent(card.icon)

  const nameAndIcon = {
    icon: Icon,
    name: card.name,
  }
  return (
    <button css={{ border: 'none', background: 'none', padding: 0 }} {...props}>
      <figure css={cardStyles}>
        <HalfCard {...nameAndIcon} css={{ top: '3%', left: '6%' }} />
        <HalfCard
          {...nameAndIcon}
          css={{ bottom: '3%', right: '6%', transform: 'rotate(180deg)' }}
        />
      </figure>
    </button>
  )
}

const HalfCard = ({
  icon: Icon,
  name,
  ...props
}: {
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element
  name: string
}) => {
  return (
    <div css={iconAndNameStyles} {...props}>
      <Icon css={{ height: '100%' }} />
      {name}
    </div>
  )
}

function getIconComponent(icon: Icon) {
  switch (icon) {
    case 'eichel':
      return EichelIcon
    case 'blatt':
      return BlattIcon
    case 'herz':
      return HerzIcon
    case 'schelle':
      return SchelleIcon
    default:
      throw new UnreachableCaseError(icon)
  }
}

const cardStyles = css`
  width: ${cardHeight / 2}px;
  height: ${cardHeight}px;
  border: 2px solid black;
  border-radius: 5px;
  position: relative;
  background: white;

  &::after {
    content: '';
    width: 100%;
    background: black;
    height: 1px;
    top: 50%;
    position: absolute;
    left: 0;
  }
`

const iconAndNameStyles = css`
  position: absolute;
  height: 10%;
  display: flex;
  align-items: baseline;
  font-size: 24px;
`
