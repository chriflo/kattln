import { css } from '@emotion/react'
import { Bidding } from 'components/bidding'
import { LeftArrowButton } from 'components/buttons'
import { Evaluation } from 'components/evaluation'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { SinglePlayer } from 'components/single-player'
import { Spinner } from 'components/spinner'
import { SyncronizedRoomProvider, useSynchronizedRoom } from 'hooks/syncronized-room-provider'
import { useForceUserName } from 'hooks/use-force-user-name'
import { GameContext } from 'machines/machine-model'
import { sortPlayersById } from 'machines/players-helper'
import { Player } from 'model/player'
import { useRouter } from 'next/router'
import { sort } from 'ramda'
import React from 'react'
import { fontSet } from 'styles/global'

export default function Room() {
  const roomId = useRouter().query.id?.toString()
  const me = useForceUserName()

  if (!roomId) return 'No room no party...'
  return (
    <SyncronizedRoomProvider roomId={roomId} me={me}>
      <GameMachine />
    </SyncronizedRoomProvider>
  )
}

export function GameMachine() {
  const { state } = useSynchronizedRoom()
  const { gamePlayed } = state.context

  const unavailablePlayersInGame = state.context.unavailablePlayers.length > 0

  if (unavailablePlayersInGame) {
    return (
      <>
        <ResetButton css={resetButtonStyles} />
        <p
          css={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Spinner css={{ marginBottom: 20 }} />
          Es sind nicht alle Spieler in der Runde.
          <br />
          Warten auf {state.context.unavailablePlayers.map((p) => p.name).join(', ')}
        </p>
      </>
    )
  }

  return (
    <>
      <ResetButton css={resetButtonStyles} />
      <RoomHeadline gamePlayed={gamePlayed} css={[fontSet.headline, { marginTop: 10 }]} />
      <Players
        css={{
          marginTop: 20,
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around',
          flexShrink: 0,
        }}
      />
      {state.matches('inGame.bidding') ? <Bidding css={{ flexShrink: 0 }} /> : null}
      {state.matches('inGame.playing') ? <Game css={{ flexShrink: 0 }} /> : null}
      {state.matches('lobby') ? <Lobby css={{ flexShrink: 0 }} /> : null}
      {state.matches('inGame.evaluation') ? <Evaluation /> : null}
    </>
  )
}

function ResetButton(props: unknown) {
  const { send, me } = useSynchronizedRoom()

  return (
    <LeftArrowButton
      onClick={() => {
        const really = confirm('Aktuelles Spiel wirklich beenden und zur Lobby zurückkehren?')
        if (really) send({ type: 'RESET_GAME', triggerId: me.id })
      }}
      {...props}
    />
  )
}

function Players(props: React.ComponentProps<'ul'>) {
  const { state } = useSynchronizedRoom()
  const { context } = state
  const sortedPlayers = sort(sortPlayersById, context.players)

  return (
    <ul {...props}>
      {sortedPlayers.map(({ id, name }) => (
        <SinglePlayer
          id={id}
          key={id}
          name={name}
          highlighted={context.highlightCurrentPlayer && id === context.players[0].id}
        />
      ))}
    </ul>
  )
}

const resetButtonStyles = css`
  position: absolute;
  top: 5px;
  left: 10px;
`

export function currentPlayerId(players: Player[]): string | undefined {
  if (players.length < 1) return undefined
  return players[0].id
}

interface RoomHeadlineProps extends React.ComponentProps<'h1'> {
  gamePlayed: GameContext['gamePlayed']
}
function RoomHeadline({ gamePlayed, ...props }: RoomHeadlineProps) {
  const content = gamePlayed ? whoPlaysWhat(gamePlayed) : `Schafkopf`

  return (
    <h1 css={fontSet.headline} {...props}>
      {content}
    </h1>
  )
}

function whoPlaysWhat({ gameType, player }: Required<NonNullable<GameContext['gamePlayed']>>) {
  return `${player.name} spielt ${gameType.type}${gameType?.icon ? ` ${gameType?.icon}` : ''}`
}
