import React from 'react'
import { useRouter } from 'next/router'
import { useChannel } from '../../hooks/useChannel'

function forceUserToFillName(): { name: string; id: string } {
  const answer = prompt('Dein Spielername:') ?? ''
  if (answer.length > 0) {
    const userId = Math.random().toString(36).substring(2)
    return { name: answer, id: userId }
  } else {
    return forceUserToFillName()
  }
}

export default function Room() {
  const [name, setName] = React.useState<string | undefined>(undefined)
  const [userId, setUserId] = React.useState<string | undefined>(undefined)
  const [sharedCount, setSharedCount] = React.useState(0)

  const id = useRouter().query.id?.toString()
  if (!id) throw new Error('Id of room is undefined')

  React.useEffect(() => {
    const { name, id } = forceUserToFillName()
    setName(name)
    setUserId(id)
  }, [])

  const { members, channel } = useChannel(id, name, userId)

  React.useEffect(() => {
    if (channel) {
      channel.bind('client-countup', (data: { newCount: number }) => {
        console.log('client-countup')
        setSharedCount(data.newCount)
      })
    }
  }, [channel])

  function countUp() {
    const newCount = sharedCount + 1
    channel?.trigger('client-countup', { newCount })
    // client events aren't triggered on the client sending them
    setSharedCount(newCount)
  }

  return (
    <>
      {name && name.length > 0 ? (
        <>
          <h1>Runde - {id}</h1>
          <p>
            Hi {name}! Es sind {members.length} Spieler am Tisch:
          </p>
          <ul>
            {members.map((member) => {
              return <li key={member.id}>{member.info.name}</li>
            })}
          </ul>
          <button onClick={() => countUp()}>Count up</button>
          <div>Shared count: {sharedCount}</div>
        </>
      ) : (
        'Bitte gib einen Namen ein'
      )}
    </>
  )
}
