import { useGameStore } from 'contexts/game-store-provider'
import { Player } from 'model/player'

export function Lobby({ roomId, me }: { roomId: string; me: Player }) {
  const { trigger, players } = useGameStore()

  function onStartGame() {
    trigger({ count: 0, currentPlayerId: players[0].id })
  }

  return (
    <>
      <h1>Runde - {roomId}</h1>
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
      <button onClick={onStartGame}>Start game</button>
    </>
  )
}
