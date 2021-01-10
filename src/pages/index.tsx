import React from 'react'
import Link from 'next/link'

function createRoomId() {
  return Math.random().toString(36).substring(2)
}

export default function Home() {
  const [name, setName] = React.useState('')

  React.useEffect(() => {
    const savedName = window.localStorage.getItem('name')
    if (savedName) setName(savedName)
  }, [])

  return (
    <main
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div css={{ width: '200px' }}>
        <label htmlFor="name">Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          id="name"
        />
        <Link href={`/room/${createRoomId()}`}>
          <button
            onClick={() => {
              window.localStorage.setItem('name', name)
              window.localStorage.setItem('id', Math.random().toString(36).substring(2))
            }}
          >
            Runde erstellen
          </button>
        </Link>
        <button>Runde beitreten</button>
      </div>
    </main>
  )
}
