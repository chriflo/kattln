import { usePresenceChannel, useClientTrigger, useEvent } from '@harelpls/use-pusher'
import { GameContext, GameEvent } from 'machines/game-machine'
import { getPlayersFromMembers } from 'model/pusher-members'
import React from 'react'
import { Sender, State } from 'xstate'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useSyncronizedRoom(
  state: State<GameContext, GameEvent>,
  send: Sender<GameEvent>,
  roomId?: string,
) {
  const { myId } = state.context
  const { channel } = usePresenceChannel(roomId ? `presence-${roomId}` : undefined)

  const trigger = useClientTrigger<{ event: GameEvent; triggerId: string }>(channel)

  useEvent(
    channel,
    'client-promote-event',
    ({ event, triggerId }: { event: GameEvent; triggerId: string }) => {
      if (triggerId !== myId) {
        send(event)
      }
    },
  )

  React.useEffect(() => {
    if (state.event.type === 'UPDATE_PLAYERS') return
    if (state.event.triggerId === myId) {
      trigger('client-promote-event', { event: state.event, triggerId: myId })
    }
  }, [state, myId, trigger])

  const members = getPlayersFromMembers(channel?.members)

  React.useEffect(() => {
    if (members.length < 2) return
    if (state.context.players.length !== members.length) {
      send({ type: 'UPDATE_PLAYERS', players: members })
    }
  }, [members, send, state.context.players.length])
}
