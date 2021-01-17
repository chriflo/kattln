import { Player } from 'model/player'
import React from 'react'
import { GameState, useGameStore } from '../contexts/game-store-provider'
import { Card } from './card'

type Card = import('model/card').Card

interface GameProps {
  me: Player
}

export function Game({ me }: GameProps) {
  const { state, trigger, players } = useGameStore()
  if (!state || players.length < 1) throw Error('Invalid state in game')

  function onSubmitCard(currentState: GameState, playedCard: Card) {
    if (!isItMyTurn(currentState.currentPlayerId, me.id)) return

    const updatedPlayers = currentState.playersInGame.map((player) => {
      if (player.id === me.id) {
        return {
          ...player,
          cards: player.cards.filter(
            (c) => !(c.icon === playedCard.icon && c.name === playedCard.name),
          ),
        }
      } else {
        return player
      }
    })

    trigger({
      currentPlayerId: players[findNextPlayerIndex(players, currentState)].id,
      playersInGame: updatedPlayers,
      stack: [playedCard, ...(currentState?.stack ?? [])],
    })
  }

  return (
    <>
      <h1>{me.name}</h1>
      <p>{players.find((m) => state.currentPlayerId === m.id)?.name} ist am Zug</p>
      <h2>Stapel</h2>
      <ol css={{ display: 'flex', flexWrap: 'wrap' }}>
        {state.stack.map((card) => (
          <li key={card.id}>
            <Card card={card} />
          </li>
        ))}
      </ol>
      <h2>Karten auf der Hand</h2>
      <ul css={{ display: 'flex', flexWrap: 'wrap' }}>
        {state.playersInGame
          .find((player) => player.id === me.id)
          ?.cards.map((card) => {
            return (
              <li key={card.id}>
                <button
                  css={{ background: 'none', border: 'none' }}
                  disabled={!isItMyTurn(state.currentPlayerId, me.id)}
                  onClick={() => onSubmitCard(state, card)}
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

function findNextPlayerIndex(players: Player[], state: GameState) {
  const currentPlayerIndex = players.findIndex((member) => state.currentPlayerId === member.id)
  return currentPlayerIndex < players.length - 1 ? currentPlayerIndex + 1 : 0
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
