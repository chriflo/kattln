import { useClientTrigger, useEvent } from '@harelpls/use-pusher'
import { PresenceChannel } from 'pusher-js'
import React from 'react'

export function useStartGame(channel: PresenceChannel | undefined) {
  const [gameStarted, setGameStarted] = React.useState(false)
  const trigger = useClientTrigger(channel)
  useEvent(channel, 'client-start-game', () => setGameStarted(true))

  function onStartGame() {
    trigger('client-start-game', {})
    // client events aren't triggered on the client sending them
    setGameStarted(true)
  }

  return { gameStarted, onStartGame }
}
