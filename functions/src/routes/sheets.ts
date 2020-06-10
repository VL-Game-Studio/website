import { Router, Request, Response } from 'express'
import { events } from '../persistence'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { id, platform, name, players, rounds } = await events.fetch('1590836400000')
    const playerCount = Object.values(players).length

    const props = [id, platform, name, playerCount, rounds]
    const table = `<table><tr>${props.map(prop => `<td>${prop}</td>`).join('')}</tr></table>`

    res.send(table)
  } catch (error) {
    console.error(`GET /sheets/events >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching events: ${error.message}.` })
  }
})

export default router
