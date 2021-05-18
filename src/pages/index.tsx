import { GameboyButton, RightArrowButton } from 'components/buttons'
import { useRouter } from 'next/router'
import React from 'react'

function createRoomId() {
  return Math.random().toString(36).substring(2)
}

export default function Home() {
  const router = useRouter()

  return (
    <>
      <h2 css={{ fontSize: 24 }}>Neue Runde</h2>
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          width: 200,
          justifyContent: 'space-between',
          marginTop: 25,
        }}
      >
        <GameboyButton title="erstellen" onClick={() => router.push(`/room/${createRoomId()}`)} />
        <RightArrowButton
          title="beitreten"
          onClick={() => alert('Frage deine Mitspieler nach dem Link zum Beitreten.')}
        />
      </div>
    </>
  )
}
