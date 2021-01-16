import React from 'react'
import { useRouter } from 'next/router'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useClientTrigger, useEvent, usePresenceChannel } from '@harelpls/use-pusher'
import { Members } from 'pusher-js'

interface GameState {
  count: number
  currentPlayerId: string
}
export default function Room() {
  const { name: myName, id: myId } = useForceUserName()
  const [gameState, setGameState] = React.useState<GameState | null>(null)

  const id = useRouter().query.id?.toString()

  const { channel } = usePresenceChannel(id ? `presence-${id}` : undefined)
  const members = getMembersArray(channel?.members)

  useEvent(channel, 'client-countup', (gameState: GameState) => setGameState(gameState))
  const trigger = useClientTrigger<GameState>(channel)

  function onClickStartGame() {
    const initialGameState = { count: 0, currentPlayerId: members[0].id }
    trigger('client-countup', initialGameState)
    // client events aren't triggered on the client sending them
    setGameState(initialGameState)
  }

  if (!gameState)
    return (
      <div>
        <h1>Runde - {id}</h1>
        <p>
          Hi {myName}! Es sind {members.length} Spieler am Tisch:
        </p>
        <ul>
          {members.map((member) => {
            return (
              <li key={member.id}>
                {member.info.name} - {member.id}
              </li>
            )
          })}
        </ul>
        <button onClick={onClickStartGame}>Start game</button>
      </div>
    )

  function onClickCount() {
    if (gameState?.currentPlayerId !== myId) return
    const count = (gameState?.count ?? 0) + 1
    const currentPlayerIndex = members.findIndex(
      (member) => gameState?.currentPlayerId === member.id,
    )
    const nextPlayer = currentPlayerIndex < members.length - 1 ? currentPlayerIndex + 1 : 0
    const nextPlayerId = members[nextPlayer].id
    trigger('client-countup', {
      count,
      currentPlayerId: members[nextPlayer].id,
    })
    // client events aren't triggered on the client sending them
    setGameState({ count, currentPlayerId: nextPlayerId })
  }
  return (
    <div>
      <p>{myName}</p>
      <button onClick={() => onClickCount()}>Count up</button>
      <div>Shared count: {gameState.count}</div>
      <p>Aktueller Spieler: {members.find((m) => gameState.currentPlayerId === m.id)?.info.name}</p>
    </div>
  )
}

interface PusherMember {
  id: string
  info: {
    name: string
  }
}
function getMembersArray(pusherMembers?: Members) {
  if (!pusherMembers) return []

  const newMembers: PusherMember[] = []
  pusherMembers.each((member: PusherMember) => newMembers.push(member))
  return newMembers
}
