import { css } from '@emotion/react'
import { Player } from 'model/player'
import React from 'react'
import { Card, cardHeight } from './card'

type Card = import('model/card').Card

const overlap = 40

interface HandProps {
  players: Player[]
  currentPlayer: Player
  isItMyTurn?: boolean
  onClickCard: ((card: Card) => void) | null
}

export function Hand({ players, currentPlayer, isItMyTurn = false, onClickCard }: HandProps) {
  const cards = players.find((player) => player.id === currentPlayer.id)?.cards ?? []
  return (
    <>
      <div
        css={css`
          width: ${overlap * cards.length - 1 + cardHeight - overlap}px;
          margin: '0 auto';
          height: ${cardHeight}px;
          position: absolute;
          bottom: -${cardHeight / 2}px;
        `}
      >
        <StackedCards
          isItMyTurn={isItMyTurn}
          cards={cards}
          totalCards={cards.length}
          onClickCard={onClickCard}
        />
      </div>
    </>
  )
}

function StackedCards({
  cards,
  isItMyTurn,
  onClickCard,
  totalCards,
}: Pick<HandProps, 'isItMyTurn' | 'onClickCard'> & { cards: Card[]; totalCards: number }) {
  const cardProps = {
    css: {
      top: 0,
      position: 'absolute' as const,
      margin: `0 0 0 ${overlap}px`,
    },
    card: cards[cards.length - 1],
    isItMyTurn: Boolean(isItMyTurn),
    onClickCard,
  }

  if (cards.length === 0) return <></>
  if (cards.length === 1) return <ClickableCard {...cardProps} />

  return (
    <ClickableCard {...cardProps}>
      <StackedCards
        cards={cards.slice(0, cards.length - 1)}
        isItMyTurn={isItMyTurn}
        onClickCard={onClickCard}
        totalCards={totalCards}
      />
    </ClickableCard>
  )
}

function ClickableCard({
  card,
  isItMyTurn,
  onClickCard,
  children,
  ...props
}: React.ComponentProps<'div'> & Pick<HandProps, 'isItMyTurn' | 'onClickCard'> & { card: Card }) {
  return (
    <div {...props}>
      <Card card={card} disabled={!isItMyTurn} onClick={() => onClickCard && onClickCard(card)} />
      {children ? children : null}
    </div>
  )
}
