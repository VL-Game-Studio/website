import { Router, Request, Response } from 'express'
import auth from './auth'
import decklists from './decklists'
import events from './events'
import format from './format'
import ml from './ml'
import sheets from './sheets'

const router = Router()

router.use('/auth', auth)
router.use('/decklists', decklists)
router.use('/events', events)
router.use('/format', format)
router.use('/ml', ml)
router.use('/sheets', sheets)
router.use((req: Request, res: Response) => res.status(404).json({ error: `A method does not exist for ${req.originalUrl}.` }))

export default router
