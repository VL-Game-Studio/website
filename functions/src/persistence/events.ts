import { database } from '.'
import { IEvent, IPlayer, ISignup, IResult } from '../types'

const events = {
  async fetchAll() {
    const allEvents: IEvent[] = await database
      .fetch('/events')

    return allEvents
  },
  async fetch(id: string) {
    const eventItem: IEvent = await database
      .fetch(`/events/${id}`)

    return eventItem
  },
  async create({
    time,
    name,
    platform,
    ...rest
  }: IEvent) {
    const eventItem: IEvent = await database
      .push('/events', {
        name,
        time: new Date(time).getTime(),
        platform: platform ? platform.toUpperCase() : null,
        ...rest,
      })

    return eventItem
  },
  async signup({
    id,
    player,
    username,
    name,
    mainboard,
    sideboard,
  }: ISignup) {
    const activeEvent: IEvent = await database
      .fetch(`/events/${id}`)
    if (!activeEvent) throw new Error(`Event: ${id} does not exist.`)
    if (activeEvent?.fired) throw new Error(`Event: ${id} has already fired.`)

    const playerReceipt: IPlayer = await database
      .set(`/events/${id}/players/${player}`, {
        id: player,
        username: activeEvent?.platform === 'PAPER' ? null : username,
        deck: {
          name,
          mainboard,
          sideboard,
        },
      })

    const players = await database
      .fetch(`/events/${id}/players`)
      .then(val => val && Object.values(val))

    const playerCount = players?.length
    let rounds: number

    if (playerCount < 3) {
      rounds = 1
    } else if (playerCount < 5) {
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

    await database
      .update(`/events/${id}`, { rounds })

    return playerReceipt
  },
  async pairings(id: string) {
    const activeEvent: IEvent = await database
      .fetch(`/events/${id}`)
    if (!activeEvent) throw new Error(`Event: ${id} does not exist.`)

    const { time, players = [] } = activeEvent
    const fired = new Date().getTime() >= new Date(time).getTime()
    if (!fired) throw new Error(`Event: ${id} cannot fire just yet.`)

    if (Object.values(players).length < 2) return null

    // Calculate players' points
    Object.values(players).map((player: IPlayer) => {
      let wins = 0,
        ties = 0

      if (player.matches) {
        Object.values(player.matches).forEach(({ record }) => {
          const stats = record.split('-')

          wins += parseInt(stats[0])
          ties += parseInt(stats[2])
        })
      }

      return (player.points = (wins === 2 ? 3 : wins === 1 ? 1 : 0) + ties)
    })

    // Remove dropped players and sort by points (descending order)
    const allPlayers: IPlayer[] = Object.values(players)
    const sortedPlayers = allPlayers
      .filter(({ dropped }) => !dropped)
      .sort((a: any, b: any) => b.points - a.points)

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
        .filter(({ opponents = [] }) =>
          !Object.values(opponents).includes(player.id)
        )

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
        sortedPlayers.forEach((entry, index) => {
          if (entry === player) {
            pairedPlayers.push(player)
            sortedPlayers[index].opponents.push(opponent ? opponent.id : 'bye')

            const playerRef = sortedPlayers[index]

            if (!opponent) sortedPlayers[index].matches[(playerRef.matches ? playerRef.matches.length : 0) + 1] = {
              round: (playerRef.matches ? playerRef.matches.length : 0) + 1,
              record: '2-0-0',
              opponent: 'bye',
            }
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

    const round = Math.max.apply(Math, sortedPlayers.map(({ opponents = [] }) => Object.values(opponents).length))

    await database
      .update(`/events/${id}`, { fired: true, players: updatedPlayers, round })

    return pairings
  },
  async report({ id, playerID, result }: IResult) {
    const player: IPlayer = await database
      .fetch(`/events/${id}/players/${playerID}`)
    if (!player) return false

    const { opponents = [] } = player
    const [wins, losses, ties] = result.split('-')

    const opponentID = Object.values(opponents).length > 0 && Object.values(opponents).pop()
    if (!opponentID) throw Error('You are not in an active match.')

    await database
      .set(`/events/${id}/players/${playerID}/matches/${opponents.length}`, {
        round: opponents.length,
        record: `${wins}-${losses}-${ties}`,
        opponent: opponentID,
      })

    const opponent = await database
      .fetch(`/events/${id}/players/${opponentID}`)
    if (opponent) {
      const { opponents: oppOpponents = [] } = opponent

      await database
        .set(`/events/${id}/players/${opponentID}/matches/${oppOpponents.length}`, {
          round: oppOpponents.length,
          record: `${losses}-${wins}-${ties}`,
          opponent: playerID,
        })
    }

    const activeEvent: IEvent = await database
      .fetch(`/events/${id}`)

    return activeEvent
  },
  async drop({ id, playerID }) {
    const playerExists: IPlayer = await database
      .fetch(`/events/${id}/players/${playerID}`)
    if (!playerExists) return false

    const player = await database
      .update(`/events/${id}/players/${playerID}`, { dropped: true })

    return player
  },
  async update(props: any) {
    const { id } = props

    const eventItem: IEvent = await database
      .update(`/events/${id}`, props)

    return eventItem
  },
  async delete(id: string) {
    const eventItem: IEvent = await database
      .delete(`/events/${id}`)

    return eventItem
  },
}

export default events
