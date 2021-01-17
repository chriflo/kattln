import { Card } from 'model/card'
import { Player } from 'model/player'
import React from 'react'
import { GameState, useGameStore } from '../contexts/game-store-provider'

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
    <div>
      <p>{me.name}</p>
      <p>Stack: {state.stack.map((card) => `${card.icon}-${card.name}`)}</p>
      <p>Aktueller Spieler: {players.find((m) => state.currentPlayerId === m.id)?.name}</p>
      <ul>
        {state.playersInGame
          .find((player) => player.id === me.id)
          ?.cards.map((card) => {
            return (
              <li key={`${card.icon}-${card.name}`}>
                <button
                  disabled={!isItMyTurn(state.currentPlayerId, me.id)}
                  onClick={() => {
                    const clickedCard = {
                      name: card.name,
                      icon: card.icon,
                    }
                    onSubmitCard(state, clickedCard)
                  }}
                >
                  {card.icon}-{card.name}
                </button>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

function findNextPlayerIndex(players: Player[], state: GameState) {
  const currentPlayerIndex = players.findIndex((member) => state.currentPlayerId === member.id)
  return currentPlayerIndex < players.length - 1 ? currentPlayerIndex + 1 : 0
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
