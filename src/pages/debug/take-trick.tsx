import { SyncronizedRoomProvider } from 'hooks/syncronized-room-provider'
import { GameState } from 'machines/machine-model'
import { Player } from 'model/player'
import React from 'react'
import { GameMachine } from '../room/[id]'

export default function Room() {
  const roomId = 'fakeRoomId'
  const me = fakePlayer

  return (
    <SyncronizedRoomProvider me={me} stateOverride={takeTrickGameState} roomId={roomId}>
      <GameMachine />
    </SyncronizedRoomProvider>
  )
}

const fakePlayer: Player = {
  id: 'dz66jq1a1ll',
  name: 'Horst',
  cards: [
    { icon: 'schelle', name: 'A', id: 'schelle-A', value: 11 },
    { icon: 'eichel', name: '8', id: 'eichel-8', value: 0 },
    { icon: 'blatt', name: 'O', id: 'blatt-O', value: 3 },
    { icon: 'schelle', name: '7', id: 'schelle-7', value: 0 },
    { icon: 'eichel', name: '9', id: 'eichel-9', value: 0 },
    { icon: 'blatt', name: '8', id: 'blatt-8', value: 0 },
    { icon: 'blatt', name: 'U', id: 'blatt-U', value: 2 },
  ],
  tricks: [],
}

const takeTrickGameState: GameState = {
  lastEvent: 'TAKE_TRICK',
  name: 'inGame',
  unavailablePlayers: [],
  players: [
    fakePlayer,
    {
      id: 'm735zfzcpe',
      name: 'Hans',
      cards: [
        { icon: 'blatt', name: 'A', id: 'blatt-A', value: 11 },
        { icon: 'schelle', name: '9', id: 'schelle-9', value: 0 },
        { icon: 'blatt', name: '10', id: 'blatt-10', value: 10 },
        { icon: 'eichel', name: 'K', id: 'eichel-K', value: 4 },
        { icon: 'schelle', name: 'K', id: 'schelle-K', value: 4 },
        { icon: 'eichel', name: '7', id: 'eichel-7', value: 0 },
        { icon: 'herz', name: '10', id: 'herz-10', value: 10 },
      ],
      tricks: [],
    },
    {
      id: 'xjt9y5zect',
      name: 'Heinz',
      cards: [
        { icon: 'herz', name: '8', id: 'herz-8', value: 0 },
        { icon: 'herz', name: '9', id: 'herz-9', value: 0 },
        { icon: 'blatt', name: '9', id: 'blatt-9', value: 0 },
        { icon: 'eichel', name: '10', id: 'eichel-10', value: 10 },
        { icon: 'herz', name: 'A', id: 'herz-A', value: 11 },
        { icon: 'eichel', name: 'U', id: 'eichel-U', value: 2 },
        { icon: 'schelle', name: 'O', id: 'schelle-O', value: 3 },
      ],
      tricks: [],
    },
    {
      id: '1pkseks7moy',
      name: 'Hias',
      cards: [
        { icon: 'herz', name: '7', id: 'herz-7', value: 0 },
        { icon: 'blatt', name: '7', id: 'blatt-7', value: 0 },
        { icon: 'schelle', name: '8', id: 'schelle-8', value: 0 },
        { icon: 'eichel', name: 'A', id: 'eichel-A', value: 11 },
        { icon: 'herz', name: 'U', id: 'herz-U', value: 2 },
        { icon: 'schelle', name: 'U', id: 'schelle-U', value: 2 },
        { icon: 'eichel', name: 'O', id: 'eichel-O', value: 3 },
      ],
      tricks: [],
    },
  ],
  stack: [
    { icon: 'schelle', name: '10', id: 'schelle-10', value: 10 },
    { icon: 'blatt', name: 'K', id: 'blatt-K', value: 4 },
    { icon: 'herz', name: 'O', id: 'herz-O', value: 3 },
    { icon: 'herz', name: 'K', id: 'herz-K', value: 4 },
  ],
  gamePlayed: {
    gameType: { type: 'Sauspiel', icon: 'herz' },
    player: { name: 'Horst', id: 'dz66jq1a1ll' },
  },
  highlightCurrentPlayer: false,
  playerThatStartedRound: 'dz66jq1a1ll',
}
