import { css } from '@emotion/react'
import { GameContext, GameEvent, isItMyTurn } from 'machines/game-machine'
import { Player } from 'model/player'
import React from 'react'
import { Sender } from 'xstate'
import { Button } from './buttons'
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
  const { stack, players } = context

  function onSubmitCard(playedCard: Card) {
    if (!isItMyTurn(context)) return

    send({ type: 'PLAY_CARD', card: playedCard, triggerId: me.id })
  }

  function onTakeTrick() {
    send({ type: 'TAKE_TRICK', trick: stack, player: me, triggerId: me.id })
  }

  function onFinishGame() {
    send({ type: 'FINISH_GAME', triggerId: me.id })
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
        isItMyTurn={isItMyTurn(context)}
        onClickCard={(card: Card) => onSubmitCard(card)}
      />
      <Button disabled={context.stack.length < 4} onClick={() => onTakeTrick()}>
        Stich nehmen
      </Button>
      {countTricks(context) === 8 && <button onClick={() => onFinishGame()}>Runde beenden</button>}
    </>
  )
}

function countTricks(context: GameContext) {
  return context.players.reduce((prevCount, curPlayer) => {
    return curPlayer.tricks ? curPlayer.tricks.length + prevCount : 0
  }, 0)
}
