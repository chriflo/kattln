import React from 'react'
import Pusher, { Members, PresenceChannel } from 'pusher-js'

interface PusherMember {
  id: string
  info: {
    name: string
  }
}

export function useChannel(channelId: string, name: string) {
  const [members, setMembers] = React.useState<PusherMember[]>([])
  const [channel, setChannel] = React.useState<PresenceChannel | undefined>()

  React.useEffect(() => {
    console.log(`useChannel - channelId: ${channelId}`)

    if (!channelId || !name) return
    const pusher = new Pusher('50ae4175a7dd934129ab', {
      cluster: 'eu',
      authEndpoint: '/api/auth',
    })

    console.log(`subscribing with channelId ${channelId} and name ${name}`)
    const presenceChannel = pusher.subscribe(`presence-${channelId}`) as PresenceChannel
    setChannel(presenceChannel)

    presenceChannel.bind('pusher:subscription_succeeded', () => {
      console.log('subscription succeeded')
      setMembers(getMembersArray(presenceChannel.members))
    })

    presenceChannel.bind('pusher:member_added', () => {
      console.log('member added')
      setMembers(getMembersArray(presenceChannel.members))
    })

    presenceChannel.bind('pusher:member_removed', () => {
      console.log('member removed')
      setMembers(getMembersArray(presenceChannel.members))
    })

    presenceChannel.bind('pusher:subscription_error', () => {
      console.log('subscription error')
    })

    pusher.bind_global((eventName: string, data: object) => {
      console.log(`Global event: ${eventName}:`, data)
    })

    return () => {
      presenceChannel.disconnect()
      pusher.disconnect()
    }
  }, [channelId])

  return { members, channel }
}

function getMembersArray(pusherMembers: Members) {
  const newMembers: PusherMember[] = []
  pusherMembers.each((member: PusherMember) => newMembers.push(member))
  return newMembers
}
