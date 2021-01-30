import { useMachine } from '@xstate/react'
import { Bidding } from 'components/bidding'
import { LeftArrowButton } from 'components/buttons'
import { Game } from 'components/game'
import { Lobby } from 'components/lobby'
import { useForceUserName } from 'hooks/use-force-user-name'
import { useSyncronizedRoom } from 'hooks/use-syncronized-room'
import { GameContext, GameEvent, gameMachine } from 'machines/game-machine'
import { Player } from 'model/player'
import { useRouter } from 'next/router'
import React from 'react'
import { colors } from 'styles/global'
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
      {state.matches('bidding') ? <Bidding context={state.context} me={me} send={send} /> : null}
      {state.matches('playing') ? <Game context={state.context} me={me} send={send} /> : null}
      {state.matches('lobby') ? (
        <Lobby context={state.context} me={me} roomId={roomId} send={send} />
      ) : null}
      {state.context.currentPlayerId === me.id ? <ItIsMyTurn /> : null}
      <div
        css={{
          padding: 10,
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          background: colors.mint,
        }}
      >
        <ResetButton send={send} myId={me.id} css={{ justifySelf: 'flex-start' }} />
      </div>
    </>
  )
}

function ResetButton({ send, myId }: { send: Sender<GameEvent>; myId: string }) {
  return (
    <LeftArrowButton
      title="Verlassen"
      onClick={() => {
        const really = confirm('Aktuelles Spiel wirklich beenden und zur Lobby zurückkehren?')
        if (really) send({ type: 'RESET_GAME', triggerId: myId })
      }}
    />
  )
}

function ItIsMyTurn() {
  return (
    <p
      css={{
        width: '100%',
        fontSize: 30,
        textAlign: 'center',
        background: 'papayawhip',
        position: 'absolute',
        bottom: 0,
        padding: 10,
      }}
    >
      {`Du bist dran :)`}
    </p>
  )
}
