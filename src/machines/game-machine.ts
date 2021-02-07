import { sort } from 'ramda'
import { assign, Machine } from 'xstate'
import { inGameActions, inGameGuards, inGameMachine } from './in-game-machine'
import { GameContext, GameEvent, GameStateSchema } from './machine-model'
import { sortPlayersById } from './players-helper'

const actions = {
  resetGame: assign<GameContext, GameEvent>((c, e) => {
    return {
      players: c.players.map((p) => ({ ...p, tricks: [], cards: [] })),
      stack: [],
      gamePlayed: null,
      highlightCurrentPlayer: false,
      playerThatStartedRound: e.type !== 'UPDATE_PLAYERS' ? e.triggerId : c.playerThatStartedRound,
    }
  }),
  updatePlayers: assign<GameContext, GameEvent>((c, e) =>
    e.type === 'UPDATE_PLAYERS' ? { players: sort(sortPlayersById, e.players) } : c,
  ),
}

const guards = {
  fourPlayersInGame,
}

// This machine is completely decoupled from React
export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    strict: true,
    id: 'game',
    initial: 'lobby',
    on: {
      RESET_GAME: 'lobby',
    },
    states: {
      lobby: {
        entry: ['resetGame'],
        on: {
          UPDATE_PLAYERS: {
            actions: ['updatePlayers'],
          },
          START_BIDDING: {
            target: 'inGame',
            cond: 'fourPlayersInGame',
          },
        },
      },
      inGame: { initial: 'bidding', ...inGameMachine },
      playerLeft: {},
    },
  },
  {
    actions: { ...actions, ...inGameActions },
    guards: { ...guards, ...inGameGuards },
  },
)

// guards //

function fourPlayersInGame(context: GameContext) {
  return context.players.length === 4
}

export function isItMyTurn(context: GameContext): boolean {
  return context.players[0].id === context.myId
}
