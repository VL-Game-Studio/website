import { Router, Request, Response } from 'express'
import middleware from '../middleware'
import { events } from '../persistence'
import { validateDecklist } from '../utils'

const router = Router()

router.get('/', async (_: null, res: Response) => {
  try {
    const allEvents = await events.fetchAll()

    return res.status(200).json(allEvents)
  } catch (error) {
    console.error(`GET /events >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching events.` })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const activeEvent = await events.fetch(id)
    if (!activeEvent) return res.status(404).json({ error: `An event could not be found for: ${id}.` })

    return res.status(200).json(activeEvent)
  } catch (error) {
    console.error(`GET /events/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching event: ${id}.` })
  }
})

router.post('/', middleware, async (req: Request, res: Response) => {
  const { name, time, ...rest } = req.body
  if (!name) return res.status(400).json({ error: 'Name is a required field.' })
  if (!time) return res.status(400).json({ error: 'Time is a required field.' })

  try {
    const activeEvent = await events.create({ name, time, ...rest })
    if (!activeEvent) return res.status(403).json({ error: 'An event is already scheduled at that time.' })

    return res.status(200).json(activeEvent)
  } catch (error) {
    console.error(`POST /events/ ({ name: ${name}, time: ${time} }) >> ${error.stack}`)
    return res.status(500).json({ error: 'An error occured while creating event.' })
  }
})

router.post('/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const activeEvent = await events.update({ ...req.body, id })
    if (!activeEvent) return res.status(404).json({ error: `An event could not be found for: ${id}.` })

    return res.status(200).json(activeEvent)
  } catch (error) {
    console.error(`POST /events/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while updating event: ${id}.` })
  }
})

router.post('/signup/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params
  const { player, username, mainboard, sideboard, name = '' } = req.body
  if (!player) return res.status(400).json({ error: 'Player is a required field.' })
  if (!mainboard) return res.status(400).json({ error: 'Deck is a required field, passed to mainboard and sideboard.' })

  try {
    const activeEvent = await events.fetch(id)
    if (!activeEvent) return res.status(404).json({ message: `An event could not be found for: ${id}.` })

    const deck = validateDecklist(mainboard, sideboard)
    if (typeof deck !== 'object') return res.status(400).json({ error: deck })
    const playerReceipt = await events.signup({ id, player, username, name, ...deck })

    return res.status(200).json(playerReceipt)
  } catch (error) {
    console.error(
      `POST /events/${id} ({ player: ${player}, username: ${username}, name: ${name}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`
    )
    return res.status(500).json({ error: `An error occured while signing up for event: ${id}.` })
  }
})

router.get('/pairings/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const activeEvent = await events.fetch(id)
    if (!activeEvent) return res.status(404).json({ error: `An event could not be found for: ${id}.` })

    const pairings = await events.pairings(id)
    if (!pairings) return res.status(409).json({ error: 'There are not enough players to generate pairings.' })

    return res.status(200).json(pairings)
  } catch (error) {
    console.error(`POST /events/pairings/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured generating pairings for event: ${id}.` })
  }
})

router.post('/report/:id/:playerID', middleware, async (req: Request, res: Response) => {
  const { id, playerID } = req.params
  const { result } = req.body
  if (!result) return res.status(400).json({ error: 'Result is a required field.' })

  try {
    const activeEvent = await events.report({ id, playerID, result })
    if (!activeEvent) return res.status(400).json({ error: `You are not currently playing in event: ${id}.` })

    return res.status(200).json(activeEvent)
  } catch (error) {
    console.error(`POST /events/report/${id}/${playerID} ({ result: ${result} }) >> ${error.stack}`)
    return res.status(500).json({
      error: `An error occured while processing event result for player: ${playerID} in event: ${id}.`,
    })
  }
})

router.get('/drop/:id/:playerID', middleware, async (req: Request, res: Response) => {
  const { id, playerID } = req.params

  try {
    const activeEvent = await events.drop({ id, playerID })
    if (!activeEvent) return res.status(400).json({ error: `You are not currently playing in event: ${id}.` })

    return res.status(200).json(activeEvent)
  } catch (error) {
    console.error(`GET /events/drop/${id}/${playerID} >> ${error.stack}`)
    return res.status(500).json({
      error: `An error occured while dropping player: ${playerID} in event: ${id}.`,
    })
  }
})

router.post('/fire/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params
  const { channel } = req.body

  try {
    const activeEvent = await events.fire(id, channel)
    if (!activeEvent) return res.status(404).json({ error: `An event could not be found for: ${id}.` })

    return res.status(200).json(activeEvent)
  } catch (error) {
    console.error(`POST /events/fire/${id} ({ channel: ${channel} }) >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while firing event: ${id}.` })
  }
})

router.delete('/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const activeEvent = await events.delete(id)
    if (!activeEvent) return res.status(404).json({ message: `An event could not be found for: ${id}.` })

    return res.status(200).json(activeEvent)
  } catch (error) {
    console.error(`DELETE /events/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while deleting event: ${id}.` })
  }
})

export default router
