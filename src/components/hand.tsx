import { Player } from 'model/player'
import React from 'react'
import { Card } from './card'

type Card = import('model/card').Card

interface HandProps {
  players: Player[]
  currentPlayer: Player
  isItMyTurn?: boolean
  onClick?: (card: Card) => void
}

export function Hand({ players, currentPlayer, isItMyTurn = false, onClick }: HandProps) {
  return (
    <>
      <h2>Karten auf der Hand</h2>
      <ul css={{ display: 'flex', flexWrap: 'wrap' }}>
        {players
          .find((player) => player.id === currentPlayer.id)
          ?.cards?.map((card) => {
            return (
              <li key={card.id}>
                <button
                  css={{ background: 'none', border: 'none' }}
                  disabled={!isItMyTurn}
                  onClick={() => {
                    if (onClick) {
                      onClick(card)
                    }
                  }}
                >
                  <Card card={card} />
                </button>
              </li>
            )
          })}
      </ul>
    </>
  )
}
