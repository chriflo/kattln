import shuffle from 'shuffle-array'
export type Icon = 'eichel' | 'blatt' | 'herz' | 'schelle'
export type CardName = 'A' | 'K' | 'O' | 'U' | '10' | '9' | '8' | '7'

export interface Card {
  name: CardName
  icon: Icon
}

const allIcons: Icon[] = ['eichel', 'blatt', 'herz', 'schelle']
const allNames: CardName[] = ['A', 'K', 'O', 'U', '10', '9', '8', '7']

const allCards: Card[] = allIcons.flatMap((icon) => {
  return allNames.map((name) => ({ icon, name }))
})

export function shuffleCards(): Card[] {
  return shuffle(allCards)
}
