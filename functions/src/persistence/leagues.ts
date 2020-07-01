import { database } from 'firebase-admin'
import { IPlayer } from '../types'

const leagues = {
  async fetchAll() {
    const allLeagues: IPlayer[] = await database()
      .ref('/leagues')
      .once('value')
      .then(snap => snap.val())

    return allLeagues
  },
  async fetch(id: String) {
    const league: IPlayer = await database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val())

    return league
  },
  async create({ id, platforms, ...props }: IPlayer) {
    const leagueExists: IPlayer = await database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (leagueExists) return false

    const platformPreferences = platforms
      .map(platform => platform?.toUpperCase())
      .filter(Boolean)

    await database()
      .ref(`/leagues/${id}`)
      .set({ id, platforms: platformPreferences, ...props })

    const league = await database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val())

    return league
  },
  async pair(players: IPlayer[]) {
    if (players.length < 6) return false

    const pairings = players.map(player => {
      const opponents = players.filter(opponent => opponent !== player)

      return { player, opponents }
    })

    const updatePlayer = async ({ player, opponents }) => await database()
      .ref(`/leagues/${player}`)
      .update({ opponents })

    pairings.forEach(async pairing => {
      updatePlayer(pairing)

      return pairing
    })

    return pairings
  },
  async report({ id: playerID, opponentID, result }) {
    const player: IPlayer = await database()
      .ref(`/leagues/${playerID}`)
      .once('value')
      .then(snap => snap.val())
    if (!player) return false
    if (!opponentID || opponentID === 'bye') return false

    const round = player.opponents.indexOf(opponentID) + 1
    const [wins = 0, losses = 0, ties = 0] = result.split('-')

    await database()
      .ref(`leagues/${playerID}/matches/${round}`)
      .set({
        round,
        record: `${wins}-${losses}-${ties}`,
        opponent: opponentID
      })

    await database()
      .ref(`leagues/${opponentID}/matches/${round}`)
      .set({
        round,
        record: `${losses}-${wins}-${ties}`,
        opponent: playerID
      })

    const playerReceipt: IPlayer = await database()
      .ref(`/leagues/${playerID}`)
      .once('value')
      .then(snap => snap.val())

    return playerReceipt
  },
  async delete(id: String) {
    const league: IPlayer = await database()
      .ref(`/leagues/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!league) return false

    await database().ref(`/leagues/${id}`).remove()

    return league
  },
}

export default leagues
