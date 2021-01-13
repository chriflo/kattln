import React from 'react'
import { useRouter } from 'next/router'
import { useChannel } from '../../hooks/useChannel'
import { useRecoilState } from 'recoil'
import { sharedCountState } from 'atoms'

function forceUserToFillName(): { name: string; id: string } {
  const answer = window.prompt('Dein Spielername:') ?? ''
  if (answer.length > 0) {
    const userId = Math.random().toString(36).substring(2)
    window.localStorage.setItem('name', answer)
    window.localStorage.setItem('id', userId)
    return { name: answer, id: userId }
  } else {
    return forceUserToFillName()
  }
}

interface CountData {
  newCount: number
}
export default function Room() {
  const [user] = React.useState<{ name: string; id: string }>(() => {
    return typeof window === 'undefined' ? { name: '', id: '' } : forceUserToFillName()
  })
  const [sharedCount, setSharedCount] = useRecoilState(sharedCountState)

  const id = useRouter().query.id?.toString()

  const { members, channel } = useChannel(id, user.name, user.id)

  React.useEffect(() => {
    channel?.trigger('client-countup', { newCount: sharedCount })
  }, [sharedCount, channel])

  function countUp() {
    const newCount = (sharedCount ?? 0) + 1
    // client events aren't triggered on the client sending them
    setSharedCount(newCount)
  }

  return (
    <>
      <>
        <h1>Runde - {id}</h1>
        <p>
          Hi {user.name}! Es sind {members.length} Spieler am Tisch:
        </p>
        <ul>
          {members.map((member) => {
            return <li key={member.id}>{member.info.name}</li>
          })}
        </ul>
        <button onClick={() => countUp()}>Count up</button>
        <div>Shared count: {sharedCount}</div>
      </>
    </>
  )
}
