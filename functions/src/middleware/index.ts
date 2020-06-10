import { Request, Response, NextFunction } from 'express'
import config from '../config'

const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const secret = config.secret

  if (!req.headers || req.headers.secret !== secret) {
    return res.status(403).json({ error: 'You are not authorized for this action.' })
  }

  return next()
}

export default middleware
