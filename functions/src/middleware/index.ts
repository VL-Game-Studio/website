import { Request, Response, NextFunction } from 'express'
import config from '../config'

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers) {
    return res.status(400).json({ error: 'Authorization is required for this action.' })
  }

  if (req.headers.secret !== config.secret) {
    return res.status(403).json({ error: 'You are not authorized for this action.' })
  }

  return next()
}

export default middleware
