import { GameContext, GameEvent, isItMyTurn } from 'machines/game-machine'
import { games, WEITER } from 'model/game'
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
  const { players } = context

  function updateGameType(game: string) {
    if (!isItMyTurn(context)) return

    const gamePlayed = { gameType: game, player: me }
    send({ type: 'CHOOSE_GAME', gamePlayed, triggerId: me.id })
  }

  return (
    <>
      <GameChooser
        isItMyTurn={isItMyTurn(context)}
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
        <button disabled={!isItMyTurn} onClick={() => onChooseGame(WEITER)}>
          Weiter
        </button>
      </li>
    </ul>
  )
}
