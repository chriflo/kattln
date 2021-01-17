import { useClientTrigger, useEvent } from '@harelpls/use-pusher'
import { Card } from 'model/card'
import { Player, PlayerInGame } from 'model/player'
import { getPlayersFromMembers } from 'model/pusher-members'
import { PresenceChannel } from 'pusher-js'
import React from 'react'

export interface GameState {
  currentPlayerId: string
  playersInGame: PlayerInGame[]
  stack: Card[]
  order: string[]
  gameStage: 'choose-game' | 'playing'
  gamePlayed?: { gameType: string; player: Player }
}

interface GameStore {
  state: GameState | null
  trigger: (newGameState: GameState) => void
  players: Player[]
}
const GameStoreContext = React.createContext<GameStore | undefined>(undefined)

interface GameStoreProviderProps {
  channel: PresenceChannel | undefined
  game: JSX.Element
  lobby: JSX.Element
}
export function GameStoreProvider({ channel, game, lobby }: GameStoreProviderProps) {
  const [gameState, setGameState] = React.useState<GameState | null>(null)
  const players = getPlayersFromMembers(channel?.members)

  useEvent(channel, 'client-countup', (gameState: GameState) => setGameState(gameState))
  const trigger = useClientTrigger<GameState>(channel)

  function triggerNewGameState(newGameState: GameState) {
    trigger('client-countup', newGameState)
    // client events aren't triggered on the client sending them
    setGameState(newGameState)
  }

  return (
    <GameStoreContext.Provider value={{ state: gameState, trigger: triggerNewGameState, players }}>
      {gameState === null ? lobby : game}
    </GameStoreContext.Provider>
  )
}

export function useGameStore() {
  const context = React.useContext(GameStoreContext)
  if (!context) throw Error('useGameStore must be used within a GameStateProvider')
  return context
}
