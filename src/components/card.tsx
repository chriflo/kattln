import { css } from '@emotion/react'
import React from 'react'
import { CardIcon } from './card-icons'

type Card = import('model/card').Card

export const cardHeight = 150

interface CardProps extends React.ComponentProps<'button'> {
  card: Card
}

export const Card = ({ card, ...props }: CardProps) => {
  return (
    <button css={{ border: 'none', background: 'none', padding: 0 }} {...props}>
      <figure css={cardStyles}>
        <HalfCard card={card} css={{ top: '3%', left: '6%' }} />
        <HalfCard card={card} css={{ bottom: '3%', right: '6%', transform: 'rotate(180deg)' }} />
      </figure>
    </button>
  )
}

const HalfCard = ({ card, ...props }: { card: Card }) => {
  return (
    <div css={iconAndNameStyles} {...props}>
      <CardIcon icon={card.icon} css={{ height: '100%' }} />
      {card.name}
    </div>
  )
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
