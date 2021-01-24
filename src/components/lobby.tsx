import { GameContext, GameEvent } from 'machines/game-machine'
import { shuffleCards } from 'model/card'
import { Player } from 'model/player'
import { Sender, State } from 'xstate'

export function Lobby({
  roomId,
  me,
  state,
  send,
}: {
  roomId: string
  me: Player
  state: State<GameContext, GameEvent>
  send: Sender<GameEvent>
}) {
  const players = state.context?.players ?? []
  function onStartGame() {
    const mixedCards = shuffleCards()
    const playersWithCards = players.map((player, index) => {
      const cardsForPlayer = mixedCards.filter(
        (_, cardIndex) => cardIndex % players.length === index,
      )
      return { ...player, cards: cardsForPlayer }
    })

    send({
      type: 'START_BIDDING',
      currentPlayerId: players[0].id,
      players: playersWithCards,
      stack: [],
      order: players.map((p) => p.id),
      triggerId: me.id,
    })
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
      {players.length !== 4 && <p>Um ein Spiel zu starten müsst ihr zu viert sein</p>}
      <button disabled={players.length !== 4} onClick={onStartGame}>
        Start game
      </button>
    </>
  )
}
