const request = require('supertest');
const app = require('.');

describe('Leagues', () => {
  const testLeague = {
    id: '1',
    username: 'TestPlayer',
    platform: 'TESTPLATFORM'
  };

  it('creates league', async () => {
    const { id, ...rest } = testLeague;

    const res = await request(app)
      .post(`/leagues/${id}`)
      .send(rest);

    expect(res.statusCode).toEqual(201);
  });

  it('fetches all leagues', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get('/leagues');

    expect(res.statusCode).toEqual(200);
  });

  it('fetches league', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .get(`/leagues/${id}`);

    expect(res.statusCode).toEqual(200);
  });

  it('gets next pairing', async () => {
    const { id, ...rest } = testLeague;

    await request(app)
      .post(`/leagues/2`)
      .send(rest);

    const res = await request(app)
      .get(`/leagues/queue/${id}`);

    expect(res.statusCode).toEqual(200);
  });

  it('reports league match result', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .post(`/leagues/report/${id}`)
      .send({ result: '2-0-0' });

    expect(res.statusCode).toEqual(200);
  });

  it('deletes league', async () => {
    const { id } = testLeague;

    const res = await request(app)
      .delete(`/leagues/${id}`);

    await request(app)
      .delete('/leagues/2');

    expect(res.statusCode).toEqual(200);
  });
});
