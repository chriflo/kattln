import { useMachine } from '@xstate/react'
import { gameMachine, useGameStore } from 'contexts/game-store-provider'
import { shuffleCards } from 'model/card'
import { Player } from 'model/player'

export function Lobby({ roomId, me }: { roomId: string; me: Player }) {
  const { trigger, players } = useGameStore()
  const [current, send] = useMachine(gameMachine)

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
      playersInGame: playersWithCards,
      stack: [],
      order: players.map((p) => p.id),
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
      <button onClick={onStartGame}>Start game</button>
    </>
  )
}
