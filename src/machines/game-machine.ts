import { sort, uniq } from 'ramda'
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
      playerThatStartedRound:
        e.type !== 'UPDATE_PLAYERS' && e.type !== 'PLAYER_LEFT' && e.type !== 'PLAYER_ADDED'
          ? e.triggerId
          : c.playerThatStartedRound,
      unavailablePlayers: [],
    }
  }),
  updatePlayers: assign<GameContext, GameEvent>((c, e) =>
    e.type === 'UPDATE_PLAYERS' ? { players: sort(sortPlayersById, e.players) } : c,
  ),
  playerLeft: assign<GameContext, GameEvent>((c, e) =>
    e.type === 'PLAYER_LEFT'
      ? { unavailablePlayers: uniq([...c.unavailablePlayers, e.player]) }
      : c,
  ),
  playerAdded: assign<GameContext, GameEvent>((c, e) =>
    e.type === 'PLAYER_ADDED'
      ? { unavailablePlayers: c.unavailablePlayers.filter((p) => p.id !== e.player.id) }
      : c,
  ),
}

const guards = {
  fourPlayersInGame,
}

// This machine is completely decoupled from React
export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    // strict: true,
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
