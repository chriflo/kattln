import { GameContext, GameEvent } from 'machines/game-machine'
import { shuffleCards } from 'model/card'
import { Player } from 'model/player'
import { Sender } from 'xstate'
import { GameboyButton } from './buttons'

interface LobbyProps {
  me: Player
  context: GameContext
  send: Sender<GameEvent>
}
export function Lobby({ me, context, send }: LobbyProps) {
  const players = context?.players ?? []
  function onStartGame() {
    const mixedCards = shuffleCards()
    const playersWithCards = players.map((player, index) => {
      const cardsForPlayer = mixedCards.filter(
        (_, cardIndex) => cardIndex % players.length === index,
      )
      return { ...player, cards: cardsForPlayer }
    })

    send &&
      send({
        type: 'START_BIDDING',
        currentPlayerId: players[0].id,
        players: playersWithCards,
        order: players.map((p) => p.id),
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
