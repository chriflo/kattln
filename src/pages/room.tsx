import React from 'react'
import Pusher, { PresenceChannel } from 'pusher-js'

var pusher = new Pusher('50ae4175a7dd934129ab', {
  cluster: 'eu',
  authEndpoint: '/api/auth',
})

// Presence channel name needs to start with "presence-"
var presenceChannel = pusher.subscribe('presence-test') as PresenceChannel

export default function Room() {
  const [members, setMembers] = React.useState([])
  const [memberCount, setMemberCount] = React.useState(0)
  const [sharedCount, setSharedCount] = React.useState(0)

  React.useEffect(() => {
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
      setSharedCount((prevCount) => prevCount + 1)
    })

    pusher.bind_global((eventName, data) => {
      console.log('global')
      console.log(`Global event: ${eventName}:`, data)
    })

    return () => {
      presenceChannel.disconnect()
      pusher.disconnect()
    }
  }, [])

  function countUp() {
    const amount = 1
    presenceChannel.trigger('client-countup', { amount })
    // client events aren't triggered on the client sending them
    setSharedCount(sharedCount + amount)
  }

  return (
    <>
      <div>
        <div>{memberCount} Members present:</div>
        <ul>
          {members.map((member) => {
            return <li key={member.id}>{member.id}</li>
          })}
        </ul>
        <button onClick={() => countUp()}>Count up</button>
        <div>Shared count: {sharedCount}</div>
      </div>
    </>
  )
}

function getMembersArray(pusherMembers) {
  const newMembers = []
  pusherMembers.each((member) => newMembers.push(member))
  return newMembers
}
