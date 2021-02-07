import { css } from '@emotion/react'
import { useMachine } from '@xstate/react'
import { Bidding, GameWithIcon } from 'components/bidding'
import { LeftArrowButton } from 'components/buttons'
import { Evaluation } from 'components/evaluation'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { SinglePlayer } from 'components/single-player'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useSyncronizedRoom } from 'hooks/use-syncronized-room'
import { GameContext, GameEvent, gameMachine, sortPlayers } from 'machines/game-machine'
import { Player } from 'model/player'
import { useRouter } from 'next/router'
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
        me={me}
        context={state.context}
        css={{ marginTop: 20, display: 'flex', width: '100%', justifyContent: 'space-around' }}
      />
      {state.matches('bidding') ? <Bidding context={state.context} me={me} send={send} /> : null}
      {state.matches('playing') ? <Game context={state.context} me={me} send={send} /> : null}
      {state.matches('lobby') ? <Lobby context={state.context} me={me} send={send} /> : null}
      {state.matches('evaluation') ? (
        <Evaluation context={state.context} me={me} send={send} />
      ) : null}
      <SinglePlayer
        css={{ margin: 20 }}
        name={me.name}
        highlighted={
          state.context.highlightCurrentPlayer && me.id === currentPlayerId(state.context.players)
        }
      />
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

function Players({
  context,
  me,
  ...props
}: { context: GameContext; me: Player } & React.ComponentProps<'ul'>) {
  const playersWithoutMe = context.players.filter((p) => p.id !== me.id)
  const playersInCorrectOrder = [
    ...playersWithoutMe.filter((p) => p.id > me.id).sort(sortPlayers),
    ...playersWithoutMe.filter((p) => p.id < me.id).sort(sortPlayers),
  ]

  return (
    <ul {...props}>
      {playersInCorrectOrder.map(({ id, name }) => (
        <SinglePlayer
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
