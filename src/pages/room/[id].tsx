import { useMachine } from '@xstate/react'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useSyncronizedRoom } from 'hooks/use-syncronized-room'
import { gameMachine } from 'machines/game-machine'
import { useRouter } from 'next/router'
import React from 'react'

export default function Room() {
  const id = useRouter().query.id?.toString()
  const [state, send] = useMachine(gameMachine)
  const me = useForceUserName()

  useSyncronizedRoom(state, send, me.id, id)

  if (!id) return 'No room no party...'
  if (state.matches('lobby')) {
    return <Lobby me={me} roomId={id} state={state} send={send} />
  }
  if (state.matches('bidding')) {
    return <Game me={me} state={state} send={send} />
  }
  return 'No state no party :('
}
