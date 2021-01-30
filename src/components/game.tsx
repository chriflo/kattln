import { css } from '@emotion/react'
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

  function onTakeTrick() {
    send({
      type: 'TAKE_TRICK',
      trick: stack,
      player: me,
      triggerId: me.id,
    })
  }

  function onFinishGame() {
    send({
      type: 'FINISH_GAME',
      triggerId: me.id,
    })
  }

  return (
    <>
      <CardStack
        css={css`
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
        `}
        stack={stack}
      />
      <Hand
        players={players}
        currentPlayer={me}
        isItMyTurn={isItMyTurn(currentPlayerId, me.id)}
        onClickCard={(card: Card) => onSubmitCard(card)}
      />
      <button disabled={context.stack.length < 4} onClick={() => onTakeTrick()}>
        Stich nehmen
      </button>
      {context.players.every((player) => player.cards?.length === 0) && (
        <button onClick={() => onFinishGame()}>Runde beenden</button>
      )}
    </>
  )
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
