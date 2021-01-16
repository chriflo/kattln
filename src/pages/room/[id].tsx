import React from 'react'
import { useRouter } from 'next/router'
import { useChannel } from '../../hooks/use-channel'
import { useForceUserName } from 'hooks/use-force-user-name'

export default function Room() {
  const { name: userName, id: userId } = useForceUserName()
  const [sharedCount, setSharedCount] = React.useState(0)

  const id = useRouter().query.id?.toString()

  const { members, channel } = useChannel(id, userName, userId)

  React.useEffect(() => {
    channel?.bind('client-countup', (data: { newCount: number }) => {
      console.log('client-countup')
      setSharedCount(data.newCount)
    })
  }, [channel])

  function countUp() {
    const newCount = sharedCount + 1
    channel?.trigger('client-countup', { newCount })
    // client events aren't triggered on the client sending them
    setSharedCount(newCount)
  }

  if (!userName) return <p>Bitte gib einen Namen ein</p>
  return (
    <p>
      <h1>Runde - {id}</h1>
      <p>
        Hi {userName}! Es sind {members.length} Spieler am Tisch:
      </p>
      <ul>
        {members.map((member) => {
          return <li key={member.id}>{member.info.name}</li>
        })}
      </ul>
      <button onClick={() => countUp()}>Count up</button>
      <div>Shared count: {sharedCount}</div>
    </p>
  )
}
