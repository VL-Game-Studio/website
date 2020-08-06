import request from 'supertest'
import { server } from '../'
import config from '../config'

describe('events', () => {
  const testEvent = {
    id: 1117450800000,
    name: 'Test Event Name',
    description: 'Test event description.',
    time: 1117450800000,
    platform: 'MTGO',
    fired: false,
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
  })

  it('fetches all events', async () => {
    const { id } = testEvent

    const res = await request(server)
      .get('/events')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty(JSON.stringify(id))
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

  it('deletes event', async () => {
    const { id } = testEvent

    const res = await request(server)
      .delete(`/events/${id}`)
      .set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
  })
})
