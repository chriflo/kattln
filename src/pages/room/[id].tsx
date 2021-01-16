import React from 'react'
import { useRouter } from 'next/router'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useClientTrigger, useEvent, usePresenceChannel } from '@harelpls/use-pusher'
import { Members } from 'pusher-js'

interface SharedCount {
  newCount: number
}
export default function Room() {
  const { name: userName } = useForceUserName()
  const [sharedCount, setSharedCount] = React.useState(0)

  const id = useRouter().query.id?.toString()

  const { channel, myID } = usePresenceChannel(id ? `presence-${id}` : undefined)
  const members = getMembersArray(channel?.members)

  useEvent(channel, 'client-countup', ({ newCount }: { newCount: number }) =>
    setSharedCount(newCount),
  )
  const trigger = useClientTrigger<SharedCount>(channel)

  function onClickCount() {
    const newCount = sharedCount + 1
    trigger('client-countup', { newCount })
    // client events aren't triggered on the client sending them
    setSharedCount(newCount)
  }

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
      <button onClick={() => onClickCount()}>Count up</button>
      <div>Shared count: {sharedCount}</div>
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
