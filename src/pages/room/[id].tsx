import { usePresenceChannel } from '@harelpls/use-pusher'
import { Game } from 'components/game'
import { useForceUserName } from 'hooks/use-force-user-name'
import { GameState, useGameState } from 'hooks/use-game-state'
import { getPlayersFromMembers } from 'model/pusher-members'
import { useRouter } from 'next/router'
import React from 'react'

export default function Room() {
  const id = useRouter().query.id?.toString()

  const me = useForceUserName()
  const { channel } = usePresenceChannel(id ? `presence-${id}` : undefined)
  const { gameState, triggerNewGameState } = useGameState(channel)

  const players = getPlayersFromMembers(channel?.members)

  function onClickStartGame() {
    if (players && players.length < 1) throw new Error(`Can't start game without players`)
    const initialGameState: GameState = { count: 0, currentPlayerId: players[0].id }
    triggerNewGameState(initialGameState)
  }

  if (gameState && me.id)
    return (
      <Game
        me={me}
        players={players}
        gameState={gameState}
        triggerNewGameState={triggerNewGameState}
      />
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
      <button onClick={onClickStartGame}>Start game</button>
    </>
  )
}
