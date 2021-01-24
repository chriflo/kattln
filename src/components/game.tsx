import { GameContext, GameEvent } from 'machines/game-machine'
import { Player } from 'model/player'
import React from 'react'
import { Sender, State } from 'xstate'
import { Card } from './card'

type Card = import('model/card').Card

interface GameProps {
  me: Player
  state: State<GameContext, GameEvent>
  send: Sender<GameEvent>
}

export function Game({ me, state, send }: GameProps) {
  const { currentPlayerId, stack, players } = state.context
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

  // function updateGameType(currentState: GameState, game: string) {
  //   if (!isItMyTurn(currentState.currentPlayerId, me.id)) return

  //   if (game === 'weiter') {
  //     trigger({
  //       ...currentState,
  //       currentPlayerId: currentState.order[findNextPlayerIndex(currentState)],
  //     })
  //   } else {
  //     trigger({
  //       ...currentState,
  //       gameStage: 'playing',
  //       gamePlayed: { gameType: game, player: me },
  //     })
  //   }
  // }

  return (
    <>
      <h1>{me.name}</h1>
      <p>{players.find((m) => currentPlayerId === m.id)?.name} ist am Zug</p>
      {/* {gameStage === 'choose-game' && (
        <GameChooser
          disabled={!isItMyTurn(currentPlayerId, me.id)}
          onClick={(game) => updateGameType(state, game)}
        ></GameChooser>
      )}
      {gameStage === 'playing' && (
      <>
      <p>
        {gamePlayed?.player.name} spielt {gamePlayed?.gameType}
      </p> */}
      <CardStack stack={stack}></CardStack>
      {/* </>
      )} */}
      <Hand
        players={players}
        currentPlayer={me}
        disabled={!isItMyTurn(currentPlayerId, me.id)}
        onClick={(card: Card) => onSubmitCard(card)}
      ></Hand>
    </>
  )
}

// interface GameChooserProps {
//   disabled: boolean
//   onClick: (game: string) => void
// }

// function GameChooser({ onClick, disabled }: GameChooserProps) {
//   return (
//     <ul css={{ display: 'flex' }}>
//       {games.map((game) => (
//         <li key={game}>
//           <button disabled={disabled} onClick={() => onClick(game)}>
//             {game}
//           </button>
//         </li>
//       ))}
//       <li>
//         <button disabled={disabled} onClick={() => onClick('weiter')}>
//           Weiter
//         </button>
//       </li>
//     </ul>
//   )
// }

interface CardStackProps {
  stack: Card[]
}

function CardStack({ stack }: CardStackProps) {
  return (
    <>
      <h2>Stapel</h2>
      <ol css={{ display: 'flex', flexWrap: 'wrap' }}>
        {stack.map((card) => (
          <li key={card.id}>
            <Card card={card} />
          </li>
        ))}
      </ol>
    </>
  )
}

interface HandProps {
  players: Player[]
  currentPlayer: Player
  disabled: boolean
  onClick: (card: Card) => void
}

function Hand({ players, currentPlayer, disabled, onClick }: HandProps) {
  return (
    <>
      <h2>Karten auf der Hand</h2>
      <ul css={{ display: 'flex', flexWrap: 'wrap' }}>
        {players
          .find((player) => player.id === currentPlayer.id)
          ?.cards?.map((card) => {
            return (
              <li key={card.id}>
                <button
                  css={{ background: 'none', border: 'none' }}
                  disabled={disabled}
                  onClick={() => onClick(card)}
                >
                  <Card card={card} />
                </button>
              </li>
            )
          })}
      </ul>
    </>
  )
}

function isItMyTurn(currentPlayerId: string, myId: string): boolean {
  return currentPlayerId === myId
}
