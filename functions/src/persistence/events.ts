import { database } from 'firebase-admin'
import { IPlayer } from '../types'

const events = {
  async fetchAll() {
    const allEvents = await database()
      .ref('/events')
      .once('value')
      .then(snap => snap.val())

    return allEvents
  },
  async fetch(id: string) {
    const eventItem = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

    return eventItem
  },
  async create({ time, name, platform, ...rest }) {
    const date = new Date(time)
    time = date.getTime()
    const id = time

    const eventExists = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (eventExists) return false

    await database()
      .ref(`/events/${id}`)
      .set({
        id,
        name,
        time,
        platform: platform ? platform.toUpperCase() : null,
        ...rest,
      })

    const eventItem = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

    return eventItem
  },
  async signup({ id: eventID, player: playerID, username, name, mainboard, sideboard = [] }) {
    const activeEvent = await database()
      .ref(`/events/${eventID}`)
      .once('value')
      .then(snap => snap.val())
    if (!activeEvent) throw new Error(`Event: ${eventID} does not exist.`)
    if (activeEvent.fired) throw new Error(`Event: ${eventID} has already fired.`)

    await database()
      .ref(`/events/${eventID}/players/${playerID}`)
      .set({
        id: playerID,
        username: activeEvent.platform === 'PAPER' ? null : username,
        deck: {
          name,
          mainboard,
          sideboard,
        },
      })

    const playerReceipt = await database()
      .ref(`/events/${eventID}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val())

    return playerReceipt
  },
  async pairings(id: string) {
    const activeEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!activeEvent) throw new Error(`Event: ${id} does not exist.`)

    const { fired, players = [] } = activeEvent
    if (!fired) throw new Error(`Event: ${id} has not fired.`)

    if (Object.values(players).length < 2) return null

    // Calculate players' points
    Object.values(players).map((player: IPlayer) => {
      let wins = 0,
        ties = 0

      if (player.matches) {
        Object.values(player.matches).forEach(({ result }) => {
          const stats = result.split('-')

          wins += parseInt(stats[0])
          ties += parseInt(stats[2])
        })
      }

      return (player.points = (wins === 2 ? 3 : wins === 1 ? 1 : 0) + ties)
    })

    // Remove dropped players and sort by points (descending order)
    const allPlayers: IPlayer[] = Object.values(players)
    const sortedPlayers = allPlayers.filter(({ dropped }) => !dropped).sort((a: any, b: any) => b.points - a.points)

    const pairings = []
    const pairedPlayers = []

    sortedPlayers.forEach((player: IPlayer) => {
      // Set player defaults
      player.matches = player.matches || []
      player.points = player.points || 0
      player.opponents = player.opponents || []

      // Calculate points ceiling
      const maxDiff = (Object.values(player.matches).length + 1) * 3
      const [opponent] = sortedPlayers
        // Remove player from opponent selection
        .filter(({ id }) => id !== player.id)

        // Check if opponent has played before
        .filter(({ opponents = [] }) => !Object.values(opponents).includes(player.id))

        // Check if opponent isn't already paired or playing
        .filter(
          ({ matches = [], opponents = [] }) =>
            Object.values(opponents).length === Object.values(matches).length &&
            Object.values(matches).length === Object.values(player.matches).length
        )

        // Pair within point ceiling
        .filter(({ points = 0 }) => Math.abs(points - player.points) <= maxDiff)

      // Verify players aren't already paired and mark them as paired
      if (!pairedPlayers.includes(player)) {
        sortedPlayers.forEach(async (entry, index) => {
          if (entry === player) {
            pairedPlayers.push(player)
            sortedPlayers[index].opponents.push(opponent ? opponent.id : 'bye')
          } else if (opponent && entry === opponent) {
            pairedPlayers.push(opponent)
            const oppIndex = sortedPlayers.indexOf(opponent)

            if (sortedPlayers[oppIndex].opponents) {
              sortedPlayers[oppIndex].opponents.push(player.id)
            } else {
              sortedPlayers[oppIndex].opponents = [player.id]
            }
          }
        })

        // Generate pairing
        pairings.push({
          player1: player.id,
          player2: opponent ? opponent.id : 'bye',
        })
      }
    })

    const droppedPlayers = allPlayers.filter(({ dropped }) => dropped)
    const updatedPlayers = {}
    sortedPlayers
      .concat(droppedPlayers)
      .map(({ points, ...player }) => player)
      .forEach(player => (updatedPlayers[player.id] = player))

    await database().ref(`/events/${id}`).update({ players: updatedPlayers })

    return pairings
  },
  async report({ id, playerID, result }) {
    const player = await database()
      .ref(`/events/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val())
    if (!player) return false

    const { opponents = [], matches = [] } = player
    const [wins, losses, ties] = result.split('-')

    const opponentID = Object.values(opponents).length > 0 && Object.values(opponents).pop()
    if (!opponentID) throw Error('You are not in an active match.')

    await database()
      .ref(`/events/${id}/players/${playerID}/matches/${opponents.length}`)
      .set({
        round: Object.values(matches).length,
        record: `${wins}-${losses}-${ties}`,
        opponent: opponentID,
      })

    const opponent = await database()
      .ref(`/events/${id}/players/${opponentID}`)
      .once('value')
      .then(snap => snap.val())

    const { opponents: oppOpponents, matches: oppMatches = [] } = opponent

    await database()
      .ref(`/events/${id}/players/${opponentID}/matches/${oppOpponents.length}`)
      .set({
        round: Object.values(oppMatches).length,
        record: `${losses}-${wins}-${ties}`,
        opponent: playerID,
      })

    const activeEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

    return activeEvent
  },
  async fire(id: string, channel: string) {
    const eventExists = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!eventExists) return false

    const playerCount = Object.values(eventExists.players).length
    let rounds: number

    if (playerCount < 5) {
      rounds = 2
    } else if (playerCount < 9) {
      rounds = 4
    } else if (playerCount < 33) {
      rounds = 5
    } else if (playerCount < 65) {
      rounds = 6
    } else if (playerCount < 129) {
      rounds = 7
    } else if (playerCount < 213) {
      rounds = 8
    } else {
      rounds = 9
    }

    await database().ref(`/events/${id}`).update({ channel, rounds, fired: true })

    const activeEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

    return activeEvent
  },
  async drop({ id, playerID }) {
    const playerExists = await database()
      .ref(`/events/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val())
    if (!playerExists) return false

    await database().ref(`/events/${id}/players/${playerID}`).update({ dropped: true })

    const player = await database()
      .ref(`/events/${id}/players/${playerID}`)
      .once('value')
      .then(snap => snap.val())

    return player
  },
  async update({ id, ...props }) {
    const activeEvent = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!activeEvent) return false

    await database().ref(`/events/${id}`).update(props)

    const eventReceipt = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())

    return eventReceipt
  },
  async delete(id: string) {
    const eventItem = await database()
      .ref(`/events/${id}`)
      .once('value')
      .then(snap => snap.val())
    if (!eventItem) return false

    await database().ref(`/events/${id}`).remove()

    return eventItem
  },
}

export default events