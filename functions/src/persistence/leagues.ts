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
  async fire(players: IPlayer[]) {
    if (players.length < 6) return false

    const pairings = players.map(player => {
      const opponents = players.splice(players.indexOf(player), 1)

      return { player, opponents }
    })

    pairings.forEach(async pairing => {
      const { player, opponents } = pairing

      await database()
        .ref(`/leagues/${player.id}`)
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

    const { opponents = [], matches = [] } = player
    const [wins, losses, ties] = result.split('-')

    const opponentID = Object.values(opponents).length > 0 && Object.values(opponents).pop()
    if (!opponentID) return false

    const playerRound = {
      round: Object.values(matches).length + 1,
      record: `${wins}-${losses}-${ties}`,
      opponent: opponentID,
    }

    await database().ref(`/leagues/${playerID}/matches/${opponents.length}`).set(playerRound)

    if (Object.values(opponents).length === 5) {
      await database().ref(`/leagues/${playerID}`).remove()
    }

    const opponent: IPlayer = await database()
      .ref(`/leagues/${opponentID}`)
      .once('value')
      .then(snap => snap.val())

    const { opponents: oppOpponents, matches: oppMatches = [] } = opponent

    const opponentRound = {
      round: Object.values(oppMatches).length + 1,
      record: `${losses}-${wins}-${ties}`,
      opponent: playerID,
    }

    await database().ref(`/leagues/${opponentID}/matches/${oppOpponents.length}`).set(opponentRound)

    if (Object.values(oppOpponents).length === 5) {
      await database().ref(`/leagues/${opponentID}`).remove()
    }

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
