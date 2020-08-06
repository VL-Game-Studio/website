import request from 'supertest'
import { server } from '../'

describe('Machine Learning', () => {
  it('gets ml data', async () => {
    const res = await request(server)
      .get('/ml')

    expect(res.statusCode).toEqual(200)
  })
})
