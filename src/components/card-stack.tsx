import React from 'react'
import { Card } from './card'

type Card = import('model/card').Card

interface CardStackProps extends React.ComponentProps<'ol'> {
  stack: Card[]
}

export function CardStack({ stack, ...props }: CardStackProps) {
  return (
    <ol css={{ position: 'relative' }} {...props}>
      {stack.map((card, i) => (
        <li
          css={{ position: 'absolute', zIndex: i, transform: `rotate(${45 * i}deg)` }}
          key={card.id}
        >
          <Card card={card} />
        </li>
      ))}
    </ol>
  )
}
