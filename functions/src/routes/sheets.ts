import { Router, Request, Response } from 'express'
import { events } from '../persistence'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { players = [] } = await events.fetch('1592082000000')

    const table = `<table>${Object.values(players).map(({ id, username, deck: { name } }) => `<tr><td>${id}</td><td>${username}</td><td>${name}</td></tr>`).join('')}</table>`

    return res.send(table)
  } catch (error) {
    console.error(`GET /sheets/events >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching events: ${error.message}.` })
  }
})

export default router
