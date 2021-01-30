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
      <GameChooser
        isItMyTurn={isItMyTurn(currentPlayerId, me.id)}
        onChooseGame={(game) => updateGameType(game)}
        css={{ flexGrow: 1 }}
      />
      {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
      <Hand players={players} currentPlayer={me} onClickCard={() => {}} />
    </>
  )
}

interface GameChooserProps extends React.ComponentProps<'ul'> {
  isItMyTurn: boolean
  onChooseGame: (game: string) => void
}

function GameChooser({ onChooseGame, isItMyTurn, ...props }: GameChooserProps) {
  return (
    <ul
      css={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
      {...props}
    >
      {games.map((game) => (
        <li key={game}>
          <button disabled={!isItMyTurn} onClick={() => onChooseGame(game)}>
            {game}
          </button>
        </li>
      ))}
      <li>
        <button disabled={!isItMyTurn} onClick={() => onChooseGame('weiter')}>
          Weiter
        </button>
      </li>
    </ul>
  )
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
