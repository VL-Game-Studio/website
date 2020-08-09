import request from 'supertest'
import { server } from '../'
import config from '../config'

describe('events', () => {
  const testEvent = {
    id: null,
    name: 'Test Event Name',
    description: 'Test event description.',
    time: new Date().getTime(),
    platform: 'MTGO',
    players: [
      {
        id: '1',
        player: '1',
        username: 'Test#1',
        deck: 'testDeck',
      },
      {
        id: '2',
        player: '2',
        username: 'Test#2',
        deck: 'testDeck',
      },
      {
        id: '3',
        player: '3',
        username: 'Test#3',
        deck: 'testDeck',
      },
      {
        id: '4',
        player: '4',
        username: 'Test#4',
        deck: 'testDeck',
      },
      {
        id: '5',
        player: '5',
        username: 'Test#5',
        deck: 'testDeck',
      },
    ],
  }

  const testRegistration = {
    player: 6,
    username: 'Test#6',
    mainboard: '60 Island',
  }

  it('creates event', async () => {
    const res = await request(server)
      .post('/events')
      .set('secret', config.secret)
      .send(testEvent)

    expect(res.statusCode).toEqual(200)
    expect(res.body?.id).toBeDefined()
    testEvent.id = res.body?.id
  })

  it('fetches all events', async () => {
    const { id } = testEvent

    const res = await request(server)
      .get('/events')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty(id)
  })

  it('fetches event', async () => {
    const { id } = testEvent

    const res = await request(server)
      .get(`/events/${id}`)

    expect(res.statusCode).toEqual(200)
  })

  it('signs up for event', async () => {
    const { id } = testEvent

    const res = await request(server)
      .post(`/events/signup/${id}`)
      .set('secret', config.secret)
      .send(testRegistration)

    expect(res.statusCode).toEqual(200)
  })

  it('drops player from event', async () => {
    const { id } = testEvent

    const res = await request(server)
      .get(`/events/drop/${id}/6`)
      .set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
    expect(res.body.dropped).toEqual(true)
  })

  it('generates pairings', async () => {
    const { id } = testEvent

    const res = await request(server)
      .get(`/events/pairings/${id}`)
      .set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual([
      { player1: '1', player2: '2' },
      { player1: '3', player2: '4' },
      { player1: '5', player2: 'bye' },
    ])
  })

  it('reports match result', async () => {
    const { id } = testEvent
    const playerID = 1

    const res = await request(server)
      .post(`/events/report/${id}/${playerID}`)
      .set('secret', config.secret)
      .send({ result: '2-0-0' })

    expect(res.statusCode).toEqual(200)

    const opponentID = res.body.players[playerID].opponents.pop()
    expect(res.body.players[playerID].matches['1'].record).toEqual('2-0-0')
    expect(res.body.players[opponentID].matches['1'].record).toEqual('0-2-0')
  })

  it('deletes event', async () => {
    const { id } = testEvent

    const res = await request(server)
      .delete(`/events/${id}`)
      .set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
  })
})
