import React from 'react'
import { useRouter } from 'next/router'
import { useChannel } from '../../hooks/useChannel'

function forceUserToFillName(setName: React.Dispatch<string>, userId: string) {
  const answer = prompt('Dein Spielername:')
  if (answer.length > 0) {
    window.localStorage.setItem('name', answer)
    window.localStorage.setItem('id', userId)
    setName(answer)
  } else {
    forceUserToFillName(setName, userId)
  }
}

interface CountData {
  newCount: number
}

export default function Room() {
  const [name, setName] = React.useState(undefined)
  const [sharedCount, setSharedCount] = React.useState(0)

  const userId = Math.random().toString(36).substring(2)

  const id = useRouter().query.id?.toString()
  const { members, channel } = useChannel(id, name, userId)

  React.useEffect(() => {
    if (channel) {
      channel.bind('client-countup', (data: CountData) => {
        console.log('client-countup')
        setSharedCount(data.newCount)
      })
    }

    const savedName = window.localStorage.getItem('name')
    if (savedName) {
      setName(savedName)
    } else {
      forceUserToFillName(setName, userId)
    }
  }, [channel])

  function countUp() {
    const newCount = sharedCount + 1
    channel.trigger('client-countup', { newCount })
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
