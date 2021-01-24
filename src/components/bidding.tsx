import { GameContext, GameEvent } from 'machines/game-machine'
import { games } from 'model/game'
import { Player } from 'model/player'
import React from 'react'
import { Sender } from 'xstate'
import { Hand } from './hand'

interface BiddingProps {
  me: Player
  context: GameContext
  send: Sender<GameEvent>
}

export function Bidding({ me, context, send }: BiddingProps) {
  const { currentPlayerId, players } = context

  function updateGameType(game: string) {
    if (!isItMyTurn(currentPlayerId, me.id)) return

    if (game === 'weiter') {
      send({ type: 'CHOOSE_GAME', gamePlayed: null, triggerId: me.id })
    } else {
      const gamePlayed = { gameType: game, player: me }
      send({ type: 'CHOOSE_GAME', gamePlayed, triggerId: me.id })
      send({ type: 'START_PLAYING', triggerId: me.id })
    }
  }

  return (
    <>
      <h1>{me.name}</h1>
      <p>{players.find((m) => currentPlayerId === m.id)?.name} ist am Zug</p>
      <GameChooser
        isItMyTurn={isItMyTurn(currentPlayerId, me.id)}
        onClick={(game) => updateGameType(game)}
      />
      <Hand players={players} currentPlayer={me} />
    </>
  )
}

interface GameChooserProps {
  isItMyTurn: boolean
  onClick: (game: string) => void
}

function GameChooser({ onClick, isItMyTurn }: GameChooserProps) {
  return (
    <ul css={{ display: 'flex' }}>
      {games.map((game) => (
        <li key={game}>
          <button disabled={!isItMyTurn} onClick={() => onClick(game)}>
            {game}
          </button>
        </li>
      ))}
      <li>
        <button disabled={!isItMyTurn} onClick={() => onClick('weiter')}>
          Weiter
        </button>
      </li>
    </ul>
  )
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
