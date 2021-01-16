import { Player } from 'model/player'
import React from 'react'

export function useForceUserName(): Player {
  const [user] = React.useState<Player | null>(() => {
    return typeof window === 'undefined' ? null : forceUserToFillName()
  })

  return { name: user?.name ?? 'server-placeholder', id: user?.id ?? 'server-placeholder' }
}

function forceUserToFillName(): { name: string; id: string } {
  const nameFromCookie = getCookie('name')
  const idFromCookie = getCookie('id')
  if (nameFromCookie && idFromCookie) {
    return { id: idFromCookie, name: nameFromCookie }
  }
  const answer = prompt('Dein Spielername:') ?? ''
  if (answer.length > 0) {
    const id = Math.random().toString(36).substring(2)
    setCookie('name', answer, 1)
    setCookie('id', id, 1)
    return { name: answer, id }
  } else {
    return forceUserToFillName()
  }
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

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}
