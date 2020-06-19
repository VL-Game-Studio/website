import { Router, Request, Response } from 'express'
import middleware from '../middleware'
import { decklists } from '../persistence'
import { validateDecklist } from '../utils'

const router = Router()

router.get('/', async (_: null, res: Response) => {
  try {
    const allDecklists = await decklists.fetchAll()

    return res.status(200).json(allDecklists)
  } catch (error) {
    console.error(`GET /decklists >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching decklists.` })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const decklist = await decklists.fetch(id)
    if (!decklist) return res.status(404).json({ error: `Decklist: ${id} was not found.` })

    return res.status(200).json(decklist)
  } catch (error) {
    console.error(`GET /decklists/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while fetching decklist: ${id}.` })
  }
})

router.post('/', middleware, async (req: Request, res: Response) => {
  const { author, mainboard, sideboard, ...rest } = req.body
  if (!author) return res.status(400).json({ error: 'Author is a required field.' })
  if (!mainboard) return res.status(400).json({ error: 'Mainboard is a required field.' })

  try {
    const deck = validateDecklist(mainboard, sideboard)
    if (typeof deck !== 'object') return res.status(400).json({ error: deck })
    const decklist = await decklists.create({ author, ...deck, ...rest })

    return res.status(201).json(decklist)
  } catch (error) {
    console.error(`POST /decklists ({ author: ${author}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`)
    return res.status(500).json({ error: 'An error occured while creating decklist.' })
  }
})

router.post('/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params
  const { author, mainboard, sideboard, ...rest } = req.body

  try {
    const deck = validateDecklist(mainboard, sideboard)
    if (typeof deck !== 'object') return res.status(400).json({ error: deck })
    const decklist = await decklists.update({ id, author, ...deck, ...rest })

    return res.status(200).json(decklist)
  } catch (error) {
    console.error(`POST /decklists/${id} ({ author: ${author}, mainboard: ${mainboard}, sideboard: ${sideboard} }) >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while updating decklist: ${id}.` })
  }
})

router.delete('/:id', middleware, async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const decklist = await decklists.delete(id)
    if (!decklist) return res.status(404).json({ message: `Decklist: ${id} was not found.` })

    return res.status(200).json(decklist)
  } catch (error) {
    console.error(`DELETE /decklists/${id} >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured while deleting decklist: ${id}.` })
  }
})

export default router
