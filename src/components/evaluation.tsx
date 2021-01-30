import { GameContext, GameEvent } from 'machines/game-machine'
import { Player } from 'model/player'
import React from 'react'
import { Sender } from 'xstate'

interface EvaluationProps {
  me: Player
  context: GameContext
  send: Sender<GameEvent>
}

export function Evaluation({ me, context, send }: EvaluationProps) {
  const thisPlayer = context.players.find((player) => player.id === me.id)
  const myPoints = thisPlayer?.tricks?.reduce((prevPoints, curTrick) => {
    const trickPoints = curTrick.reduce((prevTrickPoints, curCard) => {
      return prevTrickPoints + curCard.value
    }, 0)
    return prevPoints + trickPoints
  }, 0)

  function onNextRound() {
    send({ type: 'START_AGAIN', triggerId: me.id })
  }
  return (
    <>
      <p>Du hast {myPoints ? myPoints : 0} Punkte gemacht</p>
      <button onClick={() => onNextRound()}>Nächste Runde</button>
    </>
  )
}
