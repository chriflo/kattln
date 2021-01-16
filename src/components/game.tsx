import { Player } from 'model/player'
import React from 'react'
import { GameState, useGameStore } from '../contexts/game-store-provider'

interface GameProps {
  me: Player
}

export function Game({ me }: GameProps) {
  const [value, setValue] = React.useState(1)
  const { state, trigger, players } = useGameStore()
  if (!state || players.length < 1) throw Error('Invalid state in game')

  function onClickCount(currentState: GameState) {
    if (!isItMyTurn(currentState.currentPlayerId, me.id)) return

    trigger({
      count: currentState.count + value,
      currentPlayerId: players[findNextPlayerIndex(players, currentState)].id,
    })
  }

  return (
    <div>
      <p>{me.name}</p>
      <input
        value={value}
        type="number"
        required
        onChange={(e) => {
          const number = parseInt(e.target.value)
          setValue(number)
        }}
      />
      <button
        disabled={!isItMyTurn(state.currentPlayerId, me.id)}
        onClick={() => onClickCount(state)}
      >
        Count up
      </button>
      <div>Shared count: {state.count}</div>
      <p>Aktueller Spieler: {players.find((m) => state.currentPlayerId === m.id)?.name}</p>
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
