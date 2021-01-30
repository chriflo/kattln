import { Card } from './card'
import { Trick } from './trick'

export interface Player {
  name: string
  id: string
  cards?: Card[]
  tricks?: Trick[]
}
