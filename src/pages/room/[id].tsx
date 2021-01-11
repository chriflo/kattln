import React from 'react'
import { useRouter } from 'next/router'

function forceUserToFillName(setName: React.Dispatch<string>) {
  const answer = prompt('Dein Spielername:')
  if (answer.length > 0) {
    setName(answer)
  } else {
    forceUserToFillName(setName)
  }
}

export default function Room() {
  const [name, setName] = React.useState('')
  const router = useRouter()

  React.useEffect(() => {
    forceUserToFillName(setName)
  }, [])

  const { id } = router.query

  return (
    <>
      {name.length > 0 ? (
        <h1>
          Hi {name}! Runde - {id}
        </h1>
      ) : (
        'Bitte gib einen Namen ein'
      )}
    </>
  )
}
