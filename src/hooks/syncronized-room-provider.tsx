import { useClientTrigger, useEvent, usePresenceChannel } from '@harelpls/use-pusher'
import { useMachine } from '@xstate/react'
import { gameMachine } from 'machines/game-machine'
import { GameContext, GameEvent } from 'machines/machine-model'
import { Player } from 'model/player'
import { getPlayersFromMembers, PusherMember } from 'model/pusher-members'
import { PresenceChannel } from 'pusher-js'
import React from 'react'
import { Sender, State } from 'xstate'

interface SyncronizedRoomProviderProps {
  roomId?: string
  me: Player
  children: React.ReactNode
  stateOverride?: State<GameContext, GameEvent>
}
export function SyncronizedRoomProvider({
  roomId,
  me,
  children,
  stateOverride,
}: SyncronizedRoomProviderProps) {
  const [appState] = React.useState(() => {
    if (typeof window === 'undefined') return undefined

    return JSON.parse(getWithExpiry('app-state')) as State<GameContext, GameEvent>
  })

  const [state, send] = useMachine<GameContext, GameEvent>(
    gameMachine.withContext(
      stateOverride
        ? stateOverride.context
        : appState
        ? appState.context
        : {
            myId: me.id,
            players: [me],
            stack: [],
            gamePlayed: null,
            highlightCurrentPlayer: false,
            playerThatStartedRound: null,
            unavailablePlayers: [],
          },
    ),
    { state: stateOverride ? stateOverride : appState ? appState : undefined },
  )

  const { myId } = state.context
  const { channel } = usePresenceChannel(roomId ? `presence-${roomId}` : undefined)

  useSynchronization(myId, send, state, channel)

  return (
    <SynchronizedRoom.Provider value={{ state: state, me, send, roomId }}>
      {children}
    </SynchronizedRoom.Provider>
  )
}

const SynchronizedRoom = React.createContext<
  | { me: Player; roomId?: string; state: State<GameContext, GameEvent>; send: Sender<GameEvent> }
  | undefined
>(undefined)

export function useSynchronizedRoom() {
  const context = React.useContext(SynchronizedRoom)

  if (context === undefined) {
    throw Error('useSynchronizedRoom must be used within a SyncronizedRoomProvider')
  }

  return context
}

function setWithExpiry(key: string, value: unknown, ttl: number) {
  const now = new Date()

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export function getWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key)
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)
  const now = new Date()
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key)
    return null
  }
  return item.value
}

function useSynchronization(
  myId: string,
  send: Sender<GameEvent>,
  state: State<GameContext, GameEvent>,
  channel?: PresenceChannel,
) {
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
    if (
      state.event.type === 'UPDATE_PLAYERS' ||
      state.event.type === 'PLAYER_LEFT' ||
      state.event.type === 'PLAYER_ADDED'
    )
      return
    if (state.event.triggerId === myId) {
      trigger('client-promote-event', { event: state.event, triggerId: myId })
    }

    const jsonState = JSON.stringify(state)

    try {
      state.matches('inGame') && setWithExpiry('app-state', jsonState, 5 * 60000)
    } catch (e) {
      console.error("couldn't save state to local storage", e)
    }
  }, [state, myId, trigger])

  const members = getPlayersFromMembers(channel?.members)

  const [bound, setBound] = React.useState(false)
  React.useEffect(() => {
    if (!bound && channel) {
      channel?.bind('pusher:member_removed', (member: PusherMember) => {
        send({ type: 'PLAYER_LEFT', player: { name: member.info.name, id: member.id } })
      })
      channel?.bind('pusher:member_added', (member: PusherMember) => {
        send({ type: 'PLAYER_ADDED', player: { name: member.info.name, id: member.id } })
      })
      setBound(true)
    }
  }, [channel, members, send, myId, bound])

  React.useEffect(() => {
    if (state.context.players.length !== members.length) {
      send({ type: 'UPDATE_PLAYERS', players: members })
    }
  }, [members, send, state.context.players.length])
}
