const request = require('supertest');
const { server } = require('../');

describe('Environment', () => {
  it('runs without crashing', () => {
    const instance = server.listen(80, () => instance.close());
  });

  it('gets API docs', async () => {
    const res = await request(server)
      .get('/');

    expect(res.status).toBe(200);
  });
});
