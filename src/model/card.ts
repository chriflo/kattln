import shuffle from 'shuffle-array'
export type Icon = 'eichel' | 'blatt' | 'herz' | 'schelle'

type CardType = {
  name: CardName
  value: number
}

export type CardName = 'A' | 'K' | 'O' | 'U' | '10' | '9' | '8' | '7'

export interface Card {
  name: CardName
  icon: Icon
  id: string
  value: number
}

export const allIcons: Icon[] = ['eichel', 'blatt', 'herz', 'schelle']
const allTypes: CardType[] = [
  { name: 'A', value: 11 },
  { name: 'K', value: 4 },
  { name: 'O', value: 3 },
  { name: 'U', value: 2 },
  { name: '10', value: 10 },
  { name: '9', value: 0 },
  { name: '8', value: 0 },
  { name: '7', value: 0 },
]

export const allCards: Card[] = allIcons.slice(0, 1).flatMap((icon) => {
  return allTypes.map((cardType) => ({
    icon,
    name: cardType.name,
    id: generateId(cardType.name, icon),
    value: cardType.value,
  }))
})

export function shuffleCards(): Card[] {
  return shuffle(allCards)
}

export function generateId(name: CardName, icon: Icon): string {
  return `${icon}-${name}`
}

export const normalSortOrder: Array<CardName> = ['O', 'U', 'A', '10', 'K', '9', '8', '7']
export function normalSortCards(c1: Card, c2: Card): 0 | 1 | -1 {
  const indexC1 = normalSortOrder.indexOf(c1.name)
  const indexC2 = normalSortOrder.indexOf(c2.name)

  if (indexC2 > indexC1) return 1
  if (indexC1 > indexC2) return -1
  return 0
}
