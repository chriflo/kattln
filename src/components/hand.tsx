import { css } from '@emotion/react'
import { normalSortCards } from 'model/card'
import { Player } from 'model/player'
import React from 'react'
import { mediaQuery } from 'styles/global'
import { Card, cardHeightDesktop, cardHeightMobile } from './card'

type Card = import('model/card').Card

const overlapMobile = 40
const overlapDesktop = 60

interface HandProps {
  players: Player[]
  currentPlayer: Player
  isItMyTurn?: boolean
  onClickCard: ((card: Card) => void) | null
}

export function Hand({ players, currentPlayer, isItMyTurn = false, onClickCard }: HandProps) {
  const cards =
    players.find((player) => player.id === currentPlayer.id)?.cards?.sort(normalSortCards) ?? []
  return (
    <div css={styles.overLappingCardsWrapper(cards)}>
      <StackedCards
        isItMyTurn={isItMyTurn}
        cards={cards}
        totalCards={cards.length}
        onClickCard={onClickCard}
      />
    </div>
  )
}

function StackedCards({
  cards,
  isItMyTurn,
  onClickCard,
  totalCards,
}: Pick<HandProps, 'isItMyTurn' | 'onClickCard'> & { cards: Card[]; totalCards: number }) {
  const cardProps = {
    css: styles.stackedCard,
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

const styles = {
  overLappingCardsWrapper: (cards: Card[]) => css`
    width: ${overlapMobile * cards.length - 1 + cardHeightMobile - overlapMobile}px;
    margin: '0 auto';
    height: ${cardHeightMobile}px;
    position: absolute;
    bottom: -${cardHeightMobile / 2}px;

    ${mediaQuery.medium} {
      width: ${overlapDesktop * cards.length - 1 + cardHeightDesktop - overlapDesktop}px;
      height: ${cardHeightDesktop}px;
      bottom: -${cardHeightDesktop / 2}px;
    }
  `,
  stackedCard: css`
    top: 0;
    position: absolute;
    margin: 0 0 0 ${overlapMobile}px;

    ${mediaQuery.medium} {
      margin: 0 0 0 ${overlapDesktop}px;
    }
  `,
}
