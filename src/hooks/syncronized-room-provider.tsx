import { useClientTrigger, useEvent, usePresenceChannel } from '@harelpls/use-pusher'
import { GameEvent, SetGameState, useGameState } from 'machines/game-state-reducer'
import { GameState } from 'machines/machine-model'
import { Player } from 'model/player'
import { getPlayersFromMembers, PusherMember } from 'model/pusher-members'
import { PresenceChannel } from 'pusher-js'
import React from 'react'
import { setWithExpiry } from 'utils/local-storage-with-expiry'

interface SyncronizedRoomProviderProps {
  roomId?: string
  me: Player
  children: React.ReactNode
  stateOverride?: GameState
}
export function SyncronizedRoomProvider({
  roomId,
  me,
  children,
  stateOverride,
}: SyncronizedRoomProviderProps) {
  const { gameState, setGameState } = useGameState(me, stateOverride, roomId)
  const { channel } = usePresenceChannel(roomId ? `presence-${roomId}` : undefined)

  useSynchronization(me.id, setGameState, gameState, roomId, channel)

  return (
    <SynchronizedRoom.Provider value={{ state: gameState, me, send: setGameState, roomId }}>
      {children}
    </SynchronizedRoom.Provider>
  )
}

const SynchronizedRoom =
  React.createContext<
    { me: Player; roomId?: string; state: GameState; send: SetGameState } | undefined
  >(undefined)

export function useSynchronizedRoom() {
  const context = React.useContext(SynchronizedRoom)

  if (context === undefined) {
    throw Error('useSynchronizedRoom must be used within a SyncronizedRoomProvider')
  }

  return context
}

function useSynchronization(
  myId: string,
  send: SetGameState,
  state: GameState,
  roomId?: string,
  channel?: PresenceChannel,
) {
  const trigger = useClientTrigger<{ event: GameEvent; triggerId: string }>(channel)

  useEvent(
    channel,
    'client-promote-shared-state',
    ({ event, triggerId }: { event: GameEvent; triggerId: string }) => {
      if (triggerId !== myId) {
        send(event)
      }
    },
  )

  React.useEffect(() => {
    if (
      state.lastEvent === 'UPDATE_PLAYERS_IN_LOBBY' ||
      state.lastEvent === 'PLAYER_LEFT_IN_GAME' ||
      state.lastEvent === 'PLAYER_ADDED_IN_GAME'
    )
      return
    if (state.triggerId === myId) {
      trigger('client-promote-shared-state', {
        event: { type: 'SHARE_STATE', gameState: state, triggerId: myId },
        triggerId: myId,
      })
    }
  }, [myId, trigger, state])

  const jsonState = JSON.stringify(state)

  try {
    roomId &&
      state.name.startsWith('inGame') &&
      setWithExpiry(`app-state-${roomId}`, jsonState, 5 * 60000)
  } catch (e) {
    console.error("couldn't save state to local storage", e)
  }

  const members = getPlayersFromMembers(channel?.members)

  const [bound, setBound] = React.useState(false)
  React.useEffect(() => {
    if (!bound && channel) {
      channel?.bind('pusher:member_removed', (member: PusherMember) => {
        state.name.startsWith('inGame') &&
          send({ type: 'PLAYER_LEFT_IN_GAME', player: { name: member.info.name, id: member.id } })
      })
      channel?.bind('pusher:member_added', (member: PusherMember) => {
        state.name.startsWith('inGame') &&
          send({ type: 'PLAYER_ADDED_IN_GAME', player: { name: member.info.name, id: member.id } })
      })
      setBound(true)
    }
  }, [channel, members, send, myId, bound, state.name])

  React.useEffect(() => {
    if (state.players.length !== members.length) {
      state.name === 'lobby' && send({ type: 'UPDATE_PLAYERS_IN_LOBBY', players: members })
    }
  }, [members, send, state.players.length, state.name])
}
