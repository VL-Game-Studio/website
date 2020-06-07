const request = require('supertest');
const { server } = require('../');

describe('Sheets', () => {
  it('gets sample sheet', async () => {
    const res = await request(server)
      .get('/sheets');

    expect(res.statusCode).toEqual(200);
  });
});
