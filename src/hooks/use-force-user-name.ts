import { User } from 'model/user'
import React from 'react'

export function useForceUserName(): User {
  const [user] = React.useState<User | null>(() => {
    return typeof window === 'undefined' ? null : forceUserToFillName()
  })

  return { name: user?.name, id: user?.id }
}

function forceUserToFillName(): { name: string; id: string } {
  const answer = prompt('Dein Spielername:') ?? ''
  if (answer.length > 0) {
    return { name: answer, id: Math.random().toString(36).substring(2) }
  } else {
    return forceUserToFillName()
  }
}
