import { SyncronizedRoomProvider } from 'hooks/syncronized-room-provider'
import { useForceUserName } from 'hooks/use-force-user-name'
import { GameState } from 'machines/machine-model'
import { Player } from 'model/player'
import React from 'react'
import { GameMachine } from '../room/[id]'

export default function Room() {
  const me = useForceUserName()

  const roomId = 'fakeRoomId'
  return (
    <SyncronizedRoomProvider me={me} stateOverride={biddingGameState(me)} roomId={roomId}>
      <GameMachine />
    </SyncronizedRoomProvider>
  )
}

function biddingGameState(me: Player): GameState {
  return {
    lastEvent: 'START_BIDDING',
    name: 'inGame.bidding',
    unavailablePlayers: [],
    players: [
      {
        id: '8trgap8dgyj',
        name: '4',
        cards: [
          { icon: 'blatt', name: '8', id: 'blatt-8', value: 0 },
          { icon: 'schelle', name: '8', id: 'schelle-8', value: 0 },
          { icon: 'eichel', name: '9', id: 'eichel-9', value: 0 },
          { icon: 'schelle', name: 'K', id: 'schelle-K', value: 4 },
          { icon: 'blatt', name: '10', id: 'blatt-10', value: 10 },
          { icon: 'schelle', name: 'A', id: 'schelle-A', value: 11 },
          { icon: 'herz', name: 'U', id: 'herz-U', value: 2 },
          { icon: 'eichel', name: 'O', id: 'eichel-O', value: 3 },
        ],
        tricks: [],
      },
      {
        id: 'aedg94b74v4',
        name: '2',
        cards: [
          { icon: 'schelle', name: '7', id: 'schelle-7', value: 0 },
          { icon: 'blatt', name: 'A', id: 'blatt-A', value: 11 },
          { icon: 'eichel', name: 'A', id: 'eichel-A', value: 11 },
          { icon: 'blatt', name: 'U', id: 'blatt-U', value: 2 },
          { icon: 'herz', name: '10', id: 'herz-10', value: 10 },
          { icon: 'blatt', name: 'K', id: 'blatt-K', value: 4 },
          { icon: 'blatt', name: 'O', id: 'blatt-O', value: 3 },
          { icon: 'herz', name: 'O', id: 'herz-O', value: 3 },
        ],
        tricks: [],
      },
      {
        id: 'mkohcg5r28g',
        name: '3',
        cards: [
          { icon: 'herz', name: 'A', id: 'herz-A', value: 11 },
          { icon: 'eichel', name: '10', id: 'eichel-10', value: 10 },
          { icon: 'blatt', name: '9', id: 'blatt-9', value: 0 },
          { icon: 'eichel', name: 'K', id: 'eichel-K', value: 4 },
          { icon: 'herz', name: 'K', id: 'herz-K', value: 4 },
          { icon: 'schelle', name: '9', id: 'schelle-9', value: 0 },
          { icon: 'eichel', name: '8', id: 'eichel-8', value: 0 },
          { icon: 'herz', name: '9', id: 'herz-9', value: 0 },
        ],
        tricks: [],
      },
      {
        id: me.id,
        name: me.name,
        cards: [
          { icon: 'herz', name: '7', id: 'herz-7', value: 0 },
          { icon: 'blatt', name: '7', id: 'blatt-7', value: 0 },
          { icon: 'eichel', name: '7', id: 'eichel-7', value: 0 },
          { icon: 'herz', name: '8', id: 'herz-8', value: 0 },
          { icon: 'schelle', name: '10', id: 'schelle-10', value: 10 },
          { icon: 'eichel', name: 'U', id: 'eichel-U', value: 2 },
          { icon: 'schelle', name: 'U', id: 'schelle-U', value: 2 },
          { icon: 'schelle', name: 'O', id: 'schelle-O', value: 3 },
        ],
        tricks: [],
      },
    ],
    stack: [],
    gamePlayed: null,
    highlightCurrentPlayer: true,
    playerThatStartedRound: '8trgap8dgyj',
  }
}
