import request from 'supertest'
import { server } from '../'
import config from '../config'

describe('Leagues', () => {
  const testLeague = {
    id: '1',
    username: 'TestPlayer',
    platform: 'TESTPLATFORM',
  }

  it('creates league', async () => {
    const { id, ...rest } = testLeague

    const res = await request(server).post(`/leagues/${id}`).set('secret', config.secret).send(rest)

    expect(res.statusCode).toEqual(201)
  })

  it('fetches all leagues', async () => {
    const res = await request(server).get('/leagues')

    expect(res.statusCode).toEqual(200)
  })

  it('fetches league', async () => {
    const { id } = testLeague

    const res = await request(server).get(`/leagues/${id}`)

    expect(res.statusCode).toEqual(200)
  })

  it('gets next pairing', async () => {
    const { id, ...rest } = testLeague

    await request(server).post('/leagues/2').set('secret', config.secret).send(rest)

    const res = await request(server).get(`/leagues/queue/${id}`).set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
  })

  it('reports league match result', async () => {
    const { id } = testLeague

    const res = await request(server).post(`/leagues/report/${id}`).set('secret', config.secret).send({ result: '2-0-0' })

    expect(res.statusCode).toEqual(200)
  })

  it('deletes league', async () => {
    const { id } = testLeague

    const res = await request(server).delete(`/leagues/${id}`).set('secret', config.secret)

    await request(server).delete('/leagues/2').set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
  })
})
