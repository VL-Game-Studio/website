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

    const platformPreferences = {}

    if (platforms) {
      platforms.forEach((platform: string, index: number) => {
        platformPreferences[index] = platform
      })
    }

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

    pairings.forEach(async pairing => {
      const { player, opponents } = pairing

      await database()
        .ref(`/leagues/${player}`)
        .update({ opponents })

      return pairing
    })

    return pairings
  },
  async report({ id: playerID, result }) {
    const player: IPlayer = await database()
      .ref(`/leagues/${playerID}`)
      .once('value')
      .then(snap => snap.val())
    if (!player) return false

    const opponent: IPlayer = await database()
      .ref(`/leagues/${player?.opponents?.pop()}`)
      .once('value')
      .then(snap => snap.val())
    if (!opponent) return false

    const updatePlayer = async (player: IPlayer) => {
      const { matches = [] } = player

      const round = Object.values(matches).length + 1
      const [wins = 0, losses = 0, ties = 0] = result.split('-')

      const match = {
        round,
        record: player === player
          ? `${wins}-${losses}-${ties}`
          : `${losses}-${wins}-${ties}`,
        opponent: player === player
          ? opponent.id
          : player.id,
      }

      await database()
        .ref(`leagues/${player}/matches/${round}`)
        .set(match)
    }

    await updatePlayer(player)
    await updatePlayer(opponent)

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
