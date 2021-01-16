import React from 'react'
import { useRouter } from 'next/router'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useClientTrigger, useEvent, usePresenceChannel } from '@harelpls/use-pusher'
import { Members } from 'pusher-js'

interface GameState {
  count: number
}
export default function Room() {
  const { name: userName } = useForceUserName()
  const [gameState, setGameState] = React.useState<GameState | null>(null)

  const id = useRouter().query.id?.toString()

  const { channel, myID } = usePresenceChannel(id ? `presence-${id}` : undefined)
  const members = getMembersArray(channel?.members)

  useEvent(channel, 'client-countup', ({ count }: GameState) => setGameState({ count }))
  const trigger = useClientTrigger<GameState>(channel)

  function onClickStartGame() {
    trigger('client-countup', { count: 0 })
    setGameState({ count: 0 })
  }

  if (!gameState)
    return (
      <div>
        <h1>Runde - {id}</h1>
        <p>
          Hi {userName} {myID}! Es sind {members.length} Spieler am Tisch:
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
    const count = (gameState?.count ?? 0) + 1
    console.log(count)
    trigger('client-countup', { count })
    // client events aren't triggered on the client sending them
    setGameState({ count })
  }
  return (
    <div>
      <button onClick={() => onClickCount()}>Count up</button>
      <div>Shared count: {gameState.count}</div>
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
