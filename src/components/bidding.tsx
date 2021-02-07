import { GameContext, GameEvent, isItMyTurn } from 'machines/game-machine'
import { allIcons, Icon } from 'model/card'
import { PlayableGame, playableGames } from 'model/game'
import { Player } from 'model/player'
import React from 'react'
import { colors } from 'styles/global'
import { Sender } from 'xstate'
import { Button } from './buttons'
import { CardIcon } from './card-icons'
import { Hand } from './hand'

interface BiddingProps {
  me: Player
  context: GameContext
  send: Sender<GameEvent>
}

export function Bidding({ me, context, send }: BiddingProps) {
  const { players } = context

  function updateGameType(game: GameWithIcon | null) {
    if (!isItMyTurn(context)) return

    const gamePlayed = !game ? null : { gameType: game, player: me }
    send({ type: 'CHOOSE_GAME', gamePlayed, triggerId: me.id })
  }

  return (
    <>
      <GameChooser
        isItMyTurn={isItMyTurn(context)}
        onChooseGame={(game) => updateGameType(game)}
        css={{ flexGrow: 1 }}
      />
      <Hand players={players} currentPlayer={me} onClickCard={null} />
    </>
  )
}

interface GameChooserProps extends React.ComponentProps<'div'> {
  isItMyTurn: boolean
  onChooseGame: (game: GameWithIcon | null) => void
}

export type GameWithIcon = { type: PlayableGame; icon: Icon | null }

function GameChooser({ onChooseGame, isItMyTurn, ...props }: GameChooserProps) {
  const [game, setGame] = React.useState<GameWithIcon | null>(null)

  function confirmGame({ type, icon }: GameWithIcon) {
    if (type === 'Wenz') {
      const confirmed = confirm(`Willst du wirklich einen Wenz spielen?`)
      confirmed ? onChooseGame({ type, icon }) : setGame(null)
    }

    if (type === 'Sauspiel' && icon) {
      const confirmed = confirm(`Willst du wirklich ein Sauspiel auf ${icon} spielen?`)
      confirmed ? onChooseGame({ type, icon }) : setGame(null)
    }

    if (type === 'Solo' && icon) {
      const confirmed = confirm(`Willst du wirklich ein ${icon}-Solo spielen?`)
      confirmed ? onChooseGame({ type, icon }) : setGame(null)
    }
  }

  React.useEffect(() => {
    if (game?.type === 'Wenz') return confirmGame({ type: 'Wenz', icon: null })
    if (game?.type && game?.icon) return confirmGame(game)
  })

  return (
    <div
      css={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: 300,
      }}
      {...props}
    >
      <ul css={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {playableGames.map((playableGame) => (
          <li key={playableGame}>
            <Button
              css={game?.type === playableGame && { background: colors.green, color: colors.mint }}
              disabled={!isItMyTurn}
              onClick={() => setGame({ type: playableGame, icon: null })}
            >
              {playableGame}
            </Button>
          </li>
        ))}
      </ul>
      <div css={{ display: 'flex', marginTop: 10 }}>
        {allIcons.map((icon) => (
          <Button
            css={game?.icon === icon && { background: colors.green, color: colors.mint }}
            disabled={!Boolean(game?.type)}
            key={icon}
            icon={<CardIcon icon={icon} css={{ height: 24 }} />}
            onClick={() => setGame((prev) => (prev?.type ? { type: prev.type, icon: icon } : prev))}
          >
            {icon}
          </Button>
        ))}
      </div>
      <Button
        css={{ marginTop: 10 }}
        disabled={!isItMyTurn}
        onClick={() => {
          setGame(null)
          onChooseGame(null)
        }}
      >
        Weiter
      </Button>
    </div>
  )
}
