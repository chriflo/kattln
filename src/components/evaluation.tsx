import { useSynchronizedRoom } from 'hooks/syncronized-room-provider'
import { shuffleCards } from 'model/card'
import React from 'react'
import { Button } from './buttons'

export function Evaluation() {
  const { state, me, send } = useSynchronizedRoom()
  const { context } = state
  const thisPlayer = context.players.find((player) => player.id === me.id)
  const myPoints = thisPlayer?.tricks?.reduce((prevPoints, curTrick) => {
    const trickPoints = curTrick.reduce((prevTrickPoints, curCard) => {
      return prevTrickPoints + curCard.value
    }, 0)
    return prevPoints + trickPoints
  }, 0)

  function onNextRound() {
    const { players } = context
    const mixedCards = shuffleCards()
    const freshPlayers = players.map((player, index) => {
      const cardsForPlayer = mixedCards.filter(
        (_, cardIndex) => cardIndex % players.length === index,
      )
      return { ...player, cards: cardsForPlayer, tricks: [] }
    })
    send({ type: 'START_BIDDING', triggerId: me.id, freshPlayers })
  }
  return (
    <>
      <p css={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        Du hast {myPoints ? myPoints : 0} Punkte gemacht
      </p>
      <Button css={{ margin: 10 }} onClick={() => onNextRound()}>
        Nächste Runde
      </Button>
    </>
  )
}
