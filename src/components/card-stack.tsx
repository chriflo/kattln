import React from 'react'
import { Card } from './card'

type Card = import('model/card').Card

interface CardStackProps {
  stack: Card[]
}

export function CardStack({ stack }: CardStackProps) {
  return (
    <>
      <h2>Stapel</h2>
      <ol css={{ display: 'flex', flexWrap: 'wrap' }}>
        {stack.map((card) => (
          <li key={card.id}>
            <Card card={card} />
          </li>
        ))}
      </ol>
    </>
  )
}
