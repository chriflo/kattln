import { GameWithIcon } from 'components/bidding'
import { Card } from 'model/card'
import { Player } from 'model/player'
import { Trick } from 'model/trick'

export interface GameContext {
  players: Player[] // players[0] is active player
  stack: Card[]
  gamePlayed: { gameType: GameWithIcon; player: Player } | null
  myId: string
  highlightCurrentPlayer: boolean
  playerThatStartedRound: string | null
  unavailablePlayers: Player[]
}

export interface GameStateSchema {
  initial: 'lobby'
  states: {
    lobby: Record<string, unknown>
    inGame: {
      initial: 'bidding'
      states: {
        bidding: Record<string, unknown>
        playing: Record<string, unknown>
        evaluation: Record<string, unknown>
      }
    }
  }
}

type MainEvents =
  | { type: 'START_BIDDING'; freshPlayers: Player[] }
  | { type: 'START_PLAYING' }
  | { type: 'RESET_GAME' }

type InGameEvents =
  | { type: 'PLAY_CARD'; card: Card }
  | { type: 'TAKE_TRICK'; trick: Trick; player: Player }
  | { type: 'CHOOSE_GAME'; gamePlayed: { gameType: GameWithIcon; player: Player } | null }

type TriggerEvents = { triggerId: string } & (MainEvents | InGameEvents)

type UpdatePlayersEvent =
  | { type: 'UPDATE_PLAYERS'; players: Player[] }
  | { type: 'PLAYER_LEFT'; player: Player }
  | { type: 'PLAYER_ADDED'; player: Player }

export type GameEvent = UpdatePlayersEvent | TriggerEvents
