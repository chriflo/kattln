import { Player } from 'model/player'

export function updateCurrentPlayer(id: string, players: Player[]): Player[] {
  if (players.length < 1) return []
  if (players[0].id === id) return players
  return updateCurrentPlayer(id, shiftPlayers(players))
}

export function shiftPlayers(players: Player[]): Player[] {
  if (players.length > 0) {
    const firstPlayer = players[0]
    return [...players.slice(1), firstPlayer]
  }
  return []
}

export function sortPlayersById(p1: Player, p2: Player): number {
  return p1.id > p2.id ? 1 : -1
}
