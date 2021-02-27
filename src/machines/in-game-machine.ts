import { allCards, Card } from 'model/card'
import { Player } from 'model/player'
import { Trick } from 'model/trick'
import { assign } from 'xstate'
import { GameContext, GameEvent } from './machine-model'
import { shiftPlayers, updateCurrentPlayer } from './players-helper'

export const inGameMachine = {
  on: {
    PLAYER_LEFT: { actions: ['playerLeft'] },
    PLAYER_ADDED: { actions: ['playerAdded'] },
  },
  states: {
    bidding: {
      entry: ['shiftToPlayerThatStartedRound', 'initializeGame'],
      always: [
        {
          target: 'playing',
          cond: 'choseGame',
          actions: assign<GameContext, GameEvent>((c) => ({
            players: updateCurrentPlayer(c.playerThatStartedRound ?? c.players[0].id, c.players),
          })),
        },
      ],
      on: {
        CHOOSE_GAME: [{ actions: ['chooseGame', 'nextPlayer'] }],
      },
    },
    playing: {
      always: [
        {
          target: 'evaluation',
          cond: 'allTricksTaken',
        },
      ],
      on: {
        PLAY_CARD: {
          actions: ['playCard', 'nextPlayer'],
          cond: 'lessThanFourCardsPlayed',
        },
        TAKE_TRICK: {
          actions: ['takeTrick'],
          cond: 'fourCardsPlayed',
        },
      },
    },
    evaluation: {
      entry: assign<GameContext, GameEvent>({
        highlightCurrentPlayer: false,
      }),
      on: { START_BIDDING: 'bidding' },
    },
  },
}

export const inGameActions = {
  shiftToPlayerThatStartedRound: assign<GameContext, GameEvent>((c) => {
    const players = updateCurrentPlayer(c.playerThatStartedRound ?? c.players[0].id, c.players)
    return {
      playerThatStartedRound: players[1].id,
    }
  }),
  initializeGame: assign<GameContext, GameEvent>((c, e) => {
    if (e.type === 'START_BIDDING') {
      return {
        players: updateCurrentPlayer(c.playerThatStartedRound ?? c.players[0].id, e.freshPlayers),
        stack: [],
        gamePlayed: null,
        highlightCurrentPlayer: true,
      }
    } else {
      return c
    }
  }),
  playCard: assign<GameContext, GameEvent>((c, e) =>
    e.type === 'PLAY_CARD'
      ? {
          stack: [...c.stack, e.card],
          players: removeCardFromHand(c.players, e.card),
          highlightCurrentPlayer: isFourthCardBeyingPlayed(c) ? false : true,
        }
      : c,
  ),
  chooseGame: assign<GameContext, GameEvent>((c, e) =>
    e.type === 'CHOOSE_GAME' ? { gamePlayed: e.gamePlayed } : c,
  ),
  takeTrick: assign<GameContext, GameEvent>((c, e) =>
    e.type === 'TAKE_TRICK'
      ? {
          stack: [],
          players: giveTrickToPlayer(c.players, e.player.id, e.trick),
          highlightCurrentPlayer: true,
        }
      : c,
  ),
  nextPlayer: assign<GameContext, GameEvent>({
    players: (c) => shiftPlayers(c.players),
  }),
}

export const inGameGuards = {
  choseGame,
  fourCardsPlayed,
  lessThanFourCardsPlayed,
  isFourthCardBeyingPlayed,
  allTricksTaken,
}

// actions //

function removeCardFromHand(players: Player[], card: Card): Player[] {
  const currentPlayer = players[0]
  if (!currentPlayer) return players
  const updatedCards = currentPlayer.cards?.filter((c) => c.id !== card.id)

  return players.map((p) => {
    if (p.id === currentPlayer.id) return { ...currentPlayer, cards: updatedCards }
    return p
  })
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

// guards //

function choseGame(context: GameContext): boolean {
  return Boolean(context.gamePlayed?.gameType)
}

function fourCardsPlayed(context: GameContext): boolean {
  return context.stack.length === 4
}

function lessThanFourCardsPlayed(context: GameContext): boolean {
  return context.stack.length < 4
}

function isFourthCardBeyingPlayed(context: GameContext): boolean {
  return context.stack.length === 3
}

export function allTricksTaken(context: GameContext): boolean {
  return countTricks(context) === allCards.length / 4
}

function countTricks(context: GameContext) {
  return context.players.reduce((prevCount, curPlayer) => {
    return curPlayer.tricks ? curPlayer.tricks.length + prevCount : 0
  }, 0)
}
