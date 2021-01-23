import { usePresenceChannel } from '@harelpls/use-pusher'
import { useMachine } from '@xstate/react'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { gameMachine, GameStoreProvider } from 'contexts/game-store-provider'
import { useForceUserName } from 'hooks/use-force-user-name'
import { PusherMember } from 'model/pusher-members'
import { useRouter } from 'next/router'
import React from 'react'

export default function Room() {
  const [state, send] = useMachine(gameMachine)

  const id = useRouter().query.id?.toString()

  const me = useForceUserName()
  const { channel } = usePresenceChannel(id ? `presence-${id}` : undefined)

  React.useEffect(() => {
    channel?.bind('pusher:member_added', function (member: PusherMember) {
      send({ type: 'ADD_PLAYER', player: { id: member.id, name: member.info.name, cards: [] } })
    })
  }, [channel, send])

  if (!id) return 'No room no party...'
  return (
    <GameStoreProvider
      channel={channel}
      game={<Game me={me} />}
      lobby={<Lobby me={me} roomId={id} />}
    />
  )
}
