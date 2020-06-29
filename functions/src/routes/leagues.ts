import { Router, Request, Response } from 'express'
import middleware from '../middleware'
import { leagues } from '../persistence'
import { ILeague } from '../types'

const router = Router()

router.get('/', async (_: null, res: Response) => {
  try {
    const allLeagues: ILeague[] = await leagues.fetchAll()

    return res.status(200).json(allLeagues)
  } catch (error) {
    console.error(`GET /leagues >> ${error.stack}`)
    return res.status(500).json({ error: 'An error occured while fetching leagues.' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const league: ILeague = await leagues.fetch(id)

    return res.status(200).json(league)
  } catch (error) {
    console.error(`GET /leagues/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching league: ${id}.` })
  }
})

router.post('/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params
  const { platforms, ...rest } = req.body
  if (!platforms) return res.status(400).json({ error: 'Platforms is a required field.' })

  try {
    const league: ILeague = await leagues.create({ id, platforms, ...rest })

    return res.status(200).json(league)
  } catch (error) {
    console.error(`POST /leagues/${id} ({ platforms: ${platforms}, rest: ${rest} }) >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while creating league: ${id}.` })
  }
})

router.post('/pair', middleware, async (req, res) => {
  const { players } = req.body
  if (!players) return res.status(400).json({ error: 'Players is a required field.' })

  try {
    const pairings = leagues.pair(players)

    return res.status(200).json(pairings)
  } catch (error) {
    console.error(`POST /leagues/pair ({ players: ${players} }) >> ${error.stack}`)
    return res.status(500).json({ error: 'An error occured while pairing league players.' })
  }
})

router.post(`/report/:id`, middleware, async (req, res) => {
  const { id } = req.params
  const { result } = req.body
  if (!result) return res.status(400).json('Result is a required field.')
  if (!result.includes('-')) return res.status(400).json('Result must match the format: wins-losses-ties.')

  try {
    const match = await leagues.report({ id, result })

    return res.status(200).json(match)
  } catch (error) {
    console.error(`POST /leagues/report/${id} ({ result: ${result} }) >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while reporting for league: ${id}.` })
  }
})

router.delete('/:id', middleware, async (req, res) => {
  const { id } = req.params

  try {
    const league = await leagues.delete(id)

    return res.status(200).json(league)
  } catch (error) {
    console.error(`DELETE /leagues/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while deleting league: ${id}.` })
  }
})
