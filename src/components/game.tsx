import { Player } from 'model/player'
import { GameState, useGameStore } from '../contexts/game-store-provider'

interface GameProps {
  me: Player
}

export function Game({ me }: GameProps) {
  const { state, trigger, players } = useGameStore()

  function onClickCount() {
    if (!isItMyTurn(state.currentPlayerId, me.id)) return

    trigger({
      count: state.count + 1,
      currentPlayerId: players[findNextPlayerIndex(players, state)].id,
    })
  }
  return (
    <div>
      <p>{me.name}</p>
      <button disabled={!isItMyTurn(state.currentPlayerId, me.id)} onClick={() => onClickCount()}>
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
