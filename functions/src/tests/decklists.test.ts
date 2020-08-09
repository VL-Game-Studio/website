import request from 'supertest'
import { server } from '../'
import config from '../config'

describe('Decklists', () => {
  const deck = {
    mainboard: '1x\tcavern of Souls\n\n1 Wastes \n58 Island',
    sideboard: '15x Swamp',
  }

  const testDecklist = {
    id: null,
    author: 'Test#1234',
    name: 'Test Deck',
    ...deck,
  }

  it('creates decklist', async () => {
    const res = await request(server)
      .post('/decklists')
      .set('secret', config.secret)
      .send(testDecklist)

    expect(res.statusCode).toEqual(201)
    expect(res.body?.mainboard).toEqual([
      '1 Cavern of Souls',
      '1 Wastes',
      '58 Island',
    ])
    expect(res.body?.sideboard).toEqual([
      '15 Swamp',
    ])
    testDecklist.id = res.body.id
  })

  it('updates decklist', async () => {
    testDecklist.name = 'Test Deck #2'

    const { id, mainboard, sideboard, ...rest } = testDecklist

    const res = await request(server)
      .post(`/decklists/${id}`)
      .set('secret', config.secret)
      .send({ ...rest, ...deck })

    expect(res.statusCode).toEqual(200)
  })

  it('fetches all decklists', async () => {
    const { id } = testDecklist

    const res = await request(server)
      .get('/decklists')

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty(id)
  })

  it('fetches decklist', async () => {
    const { id } = testDecklist

    const res = await request(server)
      .get(`/decklists/${id}`)

    expect(res.statusCode).toEqual(200)
  })

  it('deletes decklist', async () => {
    const { id } = testDecklist

    const res = await request(server)
      .delete(`/decklists/${id}`)
      .set('secret', config.secret)

    expect(res.statusCode).toEqual(200)
  })
})
