import React from 'react'
import Pusher, { Members, PresenceChannel } from 'pusher-js'
import { useRecoilState } from 'recoil'
import { sharedCountState } from 'atoms'

interface PusherMember {
  id: string
  info: {
    name: string
  }
}

export function useChannel(
  channelId: string | undefined,
  name: string,
  userId: string,
): { channel?: PresenceChannel; members: PusherMember[] } {
  const [pusher] = React.useState(
    () =>
      new Pusher('50ae4175a7dd934129ab', {
        cluster: 'eu',
        authEndpoint: '/api/auth',
      }),
  )

  const [channel, setChannel] = React.useState<PresenceChannel | undefined>(undefined)

  React.useEffect(() => {
    if (!channelId || !name || !userId) return undefined

    setCookie('name', name, 1)
    setCookie('id', userId, 1)
    console.log(`subscribing to channel ${channelId} with name ${name} and userId ${userId}`)
    setChannel(pusher.subscribe(`presence-${channelId}`) as PresenceChannel)
  }, [channelId, name, pusher, userId])

  const [members, setMembers] = React.useState<PusherMember[]>(getMembersArray(channel?.members))

  const [sharedCount, setSharedCount] = useRecoilState(sharedCountState)

  React.useEffect(() => {
    channel?.bind('pusher:member_added', () => {
      console.log('member added')
      setMembers(getMembersArray(channel.members))
    })
  }, [channel, sharedCount])

  React.useEffect(() => {
    channel?.bind('client-countup', (data) => {
      console.log('setting new count to', data.newCount)
      setSharedCount(data.newCount)
    })
  }, [channel, setSharedCount])

  React.useEffect(() => {
    channel?.bind('pusher:subscription_succeeded', () => {
      console.log('subscription succeeded')
      setMembers(getMembersArray(channel.members))
    })

    channel?.bind('pusher:member_removed', () => {
      console.log('member removed')
      setMembers(getMembersArray(channel.members))
    })

    channel?.bind('pusher:subscription_error', () => {
      console.log('subscription error')
    })

    pusher.bind_global((eventName: string, data: Record<string, unknown>) => {
      console.log(`Global event: ${eventName}:`, data)
    })

    return () => {
      channel?.disconnect()
      channel && pusher.disconnect()
    }
  }, [channel, channelId, name, pusher, userId])

  return { members, channel }
}

function getMembersArray(pusherMembers: Members | undefined): PusherMember[] {
  const newMembers: PusherMember[] = []
  pusherMembers?.each((member: PusherMember) => newMembers.push(member))
  return newMembers
}

function setCookie(name: string, value: string, days: number) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
