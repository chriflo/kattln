import { css } from '@emotion/react'
import { isItMyTurn } from 'machines/game-state-reducer'
import { useSynchronizedRoom } from 'hooks/syncronized-room-provider'
import { Trick } from 'model/trick'
import React from 'react'
import { Button } from './buttons'
import { Card } from './card'
import { CardStack } from './card-stack'
import { Hand } from './hand'

type Card = import('model/card').Card

export function Game() {
  const { send, state, me } = useSynchronizedRoom()
  const { players, stack } = state

  function onSubmitCard(playedCard: Card) {
    if (!isItMyTurn(state, me.id)) return

    send({ type: 'PLAY_CARD', card: playedCard, triggerId: me.id })
  }

  function onTakeTrick() {
    if (stack.length === 4) {
      send({ type: 'TAKE_TRICK', trick: stack as Trick, player: me, triggerId: me.id })
    }
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
        isItMyTurn={isItMyTurn(state, me.id)}
        onClickCard={(card: Card) => onSubmitCard(card)}
      />
      {state.stack.length === 4 && (
        <Button css={{ margin: 10 }} onClick={() => onTakeTrick()}>
          Stich nehmen
        </Button>
      )}
    </>
  )
}
