import { GameState } from 'hooks/use-game-state'
import { Player } from 'model/player'

interface GameProps {
  me: Player
  gameState: GameState
  players: Player[]
  triggerNewGameState: (gameState: GameState) => void
}
export function Game({ me, gameState, players, triggerNewGameState }: GameProps) {
  function onClickCount() {
    if (!isItMyTurn(gameState.currentPlayerId, me.id)) return

    triggerNewGameState({
      count: gameState.count + 1,
      currentPlayerId: players[findNextPlayerIndex(players, gameState)].id,
    })
  }
  return (
    <div>
      <p>{me.name}</p>
      <button
        disabled={!isItMyTurn(gameState.currentPlayerId, me.id)}
        onClick={() => onClickCount()}
      >
        Count up
      </button>
      <div>Shared count: {gameState.count}</div>
      <p>Aktueller Spieler: {players.find((m) => gameState.currentPlayerId === m.id)?.name}</p>
    </div>
  )
}

function findNextPlayerIndex(players: Player[], gameState: GameState) {
  const currentPlayerIndex = players.findIndex((member) => gameState.currentPlayerId === member.id)
  return currentPlayerIndex < players.length - 1 ? currentPlayerIndex + 1 : 0
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
