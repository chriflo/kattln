import { useClientTrigger, useEvent } from '@harelpls/use-pusher'
import { Player } from 'model/player'
import { getPlayersFromMembers } from 'model/pusher-members'
import { PresenceChannel } from 'pusher-js'
import React from 'react'

export interface GameState {
  count: number
  currentPlayerId: string
}

const GameStateContext = React.createContext<
  { state: GameState; trigger: (newGameState: GameState) => void; players: Player[] } | undefined
>(undefined)

export function GameStoreProvider({
  channel,
  children,
}: {
  channel: PresenceChannel | undefined
  children: React.ReactNode
}) {
  const players = getPlayersFromMembers(channel?.members)
  const initialGameState: GameState = { count: 0, currentPlayerId: players[0].id }

  const [gameState, setGameState] = React.useState(initialGameState)

  useEvent(channel, 'client-countup', (gameState: GameState) => setGameState(gameState))
  const trigger = useClientTrigger<GameState>(channel)

  function triggerNewGameState(newGameState: GameState) {
    trigger('client-countup', newGameState)
    // client events aren't triggered on the client sending them
    setGameState(newGameState)
  }

  return (
    <GameStateContext.Provider value={{ state: gameState, trigger: triggerNewGameState, players }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameStore() {
  const context = React.useContext(GameStateContext)
  if (!context?.state || !context.trigger || !context.players)
    throw Error('useGameStore must be used within a GameStateProvider')
  return context
}
