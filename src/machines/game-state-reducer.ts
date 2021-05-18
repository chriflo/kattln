import { GameWithIcon } from 'components/bidding'
import { GameState } from 'machines/machine-model'
import { shiftPlayers, sortPlayersById, updateCurrentPlayer } from 'machines/players-helper'
import { Card } from 'model/card'
import { Player } from 'model/player'
import { Trick } from 'model/trick'
import { sort, uniq } from 'ramda'
import { useReducer } from 'react'
import { getWithExpiry } from 'utils/local-storage-with-expiry'
import { UnreachableCaseError } from 'utils/unreachable-case-error'

export type SetGameState = ReturnType<typeof useGameState>['setGameState']
export function useGameState(me: Player, stateOverride?: GameState, roomId?: string) {
  const defaultState: GameState = {
    lastEvent: null,
    name: 'lobby',
    players: [me],
    stack: [],
    gamePlayed: null,
    highlightCurrentPlayer: false,
    playerThatStartedRound: null,
    unavailablePlayers: [],
  }

  const [gameState, setGameState] = useReducer(
    gameStateReducer,
    stateOverride ?? defaultState,
    () => {
      if (typeof window === 'undefined') return defaultState
      const storedState = roomId
        ? (JSON.parse(getWithExpiry(`app-state-${roomId}`)) as GameState | undefined)
        : undefined
      return storedState ? storedState : defaultState
    },
  )

  return { gameState, setGameState }
}

export type GameEvent =
  | { triggerId: string; type: 'SHARE_STATE'; gameState: GameState }
  | { triggerId: string; type: 'START_BIDDING'; freshPlayers: Player[] }
  | { triggerId: string; type: 'RESET_GAME' }
  | { triggerId: string; type: 'PLAY_CARD'; card: Card }
  | { triggerId: string; type: 'TAKE_TRICK'; trick: Trick; player: Player }
  | {
      triggerId: string
      type: 'CHOOSE_GAME'
      gamePlayed: { gameType: GameWithIcon; player: Player } | null
    }
  | { type: 'UPDATE_PLAYERS_IN_LOBBY'; players: Player[] }
  | { type: 'PLAYER_LEFT_IN_GAME'; player: Player }
  | { type: 'PLAYER_ADDED_IN_GAME'; player: Player }

function gameEvent(event: GameEvent, context: GameState): GameState {
  switch (event.type) {
    case 'RESET_GAME':
      return {
        ...context,
        triggerId: event.triggerId,
        name: 'lobby',
        players: context.players.map((p) => ({ ...p, tricks: [], cards: [] })),
        stack: [],
        gamePlayed: null,
        highlightCurrentPlayer: false,
        playerThatStartedRound: context.playerThatStartedRound,
        unavailablePlayers: [],
      }

    case 'UPDATE_PLAYERS_IN_LOBBY':
      return {
        ...context,
        players: sort(sortPlayersById, event.players),
      }

    case 'PLAYER_LEFT_IN_GAME':
      return {
        ...context,
        unavailablePlayers: uniq([...context.unavailablePlayers, event.player]),
      }

    case 'PLAYER_ADDED_IN_GAME':
      return {
        ...context,
        unavailablePlayers: context.unavailablePlayers.filter((p) => p.id !== event.player.id),
      }
    case 'START_BIDDING': {
      return {
        ...context,
        triggerId: event.triggerId,
        name: 'inGame.bidding',
        playerThatStartedRound:
          context.playerThatStartedRound === null
            ? event.triggerId
            : context.playerThatStartedRound,
        players: context.playerThatStartedRound
          ? shiftPlayers(updateCurrentPlayer(context.playerThatStartedRound, event.freshPlayers))
          : updateCurrentPlayer(event.triggerId, event.freshPlayers),
        stack: [],
        gamePlayed: null,
        highlightCurrentPlayer: true,
      }
    }
    case 'PLAY_CARD':
      return {
        ...context,
        triggerId: event.triggerId,
        name: 'inGame.playing',
        stack: [...context.stack, event.card],
        players: (function () {
          const cardPlayedPlayers = removeCardFromHand(context.players, event.card)
          return shiftPlayers(cardPlayedPlayers)
        })(),
        highlightCurrentPlayer: isFourthCardBeyingPlayed(context) ? false : true,
      }
    case 'TAKE_TRICK': {
      return {
        ...context,
        triggerId: event.triggerId,
        name: allCardsPlayed(context) ? 'inGame.evaluation' : 'inGame.playing',
        stack: [],
        players: giveTrickToPlayer(context.players, event.player.id, event.trick),
        highlightCurrentPlayer: true,
      }
    }
    case 'CHOOSE_GAME': {
      const players = updatePlayersWhenChoosingGame(context)

      return {
        ...context,
        triggerId: event.triggerId,
        name: event.gamePlayed ? 'inGame.playing' : 'inGame.bidding',
        gamePlayed: event.gamePlayed,
        players,
      }
    }
    case 'SHARE_STATE':
      return { ...event.gameState, triggerId: event.triggerId }
    default:
      throw new UnreachableCaseError(event)
  }
}

function gameStateReducer(gameState: GameState, action: GameEvent): GameState {
  return gameEvent(action, gameState)
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

function isFourthCardBeyingPlayed(context: GameState): boolean {
  return context.stack.length === 3
}

export function allCardsPlayed(context: GameState): boolean {
  return context.players.every((p) => p.cards?.length === 0)
}

export function isItMyTurn(context: GameState, myId: string): boolean {
  return context.players[0].id === myId
}

function updatePlayersWhenChoosingGame(context: GameState): Player[] {
  if (!context.playerThatStartedRound) {
    throw new Error('Player was already chosen in START_BIDDING')
  }

  // next round -> shift player that started round
  if (context.gamePlayed) {
    return updateCurrentPlayer(context.playerThatStartedRound, context.players)
  } else {
    return shiftPlayers(context.players)
  }
}
