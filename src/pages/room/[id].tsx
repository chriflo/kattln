import { css } from '@emotion/react'
import { useMachine } from '@xstate/react'
import { Bidding } from 'components/bidding'
import { LeftArrowButton } from 'components/buttons'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { SinglePlayer } from 'components/single-player'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useSyncronizedRoom } from 'hooks/use-syncronized-room'
import { GameContext, GameEvent, gameMachine } from 'machines/game-machine'
import { Player } from 'model/player'
import { useRouter } from 'next/router'
import React from 'react'
import { fontSet } from 'styles/global'
import { Sender, State } from 'xstate'

export default function Room() {
  const roomId = useRouter().query.id?.toString()
  const [state, send] = useMachine(gameMachine)
  const me = useForceUserName()

  useSyncronizedRoom(state, send, me.id, roomId)

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
  return (
    <>
      <ResetButton send={send} myId={me.id} css={resetButtonStyles} />
      <h1 css={[fontSet.headline, { marginTop: 20 }]}>Runde - {roomId}</h1>
      <Players
        me={me}
        context={state.context}
        css={{ marginTop: 20, display: 'flex', width: '100%', justifyContent: 'space-around' }}
      />
      {state.matches('bidding') ? <Bidding context={state.context} me={me} send={send} /> : null}
      {state.matches('playing') ? <Game context={state.context} me={me} send={send} /> : null}
      {state.matches('lobby') ? <Lobby context={state.context} me={me} send={send} /> : null}
      <SinglePlayer
        css={{ margin: 20 }}
        name={me.name}
        highlighted={me.id === state.context.currentPlayerId}
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
  return (
    <ul {...props}>
      {context.players
        .filter((p) => p.id !== me.id)
        .map(({ id, name }) => (
          <SinglePlayer key={id} name={name} highlighted={id === context.currentPlayerId} />
        ))}
    </ul>
  )
}

const resetButtonStyles = css`
  position: absolute;
  top: 5px;
  left: 10px;
`
