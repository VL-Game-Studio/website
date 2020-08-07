import { Router, Response } from 'express'
import { database } from '../persistence'

const router = Router()

router.get('/', async (_: null, res: Response) => {
  try {
    const format = await database
      .fetch('/format')

    return res.status(200).json(format)
  } catch (error) {
    console.error(`GET /format >> ${error.stack}`)
    return res.status(500).json({ error: `An error occured. ${error.message}` })
  }
})

export default router
