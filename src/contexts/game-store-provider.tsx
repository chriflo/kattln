import { assign, Machine } from 'xstate'
import { useClientTrigger, useEvent } from '@harelpls/use-pusher'
import { Card } from 'model/card'
import { Player, PlayerInGame } from 'model/player'
import { getPlayersFromMembers } from 'model/pusher-members'
import { PresenceChannel } from 'pusher-js'
import React from 'react'

export interface GameState {
  currentPlayerId: string
  playersInGame: PlayerInGame[]
  stack: Card[]
  order: string[]
  gameStage: 'choose-game' | 'playing'
  gamePlayed?: { gameType: string; player: Player }
}

interface GameStore {
  state: GameState | null
  trigger: (newGameState: GameState) => void
  players: Player[]
}
const GameStoreContext = React.createContext<GameStore | undefined>(undefined)

interface GameStoreProviderProps {
  channel: PresenceChannel | undefined
  game: JSX.Element
  lobby: JSX.Element
}
export function GameStoreProvider({ channel, game, lobby }: GameStoreProviderProps) {
  const [gameState, setGameState] = React.useState<GameState | null>(null)
  const players = getPlayersFromMembers(channel?.members)

  useEvent(channel, 'client-countup', (gameState: GameState) => setGameState(gameState))
  const trigger = useClientTrigger<GameState>(channel)

  function triggerNewGameState(newGameState: GameState) {
    trigger('client-countup', newGameState)
    // client events aren't triggered on the client sending them
    setGameState(newGameState)
  }

  return (
    <GameStoreContext.Provider value={{ state: gameState, trigger: triggerNewGameState, players }}>
      {gameState === null ? lobby : game}
    </GameStoreContext.Provider>
  )
}

export function useGameStore() {
  const context = React.useContext(GameStoreContext)
  if (!context) throw Error('useGameStore must be used within a GameStateProvider')
  return context
}

interface GameStateSchema {
  states: {
    lobby: Record<string, unknown>
    bidding: Record<string, unknown>
    playing: Record<string, unknown>
    evaluation: Record<string, unknown>
  }
}

type GameEvent =
  | {
      type: 'START_BIDDING'
      currentPlayerId: string
      playersInGame: Player[]
      stack: Card[]
      order: string[]
    }
  | { type: 'ADD_PLAYER'; player: PlayerInGame }
  | {
      type: 'START_PLAYING'
    }
  | { type: 'FINISH_GAME' }
  | { type: 'START_AGAIN' }

interface GameContext {
  currentPlayerId?: string
  playersInGame: PlayerInGame[]
  stack: Card[]
  order: string[]
  gamePlayed?: { gameType: string; player: Player }
}

// This machine is completely decoupled from React
export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    strict: true,
    id: 'game',
    context: {
      currentPlayerId: undefined,
      playersInGame: [],
      stack: [],
      order: [],
    },
    initial: 'lobby',
    states: {
      lobby: {
        entry: (context, event) => {
          console.log('ENTRY', { context, event })
        },
        exit: (context, event) => {
          console.log('EXIT', { context, event })
        },
        on: {
          START_BIDDING: {
            target: 'bidding',
            actions: ['initializeGame'],
            cond: fourPlayersInGame,
          },
          ADD_PLAYER: {
            target: 'lobby',
            actions: assign((context: GameContext, event) => {
              return {
                // increment the current count by the event value
                playersInGame: [...context.playersInGame, event.player],
              }
            }),
          },
        },
      },
      bidding: {
        on: { START_PLAYING: 'playing' },
      },
      playing: {
        on: { FINISH_GAME: 'evaluation' },
      },
      evaluation: {
        on: { START_AGAIN: 'bidding' },
      },
    },
  },
  {
    actions: {
      initializeGame: (context, event) => {
        if (event.type === 'START_BIDDING') {
          const { currentPlayerId, order, playersInGame, stack } = event
          assign({ currentPlayerId, order, playersInGame, stack })
        }
      },
      addPlayer: (context, event) => {
        console.log(context)
        console.log(event)
        if (event.type === 'ADD_PLAYER') {
          console.log('add player')

          assign({
            playersInGame: (playersInGameContext: GameContext) => [
              ...playersInGameContext.playersInGame,
              event.player,
            ],
          })
        }
      },
    },
    guards: {
      fourPlayersInGame,
    },
  },
)

function fourPlayersInGame(context: GameContext) {
  return context.playersInGame.length === 4
}
