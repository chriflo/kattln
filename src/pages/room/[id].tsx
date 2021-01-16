import React from 'react'
import { useRouter } from 'next/router'
import { useForceUserName } from 'hooks/use-force-user-name'
import { usePresenceChannel } from '@harelpls/use-pusher'
import { Members } from 'pusher-js'
import { useGameState } from 'hooks/use-game-state'

export default function Room() {
  const id = useRouter().query.id?.toString()

  const { name: myName, id: myId } = useForceUserName()

  const { channel } = usePresenceChannel(id ? `presence-${id}` : undefined)
  const members = getMembersArray(channel?.members)

  const { gameState, triggerNewGameState } = useGameState(channel)

  function onClickStartGame() {
    const initialGameState = { count: 0, currentPlayerId: members[0].id }
    triggerNewGameState(initialGameState)
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

    const newGameState = {
      count,
      currentPlayerId: members[nextPlayer].id,
    }

    triggerNewGameState(newGameState)
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
