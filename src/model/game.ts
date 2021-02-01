import { allIcons } from './card'

const colors = allIcons.map((icon) => `${icon.charAt(0).toUpperCase()}${icon.slice(1)}`)

const soli = colors.map((color) => `${color} Solo`)
const searchGames = colors.map((color) => `Auf die ${color} Ass`)

export const games = ['Ramsch', 'Wenz', ...soli, ...searchGames]

export const WEITER = 'weiter'
