import { usePresenceChannel } from '@harelpls/use-pusher'
import { Game } from 'components/game'
import { GameStoreProvider, GameState } from 'contexts/game-store-provider'
import { useForceUserName } from 'hooks/use-force-user-name'
import { getPlayersFromMembers } from 'model/pusher-members'
import { useRouter } from 'next/router'
import React from 'react'

export default function Room() {
  const [gameStarted, setGameStarted] = React.useState(false)
  const id = useRouter().query.id?.toString()

  const me = useForceUserName()
  const { channel } = usePresenceChannel(id ? `presence-${id}` : undefined)

  const players = getPlayersFromMembers(channel?.members)

  if (gameStarted && me.id)
    return (
      <GameStoreProvider channel={channel}>
        <Game me={me} />
      </GameStoreProvider>
    )

  return (
    <>
      <h1>Runde - {id}</h1>
      <p>
        Hi {me.name}! Es sind {players.length} Spieler am Tisch:
      </p>
      <ul>
        {players.map(({ id, name }) => (
          <li key={id}>
            {name}-{id}
          </li>
        ))}
      </ul>
      <button onClick={() => setGameStarted(true)}>Start game</button>
    </>
  )
}
