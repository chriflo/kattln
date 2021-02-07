import { css } from '@emotion/react'
import { useMachine } from '@xstate/react'
import { Bidding } from 'components/bidding'
import { LeftArrowButton } from 'components/buttons'
import { Evaluation } from 'components/evaluation'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { SinglePlayer } from 'components/single-player'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useSyncronizedRoom } from 'hooks/use-syncronized-room'
import { gameMachine } from 'machines/game-machine'
import { GameContext, GameEvent } from 'machines/machine-model'
import { sortPlayersById } from 'machines/players-helper'
import { Player } from 'model/player'
import { useRouter } from 'next/router'
import { sort } from 'ramda'
import React from 'react'
import { fontSet } from 'styles/global'
import { Sender, State } from 'xstate'

export default function Room() {
  const roomId = useRouter().query.id?.toString()
  const me = useForceUserName()

  const [state, send] = useMachine<GameContext, GameEvent>(
    gameMachine.withContext({
      myId: me.id,
      players: [me],
      stack: [],
      gamePlayed: null,
      highlightCurrentPlayer: false,
      playerThatStartedRound: null,
    }),
  )

  useSyncronizedRoom(state, send, roomId)

  if (!roomId) return 'No room no party...'
  return <GameMachine roomId={roomId} send={send} me={me} state={state} />
}
interface GameMachineProps {
  send: Sender<GameEvent>
  me: Player
  state: State<GameContext, GameEvent>
  roomId: string
}

function GameMachine({ roomId, send, me, state }: GameMachineProps) {
  const { gamePlayed } = state.context

  return (
    <>
      <ResetButton send={send} myId={me.id} css={resetButtonStyles} />
      <RoomHeadline
        gamePlayed={gamePlayed}
        roomId={roomId}
        css={[fontSet.headline, { marginTop: 10 }]}
      />
      <Players
        context={state.context}
        css={{
          marginTop: 20,
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around',
          flexShrink: 0,
        }}
      />
      {state.matches('inGame.bidding') ? (
        <Bidding css={{ flexShrink: 0 }} context={state.context} me={me} send={send} />
      ) : null}
      {state.matches('inGame.playing') ? (
        <Game css={{ flexShrink: 0 }} context={state.context} me={me} send={send} />
      ) : null}
      {state.matches('lobby') ? (
        <Lobby css={{ flexShrink: 0 }} context={state.context} me={me} send={send} />
      ) : null}
      {state.matches('inGame.evaluation') ? (
        <Evaluation context={state.context} me={me} send={send} />
      ) : null}
    </>
  )
}

function ResetButton({ send, myId, ...props }: { send: Sender<GameEvent>; myId: string }) {
  return (
    <LeftArrowButton
      onClick={() => {
        const really = confirm('Aktuelles Spiel wirklich beenden und zur Lobby zurückkehren?')
        if (really) send({ type: 'RESET_GAME', triggerId: myId })
      }}
      {...props}
    />
  )
}

function Players({ context, ...props }: { context: GameContext } & React.ComponentProps<'ul'>) {
  const sortedPlayers = sort(sortPlayersById, context.players)

  return (
    <ul {...props}>
      {sortedPlayers.map(({ id, name }) => (
        <SinglePlayer
          itsMe={id === context.myId}
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
  roomId: string
  gamePlayed: GameContext['gamePlayed']
}
function RoomHeadline({ gamePlayed, roomId, ...props }: RoomHeadlineProps) {
  const content = gamePlayed ? whoPlaysWhat(gamePlayed) : `Runde - ${roomId}`

  return (
    <h1 css={fontSet.headline} {...props}>
      {content}
    </h1>
  )
}

function whoPlaysWhat({ gameType, player }: Required<NonNullable<GameContext['gamePlayed']>>) {
  return `${player.name} - ${gameType.type}${gameType?.icon ? ` ${gameType?.icon}` : ''}`
}
