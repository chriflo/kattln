import { games } from 'model/game'
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
      ...currentState,
      currentPlayerId: currentState.order[findNextPlayerIndex(currentState)],
      playersInGame: updatedPlayers,
      stack: [playedCard, ...(currentState?.stack ?? [])],
    })
  }

  function updateGameType(currentState: GameState, game: string) {
    if (!isItMyTurn(currentState.currentPlayerId, me.id)) return

    if (game === 'weiter') {
      trigger({
        ...currentState,
        currentPlayerId: currentState.order[findNextPlayerIndex(currentState)],
      })
    } else {
      trigger({
        ...currentState,
        gameStage: 'playing',
        gamePlayed: { gameType: game, player: me },
      })
    }
  }

  return (
    <>
      <h1>{me.name}</h1>
      <p>{state.playersInGame.find((m) => state.currentPlayerId === m.id)?.name} ist am Zug</p>
      {state.gameStage === 'choose-game' && (
        <GameChooser
          disabled={!isItMyTurn(state.currentPlayerId, me.id)}
          onClick={(game) => updateGameType(state, game)}
        ></GameChooser>
      )}
      {state.gameStage === 'playing' && (
        <>
          <p>
            {state.gamePlayed?.player.name} spielt {state.gamePlayed?.gameType}
          </p>
          <CardStack stack={state.stack}></CardStack>
        </>
      )}
      <Hand
        players={state.playersInGame}
        currentPlayer={me}
        disabled={!isItMyTurn(state.currentPlayerId, me.id)}
        onClick={(card: Card) => onSubmitCard(state, card)}
      ></Hand>
    </>
  )
}

interface GameChooserProps {
  disabled: boolean
  onClick: (game: string) => void
}

function GameChooser({ onClick, disabled }: GameChooserProps) {
  return (
    <ul css={{ display: 'flex' }}>
      {games.map((game) => (
        <li key={game}>
          <button disabled={disabled} onClick={() => onClick(game)}>
            {game}
          </button>
        </li>
      ))}
      <li>
        <button disabled={disabled} onClick={() => onClick('weiter')}>
          Weiter
        </button>
      </li>
    </ul>
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
