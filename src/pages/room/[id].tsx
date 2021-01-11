import React from 'react'
import { useRouter } from 'next/router'
import Pusher, { PresenceChannel } from 'pusher-js'

const pusher = new Pusher('50ae4175a7dd934129ab', {
  cluster: 'eu',
  authEndpoint: '/api/auth',
})

function forceUserToFillName(setName: React.Dispatch<string>) {
  const answer = prompt('Dein Spielername:')
  if (answer.length > 0) {
    window.localStorage.setItem('name', answer)
    setCookie('name', answer, 1)

    const id = Math.random().toString(36).substring(2)
    window.localStorage.setItem('id', id)
    setCookie('id', id, 1)
    setName(answer)
  } else {
    forceUserToFillName(setName)
  }
}

export default function Room() {
  const [name, setName] = React.useState('')
  const [channel, setChannel] = React.useState(undefined)
  const [members, setMembers] = React.useState([])
  const [memberCount, setMemberCount] = React.useState(0)
  const [sharedCount, setSharedCount] = React.useState(0)

  const router = useRouter()
  const { id } = router.query

  React.useEffect(() => {
    console.log(router.query.id)
    const presenceChannel = pusher.subscribe(`presence-${router.query.id}`) as PresenceChannel
    setChannel(presenceChannel)

    presenceChannel.bind('pusher:subscription_succeeded', () => {
      console.log('subscription succeeded')
      setMembers(getMembersArray(presenceChannel.members))
      setMemberCount(presenceChannel.members.count)
    })

    presenceChannel.bind('pusher:member_added', () => {
      console.log('member added')
      setMembers(getMembersArray(presenceChannel.members))
      setMemberCount(presenceChannel.members.count)
    })

    presenceChannel.bind('pusher:member_removed', () => {
      console.log('member removed')
      setMembers(getMembersArray(presenceChannel.members))
      setMemberCount(presenceChannel.members.count)
    })

    presenceChannel.bind('pusher:subscription_error', () => {
      console.log('subscription error')
    })

    presenceChannel.bind('client-countup', (data) => {
      console.log('client-countup')
      setSharedCount(data.newCount)
    })

    pusher.bind_global((eventName, data) => {
      console.log('global')
      console.log(`Global event: ${eventName}:`, data)
    })

    const savedName = window.localStorage.getItem('name')
    if (savedName) {
      setName(savedName)
    } else {
      forceUserToFillName(setName)
    }

    return () => {
      presenceChannel.disconnect()
      pusher.disconnect()
    }
  }, [])

  function countUp() {
    const newCount = sharedCount + 1
    channel.trigger('client-countup', { newCount })
    // client events aren't triggered on the client sending them
    setSharedCount(newCount)
  }

  return (
    <>
      {name.length > 0 ? (
        <>
          <h1>Runde - {id}</h1>
          <p>
            Hi {name}! Es sind {memberCount} Spieler am Tisch:
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

function getMembersArray(pusherMembers) {
  const newMembers = []
  pusherMembers.each((member) => newMembers.push(member))
  return newMembers
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
