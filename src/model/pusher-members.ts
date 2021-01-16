import { Members } from 'pusher-js'
import { Player } from './player'

interface PusherMember {
  id: string
  info: {
    name: string
  }
}

export function getPlayersFromMembers(pusherMembers?: Members): Player[] {
  if (!pusherMembers) return []

  const newMembers: Player[] = []
  pusherMembers.each((member: PusherMember) =>
    newMembers.push({ id: member.id, name: member.info.name }),
  )
  return newMembers
}
