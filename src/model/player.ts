import { Card } from './card'

export interface Player {
  name: string
  id: string
}
export interface PlayerInGame extends Player {
  cards: Card[]
}
