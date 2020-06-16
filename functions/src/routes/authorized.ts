import { Router, Request, Response } from 'express'
import { database } from 'firebase-admin'

const router = Router()

router.use('/:perm/:id', async (req: Request, res: Response) => {
  const { perm, id } = req.params

  try {
    const permGroup = await database()
      .ref(`/admin/${perm}`)
      .once('value')
      .then(snap => snap.val())
      .then(val => Object.values(val))
    const authorized = permGroup.includes(id)
    if (!authorized) return res.status(404).json({ error: `User: ${id} does not have permissions: ${perm}.` })

    return authorized
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: `An error occured while fetching authorization for: ${id}.` })
  }
})

export default router
