import { useClientTrigger, useEvent, usePresenceChannel } from '@harelpls/use-pusher'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { GameStoreProvider } from 'contexts/game-store-provider'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useStartGame } from 'hooks/use-start-game'
import { getPlayersFromMembers } from 'model/pusher-members'
import { useRouter } from 'next/router'
import React from 'react'

export default function Room() {
  const id = useRouter().query.id?.toString()

  const me = useForceUserName()
  const { channel } = usePresenceChannel(id ? `presence-${id}` : undefined)
  const { gameStarted, onStartGame } = useStartGame(channel)

  const players = getPlayersFromMembers(channel?.members)

  if (!id) return 'No room no party...'
  if (gameStarted && me.id)
    return (
      <GameStoreProvider channel={channel}>
        <Game me={me} />
      </GameStoreProvider>
    )

  return <Lobby me={me} onStartGame={onStartGame} players={players} roomId={id} />
}
