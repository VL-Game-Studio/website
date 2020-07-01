import request from 'supertest'
import { server } from '../'
import config from '../config'

describe('leagues', () => {
  const players = [
    {
      id: '1',
      platforms: ['MTGO', 'Untap'],
    },
    {
      id: '2',
      platforms: ['MTGO', 'xMage'],
    },
    {
      id: '3',
      platforms: ['MTGO', 'Untap'],
    },
    {
      id: '4',
      platforms: ['MTGO', 'Cockatrice'],
    },
    {
      id: '5',
      platforms: ['MTGO', 'Paper'],
    },
    {
      id: '6',
      platforms: ['MTGO', 'xMage'],
    },
  ]

  const [testRegistration] = players

  it('creates league', async () => {
    const { id, ...rest } = testRegistration

    const res = await request(server)
      .post(`/leagues/${id}`)
      .set('secret', config.secret)
      .send(rest)

    expect(res.statusCode).toEqual(200)
  })

  it('fetches all leagues', async () => {
    const { id } = testRegistration

    const res = await request(server).get('/leagues')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty(id)
  })

  it('fetches league', async () => {
    const { id } = testRegistration

    const res = await request(server)
      .get(`/leagues/${id}`)

    expect(res.statusCode).toEqual(200)
  })

  it('generates pairings', async () => {
    const res = await request(server)
      .post('/leagues/pair')
      .set('secret', config.secret)
      .send({ players: players.map(({ id }) => id) })

    expect(res.statusCode).toEqual(200)
  })

  it('reports match result', async () => {
    const res = await request(server)
      .post('/leagues/report/1/2')
      .set('secret', config.secret)
      .send({ result: '2-0-0' })

    expect(res.statusCode).toEqual(200)
  })

  it('deletes league', async () => {
    const [testRegistration, ...rest] = players
    const { id } = testRegistration

    const res = await request(server)
      .delete(`/leagues/${id}`)
      .set('secret', config.secret)

    rest.forEach(async player => {
      await request(server)
        .delete(`/leagues/${player.id}`)
        .set('secret', config.secret)
    })

    expect(res.statusCode).toBe(200)
  })
})
