import { css } from '@emotion/react'
import { colors } from 'styles/global'

type TitleButtonProps = { title?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>

export function RightArrowButton({ title, ...props }: TitleButtonProps) {
  return <IconButton title={title} svgName="right-arrow" {...props} />
}

export function LeftArrowButton({ title, ...props }: TitleButtonProps) {
  return (
    <IconButton
      title={title}
      svgName="right-arrow"
      css={css`
        img {
          transform: rotate(180deg);
        }
      `}
      {...props}
    />
  )
}

export function GameboyButton({ title, ...props }: TitleButtonProps) {
  return <IconButton title={title} svgName="game-boy" {...props} />
}

export function IconButton({ title, svgName, ...props }: { title?: string; svgName: string }) {
  return (
    <button css={styles.button} title={title} {...props}>
      <div css={styles.icon}>
        <img alt="" src={`/${svgName}.svg`} css={{ width: '80%', height: 'auto' }} />
      </div>
      {title ? title : null}
    </button>
  )
}

interface ButtonProps extends React.ComponentProps<'button'> {
  icon?: JSX.Element | string
}
export function Button({ children, icon, ...props }: ButtonProps) {
  if (!icon)
    return (
      <button css={styles.textButton} {...props}>
        {children}
      </button>
    )

  const buttonIcon =
    typeof icon === 'string' ? (
      <img alt="" src={`/${icon}.svg`} css={{ width: '80%', height: 'auto' }} />
    ) : (
      icon
    )

  return (
    <button css={styles.button} {...props}>
      <div css={styles.icon}>{buttonIcon}</div>
      {children}
    </button>
  )
}

const styles = {
  icon: css`
    border: ${colors.green} 3px solid;
    background: ${colors.white};
    width: 50px;
    height: 50px;
    transition: all 500ms;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  `,
  button: css`
    cursor: pointer;
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 3px transparent solid;

    &:disabled {
      opacity: 0.4;
    }

    &:hover:not(:disabled) {
      > * {
        border: 3px ${colors.mint} solid;
      }
    }
  `,
  textButton: css`
    border: 2px transparent solid;
    padding: 4px 10px;
    cursor: pointer;
    background: ${colors.mint};
    color: ${colors.green};
  `,
}
