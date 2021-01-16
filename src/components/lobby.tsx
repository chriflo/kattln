import { Player } from 'model/player'

export function Lobby({
  roomId,
  me,
  players,
  onStartGame,
}: {
  roomId: string
  me: Player
  players: Player[]
  onStartGame: () => void
}) {
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
