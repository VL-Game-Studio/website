import request from 'supertest'
import { server } from '../'

describe('Format', () => {
  it('gets format data', async () => {
    const res = await request(server)
      .get('/format')

    expect(res.statusCode).toEqual(200)
  })
})
