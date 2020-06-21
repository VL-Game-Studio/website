import { Router, Response } from 'express'
import { events } from '../persistence'

const router = Router()

router.get('/', async (_: null, res: Response) => {
  try {
    const decks = Object.values(await events.fetchAll())
      .filter(({ players }) => players && players.deck)
      .map(({ players }) => players.deck)

    const decklists = decks.map(({ mainboard, sideboard = [] }) => {
      const quantities = []
      const cards = []

      mainboard.concat(sideboard).forEach((str: string) => {
        const [quantity, card] = str.split(/ (.*)/)

        quantities.push(parseInt(quantity))
        cards.push(card)
      })

      return { quantities, cards }
    })

    return res.status(200).json(decklists)
  } catch (error) {
    console.error(`GET /ml >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured. ${error.message}` })
  }
})

export default router
