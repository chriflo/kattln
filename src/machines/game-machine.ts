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
            actions: ['playCard'],
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
      initializeGame: assign((c, e) =>
        e.type === 'START_BIDDING'
          ? {
              currentPlayerId: e.currentPlayerId,
              order: e.order,
              players: e.players,
              stack: e.stack,
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
              stack: [e.card, ...c.stack],
              currentPlayerId: c.order[findNextPlayerIndex(c.order, c.currentPlayerId)],
              players: removeCardFromHand(c.players, e.card, c.currentPlayerId),
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
  const updatedCards = currentPlayer?.cards?.filter((c) => c !== card)

  return [
    ...players.filter((p) => p.id !== currentPlayerId),
    { ...currentPlayer, cards: updatedCards },
  ]
}
