import { useSynchronizedRoom } from 'hooks/syncronized-room-provider'
import { shuffleCards } from 'model/card'
import { GameboyButton } from './buttons'

export function Lobby() {
  const { state, send, me } = useSynchronizedRoom()
  const { context } = state
  const players = context?.players ?? []
  function onStartGame() {
    const mixedCards = shuffleCards()
    const freshPlayers = players.map((player, index) => {
      const cardsForPlayer = mixedCards.filter(
        (_, cardIndex) => cardIndex % players.length === index,
      )
      return { ...player, cards: cardsForPlayer, tricks: [] }
    })
    send({
      type: 'START_BIDDING',
      freshPlayers: freshPlayers,
      triggerId: me.id,
    })
  }

  return (
    <>
      <GameboyButton
        css={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
        title="Spiel starten"
        disabled={players.length !== 4}
        onClick={onStartGame}
      />
      {players.length !== 4 && (
        <p css={{ margin: 20 }}>Um ein Spiel zu starten müsst ihr zu viert sein</p>
      )}
    </>
  )
}
