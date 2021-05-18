import { GameWithIcon } from 'components/bidding'
import { GameEvent } from 'machines/game-state-reducer'
import { Card } from 'model/card'
import { Player } from 'model/player'

export interface GameState {
  lastEvent: GameEvent['type'] | null
  name: 'inGame.evaluation' | 'lobby' | 'inGame' | 'inGame.playing' | 'inGame.bidding'
  triggerId?: string
  players: Player[] // players[0] is active player
  stack: Card[]
  gamePlayed: { gameType: GameWithIcon; player: Player } | null
  highlightCurrentPlayer: boolean
  playerThatStartedRound: string | null
  unavailablePlayers: Player[]
}
