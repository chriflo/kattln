import { Card } from 'model/card'
import { WEITER } from 'model/game'
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
  | { type: 'START_BIDDING'; freshPlayers: Player[] }
  | { type: 'START_PLAYING' }
  | { type: 'RESET_GAME' }
  | { type: 'FINISH_GAME' }
  | { type: 'START_AGAIN' }
  | { type: 'PLAY_CARD'; card: Card }
  | { type: 'TAKE_TRICK'; trick: Trick; player: Player }
  | { type: 'CHOOSE_GAME'; gamePlayed: { gameType: string; player: Player } }

type TriggerEvents = { triggerId: string } & MyEvents

type UpdatePlayersEvent = { type: 'UPDATE_PLAYERS'; players: Player[] }
export type GameEvent = UpdatePlayersEvent | TriggerEvents

export interface GameContext {
  players: Player[] // players[0] is active player
  stack: Card[]
  gamePlayed: { gameType: string; player: Player } | null
  myId: string
  highlightCurrentPlayer: boolean
  playerThatStartedRound: string | null
}

export type GameMachine = StateMachine<GameContext, GameStateSchema, GameEvent>

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
        on: {
          UPDATE_PLAYERS: {
            target: 'lobby',
            actions: ['updatePlayers'],
          },
          START_BIDDING: {
            target: 'bidding',
            cond: fourPlayersInGame,
          },
        },
      },
      bidding: {
        entry: ['initializeGame'],
        always: [
          {
            target: 'playing',
            cond: chosenGameIsNotWeiter,
            actions: assign((c, e) => ({
              players: updateCurrentPlayer(c.playerThatStartedRound ?? c.players[0].id, c.players),
            })),
          },
        ],
        on: {
          CHOOSE_GAME: [{ actions: ['chooseGame', 'nextPlayer'] }],
        },
      },
      playing: {
        on: {
          PLAY_CARD: {
            actions: ['playCard', 'nextPlayer'],
            cond: lessThanFourCardsPlayed,
          },
          FINISH_GAME: 'evaluation',
          TAKE_TRICK: {
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
      initializeGame: assign((c, e) => {
        if (e.type === 'START_BIDDING') {
          return {
            players: updateCurrentPlayer(e.triggerId, e.freshPlayers),
            stack: [],
            gamePlayed: { gameType: WEITER, player: c.players[0] },
            highlightCurrentPlayer: true,
            playerThatStartedRound: e.triggerId,
          }
        } else {
          return c
        }
      }),
      updatePlayers: assign((c, e) =>
        e.type === 'UPDATE_PLAYERS'
          ? { players: e.players.sort((p1, p2) => (p1.id > p2.id ? 1 : -1)) }
          : c,
      ),
      playCard: assign((c, e) =>
        e.type === 'PLAY_CARD'
          ? {
              stack: [...c.stack, e.card],
              players: removeCardFromHand(c.players, e.card),
              highlightCurrentPlayer: isFourthCardBeyingPlayed(c.stack) ? false : true,
            }
          : c,
      ),
      chooseGame: assign((c, e) => (e.type === 'CHOOSE_GAME' ? { gamePlayed: e.gamePlayed } : c)),
      takeTrick: assign((c, e) =>
        e.type === 'TAKE_TRICK'
          ? {
              stack: [],
              players: giveTrickToPlayer(c.players, e.player.id, e.trick),
              highlightCurrentPlayer: true,
            }
          : c,
      ),
      nextPlayer: assign({
        players: (c) => shiftPlayers(c.players),
      }),
    },
    guards: {
      fourPlayersInGame,
      chosenGameIsNotWeiter,
    },
  },
)

export function isItMyTurn(context: GameContext): boolean {
  return context.players[0].id === context.myId
}

function chosenGameIsNotWeiter(context: GameContext) {
  return context.gamePlayed?.gameType !== WEITER
}

function fourPlayersInGame(context: GameContext) {
  return context.players.length === 4
}

function removeCardFromHand(players: Player[], card: Card): Player[] {
  const currentPlayer = players[0]
  if (!currentPlayer) return players
  const updatedCards = currentPlayer.cards?.filter((c) => c.id !== card.id)

  return players.map((p) => {
    if (p.id === currentPlayer.id) return { ...currentPlayer, cards: updatedCards }
    return p
  })
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

  return updateCurrentPlayer(
    playerId,
    players.map((p) => (p.id === takingPlayer.id ? { ...takingPlayer, tricks: updatedTricks } : p)),
  )
}

function isFourthCardBeyingPlayed(stack: Card[]) {
  return stack.length === 3
}

function updateCurrentPlayer(id: string, players: Player[]): Player[] {
  if (players.length < 1) return []
  if (players[0].id === id) return players
  return updateCurrentPlayer(id, shiftPlayers(players))
}

function shiftPlayers(players: Player[]): Player[] {
  if (players.length > 0) {
    const firstPlayer = players[0]
    return [...players.slice(1), firstPlayer]
  }
  return []
}
