import { Card } from 'model/card'
import { Player } from 'model/player'
import { Trick } from 'model/trick'
import { assign, Machine, StateMachine } from 'xstate'

interface GameStateSchema {
  states: {
    lobby: Record<string, unknown>
    bidding: Record<string, unknown>
    playing: Record<string, unknown>
    evaluation: Record<string, unknown>
  }
}

type MyEvents =
  | {
      type: 'START_BIDDING'
      currentPlayerId: string
      players: Player[]
      order: string[]
    }
  | { type: 'START_PLAYING' }
  | { type: 'RESET_GAME' }
  | { type: 'FINISH_GAME' }
  | { type: 'START_AGAIN' }
  | { type: 'PLAY_CARD'; card: Card }
  | { type: 'TAKE_TRICK'; trick: Trick; player: Player }
  | { type: 'CHOOSE_GAME'; gamePlayed: { gameType: string; player: Player } | null }

type TriggerEvents = { triggerId: string } & MyEvents

type UpdatePlayersEvent = { type: 'UPDATE_PLAYERS'; players: Player[] }
export type GameEvent = UpdatePlayersEvent | TriggerEvents

export interface GameContext {
  currentPlayerId: string
  players: Player[]
  stack: Card[]
  order: string[]
  gamePlayed: { gameType: string; player: Player } | null
}

export type GameMachine = StateMachine<GameContext, GameStateSchema, GameEvent>

// This machine is completely decoupled from React
export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    strict: true,
    id: 'game',
    context: {
      currentPlayerId: '',
      players: [],
      stack: [],
      order: [],
      gamePlayed: null,
    },
    initial: 'lobby',
    on: {
      RESET_GAME: 'lobby',
    },
    states: {
      lobby: {
        on: {
          UPDATE_PLAYERS: {
            target: 'lobby',
            actions: ['updatePlayers'],
          },
          START_BIDDING: {
            target: 'bidding',
            cond: fourPlayersInGame,
            actions: ['initializeGame'],
          },
        },
      },
      bidding: {
        on: {
          START_PLAYING: { target: 'playing', actions: ['startPlaying'] },
          CHOOSE_GAME: { target: 'bidding', actions: ['chooseGame'] },
        },
      },
      playing: {
        on: {
          PLAY_CARD: {
            target: 'playing',
            actions: ['playCard'],
            cond: lessThanFourCardsPlayed,
          },
          FINISH_GAME: 'evaluation',
          TAKE_TRICK: {
            target: 'playing',
            actions: ['takeTrick'],
            cond: fourCardsPlayed,
          },
        },
      },
      evaluation: {
        on: { START_AGAIN: 'bidding' },
      },
    },
  },
  {
    actions: {
      initializeGame: assign((c, e) =>
        e.type === 'START_BIDDING'
          ? {
              currentPlayerId: e.currentPlayerId,
              order: e.order,
              players: e.players,
            }
          : c,
      ),
      updatePlayers: assign((c, e) =>
        e.type === 'UPDATE_PLAYERS'
          ? {
              players: e.players,
            }
          : c,
      ),
      playCard: assign((c, e) =>
        e.type === 'PLAY_CARD'
          ? {
              stack: [...c.stack, e.card],
              currentPlayerId: isFourthCardBeyingPlayed(c.stack)
                ? undefined
                : c.order[findNextPlayerIndex(c.order, c.currentPlayerId)],
              players: removeCardFromHand(c.players, e.card, c.currentPlayerId),
            }
          : c,
      ),
      chooseGame: assign((c, e) =>
        e.type === 'CHOOSE_GAME'
          ? {
              gamePlayed: e.gamePlayed,
              currentPlayerId: c.order[findNextPlayerIndex(c.order, c.currentPlayerId)],
            }
          : c,
      ),
      startPlaying: assign({
        order: (c) => c.players.map((p) => p.id),
        currentPlayerId: (c) => c.players[0].id,
      }),
      takeTrick: assign((c, e) =>
        e.type === 'TAKE_TRICK'
          ? {
              stack: [],
              currentPlayerId: e.player.id,
              players: giveTrickToPlayer(c.players, e.player.id, e.trick),
            }
          : c,
      ),
    },
    guards: {
      fourPlayersInGame,
    },
  },
)

function fourPlayersInGame(context: GameContext) {
  return context.players.length === 4
}

function findNextPlayerIndex(order: string[], currentPlayerId: string) {
  const currentPlayerIndex = order.findIndex((id) => currentPlayerId === id)
  return currentPlayerIndex < order.length - 1 ? currentPlayerIndex + 1 : 0
}

function removeCardFromHand(players: Player[], card: Card, currentPlayerId: string): Player[] {
  const currentPlayer = players.find((p) => p.id === currentPlayerId)
  if (!currentPlayer) return players
  const updatedCards = currentPlayer?.cards?.filter((c) => c.id !== card.id)

  return [
    ...players.filter((p) => p.id !== currentPlayerId),
    { ...currentPlayer, cards: updatedCards },
  ]
}

function fourCardsPlayed(context: GameContext) {
  return context.stack.length === 4
}

function lessThanFourCardsPlayed(context: GameContext) {
  return context.stack.length < 4
}

function giveTrickToPlayer(players: Player[], playerId: string, trick: Trick): Player[] {
  const takingPlayer = players.find((p) => p.id === playerId)
  if (!takingPlayer) return players
  const updatedTricks = takingPlayer.tricks ? takingPlayer.tricks.concat([trick]) : [trick]

  return [
    ...players.filter((p) => p.id !== playerId),
    {
      ...takingPlayer,
      tricks: updatedTricks,
    },
  ]
}

function isFourthCardBeyingPlayed(stack: Card[]) {
  return stack.length === 3
}
