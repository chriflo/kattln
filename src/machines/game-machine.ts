import { Card } from 'model/card'
import { Player } from 'model/player'
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
      stack: Card[]
      order: string[]
    }
  | {
      type: 'START_PLAYING'
    }
  | { type: 'FINISH_GAME' }
  | { type: 'START_AGAIN' }
  | { type: 'PLAY_CARD'; card: Card }

type TriggerEvents = { triggerId: string } & MyEvents

type UpdatePlayersEvent = { type: 'UPDATE_PLAYERS'; players: Player[] }
export type GameEvent = UpdatePlayersEvent | TriggerEvents

export interface GameContext {
  currentPlayerId: string
  players: Player[]
  stack: Card[]
  order: string[]
  gamePlayed?: { gameType: string; player: Player }
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
    },
    initial: 'lobby',
    states: {
      lobby: {
        on: {
          START_BIDDING: {
            target: 'bidding',
            cond: fourPlayersInGame,
            actions: ['initializeGame'],
          },
          UPDATE_PLAYERS: {
            target: 'lobby',
            actions: ['updatePlayers'],
          },
        },
      },
      bidding: {
        on: {
          START_PLAYING: 'playing',
          PLAY_CARD: {
            target: 'bidding',
            actions: assign((context: GameContext, event) => {
              return {
                stack: [event.card],
                currentPlayerId:
                  context.order[findNextPlayerIndex(context.order, context.currentPlayerId)],
              }
            }),
          },
        },
      },
      playing: {
        on: {
          FINISH_GAME: 'evaluation',
        },
      },
      evaluation: {
        on: { START_AGAIN: 'bidding' },
      },
    },
  },
  {
    actions: {
      initializeGame: assign((c, e) => {
        return {
          currentPlayerId: e.type === 'START_BIDDING' ? e.currentPlayerId : c.currentPlayerId,
          order: e.type === 'START_BIDDING' ? e.order : c.order,
          players: e.type === 'START_BIDDING' ? e.players : c.players,
          stack: e.type === 'START_BIDDING' ? e.stack : c.stack,
        }
      }),
      updatePlayers: assign({
        players: (_: GameContext, e: UpdatePlayersEvent) => e.players,
      }),
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
