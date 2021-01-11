import { css } from '@emotion/react'
import { colors } from 'styles/global'

type ButtonProps = { title: string } & React.ButtonHTMLAttributes<HTMLButtonElement>

export function RightArrowButton({ title, ...props }: ButtonProps) {
  return <IconButton title={title} svgName="right-arrow" {...props} />
}

export function LeftArrowButton({ title, ...props }: ButtonProps) {
  return <IconButton title={title} svgName="left-arrow" {...props} />
}

export function GameboyButton({ title, ...props }: ButtonProps) {
  return <IconButton title={title} svgName="game-boy" {...props} />
}

export function IconButton({ title, svgName, ...props }: { title: string; svgName: string }) {
  return (
    <button css={styles.button} title={title} {...props}>
      <div css={styles.icon}>
        <img src={`/${svgName}.svg`} css={{ width: '80%', height: 'auto' }} />
      </div>
      {title}
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

    &:hover {
      border: 3px ${colors.mint} solid;
    }
  `,
  button: css`
    cursor: pointer;
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 3px transparent solid;
  `,
}
