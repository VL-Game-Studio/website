import { Router, Response } from 'express'
import { events } from '../persistence'
import { IEvent, IPlayer, IMatch } from '../types'

const router = Router()

router.get('/', async (_: null, res: Response) => {
  try {
    const allEvents = await events.fetchAll()
      .then(val => Object.values(val))
      .then(arr => arr.filter(({ closed }) => closed))

    const headers = [
      'Event ID',
      'Name',
      'Description',
      'Platform',
      'Rounds',
      'Players',
      'Player',
      'Decklist',
      'Archetype',
      'Final Record',
      'Opponent',
      'Archetype',
      'Record',
    ].map(h => `<td>${h}</td>`).join('')

    let matchupData = []

    allEvents.forEach((event: IEvent) => {
      const eventData = [
        event.id,
        event.name,
        event.description,
        event.platform,
        event.rounds,
        Object.values(event.players).length,
      ]

      const players: IPlayer[] = Object.values(event.players)

      players.forEach((player: IPlayer, index: number) => {
        let wins = 0, losses = 0, ties = 0

        Object.values(player.matches || []).forEach(match => {
          const [w, l, t] = match.record.split('-').map(n => parseInt(n))

          wins += w === 2 ? 1 : 0
          losses += l === 2 ? 1 : 0
          ties += t === 1 && w === l ? 1 : 0
        })

        const playerData = [
          ...index === 0 ? eventData : eventData.map((_: null) => ' '),
          player.id,
          `${player.deck.mainboard.join(';')}\n${player.deck.sideboard.join(';')}`,
          player.deck?.name || ' ',
          `${wins};${losses};${ties}`,
        ]

        Object.values(player?.matches || []).forEach((match: IMatch, index: number) => {

          const [opponent]: IPlayer[] = players.filter(({ id }) => id === match.opponent)
          const matchData = [
            match.opponent,
            opponent?.deck?.name || ' ',
            match.record.split('-').join(';'),
          ]

          matchupData.push([
            ...index === 0 ? playerData : playerData.map((_: null) => ' '),
            ...matchData
          ])
        })
      })
    })

    const tableData = matchupData
      .map(row => `<tr>${row.map((val: string) => `<td>${val}</td>`).join('')}</tr>`)
      .join('')

    return res.send(`<table><tr>${headers}</tr>${tableData}</table>`)
  } catch (error) {
    console.error(`GET /sheets >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching matchup data: ${error.message}.` })
  }
})

export default router
