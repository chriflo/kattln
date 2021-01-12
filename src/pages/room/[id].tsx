import React from 'react'
import { useRouter } from 'next/router'
import { useChannel } from '../../hooks/useChannel'

function isComponentMounted() {
  const [isComponentMounted, setIsComponentMounted] = React.useState(false)

  React.useEffect(() => setIsComponentMounted(true), [])

  return isComponentMounted
}

function forceUserToFillName(setName: React.Dispatch<string>, isClient: boolean) {
  const answer = prompt('Dein Spielername:')
  if (answer.length > 0) {
    const id = Math.random().toString(36).substring(2)

    window.localStorage.setItem('name', answer)
    window.localStorage.setItem('id', id)
    setName(answer)
    if (isClient) {
      setCookie('id', id, 1)
      setCookie('name', answer, 1)
    }
  } else {
    forceUserToFillName(setName, isClient)
  }
}

interface CountData {
  newCount: number
}

export default function Room() {
  const [name, setName] = React.useState(undefined)
  const [sharedCount, setSharedCount] = React.useState(0)
  const isClient = isComponentMounted()

  const id = useRouter().query.id?.toString()
  const { members, channel } = useChannel(id, name)

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
      forceUserToFillName(setName, isClient)
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

function setCookie(name: string, value: string, days: number) {
  var expires = ''
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
