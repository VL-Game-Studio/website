import fetch from 'node-fetch'
import middleware from '../middleware'
import { Router, Request, Response } from 'express'
import config from '../config'

const router = Router()

router.post('/', middleware, async (req: Request, res: Response) => {
  try {
    const { access_token } = req.body

    const response = await fetch('https://discord.com/api/users/@me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      },
    });
    if (response.status !== 200) throw new Error(JSON.stringify(response))

    const user = await response.json()

    const response2 = await fetch(`https://discord.com/api/guilds/${config.guild}/members/${user?.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${config.token}`
      }
    })
    const roles = response2.status === 200
      ? await response2.json().then(({ roles }) => roles)
      : null

    if (response2.status !== 200) {
      await fetch(`https://discord.com/api/guilds/${config.guild}/members/${user?.id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bot ${config.token}`
        },
        body: JSON.stringify({ access_token })
      })
    }

    return res.status(200).json({ ...user, roles })
  } catch (error) {
    console.error(`GET /auth >> ${error.stack}`)
    return res.status(500).json({ error: 'An error occured with authenticating with Discord.' })
  }
})

export default router
