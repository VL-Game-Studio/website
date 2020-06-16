import { Router, Request, Response } from 'express'
import authorized from './authorized'
import decklists from './decklists'
import events from './events'
import leagues from './leagues'
import ml from './ml'
import sheets from './sheets'

const router = Router()

router.use('/authorized', authorized)
router.use('/decklists', decklists)
router.use('/events', events)
router.use('/leagues', leagues)
router.use('/ml', ml)
router.use('/sheets', sheets)
router.use((req: Request, res: Response) => res.status(404).json({ error: `A method does not exist for ${req.originalUrl}.` }))

export default router
