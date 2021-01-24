import { GameContext, GameEvent } from 'machines/game-machine'
import { Player } from 'model/player'
import React from 'react'
import { Sender } from 'xstate'
import { Card } from './card'
import { CardStack } from './card-stack'
import { Hand } from './hand'

type Card = import('model/card').Card

interface GameProps {
  me: Player
  context: GameContext
  send: Sender<GameEvent>
}

export function Game({ me, context, send }: GameProps) {
  const { currentPlayerId, stack, players } = context
  function onSubmitCard(playedCard: Card) {
    console.log(currentPlayerId, me.id)
    if (currentPlayerId !== me.id) return
    console.log(me.id, playedCard)
    send({
      type: 'PLAY_CARD',
      card: playedCard,
      triggerId: me.id,
    })
  }

  return (
    <>
      <h1>{me.name}</h1>
      <p>{players.find((m) => currentPlayerId === m.id)?.name} ist am Zug</p>
      <CardStack stack={stack} />
      <Hand
        players={players}
        currentPlayer={me}
        isItMyTurn={isItMyTurn(currentPlayerId, me.id)}
        onClick={(card: Card) => onSubmitCard(card)}
      />
    </>
  )
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
