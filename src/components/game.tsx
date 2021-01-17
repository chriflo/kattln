import { Player, PlayerInGame } from 'model/player'
import React from 'react'
import { GameState, useGameStore } from '../contexts/game-store-provider'
import { Card } from './card'

type Card = import('model/card').Card

interface GameProps {
  me: Player
}

export function Game({ me }: GameProps) {
  const { state, trigger } = useGameStore()
  if (!state) throw Error('Invalid state in game')

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
      currentPlayerId: currentState.order[findNextPlayerIndex(currentState)],
      playersInGame: updatedPlayers,
      stack: [playedCard, ...(currentState?.stack ?? [])],
      order: currentState.order,
    })
  }

  return (
    <>
      <h1>{me.name}</h1>
      <p>{state.playersInGame.find((m) => state.currentPlayerId === m.id)?.name} ist am Zug</p>
      <CardStack stack={state.stack}></CardStack>
      <Hand
        players={state.playersInGame}
        currentPlayer={me}
        disabled={!isItMyTurn(state.currentPlayerId, me.id)}
        onClick={(card: Card) => onSubmitCard(state, card)}
      ></Hand>
    </>
  )
}

interface CardStackProps {
  stack: Card[]
}

function CardStack({ stack }: CardStackProps) {
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

interface HandProps {
  players: PlayerInGame[]
  currentPlayer: Player
  disabled: boolean
  onClick: (card: Card) => void
}

function Hand({ players, currentPlayer, disabled, onClick }: HandProps) {
  return (
    <>
      <h2>Karten auf der Hand</h2>
      <ul css={{ display: 'flex', flexWrap: 'wrap' }}>
        {players
          .find((player) => player.id === currentPlayer.id)
          ?.cards.map((card) => {
            return (
              <li key={card.id}>
                <button
                  css={{ background: 'none', border: 'none' }}
                  disabled={disabled}
                  onClick={() => onClick(card)}
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

function findNextPlayerIndex(state: GameState) {
  const currentPlayerIndex = state.order.findIndex((id) => state.currentPlayerId === id)
  return currentPlayerIndex < state.order.length - 1 ? currentPlayerIndex + 1 : 0
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
