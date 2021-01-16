import { usePresenceChannel } from '@harelpls/use-pusher'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { GameStoreProvider } from 'contexts/game-store-provider'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useRouter } from 'next/router'
import React from 'react'

export default function Room() {
  const id = useRouter().query.id?.toString()

  const me = useForceUserName()
  const { channel } = usePresenceChannel(id ? `presence-${id}` : undefined)

  if (!id) return 'No room no party...'
  return (
    <GameStoreProvider
      channel={channel}
      game={<Game me={me} />}
      lobby={<Lobby me={me} roomId={id} />}
    />
  )
}
