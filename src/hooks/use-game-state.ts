import { useClientTrigger, useEvent } from '@harelpls/use-pusher'
import { PresenceChannel } from 'pusher-js'
import React from 'react'

export interface GameState {
  count: number
  currentPlayerId: string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useGameState(channel: PresenceChannel | undefined) {
  const [gameState, setGameState] = React.useState<GameState | null>(null)

  const trigger = useClientTrigger<GameState>(channel)

  useEvent(channel, 'client-countup', (gameState: GameState) => setGameState(gameState))

  function triggerNewGameState(newGameState: GameState) {
    trigger('client-countup', newGameState)
    // client events aren't triggered on the client sending them
    setGameState(newGameState)
  }

  return { gameState, triggerNewGameState }
}
