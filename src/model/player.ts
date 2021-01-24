import { Card } from './card'

export interface Player {
  name: string
  id: string
  cards?: Card[]
}
